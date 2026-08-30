import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

type PagePlaceholderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  children,
}: PagePlaceholderProps) {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-wide text-foreground-muted">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base leading-7 text-foreground-muted sm:text-lg">
            {description}
          </p>
        )}
      </div>

      {children ? (
        <div className="mt-10">{children}</div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="min-h-48 justify-center rounded-lg border-dashed bg-surface-muted py-0"
            >
              <CardContent className="p-6 text-sm text-foreground-muted">
                Placeholder content
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
