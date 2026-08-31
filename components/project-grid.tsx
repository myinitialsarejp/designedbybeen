import Link from "next/link";
import Image from "next/image";

import { urlForImage } from "@/lib/sanity/image";
import type { PROJECTS_BY_CATEGORY_QUERY_RESULT } from "@/sanity.types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export function ProjectGrid({
  projects,
}: {
  projects: PROJECTS_BY_CATEGORY_QUERY_RESULT;
}) {
  if (projects.length === 0) {
    return (
      <p className="mt-10 text-base leading-7 text-foreground-muted">
        No projects yet. Check back soon.
      </p>
    );
  }

  return (
    <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project._id}>
          <Card className="h-full gap-0 overflow-hidden rounded-lg py-0 transition-colors hover:border-foreground/30">
            <Link
              href={`/portfolio/project/${project.slug?.current}`}
              className="group flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              {project.coverImage && (
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={urlForImage(project.coverImage).width(600).height(450).url()}
                    alt={project.title ?? ""}
                    fill
                    sizes="(min-width: 1024px) 29vw, (min-width: 640px) 44vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <CardTitle className="text-lg text-foreground">
                  {project.title}
                </CardTitle>
                {project.summary && (
                  <p className="mt-1 text-sm text-foreground-muted">
                    {project.summary}
                  </p>
                )}
              </CardContent>
            </Link>
          </Card>
        </li>
      ))}
    </ul>
  );
}
