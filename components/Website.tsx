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
   *
   * Runs once after the 5-second intro disappears.
   */

  useEffect(() => {
    if (!introComplete || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          ".hero-logo",
          {
            opacity: 0,
            scale: 0.75,
            rotate: -8,
            filter: "blur(15px)",
          },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            filter: "blur(0px)",
            duration: 1.2,
          },
        )
        .fromTo(
          ".hero-eyebrow",
          {
            opacity: 0,
            y: 25,
            filter: "blur(6px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
          },
          "-=0.65",
        )
        .fromTo(
          ".hero-title",
          {
            opacity: 0,
            y: 50,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
          },
          "-=0.45",
        )
        .fromTo(
          ".hero-line",
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            duration: 0.7,
          },
          "-=0.45",
        )
        .fromTo(
          ".hero-description",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.35",
        )
        .fromTo(
          ".hero-buttons",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.35",
        )
        .fromTo(
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
    }, heroRef);

    return () => ctx.revert();
  }, [introComplete]);

  /*
   * ============================================================
   * HERO MOUSE PARALLAX
   * ============================================================
   *
   * Desktop only.
   *
   * The logo and ambient lights subtly react to the cursor.
   */

  useEffect(() => {
    if (!introComplete || !heroRef.current) return;

    const hero = heroRef.current;

    const handleMouseMove = (event: MouseEvent) => {
      if (window.innerWidth < 768) return;

      const rect = hero.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;

      const y = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(".hero-logo-parallax", {
        x: x * 18,
        y: y * 18,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(".hero-content-parallax", {
        x: x * -8,
        y: y * -8,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(".hero-gold-glow", {
        x: x * 35,
        y: y * 35,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.to(".hero-burgundy-glow", {
        x: x * -25,
        y: y * -25,
        duration: 1.4,
        ease: "power3.out",
      });
    };

    hero.addEventListener("mousemove", handleMouseMove);

    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
    };
  }, [introComplete]);

  return (
    <>
      {/* ======================================================
          SMOOTH SCROLL
      ======================================================= */}

      <SmoothScroll />

      {/* ======================================================
          CINEMATIC INTRO
      ======================================================= */}

      {!introComplete && <IntroScreen onComplete={handleIntroComplete} />}

      {/* ======================================================
          MAIN WEBSITE
      ======================================================= */}

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
        {/* ====================================================
            NAVBAR
        ===================================================== */}

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
          {/* ==================================================
      HERO BACKGROUND VIDEO
  =================================================== */}

          <video
            className="absolute inset-0 h-full w-full object-cover"
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

          {/* Dark cinematic overlay */}

          <div className="pointer-events-none absolute inset-0 bg-[#080808]/65" />

          {/* Burgundy atmosphere overlay */}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#3A0712]/30 via-transparent to-[#080808]/70" />

          {/* ==================================================
      AMBIENT BACKGROUND
  =================================================== */}

          <div className="pointer-events-none absolute inset-0">
            {/* Gold light */}

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

            {/* Burgundy light */}

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

            {/* Bottom burgundy atmosphere */}

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

            {/* =================================================
                BACKGROUND GRID
            ================================================= */}

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

            {/* =================================================
                FINE RADIAL GRID
            ================================================= */}

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
              HERO CONTENT
          =================================================== */}

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
                  <div
                    className="
                      hero-logo-parallax
                      relative
                    "
                  >
                    {/* Glow */}

                    <div
                      className="
                        absolute
                        inset-[-35px]
                        rounded-full
                        bg-[#C6922E]/10
                        blur-[55px]
                      "
                    />

                    {/* Outer ring */}

                    <div
                      className="
                        absolute
                        inset-[-18px]
                        rounded-full
                        border
                        border-[#C6922E]/10
                      "
                    />

                    {/* Secondary ring */}

                    <div
                      className="
                        absolute
                        inset-[-8px]
                        rounded-full
                        border
                        border-[#C6922E]/[0.06]
                      "
                    />

                    {/* Logo */}

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

              <div
                className="
                  hero-content-parallax
                  text-center
                  lg:text-left
                "
              >
                {/* Eyebrow */}

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

                {/* Title */}

                <h1
                  className="
                    hero-title
                    mt-7
                    text-[clamp(4rem,9vw,9rem)]
                    font-medium
                    leading-[0.78]
                    tracking-[-0.065em]
                    text-[#F5F1E8]
                  "
                >
                  SHRINIK
                </h1>

                {/* Gold line */}

                <div
                  className="
                    hero-line
                    mt-8
                    h-px
                    w-24
                    bg-[#C6922E]/70
                    lg:w-32
                  "
                />

                {/* Description */}

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
                ================================================= */}

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
                  {/* Explore */}

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

                  {/* Team */}

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
          =================================================== */}

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

          {/* ==================================================
              HERO CORNER DETAILS
          =================================================== */}

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
            ABOUT
        ===================================================== */}

        <AboutSection />

        {/* ====================================================
            TEAM
        ===================================================== */}

        <TeamSection />

        {/* ====================================================
            EVENTS
        ===================================================== */}

        <EventsSection />

        {/* ====================================================
            GALLERY
        ===================================================== */}

        <GallerySection />

        {/* ====================================================
            CONTACT
        ===================================================== */}

        <ContactSection />

        {/* ====================================================
            FOOTER
        ===================================================== */}

        <Footer />
      </main>
    </>
  );
}
