import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "About",
  description: "About Designed By Been.",
};

export default function AboutPage() {
  return (
    <PagePlaceholder
      title="About"
      description="Background, approach, and story will be shared here."
    >
      <div className="max-w-2xl rounded-lg border border-dashed border-border bg-surface-muted p-6 text-sm text-foreground-muted">
        Placeholder content
      </div>
    </PagePlaceholder>
  );
}
