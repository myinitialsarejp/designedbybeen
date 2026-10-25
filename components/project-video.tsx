"use client";

import { Play } from "lucide-react";
import { useRef, useState } from "react";

import { SanityImage } from "@/components/sanity-image";
import { Button } from "@/components/ui/button";

type ProjectVideoProps = {
  src: string;
  posterUrl?: string;
  label: string;
};

export function ProjectVideo({ src, posterUrl, label }: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activated, setActivated] = useState(false);

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.src = src;
    video.controls = true;
    video.tabIndex = 0;
    setActivated(true);
    video.focus();
    void video.play().catch(() => undefined);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface-muted">
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-contain"
        controls={activated}
        preload="none"
        playsInline
        tabIndex={activated ? 0 : -1}
        aria-label={label}
      >
        Your browser does not support the video tag.
      </video>
      {!activated && (
        <>
          {posterUrl && (
            <SanityImage
              src={posterUrl}
              alt=""
              fill
              sizes="(min-width: 896px) 404px, (min-width: 640px) 45vw, 100vw"
              className="object-cover"
            />
          )}
          <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2"
            aria-label={`Play ${label}`}
            title={`Play ${label}`}
            onClick={playVideo}
          >
            <Play aria-hidden="true" className="size-6" />
          </Button>
        </>
      )}
    </div>
  );
}