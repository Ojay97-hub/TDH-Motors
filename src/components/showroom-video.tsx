"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function ShowroomVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (!next && v.paused) v.play().catch(() => {});
  }

  return (
    <div className="relative bg-stone-900 overflow-hidden rounded-sm">
      <video
        ref={videoRef}
        src="/tdh-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster="/tdh-warehouse.jpg"
        className="w-full h-auto block"
      />
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute bottom-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-bg/85 backdrop-blur-sm text-text hover:bg-bg transition-colors"
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
}
