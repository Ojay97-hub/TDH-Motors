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

  function scroll(dir: "prev" | "next") {
    const el = stripRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-bg-elevated overflow-hidden">
        <Image
          src={images[active]}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
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
      </div>

      {images.length > 1 && (
        <div className="relative">
          {images.length > 6 && (
            <>
              <button
                type="button"
                aria-label="Previous images"
                onClick={() => scroll("prev")}
                className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center bg-bg-elevated/95 backdrop-blur border border-border hover:border-text text-text transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next images"
                onClick={() => scroll("next")}
                className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center bg-bg-elevated/95 backdrop-blur border border-border hover:border-text text-text transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
          <div
            ref={stripRef}
            className="flex gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar"
          >
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
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
        </div>
      )}
    </div>
  );
}
