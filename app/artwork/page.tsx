import type { Metadata } from "next";

import { ArtworkCarousel } from "@/components/artwork-carousel";
import { sanityFetch } from "@/lib/sanity/live";
import { ARTWORK_QUERY } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Artwork",
  description: "Original artwork.",
};

export default async function ArtworkPage() {
  const { data: artwork } = await sanityFetch({
    query: ARTWORK_QUERY,
    tags: ["artwork"],
    stega: false,
  });

  return <ArtworkCarousel artwork={artwork} />;
}
