import type { Metadata } from "next";
import Link from "next/link";

import { mainNav } from "@/lib/site";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Residential, commercial, and academic design work.",
};

const portfolio = mainNav.find((item) => item.href === "/portfolio");

export default function PortfolioPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Portfolio
        </h1>
        <p className="mt-4 text-base leading-7 text-foreground-muted sm:text-lg">
          Selected work across residential, commercial, and academic projects.
          Choose a category to explore. Content coming soon.
        </p>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portfolio?.children?.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              className="flex min-h-40 flex-col justify-end rounded-lg border border-border bg-surface p-6 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-lg font-medium text-foreground">
                {child.title}
              </span>
              <span className="mt-1 text-sm text-foreground-muted">
                View projects
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
