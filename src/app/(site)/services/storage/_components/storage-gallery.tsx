'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const GALLERY_IMAGES = [
  {
    src: '/car-shelving.jpeg',
    alt: 'Multi-level car storage facility',
  },
  {
    src: '/garage.jpeg',
    alt: 'Elevated lift storage for performance vehicles',
  },
  {
    src: '/storage-space.jpeg',
    alt: 'The Dog House Automotive Solutions facility',
  },
];

export function StorageGallery() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {GALLERY_IMAGES.map((image, idx) => (
          <div
            key={idx}
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

      {expandedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedIndex(null)}
        >
          <button
            onClick={() => setExpandedIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] click-prevent"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={GALLERY_IMAGES[expandedIndex].src}
              alt={GALLERY_IMAGES[expandedIndex].alt}
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
