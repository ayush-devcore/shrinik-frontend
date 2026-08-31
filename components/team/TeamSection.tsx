"use client";

import type { MouseEvent, ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
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

  const [selectedMember, setSelectedMember] =
    useState<TeamMember | null>(null);

  const [selectedMemberTeam, setSelectedMemberTeam] =
    useState<string>("");

  const sectionRef = useRef<HTMLElement>(null);
  const teamTrackRef = useRef<HTMLDivElement>(null);
  const memberTrackRef = useRef<HTMLDivElement>(null);

  const activeTeam = teamGroups[activeTeamIndex];

  const members = useMemo(
    () => activeTeam?.members ?? [],
    [activeTeam],
  );

  /*
   * ==========================================================
   * REDUCED MOTION
   * ==========================================================
   */

  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    prefersReducedMotion.current = mediaQuery.matches;

    const handleChange = () => {
      prefersReducedMotion.current = mediaQuery.matches;
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  /*
   * ==========================================================
   * SCROLL HELPER
   * ==========================================================
   */

  const scrollTrackToIndex = useCallback(
    (
      track: HTMLDivElement | null,
      selector: string,
      index: number,
    ) => {
      if (!track) return;

      const items =
        track.querySelectorAll<HTMLElement>(selector);

      const item = items[index];

      if (!item) return;

      const trackRect = track.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const visible =
        itemRect.left >= trackRect.left + 10 &&
        itemRect.right <= trackRect.right - 10;

      if (visible) return;

      const targetLeft =
        item.offsetLeft -
        track.clientWidth / 2 +
        item.offsetWidth / 2;

      track.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: prefersReducedMotion.current
          ? "auto"
          : "smooth",
      });
    },
    [],
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

      if (next === activeTeamIndex) return;

      setActiveTeamIndex(next);
      setActiveMemberIndex(0);

      requestAnimationFrame(() => {
        scrollTrackToIndex(
          teamTrackRef.current,
          ".team-category-card",
          next,
        );
      });
    },
    [
      activeTeamIndex,
      scrollTrackToIndex,
    ],
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
        scrollTrackToIndex(
          memberTrackRef.current,
          ".team-member-card",
          next,
        );
      });
    },
    [
      members.length,
      scrollTrackToIndex,
    ],
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
   * RESET MEMBER POSITION
   * ==========================================================
   */

  useEffect(() => {
    setActiveMemberIndex(0);

    const frame = requestAnimationFrame(() => {
      const track = memberTrackRef.current;

      if (!track) return;

      track.scrollTo({
        left: 0,
        behavior: "auto",
      });
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [activeTeamIndex]);

  /*
   * ==========================================================
   * KEYBOARD NAVIGATION
   * ==========================================================
   */

  useEffect(() => {
    const handleKeyboard = (
      event: KeyboardEvent,
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

      if (event.key === "Escape") {
        setSelectedMember(null);
        setSelectedMemberTeam("");
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard,
      );
    };
  }, [
    previousMember,
    nextMember,
  ]);

  /*
   * ==========================================================
   * PHOTO MODAL LOCK
   * ==========================================================
   */

  useEffect(() => {
    if (!selectedMember) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [selectedMember]);

  /*
   * ==========================================================
   * SECTION ENTRANCE
   * ==========================================================
   */

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion.current) {
        gsap.set(
          [
            ".team-eyebrow",
            ".team-heading",
            ".team-description",
            ".team-category-card",
          ],
          {
            opacity: 1,
            y: 0,
            clearProps:
              "filter,transform",
          },
        );

        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });

      timeline
        .fromTo(
          ".team-eyebrow",
          {
            opacity: 0,
            y: 20,
            filter: "blur(6px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.65,
            ease: "power3.out",
          },
        )
        .fromTo(
          ".team-heading",
          {
            opacity: 0,
            y: 40,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.35",
        )
        .fromTo(
          ".team-description",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .fromTo(
          ".team-category-card",
          {
            opacity: 0,
            y: 30,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.3",
        );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  /*
   * ==========================================================
   * TEAM CHANGE ANIMATION
   * ==========================================================
   */

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    if (prefersReducedMotion.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const elements =
        section.querySelectorAll<HTMLElement>(
          ".team-content-animate",
        );

      const cards =
        section.querySelectorAll<HTMLElement>(
          ".team-member-card",
        );

      gsap.killTweensOf([
        elements,
        cards,
      ]);

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.04,
          ease: "power3.out",
          overwrite: true,
        },
      );

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 20,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.045,
          ease: "power3.out",
          overwrite: true,
        },
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, [activeTeamIndex]);

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
    >
      {/* ======================================================
          BACKGROUND
      ======================================================= */}

      <div className="pointer-events-none absolute inset-0">

        <div
          className="
            absolute
            left-[-15%]
            top-[8%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-[#650018]/10
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            right-[-15%]
            top-[32%]
            h-[520px]
            w-[520px]
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

      <div className="relative z-10 mx-auto max-w-7xl">

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
              overscroll-x-contain
            "
          >
            {teamGroups.map(
              (team, index) => (
                <TeamVisualCard
                  key={team.id}
                  team={team}
                  index={index}
                  active={
                    index ===
                    activeTeamIndex
                  }
                  onClick={() =>
                    changeTeam(index)
                  }
                />
              ),
            )}
          </div>
        </div>

        {/* ====================================================
            SELECTED TEAM
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
                    activeTeam.category,
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
                {String(
                  members.length,
                ).padStart(2, "0")}
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
              overscroll-x-contain
              lg:px-20
            "
          >

            {members.map(
              (member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  active={
                    index ===
                    activeMemberIndex
                  }
                  onClick={() =>
                    changeMember(index)
                  }
                  onPhotoClick={() => {
                    setSelectedMember(member);
                    setSelectedMemberTeam(
                      activeTeam.category,
                    );
                  }}
                />
              ),
            )}

          </div>

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

          <div
            className="
              flex
              max-w-[60vw]
              items-center
              gap-1.5
              overflow-hidden
            "
          >
            {members.map(
              (member, index) => (
                <button
                  key={member.id}
                  type="button"
                  aria-label={`View ${member.name}`}
                  aria-current={
                    index ===
                    activeMemberIndex
                      ? "true"
                      : undefined
                  }
                  onClick={() =>
                    changeMember(index)
                  }
                  className={`
                    h-1.5
                    shrink-0
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      index ===
                      activeMemberIndex
                        ? "w-8 bg-[#C6922E]"
                        : "w-1.5 bg-white/15 hover:bg-white/30"
                    }
                  `}
                />
              ),
            )}
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

        {/* ====================================================
            PHOTO MODAL
        ===================================================== */}

        {selectedMember && (
          <MemberPhotoModal
            member={selectedMember}
            teamCategory={
              selectedMemberTeam
            }
            onClose={() => {
              setSelectedMember(null);
              setSelectedMemberTeam("");
            }}
          />
        )}

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

  const artworkRef =
    useRef<HTMLDivElement>(null);

  const glowRef =
    useRef<HTMLDivElement>(null);

  const rafRef =
    useRef<number | null>(null);

  const pointerRef =
    useRef({
      x: 0,
      y: 0,
    });

  const moveCard = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (
      !cardRef.current ||
      window.innerWidth < 768 ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
    ) {
      return;
    }

    pointerRef.current.x =
      event.clientX;

    pointerRef.current.y =
      event.clientY;

    if (rafRef.current !== null) {
      return;
    }

    rafRef.current =
      requestAnimationFrame(() => {
        rafRef.current = null;

        if (!cardRef.current) {
          return;
        }

        const rect =
          cardRef.current.getBoundingClientRect();

        const x =
          pointerRef.current.x -
          rect.left -
          rect.width / 2;

        const y =
          pointerRef.current.y -
          rect.top -
          rect.height / 2;

        gsap.to(
          cardRef.current,
          {
            rotationX:
              -(y / rect.height) * 4,
            rotationY:
              (x / rect.width) * 4,
            scale: active
              ? 1.018
              : 1.008,
            duration: 0.35,
            ease: "power3.out",
            overwrite: true,
          },
        );

        if (artworkRef.current) {
          gsap.to(
            artworkRef.current,
            {
              x:
                (x / rect.width) * 10,
              y:
                (y / rect.height) * 8,
              scale: 1.045,
              duration: 0.5,
              ease: "power3.out",
              overwrite: true,
            },
          );
        }

        if (glowRef.current) {
          gsap.to(
            glowRef.current,
            {
              x: x * 0.08,
              y: y * 0.08,
              duration: 0.45,
              ease: "power2.out",
              overwrite: true,
            },
          );
        }
      });
  };

  const resetCard = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(
        rafRef.current,
      );

      rafRef.current = null;
    }

    if (cardRef.current) {
      gsap.to(
        cardRef.current,
        {
          rotationX: 0,
          rotationY: 0,
          scale: active
            ? 1.005
            : 1,
          duration: 0.6,
          ease: "power3.out",
          overwrite: true,
        },
      );
    }

    if (artworkRef.current) {
      gsap.to(
        artworkRef.current,
        {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          overwrite: true,
        },
      );
    }

    if (glowRef.current) {
      gsap.to(
        glowRef.current,
        {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        },
      );
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(
          rafRef.current,
        );
      }
    };
  }, []);

  const theme =
    teamVisualTheme(team.category);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onClick}
      onMouseMove={moveCard}
      onMouseLeave={resetCard}
      style={{
        transformStyle:
          "preserve-3d",
        perspective:
          "1400px",
        willChange:
          "transform",
      }}
      className={`
        team-category-card
        group
        relative
        h-[430px]
        min-w-[310px]
        snap-center
        overflow-hidden
        rounded-[1.6rem]
        border
        text-left
        transition-[border-color,box-shadow,opacity]
        duration-500
        sm:min-w-[350px]
        md:h-[470px]
        md:min-w-[380px]
        ${
          active
            ? `${theme.border} ${theme.shadow}`
            : "border-white/[0.08] opacity-[0.78] hover:border-[#C6922E]/35 hover:opacity-100"
        }
      `}
    >

      {/* ====================================================
          POSTER ARTWORK
      ===================================================== */}

      <div
        ref={artworkRef}
        className="
          absolute
          inset-[-3%]
        "
        style={{
          willChange:
            "transform",
        }}
      >

        <TeamArtwork
          category={
            team.category
          }
          teamName={
            team.name
          }
        />

      </div>

      {/* ====================================================
          GRAIN
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-10
          opacity-[0.08]
          mix-blend-screen
        "
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ====================================================
          TOP CINEMATIC VIGNETTE
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-20
          bg-gradient-to-b
          from-black/55
          via-transparent
          to-black/85
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-20
          bg-gradient-to-r
          from-black/35
          via-transparent
          to-black/20
        "
      />

      {/* ====================================================
          CURSOR LIGHT
      ===================================================== */}

      <div
        ref={glowRef}
        className={`
          pointer-events-none
          absolute
          left-1/2
          top-[48%]
          z-10
          h-64
          w-64
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          blur-[100px]
          ${theme.glow}
        `}
      />

      {/* ====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          absolute
          left-6
          right-6
          top-6
          z-40
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
                  tracking-[0.38em]
                  text-[#F0B83F]
                "
              >
                Team{" "}
                {String(
                  index + 1,
                ).padStart(2, "0")}
              </span>

              <span
                className="
                  h-px
                  w-9
                  bg-[#F0B83F]/60
                "
              />
            </div>

            <p
              className="
                mt-3
                text-[9px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-white/60
              "
            >
              {teamCategoryLabel(
                team.category,
              )}
            </p>

          </div>

          <div
            className={`
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              transition-all
              duration-500
              ${
                active
                  ? "border-[#F0B83F]/60 bg-[#F0B83F] text-black"
                  : "border-white/20 bg-black/20 text-white/60 group-hover:border-[#F0B83F]/60 group-hover:text-[#F0B83F]"
              }
            `}
          >
            <ArrowUpRight
              size={19}
            />
          </div>

        </div>
      </div>

      {/* ====================================================
          MICRO POSTER MARK
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-[150px]
          left-6
          z-30
          flex
          items-center
          gap-2
        "
      >
        <span
          className={`
            text-[8px]
            uppercase
            tracking-[0.3em]
            ${theme.accentText}
          `}
        >
          {theme.eyebrow}
        </span>

        <span
          className="
            h-px
            w-5
            bg-white/20
          "
        />
      </div>

      {/* ====================================================
          BOTTOM TYPOGRAPHIC PANEL
      ===================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-40
          p-6
        "
      >

        <div
          className="
            mb-5
            h-px
            w-full
            bg-gradient-to-r
            from-[#F0B83F]/70
            via-white/15
            to-transparent
          "
        />

        <div
          className="
            flex
            items-end
            justify-between
            gap-5
          "
        >

          <div>

            <h4
              className="
                max-w-[300px]
                text-[2.55rem]
                font-medium
                leading-[0.88]
                tracking-[-0.055em]
                text-[#FFF8EB]
                transition-transform
                duration-500
                group-hover:-translate-y-1
                md:text-[2.8rem]
              "
            >
              {team.name}
            </h4>

            <div
              className="
                mt-4
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.27em]
                  text-white/45
                "
              >
                {String(
                  team.members.length,
                ).padStart(2, "0")}{" "}
                Active Members
              </span>

              <span className="h-1 w-1 rounded-full bg-[#F0B83F]" />

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.22em]
                  text-white/25
                "
              >
                {String(
                  index + 1,
                ).padStart(2, "0")}
                {" / "}
                {String(
                  teamGroups.length,
                ).padStart(2, "0")}
              </span>
            </div>

          </div>

          <div
            className="
              hidden
              text-right
              sm:block
            "
          >
            <span
              className="
                text-[7px]
                uppercase
                tracking-[0.28em]
                text-white/25
              "
            >
              SHRNK
            </span>

            <span
              className="
                mt-1
                block
                text-[7px]
                uppercase
                tracking-[0.25em]
                text-[#F0B83F]/60
              "
            >
              2026
            </span>
          </div>

        </div>
      </div>

      {/* ====================================================
          ACTIVE EDGE
      ===================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          z-50
          rounded-[1.6rem]
          border
          transition-opacity
          duration-500
          ${
            active
              ? "border-[#F0B83F]/25 opacity-100"
              : "border-transparent opacity-0"
          }
        `}
      />

    </button>
  );
}

/*
 * ============================================================
 * TEAM ARTWORK
 * ============================================================
 *
 * IMPORTANT:
 *
 * This component is where the visual identity lives.
 *
 * Data is NOT changed.
 * Team names are NOT changed.
 * Member data is NOT changed.
 *
 * Only the cover artwork is different.
 * ============================================================
 */

function TeamArtwork({
  category,
  teamName,
}: {
  category: string;
  teamName: string;
}) {
  const name =
    teamName.toLowerCase();

  /*
   * ==========================================================
   * CORE / LEADERSHIP
   *
   * Monument / command / compass / authority
   * ==========================================================
   */

  if (
    category === "core" ||
    name.includes("core") ||
    name.includes("leadership")
  ) {
    return (
      <div
        className="
          absolute
          inset-0
          overflow-hidden
          bg-[#170306]
        "
      >

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#69001B]
            via-[#2B060E]
            to-[#050303]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-[45%]
            h-[340px]
            w-[340px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#C6922E]/15
            blur-[90px]
          "
        />

        <svg
          viewBox="0 0 500 560"
          className="
            absolute
            inset-0
            h-full
            w-full
            transition-transform
            duration-1000
            group-hover:scale-[1.04]
          "
          aria-hidden="true"
        >
          <defs>
            <radialGradient
              id="coreGlow"
              cx="50%"
              cy="48%"
              r="55%"
            >
              <stop
                offset="0%"
                stopColor="#E8C66B"
                stopOpacity=".35"
              />
              <stop
                offset="55%"
                stopColor="#8A122B"
                stopOpacity=".18"
              />
              <stop
                offset="100%"
                stopColor="#000"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>

          <circle
            cx="250"
            cy="270"
            r="190"
            fill="url(#coreGlow)"
          />

          <circle
            cx="250"
            cy="270"
            r="170"
            fill="none"
            stroke="#D4A944"
            strokeOpacity=".22"
          />

          <circle
            cx="250"
            cy="270"
            r="138"
            fill="none"
            stroke="#E7C66B"
            strokeOpacity=".18"
            strokeDasharray="2 8"
          />

          <circle
            cx="250"
            cy="270"
            r="102"
            fill="none"
            stroke="#C6922E"
            strokeOpacity=".32"
          />

          <g
            className="
              transition-transform
              duration-1000
              group-hover:rotate-[15deg]
            "
            style={{
              transformOrigin:
                "250px 270px",
            }}
          >
            <path
              d="M250 105 L275 250 L250 270 L225 250 Z"
              fill="#E5C36A"
              fillOpacity=".35"
            />

            <path
              d="M250 435 L275 290 L250 270 L225 290 Z"
              fill="#C6922E"
              fillOpacity=".18"
            />

            <path
              d="M85 270 L230 245 L250 270 L230 295 Z"
              fill="#E5C36A"
              fillOpacity=".15"
            />

            <path
              d="M415 270 L270 245 L250 270 L270 295 Z"
              fill="#C6922E"
              fillOpacity=".14"
            />

            <line
              x1="250"
              y1="85"
              x2="250"
              y2="455"
              stroke="#D6AD49"
              strokeOpacity=".28"
            />

            <line
              x1="65"
              y1="270"
              x2="435"
              y2="270"
              stroke="#D6AD49"
              strokeOpacity=".28"
            />
          </g>

          <g
            className="
              transition-transform
              duration-700
              group-hover:rotate-[28deg]
            "
            style={{
              transformOrigin:
                "250px 270px",
            }}
          >
            <path
              d="M250 150 L266 270 L250 282 L234 270 Z"
              fill="#F2D68A"
            />

            <path
              d="M250 390 L262 270 L250 258 L238 270 Z"
              fill="#7C4E20"
            />
          </g>

          <circle
            cx="250"
            cy="270"
            r="9"
            fill="#FFF1BD"
          />

          <circle
            cx="250"
            cy="270"
            r="17"
            fill="none"
            stroke="#E7C66B"
            strokeOpacity=".45"
          />

          <text
            x="250"
            y="92"
            textAnchor="middle"
            fill="#E7C66B"
            fillOpacity=".7"
            fontSize="10"
            letterSpacing="5"
          >
            NORTH
          </text>

          <text
            x="250"
            y="465"
            textAnchor="middle"
            fill="#E7C66B"
            fillOpacity=".35"
            fontSize="9"
            letterSpacing="4"
          >
            COMMAND
          </text>
        </svg>

        <div
          className="
            absolute
            left-6
            top-[29%]
            font-mono
            text-[7px]
            uppercase
            tracking-[0.35em]
            text-[#E7C66B]/70
          "
        >
          COMMAND // 01
        </div>

        <div
          className="
            absolute
            bottom-[28%]
            right-6
            font-mono
            text-[7px]
            uppercase
            tracking-[0.3em]
            text-[#E7C66B]/45
          "
        >
          STEER · DIRECT
        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * TECH
   *
   * Cyber / terminal / circuitry / system
   * ==========================================================
   */

  if (
    category === "technical" ||
    name.includes("tech")
  ) {
    return (
      <div
        className="
          absolute
          inset-0
          overflow-hidden
          bg-[#020B0E]
        "
      >

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#10343A]
            via-[#07161B]
            to-[#020405]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-[47%]
            h-[350px]
            w-[350px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-cyan-400/10
            blur-[90px]
          "
        />

        <svg
          viewBox="0 0 500 560"
          className="
            absolute
            inset-0
            h-full
            w-full
            opacity-90
            transition-transform
            duration-700
            group-hover:scale-[1.045]
          "
          aria-hidden="true"
        >

          <g
            fill="none"
            stroke="#35D8E9"
            strokeOpacity=".32"
            strokeWidth="1"
          >
            <path d="M20 150 H115 V205 H180" />
            <path d="M480 125 H390 V180 H325" />
            <path d="M30 390 H110 V340 H170" />
            <path d="M470 405 H390 V350 H330" />
            <path d="M90 30 V105 H150" />
            <path d="M410 35 V105 H350" />
          </g>

          <g
            fill="#7DECF5"
            fillOpacity=".8"
          >
            <circle
              cx="115"
              cy="150"
              r="4"
            />
            <circle
              cx="180"
              cy="205"
              r="4"
            />
            <circle
              cx="390"
              cy="125"
              r="4"
            />
            <circle
              cx="325"
              cy="180"
              r="4"
            />
            <circle
              cx="110"
              cy="390"
              r="4"
            />
            <circle
              cx="170"
              cy="340"
              r="4"
            />
            <circle
              cx="390"
              cy="405"
              r="4"
            />
            <circle
              cx="330"
              cy="350"
              r="4"
            />
          </g>

          {/* Main terminal */}
          <g
            className="
              transition-transform
              duration-700
              group-hover:-translate-y-3
            "
          >
            <rect
              x="115"
              y="195"
              width="270"
              height="175"
              rx="16"
              fill="#061114"
              stroke="#3BE0ED"
              strokeOpacity=".45"
            />

            <rect
              x="135"
              y="220"
              width="230"
              height="112"
              rx="8"
              fill="#020708"
              stroke="#3BE0ED"
              strokeOpacity=".18"
            />

            <circle
              cx="140"
              cy="212"
              r="4"
              fill="#45DCE9"
            />

            <circle
              cx="154"
              cy="212"
              r="4"
              fill="#45DCE9"
              fillOpacity=".5"
            />

            <circle
              cx="168"
              cy="212"
              r="4"
              fill="#45DCE9"
              fillOpacity=".25"
            />

            <text
              x="153"
              y="250"
              fill="#57E5EF"
              fillOpacity=".7"
              fontSize="9"
              fontFamily="monospace"
            >
              &gt; initialize_shrinik()
            </text>

            <text
              x="153"
              y="270"
              fill="#57E5EF"
              fillOpacity=".5"
              fontSize="9"
              fontFamily="monospace"
            >
              &gt; loading_modules...
            </text>

            <text
              x="153"
              y="290"
              fill="#57E5EF"
              fillOpacity=".5"
              fontSize="9"
              fontFamily="monospace"
            >
              &gt; build --production
            </text>

            <text
              x="153"
              y="310"
              fill="#A5F8FF"
              fillOpacity=".9"
              fontSize="9"
              fontFamily="monospace"
            >
              &gt; system.online ✓
            </text>

            <line
              x1="175"
              y1="390"
              x2="325"
              y2="390"
              stroke="#35D8E9"
              strokeOpacity=".35"
            />

            <line
              x1="205"
              y1="402"
              x2="295"
              y2="402"
              stroke="#35D8E9"
              strokeOpacity=".2"
            />
          </g>

          {/* Scanlines */}
          {Array.from({
            length: 10,
          }).map((_, i) => (
            <line
              key={i}
              x1="80"
              y1={110 + i * 35}
              x2="420"
              y2={110 + i * 35}
              stroke="#4FE3EF"
              strokeOpacity=".045"
            />
          ))}
        </svg>

        <div
          className="
            absolute
            left-6
            top-[28%]
            font-mono
            text-[7px]
            uppercase
            tracking-[0.35em]
            text-cyan-200/65
          "
        >
          SYSTEM // ONLINE
        </div>

        <div
          className="
            absolute
            right-6
            bottom-[28%]
            font-mono
            text-[7px]
            uppercase
            tracking-[0.3em]
            text-cyan-200/45
          "
        >
          BUILD_02
        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * DESIGN / MEDIA
   *
   * Camera / lens / composition / visual language
   * ==========================================================
   */

  if (
    category === "creative" ||
    name.includes("design") ||
    name.includes("media")
  ) {
    return (
      <div
        className="
          absolute
          inset-0
          overflow-hidden
          bg-[#10030D]
        "
      >

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#5A062E]
            via-[#210817]
            to-[#050305]
          "
        />

        <div
          className="
            absolute
            left-[55%]
            top-[45%]
            h-[360px]
            w-[360px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-fuchsia-500/10
            blur-[95px]
          "
        />

        {/* Decorative frame */}
        <div
          className="
            absolute
            left-[11%]
            top-[28%]
            h-[190px]
            w-[240px]
            rotate-[-9deg]
            border
            border-fuchsia-200/15
          "
        />

        <div
          className="
            absolute
            right-[8%]
            top-[35%]
            h-[130px]
            w-[160px]
            rotate-[13deg]
            border
            border-violet-200/15
          "
        />

        <svg
          viewBox="0 0 500 560"
          className="
            absolute
            inset-0
            h-full
            w-full
            opacity-90
            transition-transform
            duration-700
            group-hover:scale-[1.045]
          "
          aria-hidden="true"
        >

          {/* Crop marks */}
          <path
            d="M55 130 H90 M55 130 V165"
            stroke="#F2B8FF"
            strokeOpacity=".45"
          />

          <path
            d="M445 130 H410 M445 130 V165"
            stroke="#F2B8FF"
            strokeOpacity=".45"
          />

          <path
            d="M55 425 H90 M55 425 V390"
            stroke="#F2B8FF"
            strokeOpacity=".45"
          />

          <path
            d="M445 425 H410 M445 425 V390"
            stroke="#F2B8FF"
            strokeOpacity=".45"
          />

          {/* Camera */}
          <g
            className="
              transition-transform
              duration-700
              group-hover:rotate-[-5deg]
              group-hover:scale-105
            "
            style={{
              transformOrigin:
                "250px 280px",
            }}
          >

            <rect
              x="115"
              y="200"
              width="270"
              height="170"
              rx="25"
              fill="#160813"
              stroke="#E8A4F5"
              strokeOpacity=".4"
              strokeWidth="1.5"
            />

            <rect
              x="175"
              y="165"
              width="75"
              height="38"
              rx="8"
              fill="#10050E"
              stroke="#E8A4F5"
              strokeOpacity=".35"
            />

            <circle
              cx="250"
              cy="285"
              r="82"
              fill="#431044"
              fillOpacity=".5"
              stroke="#F0B3FF"
              strokeOpacity=".6"
              strokeWidth="2"
            />

            <circle
              cx="250"
              cy="285"
              r="59"
              fill="#160816"
              stroke="#E7A7F7"
              strokeOpacity=".35"
            />

            <circle
              cx="250"
              cy="285"
              r="32"
              fill="#DDA2EF"
              fillOpacity=".2"
              stroke="#F7D8FF"
              strokeOpacity=".4"
            />

            <circle
              cx="238"
              cy="272"
              r="9"
              fill="#FFF4FF"
              fillOpacity=".55"
            />

            <circle
              cx="333"
              cy="224"
              r="8"
              fill="#EFA9FB"
              fillOpacity=".6"
            />
          </g>

          {/* Composition circle */}
          <circle
            cx="250"
            cy="285"
            r="125"
            fill="none"
            stroke="#E9A8FA"
            strokeOpacity=".12"
            strokeDasharray="3 9"
          />

          <path
            d="M75 475 C180 390 300 510 445 390"
            fill="none"
            stroke="#F0ABFC"
            strokeOpacity=".2"
            strokeWidth="1.5"
          />
        </svg>

        <div
          className="
            absolute
            left-6
            top-[28%]
            text-[7px]
            uppercase
            tracking-[0.35em]
            text-fuchsia-200/65
          "
        >
          FRAME // CREATE
        </div>

        <div
          className="
            absolute
            right-6
            bottom-[28%]
            text-[7px]
            uppercase
            tracking-[0.3em]
            text-violet-200/45
          "
        >
          VISUAL_03
        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * EDITORIAL
   *
   * THIS IS THE REFERENCE-STYLE COVER
   *
   * Fountain pen + ink + flowing editorial ribbons
   * ==========================================================
   */

  if (
    name.includes("editorial") ||
    name.includes("content")
  ) {
    return (
      <div
        className="
          absolute
          inset-0
          overflow-hidden
          bg-[#180205]
        "
      >

        {/* Deep burgundy poster background */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#650014]
            via-[#26050B]
            to-[#030303]
          "
        />

        {/* Warm central light */}

        <div
          className="
            absolute
            left-[55%]
            top-[45%]
            h-[350px]
            w-[350px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#C46A20]/20
            blur-[100px]
          "
        />

        {/* Poster grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.07]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,215,150,.35) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,215,150,.35) 1px,
                transparent 1px
              )
            `,
            backgroundSize:
              "42px 42px",
          }}
        />

        <svg
          viewBox="0 0 500 560"
          className="
            absolute
            inset-0
            h-full
            w-full
            transition-transform
            duration-1000
            group-hover:scale-[1.035]
          "
          aria-hidden="true"
        >

          <defs>

            <linearGradient
              id="inkGold"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#F4D17D"
              />

              <stop
                offset="45%"
                stopColor="#C6922E"
              />

              <stop
                offset="100%"
                stopColor="#7E351A"
              />
            </linearGradient>

            <linearGradient
              id="penBody"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#6C2B24"
              />

              <stop
                offset="45%"
                stopColor="#180607"
              />

              <stop
                offset="100%"
                stopColor="#050202"
              />
            </linearGradient>

            <radialGradient
              id="inkGlow"
            >
              <stop
                offset="0%"
                stopColor="#F0A54D"
                stopOpacity=".55"
              />

              <stop
                offset="100%"
                stopColor="#7B160E"
                stopOpacity="0"
              />
            </radialGradient>

          </defs>

          {/* Central atmospheric glow */}

          <circle
            cx="275"
            cy="290"
            r="170"
            fill="url(#inkGlow)"
          />

          {/* Large editorial circles */}

          <circle
            cx="270"
            cy="275"
            r="185"
            fill="none"
            stroke="#D58B3B"
            strokeOpacity=".25"
            strokeWidth="1"
          />

          <circle
            cx="270"
            cy="275"
            r="130"
            fill="none"
            stroke="#F1C66D"
            strokeOpacity=".2"
            strokeDasharray="3 7"
          />

          <circle
            cx="270"
            cy="275"
            r="95"
            fill="none"
            stroke="#C6922E"
            strokeOpacity=".28"
          />

          {/* Ink bottle */}

          <g
            className="
              transition-transform
              duration-700
              group-hover:-translate-x-2
            "
          >

            <path
              d="
                M95 280
                C95 260 110 250 132 250
                H180
                C200 250 214 262 214 282
                V360
                C214 382 198 395 176 395
                H132
                C108 395 95 380 95 358
                Z
              "
              fill="url(#penBody)"
              stroke="#E5C06B"
              strokeOpacity=".5"
              strokeWidth="1.5"
            />

            <rect
              x="120"
              y="230"
              width="70"
              height="28"
              rx="7"
              fill="#160506"
              stroke="#E5C06B"
              strokeOpacity=".5"
              strokeWidth="1.5"
            />

            <ellipse
              cx="155"
              cy="285"
              rx="48"
              ry="17"
              fill="#D88D38"
              fillOpacity=".1"
            />

            <rect
              x="107"
              y="270"
              width="95"
              height="100"
              rx="13"
              fill="none"
              stroke="#F1C66D"
              strokeOpacity=".13"
            />

          </g>

          {/* Fountain pen */}

          <g
            className="
              transition-transform
              duration-1000
              group-hover:rotate-[-6deg]
              group-hover:scale-105
            "
            style={{
              transformOrigin:
                "280px 275px",
            }}
          >

            {/* Long barrel */}

            <rect
              x="190"
              y="240"
              width="260"
              height="34"
              rx="17"
              fill="url(#penBody)"
              stroke="#E7C675"
              strokeOpacity=".6"
              strokeWidth="1.5"
              transform="rotate(-31 320 257)"
            />

            {/* Golden rings */}

            <rect
              x="260"
              y="220"
              width="9"
              height="55"
              rx="3"
              fill="#D6A943"
              fillOpacity=".7"
              transform="rotate(-31 264 247)"
            />

            <rect
              x="292"
              y="211"
              width="7"
              height="55"
              rx="3"
              fill="#F0D58C"
              fillOpacity=".4"
              transform="rotate(-31 296 239)"
            />

            {/* Grip */}

            <rect
              x="215"
              y="224"
              width="62"
              height="42"
              rx="14"
              fill="#280A0A"
              stroke="#E4BF67"
              strokeOpacity=".55"
              transform="rotate(-31 246 245)"
            />

            {/* Nib */}

            <path
              d="
                M385 170
                L455 214
                L390 255
                L370 224
                Z
              "
              fill="url(#inkGold)"
              stroke="#F5D98E"
              strokeOpacity=".7"
              transform="rotate(-31 410 213)"
            />

            <path
              d="
                M420 196
                L425 221
                L401 214
              "
              fill="#180506"
              fillOpacity=".8"
              transform="rotate(-31 410 213)"
            />

            <circle
              cx="397"
              cy="230"
              r="3"
              fill="#130304"
            />

          </g>

          {/* Flowing ink ribbons */}

          <path
            d="
              M35 370
              C105 300
              160 430
              235 360
              S390 285
              480 350
            "
            fill="none"
            stroke="#C6922E"
            strokeOpacity=".5"
            strokeWidth="2"
          />

          <path
            d="
              M30 400
              C120 330
              160 455
              255 380
              S390 325
              485 390
            "
            fill="none"
            stroke="#8E261B"
            strokeOpacity=".65"
            strokeWidth="3"
          />

          <path
            d="
              M50 425
              C130 355
              205 475
              300 395
              S410 360
              475 420
            "
            fill="none"
            stroke="#E5A14A"
            strokeOpacity=".24"
            strokeWidth="1"
          />

          {/* Small orbiting dots */}

          <circle
            cx="115"
            cy="165"
            r="22"
            fill="#E0A047"
            fillOpacity=".2"
          />

          <circle
            cx="407"
            cy="365"
            r="29"
            fill="#C6922E"
            fillOpacity=".14"
          />

          <circle
            cx="82"
            cy="420"
            r="8"
            fill="#E7B760"
            fillOpacity=".6"
          />

          <circle
            cx="430"
            cy="145"
            r="3"
            fill="#F5D58C"
          />

        </svg>

        {/* Editorial handwriting */}

        <div
          className="
            absolute
            left-[13%]
            top-[62%]
            rotate-[-12deg]
            font-serif
            text-[23px]
            italic
            text-[#E2AF55]/55
          "
        >
          words
        </div>

        <div
          className="
            absolute
            left-[32%]
            top-[70%]
            rotate-[-7deg]
            font-serif
            text-[20px]
            italic
            text-[#F1C878]/40
          "
        >
          narrative
        </div>

        <div
          className="
            absolute
            right-[8%]
            top-[49%]
            rotate-[10deg]
            font-serif
            text-[21px]
            italic
            text-[#D99842]/50
          "
        >
          insight
        </div>

        <div
          className="
            absolute
            left-6
            top-[28%]
            text-[7px]
            uppercase
            tracking-[0.4em]
            text-[#E8B75C]/75
          "
        >
          WORDS // INFLUENCE
        </div>

        <div
          className="
            absolute
            right-6
            bottom-[27%]
            text-[7px]
            uppercase
            tracking-[0.35em]
            text-[#E8B75C]/50
          "
        >
          WRITE · SHAPE
        </div>

      </div>
    );
  }

  /*
   * ==========================================================
   * PR / MANAGEMENT
   *
   * Network / communication / relationships
   * ==========================================================
   */

  if (
    category === "management" ||
    name.includes("management") ||
    name.includes("pr") ||
    name.includes("public")
  ) {
    return (
      <div
        className="
          absolute
          inset-0
          overflow-hidden
          bg-[#03100D]
        "
      >

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#12382D]
            via-[#071914]
            to-[#020504]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[360px]
            w-[360px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-emerald-400/10
            blur-[95px]
          "
        />

        <svg
          viewBox="0 0 500 560"
          className="
            absolute
            inset-0
            h-full
            w-full
            transition-transform
            duration-700
            group-hover:scale-[1.04]
          "
          aria-hidden="true"
        >

          {/* Communication network */}

          <g
            fill="none"
            stroke="#7DE2B6"
            strokeOpacity=".28"
            strokeWidth="1.2"
          >

            <path d="M250 280 L100 160" />
            <path d="M250 280 L400 160" />
            <path d="M250 280 L90 410" />
            <path d="M250 280 L410 410" />

            <path d="M100 160 L250 95" />
            <path d="M400 160 L250 95" />

            <path d="M90 410 L250 470" />
            <path d="M410 410 L250 470" />

          </g>

          {/* Secondary connections */}

          <g
            fill="none"
            stroke="#34D399"
            strokeOpacity=".12"
          >
            <circle
              cx="250"
              cy="280"
              r="150"
            />

            <circle
              cx="250"
              cy="280"
              r="105"
              strokeDasharray="3 8"
            />
          </g>

          {/* Nodes */}

          <g fill="#A7F3D0">

            <circle
              cx="250"
              cy="280"
              r="13"
              fillOpacity=".9"
            />

            <circle
              cx="100"
              cy="160"
              r="7"
              fillOpacity=".75"
            />

            <circle
              cx="400"
              cy="160"
              r="7"
              fillOpacity=".75"
            />

            <circle
              cx="90"
              cy="410"
              r="7"
              fillOpacity=".65"
            />

            <circle
              cx="410"
              cy="410"
              r="7"
              fillOpacity=".65"
            />

            <circle
              cx="250"
              cy="95"
              r="5"
              fillOpacity=".55"
            />

            <circle
              cx="250"
              cy="470"
              r="5"
              fillOpacity=".45"
            />

          </g>

          {/* Rotating signal ring */}

          <circle
            cx="250"
            cy="280"
            r="48"
            fill="none"
            stroke="#6EE7B7"
            strokeOpacity=".45"
            strokeDasharray="5 10"
            className="
              transition-transform
              duration-1000
              group-hover:rotate-[30deg]
            "
            style={{
              transformOrigin:
                "250px 280px",
            }}
          />

        </svg>

        <div
          className="
            absolute
            left-6
            top-[28%]
            text-[7px]
            uppercase
            tracking-[0.4em]
            text-emerald-200/65
          "
        >
          CONNECT // ALIGN
        </div>

        <div
          className="
            absolute
            right-6
            bottom-[28%]
            text-[7px]
            uppercase
            tracking-[0.3em]
            text-emerald-200/45
          "
        >
          NETWORK // 04
        </div>

      </div>
    );
  }

  /*
   * ==========================================================
   * CULTURAL
   *
   * Dance / music / stage / rhythm
   * ==========================================================
   */

  if (
    category === "cultural" ||
    name.includes("dance") ||
    name.includes("music") ||
    name.includes("culture") ||
    name.includes("avenue")
  ) {
    return (
      <div
        className="
          absolute
          inset-0
          overflow-hidden
          bg-[#150308]
        "
      >

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#62091D]
            via-[#26070E]
            to-[#050304]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-[42%]
            h-[370px]
            w-[370px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-orange-500/10
            blur-[95px]
          "
        />

        <svg
          viewBox="0 0 500 560"
          className="
            absolute
            inset-0
            h-full
            w-full
            transition-transform
            duration-700
            group-hover:scale-[1.045]
          "
          aria-hidden="true"
        >

          {/* Stage spotlight */}

          <path
            d="
              M250 65
              L120 445
              H380
              Z
            "
            fill="#F1C46A"
            fillOpacity=".045"
          />

          {/* Stage arcs */}

          <path
            d="M40 430 Q250 360 460 430"
            fill="none"
            stroke="#D9963B"
            strokeOpacity=".3"
            strokeWidth="1.5"
          />

          <path
            d="M20 470 Q250 385 480 470"
            fill="none"
            stroke="#9C241B"
            strokeOpacity=".5"
            strokeWidth="3"
          />

          {/* Dancer */}

          <g
            className="
              transition-transform
              duration-700
              group-hover:scale-105
            "
            style={{
              transformOrigin:
                "250px 390px",
            }}
          >

            <circle
              cx="260"
              cy="155"
              r="20"
              fill="none"
              stroke="#F1D18B"
              strokeWidth="3"
            />

            <path
              d="
                M253 175
                C248 220
                250 250
                230 285
              "
              fill="none"
              stroke="#E4B65A"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Arms */}

            <path
              d="
                M250 200
                C210 190
                170 155
                135 120
              "
              fill="none"
              stroke="#F0C776"
              strokeWidth="5"
              strokeLinecap="round"
            />

            <path
              d="
                M252 205
                C305 190
                350 160
                382 120
              "
              fill="none"
              stroke="#F0C776"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Legs */}

            <path
              d="
                M230 280
                C200 325
                175 365
                185 415
              "
              fill="none"
              stroke="#D89C3C"
              strokeWidth="5"
              strokeLinecap="round"
            />

            <path
              d="
                M233 275
                C270 320
                300 360
                285 415
              "
              fill="none"
              stroke="#E7BC63"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Flowing costume */}

            <path
              d="
                M210 275
                C150 300
                120 360
                150 420
                C190 375
                215 350
                235 280
                Z
              "
              fill="#C6922E"
              fillOpacity=".14"
              stroke="#E9BD65"
              strokeOpacity=".4"
            />

            <path
              d="
                M265 275
                C325 300
                355 350
                340 420
                C300 385
                270 350
                245 280
                Z
              "
              fill="#E3B55C"
              fillOpacity=".1"
              stroke="#C6922E"
              strokeOpacity=".35"
            />

          </g>

          {/* Musical particles */}

          <circle
            cx="105"
            cy="200"
            r="5"
            fill="#F1C76D"
          />

          <circle
            cx="405"
            cy="235"
            r="4"
            fill="#F1C76D"
          />

          <circle
            cx="115"
            cy="345"
            r="3"
            fill="#E26B4D"
          />

          <circle
            cx="390"
            cy="350"
            r="3"
            fill="#E26B4D"
          />

        </svg>

        {/* Equalizer */}

        <div
          className="
            absolute
            bottom-[22%]
            left-1/2
            flex
            h-12
            -translate-x-1/2
            items-end
            gap-1
          "
        >
          {[
            10,
            18,
            27,
            39,
            30,
            21,
            44,
            32,
            20,
            12,
          ].map(
            (height, index) => (
              <span
                key={index}
                className="
                  w-1
                  rounded-full
                  bg-[#E6BD68]/60
                  transition-all
                  duration-500
                  group-hover:scale-y-125
                "
                style={{
                  height:
                    `${height}px`,
                }}
              />
            ),
          )}
        </div>

        <div
          className="
            absolute
            left-6
            top-[28%]
            text-[7px]
            uppercase
            tracking-[0.4em]
            text-[#F0C978]/70
          "
        >
          RHYTHM // ENERGY
        </div>

        <div
          className="
            absolute
            right-6
            bottom-[28%]
            text-[7px]
            uppercase
            tracking-[0.32em]
            text-[#D69B3C]/55
          "
        >
          MOVE · EXPRESS
        </div>

      </div>
    );
  }

  /*
   * ==========================================================
   * FALLBACK
   * ==========================================================
   */

  return (
    <div
      className="
        absolute
        inset-0
        overflow-hidden
        bg-gradient-to-br
        from-[#540014]
        via-[#1D050A]
        to-[#030303]
      "
    >
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-64
          w-64
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[#C6922E]/20
        "
      />

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-40
          w-40
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[#C6922E]/30
        "
      />

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-16
          w-16
          -translate-x-1/2
          -translate-y-1/2
          rotate-45
          border
          border-[#E3C477]/50
        "
      />

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-5
          w-5
          -translate-x-1/2
          -translate-y-1/2
          rotate-45
          bg-[#E3C477]
        "
      />
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
  onPhotoClick,
}: {
  member: TeamMember;
  active: boolean;
  onClick: () => void;
  onPhotoClick: () => void;
}) {
  const cardRef =
    useRef<HTMLElement>(null);

  const imageRef =
    useRef<HTMLDivElement>(null);

  const initials =
    member.name
      .split(" ")
      .map(
        (word) =>
          word[0],
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const leadership =
    /director|president|head|lead|organizer|secretary|coordinator|expert|web master/i.test(
      member.role,
    );

  const moveCard = (
    event: MouseEvent<HTMLElement>,
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

    gsap.to(
      cardRef.current,
      {
        rotateX:
          -(y / rect.height) * 3,
        rotateY:
          (x / rect.width) * 3,
        scale: active
          ? 1.015
          : 1.005,
        duration: 0.35,
        ease: "power3.out",
        overwrite: true,
      },
    );

    if (imageRef.current) {
      gsap.to(
        imageRef.current,
        {
          x:
            (x / rect.width) * 5,
          y:
            (y / rect.height) * 5,
          scale: 1.025,
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
        },
      );
    }
  };

  const resetCard = () => {
    if (cardRef.current) {
      gsap.to(
        cardRef.current,
        {
          rotateX: 0,
          rotateY: 0,
          scale: active
            ? 1.005
            : 1,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        },
      );
    }

    if (imageRef.current) {
      gsap.to(
        imageRef.current,
        {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          overwrite: true,
        },
      );
    }
  };

  return (
    <article
      ref={cardRef}
      className="
        team-member-card
        group
        relative
        min-w-[270px]
        snap-center
        overflow-hidden
        rounded-[1.5rem]
        border
        border-white/[0.08]
        bg-[#10090A]
        transition-all
        duration-500
        sm:min-w-[300px]
        md:min-w-[320px]
      "
      onMouseMove={moveCard}
      onMouseLeave={resetCard}
      style={{
        transformStyle:
          "preserve-3d",
        perspective:
          "1200px",
      }}
    >

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-[#650018]/20
          via-transparent
          to-[#C6922E]/[0.04]
        "
      />

      <div
        ref={imageRef}
        className="
          relative
          aspect-[4/4.7]
          overflow-hidden
          bg-[#120607]
        "
      >

        {member.image ? (
          <button
            type="button"
            onClick={onPhotoClick}
            aria-label={`View full photo of ${member.name}`}
            className="
              absolute
              inset-0
              h-full
              w-full
              cursor-zoom-in
            "
          >
            <img
              src={member.image}
              alt={member.name}
              className="
                h-full
                w-full
                object-cover
                object-center
                grayscale-[0.12]
                transition-all
                duration-700
                group-hover:scale-[1.045]
                group-hover:grayscale-0
              "
              loading="lazy"
              draggable={false}
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-[#100608]
                via-transparent
                to-transparent
              "
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={onPhotoClick}
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-gradient-to-br
              from-[#3A0712]
              via-[#150509]
              to-[#050505]
            "
          >
            <span
              className="
                text-7xl
                font-medium
                tracking-[-0.08em]
                text-[#C6922E]/40
              "
            >
              {initials}
            </span>
          </button>
        )}

        <div
          className="
            pointer-events-none
            absolute
            left-5
            top-5
            h-8
            w-8
            border-l
            border-t
            border-[#C6922E]/40
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-5
            top-5
            h-8
            w-8
            border-r
            border-t
            border-[#C6922E]/40
          "
        />

      </div>

      <div
        className="
          relative
          z-10
          border-t
          border-white/[0.07]
          px-5
          py-5
        "
      >

        <p
          className="
            text-[8px]
            uppercase
            tracking-[0.3em]
            text-[#C6922E]
          "
        >
          {leadership
            ? "Leadership"
            : "Shrinik Team"}
        </p>

        <h3
          className="
            mt-2
            text-xl
            font-medium
            tracking-[-0.035em]
            text-[#F5F1E8]
            sm:text-2xl
          "
        >
          {member.name}
        </h3>

        <p
          className="
            mt-2
            text-[9px]
            uppercase
            tracking-[0.22em]
            text-white/35
          "
        >
          {member.role}
        </p>

      </div>

      {active && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-[1.5rem]
            border
            border-[#C6922E]/20
          "
        />
      )}

    </article>
  );
}

/*
 * ============================================================
 * FULL MEMBER PHOTO MODAL
 * ============================================================
 */

function MemberPhotoModal({
  member,
  teamCategory,
  onClose,
}: {
  member: TeamMember;
  teamCategory: string;
  onClose: () => void;
}) {
  const initials =
    member.name
      .split(" ")
      .map(
        (word) =>
          word[0],
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const leadership =
    /director|president|head|lead|organizer|secretary|coordinator|expert|web master/i.test(
      member.role,
    );

  const handleBackdropClick = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (
      event.target ===
      event.currentTarget
    ) {
      onClose();
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-black/85
        p-3
        backdrop-blur-md
        sm:p-5
      "
      role="dialog"
      aria-modal="true"
      aria-label={`Full photo of ${member.name}`}
      onMouseDown={
        handleBackdropClick
      }
    >

      <div
        className="
          relative
          w-full
          max-w-lg
          overflow-hidden
          rounded-[1.5rem]
          border
          border-[#C6922E]/30
          bg-[#100608]
          shadow-[0_40px_140px_rgba(0,0,0,0.8)]
        "
      >

        <button
          type="button"
          onClick={onClose}
          aria-label="Close full photo"
          className="
            absolute
            right-4
            top-4
            z-30
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            bg-black/60
            text-xl
            text-white/70
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-[#C6922E]/50
            hover:text-[#C6922E]
            active:scale-95
          "
        >
          ×
        </button>

        <div
          className="
            relative
            aspect-[4/5]
            max-h-[72vh]
            w-full
            overflow-hidden
            bg-[#12070A]
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
                object-center
              "
              draggable={false}
            />
          ) : (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-gradient-to-br
                from-[#3A0712]
                via-[#150509]
                to-[#050505]
              "
            >
              <span
                className="
                  text-8xl
                  font-medium
                  tracking-[-0.08em]
                  text-[#C6922E]/40
                "
              >
                {initials}
              </span>
            </div>
          )}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-48
              bg-gradient-to-t
              from-[#100608]
              via-[#100608]/30
              to-transparent
            "
          />

        </div>

        <div
          className="
            relative
            z-10
            flex
            items-end
            justify-between
            gap-6
            border-t
            border-white/[0.07]
            px-6
            py-5
            sm:px-8
            sm:py-6
          "
        >

          <div>

            <p
              className="
                text-[8px]
                uppercase
                tracking-[0.3em]
                text-[#C6922E]
              "
            >
              {leadership
                ? "Leadership"
                : "Shrinik Team"}
            </p>

            <h3
              className="
                mt-2
                text-2xl
                font-medium
                tracking-[-0.035em]
                text-[#F5F1E8]
                sm:text-3xl
              "
            >
              {member.name}
            </h3>

            <p
              className="
                mt-2
                text-[9px]
                uppercase
                tracking-[0.22em]
                text-white/35
              "
            >
              {member.role}
            </p>

            <p
              className="
                mt-3
                text-[7px]
                uppercase
                tracking-[0.25em]
                text-[#C6922E]/40
              "
            >
              {teamCategoryLabel(
                teamCategory,
              )}
            </p>

          </div>

          <span
            className="
              hidden
              shrink-0
              text-[8px]
              uppercase
              tracking-[0.22em]
              text-white/20
              sm:block
            "
          >
            Press Esc to close
          </span>

        </div>
      </div>
    </div>
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
 * TEAM VISUAL THEME
 * ============================================================
 */

function teamVisualTheme(
  category: string,
) {
  switch (category) {
    case "core":
      return {
        border:
          "border-[#C6922E]/55",
        shadow:
          "shadow-[0_25px_90px_rgba(122,0,25,0.22)]",
        glow:
          "bg-[#D89B37]/12",
        accentText:
          "text-[#E7C66B]/75",
        eyebrow:
          "COMMAND · STEER",
      };

    case "technical":
      return {
        border:
          "border-cyan-400/35",
        shadow:
          "shadow-[0_25px_90px_rgba(0,210,230,0.12)]",
        glow:
          "bg-cyan-400/10",
        accentText:
          "text-cyan-200/70",
        eyebrow:
          "SYSTEM · BUILD",
      };

    case "creative":
      return {
        border:
          "border-fuchsia-300/35",
        shadow:
          "shadow-[0_25px_90px_rgba(217,70,239,0.13)]",
        glow:
          "bg-fuchsia-400/10",
        accentText:
          "text-fuchsia-200/70",
        eyebrow:
          "FRAME · CREATE",
      };

    case "management":
      return {
        border:
          "border-emerald-300/35",
        shadow:
          "shadow-[0_25px_90px_rgba(16,185,129,0.12)]",
        glow:
          "bg-emerald-400/10",
        accentText:
          "text-emerald-200/70",
        eyebrow:
          "CONNECT · ALIGN",
      };

    case "cultural":
      return {
        border:
          "border-orange-300/35",
        shadow:
          "shadow-[0_25px_90px_rgba(234,88,12,0.14)]",
        glow:
          "bg-orange-400/10",
        accentText:
          "text-orange-200/70",
        eyebrow:
          "RHYTHM · ENERGY",
      };

    default:
      return {
        border:
          "border-[#C6922E]/35",
        shadow:
          "shadow-[0_25px_90px_rgba(198,146,46,0.1)]",
        glow:
          "bg-[#C6922E]/10",
        accentText:
          "text-[#E3C477]/70",
        eyebrow:
          "SHRNK · TEAM",
      };
  }
}

/*
 * ============================================================
 * TEAM CATEGORY LABEL
 * ============================================================
 */

function teamCategoryLabel(
  category: string,
) {
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