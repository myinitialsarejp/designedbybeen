import Link from "next/link";

import { mainNav, siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { NavSection } from "@/components/nav-section";

export default function Home() {
  return (
    <div>
      <section className="mx-auto w-full max-w-screen-2xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-sm font-medium uppercase tracking-caption text-foreground-muted">
            Brittany Been
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl lg:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground-muted">
            A portfolio of residential and commercial design work,
            alongside artwork, and a running list of picks.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      <section aria-label="Explore the site" className="w-full">
        <ul className="m-0 list-none p-0">
          {mainNav.map((item, index) => (
            <NavSection
              key={item.title}
              {...item}
              priority={index === 0}
              contentAlignment={index % 2 === 0 ? "left" : "right"}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
