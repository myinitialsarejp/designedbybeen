import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";
import { ProjectGrid } from "@/components/project-grid";
import { sanityFetch } from "@/lib/sanity/live";
import { PROJECTS_BY_CATEGORY_QUERY } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Academic Work",
  description: "Academic design work.",
};

export default async function AcademicPage() {
  const { data: projects } = await sanityFetch({
    query: PROJECTS_BY_CATEGORY_QUERY,
    params: { category: "academic" },
    tags: ["project", "project-category:academic"],
    stega: false,
  });

  return (
    <PagePlaceholder
      eyebrow="Portfolio"
      title="Academic Work"
      description="Academic design projects."
    >
      <ProjectGrid projects={projects} />
    </PagePlaceholder>
  );
}
