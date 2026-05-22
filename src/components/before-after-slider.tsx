"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

interface Props {
  beforeUrl?: string;
  beforeVideoUrl?: string;
  afterUrl?: string;
  afterVideoUrl?: string;
  label?: string;
  serviceTag?: string;
  isMuted?: boolean;
  onMutedChange?: (muted: boolean) => void;
}

function SliderMedia({
  videoUrl,
  imageUrl,
  alt,
  videoRef,
  muted,
}: {
  videoUrl?: string;
  imageUrl?: string;
  alt: string;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  muted?: boolean;
}) {
  if (videoUrl) {
    return (
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        loop
        muted={muted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }
  if (imageUrl) {
    return <Image src={imageUrl} alt={alt} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" draggable={false} />;
  }
  return null;
}

export function BeforeAfterSlider({ beforeUrl, beforeVideoUrl, afterUrl, afterVideoUrl, label, serviceTag, isMuted = true, onMutedChange }: Props) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const beforeVideoRef = useRef<HTMLVideoElement | null>(null);
  const afterVideoRef = useRef<HTMLVideoElement | null>(null);

  const hasBefore = !!(beforeUrl || beforeVideoUrl);
  const hasVideo = !!(beforeVideoUrl || afterVideoUrl);

  const update = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setPosition(Math.max(2, Math.min(98, ((clientX - left) / width) * 100)));
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMuted;
    onMutedChange?.(next);
    if (beforeVideoRef.current) beforeVideoRef.current.muted = next;
    if (afterVideoRef.current) afterVideoRef.current.muted = next;
  }, [isMuted, onMutedChange]);

  useEffect(() => {
    if (beforeVideoRef.current) beforeVideoRef.current.muted = isMuted;
    if (afterVideoRef.current) afterVideoRef.current.muted = isMuted;
  }, [isMuted]);

  return (
    <div className="bg-bg-elevated border border-border overflow-hidden">
      <div
        ref={containerRef}
        className="relative aspect-4/3 overflow-hidden cursor-ew-resize select-none touch-none"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          update(e.clientX);
        }}
        onPointerMove={(e) => { if (dragging.current) update(e.clientX); }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
      >
        {/* After — base layer (full width) */}
        <div className="absolute inset-0">
          <SliderMedia videoUrl={afterVideoUrl} imageUrl={afterUrl} alt="After" videoRef={afterVideoRef} muted={isMuted} />
        </div>

        {/* Before — clipped to left portion (only render if present) */}
        {hasBefore && (
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <SliderMedia videoUrl={beforeVideoUrl} imageUrl={beforeUrl} alt="Before" videoRef={beforeVideoRef} muted={isMuted} />
          </div>
        )}

        {/* Fixed labels */}
        {hasBefore && (
          <div className="absolute bottom-3 left-3 z-10 text-[10px] tracking-[0.2em] uppercase font-medium text-white bg-black/70 px-2 py-0.5 pointer-events-none">
            Before
          </div>
        )}
        <div className="absolute bottom-3 right-3 z-10 text-[10px] tracking-[0.2em] uppercase font-medium text-white bg-brand/80 px-2 py-0.5 pointer-events-none">
          After
        </div>

        {/* Sound toggle — only shown when there's a video */}
        {hasVideo && (
          <button
            onClick={toggleMute}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted
              ? <VolumeX size={14} className="text-white" />
              : <Volume2 size={14} className="text-white" />
            }
          </button>
        )}

        {/* Divider line and handle (only if before exists) */}
        {hasBefore && (
          <div
            className="absolute inset-y-0 w-px bg-white/80 pointer-events-none z-20"
            style={{ left: `${position}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
              <ChevronLeft size={13} className="text-stone-800 -mr-0.5" />
              <ChevronRight size={13} className="text-stone-800 -ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {(label || serviceTag) && (
        <div className="p-5">
          {serviceTag && (
            <div className="text-[10px] tracking-[0.25em] uppercase text-brand-light mb-1">{serviceTag}</div>
          )}
          {label && (
            <div className="font-display text-lg tracking-wide">{label}</div>
          )}
        </div>
      )}
    </div>
  );
}
