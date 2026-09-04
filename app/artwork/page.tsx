import type { Metadata } from "next";

import { ArtworkCarousel } from "@/components/artwork-carousel";
import { urlForImage } from "@/lib/sanity/image";
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

  const artworkWithUrls = artwork.flatMap((item) => {
    if (!item.image?.asset) return [];

    return [{
      id: item._id,
      caption: item.image.caption,
      alt: item.image.alt,
      imageUrl: urlForImage(item.image).width(2400).url(),
    }];
  });

  return <ArtworkCarousel artwork={artworkWithUrls} />;
}
