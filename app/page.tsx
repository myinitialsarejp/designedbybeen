import Link from "next/link";

import { mainNav, siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-foreground-muted">
            {siteConfig.legalName}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground-muted">
            A portfolio of residential, commercial, and academic design work,
            alongside artwork, a journal, and a running list of picks.
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

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Explore
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-full min-h-32 flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="text-lg font-medium text-foreground">
                  {item.title}
                </span>
                {item.children && (
                  <span className="mt-3 text-sm text-foreground-muted">
                    {item.children.map((child) => child.title).join(" · ")}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
