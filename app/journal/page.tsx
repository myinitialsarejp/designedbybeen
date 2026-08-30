import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes, essays, and updates.",
};

export default function JournalPage() {
  return (
    <PagePlaceholder
      title="Journal"
      description="Notes, essays, and project updates will be published here."
    />
  );
}
