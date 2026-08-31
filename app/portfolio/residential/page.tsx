import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";
import { ProjectGrid } from "@/components/project-grid";
import { sanityFetch } from "@/lib/sanity/live";
import { PROJECTS_BY_CATEGORY_QUERY } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Residential",
  description: "Residential design work.",
};

export default async function ResidentialPage() {
  const { data: projects } = await sanityFetch({
    query: PROJECTS_BY_CATEGORY_QUERY,
    params: { category: "residential" },
    tags: ["project", "project-category:residential"],
    stega: false,
  });

  return (
    <PagePlaceholder
      eyebrow="Portfolio"
      title="Residential"
      description="Residential design projects."
    >
      <ProjectGrid projects={projects} />
    </PagePlaceholder>
  );
}
