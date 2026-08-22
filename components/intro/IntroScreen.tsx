"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

interface IntroScreenProps {
  onComplete: () => void;
}

const EXIT_DURATION = 700;

export default function IntroScreen({
  onComplete,
}: IntroScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const handleCanPlay = () => {
    setIsReady(true);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (!video || !video.duration) {
      return;
    }

    const percentage =
      (video.currentTime / video.duration) * 100;

    setProgress(Math.min(percentage, 100));
  };

  const handleVideoEnd = () => {
    setProgress(100);
    setIsLeaving(true);

    window.setTimeout(() => {
      onComplete();
    }, EXIT_DURATION);
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const attemptPlay = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch {
        // Browser may delay autoplay until enough data is available.
      }
    };

    if (video.readyState >= 3) {
      setIsReady(true);
      attemptPlay();
    }
  }, []);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setIsMuted(false);
  };

  return (
    <div
      className={`
        fixed
        inset-0
        z-[100]
        overflow-hidden
        bg-[#080808]
        transition-opacity
        duration-700
        ${
          isLeaving
            ? "pointer-events-none opacity-0"
            : "opacity-100"
        }
      `}
    >
      {/* =====================================================
          VIDEO
      ====================================================== */}

      <video
        ref={videoRef}
        className={`
          absolute
          inset-0
          h-full
          w-full
          object-contain
          md:object-cover
          transition-opacity
          duration-500
          ${isReady ? "opacity-100" : "opacity-0"}
        `}
      // src="/videos/shrinik-intro.mp4"
         src="https://res.cloudinary.com/dgrzeojzd/video/upload/v1787422660/shrinik-intro_xxvbv5.mp4"
        autoPlay
        playsInline
        preload="auto"
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        aria-hidden="true"
      />

      {/* =====================================================
          UNMUTE BUTTON
      ====================================================== */}

      {isReady && isMuted && (
        <button
          type="button"
          onClick={handleUnmute}
          aria-label="Tap to unmute"
          className="
            absolute
            right-6
            top-6
            z-30
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/15
            bg-white/5
            px-4
            py-2.5
            text-[10px]
            uppercase
            tracking-[0.2em]
            text-white/60
            backdrop-blur-md
            transition-all
            duration-300
            hover:border-[#C6922E]/40
            hover:bg-white/10
            hover:text-white/90
            active:scale-95
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5 6 9H2v6h4l5 4V5Z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
          Tap to unmute
        </button>
      )}

      {/* =====================================================
          LOADING BACKGROUND
      ====================================================== */}

      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1 w-1 animate-pulse rounded-full bg-[#C6922E]" />
        </div>
      )}

      {/* =====================================================
          CINEMATIC OVERLAY
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/10
        "
      />

      {/* =====================================================
          VIGNETTE
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]
        "
      />

      {/* =====================================================
          LOADING / VIDEO PROGRESS
      ====================================================== */}

      <div
        className="
          absolute
          bottom-10
          left-1/2
          z-10
          flex
          -translate-x-1/2
          flex-col
          items-center
          gap-3
        "
      >
        <span
          className="
            text-[9px]
            uppercase
            tracking-[0.45em]
            text-white/40
          "
        >
          {isReady
            ? "Entering Shrinik"
            : "Loading Shrinik"}
        </span>

        <div
          className="
            relative
            h-px
            w-32
            overflow-hidden
            bg-white/10
          "
        >
          <div
            className="
              absolute
              inset-y-0
              left-0
              bg-[#C6922E]
              transition-[width]
              duration-100
              ease-linear
            "
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
