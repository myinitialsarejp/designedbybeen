"use client";

import Image, { type ImageProps } from "next/image";

import { sanityImageLoader } from "@/lib/sanity/image-loader";

type SanityImageProps = Omit<ImageProps, "loader" | "src"> & {
  src: string;
};

export function SanityImage({ src, alt, ...props }: SanityImageProps) {
  return <Image {...props} alt={alt} loader={sanityImageLoader} src={src} />;
}
