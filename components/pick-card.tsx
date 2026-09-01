"use client";

import Image from "next/image";
import { Info } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export type PickCardProps = {
  title: string;
  imageUrl: string;
  url: string;
  width?: number | null;
  height?: number | null;
};

export function PickCard({
  title,
  imageUrl,
  url,
  width,
  height,
}: PickCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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
            src={imageUrl}
            alt={title}
            width={imageWidth}
            height={imageHeight}
            sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "h-auto w-full transition-opacity duration-500 ease-out",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </a>

        <HoverCard open={detailsOpen} onOpenChange={setDetailsOpen}>
          <HoverCardTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute top-2 right-2 z-10 size-11"
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
