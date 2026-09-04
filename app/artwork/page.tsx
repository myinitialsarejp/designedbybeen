import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";
import { sanityFetch } from "@/lib/sanity/live";
import { ARTWORK_QUERY } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Artwork",
  description: "Original artwork.",
};

export default async function ArtworkPage() {
  await sanityFetch({
    query: ARTWORK_QUERY,
    tags: ["artwork"],
    stega: false,
  });

  return (
    <PagePlaceholder
      title="Artwork"
      description="A collection of original artwork will live here."
    />
  );
}
