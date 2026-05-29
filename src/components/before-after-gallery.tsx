"use client";

import { useState } from "react";
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item, i) => (
        <BeforeAfterSlider
          key={item.label}
          beforeUrl={item.beforeImage}
          beforeVideoUrl={item.beforeVideo}
          afterUrl={item.afterImage}
          afterVideoUrl={item.afterVideo}
          label={item.label}
          serviceTag={item.serviceTag}
          isMuted={unmutedIndex !== i}
          onMutedChange={(muted) => setUnmutedIndex(muted ? null : i)}
        />
      ))}
    </div>
  );
}
