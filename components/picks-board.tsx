import { PickCard } from "@/components/pick-card";
import { urlForImage } from "@/lib/sanity/image";
import type { PICKS_QUERY_RESULT } from "@/sanity.types";

export type PickPreview = PICKS_QUERY_RESULT[number];

export function PicksBoard({ picks }: { picks: PickPreview[] }) {
  if (picks.length === 0) {
    return (
      <p className="text-base leading-7 text-foreground-muted">
        New picks will appear here.
      </p>
    );
  }

  let visibleIndex = 0;

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {picks.map((pick) => {
        if (!pick.title || !pick.image || !pick.link) {
          return null;
        }

        const width = pick.width && pick.width > 0 ? pick.width : 800;
        const imageUrl = urlForImage(pick.image).width(width).url();
        const delayMs = Math.min(visibleIndex * 60, 600);
        visibleIndex++;

        return (
          <div
            key={pick._id}
            className="mb-4 break-inside-avoid opacity-0 animate-fade-in"
            style={{ animationDelay: `${delayMs}ms` }}
          >
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
  );
}
