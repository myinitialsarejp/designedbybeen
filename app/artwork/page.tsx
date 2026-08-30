import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Artwork",
  description: "Original artwork.",
};

export default function ArtworkPage() {
  return (
    <PagePlaceholder
      title="Artwork"
      description="A collection of original artwork will live here."
    />
  );
}
