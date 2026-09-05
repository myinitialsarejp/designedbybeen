import Link from "next/link";

import { mainNav, siteConfig } from "@/lib/site";

// Brand icons are not shipped by lucide; use small inline SVGs at icon sizing.
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.5 3c.3 2.1 1.5 3.4 3.5 3.6v2.4c-1.2.1-2.4-.2-3.5-.8v5.9c0 3.3-2.4 5.9-5.7 5.9A5.6 5.6 0 0 1 5.3 14a5.6 5.6 0 0 1 6.2-5.6v2.6a3 3 0 0 0-1-.2 3 3 0 0 0 .1 6 3 3 0 0 0 3-3.1V3h2.9Z" />
    </svg>
  );
}

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.4a2.5 2.5 0 0 0-1.8 1.8C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.4a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" />
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col-reverse items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p className="text-center text-sm text-foreground-muted">
            &copy; {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <ul className="flex items-center gap-2">
            <li>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex size-11 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <InstagramIcon className="size-5" />
              </a>
            </li>
            <li>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex size-11 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <TikTokIcon className="size-5" />
              </a>
            </li>
            <li>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex size-11 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <YouTubeIcon className="size-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
