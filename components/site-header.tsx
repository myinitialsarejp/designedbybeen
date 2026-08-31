"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { mainNav, siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { useSanityContent } from "@/components/sanity-content-provider";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { content } = useSanityContent();
  const siteName = content.siteSettings?.title || siteConfig.name;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-h-12 min-w-0 shrink-0 items-center gap-3 rounded-md pr-1 text-lg font-semibold tracking-tight text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden sm:size-14">
            <Image
              src="/BB.svg"
              alt=""
              width={576}
              height={576}
              className="size-full scale-[3]"
              priority
            />
          </span>
          <span className="truncate">{siteName}</span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) =>
              item.children ? (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-foreground-muted transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.title}
                  </Link>
                  <ul
                    className={cn(
                      "invisible absolute left-0 top-full min-w-48 rounded-md border border-border bg-popover p-1 opacity-0 transition",
                      "group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
                    )}
                  >
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="flex min-h-11 items-center rounded-sm px-3 text-sm text-foreground-muted transition-colors hover:bg-background hover:text-foreground focus-visible:bg-background focus-visible:text-foreground focus-visible:outline-none"
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-foreground-muted transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.title}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="size-11 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-border bg-background md:hidden"
        >
          <ul className="mx-auto flex w-full max-w-screen-2xl flex-col px-4 py-3 sm:px-6">
            {mainNav.map((item) => (
              <li key={item.href} className="py-1">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-2 text-base font-medium text-foreground transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.title}
                </Link>
                {item.children && (
                  <ul className="ml-3 border-l border-border pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex min-h-11 items-center rounded-md px-2 text-sm text-foreground-muted transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
