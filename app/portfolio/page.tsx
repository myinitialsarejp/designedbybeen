import type { Metadata } from "next";
import { PortfolioNavSection } from "@/components/portfolio-nav-section";

import { mainNav } from "@/lib/site";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Residential, commercial, and academic design work.",
};

const portfolio = mainNav.find((item) => item.href === "/portfolio");

export default function PortfolioPage() {
  return (
    <div>
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
      </section>

      <section aria-label="Explore portfolio categories" className="w-full">
        <ul className="m-0 list-none p-0">
          {portfolio?.children?.map((child, index) => (
            <PortfolioNavSection
              key={child.title}
              {...child}
              priority={index === 0}
              contentAlignment={index % 2 === 0 ? "left" : "right"}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
