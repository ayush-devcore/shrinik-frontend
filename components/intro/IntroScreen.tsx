"use client";

import { useEffect, useState } from "react";

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Intro duration: 5 seconds
    const timer = window.setTimeout(() => {
      setIsLeaving(true);

      // Allow the exit animation to finish
      window.setTimeout(() => {
        onComplete();
      }, 700);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden bg-[#080808] transition-opacity duration-700 ${
        isLeaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/shrinik-intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
      />

      {/* Cinematic overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]" />

      {/* Loading indicator */}
      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-[9px] uppercase tracking-[0.45em] text-white/40">
          Entering Shrinik
        </span>

        <div className="h-px w-32 overflow-hidden bg-white/10">
          <div className="h-full w-full origin-left animate-[introProgress_5s_linear_forwards] bg-[#C6922E]" />
        </div>
      </div>
    </div>
  );
}