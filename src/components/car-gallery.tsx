"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  alt: string;
  status?: "available" | "reserved" | "sold" | "coming-soon";
};

/**
 * Every slide is stacked in the same box, so all of them sit inside the
 * viewport and `loading="lazy"` buys nothing — the browser fetches the lot on
 * page load. With a dozen 24-megapixel photos on a listing that's tens of
 * megabytes in flight at once, and the *visible* photo ends up queued behind
 * the ones nobody has asked for yet.
 *
 * So we track which slides have actually been requested. The first photo loads
 * on its own; navigating pulls in the target plus its immediate neighbours, so
 * every click after the first is already there.
 */
function withNeighbours(index: number, count: number, current: number[]) {
  if (count === 0) return current;
  const next = new Set(current);
  next.add(index);
  next.add((index + 1) % count);
  next.add((index - 1 + count) % count);
  return [...next];
}

export function CarGallery({ images, alt, status }: Props) {
  const [active, setActive] = useState(0);
  const [requested, setRequested] = useState<number[]>([0]);
  const stripRef = useRef<HTMLDivElement>(null);

  if (!images.length) return null;

  // Clamped as we render rather than corrected in an effect, so a shrinking
  // `images` array (a photo removed in Presentation preview) can never leave
  // `active` pointing past the end, even for a frame.
  const activeIndex = Math.min(active, images.length - 1);

  function show(index: number) {
    setActive(index);
    setRequested((current) => withNeighbours(index, images.length, current));
    scrollThumbnail(index);
  }

  function scrollThumbnail(index: number) {
    const el = stripRef.current;
    if (!el) return;
    const thumb = el.children[index] as HTMLElement;
    if (thumb) thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }

  function navigate(dir: "prev" | "next") {
    show(
      dir === "next"
        ? (activeIndex + 1) % images.length
        : (activeIndex - 1 + images.length) % images.length,
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-bg-elevated overflow-hidden">
        {images.map((img, i) =>
          requested.includes(i) ? (
            // Keyed by position, not URL: the same photo can legitimately be
            // added to a car twice, and duplicate keys make React drop slides.
            <Image
              key={i}
              src={img}
              alt={i === 0 ? alt : ""}
              fill
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              className={`object-cover transition-opacity duration-300 ${i === activeIndex ? "opacity-100" : "opacity-0"}`}
              sizes="(min-width: 1280px) 1216px, 100vw"
            />
          ) : null,
        )}
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
              onClick={() => show(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === activeIndex}
              className={`relative shrink-0 w-24 sm:w-28 md:w-32 aspect-4/3 overflow-hidden snap-start transition-all ${
                i === activeIndex
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
