"use client";

import { ArrowUpRight } from "lucide-react";

import ScrollReveal from "@/components/effects/ScrollReveal";
import StaggerReveal from "@/components/effects/StaggerReveal";
import SectionHeading from "@/components/effects/SectionHeading";

const events = [
  {
    number: "01",
    title: "Technical Events",
    description:
      "Workshops, competitions and experiences built around technology.",
  },
  {
    number: "02",
    title: "Cultural Events",
    description:
      "Music, dance and creative experiences that bring campus together.",
  },
  {
    number: "03",
    title: "Workshops",
    description:
      "Learn, experiment and build alongside the Shrinik community.",
  },
];

export default function EventsSection() {
  return (
    <section
      id="events"
      className="relative overflow-hidden bg-[#080808] px-6 py-32 md:px-12 md:py-40"
    >
      <div className="relative z-10 mx-auto max-w-7xl">

        <SectionHeading
          eyebrow="What we do"
          title="Experiences"
          highlight="that stay."
          description="A glimpse into the events, workshops and activities that bring the Shrinik community together."
        />

        <StaggerReveal
          className="mt-20 grid gap-5 md:grid-cols-3"
          stagger={0.14}
        >
          {events.map((event) => (
            <article
              key={event.number}
              className="stagger-item group relative min-h-[390px] overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#12070A] p-7 transition-all duration-700 hover:-translate-y-2 hover:border-[#C6922E]/30"
            >
              <div className="absolute right-[-20%] top-[-20%] h-56 w-56 rounded-full bg-[#C6922E]/[0.04] blur-[70px] transition-all duration-700 group-hover:bg-[#C6922E]/10" />

              <div className="relative flex h-full flex-col justify-between">

                <div className="flex items-start justify-between">
                  <span className="text-xs text-[#C6922E]">
                    {event.number}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/30 transition-all duration-500 group-hover:border-[#C6922E]/40 group-hover:text-[#C6922E]">
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                <div>
                  <div className="mb-8 h-px w-12 bg-[#C6922E]/50 transition-all duration-500 group-hover:w-24" />

                  <h3 className="text-3xl font-medium leading-[0.95] tracking-[-0.04em] text-[#F5F1E8]">
                    {event.title}
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-white/30">
                    {event.description}
                  </p>
                </div>

              </div>
            </article>
          ))}
        </StaggerReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-8 flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-white/20">
            <span className="h-px w-8 bg-[#C6922E]/30" />
            More experiences coming soon
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}