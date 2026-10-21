import type { Metadata } from "next";

import { ArtworkCarousel } from "@/components/artwork-carousel";
import { client } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { ARTWORK_QUERY } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Artwork",
  description: "Original artwork.",
};

export default async function ArtworkPage() {
  const artwork = await client
    .withConfig({ perspective: "published", useCdn: false })
    .fetch(ARTWORK_QUERY, {}, { next: { tags: ["artwork"] } });

  const artworkWithUrls = artwork.flatMap((item) => {
    if (!item.image?.asset) return [];

    return [{
      id: item._id,
      caption: item.image.caption,
      alt: item.image.alt,
      height: item.height,
      width: item.width,
      imageUrl: urlForImage(item.image).width(1600).url(),
      lightboxImageUrl: urlForImage(item.image).width(2400).url(),
    }];
  });

  return <ArtworkCarousel artwork={artworkWithUrls} />;
}
