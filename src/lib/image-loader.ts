"use client";

import type { ImageLoaderProps } from "next/image";

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  if (src.startsWith("/")) return `${src}?w=${width}`;

  if (src.includes("cdn.sanity.io")) {
    const url = new URL(src);
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    url.searchParams.set("w", String(width));
    if (quality) url.searchParams.set("q", String(quality));
    return url.href;
  }

  return src;
}
