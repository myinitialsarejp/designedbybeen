import type { Metadata } from "next";
import Link from "next/link";

import { sanityFetch } from "@/lib/sanity/live";
import { JOURNAL_LIST_QUERY } from "@/lib/sanity/queries";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes, essays, and updates.",
};

export default async function JournalPage() {
  const { data: posts } = await sanityFetch({ query: JOURNAL_LIST_QUERY });

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Journal
        </h1>
        <p className="mt-4 text-base leading-7 text-foreground-muted sm:text-lg">
          Notes, essays, and project updates.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 text-base leading-7 text-foreground-muted">
          No posts yet. Check back soon.
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post._id}>
              <Card className="min-h-40 justify-end gap-0 overflow-hidden rounded-lg py-0 transition-colors hover:border-foreground/30">
                <Link
                  href={`/journal/${post.slug?.current}`}
                  className="flex min-h-40 items-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <CardHeader className="w-full px-6 py-6">
                    <CardTitle className="text-lg text-foreground">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription>{post.excerpt}</CardDescription>
                    )}
                  </CardHeader>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
