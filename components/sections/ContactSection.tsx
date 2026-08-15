"use client";

import { ArrowUpRight, Mail } from "lucide-react";

import ScrollReveal from "@/components/effects/ScrollReveal";
import Magnetic from "@/components/effects/Magnetic";
import SectionHeading from "@/components/effects/SectionHeading";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#080808] px-6 py-32 md:px-12 md:py-40"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#650018]/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl">

        <SectionHeading
          eyebrow="Get involved"
          title="Let's build"
          highlight="something together."
          description="Have an idea, want to collaborate, or simply want to be part of Shrinik? We'd love to hear from you."
        />

        <ScrollReveal delay={0.2} y={70}>
          <div className="mt-16 overflow-hidden rounded-[2.5rem] border border-[#C6922E]/15 bg-gradient-to-br from-[#3A0712] via-[#17060A] to-[#080808] p-8 md:p-14">

            <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">

              <div>

                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C6922E]/25 bg-[#C6922E]/[0.06] text-[#C6922E]">
                  <Mail size={20} />
                </div>

                <p className="mt-8 text-[9px] uppercase tracking-[0.3em] text-[#C6922E]">
                  Start a conversation
                </p>

                <h3 className="mt-4 max-w-xl text-4xl font-medium leading-[0.95] tracking-[-0.04em] text-[#F5F1E8] md:text-6xl">
                  Your next idea could start here.
                </h3>

              </div>

              <Magnetic strength={0.18}>

                <a
                  href="mailto:shrinik@example.com"
                  className="group flex items-center gap-4 rounded-full bg-[#C6922E] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#080808] transition-all duration-300 hover:bg-[#E3C477] hover:shadow-[0_0_50px_rgba(198,146,46,0.2)]"
                >
                  Contact Shrinik

                  <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight size={15} />
                  </span>
                </a>

              </Magnetic>

            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}