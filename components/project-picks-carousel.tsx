"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

import { PickCard } from "@/components/pick-card";
import { Button } from "@/components/ui/button";
import { urlForImage } from "@/lib/sanity/image";
import type { PROJECT_QUERY_RESULT } from "@/sanity.types";

type AssociatedPick = NonNullable<NonNullable<PROJECT_QUERY_RESULT>["picks"]>[number];
type RenderablePick = AssociatedPick & {
  title: string;
  link: string;
  image: NonNullable<AssociatedPick["image"]>;
};

function isRenderablePick(pick: AssociatedPick): pick is RenderablePick {
  return Boolean(pick.title && pick.link && pick.image);
}

export function ProjectPicksCarousel({
  picks,
}: {
  picks: AssociatedPick[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollBackward, setCanScrollBackward] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);

  const updateScrollState = () => {
    const track = trackRef.current;

    if (!track) return;

    setCanScrollBackward(track.scrollLeft > 0);
    setCanScrollForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
  };

  const scroll = (direction: "backward" | "forward") => {
    const track = trackRef.current;

    if (!track) return;

    track.scrollBy({
      left: direction === "forward" ? track.clientWidth * 0.8 : -track.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const validPicks = picks.filter(isRenderablePick);

  if (validPicks.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="associated-picks-heading">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="associated-picks-heading"
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          Associated Picks
        </h2>
        {validPicks.length > 1 && (
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous picks"
              disabled={!canScrollBackward}
              onClick={() => scroll("backward")}
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next picks"
              disabled={!canScrollForward}
              onClick={() => scroll("forward")}
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </Button>
          </div>
        )}
      </div>
      <div
        ref={trackRef}
        className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
        onScroll={updateScrollState}
      >
        {validPicks.map((pick) => {
          const width = pick.width && pick.width > 0 ? pick.width : 800;
          const imageUrl = urlForImage(pick.image).width(width).url();

          return (
            <div key={pick._id} className="w-72 shrink-0 snap-start sm:w-80">
              <PickCard
                title={pick.title}
                imageUrl={imageUrl}
                url={pick.link}
                width={pick.width}
                height={pick.height}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}