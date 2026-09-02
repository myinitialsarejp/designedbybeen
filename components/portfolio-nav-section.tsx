"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { NavItem } from "@/lib/site";

type PortfolioNavSectionProps = NavItem & {
  priority?: boolean;
  contentAlignment?: "left" | "right";
};

export function PortfolioNavSection({
  title,
  href,
  imageSrc,
  priority = false,
  contentAlignment = "left",
}: PortfolioNavSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const image = imageRef.current;

    if (!image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let animationFrameId: number | null = null;

    const updateImageScale = () => {
      animationFrameId = null;
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const viewportHeight = window.innerHeight;
      const progress = Math.min(Math.max(section.getBoundingClientRect().top / viewportHeight, 0), 1);
      image.style.transform = `scale(${1 + progress * 0.08})`;
    };

    const requestScaleUpdate = () => {
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(updateImageScale);
      }
    };

    updateImageScale();
    window.addEventListener("scroll", requestScaleUpdate, { passive: true });
    window.addEventListener("resize", requestScaleUpdate);

    return () => {
      window.removeEventListener("scroll", requestScaleUpdate);
      window.removeEventListener("resize", requestScaleUpdate);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <li>
      <section
        ref={sectionRef}
        aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-")}-heading`}
        className="relative isolate flex min-h-[32rem] items-end overflow-hidden sm:min-h-[40rem]"
      >
        <Image
          ref={imageRef}
          src={imageSrc}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="-z-20 object-cover will-change-transform"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/55" />
        <div
          className={`w-full px-4 py-10 text-primary-foreground transition-[opacity,transform] duration-700 ease-out sm:px-6 sm:py-14 lg:px-8 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
          }`}
        >
          <div
            className={`mx-auto flex w-full max-w-screen-2xl flex-col gap-5 ${
              contentAlignment === "right" ? "items-end text-right" : "items-start text-left"
            }`}
          >
            <h2
              id={`${title.toLowerCase().replaceAll(" ", "-")}-heading`}
              className="text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-6xl"
            >
              {title}
            </h2>
            <Button asChild size="lg" variant="secondary">
              <Link href={href}>Explore {title}</Link>
            </Button>
          </div>
        </div>
      </section>
    </li>
  );
}