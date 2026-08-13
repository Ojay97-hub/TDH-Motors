"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BeforeAfterSlider } from "@/components/before-after-slider";

export type BeforeAfterItem = {
  label: string;
  serviceTag?: string;
  beforeImage?: string;
  beforeVideo?: string;
  afterImage?: string;
  afterVideo?: string;
};

export function BeforeAfterGallery({ items }: { items: BeforeAfterItem[] }) {
  // Track which slider currently has sound on, so only one plays audio at a time.
  const [unmutedIndex, setUnmutedIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [overflows, setOverflows] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Derive nav state from the scroll position so it stays correct whether the
  // user swipes, drags the scrollbar, or uses the arrows.
  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflows(max > 1);
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);

    const trackLeft = el.getBoundingClientRect().left;
    let nearest = 0;
    let best = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const distance = Math.abs(child.getBoundingClientRect().left - trackLeft);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });
    setActiveIndex(nearest);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync, items.length]);

  const scrollToIndex = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(el.children.length - 1, index));
    const card = el.children[clamped] as HTMLElement | undefined;
    if (!card) return;
    const delta = card.getBoundingClientRect().left - el.getBoundingClientRect().left;
    el.scrollTo({ left: el.scrollLeft + delta, behavior: "smooth" });
  }, []);

  if (items.length === 0) return null;

  return (
    <div>
      {overflows && (
        <div className="flex justify-end gap-2 mb-4">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={atStart}
            className="w-10 h-10 flex items-center justify-center border border-border text-text hover:bg-bg-elevated transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-default disabled:hover:bg-transparent"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={atEnd}
            className="w-10 h-10 flex items-center justify-center border border-border text-text hover:bg-bg-elevated transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-default disabled:hover:bg-transparent"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <div
        ref={trackRef}
        onScroll={sync}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {items.map((item, i) => (
          <div
            key={item.label}
            className="shrink-0 snap-start basis-full md:basis-[calc(50%_-_0.75rem)]"
          >
            <BeforeAfterSlider
              beforeUrl={item.beforeImage}
              beforeVideoUrl={item.beforeVideo}
              afterUrl={item.afterImage}
              afterVideoUrl={item.afterVideo}
              label={item.label}
              serviceTag={item.serviceTag}
              isMuted={unmutedIndex !== i}
              onMutedChange={(muted) => setUnmutedIndex(muted ? null : i)}
            />
          </div>
        ))}
      </div>

      {overflows && (
        <div className="flex justify-center gap-2 mt-6">
          {items.map((item, i) => (
            <button
              key={item.label}
              type="button"
              aria-label={`Go to ${item.label}`}
              aria-current={i === activeIndex}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 transition-all cursor-pointer ${
                i === activeIndex ? "w-6 bg-brand" : "w-1.5 bg-border hover:bg-text-muted"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
