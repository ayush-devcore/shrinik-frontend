"use client";

import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import ScrollReveal from "@/components/effects/ScrollReveal";
import Magnetic from "@/components/effects/Magnetic";
import SectionHeading from "@/components/effects/SectionHeading";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="
        relative
        overflow-hidden
        bg-[#080808]
        px-6
        py-32
        md:px-12
        md:py-40
      "
    >
      {/* =====================================================
          BACKGROUND ATMOSPHERE
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* Main burgundy glow */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[600px]
            w-[600px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#650018]/10
            blur-[160px]
          "
        />

        {/* Gold glow */}

        <div
          className="
            absolute
            right-[-15%]
            top-[15%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#C6922E]/[0.035]
            blur-[130px]
          "
        />

        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage:
              `
              linear-gradient(
                rgba(255,255,255,.4) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,.4) 1px,
                transparent 1px
              )
              `,
            backgroundSize: "80px 80px",
          }}
        />

      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ===================================================
            HEADING
        ==================================================== */}

        <SectionHeading
          eyebrow="Get involved"
          title="Let's build"
          highlight="something together."
          description="Have an idea, want to collaborate, or simply want to be part of Shrinik? We'd love to hear from you."
        />

        {/* ===================================================
            CTA CARD
        ==================================================== */}

        <ScrollReveal delay={0.18} y={80}>

          <div
            className="
              group
              relative
              mt-16
              overflow-hidden
              rounded-[2.5rem]
              border
              border-[#C6922E]/15
              bg-gradient-to-br
              from-[#3A0712]
              via-[#17060A]
              to-[#080808]
              p-8
              shadow-[0_30px_100px_rgba(0,0,0,0.35)]
              md:p-14
            "
          >

            {/* =================================================
                CARD GRID
            ================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.035]
              "
              style={{
                backgroundImage:
                  `
                  linear-gradient(
                    rgba(255,255,255,.5) 1px,
                    transparent 1px
                  ),
                  linear-gradient(
                    90deg,
                    rgba(255,255,255,.5) 1px,
                    transparent 1px
                  )
                  `,
                backgroundSize: "55px 55px",
              }}
            />

            {/* =================================================
                DECORATIVE GLOW
            ================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                right-[-10%]
                top-[-30%]
                h-[400px]
                w-[400px]
                rounded-full
                bg-[#C6922E]/[0.06]
                blur-[100px]
                transition-all
                duration-1000
                group-hover:bg-[#C6922E]/10
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-[-25%]
                left-[-10%]
                h-[300px]
                w-[300px]
                rounded-full
                bg-[#650018]/25
                blur-[100px]
              "
            />

            {/* =================================================
                ORBIT DECORATION
            ================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                right-[-80px]
                top-1/2
                hidden
                h-[360px]
                w-[360px]
                -translate-y-1/2
                rounded-full
                border
                border-[#C6922E]/[0.07]
                md:block
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                right-[-20px]
                top-1/2
                hidden
                h-[240px]
                w-[240px]
                -translate-y-1/2
                rounded-full
                border
                border-dashed
                border-[#C6922E]/[0.08]
                md:block
              "
            />

            {/* =================================================
                MAIN CONTENT
            ================================================== */}

            <div
              className="
                relative
                z-10
                flex
                flex-col
                justify-between
                gap-12
                md:flex-row
                md:items-end
              "
            >

              {/* =================================================
                  LEFT
              ================================================== */}

              <div>

                {/* Icon */}

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#C6922E]/25
                    bg-[#C6922E]/[0.06]
                    text-[#C6922E]
                    transition-all
                    duration-700
                    group-hover:scale-105
                    group-hover:border-[#C6922E]/50
                    group-hover:bg-[#C6922E]/10
                  "
                >
                  <Mail size={20} />
                </div>

                {/* Label */}

                <div
                  className="
                    mt-8
                    flex
                    items-center
                    gap-3
                  "
                >

                  <span
                    className="
                      h-px
                      w-8
                      bg-[#C6922E]/60
                    "
                  />

                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.3em]
                      text-[#C6922E]
                    "
                  >
                    Start a conversation
                  </p>

                </div>

                {/* Heading */}

                <h3
                  className="
                    mt-5
                    max-w-2xl
                    text-4xl
                    font-medium
                    leading-[0.95]
                    tracking-[-0.045em]
                    text-[#F5F1E8]
                    md:text-6xl
                  "
                >
                  Your next idea
                  <br />

                  <span className="text-white/35">
                    could start here.
                  </span>
                </h3>

                {/* Supporting text */}

                <p
                  className="
                    mt-6
                    max-w-lg
                    text-sm
                    leading-7
                    text-white/30
                  "
                >
                  Collaborate with Shrinik,
                  propose an idea, join the
                  community or simply start
                  a conversation.
                </p>

              </div>

              {/* =================================================
                  RIGHT CTA
              ================================================== */}

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  md:items-end
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-[8px]
                    uppercase
                    tracking-[0.25em]
                    text-white/20
                  "
                >
                  <Sparkles
                    size={12}
                    className="text-[#C6922E]/60"
                  />

                  Let's connect
                </div>

                <Magnetic strength={0.18}>

                  <a
                    href="mailto:shrinik@example.com"
                    className="
                      group/button
                      flex
                      items-center
                      gap-4
                      rounded-full
                      bg-[#C6922E]
                      px-7
                      py-4
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#080808]
                      transition-all
                      duration-300
                      hover:bg-[#E3C477]
                      hover:shadow-[0_0_50px_rgba(198,146,46,0.2)]
                      active:scale-95
                    "
                  >
                    Contact Shrinik

                    <span
                      className="
                        transition-transform
                        duration-300
                        group-hover/button:-translate-y-1
                        group-hover/button:translate-x-1
                      "
                    >
                      <ArrowUpRight size={15} />
                    </span>
                  </a>

                </Magnetic>

              </div>

            </div>

            {/* =================================================
                BOTTOM META
            ================================================== */}

            <div
              className="
                relative
                z-10
                mt-12
                flex
                flex-col
                gap-4
                border-t
                border-white/[0.07]
                pt-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    text-white/25
                  "
                >
                  <MessageCircle size={12} />
                </div>

                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.25em]
                    text-white/20
                  "
                >
                  Open for ideas & collaboration
                </span>

              </div>

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.25em]
                  text-[#C6922E]/40
                "
              >
                Shrinik · 2026–27
              </span>

            </div>

          </div>

        </ScrollReveal>

      </div>
    </section>
  );
}