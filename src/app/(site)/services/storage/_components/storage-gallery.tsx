"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const GALLERY_IMAGES = [
  {
    src: "/car-shelving.jpeg",
    alt: "Multi-level car storage facility",
  },
  {
    src: "/garage.jpeg",
    alt: "Elevated lift storage for performance vehicles",
  },
  {
    src: "/storage-space.jpeg",
    alt: "The Dog House Automotive Solutions facility",
  },
];

export function StorageGallery() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const activeImage =
    expandedIndex !== null && expandedIndex >= 0 && expandedIndex < GALLERY_IMAGES.length
      ? GALLERY_IMAGES[expandedIndex]
      : null;
  const isOpen = activeImage !== null;
  const close = useCallback(() => setExpandedIndex(null), []);

  useEffect(() => {
    setExpandedIndex((current) => {
      if (current === null) return current;
      return GALLERY_IMAGES[current] ? current : null;
    });
  }, []);

  // While the lightbox is open, close on Escape and lock background scroll.
  useEffect(() => {
    if (!isOpen) return;
    if (typeof document === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {GALLERY_IMAGES.map((image, idx) => (
          <div
            key={image.src}
            className="relative h-80 md:h-96 overflow-hidden cursor-pointer group"
            onClick={() => setExpandedIndex(idx)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium">Click to expand</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-10 cursor-zoom-out"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={22} />
          </button>
          <div className="relative h-[78vh] w-[92vw] sm:w-[85vw] pointer-events-none">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
