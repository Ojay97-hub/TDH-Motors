"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import type { MerchItem } from "@/lib/merch";

export function MerchGrid({ items }: { items: MerchItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active =
    activeIndex !== null && activeIndex >= 0 && activeIndex < items.length
      ? items[activeIndex]
      : null;
  const isOpen = active !== null;

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null || items.length === 0 ? i : (i - 1 + items.length) % items.length
      ),
    [items.length],
  );
  const showNext = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null || items.length === 0 ? i : (i + 1) % items.length
      ),
    [items.length],
  );

  useEffect(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      if (items.length === 0) return null;
      return Math.min(current, items.length - 1);
    });
  }, [items.length]);

  useEffect(() => {
    if (!isOpen) return;
    if (typeof document === "undefined") return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, showPrev, showNext]);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-6">
        {items.map((item, i) => (
          <article key={item.title} className="group flex flex-col">
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`View larger image of ${item.title}`}
              className="relative aspect-4/5 w-full overflow-hidden border border-border bg-bg-elevated mb-4 cursor-zoom-in"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {item.comingSoon && (
                <span className="absolute top-3 left-3 bg-bg/90 backdrop-blur text-text px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium border border-border">
                  Coming Soon
                </span>
              )}
            </button>

            <div className="flex flex-1 flex-col">
              <div className="text-[11px] tracking-[0.2em] uppercase text-text-subtle mb-1.5">
                {item.category}
              </div>
              <h2 className="font-display text-lg tracking-wide mb-2">{item.title}</h2>
              <p className="text-text-muted text-sm leading-relaxed mb-5 flex-1">{item.detail}</p>

              <a
                href={item.tiktokShopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 border border-border px-4 py-3 font-medium tracking-wider uppercase text-xs text-text transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-on-brand"
              >
                Purchase on TikTok Shop <ExternalLink size={13} />
              </a>
            </div>
          </article>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} — enlarged image`}
          onClick={close}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-10 cursor-zoom-out"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={22} />
          </button>

          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous product"
              className="absolute left-3 sm:left-6 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          <div className="relative h-[78vh] w-[92vw] sm:w-[85vw] pointer-events-none">
            <Image
              src={active.image}
              alt={active.title}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next product"
              className="absolute right-3 sm:right-6 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight size={26} />
            </button>
          )}

          <div className="pointer-events-none absolute bottom-6 left-0 right-0 text-center px-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-1">
              {active.category}
            </div>
            <div className="font-display text-lg text-white">{active.title}</div>
          </div>
        </div>
      )}
    </>
  );
}
