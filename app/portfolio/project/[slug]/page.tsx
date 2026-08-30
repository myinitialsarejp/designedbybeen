import { PortableText } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/lib/sanity/live";
import { urlForImage } from "@/lib/sanity/image";
import { PROJECT_QUERY } from "@/lib/sanity/queries";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: project } = await sanityFetch({
    query: PROJECT_QUERY,
    params: { slug },
  });

  if (!project) return notFound();

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-wide text-foreground-muted">
        {project.category}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {project.title}
      </h1>
      {project.summary && (
        <p className="mt-4 text-base leading-7 text-foreground-muted sm:text-lg">
          {project.summary}
        </p>
      )}
      {project.coverImage && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg">
          <Image
            src={urlForImage(project.coverImage).width(1200).height(675).url()}
            alt={project.title ?? ""}
            fill
            className="object-cover"
          />
        </div>
      )}
      {Array.isArray(project.body) && project.body.length > 0 && (
        <div className="prose prose-neutral mt-10 max-w-none">
          <PortableText value={project.body} />
        </div>
      )}
    </article>
  );
}
