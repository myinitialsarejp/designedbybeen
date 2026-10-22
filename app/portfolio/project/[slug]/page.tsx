import Image from "next/image";
import { notFound } from "next/navigation";

import { ProjectVideo } from "@/components/project-video";
import {
  ProjectPicksCarousel,
  type ProjectPickPreview,
} from "@/components/project-picks-carousel";
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
    tags: ["project", `project:${slug}`],
    stega: false,
  });

  if (!project) return notFound();

  const videoPosterImage = project.coverImage?.asset
    ? project.coverImage
    : project.gallery?.find((image) => image.asset);
  const videoPosterUrl = videoPosterImage
    ? urlForImage(videoPosterImage).width(800).height(450).url()
    : undefined;

  const associatedPicks: ProjectPickPreview[] = (project.picks ?? []).flatMap(
    (pick) => {
      if (!pick.title || !pick.link || !pick.image?.asset) return [];

      const width = Math.min(pick.width && pick.width > 0 ? pick.width : 800, 1600);

      return [
        {
          _id: pick._id,
          title: pick.title,
          link: pick.link,
          imageUrl: urlForImage(pick.image).width(width).url(),
          width: pick.width,
          height: pick.height,
        },
      ];
    },
  );

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="font-mono text-sm font-medium uppercase tracking-caption text-foreground-muted">
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
      {(project.location || project.architect || project.designer) && (
        <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
          {project.location && (
            <div>
              <dt className="text-sm font-medium uppercase tracking-wide text-foreground-muted">
                Location
              </dt>
              <dd className="mt-1 text-base text-foreground">{project.location}</dd>
            </div>
          )}
          {project.architect && (
            <div>
              <dt className="text-sm font-medium uppercase tracking-wide text-foreground-muted">
                Architect
              </dt>
              <dd className="mt-1 text-base text-foreground">{project.architect}</dd>
            </div>
          )}
          {project.designer && (
            <div>
              <dt className="text-sm font-medium uppercase tracking-wide text-foreground-muted">
                Designer
              </dt>
              <dd className="mt-1 text-base text-foreground">{project.designer}</dd>
            </div>
          )}
        </dl>
      )}
      {project.coverImage?.asset && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg">
          <Image
            src={urlForImage(project.coverImage).width(1200).height(675).url()}
            alt={project.title ?? ""}
            fill
            className="object-cover"
          />
        </div>
      )}
      {Array.isArray(project.videos) && project.videos.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {project.videos.map((video, index) =>
            video.url ? (
              <figure key={video.url ?? index}>
                <ProjectVideo
                  src={video.url}
                  posterUrl={videoPosterUrl}
                  label={video.caption || `${project.title || "Project"} video ${index + 1}`}
                />
                {video.caption && (
                  <figcaption className="mt-2 text-sm text-foreground-muted">
                    {video.caption}
                  </figcaption>
                )}
              </figure>
            ) : null
          )}
        </div>
      )}
      {Array.isArray(project.gallery) && project.gallery.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {project.gallery.map((image) => {
            if (!image.asset) return null;

            return (
              <figure key={image._key} className="relative">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    src={urlForImage(image).width(800).height(600).url()}
                    alt={image.alt ?? project.title ?? ""}
                    fill
                    className="object-cover"
                  />
                  {image.isCover && (
                    <span className="absolute left-2 top-2 rounded bg-surface/90 px-2 py-1 text-xs font-medium uppercase tracking-wide text-foreground">
                      Cover
                    </span>
                  )}
                </div>
                {image.caption && (
                  <figcaption className="mt-2 text-sm text-foreground-muted">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      )}
      {associatedPicks.length > 0 && (
        <ProjectPicksCarousel picks={associatedPicks} />
      )}
    </article>
  );
}
