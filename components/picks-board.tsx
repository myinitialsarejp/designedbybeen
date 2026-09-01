import type { SanityImageSource } from "@sanity/image-url";

import { PickCard } from "@/components/pick-card";

export type PickPreview = {
  _id: string;
  title: string | null;
  link: string | null;
  image: SanityImageSource | null;
  width: number | null;
  height: number | null;
};

export function PicksBoard({ picks }: { picks: PickPreview[] }) {
  if (picks.length === 0) {
    return (
      <p className="text-base leading-7 text-foreground-muted">
        New picks will appear here.
      </p>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {picks.map((pick) => {
        if (!pick.image || !pick.link || !pick.title) {
          return null;
        }

        return (
          <div key={pick._id} className="mb-4 break-inside-avoid">
            <PickCard
              id={pick._id}
              title={pick.title}
              image={pick.image}
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
