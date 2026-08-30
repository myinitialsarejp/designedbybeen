import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Academic Work",
  description: "Academic design work.",
};

export default function AcademicPage() {
  return (
    <PagePlaceholder
      eyebrow="Portfolio"
      title="Academic Work"
      description="Academic design projects will be showcased here."
    />
  );
}
