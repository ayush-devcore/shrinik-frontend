"use client";

import type { MouseEvent, ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  teamGroups,
  type TeamMember,
} from "@/data/team";

gsap.registerPlugin(ScrollTrigger);

/*
 * ============================================================
 * TEAM SECTION
 * ============================================================
 */

export default function TeamSection() {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const teamTrackRef = useRef<HTMLDivElement>(null);
  const memberTrackRef = useRef<HTMLDivElement>(null);

  const activeTeam = teamGroups[activeTeamIndex];
  const members = activeTeam?.members ?? [];

  /*
   * ==========================================================
   * SCROLL HELPER
   * ==========================================================
   */

  const scrollToElement = useCallback(
    (
      track: HTMLDivElement | null,
      selector: string,
      index: number
    ) => {
      if (!track) return;

      const items =
        track.querySelectorAll<HTMLElement>(selector);

      const item = items[index];

      if (!item) return;

      const trackRect = track.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const isVisible =
        itemRect.left >= trackRect.left + 8 &&
        itemRect.right <= trackRect.right - 8;

      if (isVisible) return;

      item.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    },
    []
  );

  /*
   * ==========================================================
   * TEAM NAVIGATION
   * ==========================================================
   */

  const changeTeam = useCallback(
    (index: number) => {
      if (!teamGroups.length) return;

      const next =
        (index + teamGroups.length) %
        teamGroups.length;

      setActiveTeamIndex(next);
      setActiveMemberIndex(0);

      requestAnimationFrame(() => {
        scrollToElement(
          teamTrackRef.current,
          ".team-category-card",
          next
        );
      });
    },
    [scrollToElement]
  );

  const previousTeam = useCallback(() => {
    changeTeam(activeTeamIndex - 1);
  }, [activeTeamIndex, changeTeam]);

  const nextTeam = useCallback(() => {
    changeTeam(activeTeamIndex + 1);
  }, [activeTeamIndex, changeTeam]);

  /*
   * ==========================================================
   * MEMBER NAVIGATION
   * ==========================================================
   */

  const changeMember = useCallback(
    (index: number) => {
      if (!members.length) return;

      const next =
        (index + members.length) %
        members.length;

      setActiveMemberIndex(next);

      requestAnimationFrame(() => {
        scrollToElement(
          memberTrackRef.current,
          ".team-member-card",
          next
        );
      });
    },
    [members.length, scrollToElement]
  );

  const previousMember = useCallback(() => {
    if (!members.length) return;

    changeMember(activeMemberIndex - 1);
  }, [
    activeMemberIndex,
    changeMember,
    members.length,
  ]);

  const nextMember = useCallback(() => {
    if (!members.length) return;

    changeMember(activeMemberIndex + 1);
  }, [
    activeMemberIndex,
    changeMember,
    members.length,
  ]);

  /*
   * ==========================================================
   * RESET MEMBER POSITION WHEN TEAM CHANGES
   * ==========================================================
   */

  useEffect(() => {
    if (!members.length) return;

    requestAnimationFrame(() => {
      scrollToElement(
        memberTrackRef.current,
        ".team-member-card",
        0
      );
    });
  }, [
    activeTeamIndex,
    members.length,
    scrollToElement,
  ]);

  /*
   * ==========================================================
   * KEYBOARD CONTROLS
   * ==========================================================
   */

  useEffect(() => {
    const handleKeyboard = (
      event: KeyboardEvent
    ) => {
      const target =
        event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      /*
       * Only control the carousel when the
       * team section is reasonably visible.
       */

      const section = sectionRef.current;

      if (!section) return;

      const rect =
        section.getBoundingClientRect();

      const visible =
        rect.bottom > 0 &&
        rect.top < window.innerHeight;

      if (!visible) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousMember();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextMember();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [previousMember, nextMember]);

  /*
   * ==========================================================
   * TEAM SECTION ENTRANCE ANIMATION
   * ==========================================================
   */

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });

      timeline
        .fromTo(
          ".team-eyebrow",
          {
            opacity: 0,
            y: 25,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
          }
        )

        .fromTo(
          ".team-heading",
          {
            opacity: 0,
            y: 55,
            filter: "blur(12px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.4"
        )

        .fromTo(
          ".team-description",
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
          },
          "-=0.45"
        )

        .fromTo(
          ".team-category-card",
          {
            opacity: 0,
            y: 45,
            scale: 0.94,
            rotateX: 8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.75,
            stagger: 0.07,
            ease: "power3.out",
          },
          "-=0.35"
        );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  /*
   * ==========================================================
   * TEAM CHANGE ANIMATION
   * ==========================================================
   */

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .fromTo(
          ".team-content-animate",
          {
            opacity: 0,
            y: 28,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.055,
            ease: "power3.out",
          }
        )

        .fromTo(
          ".team-member-card",
          {
            opacity: 0,
            y: 35,
            scale: 0.96,
            rotateY: -4,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            duration: 0.7,
            stagger: 0.075,
            ease: "power3.out",
          },
          "-=0.35"
        );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [activeTeamIndex]);

  /*
   * ==========================================================
   * SCROLL TRIGGER REFRESH
   * ==========================================================
   */

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeTeamIndex]);

  /*
   * ==========================================================
   * SAFETY
   * ==========================================================
   */

  if (!activeTeam) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="team"
      className="
        relative
        overflow-hidden
        bg-[#080707]
        px-6
        py-28
        md:px-12
        md:py-36
      "
      style={{
        perspective: "1400px",
      }}
    >
      {/* ======================================================
          BACKGROUND ATMOSPHERE
      ======================================================= */}

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
            top-[35%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#C6922E]/[0.035]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            bottom-[-20%]
            left-1/2
            h-[450px]
            w-[750px]
            -translate-x-1/2
            rounded-full
            bg-[#650018]/[0.05]
            blur-[130px]
          "
        />

        <div
          className="
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
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
        "
      >
        {/* ====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            justify-between
            gap-8
            md:flex-row
            md:items-end
          "
        >
          <div>
            <div
              className="
                team-eyebrow
                flex
                items-center
                gap-3
              "
            >
              <span className="h-px w-8 bg-[#C6922E]" />

              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.4em]
                  text-[#C6922E]
                "
              >
                The People
              </span>
            </div>

            <h2
              className="
                team-heading
                mt-6
                text-5xl
                font-medium
                leading-[0.88]
                tracking-[-0.055em]
                text-[#F5F1E8]
                sm:text-6xl
                md:text-7xl
                lg:text-8xl
              "
            >
              Meet the
              <br />

              <span className="text-white/25">
                people behind Shrinik.
              </span>
            </h2>
          </div>

          <div
            className="
              team-description
              max-w-sm
              md:pb-1
            "
          >
            <p
              className="
                text-sm
                leading-7
                text-white/35
                md:text-base
              "
            >
              One community. Different skills.
              Different ideas. One team building
              the Shrinik experience.
            </p>
          </div>
        </div>

        {/* ====================================================
            TEAM CATEGORY SELECTOR
        ===================================================== */}

        <div className="team-content-animate mt-20">

          <div
            className="
              mb-6
              flex
              items-center
              justify-between
            "
          >
            <div className="flex items-center gap-3">
              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.3em]
                  text-white/20
                "
              >
                Select team
              </span>

              <span className="h-px w-8 bg-white/10" />
            </div>

            <div className="flex gap-2">
              <RoundButton
                label="Previous team"
                onClick={previousTeam}
              >
                <ArrowLeft size={15} />
              </RoundButton>

              <RoundButton
                label="Next team"
                onClick={nextTeam}
              >
                <ArrowRight size={15} />
              </RoundButton>
            </div>
          </div>

          {/* Category carousel */}

          <div
            ref={teamTrackRef}
            className="
              flex
              snap-x
              snap-mandatory
              gap-5
              overflow-x-auto
              px-1
              pb-8
              scrollbar-hide
              md:gap-6
              scroll-smooth
            "
          >
            {teamGroups.map((team, index) => (
              <TeamVisualCard
                key={team.id}
                team={team}
                index={index}
                active={index === activeTeamIndex}
                onClick={() => changeTeam(index)}
              />
            ))}
          </div>
        </div>

        {/* ====================================================
            SELECTED TEAM HEADER
        ===================================================== */}

        <div
          className="
            team-content-animate
            mt-8
            border-t
            border-white/[0.08]
            pt-10
          "
        >
          <div
            className="
              flex
              items-end
              justify-between
              gap-8
            "
          >
            <div>
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
                    uppercase
                    tracking-[0.3em]
                    text-[#C6922E]
                  "
                >
                  Selected team
                </span>

                <span className="h-px w-10 bg-[#C6922E]/30" />

                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.25em]
                    text-white/20
                  "
                >
                  {teamCategoryLabel(
                    activeTeam.category
                  )}
                </span>
              </div>

              <h3
                className="
                  mt-4
                  text-4xl
                  font-medium
                  tracking-[-0.04em]
                  text-[#F5F1E8]
                  sm:text-5xl
                  md:text-6xl
                "
              >
                {activeTeam.name}
              </h3>
            </div>

            <div
              className="
                hidden
                text-right
                md:block
              "
            >
              <span
                className="
                  text-4xl
                  font-light
                  text-[#C6922E]
                "
              >
                {String(members.length).padStart(2, "0")}
              </span>

              <p
                className="
                  mt-1
                  text-[8px]
                  uppercase
                  tracking-[0.25em]
                  text-white/25
                "
              >
                Active members
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================
            MEMBER CAROUSEL
        ===================================================== */}

        <div
          className="
            team-content-animate
            relative
            mt-12
          "
        >
          {/* Desktop previous */}

          <button
            type="button"
            aria-label="Previous member"
            onClick={previousMember}
            className="
              absolute
              left-0
              top-1/2
              z-30
              hidden
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-[#080707]/80
              text-white/40
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-[#C6922E]/50
              hover:bg-[#C6922E]/10
              hover:text-[#C6922E]
              active:scale-95
              lg:flex
            "
          >
            <ArrowLeft size={17} />
          </button>

          {/* Member track */}

          <div
            ref={memberTrackRef}
            className="
              flex
              snap-x
              snap-mandatory
              gap-5
              overflow-x-auto
              px-1
              pb-8
              scrollbar-hide
              scroll-smooth
              lg:px-20
            "
          >
            {members.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                active={index === activeMemberIndex}
                onClick={() => changeMember(index)}
              />
            ))}
          </div>

          {/* Desktop next */}

          <button
            type="button"
            aria-label="Next member"
            onClick={nextMember}
            className="
              absolute
              right-0
              top-1/2
              z-30
              hidden
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-[#080707]/80
              text-white/40
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-[#C6922E]/50
              hover:bg-[#C6922E]/10
              hover:text-[#C6922E]
              active:scale-95
              lg:flex
            "
          >
            <ArrowRight size={17} />
          </button>
        </div>

        {/* ====================================================
            MEMBER NAVIGATION
        ===================================================== */}

        <div
          className="
            team-content-animate
            flex
            items-center
            justify-between
            border-t
            border-white/[0.07]
            pt-6
          "
        >
          <button
            type="button"
            onClick={previousMember}
            className="
              flex
              items-center
              gap-2
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-white/30
              transition-colors
              hover:text-[#C6922E]
              active:scale-95
              lg:hidden
            "
          >
            <ChevronLeft size={13} />
            Previous
          </button>

          {/* Dots */}

          <div
            className="
              flex
              max-w-[60vw]
              items-center
              gap-1.5
              overflow-hidden
            "
          >
            {members.map((member, index) => (
              <button
                key={member.id}
                type="button"
                aria-label={`View ${member.name}`}
                aria-current={
                  index === activeMemberIndex
                    ? "true"
                    : undefined
                }
                onClick={() => changeMember(index)}
                className={`
                  h-1.5
                  shrink-0
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    index === activeMemberIndex
                      ? "w-8 bg-[#C6922E]"
                      : "w-1.5 bg-white/15 hover:bg-white/30"
                  }
                `}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextMember}
            className="
              flex
              items-center
              gap-2
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-white/30
              transition-colors
              hover:text-[#C6922E]
              active:scale-95
              lg:hidden
            "
          >
            Next
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}

/*
 * ============================================================
 * TEAM VISUAL CARD
 * ============================================================
 */

function TeamVisualCard({
  team,
  index,
  active,
  onClick,
}: {
  team: (typeof teamGroups)[number];
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  const cardRef =
    useRef<HTMLButtonElement>(null);

  const visualRef =
    useRef<HTMLDivElement>(null);

  const lightRef =
    useRef<HTMLDivElement>(null);

  const moveCard = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    if (
      !cardRef.current ||
      window.innerWidth < 768
    ) {
      return;
    }

    const rect =
      cardRef.current.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left -
      rect.width / 2;

    const y =
      event.clientY -
      rect.top -
      rect.height / 2;

    const rotateX =
      -(y / rect.height) * 6;

    const rotateY =
      (x / rect.width) * 6;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      scale: active ? 1.025 : 1.015,
      duration: 0.4,
      ease: "power3.out",
      overwrite: true,
    });

    if (visualRef.current) {
      gsap.to(visualRef.current, {
        x: rotateY * 1.7,
        y: rotateX * -1.7,
        scale: 1.06,
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      });
    }

    if (lightRef.current) {
      gsap.to(lightRef.current, {
        x: x * 0.18,
        y: y * 0.18,
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
      });
    }
  };

  const resetCard = () => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: active ? 1.015 : 1,
      duration: 0.65,
      ease: "power3.out",
      overwrite: true,
    });

    if (visualRef.current) {
      gsap.to(visualRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        overwrite: true,
      });
    }

    if (lightRef.current) {
      gsap.to(lightRef.current, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        overwrite: true,
      });
    }
  };

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onClick}
      onMouseMove={moveCard}
      onMouseLeave={resetCard}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1200px",
      }}
      className={`
        team-category-card
        group
        relative
        h-[390px]
        min-w-[290px]
        snap-center
        overflow-hidden
        rounded-[1.8rem]
        border
        text-left
        transition-all
        duration-500
        sm:min-w-[330px]
        md:h-[430px]
        md:min-w-[365px]
        ${
          active
            ? `
              border-[#C6922E]/60
              shadow-[0_30px_100px_rgba(0,0,0,0.55)]
              md:-translate-y-3
            `
            : `
              border-white/[0.08]
              opacity-75
              hover:border-[#C6922E]/35
              hover:opacity-100
            `
        }
      `}
    >
      <div
        ref={visualRef}
        className={`
          absolute
          inset-0
          ${teamBackground(team.category)}
        `}
      >
        <div
          className="
            absolute
            inset-0
            opacity-[0.12]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,.12) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,.12) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "44px 44px",
          }}
        />

        <div
          className="
            absolute
            left-[18%]
            top-0
            h-full
            w-px
            bg-gradient-to-b
            from-transparent
            via-[#C6922E]/20
            to-transparent
          "
        />

        <div
          className="
            absolute
            right-[18%]
            top-0
            h-full
            w-px
            bg-gradient-to-b
            from-transparent
            via-[#C6922E]/10
            to-transparent
          "
        />

        <TeamArtwork category={team.category} />

        <div
          className="
            absolute
            bottom-[-15%]
            left-1/2
            h-[35%]
            w-[130%]
            -translate-x-1/2
            rounded-[50%]
            border
            border-[#C6922E]/15
            bg-[#C6922E]/5
            blur-[2px]
          "
        />

        <div
          ref={lightRef}
          className="
            absolute
            left-1/2
            top-[47%]
            h-48
            w-48
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#C6922E]/10
            blur-[75px]
          "
        />
      </div>

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-black/25
          via-transparent
          to-[#070507]/95
        "
      />

      <div
        className="
          absolute
          left-6
          right-6
          top-6
          z-20
        "
      >
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
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-[#C6922E]
              "
            >
              Team{" "}
              {String(index + 1).padStart(2, "0")}
            </span>

            <p
              className="
                mt-2
                text-[9px]
                uppercase
                tracking-[0.2em]
                text-white/35
              "
            >
              {teamCategoryLabel(team.category)}
            </p>
          </div>

          <div
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              transition-all
              duration-500
              ${
                active
                  ? "border-[#C6922E]/60 bg-[#C6922E] text-[#080707]"
                  : "border-white/15 bg-black/20 text-white/50 group-hover:border-[#C6922E]/50 group-hover:text-[#C6922E]"
              }
            `}
          >
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>

      <div
        className="
          absolute
          bottom-6
          left-6
          right-6
          z-20
        "
      >
        <h4
          className="
            max-w-[310px]
            text-3xl
            font-medium
            leading-[0.95]
            tracking-[-0.045em]
            text-[#F5F1E8]
            transition-transform
            duration-500
            group-hover:-translate-y-1
          "
        >
          {team.name}
        </h4>

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.2em]
              text-white/30
            "
          >
            {String(team.members.length).padStart(2, "0")} Active
          </span>
        </div>
      </div>

      {active && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-[1.8rem]
            border
            border-[#C6922E]/20
          "
        />
      )}
    </button>
  );
}

/*
 * ============================================================
 * TEAM ARTWORK
 * ============================================================
 */

function TeamArtwork({
  category,
}: {
  category: string;
}) {
  if (category === "core") {
    return (
      <div
        className="
          absolute
          left-1/2
          top-[47%]
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <div className="relative h-44 w-44">
          <div className="absolute inset-0 rounded-full border border-[#C6922E]/30" />
          <div className="absolute inset-5 rounded-full border border-[#C6922E]/20" />
          <div className="absolute inset-10 rounded-full border border-[#C6922E]/30" />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-20
              w-20
              -translate-x-1/2
              -translate-y-1/2
              rotate-45
              rounded-[1.2rem]
              border-2
              border-[#C6922E]/60
              bg-[#C6922E]/10
              shadow-[0_0_50px_rgba(198,146,46,0.18)]
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              text-4xl
              text-[#E3C477]
            "
          >
            ✦
          </div>
        </div>
      </div>
    );
  }

  if (category === "technical") {
    return (
      <div
        className="
          absolute
          left-1/2
          top-[46%]
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <div className="relative h-48 w-64">
          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-28
              w-44
              -translate-x-1/2
              -translate-y-1/2
              rounded-2xl
              border
              border-[#C6922E]/35
              bg-black/25
              shadow-[0_0_50px_rgba(198,146,46,0.12)]
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-[48%]
              h-16
              w-28
              -translate-x-1/2
              -translate-y-1/2
              rounded-lg
              border
              border-[#E3C477]/20
              bg-[#C6922E]/5
            "
          />

          <div className="absolute left-[22%] top-[26%] h-2 w-2 rounded-full bg-[#C6922E]/60" />
          <div className="absolute left-[30%] top-[26%] h-2 w-2 rounded-full bg-[#C6922E]/30" />
          <div className="absolute left-[38%] top-[26%] h-2 w-2 rounded-full bg-[#C6922E]/20" />

          <div
            className="
              absolute
              bottom-[16%]
              left-1/2
              h-1
              w-28
              -translate-x-1/2
              bg-[#C6922E]/30
            "
          />

          <div
            className="
              absolute
              bottom-[8%]
              left-1/2
              h-1
              w-16
              -translate-x-1/2
              bg-[#C6922E]/15
            "
          />
        </div>
      </div>
    );
  }

  if (category === "creative") {
    return (
      <div
        className="
          absolute
          left-1/2
          top-[46%]
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <div className="relative h-48 w-56">
          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-36
              w-36
              -translate-x-1/2
              -translate-y-1/2
              rotate-12
              rounded-[2rem]
              border
              border-[#C6922E]/30
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-28
              w-28
              -translate-x-1/2
              -translate-y-1/2
              -rotate-12
              rounded-full
              border
              border-dashed
              border-[#E3C477]/30
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              text-6xl
              text-[#E3C477]/65
            "
          >
            ✦
          </div>

          <div
            className="
              absolute
              left-4
              top-10
              h-8
              w-8
              rounded-full
              bg-[#C6922E]/10
            "
          />

          <div
            className="
              absolute
              bottom-4
              right-3
              h-12
              w-12
              rounded-full
              bg-[#650018]/40
              blur-md
            "
          />
        </div>
      </div>
    );
  }

  if (category === "management") {
    return (
      <div
        className="
          absolute
          left-1/2
          top-[46%]
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <div className="relative h-48 w-60">
          <div
            className="
              absolute
              bottom-10
              left-1/2
              h-20
              w-48
              -translate-x-1/2
              rounded-xl
              border
              border-[#C6922E]/40
              bg-[#C6922E]/5
            "
          />

          <div
            className="
              absolute
              bottom-[82px]
              left-1/2
              h-3
              w-52
              -translate-x-1/2
              rounded-full
              bg-[#C6922E]/30
            "
          />

          <div
            className="
              absolute
              left-[22%]
              top-[55px]
              h-16
              w-16
              rounded-full
              border
              border-[#E3C477]/40
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-[42px]
              h-20
              w-20
              -translate-x-1/2
              rounded-full
              border
              border-[#E3C477]/50
            "
          />

          <div
            className="
              absolute
              right-[22%]
              top-[55px]
              h-16
              w-16
              rounded-full
              border
              border-[#E3C477]/40
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-0
              -translate-x-1/2
              text-4xl
              text-[#C6922E]/70
            "
          >
            ◆
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        absolute
        left-1/2
        top-[46%]
        -translate-x-1/2
        -translate-y-1/2
      "
    >
      <div className="relative h-48 w-56">
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-36
            w-36
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-[#C6922E]/25
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-28
            w-28
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-dashed
            border-[#E3C477]/35
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            text-6xl
            text-[#E3C477]/70
          "
        >
          ♫
        </div>

        <div
          className="
            absolute
            left-2
            top-10
            h-8
            w-8
            rounded-full
            bg-[#C6922E]/10
          "
        />

        <div
          className="
            absolute
            bottom-4
            right-3
            h-12
            w-12
            rounded-full
            bg-[#650018]/40
            blur-md
          "
        />
      </div>
    </div>
  );
}

/*
 * ============================================================
 * MEMBER CARD
 * ============================================================
 */

function MemberCard({
  member,
  active,
  onClick,
}: {
  member: TeamMember;
  active: boolean;
  onClick: () => void;
}) {
  const cardRef =
    useRef<HTMLElement>(null);

  const imageRef =
    useRef<HTMLDivElement>(null);

  const initials = member.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const leadership =
    /director|president|head|lead|organizer|secretary|coordinator|expert|web master/i.test(
      member.role
    );

  const moveCard = (
    event: MouseEvent<HTMLElement>
  ) => {
    if (
      !cardRef.current ||
      window.innerWidth < 768
    ) {
      return;
    }

    const rect =
      cardRef.current.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left -
      rect.width / 2;

    const y =
      event.clientY -
      rect.top -
      rect.height / 2;

    gsap.to(cardRef.current, {
      rotateX:
        -(y / rect.height) * 6,
      rotateY:
        (x / rect.width) * 6,
      scale: active ? 1.02 : 0.99,
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
    });

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: x * 0.025,
        y: y * 0.025,
        scale: 1.04,
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
      });
    }
  };

  const resetCard = () => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: active ? 1.01 : 1,
      duration: 0.6,
      ease: "power3.out",
      overwrite: true,
    });

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        overwrite: true,
      });
    }
  };

  return (
    <article
      ref={cardRef}
      onClick={onClick}
      onMouseMove={moveCard}
      onMouseLeave={resetCard}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1200px",
      }}
      className={`
        team-member-card
        group
        relative
        h-[420px]
        min-w-[285px]
        snap-center
        overflow-hidden
        rounded-[1.8rem]
        border
        bg-[#12070A]
        text-left
        transition-all
        duration-500
        sm:min-w-[320px]
        md:h-[450px]
        md:min-w-[340px]
        ${
          active
            ? `
              border-[#C6922E]/50
              shadow-[0_30px_90px_rgba(0,0,0,0.45)]
            `
            : `
              border-white/[0.07]
              opacity-80
              hover:border-[#C6922E]/30
              hover:opacity-100
            `
        }
      `}
    >
      <div
        ref={imageRef}
        className="
          absolute
          inset-0
          overflow-hidden
        "
      >
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="
              h-full
              w-full
              object-cover
              grayscale-[35%]
              transition-all
              duration-700
              group-hover:scale-105
              group-hover:grayscale-0
            "
          />
        ) : (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              overflow-hidden
              bg-gradient-to-br
              from-[#3A0712]
              via-[#150509]
              to-[#050505]
            "
          >
            <div
              className="
                absolute
                inset-0
                opacity-[0.08]
              "
              style={{
                backgroundImage: `
                  linear-gradient(
                    rgba(255,255,255,.2) 1px,
                    transparent 1px
                  ),
                  linear-gradient(
                    90deg,
                    rgba(255,255,255,.2) 1px,
                    transparent 1px
                  )
                `,
                backgroundSize: "38px 38px",
              }}
            />

            <div
              className="
                absolute
                h-64
                w-64
                rounded-full
                bg-[#C6922E]/10
                blur-[80px]
              "
            />

            <span
              className="
                relative
                z-10
                text-7xl
                font-medium
                tracking-[-0.08em]
                text-[#C6922E]/35
                transition-all
                duration-500
                group-hover:text-[#C6922E]/55
              "
            >
              {initials}
            </span>

            <div
              className="
                absolute
                h-48
                w-48
                rounded-full
                border
                border-[#C6922E]/10
              "
            />

            <div
              className="
                absolute
                h-36
                w-36
                rounded-full
                border
                border-dashed
                border-[#C6922E]/10
              "
            />
          </div>
        )}
      </div>

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          z-10
          h-56
          bg-gradient-to-t
          from-[#12070A]
          via-[#12070A]/65
          to-transparent
        "
      />

      <div
        className="
          absolute
          right-5
          top-5
          z-20
          rounded-full
          border
          border-white/10
          bg-black/30
          px-3
          py-1.5
          backdrop-blur-md
        "
      >
        <span
          className="
            text-[8px]
            uppercase
            tracking-[0.18em]
            text-white/45
          "
        >
          {member.role}
        </span>
      </div>

      {leadership && (
        <div
          className="
            absolute
            bottom-6
            left-5
            z-20
            rounded-full
            border
            border-[#C6922E]/30
            bg-[#12070A]/75
            px-3
            py-1.5
            backdrop-blur-md
          "
        >
          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.18em]
              text-[#C6922E]
            "
          >
            Leadership
          </span>
        </div>
      )}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-20
          flex
          items-end
          justify-between
          gap-4
          p-6
        "
      >
        <div>
          <h4
            className="
              text-lg
              font-medium
              tracking-tight
              text-[#F5F1E8]
            "
          >
            {member.name}
          </h4>

          <p
            className="
              mt-2
              text-[8px]
              uppercase
              tracking-[0.2em]
              text-[#C6922E]
            "
          >
            {member.role}
          </p>
        </div>

        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            transition-all
            duration-300
            ${
              active
                ? "border-[#C6922E]/50 bg-[#C6922E]/10 text-[#C6922E]"
                : "border-white/10 text-white/25 group-hover:border-[#C6922E]/40 group-hover:text-[#C6922E]"
            }
          `}
        >
          <ArrowUpRight size={14} />
        </div>
      </div>

      {active && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-30
            rounded-[1.8rem]
            border
            border-[#C6922E]/15
          "
        />
      )}
    </article>
  );
}

/*
 * ============================================================
 * ROUND BUTTON
 * ============================================================
 */

function RoundButton({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        border-white/10
        text-white/40
        transition-all
        duration-300
        hover:border-[#C6922E]/50
        hover:bg-[#C6922E]/10
        hover:text-[#C6922E]
        active:scale-95
      "
    >
      {children}
    </button>
  );
}

/*
 * ============================================================
 * TEAM BACKGROUNDS
 * ============================================================
 */

function teamBackground(category: string) {
  switch (category) {
    case "core":
      return `
        bg-gradient-to-br
        from-[#6A0019]
        via-[#26070D]
        to-[#050505]
      `;

    case "technical":
      return `
        bg-gradient-to-br
        from-[#40230B]
        via-[#190D06]
        to-[#050505]
      `;

    case "creative":
      return `
        bg-gradient-to-br
        from-[#54001A]
        via-[#23070F]
        to-[#050505]
      `;

    case "management":
      return `
        bg-gradient-to-br
        from-[#54210B]
        via-[#1D0B06]
        to-[#050505]
      `;

    case "cultural":
      return `
        bg-gradient-to-br
        from-[#430817]
        via-[#19050C]
        to-[#050505]
      `;

    default:
      return `
        bg-gradient-to-br
        from-[#40000F]
        via-[#16040A]
        to-[#050505]
      `;
  }
}

/*
 * ============================================================
 * TEAM CATEGORY LABEL
 * ============================================================
 */

function teamCategoryLabel(category: string) {
  switch (category) {
    case "core":
      return "Leadership";

    case "technical":
      return "Technology";

    case "creative":
      return "Creative";

    case "management":
      return "Management";

    case "cultural":
      return "Culture";

    default:
      return "Shrinik";
  }
}