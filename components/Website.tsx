"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import IntroScreen from "@/components/intro/IntroScreen";
import SmoothScroll from "@/components/effects/SmoothScroll";

import Navbar from "@/components/navbar/Navbar";
import AboutSection from "@/components/sections/AboutSection";
import EventsSection from "@/components/sections/EventsSection";
import GallerySection from "@/components/sections/GallerySection";
import ContactSection from "@/components/sections/ContactSection";
import TeamSection from "@/components/team/TeamSection";
import Footer from "@/components/footer/Footer";

export default function Website() {
  const [introComplete, setIntroComplete] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  /*
   * ============================================================
   * INTRO COMPLETE
   * ============================================================
   */

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  /*
   * ============================================================
   * HERO ENTRANCE ANIMATION
   * ============================================================
   */

  useEffect(() => {
    if (!introComplete || !heroRef.current) return;

    const hero = heroRef.current;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      /*
       * ========================================================
       * REDUCED MOTION
       * ========================================================
       */

      if (prefersReducedMotion) {
        gsap.set(
          [
            ".hero-logo",
            ".hero-eyebrow",
            ".hero-letter",
            ".hero-line",
            ".hero-description",
            ".hero-buttons",
            ".hero-scroll",
          ],
          {
            opacity: 1,
            clearProps: "filter,transform",
          },
        );

        return;
      }

      /*
       * ========================================================
       * INITIAL TITLE STATE
       * ========================================================
       */

      gsap.set(".hero-letter", {
        opacity: 0,
        y: 90,
        rotateX: -75,
        rotateY: 25,
        rotateZ: 2,
        scale: 0.72,
        filter: "blur(18px)",
        transformOrigin: "50% 100%",
        transformPerspective: 900,
      });

      gsap.set(".hero-title-sweep", {
        xPercent: -180,
        opacity: 0,
      });

      gsap.set(".hero-title-line", {
        xPercent: -120,
      });

      /*
       * ========================================================
       * MAIN TIMELINE
       * ========================================================
       */

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      /*
       * LOGO
       */

      timeline.fromTo(
        ".hero-logo",
        {
          opacity: 0,
          scale: 0.72,
          rotate: -10,
          filter: "blur(15px)",
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          filter: "blur(0px)",
          duration: 1.25,
          ease: "power4.out",
        },
      );

      /*
       * EYEBROW
       */

      timeline.fromTo(
        ".hero-eyebrow",
        {
          opacity: 0,
          y: 25,
          filter: "blur(7px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.65",
      );

      /*
       * ========================================================
       * SHRINIK LETTER-BY-LETTER REVEAL
       * ========================================================
       */

      timeline.to(
        ".hero-letter",
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: {
            each: 0.045,
            from: "start",
          },
          ease: "power4.out",
        },
        "-=0.25",
      );

      /*
       * ========================================================
       * PEARL / SILVER TITLE GLOW
       * ========================================================
       */

      timeline.to(
        ".hero-letter",
        {
          textShadow:
            "0 0 18px rgba(235,239,245,0.16), 0 0 45px rgba(122,36,56,0.10)",
          duration: 1.1,
          stagger: {
            each: 0.045,
            from: "start",
          },
          ease: "power2.out",
        },
        "-=0.75",
      );

      /*
       * ========================================================
       * TITLE SHINE ANIMATION
       * ========================================================
       */

      timeline.to(
        ".hero-letter",
        {
          backgroundPosition: "100% 50%",
          duration: 1.8,
          stagger: {
            each: 0.05,
            from: "start",
          },
          ease: "power2.inOut",
        },
        "-=0.75",
      );

      /*
       * ========================================================
       * GOLD LINE UNDER TITLE
       * ========================================================
       */

      timeline.to(
        ".hero-title-line",
        {
          xPercent: 500,
          duration: 1.35,
          ease: "power3.inOut",
        },
        "-=1.25",
      );

      /*
       * ========================================================
       * PEARL LIGHT SWEEP
       * ========================================================
       */

      timeline.fromTo(
        ".hero-title-sweep",
        {
          xPercent: -180,
          opacity: 0,
        },
        {
          xPercent: 650,
          opacity: 1,
          duration: 1.15,
          ease: "power2.inOut",
        },
        "-=1.15",
      );

      timeline.to(
        ".hero-title-sweep",
        {
          opacity: 0,
          duration: 0.3,
        },
        "-=0.15",
      );

      /*
       * ========================================================
       * MAIN GOLD LINE
       * ========================================================
       */

      timeline.fromTo(
        ".hero-line",
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 0.7,
          ease: "power3.inOut",
        },
        "-=0.55",
      );

      /*
       * ========================================================
       * DESCRIPTION
       * ========================================================
       */

      timeline.fromTo(
        ".hero-description",
        {
          opacity: 0,
          y: 12,
          filter: "blur(3px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.5,
          ease: "power2.out",
        },
        "-=1.05",
      );

      /*
       * ========================================================
       * BUTTONS
       * ========================================================
       */

      timeline.fromTo(
        ".hero-buttons",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.35",
      );

      /*
       * ========================================================
       * SCROLL INDICATOR
       * ========================================================
       */

      timeline.fromTo(
        ".hero-scroll",
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.25",
      );

      /*
       * ========================================================
       * CONTINUOUS SUBTLE LETTER MOTION
       * ========================================================
       */

      timeline.call(() => {
        gsap.to(".hero-letter", {
          y: -2.5,
          duration: 2.2,
          stagger: {
            each: 0.12,
            repeat: -1,
            yoyo: true,
          },
          ease: "sine.inOut",
        });

        /*
         * Title atmosphere breathing.
         */

        gsap.to(".hero-title-glow", {
          opacity: 0.6,
          scale: 1.07,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, hero);

    return () => {
      ctx.revert();
    };
  }, [introComplete]);

  /*
   * ============================================================
   * HERO MOUSE PARALLAX + LETTER RESPONSE
   * ============================================================
   */

  useEffect(() => {
    if (!introComplete || !heroRef.current) return;

    const hero = heroRef.current;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (window.innerWidth < 768) return;

      const rect = hero.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      /*
       * LOGO
       */

      gsap.to(".hero-logo-parallax", {
        x: x * 18,
        y: y * 18,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
      });

      /*
       * CONTENT
       */

      gsap.to(".hero-content-parallax", {
        x: x * -8,
        y: y * -8,
        duration: 1,
        ease: "power3.out",
        overwrite: true,
      });

      /*
       * GOLD AMBIENT LIGHT
       */

      gsap.to(".hero-gold-glow", {
        x: x * 35,
        y: y * 35,
        duration: 1.2,
        ease: "power3.out",
        overwrite: true,
      });

      /*
       * BURGUNDY AMBIENT LIGHT
       */

      gsap.to(".hero-burgundy-glow", {
        x: x * -25,
        y: y * -25,
        duration: 1.4,
        ease: "power3.out",
        overwrite: true,
      });

      /*
       * TITLE ATMOSPHERE
       */

      gsap.to(".hero-title-glow", {
        x: x * 28,
        y: y * 18,
        duration: 1,
        ease: "power3.out",
        overwrite: true,
      });

      /*
       * INDIVIDUAL LETTER RESPONSE
       */

      const letters = hero.querySelectorAll<HTMLElement>(".hero-letter");

      letters.forEach((letter, index) => {
        const centerBias = index - (letters.length - 1) / 2;

        gsap.to(letter, {
          x: x * (4 + Math.abs(centerBias) * 0.8),
          y: y * (3 + Math.abs(centerBias) * 0.5),
          rotateY: x * 4,
          rotateX: y * -3,
          duration: 0.75,
          ease: "power3.out",
          overwrite: true,
        });
      });
    };

    /*
     * RESET
     */

    const handleMouseLeave = () => {
      gsap.to(
        [
          ".hero-logo-parallax",
          ".hero-content-parallax",
          ".hero-gold-glow",
          ".hero-burgundy-glow",
          ".hero-title-glow",
        ],
        {
          x: 0,
          y: 0,
          duration: 1,
          ease: "power3.out",
          overwrite: true,
        },
      );

      gsap.to(".hero-letter", {
        x: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
      });
    };

    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseleave", handleMouseLeave);

      gsap.killTweensOf([
        ".hero-logo-parallax",
        ".hero-content-parallax",
        ".hero-gold-glow",
        ".hero-burgundy-glow",
        ".hero-title-glow",
        ".hero-letter",
      ]);
    };
  }, [introComplete]);

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      <SmoothScroll />

      {!introComplete && <IntroScreen onComplete={handleIntroComplete} />}

      <main
        id="main-content"
        className={`
          overflow-x-clip
          bg-[#080808]
          transition-opacity
          duration-1000
          ${introComplete ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      >
        <Navbar />

        {/* ====================================================
            HERO
        ===================================================== */}

        <section
          ref={heroRef}
          id="home"
          className="
            relative
            flex
            min-h-screen
            items-center
            overflow-hidden
            bg-[#080808]
            px-6
            md:px-12
          "
        >
          {/* BACKGROUND VIDEO */}

          <video
            className="
              absolute
              inset-0
              z-0
              h-full
              w-full
              object-cover
            "
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source
              src="/videos/shrinik-tech-background.mp4"
              type="video/mp4"
            />
          </video>

          {/* DARK OVERLAY */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-[1]
              bg-[#080808]/55
            "
          />

          {/* BURGUNDY ATMOSPHERE */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-[2]
              bg-gradient-to-br
              from-[#3A0712]/30
              via-transparent
              to-[#080808]/70
            "
          />

          {/* AMBIENT EFFECTS */}

          <div className="pointer-events-none absolute inset-0 z-[3]">
            {/* Gold */}

            <div
              className="
                hero-gold-glow
                absolute
                left-[5%]
                top-[20%]
                h-[380px]
                w-[380px]
                rounded-full
                bg-[#C6922E]/10
                blur-[140px]
              "
            />

            {/* Burgundy */}

            <div
              className="
                hero-burgundy-glow
                absolute
                right-[-10%]
                top-[15%]
                h-[650px]
                w-[650px]
                rounded-full
                bg-[#7A001B]/15
                blur-[170px]
              "
            />

            {/* Bottom atmosphere */}

            <div
              className="
                absolute
                bottom-[-25%]
                left-1/2
                h-[500px]
                w-[800px]
                -translate-x-1/2
                rounded-full
                bg-[#650018]/[0.06]
                blur-[140px]
              "
            />

            {/* Tech grid */}

            <div className="absolute inset-0 opacity-[0.035]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(
                      rgba(255,255,255,0.45) 1px,
                      transparent 1px
                    ),
                    linear-gradient(
                      90deg,
                      rgba(255,255,255,0.45) 1px,
                      transparent 1px
                    )
                  `,
                  backgroundSize: "80px 80px",
                }}
              />
            </div>

            {/* Radial dots */}

            <div
              className="
                absolute
                inset-0
                opacity-[0.035]
              "
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgba(198,146,46,0.8) 1px, transparent 1px)",
                backgroundSize: "38px 38px",
              }}
            />
          </div>

          {/* ==================================================
              CONTENT
          ================================================== */}

          <div
            className="
              relative
              z-10
              mx-auto
              w-full
              max-w-7xl
            "
          >
            <div
              className="
                grid
                items-center
                gap-14
                lg:grid-cols-[0.8fr_1.5fr]
              "
            >
              {/* =================================================
                  LOGO
              ================================================= */}

              <div className="flex justify-center lg:justify-start">
                <div className="hero-logo relative">
                  <div className="hero-logo-parallax relative">
                    <div
                      className="
                        absolute
                        inset-[-35px]
                        rounded-full
                        bg-[#C6922E]/10
                        blur-[55px]
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-[-18px]
                        rounded-full
                        border
                        border-[#C6922E]/10
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-[-8px]
                        rounded-full
                        border
                        border-[#C6922E]/[0.06]
                      "
                    />

                    <div
                      className="
                        relative
                        flex
                        aspect-square
                        w-[235px]
                        items-center
                        justify-center
                        rounded-full
                        sm:w-[275px]
                        md:w-[310px]
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
                          drop-shadow-[0_0_40px_rgba(198,146,46,0.25)]
                          transition-transform
                          duration-700
                          ease-out
                          hover:scale-[1.035]
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  HERO TEXT
              ================================================= */}

              <div className="hero-content-parallax text-center lg:text-left">
                {/* EYEBROW */}

                <div className="hero-eyebrow">
                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-3
                      lg:justify-start
                    "
                  >
                    <span className="h-px w-8 bg-[#C6922E]" />

                    <span
                      className="
                        text-[10px]
                        uppercase
                        tracking-[0.4em]
                        text-[#C6922E]
                        sm:text-xs
                      "
                    >
                      Technology · Creativity · Culture
                    </span>
                  </div>
                </div>

                {/* =================================================
                    SHRINIK TITLE
                ================================================== */}

                <div className="hero-title-wrap relative mt-7">
                  {/* Pearl / silver glow */}

                  <div
                    className="
                      hero-title-glow
                      pointer-events-none
                      absolute
                      left-1/2
                      top-1/2
                      z-0
                      h-[190px]
                      w-[90%]
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      bg-[#E5EAF0]/[0.08]
                      blur-[95px]
                    "
                  />

                  {/* Burgundy depth */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-1/2
                      top-1/2
                      z-0
                      h-[120px]
                      w-[70%]
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      bg-[#7A2438]/20
                      blur-[75px]
                    "
                  />

                  {/* Pearl light sweep */}

                  <div
                    className="
                      hero-title-sweep
                      pointer-events-none
                      absolute
                      inset-y-[-15%]
                      left-[-30%]
                      z-20
                      w-[16%]
                      skew-x-[-18deg]
                      bg-gradient-to-r
                      from-transparent
                      via-[#FFFFFF]/75
                      to-transparent
                      opacity-0
                      blur-xl
                    "
                  />

                  {/* TITLE */}

                  <h1
                    className="
                      hero-title
                      relative
                      z-10
                      flex
                      whitespace-nowrap
                      text-[clamp(4rem,9vw,9rem)]
                      font-semibold
                      leading-[0.78]
                      tracking-[-0.07em]
                    "
                    aria-label="SHRINIK"
                  >
                    {"SHRINIK".split("").map((letter, index) => (
                      <span
                        key={`${letter}-${index}`}
                        className="
                          hero-letter
                          relative
                          inline-block
                          bg-[linear-gradient(120deg,#FFFFFF_0%,#E9EDF2_28%,#AEB8C4_50%,#F8F7F3_68%,#7A2438_100%)]
                          bg-[length:250%_250%]
                          bg-clip-text
                          text-transparent
                          will-change-transform
                        "
                        style={{
                          textShadow: "0 0 16px rgba(235,239,245,0.10)",
                        }}
                      >
                        {letter}
                      </span>
                    ))}
                  </h1>

                  {/* TITLE BASELINE */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -bottom-5
                      left-0
                      h-px
                      w-full
                      overflow-hidden
                      bg-[#C6922E]/10
                    "
                  >
                    <div
                      className="
                        hero-title-line
                        h-full
                        w-1/4
                        bg-gradient-to-r
                        from-transparent
                        via-[#C6922E]
                        to-transparent
                      "
                    />
                  </div>
                </div>

                {/* GOLD DIVIDER */}

                <div
                  className="
                    hero-line
                    mt-9
                    h-px
                    w-24
                    bg-[#C6922E]/70
                    lg:w-32
                  "
                />

                {/* DESCRIPTION */}

                <div className="hero-description">
                  <p
                    className="
                      mt-7
                      max-w-xl
                      text-sm
                      leading-7
                      text-white/45
                      md:text-base
                    "
                  >
                    Where technology meets culture.
                    <br />
                    <span className="text-white/25">
                      A student-driven community at G.L. Bajaj built around
                      creativity, technology and expression.
                    </span>
                  </p>
                </div>

                {/* =================================================
                    BUTTONS
                ================================================== */}

                <div
                  className="
                    hero-buttons
                    mt-10
                    flex
                    flex-wrap
                    justify-center
                    gap-3
                    lg:justify-start
                  "
                >
                  <a
                    href="#about"
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-full
                      bg-[#C6922E]
                      px-7
                      py-3.5
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#080808]
                      transition-all
                      duration-300
                      hover:scale-[1.04]
                      hover:bg-[#D8AA4D]
                      hover:shadow-[0_0_40px_rgba(198,146,46,0.22)]
                    "
                  >
                    <span className="relative z-10">Explore Shrinik</span>

                    <span
                      className="
                        absolute
                        inset-0
                        -translate-x-full
                        bg-white/20
                        transition-transform
                        duration-500
                        group-hover:translate-x-full
                      "
                    />
                  </a>

                  <a
                    href="#team"
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-white/10
                      bg-white/[0.015]
                      px-7
                      py-3.5
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      text-white/65
                      backdrop-blur-sm
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-[#C6922E]/50
                      hover:bg-[#C6922E]/[0.06]
                      hover:text-[#F5F1E8]
                    "
                  >
                    Our Team
                    <span
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                      "
                    >
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              SCROLL INDICATOR
          ================================================== */}

          <div
            className="
              hero-scroll
              absolute
              bottom-8
              left-1/2
              z-10
              -translate-x-1/2
            "
          >
            <a
              href="#about"
              className="
                group
                flex
                flex-col
                items-center
                gap-3
              "
            >
              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.4em]
                  text-white/25
                  transition-colors
                  duration-300
                  group-hover:text-[#C6922E]/70
                "
              >
                Scroll
              </span>

              <span className="relative h-10 w-px overflow-hidden bg-white/10">
                <span
                  className="
                    absolute
                    left-0
                    top-0
                    h-1/2
                    w-full
                    bg-gradient-to-b
                    from-[#C6922E]
                    to-transparent
                    animate-pulse
                  "
                />
              </span>
            </a>
          </div>

          {/* CORNER DETAILS */}

          <div
            className="
              absolute
              bottom-8
              left-6
              hidden
              text-[8px]
              uppercase
              tracking-[0.25em]
              text-white/15
              md:block
              md:left-12
            "
          >
            G.L. BAJAJ · GREATER NOIDA
          </div>

          <div
            className="
              absolute
              bottom-8
              right-6
              hidden
              text-[8px]
              uppercase
              tracking-[0.25em]
              text-white/15
              md:block
              md:right-12
            "
          >
            EST. · SHRINIK
          </div>
        </section>

        {/* ====================================================
            SECTIONS
        ===================================================== */}

        <AboutSection />
        <TeamSection />
        <EventsSection />
        <GallerySection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
