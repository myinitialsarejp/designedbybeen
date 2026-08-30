import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Designed By Been.",
};

export default function ContactPage() {
  return (
    <PagePlaceholder
      title="Contact"
      description="A contact form and details will be available here."
    >
      <div className="max-w-2xl rounded-lg border border-dashed border-border bg-surface-muted p-6 text-sm text-foreground-muted">
        Placeholder content
      </div>
    </PagePlaceholder>
  );
}
