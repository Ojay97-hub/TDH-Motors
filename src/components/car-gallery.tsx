"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  alt: string;
  status?: "available" | "reserved" | "sold";
};

export function CarGallery({ images, alt, status }: Props) {
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  if (!images.length) return null;

  function scrollThumbnail(index: number) {
    const el = stripRef.current;
    if (!el) return;
    const thumb = el.children[index] as HTMLElement;
    if (thumb) thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }

  function navigate(dir: "prev" | "next") {
    const next =
      dir === "next"
        ? (active + 1) % images.length
        : (active - 1 + images.length) % images.length;
    setActive(next);
    scrollThumbnail(next);
  }

  function handleThumbClick(i: number) {
    setActive(i);
    scrollThumbnail(i);
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-bg-elevated overflow-hidden">
        {images.map((img, i) => (
          <Image
            key={img}
            src={img}
            alt={i === 0 ? alt : ""}
            fill
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            className={`object-cover transition-opacity duration-300 ${i === active ? "opacity-100" : "opacity-0"}`}
            sizes="(min-width: 1280px) 1216px, 100vw"
          />
        ))}
        {status === "reserved" && (
          <div className="absolute top-4 left-4 bg-accent text-stone-900 px-3 py-1 text-xs uppercase tracking-widest font-medium">
            Reserved
          </div>
        )}
        {status === "sold" && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs uppercase tracking-widest font-medium">
            Sold
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => navigate("prev")}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm hover:bg-black/75 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => navigate("next")}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm hover:bg-black/75 text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          ref={stripRef}
          className="flex gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar"
        >
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleThumbClick(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
              className={`relative shrink-0 w-24 sm:w-28 md:w-32 aspect-4/3 overflow-hidden snap-start transition-all ${
                i === active
                  ? "ring-2 ring-brand opacity-100"
                  : "opacity-55 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
