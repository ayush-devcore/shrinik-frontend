"use client";

import ScrollReveal from "@/components/effects/ScrollReveal";
import Parallax from "@/components/effects/Parallax";
import SectionHeading from "@/components/effects/SectionHeading";

const galleryItems = [
  {
    title: "Campus",
    image: "/assets/gallery/campus.jpg",
  },
  {
    title: "Events",
    image: "/assets/gallery/events.jpg",
  },
  {
    title: "Community",
    image: "/assets/gallery/community.jpg",
  },
];

export default function GallerySection() {
  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-[#0d0206] px-6 py-32 md:px-12 md:py-40"
    >
      <div className="relative z-10 mx-auto max-w-7xl">

        <SectionHeading
          eyebrow="Gallery"
          title="Moments"
          highlight="with Shrinik."
          description="The people, experiences and memories that make the club what it is."
        />

        <div className="mt-20 grid gap-5 md:grid-cols-3">

          {galleryItems.map((item, index) => (
            <ScrollReveal
              key={item.title}
              delay={index * 0.12}
              y={70}
            >
              <div className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#12070A]">

                <Parallax speed={index % 2 === 0 ? 45 : 70}>
                  <div className="relative aspect-[4/5]">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-[115%] w-full object-cover opacity-70 grayscale transition-all duration-1000 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />

                    <div className="absolute bottom-6 left-6">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#C6922E]">
                        Shrinik
                      </span>

                      <h3 className="mt-2 text-2xl font-medium text-[#F5F1E8]">
                        {item.title}
                      </h3>
                    </div>

                  </div>
                </Parallax>

              </div>
            </ScrollReveal>
          ))}

        </div>

      </div>
    </section>
  );
}