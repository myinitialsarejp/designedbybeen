import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Commercial",
  description: "Commercial design work.",
};

export default function CommercialPage() {
  return (
    <PagePlaceholder
      eyebrow="Portfolio"
      title="Commercial"
      description="Commercial design projects will be showcased here."
    />
  );
}
