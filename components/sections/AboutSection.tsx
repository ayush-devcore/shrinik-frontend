"use client";

import ScrollReveal from "@/components/effects/ScrollReveal";
import Parallax from "@/components/effects/Parallax";
import SectionHeading from "@/components/effects/SectionHeading";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#0d0206] px-6 py-32 md:px-12 md:py-40"
    >
      {/* Background */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-[20%] h-[450px] w-[450px] rounded-full bg-[#650018]/10 blur-[150px]" />

        <div className="absolute right-[-15%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-[#C6922E]/[0.035] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        <SectionHeading
          eyebrow="About Shrinik"
          title="More than"
          highlight="a club."
          description="Shrinik is a student-driven community at G.L. Bajaj where technology, creativity and culture come together."
        />

        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">

          {/* Visual */}

          <ScrollReveal y={80}>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#12070A]">

              <Parallax speed={50}>
                <div className="relative aspect-[4/5]">

                  <div className="absolute inset-0 bg-gradient-to-br from-[#650018] via-[#22070D] to-[#050505]" />

                  <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
                      backgroundSize: "50px 50px",
                    }}
                  />

                  <div className="absolute left-1/2 top-1/2 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#C6922E]/25">

                    <div className="absolute inset-6 rounded-full border border-[#C6922E]/20" />

                    <img
                      src="/assets/favicon.png"
                      alt="Shrinik"
                      className="relative z-10 h-32 w-32 object-contain drop-shadow-[0_0_35px_rgba(198,146,46,.25)]"
                    />

                  </div>

                  <div className="absolute bottom-7 left-7">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#C6922E]">
                      G.L. Bajaj
                    </span>

                    <p className="mt-2 text-2xl font-medium tracking-tight text-[#F5F1E8]">
                      Technology.
                      <br />
                      Creativity.
                      <br />
                      Culture.
                    </p>
                  </div>

                </div>
              </Parallax>

            </div>
          </ScrollReveal>

          {/* Text */}

          <div className="space-y-10">

            <ScrollReveal delay={0.1}>
              <div className="border-l border-[#C6922E]/30 pl-6">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#C6922E]">
                  Our identity
                </span>

                <p className="mt-5 text-xl leading-9 text-[#F5F1E8]/80 md:text-2xl">
                  A space where students don't just
                  participate — they create.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.18}>
              <p className="text-sm leading-8 text-white/35 md:text-base">
                From building technology and organising
                events to creating music, dance, media and
                campaigns, Shrinik brings different talents
                together under one community.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.26}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">

                {[
                  ["01", "Technology"],
                  ["02", "Creativity"],
                  ["03", "Culture"],
                ].map(([number, label]) => (
                  <div
                    key={number}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#C6922E]/30"
                  >
                    <span className="text-xs text-[#C6922E]">
                      {number}
                    </span>

                    <p className="mt-8 text-xs uppercase tracking-[0.15em] text-white/50">
                      {label}
                    </p>
                  </div>
                ))}

              </div>
            </ScrollReveal>

          </div>

        </div>
      </div>
    </section>
  );
}