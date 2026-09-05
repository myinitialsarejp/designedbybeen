import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Brittany Been — interior designer and architect behind Designed By Been in Phoenix, AZ.",
};

type AboutSection = {
  eyebrow: string;
  src: string;
  alt: string;
  aspect: string;
  reverse: boolean;
  paragraphs: string[];
};

const sections: AboutSection[] = [
  {
    eyebrow: "The first project",
    src: "/first-to-last.jpg",
    alt: "Interior of First and Last, Brittany Been's first restaurant concept in downtown Phoenix.",
    aspect: "aspect-[3/2]",
    reverse: false,
    paragraphs: [
      "From there I had the opportunity of designing my first restaurant concept in 2022, First and Last, DTPHX. What started out as a self taught career turned into something bigger, and I wanted to be a true master of my craft.",
    ],
  },
  {
    eyebrow: "Mastering the craft",
    src: "/been-graduates.jpeg",
    alt: "Brittany Been at her Arizona State University graduation.",
    aspect: "aspect-square",
    reverse: true,
    paragraphs: [
      "I completed my Masters in Architecture at Arizona State University in 2025, and continued to expand my practice to full-design build residential projects and hospitality projects.",
    ],
  },
  {
    eyebrow: "My style",
    src: "/been-style-sample.png",
    alt: "A sample of Brittany Been's interior design style.",
    aspect: "aspect-[3/2]",
    reverse: false,
    paragraphs: [
      "My style transcends Mid century modern, where I love a classic mid century modern and Palm Springs Mid century modern client, all the way to the boldest, most contrasting color and retro concepts. I love the feeling of spaces being collected and curated rather than just interior designed.",
    ],
  },
  {
    eyebrow: "Behind the scenes",
    src: "/been-style-sample2.png",
    alt: "Another sample of Brittany Been's interior design style.",
    aspect: "aspect-[3/2]",
    reverse: true,
    paragraphs: [
      "Outside of my design practice, you might have found me from TikTok or YouTube — welcome! Thank you for tuning into me, and I genuinely love having a space where I make design less intimidating and more accessible, while taking you all behind the scenes of what I do.",
    ],
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal as="header" className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-sm font-medium uppercase tracking-caption text-foreground-muted">
          About
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Hi! I&rsquo;m Brittany Been.
        </h1>
        <p className="mt-6 text-pretty text-left text-lg leading-8 text-foreground-muted first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-primary sm:text-xl sm:leading-9">
          I started Designed By Been in 2021 as an interior decorator in Phoenix,
          AZ, and became a self taught interior designer teaching myself
          everything I could and having the honor of working under talented
          independent architects and designers.
        </p>
      </Reveal>

      <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-24">
        {sections.map((section) => (
          <Reveal
            as="article"
            key={section.eyebrow}
            className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-14"
          >
            <div
              className={`relative w-full overflow-hidden rounded-lg border border-border bg-card ${section.aspect} ${
                section.reverse ? "md:order-2" : ""
              }`}
            >
              <Image
                src={section.src}
                alt={section.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className={section.reverse ? "md:order-1" : ""}>
              <p className="font-mono text-sm font-medium uppercase tracking-caption text-primary">
                {section.eyebrow}
              </p>
              <div className="mt-4 space-y-4 text-pretty text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal
        as="figure"
        className="mx-auto mt-16 max-w-3xl rounded-lg border border-border bg-card px-6 py-12 text-center sm:mt-24 sm:px-12"
      >
        <p className="text-sm text-foreground-muted">
          At the end of the day, my original phrase was
        </p>
        <blockquote className="mt-4 text-balance text-2xl font-medium leading-snug text-foreground sm:text-3xl">
          &ldquo;Good design should be{" "}
          <span className="text-primary">accessible to all</span>,&rdquo; and
          always, <span className="text-primary">&ldquo;good luck.&rdquo;</span>
        </blockquote>
        <figcaption className="mt-6 font-mono text-sm uppercase tracking-caption text-foreground-muted">
          &mdash; Brittany Been
        </figcaption>
      </Reveal>
    </section>
  );
}
