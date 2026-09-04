"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type Artwork = {
  id: string;
  caption?: string;
  alt?: string;
  height: number | null;
  imageUrl: string;
  width: number | null;
};

type ArtworkCarouselProps = {
  artwork: Artwork[];
};

const slideGap = 16;

function artworkRatio(item: Artwork) {
  if (!item.width || !item.height || item.width <= 0 || item.height <= 0) {
    return 4 / 5;
  }

  return item.width / item.height;
}

export function ArtworkCarousel({ artwork }: ArtworkCarouselProps) {
  const items = artwork;
  const prefersReducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [slideWidth, setSlideWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const trackX = useMotionValue(0);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateSlideWidth = () => {
      setSlideWidth(Math.min(viewport.clientWidth * 0.72, 720));
    };

    updateSlideWidth();
    const observer = new ResizeObserver(updateSlideWidth);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, []);

  const trackOffset = (index: number) => {
    if (!viewportRef.current || !slideWidth) return 0;

    return (viewportRef.current.clientWidth - slideWidth) / 2 -
      index * (slideWidth + slideGap);
  };

  const moveToIndex = (index: number, immediate = false) => {
    if (!items.length) return;

    const nextIndex = Math.max(0, Math.min(index, items.length - 1));
    setActiveIndex(nextIndex);

    const target = trackOffset(nextIndex);
    if (immediate || prefersReducedMotion) {
      trackX.set(target);
      return;
    }

    animate(trackX, target, {
      type: "spring",
      stiffness: 280,
      damping: 32,
    });
  };

  useEffect(() => {
    if (slideWidth) moveToIndex(activeIndex, true);
    // The resize observer changes the coordinate system, so the active item must be recentered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideWidth]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeButton = document.querySelector<HTMLButtonElement>(
      '[aria-label="Close artwork inspection"]',
    );
    closeButton?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }

      if (event.key === "Tab") {
        const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
        const focusable = dialog?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      (lastTrigger.current ?? previouslyFocused)?.focus();
    };
  }, [lightboxIndex]);

  if (!items.length) {
    return (
      <section className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Artwork
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-foreground-muted sm:text-lg">
          Original artwork will appear here soon.
        </p>
      </section>
    );
  }

  const lightboxArtwork = lightboxIndex === null ? null : items[lightboxIndex];

  return (
    <section aria-labelledby="artwork-heading" className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-sm font-medium uppercase tracking-caption text-foreground-muted">
              Collection
            </p>
            <h1
              id="artwork-heading"
              className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Artwork
            </h1>
          </div>
          <p className="hidden font-mono text-sm text-foreground-muted sm:block">
            {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-screen-2xl overflow-hidden px-4 sm:mt-12 sm:px-6 lg:px-8">
        <div
          ref={viewportRef}
          aria-label="Artwork carousel"
          className="relative overflow-hidden py-10"
        >
          <motion.div
            className="flex items-center"
            drag="x"
            dragConstraints={{ left: trackOffset(items.length - 1), right: trackOffset(0) }}
            dragDirectionLock
            dragElastic={0.08}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              const direction = info.offset.x < -40 || info.velocity.x < -250 ? 1 :
                info.offset.x > 40 || info.velocity.x > 250 ? -1 : 0;
              moveToIndex(activeIndex + direction);
            }}
            style={{ x: trackX, gap: slideGap }}
          >
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <motion.button
                  key={item.id}
                  ref={(element) => {
                    triggerRefs.current[index] = element;
                  }}
                  type="button"
                  aria-label={isActive ? "Inspect artwork" : "View artwork"}
                  aria-current={isActive ? "true" : undefined}
                  className="relative block shrink-0 cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  style={{ width: slideWidth || "72vw", maxWidth: 720 }}
                  animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.94 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" }}
                  onClick={() => {
                    lastTrigger.current = triggerRefs.current[index];
                    if (isActive) {
                      setLightboxIndex(index);
                    } else {
                      moveToIndex(index);
                    }
                  }}
                  whileTap={prefersReducedMotion ? undefined : { scale: isActive ? 0.98 : 0.92 }}
                >
                  <span
                    className="relative block shadow-artwork"
                    style={{ aspectRatio: artworkRatio(item) }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.alt || "Artwork"}
                      fill
                      sizes="(max-width: 640px) 72vw, (max-width: 1280px) 62vw, 720px"
                      className="object-contain"
                      priority={index < 2}
                    />
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-foreground-muted sm:hidden">
            {activeIndex + 1} of {items.length}
          </p>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              aria-label="Previous artwork"
              className="inline-flex size-11 items-center justify-center border border-border text-foreground outline-none transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
              onClick={() => moveToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next artwork"
              className="inline-flex size-11 items-center justify-center border border-border text-foreground outline-none transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
              onClick={() => moveToIndex(activeIndex + 1)}
              disabled={activeIndex === items.length - 1}
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-screen-2xl px-4 text-center sm:mt-12 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-xl text-base italic leading-7 text-foreground-muted">
          Have something specific in mind? Custom art commissions are available.
        </p>
        <Button asChild size="lg" className="mt-5">
          <Link href="/contact">Contact Me</Link>
        </Button>
      </div>

      <AnimatePresence>
        {lightboxArtwork && lightboxIndex !== null && (
          <motion.div
            key="artwork-lightbox"
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-2 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Artwork inspection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setLightboxIndex(null);
            }}
          >
            <motion.div
              className="relative flex max-h-full w-full max-w-6xl flex-col border border-border bg-surface p-2 sm:p-4"
              initial={{ scale: prefersReducedMotion ? 1 : 0.96, y: prefersReducedMotion ? 0 : 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: prefersReducedMotion ? 1 : 0.96, y: prefersReducedMotion ? 0 : 8 }}
            >
              <div className="flex items-start justify-between gap-4">
                <button
                  type="button"
                  aria-label="Close artwork inspection"
                  className="inline-flex size-9 shrink-0 items-center justify-center border border-border text-foreground outline-none hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setLightboxIndex(null)}
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>

              <div
                className="relative mt-2 self-center shadow-artwork"
                style={{
                  aspectRatio: artworkRatio(lightboxArtwork),
                  width: `min(100%, calc(min(72vh, 760px) * ${artworkRatio(lightboxArtwork)}))`,
                }}
              >
                <Image
                  src={lightboxArtwork.imageUrl}
                  alt={lightboxArtwork.alt || "Artwork"}
                  fill
                  sizes="(min-width: 1024px) 60vw, 90vw"
                  className="object-contain"
                  priority
                />
              </div>

              {lightboxArtwork.caption && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-muted">
                  {lightboxArtwork.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}