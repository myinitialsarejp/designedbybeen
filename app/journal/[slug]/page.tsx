import { PortableText } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/lib/sanity/live";
import { urlForImage } from "@/lib/sanity/image";
import { JOURNAL_POST_QUERY } from "@/lib/sanity/queries";

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: JOURNAL_POST_QUERY,
    params: { slug },
    tags: ["journal", `journal:${slug}`],
    stega: false,
  });

  if (!post) return notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {post.title}
      </h1>
      {post.coverImage && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg">
          <Image
            src={urlForImage(post.coverImage).width(1000).height(563).url()}
            alt={post.title ?? ""}
            fill
            className="object-cover"
          />
        </div>
      )}
      {Array.isArray(post.body) && post.body.length > 0 && (
        <div className="prose prose-neutral mt-10 max-w-none">
          <PortableText value={post.body} />
        </div>
      )}
    </article>
  );
}
