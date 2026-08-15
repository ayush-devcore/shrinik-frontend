"use client";

import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";

import ScrollReveal from "@/components/effects/ScrollReveal";
import StaggerReveal from "@/components/effects/StaggerReveal";
import SectionHeading from "@/components/effects/SectionHeading";

const events = [
  {
    number: "01",
    title: "Technical Events",
    short: "TECH",
    description:
      "Workshops, competitions and experiences built around technology.",
    tag: "Technology",
  },
  {
    number: "02",
    title: "Cultural Events",
    short: "CULTURE",
    description:
      "Music, dance and creative experiences that bring campus together.",
    tag: "Culture",
  },
  {
    number: "03",
    title: "Workshops",
    short: "LEARN",
    description:
      "Learn, experiment and build alongside the Shrinik community.",
    tag: "Learning",
  },
];

export default function EventsSection() {
  return (
    <section
      id="events"
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

        <div
          className="
            absolute
            left-[-15%]
            top-[10%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#650018]/10
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            right-[-15%]
            bottom-[5%]
            h-[550px]
            w-[550px]
            rounded-full
            bg-[#C6922E]/[0.035]
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[400px]
            w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#650018]/[0.025]
            blur-[130px]
          "
        />

        {/* Technical grid */}

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
          eyebrow="What we do"
          title="Experiences"
          highlight="that stay."
          description="A glimpse into the events, workshops and activities that bring the Shrinik community together."
        />

        {/* ===================================================
            EVENT CARDS
        ==================================================== */}

        <StaggerReveal
          className="
            mt-20
            grid
            gap-5
            md:grid-cols-3
          "
          stagger={0.14}
        >

          {events.map((event, index) => (
            <article
              key={event.number}
              className="
                stagger-item
                group
                relative
                min-h-[430px]
                overflow-hidden
                rounded-[2rem]
                border
                border-white/[0.07]
                bg-[#12070A]
                p-7
                transition-all
                duration-700
                hover:-translate-y-3
                hover:border-[#C6922E]/35
                hover:shadow-[0_30px_100px_rgba(0,0,0,0.35)]
              "
            >

              {/* =================================================
                  BACKGROUND GLOW
              ================================================== */}

              <div
                className="
                  absolute
                  right-[-20%]
                  top-[-20%]
                  h-64
                  w-64
                  rounded-full
                  bg-[#C6922E]/[0.035]
                  blur-[80px]
                  transition-all
                  duration-700
                  group-hover:bg-[#C6922E]/10
                "
              />

              <div
                className="
                  absolute
                  bottom-[-20%]
                  left-[-20%]
                  h-48
                  w-48
                  rounded-full
                  bg-[#650018]/20
                  blur-[80px]
                  transition-all
                  duration-700
                  group-hover:bg-[#650018]/35
                "
              />

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
                  backgroundSize: "45px 45px",
                }}
              />

              {/* =================================================
                  CARD CONTENT
              ================================================== */}

              <div
                className="
                  relative
                  flex
                  h-full
                  flex-col
                  justify-between
                "
              >

                {/* TOP */}

                <div>

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                    "
                  >

                    <div>

                      <span
                        className="
                          text-xs
                          text-[#C6922E]
                        "
                      >
                        {event.number}
                      </span>

                      <p
                        className="
                          mt-2
                          text-[8px]
                          uppercase
                          tracking-[0.3em]
                          text-white/20
                        "
                      >
                        {event.tag}
                      </p>

                    </div>

                    {/* Arrow */}

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/10
                        text-white/25
                        transition-all
                        duration-500
                        group-hover:-translate-y-1
                        group-hover:translate-x-1
                        group-hover:border-[#C6922E]/50
                        group-hover:bg-[#C6922E]/10
                        group-hover:text-[#C6922E]
                      "
                    >
                      <ArrowUpRight size={16} />
                    </div>

                  </div>

                  {/* =================================================
                      ABSTRACT EVENT VISUAL
                  ================================================== */}

                  <div
                    className="
                      relative
                      mt-10
                      flex
                      h-28
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/[0.06]
                      bg-black/20
                    "
                  >

                    {/* Orbit */}

                    <div
                      className="
                        absolute
                        h-20
                        w-20
                        rounded-full
                        border
                        border-[#C6922E]/20
                        transition-transform
                        duration-1000
                        group-hover:scale-125
                        group-hover:rotate-12
                      "
                    />

                    <div
                      className="
                        absolute
                        h-14
                        w-14
                        rounded-full
                        border
                        border-dashed
                        border-[#C6922E]/15
                        transition-transform
                        duration-1000
                        group-hover:scale-110
                        group-hover:-rotate-12
                      "
                    />

                    {/* Icon */}

                    {index === 0 && (
                      <div
                        className="
                          relative
                          z-10
                          text-3xl
                          font-light
                          text-[#C6922E]/70
                        "
                      >
                        &lt;/&gt;
                      </div>
                    )}

                    {index === 1 && (
                      <div
                        className="
                          relative
                          z-10
                          text-3xl
                          text-[#C6922E]/70
                        "
                      >
                        ✦
                      </div>
                    )}

                    {index === 2 && (
                      <div
                        className="
                          relative
                          z-10
                          text-3xl
                          text-[#C6922E]/70
                        "
                      >
                        +
                      </div>
                    )}

                    {/* Light */}

                    <div
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        h-16
                        w-16
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-[#C6922E]/10
                        blur-[30px]
                      "
                    />

                  </div>

                </div>

                {/* =================================================
                    BOTTOM
                ================================================== */}

                <div>

                  <div
                    className="
                      mb-7
                      h-px
                      w-12
                      bg-[#C6922E]/50
                      transition-all
                      duration-500
                      group-hover:w-24
                    "
                  />

                  <h3
                    className="
                      text-3xl
                      font-medium
                      leading-[0.95]
                      tracking-[-0.045em]
                      text-[#F5F1E8]
                      md:text-4xl
                    "
                  >
                    {event.title}
                  </h3>

                  <p
                    className="
                      mt-5
                      max-w-sm
                      text-sm
                      leading-7
                      text-white/30
                    "
                  >
                    {event.description}
                  </p>

                  {/* Bottom meta */}

                  <div
                    className="
                      mt-7
                      flex
                      items-center
                      justify-between
                      border-t
                      border-white/[0.06]
                      pt-5
                    "
                  >

                    <span
                      className="
                        text-[8px]
                        uppercase
                        tracking-[0.25em]
                        text-white/20
                      "
                    >
                      Shrinik
                    </span>

                    <span
                      className="
                        text-[8px]
                        uppercase
                        tracking-[0.25em]
                        text-[#C6922E]/50
                      "
                    >
                      {event.short}
                    </span>

                  </div>

                </div>

              </div>

              {/* Active bottom line */}

              <div
                className="
                  absolute
                  bottom-0
                  left-7
                  h-px
                  w-0
                  bg-[#C6922E]
                  transition-all
                  duration-700
                  group-hover:w-[calc(100%-3.5rem)]
                "
              />

            </article>
          ))}

        </StaggerReveal>

        {/* ===================================================
            UPCOMING / PLACEHOLDER STRIP
        ==================================================== */}

        <ScrollReveal delay={0.2}>

          <div
            className="
              mt-10
              overflow-hidden
              rounded-[1.7rem]
              border
              border-white/[0.07]
              bg-white/[0.015]
            "
          >

            <div
              className="
                flex
                flex-col
                gap-6
                p-6
                md:flex-row
                md:items-center
                md:justify-between
                md:px-8
                md:py-7
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#C6922E]/20
                    bg-[#C6922E]/[0.04]
                    text-[#C6922E]/70
                  "
                >
                  <CalendarDays size={17} />
                </div>

                <div>

                  <span
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.3em]
                      text-[#C6922E]
                    "
                  >
                    Event calendar
                  </span>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-white/35
                    "
                  >
                    Upcoming experiences will
                    appear here.
                  </p>

                </div>

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <Sparkles
                  size={14}
                  className="text-[#C6922E]/50"
                />

                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    text-white/20
                  "
                >
                  More experiences coming soon
                </span>

              </div>

            </div>

          </div>

        </ScrollReveal>

      </div>
    </section>
  );
}