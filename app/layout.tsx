import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SanityContentProvider } from "@/context/sanity-content-provider";
import { siteConfig } from "@/lib/site";
import { SanityLive } from "@/lib/sanity/live";

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
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* siteSettings stays null until the Studio schema exists. */}
        <SanityContentProvider initialContent={{ siteSettings: null }}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SanityContentProvider>
        <SanityLive />
      </body>
    </html>
  );
}
