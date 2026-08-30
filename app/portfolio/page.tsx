import type { Metadata } from "next";
import Link from "next/link";

import { mainNav } from "@/lib/site";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Residential, commercial, and academic design work.",
};

const portfolio = mainNav.find((item) => item.href === "/portfolio");

export default function PortfolioPage() {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
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
            <Card className="min-h-40 justify-end gap-0 overflow-hidden rounded-lg py-0 transition-colors hover:bg-accent">
              <Link
                href={child.href}
                className="flex min-h-40 items-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <CardHeader className="w-full px-6 py-6">
                  <CardTitle className="text-lg text-foreground">
                    {child.title}
                  </CardTitle>
                  <CardDescription>View projects</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
