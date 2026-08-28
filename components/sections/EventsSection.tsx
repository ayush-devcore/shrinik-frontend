"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  X,
} from "lucide-react";

import ScrollReveal from "@/components/effects/ScrollReveal";

interface EventItem {
  id: string;
  number: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
}

const events: EventItem[] = [
  {
    id: "valorant-gameplay",
    number: "03",
    date: "14 APR 2025",
    title: "Valorant Gameplay",
    subtitle: "COMPETE · CONNECT · PLAY",
    description:
      "A competitive gaming experience bringing students together through strategy, teamwork and competition.",
    images: [
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.10.45 PM.jpeg",
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.10.46 PM.jpeg",
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.10.47 PM (1).jpeg",
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.10.47 PM.jpeg",
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.10.48 PM (1).jpeg",
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.10.48 PM (2).jpeg",
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.10.48 PM.jpeg",
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.10.49 PM.jpeg",
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.10.50 PM (1).jpeg",
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.10.50 PM (2).jpeg",
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.10.50 PM.jpeg",
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.11.23 PM (1).jpeg",
      "/images/events/valorant-gameplay/WhatsApp Image 2026-04-03 at 4.11.23 PM.jpeg",
    ],
  },
  {
    id: "aurora-orientation",
    number: "02",
    date: "21 SEP 2025",
    title: "Aurora Orientation",
    subtitle: "A NEW BEGINNING",
    description:
      "An orientation experience bringing students together and marking the beginning of a new chapter.",
    images: [
      "/images/events/aurora-orientation/IMG_8215.JPG",
      "/images/events/aurora-orientation/IMG_20250913_151116.jpg",
      "/images/events/aurora-orientation/IMG_20250913_143340451.jpg",
      "/images/events/aurora-orientation/IMG_20250913_145037469.jpg",
      "/images/events/aurora-orientation/IMG_20250913_150655550.jpg",
      "/images/events/aurora-orientation/IMG_20250913_150828995.jpg",
      "/images/events/aurora-orientation/IMG_20250913_152309564.jpg",
      "/images/events/aurora-orientation/IMG20250913150734.jpg",
      "/images/events/aurora-orientation/IMG20250913163142.jpg",
    ],
  },

  {
    id: "nukkad-naatak",
    number: "03",
    date: "07 NOV 2025",
    title: "Nukkad Naatak",
    subtitle: "AWARENESS · PERFORMANCE · EXPRESSION",
    description:
      "A street-play initiative using performance and expression as a powerful medium for awareness and engagement.",
    images: [
      "/images/events/nukkad-naatak/nukkad-01.jpg",
      "/images/events/nukkad-naatak/IMG20251031124328.jpg",
      "/images/events/nukkad-naatak/IMG_2337.JPG",
      "/images/events/nukkad-naatak/IMG_2350.JPG",
    ],
  },

  {
    id: "sansad-25",
    number: "04",
    date: "18 NOV 2025",
    title: "Sansad '25",
    subtitle: "IDEAS · VOICES · DEBATE",
    description:
      "A platform for students to express ideas, exchange perspectives and engage in meaningful debate.",
    images: [
      "/images/events/sansad-25/IMG20251108140908.jpg",
      "/images/events/sansad-25/IMG20251108142702.jpg",
      "/images/events/sansad-25/IMG_3036.jpg",
      "/images/events/sansad-25/IMG_9501.JPG",
      "/images/events/sansad-25/IMG_9514.JPG",
      "/images/events/sansad-25/IMG_9515.JPG",
      "/images/events/sansad-25/IMG_9574.JPG",
    ],
  },

  {
    id: "farewell-batch-26",
    number: "05",
    date: "2026",
    title: "Farewell Batch 26",
    subtitle: "CELEBRATING THE JOURNEY",
    description:
      "A celebration of memories, friendships and the journey shared by the graduating batch.",
    images: [
      "/images/events/farewell-batch-26/DSC05377.JPG",
      "/images/events/farewell-batch-26/DSC05390.JPG",
      "/images/events/farewell-batch-26/DSC05393.JPG",
      "/images/events/farewell-batch-26/DSC05396.JPG",
      "/images/events/farewell-batch-26/DSC05415.JPG",
      "/images/events/farewell-batch-26/DSC05426.JPG",
      "/images/events/farewell-batch-26/DSC05441.JPG",
      "/images/events/farewell-batch-26/DSC05456.JPG",
      "/images/events/farewell-batch-26/DSC05470.JPG",
      "/images/events/farewell-batch-26/DSC05527.JPG",
      "/images/events/farewell-batch-26/DSC05529.JPG",
      "/images/events/farewell-batch-26/DSC05541.JPG",
      "/images/events/farewell-batch-26/DSC05547.JPG",
      "/images/events/farewell-batch-26/DSC05550.JPG",
      "/images/events/farewell-batch-26/DSC05551.JPG",
      "/images/events/farewell-batch-26/DSC05552.JPG",
      "/images/events/farewell-batch-26/DSC05606.JPG",
      "/images/events/farewell-batch-26/IMG_20260526_165253.jpg",
      "/images/events/farewell-batch-26/IMG_20260526_165343.jpg",
      "/images/events/farewell-batch-26/IMG_20260526_165419.jpg",
    ],
  },
];

