import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Picks",
  description: "A curated list of favorites and recommendations.",
};

export default function PicksPage() {
  return (
    <PagePlaceholder
      title="Picks"
      description="A curated list of favorites and recommendations will appear here."
    />
  );
}
