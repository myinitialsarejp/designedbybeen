import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

type ProjectCategory = "residential" | "commercial" | "academic";

type SanityWebhookPayload = {
  _type?: "project" | "journal" | "siteSettings";
  slug?: string;
  category?: ProjectCategory;
};

const projectCategoryTags: readonly `project-category:${ProjectCategory}`[] = [
  "project-category:residential",
  "project-category:commercial",
  "project-category:academic",
];

function getTags(payload: SanityWebhookPayload) {
  switch (payload._type) {
    case "siteSettings":
      return ["site-settings"];
    case "journal":
      return [
        "journal",
        ...(payload.slug ? [`journal:${payload.slug}`] : []),
      ];
    case "project":
      // Refresh every category so moves and deletions cannot leave stale grid entries.
      return [
        "project",
        ...projectCategoryTags,
        ...(payload.slug ? [`project:${payload.slug}`] : []),
      ];
    default:
      return [];
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Revalidation is not configured." },
      { status: 500 },
    );
  }

  try {
    const { body, isValidSignature } = await parseBody<SanityWebhookPayload>(
      request,
      secret,
      true,
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const tags = body ? getTags(body) : [];

    if (tags.length === 0) {
      return NextResponse.json(
        { error: "Unsupported or malformed webhook payload." },
        { status: 400 },
      );
    }

    for (const tag of tags) {
      revalidateTag(tag, "max");
    }

    return NextResponse.json({ revalidated: tags });
  } catch {
    return NextResponse.json(
      { error: "Unable to process revalidation webhook." },
      { status: 500 },
    );
  }
}