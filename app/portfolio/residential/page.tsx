import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Residential",
  description: "Residential design work.",
};

export default function ResidentialPage() {
  return (
    <PagePlaceholder
      eyebrow="Portfolio"
      title="Residential"
      description="Residential design projects will be showcased here."
    />
  );
}
