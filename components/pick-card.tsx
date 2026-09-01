"use client";

import Image from "next/image";
import { Info } from "lucide-react";
import { useState } from "react";
import type { SanityImageSource } from "@sanity/image-url";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { urlForImage } from "@/lib/sanity/image";

export type PickCardProps = {
  id: string;
  title: string;
  image: SanityImageSource;
  url: string;
  width?: number | null;
  height?: number | null;
};

export function PickCard({
  id,
  title,
  image,
  url,
  width,
  height,
}: PickCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const imageWidth = width && width > 0 ? width : 800;
  const imageHeight = height && height > 0 ? height : 600;
  const detailsLabel = `${detailsOpen ? "Hide" : "Show"} details for ${title}`;

  return (
    <article className="border border-border bg-card">
      <div className="relative overflow-hidden">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <Image
            src={urlForImage(image).width(imageWidth).url()}
            alt={title}
            width={imageWidth}
            height={imageHeight}
            sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="h-auto w-full"
          />
        </a>

        <HoverCard open={detailsOpen} onOpenChange={setDetailsOpen}>
          <HoverCardTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 z-10 size-11 bg-background/90"
              aria-label={detailsLabel}
              onClick={() => setDetailsOpen((isOpen) => !isOpen)}
            >
              <Info aria-hidden="true" className="size-5" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent
            side="bottom"
            align="end"
            className="min-w-0 max-w-[calc(100vw-2rem)] border-border bg-popover shadow-none"
          >
            <p className="wrap-break-word text-sm font-medium text-foreground">
              {title}
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </article>
  );
}