export default function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const [currentImage, setCurrentImage] = useState(0);

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const openEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setCurrentImage(0);
  };

  const closeEvent = () => {
    setSelectedEvent(null);
    setCurrentImage(0);
  };

  const nextImage = () => {
    if (!selectedEvent?.images.length) return;

    setCurrentImage((prev) =>
      prev === selectedEvent.images.length - 1 ? 0 : prev + 1,
    );
  };

  const previousImage = () => {
    if (!selectedEvent?.images.length) return;

    setCurrentImage((prev) =>
      prev === 0 ? selectedEvent.images.length - 1 : prev - 1,
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (zoomedImage) {
          setZoomedImage(null);
        } else if (selectedEvent) {
          closeEvent();
        }
      }

      if (selectedEvent && !zoomedImage) {
        if (event.key === "ArrowRight") {
          nextImage();
        }

        if (event.key === "ArrowLeft") {
          previousImage();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEvent, zoomedImage]);

  useEffect(() => {
    if (selectedEvent || zoomedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedEvent, zoomedImage]);

  return (
    <>
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
        {/* Background glow */}

        <div
          className="
            pointer-events-none
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
            pointer-events-none
            absolute
            bottom-[5%]
            right-[-15%]
            h-[550px]
            w-[550px]
            rounded-full
            bg-[#C6922E]/[0.035]
            blur-[160px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage: `
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

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-7xl
          "
        >
          {/* Header */}

          <ScrollReveal>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span
                  className="
                    h-px
                    w-8
                    bg-[#C6922E]
                  "
                />

                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.35em]
                    text-[#C6922E]
                  "
                >
                  Our Journey
                </span>
              </div>

              <h2
                className="
                  mt-6
                  text-5xl
                  font-medium
                  leading-[0.9]
                  tracking-[-0.055em]
                  text-[#F5F1E8]
                  md:text-7xl
                "
              >
                Moments
                <br />
                <span className="text-white/25">that shaped us.</span>
              </h2>

              <p
                className="
                  mt-7
                  max-w-xl
                  text-sm
                  leading-7
                  text-white/40
                  md:text-base
                "
              >
                From competition and orientation to expression, debate and
                celebration — these moments form the journey of Shrinik.
              </p>
            </div>
          </ScrollReveal>

          {/* Timeline */}

          <div className="relative mt-24">
            {/* Central line */}

            <div
              className="
                absolute
                bottom-0
                left-5
                top-0
                w-px
                bg-gradient-to-b
                from-transparent
                via-[#C6922E]/30
                to-transparent
                md:left-1/2
                md:-translate-x-1/2
              "
            />

            <div
              className="
                space-y-20
                md:space-y-28
              "
            >
              {events.map((event, index) => {
                const leftSide = index % 2 === 0;

                return (
                  <ScrollReveal key={event.id} delay={index * 0.05} y={45}>
                    <div
                      className="
                        relative
                        grid
                        grid-cols-[40px_1fr]
                        gap-6
                        md:grid-cols-2
                        md:gap-20
                      "
                    >
                      {/* Mobile node */}

                      <div
                        className="
                          absolute
                          left-[13px]
                          top-8
                          z-20
                          h-3
                          w-3
                          rounded-full
                          border
                          border-[#C6922E]
                          bg-[#080808]
                          shadow-[0_0_20px_rgba(198,146,46,0.35)]
                          md:hidden
                        "
                      >
                        <div
                          className="
                            absolute
                            left-1/2
                            top-1/2
                            h-1
                            w-1
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-[#C6922E]
                          "
                        />
                      </div>

                      {/* Desktop left */}

                      <div
                        className={`
                          hidden
                          md:block
                          ${leftSide ? "md:col-start-1" : "md:col-start-2"}
                        `}
                      >
                        {leftSide && (
                          <TimelineCard
                            event={event}
                            align="right"
                            onClick={() => openEvent(event)}
                          />
                        )}
                      </div>

                      {/* Desktop right */}

                      <div
                        className={`
                          hidden
                          md:block
                          ${leftSide ? "md:col-start-2" : "md:col-start-1"}
                        `}
                      >
                        {!leftSide && (
                          <TimelineCard
                            event={event}
                            align="left"
                            onClick={() => openEvent(event)}
                          />
                        )}
                      </div>

                      {/* Mobile */}

                      <div
                        className="
                          col-start-2
                          md:hidden
                        "
                      >
                        <TimelineCard
                          event={event}
                          align="left"
                          onClick={() => openEvent(event)}
                        />
                      </div>

                      {/* Desktop node */}

                      <div
                        className="
                          absolute
                          left-1/2
                          top-8
                          z-30
                          hidden
                          h-4
                          w-4
                          -translate-x-1/2
                          rounded-full
                          border
                          border-[#C6922E]
                          bg-[#080808]
                          shadow-[0_0_25px_rgba(198,146,46,0.3)]
                          md:block
                        "
                      >
                        <div
                          className="
                            absolute
                            left-1/2
                            top-1/2
                            h-1.5
                            w-1.5
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-[#C6922E]
                          "
                        />
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* End */}

          <ScrollReveal delay={0.2}>
            <div
              className="
                mt-20
                flex
                flex-col
                items-center
                gap-4
              "
            >
              <div
                className="
                  h-12
                  w-px
                  bg-gradient-to-b
                  from-[#C6922E]/30
                  to-transparent
                "
              />

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.35em]
                  text-white/15
                "
              >
                More memories ahead
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =====================================================
          EVENT GALLERY
      ====================================================== */}

      {selectedEvent && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/80
            p-4
            backdrop-blur-xl
            md:p-8
          "
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeEvent();
            }
          }}
        >
          <div
            className="
              relative
              w-full
              max-w-4xl
              overflow-hidden
              rounded-[2rem]
              border
              border-[#C6922E]/20
              bg-[#100608]
              shadow-[0_40px_140px_rgba(0,0,0,0.8)]
            "
          >
            {/* Close */}

            <button
              type="button"
              onClick={closeEvent}
              aria-label="Close event gallery"
              className="
                absolute
                right-5
                top-5
                z-40
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-black/60
                text-white/50
                backdrop-blur-xl
                transition-all
                hover:border-[#C6922E]/40
                hover:bg-[#C6922E]/10
                hover:text-[#C6922E]
              "
            >
              <X size={17} />
            </button>

            {/* Header */}

            <div
              className="
                px-6
                pb-5
                pt-7
                md:px-8
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    text-[9px]
                    tracking-[0.3em]
                    text-[#C6922E]
                  "
                >
                  {selectedEvent.date}
                </span>

                <span
                  className="
                    h-px
                    w-7
                    bg-[#C6922E]/40
                  "
                />

                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.3em]
                    text-white/25
                  "
                >
                  {selectedEvent.subtitle}
                </span>
              </div>

              <h3
                className="
                  mt-3
                  pr-12
                  text-3xl
                  font-medium
                  tracking-[-0.04em]
                  text-[#F5F1E8]
                  md:text-4xl
                "
              >
                {selectedEvent.title}
              </h3>
            </div>

            {/* Carousel */}

            {selectedEvent.images.length > 0 ? (
              <div
                className="
                  px-4
                  pb-6
                  md:px-8
                "
              >
                <div
                  className="
                    relative
                    aspect-[16/10]
                    overflow-hidden
                    rounded-[1.5rem]
                    border
                    border-white/[0.07]
                    bg-black
                  "
                >
                  <img
                    key={selectedEvent.images[currentImage]}
                    src={selectedEvent.images[currentImage]}
                    alt={`${selectedEvent.title} photo ${currentImage + 1}`}
                    className="
                      h-full
                      w-full
                      cursor-zoom-in
                      object-contain
                      transition-transform
                      duration-500
                      hover:scale-[1.015]
                    "
                    onClick={() =>
                      setZoomedImage(selectedEvent.images[currentImage])
                    }
                  />

                  {/* Previous */}

                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous photo"
                    className="
                      absolute
                      left-4
                      top-1/2
                      flex
                      h-11
                      w-11
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/10
                      bg-black/55
                      text-white/60
                      backdrop-blur-xl
                      transition-all
                      hover:border-[#C6922E]/50
                      hover:bg-[#C6922E]/10
                      hover:text-[#C6922E]
                    "
                  >
                    <ArrowLeft size={17} />
                  </button>

                  {/* Next */}

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next photo"
                    className="
                      absolute
                      right-4
                      top-1/2
                      flex
                      h-11
                      w-11
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/10
                      bg-black/55
                      text-white/60
                      backdrop-blur-xl
                      transition-all
                      hover:border-[#C6922E]/50
                      hover:bg-[#C6922E]/10
                      hover:text-[#C6922E]
                    "
                  >
                    <ArrowRight size={17} />
                  </button>

                  {/* Counter */}

                  <div
                    className="
                      absolute
                      bottom-4
                      left-1/2
                      -translate-x-1/2
                      rounded-full
                      border
                      border-white/10
                      bg-black/65
                      px-4
                      py-2
                      text-[9px]
                      tracking-[0.2em]
                      text-white/50
                      backdrop-blur-xl
                    "
                  >
                    {String(currentImage + 1).padStart(2, "0")}

                    {" / "}

                    {String(selectedEvent.images.length).padStart(2, "0")}
                  </div>
                </div>

                {/* Dots */}

                <div
                  className="
                    mt-5
                    flex
                    max-w-full
                    items-center
                    justify-center
                    gap-1.5
                    overflow-hidden
                  "
                >
                  {selectedEvent.images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImage(index)}
                      aria-label={`View photo ${index + 1}`}
                      className={`
                          h-1
                          rounded-full
                          transition-all
                          duration-300
                          ${
                            index === currentImage
                              ? "w-7 bg-[#C6922E]"
                              : "w-1.5 bg-white/20 hover:bg-white/40"
                          }
                        `}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="
                  mx-4
                  mb-6
                  flex
                  aspect-[16/8]
                  items-center
                  justify-center
                  rounded-[1.5rem]
                  border
                  border-dashed
                  border-white/[0.08]
                  bg-black/20
                  md:mx-8
                "
              >
                <div className="text-center">
                  <CalendarDays
                    size={24}
                    className="
                      mx-auto
                      text-[#C6922E]/40
                    "
                  />

                  <p
                    className="
                      mt-4
                      text-[9px]
                      uppercase
                      tracking-[0.3em]
                      text-white/25
                    "
                  >
                    Event gallery
                  </p>

                  <p
                    className="
                      mt-2
                      text-xs
                      text-white/15
                    "
                  >
                    Photos coming soon
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          COMPACT PHOTO ZOOM
      ====================================================== */}

      {zoomedImage && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            bg-black/90
            p-4
            backdrop-blur-2xl
          "
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="
              relative
              max-h-[90vh]
              max-w-[90vw]
              overflow-hidden
              rounded-[1.5rem]
              border
              border-[#C6922E]/25
              bg-[#100608]
              shadow-[0_40px_120px_rgba(0,0,0,0.8)]
            "
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              aria-label="Close full photo"
              className="
                absolute
                right-4
                top-4
                z-20
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-black/60
                text-white/50
                backdrop-blur-xl
                transition-all
                hover:border-[#C6922E]/40
                hover:text-[#C6922E]
              "
            >
              <X size={15} />
            </button>

            <img
              src={zoomedImage}
              alt="Full event photo"
              className="
                max-h-[85vh]
                max-w-[85vw]
                object-contain
              "
            />
          </div>
        </div>
      )}
    </>
  );
}

/*
|--------------------------------------------------------------------------
| TIMELINE CARD
|--------------------------------------------------------------------------
*/

interface TimelineCardProps {
  event: EventItem;
  align: "left" | "right";
  onClick: () => void;
}

function TimelineCard({ event, align, onClick }: TimelineCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        relative
        w-full
        overflow-hidden
        rounded-[2rem]
        border
        border-white/[0.07]
        bg-[#12070A]
        p-7
        text-left
        transition-all
        duration-700
        hover:-translate-y-2
        hover:border-[#C6922E]/35
        hover:shadow-[0_30px_100px_rgba(0,0,0,0.35)]
        ${align === "right" ? "md:text-right" : "md:text-left"}
      `}
    >
      {/* Glow */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-20%]
          top-[-25%]
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
          pointer-events-none
          absolute
          bottom-[-25%]
          left-[-20%]
          h-48
          w-48
          rounded-full
          bg-[#650018]/20
          blur-[80px]
        "
      />

      {/* Grid */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
        "
        style={{
          backgroundImage: `
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

      <div className="relative z-10">
        {/* Date */}

        <div
          className={`
            flex
            items-center
            justify-between
            ${align === "right" ? "md:flex-row-reverse" : ""}
          `}
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                text-[9px]
                tracking-[0.25em]
                text-[#C6922E]
              "
            >
              {event.number}
            </span>

            <span
              className="
                h-px
                w-6
                bg-[#C6922E]/30
              "
            />

            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.25em]
                text-white/35
              "
            >
              {event.date}
            </span>
          </div>

          <ArrowUpRight
            size={16}
            className="
              text-white/20
              transition-all
              duration-500
              group-hover:-translate-y-1
              group-hover:translate-x-1
              group-hover:text-[#C6922E]
            "
          />
        </div>

        {/* Title */}

        <div className="mt-12">
          <div
            className={`
              mb-5
              h-px
              w-10
              bg-[#C6922E]/50
              transition-all
              duration-500
              group-hover:w-20
              ${align === "right" ? "md:ml-auto" : ""}
            `}
          />

          <p
            className="
              text-[8px]
              uppercase
              tracking-[0.3em]
              text-white/20
            "
          >
            {event.subtitle}
          </p>

          <h3
            className="
              mt-3
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
        </div>

        {/* Description */}

        <p
          className={`
            mt-6
            max-w-md
            text-sm
            leading-7
            text-white/30
            ${align === "right" ? "md:ml-auto" : ""}
          `}
        >
          {event.description}
        </p>

        {/* Footer */}

        <div
          className={`
            mt-7
            flex
            items-center
            border-t
            border-white/[0.06]
            pt-5
            ${align === "right" ? "justify-end" : "justify-between"}
          `}
        >
          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.25em]
              text-white/20
            "
          >
            Explore event
          </span>

          <span
            className="
              ml-6
              text-[8px]
              uppercase
              tracking-[0.25em]
              text-[#C6922E]/50
            "
          >
            View gallery →
          </span>
        </div>
      </div>

      {/* Bottom gold line */}

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
    </button>
  );
}
