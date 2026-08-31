import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  SanityContentProvider,
  type SanitySiteSettings,
} from "@/components/sanity-content-provider";
import { siteConfig } from "@/lib/site";
import { sanityFetch, SanityLive } from "@/lib/sanity/live";
import { SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans-base",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono-base",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: siteSettings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    tags: ["site-settings"],
    stega: false,
  });

  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SanityContentProvider
          initialContent={{ siteSettings: siteSettings as SanitySiteSettings }}
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SanityContentProvider>
        <SanityLive />
      </body>
    </html>
  );
}
