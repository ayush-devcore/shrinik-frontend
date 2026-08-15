"use client";

import { useCallback, useState } from "react";

import IntroScreen from "@/components/intro/IntroScreen";

import Navbar from "@/components/navbar/Navbar";
import AboutSection from "@/components/sections/AboutSection";
import EventsSection from "@/components/sections/EventsSection";
import GallerySection from "@/components/sections/GallerySection";
import ContactSection from "@/components/sections/ContactSection";
import TeamSection from "@/components/team/TeamSection";
import Footer from "@/components/footer/Footer";

export default function Website() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <>
      {!introComplete && <IntroScreen onComplete={handleIntroComplete} />}

      <main
        id="main-content"
        className={`overflow-x-clip bg-[#080808] transition-opacity duration-1000 ${
          introComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        <Navbar />

        {/* Normal homepage */}
        <section
          id="home"
          className="relative flex min-h-screen items-center overflow-hidden bg-[#080808] px-6 md:px-12"
        >
          {/* Ambient gold glow */}
          <div className="pointer-events-none absolute left-[8%] top-[25%] h-[420px] w-[420px] rounded-full bg-[#C6922E]/10 blur-[130px]" />

          {/* Ambient burgundy glow */}
          <div className="pointer-events-none absolute right-[-10%] top-[20%] h-[650px] w-[650px] rounded-full bg-[#7A001B]/15 blur-[160px]" />

          {/* Background grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.5fr]">
              {/* LOGO */}
              <div className="flex justify-center lg:justify-start">
                <div className="group relative">
                  {/* Outer glow */}
                  <div className="absolute inset-[-25px] rounded-full bg-[#C6922E]/10 blur-3xl transition-all duration-700 group-hover:bg-[#C6922E]/20" />

                  {/* Logo container */}
                  <div
                    className="
              relative
              flex
              aspect-square
              w-[240px]
              items-center
              justify-center
              rounded-full
              md:w-[300px]
              lg:w-[350px]
            "
                  >
                    <img
                      src="/assets/favicon.png"
                      alt="Shrinik Club G.L. Bajaj"
                      className="
                relative
                z-10
                h-full
                w-full
                object-contain
                drop-shadow-[0_0_35px_rgba(198,146,46,0.22)]
                transition-transform
                duration-700
                ease-out
                group-hover:scale-[1.04]
                group-hover:rotate-[2deg]
              "
                    />
                  </div>

                  {/* Small decorative ring */}
                  <div className="pointer-events-none absolute inset-[-12px] rounded-full border border-[#C6922E]/10" />
                </div>
              </div>

              {/* TEXT */}
              <div className="text-center lg:text-left">
                <span className="text-xs uppercase tracking-[0.45em] text-[#C6922E]">
                  Technology · Creativity · Culture
                </span>

                <h1
                  className="
            mt-6
            text-[clamp(4rem,9vw,9rem)]
            font-medium
            leading-[0.82]
            tracking-[-0.055em]
            text-[#F5F1E8]
          "
                >
                  SHRINIK
                </h1>

                <div className="mt-7 h-px w-24 bg-[#C6922E]/60 lg:w-32" />

                <p className="mt-7 max-w-xl text-sm leading-7 text-white/40 md:text-base">
                  Where technology meets culture.
                  <br />
                  <span className="text-white/25">
                    [Hero introduction will be added here.]
                  </span>
                </p>

                <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <a
                    href="#about"
                    className="
              rounded-full
              bg-[#C6922E]
              px-7
              py-3.5
              text-xs
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#080808]
              transition-all
              duration-300
              hover:scale-105
              hover:bg-[#D8AA4D]
              hover:shadow-[0_0_30px_rgba(198,146,46,0.2)]
            "
                  >
                    Explore
                  </a>

                  <a
                    href="#team"
                    className="
              rounded-full
              border
              border-white/10
              px-7
              py-3.5
              text-xs
              uppercase
              tracking-[0.16em]
              text-white/70
              transition-all
              duration-300
              hover:border-[#C6922E]/50
              hover:bg-[#C6922E]/5
              hover:text-white
            "
                  >
                    Our Team
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom scroll hint */}
          <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.4em] text-white/25">
                Scroll
              </span>

              <div className="h-10 w-px bg-gradient-to-b from-[#C6922E] to-transparent" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
