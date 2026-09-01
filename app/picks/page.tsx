import type { Metadata } from "next";

import { PicksBoard, type PickPreview } from "@/components/picks-board";
import { sanityFetch } from "@/lib/sanity/live";
import { PICKS_QUERY } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Picks",
  description: "A curated list of favorites and recommendations.",
};

export default async function PicksPage() {
  const { data } = await sanityFetch({
    query: PICKS_QUERY,
    tags: ["pick"],
    stega: false,
  });
  const picks = data as PickPreview[];

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Picks
        </h1>
        <p className="mt-4 text-base leading-7 text-foreground-muted sm:text-lg">
          A curated list of favorites and recommendations.
        </p>
      </div>

      <div className="mt-10">
        <PicksBoard picks={picks} />
      </div>
    </section>
  );
}
