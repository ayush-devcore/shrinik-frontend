

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
  Target,
} from "lucide-react";

import { teamGroups, type TeamMember } from "@/data/team";

gsap.registerPlugin(ScrollTrigger);

/*
 * ============================================================
 * TEAM SECTION
 * ============================================================
 */

export default function TeamSection() {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedMemberTeam, setSelectedMemberTeam] = useState<string>("");

  const sectionRef = useRef<HTMLElement>(null);
  const teamTrackRef = useRef<HTMLDivElement>(null);
  const memberTrackRef = useRef<HTMLDivElement>(null);

  const activeTeam = teamGroups[activeTeamIndex];

  const members = useMemo(() => activeTeam?.members ?? [], [activeTeam]);

  /*
   * ==========================================================
   * REDUCED MOTION
   * ==========================================================
   */

  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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
   * CAROUSEL SCROLL HELPER
   * ==========================================================
   */

  const scrollTrackToIndex = useCallback(
    (track: HTMLDivElement | null, selector: string, index: number) => {
      if (!track) return;

      const items = track.querySelectorAll<HTMLElement>(selector);

      const item = items[index];

      if (!item) return;

      const trackRect = track.getBoundingClientRect();

      const itemRect = item.getBoundingClientRect();

      const isVisible =
        itemRect.left >= trackRect.left + 10 &&
        itemRect.right <= trackRect.right - 10;

      if (isVisible) return;

      const targetLeft =
        item.offsetLeft - track.clientWidth / 2 + item.offsetWidth / 2;

      track.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: prefersReducedMotion.current ? "auto" : "smooth",
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

      const next = (index + teamGroups.length) % teamGroups.length;

      if (next === activeTeamIndex) return;

      setActiveTeamIndex(next);
      setActiveMemberIndex(0);

      requestAnimationFrame(() => {
        scrollTrackToIndex(teamTrackRef.current, ".team-category-card", next);
      });
    },
    [activeTeamIndex, scrollTrackToIndex],
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

      const next = (index + members.length) % members.length;

      setActiveMemberIndex(next);

      requestAnimationFrame(() => {
        scrollTrackToIndex(memberTrackRef.current, ".team-member-card", next);
      });
    },
    [members.length, scrollTrackToIndex],
  );

  const previousMember = useCallback(() => {
    if (!members.length) return;

    changeMember(activeMemberIndex - 1);
  }, [activeMemberIndex, changeMember, members.length]);

  const nextMember = useCallback(() => {
    if (!members.length) return;

    changeMember(activeMemberIndex + 1);
  }, [activeMemberIndex, changeMember, members.length]);

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
    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      const section = sectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();

      const visible = rect.bottom > 0 && rect.top < window.innerHeight;

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

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [previousMember, nextMember]);

  /*
   * ==========================================================
   * FULL PHOTO CARD
   * ==========================================================
   */

  useEffect(() => {
    if (!selectedMember) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedMember(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedMember]);

  /*
   * ==========================================================
   * SECTION ENTRANCE ANIMATION
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
            clearProps: "filter,transform",
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
      const elements = section.querySelectorAll<HTMLElement>(
        ".team-content-animate",
      );

      const memberCards =
        section.querySelectorAll<HTMLElement>(".team-member-card");

      gsap.killTweensOf([elements, memberCards]);

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
        memberCards,
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
    >
      {/* ======================================================
          BACKGROUND
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
              <span className="text-white/25">people behind Shrinik.</span>
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
              One community. Different skills. Different ideas. One team
              building the Shrinik experience.
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
              <RoundButton label="Previous team" onClick={previousTeam}>
                <ArrowLeft size={15} />
              </RoundButton>

              <RoundButton label="Next team" onClick={nextTeam}>
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
              <div className="flex items-center gap-3">
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
                  {teamCategoryLabel(activeTeam.category)}
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

            <div className="hidden text-right md:block">
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

        <div className="team-content-animate relative mt-12">
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
            {members.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                category={activeTeam?.category ?? "core"}
                active={index === activeMemberIndex}
                onClick={() => changeMember(index)}
                onPhotoClick={() => {
  setSelectedMember(member);
  setSelectedMemberTeam(activeTeam.category);
}}
              />
            ))}
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
            {members.map((member, index) => (
              <button
                key={member.id}
                type="button"
                aria-label={`View ${member.name}`}
                aria-current={index === activeMemberIndex ? "true" : undefined}
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

{selectedMember && (
  <MemberPhotoModal
    member={selectedMember}
    teamCategory={selectedMemberTeam}
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
  const initials = member.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const leadership =
    /director|president|head|lead|organizer|secretary|coordinator|expert|web master/i.test(
      member.role,
    );

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
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
        bg-black/80
        p-3
        backdrop-blur-md
        sm:p-5
      "
      role="dialog"
      aria-modal="true"
      aria-label={`Full photo of ${member.name}`}
      onMouseDown={handleBackdropClick}
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
          shadow-[0_40px_140px_rgba(0,0,0,0.75)]
          animate-[teamPhotoIn_0.45s_cubic-bezier(0.22,1,0.36,1)_both]
        "
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#650018]/20 via-transparent to-[#C6922E]/5 pointer-events-none" />

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
            bg-black/50
            text-xl
            text-white/60
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-[#C6922E]/50
            hover:bg-[#C6922E]/10
            hover:text-[#C6922E]
            active:scale-95
          "
        >
          ×
        </button>

        <div className="relative aspect-[4/5] max-h-[72vh] w-full overflow-hidden bg-[#12070A]">
          {member.image ? (
            <MemberImage
              src={member.image}
              name={member.name}
              initials={initials}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3A0712] via-[#150509] to-[#050505]">
              <div className="absolute h-72 w-72 rounded-full bg-[#C6922E]/10 blur-[90px]" />
              <span className="relative z-10 text-8xl font-medium tracking-[-0.08em] text-[#C6922E]/40">
                {initials}
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#100608] via-[#100608]/30 to-transparent" />
        </div>

        <div className="relative z-10 flex items-end justify-between gap-6 border-t border-white/[0.07] px-6 py-5 sm:px-8 sm:py-6">
          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-[#C6922E]">
              {leadership ? "Leadership" : "Shrinik Team"}
            </p>

            <h3 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#F5F1E8] sm:text-3xl">
              {member.name}
            </h3>

            <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-white/35">
              {member.role}
            </p>
          </div>

          <span className="hidden shrink-0 text-[8px] uppercase tracking-[0.22em] text-white/20 sm:block">
            Press Esc to close
          </span>
        </div>
      </div>
    </div>
  );
}

/*
 * ============================================================
 * TEAM VISUAL CARD
 * ============================================================
 *
 * Every team intentionally has its own visual language. The
 * layout stays consistent so the carousel feels like one system,
 * but the artwork changes according to what the team actually does.
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
  const cardRef = useRef<HTMLButtonElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const pointerRef = useRef({ x: 0, y: 0 });

  const moveCard = (event: MouseEvent<HTMLButtonElement>) => {
    if (
      !cardRef.current ||
      window.innerWidth < 768 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    pointerRef.current.x = event.clientX;
    pointerRef.current.y = event.clientY;

    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;

      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = pointerRef.current.x - rect.left - rect.width / 2;
      const y = pointerRef.current.y - rect.top - rect.height / 2;

      gsap.to(cardRef.current, {
        rotationX: -(y / rect.height) * 4.5,
        rotationY: (x / rect.width) * 4.5,
        scale: active ? 1.012 : 1.006,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });

      if (visualRef.current) {
        gsap.to(visualRef.current, {
          x: (x / rect.width) * 8,
          y: (y / rect.height) * 6,
          scale: 1.025,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
      }

      if (lightRef.current) {
        gsap.to(lightRef.current, {
          x: x * 0.12,
          y: y * 0.12,
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        });
      }
    });
  };

  const resetCard = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      rotationX: 0,
      rotationY: 0,
      scale: active ? 1.005 : 1,
      duration: 0.55,
      ease: "power3.out",
      overwrite: true,
    });

    if (visualRef.current) {
      gsap.to(visualRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        overwrite: true,
      });
    }

    if (lightRef.current) {
      gsap.to(lightRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const theme = teamTheme(team.category);

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
        willChange: "transform",
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
        transition-[border-color,opacity,box-shadow,transform]
        duration-500
        sm:min-w-[330px]
        md:h-[430px]
        md:min-w-[365px]
        ${
          active
            ? `${theme.activeBorder} ${theme.activeShadow}`
            : `border-white/[0.08] opacity-[0.78] hover:border-[#C6922E]/35 hover:opacity-100`
        }
      `}
    >
      {/* Moving visual layer */}
      <div
        ref={visualRef}
        className={`absolute inset-0 ${theme.background}`}
        style={{ willChange: "transform" }}
      >
        {/* Fine technical grid */}
        <div
          className="absolute inset-0 opacity-[0.075]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.28) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.28) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
          }}
        />

        {/* Team-specific artwork */}
        <TeamArtwork category={team.category} />

        {/* Cursor-responsive atmospheric light */}
        <div
          ref={lightRef}
          className={`
            pointer-events-none
            absolute
            left-1/2
            top-[48%]
            h-56
            w-56
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            blur-[85px]
            ${theme.glow}
          `}
          style={{ willChange: "transform" }}
        />
      </div>

      {/* Depth / readability layer */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent via-[45%] to-[#060506]/95" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Top information */}
      <div className="absolute left-6 right-6 top-6 z-20">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.34em] text-[#C6922E]">
                Team {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-8 bg-[#C6922E]/45" />
            </div>

            <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-white/35">
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

      {/* Small identity marker */}
      <div className="absolute bottom-[116px] left-6 z-20 max-w-[76%]">
        <p className="text-[8px] uppercase tracking-[0.28em] text-[#C6922E]/75">
          {theme.microLabel}
        </p>
        <p className="mt-2 max-w-[250px] text-[11px] leading-5 text-white/35">
          {theme.shortDescription}
        </p>
      </div>

      {/* Bottom title */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <div className="mb-4 h-px w-full bg-gradient-to-r from-white/15 via-white/5 to-transparent" />

        <div className="flex items-end justify-between gap-4">
          <div>
            <h4 className="max-w-[310px] text-3xl font-medium leading-[0.94] tracking-[-0.05em] text-[#F5F1E8] transition-transform duration-500 group-hover:-translate-y-1">
              {team.name}
            </h4>

            <span className="mt-3 block text-[8px] uppercase tracking-[0.22em] text-white/30">
              {String(team.members.length).padStart(2, "0")} Active Members
            </span>
          </div>

          <div className="hidden shrink-0 text-right sm:block">
            <span className="block text-[8px] uppercase tracking-[0.22em] text-white/20">
              {theme.indexLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Active edge */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[1.8rem] border transition-opacity duration-500 ${
          active
            ? "border-[#C6922E]/20 opacity-100"
            : "border-transparent opacity-0"
        }`}
      />

      {/* Subtle active sweep */}
      <div
        className={`pointer-events-none absolute bottom-0 left-0 h-px transition-all duration-700 ${
          active ? "w-full bg-[#C6922E]/70" : "w-0 bg-transparent"
        }`}
      />
    </button>
  );
}

/*
 * ============================================================
 * TEAM ARTWORK
 * ============================================================
 *
 * Core       = command / orbit / connected leadership
 * Technical  = terminal / circuits / data flow
 * Creative   = layered canvas / frames / composition
 * Management = organisation / strategy / hierarchy
 * Cultural   = sound / rhythm / stage energy
 */

function TeamArtwork({ category }: { category: string }) {
  if (category === "core") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-[10%] top-[18%] bottom-[24%]">
          <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/20" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/15" />
          <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-amber-300/25" />

          <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1.2rem] border border-amber-300/65 bg-amber-400/[0.08] shadow-[0_0_55px_rgba(245,158,11,.12)] transition-transform duration-700 group-hover:rotate-[135deg]" />
          <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200/25 bg-black/20">
            <span className="text-2xl text-amber-200">✦</span>
          </div>

          {[
            "left-1/2 top-[-3px] -translate-x-1/2",
            "right-[-3px] top-1/2 -translate-y-1/2",
            "bottom-[-3px] left-1/2 -translate-x-1/2",
            "left-[-3px] top-1/2 -translate-y-1/2",
          ].map((position) => (
            <span
              key={position}
              className={`absolute ${position} h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(245,158,11,.55)]`}
            />
          ))}

          <div className="absolute left-[10%] top-[23%] h-px w-[27%] rotate-[24deg] bg-gradient-to-r from-transparent to-amber-400/30" />
          <div className="absolute right-[10%] top-[23%] h-px w-[27%] -rotate-[24deg] bg-gradient-to-l from-transparent to-amber-400/30" />
          <div className="absolute bottom-[22%] left-[15%] h-px w-[22%] -rotate-[28deg] bg-gradient-to-r from-transparent to-amber-400/20" />
          <div className="absolute bottom-[22%] right-[15%] h-px w-[22%] rotate-[28deg] bg-gradient-to-l from-transparent to-amber-400/20" />
        </div>

        <div className="absolute left-6 top-[35%] text-[8px] font-medium uppercase tracking-[0.35em] text-amber-200/35">
          COMMAND // AUTHORITY
        </div>

        <div className="absolute bottom-[92px] right-6 text-[8px] uppercase tracking-[0.3em] text-amber-200/40">
          STEER / DECIDE / LEAD
        </div>
      </div>
    );
  }

  if (category === "technical") {
    return (
      <div className="absolute inset-0 overflow-hidden font-mono">
        <div className="absolute left-1/2 top-[43%] h-56 w-64 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-1/2 top-1/2 h-40 w-56 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-cyan-400/30 bg-[#02080A]/40 shadow-[0_0_55px_rgba(34,211,238,.08)]" />

          <div className="absolute left-[13%] top-[18%] h-px w-[74%] bg-cyan-300/20" />
          <span className="absolute left-[15%] top-[12%] h-1.5 w-1.5 rounded-full bg-cyan-300/70" />
          <span className="absolute left-[20%] top-[12%] h-1.5 w-1.5 rounded-full bg-cyan-300/35" />
          <span className="absolute left-[25%] top-[12%] h-1.5 w-1.5 rounded-full bg-cyan-300/20" />

          <div className="absolute left-[20%] top-[30%] text-[25px] tracking-[-0.15em] text-cyan-200/65">
            {"</>"}
          </div>

          <div className="absolute left-[21%] top-[52%] space-y-2">
            <div className="h-1 w-28 bg-cyan-300/25" />
            <div className="h-1 w-20 bg-cyan-300/15" />
            <div className="h-1 w-32 bg-cyan-300/10" />
          </div>

          <div className="absolute right-[-2%] top-[29%] h-px w-12 bg-cyan-300/40" />
          <div className="absolute right-[-2%] top-[29%] h-10 w-px bg-cyan-300/20" />
          <span className="absolute right-[-4%] top-[25%] h-2 w-2 rounded-full border border-cyan-300/60" />

          <div className="absolute left-[-2%] bottom-[28%] h-px w-12 bg-cyan-300/30" />
          <div className="absolute left-[-2%] bottom-[28%] h-8 w-px bg-cyan-300/15" />
          <span className="absolute left-[-4%] bottom-[23%] h-2 w-2 rounded-full border border-cyan-300/45" />

          <div className="absolute bottom-[5%] left-1/2 h-px w-36 -translate-x-1/2 bg-cyan-300/20" />

          {/* CRT scanline */}
          <div className="pointer-events-none absolute left-[13%] top-[18%] h-[64%] w-[74%] bg-gradient-to-b from-transparent via-cyan-300/[0.035] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <div className="absolute left-6 top-[34%] text-[8px] uppercase tracking-[0.2em] text-cyan-300/45">
          STATUS: ONLINE
        </div>

        <div className="absolute right-6 top-[35%] text-[8px] uppercase tracking-[0.22em] text-cyan-300/30">
          // BUILD_02
        </div>

        <div className="absolute bottom-[92px] right-6 text-[8px] uppercase tracking-[0.25em] text-cyan-300/40">
          BUILD / TEST / SHIP
        </div>
      </div>
    );
  }

  if (category === "creative") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[43%] h-56 w-64 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-[12%] top-[13%] h-40 w-48 rotate-[-10deg] rounded-[1.5rem] border border-fuchsia-400/20 bg-fuchsia-950/15 transition-transform duration-700 group-hover:rotate-[-15deg] group-hover:-translate-x-2" />
          <div className="absolute left-[12%] top-[13%] h-40 w-48 rotate-[8deg] rounded-[1.5rem] border border-purple-300/25 bg-purple-950/10 transition-transform duration-700 group-hover:rotate-[13deg] group-hover:translate-x-2" />

          <div className="absolute left-1/2 top-1/2 h-32 w-44 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] rounded-[1rem] border border-fuchsia-300/35 bg-black/20">
            <span className="absolute left-[-8px] top-[-8px] h-5 w-5 border-l border-t border-fuchsia-200/65" />
            <span className="absolute right-[-8px] bottom-[-8px] h-5 w-5 border-b border-r border-fuchsia-200/45" />

            <div className="absolute left-[25%] top-[27%] h-12 w-12 rounded-full bg-fuchsia-400/10 blur-[2px]" />
            <div className="absolute left-[42%] top-[25%] h-16 w-10 rotate-[35deg] rounded-full border border-fuchsia-200/35" />
            <div className="absolute right-[12%] top-[45%] h-10 w-20 rotate-[-25deg] rounded-full border border-purple-300/30" />
            <span className="absolute left-[46%] top-[42%] text-4xl text-fuchsia-200/65">
              ✦
            </span>
          </div>

          <span className="absolute left-[5%] top-[53%] h-2.5 w-2.5 rounded-full bg-fuchsia-300/50" />
          <span className="absolute right-[4%] top-[31%] h-2 w-2 rounded-full bg-purple-300/50" />
          <span className="absolute right-[11%] bottom-[16%] h-4 w-4 rounded-full border border-fuchsia-300/40" />
        </div>

        <div className="absolute left-6 top-[34%] text-[8px] uppercase tracking-[0.34em] text-fuchsia-200/40">
          FRAME / FORM / FEEL
        </div>

        <div className="absolute right-6 top-[35%] text-[18px] font-light tracking-[0.18em] text-fuchsia-200/15">
          Aa
        </div>
      </div>
    );
  }

  if (category === "management") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[43%] h-56 w-64 -translate-x-1/2 -translate-y-1/2">
          {/* Architectural frame */}
          <div className="absolute inset-[8%] border border-emerald-300/15" />
          <div className="absolute left-[8%] top-[8%] h-5 w-5 border-l border-t border-emerald-300/40" />
          <div className="absolute right-[8%] top-[8%] h-5 w-5 border-r border-t border-emerald-300/40" />

          {/* Network */}
          <div className="absolute left-1/2 top-[24%] h-12 w-px -translate-x-1/2 bg-emerald-300/25" />
          <div className="absolute left-[25%] top-[46%] h-px w-[50%] bg-emerald-300/25" />
          <div className="absolute left-[25%] top-[46%] h-12 w-px bg-emerald-300/20" />
          <div className="absolute right-[25%] top-[46%] h-12 w-px bg-emerald-300/20" />

          <div className="absolute left-1/2 top-[15%] flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-xl border border-emerald-300/45 bg-emerald-400/[0.06] rotate-45 transition-transform duration-700 group-hover:rotate-[135deg]">
            <Target
              className="-rotate-45 text-emerald-200/70"
              size={22}
              strokeWidth={1.2}
            />
          </div>

          {[
            "left-[11%] top-[49%]",
            "left-1/2 top-[49%] -translate-x-1/2",
            "right-[11%] top-[49%]",
          ].map((position) => (
            <div
              key={position}
              className={`absolute ${position} h-14 w-14 rounded-xl border border-emerald-300/25 bg-emerald-950/10`}
            />
          ))}

          <span className="absolute left-[20%] top-[69%] text-[7px] uppercase tracking-[0.18em] text-emerald-200/35">
            PLAN
          </span>
          <span className="absolute left-[44%] top-[69%] text-[7px] uppercase tracking-[0.18em] text-emerald-200/45">
            ALIGN
          </span>
          <span className="absolute right-[17%] top-[69%] text-[7px] uppercase tracking-[0.18em] text-emerald-200/35">
            DELIVER
          </span>

          {/* Light sweep */}
          <div className="absolute left-[-20%] top-0 h-full w-[18%] rotate-[14deg] bg-gradient-to-r from-transparent via-emerald-200/[0.06] to-transparent opacity-0 transition-all duration-700 group-hover:left-[105%] group-hover:opacity-100" />
        </div>

        <div className="absolute left-6 top-[35%] text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
          STRUCTURE / NETWORK
        </div>

        <div className="absolute bottom-[92px] right-6 text-[8px] uppercase tracking-[0.26em] text-emerald-200/40">
          ALIGN → EXECUTE
        </div>
      </div>
    );
  }

  // Culture / Dance / Music — rhythm and stage energy.
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-[43%] h-56 w-64 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute left-1/2 top-[7%] h-40 w-40 -translate-x-1/2 rounded-full border border-orange-300/15" />
        <div className="absolute left-1/2 top-[16%] h-28 w-28 -translate-x-1/2 rounded-full border border-dashed border-orange-200/25" />

        {/* Stage spotlight */}
        <div className="absolute left-1/2 top-[8%] h-36 w-24 -translate-x-1/2 rotate-[8deg] bg-gradient-to-b from-orange-300/[0.08] to-transparent blur-[8px]" />

        {/* Equalizer */}
        <div className="absolute left-1/2 top-1/2 flex h-28 -translate-x-1/2 -translate-y-1/2 items-center gap-1.5">
          {["h-8", "h-14", "h-20", "h-28", "h-18", "h-24", "h-12", "h-7"].map(
            (height, index) => (
              <span
                key={index}
                className={`w-1 rounded-full ${
                  index === 3 || index === 5
                    ? "bg-orange-200/75"
                    : "bg-orange-300/35"
                } transition-transform duration-500 group-hover:scale-y-125`}
              >
                <span className={`block w-full rounded-full ${height}`} />
              </span>
            ),
          )}
        </div>

        <span className="absolute left-[43%] top-[30%] text-5xl text-orange-200/55 transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-6">
          ♫
        </span>

        <span className="absolute left-[8%] top-[30%] h-2.5 w-2.5 rounded-full bg-orange-300/50" />
        <span className="absolute right-[8%] top-[37%] h-2 w-2 rounded-full bg-orange-200/60" />
        <span className="absolute left-[18%] bottom-[17%] h-2 w-2 rounded-full border border-orange-300/45" />
        <span className="absolute right-[18%] bottom-[14%] h-3 w-3 rounded-full border border-orange-200/30" />

        <div className="absolute bottom-[8%] left-1/2 h-px w-52 -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-300/35 to-transparent" />
      </div>

      <div className="absolute left-6 top-[34%] rotate-90 text-[8px] uppercase tracking-[0.34em] text-orange-200/35">
        RHYTHM / EXPRESSION
      </div>

      <div className="absolute right-6 top-[34%] text-[8px] uppercase tracking-[0.28em] text-orange-200/35">
        ♫ LIVE
      </div>
    </div>
  );
}

/*
 * ============================================================
 * TEAM THEMES
 * ============================================================
 */

function teamTheme(category: string) {
  switch (category) {
    case "core":
      return {
        background:
          "bg-gradient-to-br from-[#5E0018] via-[#1C070D] to-[#050505]",
        glow: "bg-amber-400/[0.06]",
        activeBorder: "border-amber-400/55",
        activeShadow: "shadow-[0_28px_100px_rgba(245,158,11,.12)]",
        microLabel: "COMMAND // CORE",
        shortDescription:
          "Direction, decisions and the people steering the community.",
        indexLabel: "01 / COMMAND",
      };

    case "technical":
      return {
        background:
          "bg-gradient-to-br from-[#10262A] via-[#091214] to-[#040607]",
        glow: "bg-cyan-400/[0.05]",
        activeBorder: "border-cyan-400/45",
        activeShadow: "shadow-[0_28px_100px_rgba(34,211,238,.10)]",
        microLabel: "SYSTEM // ONLINE",
        shortDescription:
          "Code, systems and digital experiences built from the ground up.",
        indexLabel: "02 / SYSTEM",
      };

    case "creative":
      return {
        background:
          "bg-gradient-to-br from-[#47001B] via-[#190817] to-[#060507]",
        glow: "bg-fuchsia-400/[0.06]",
        activeBorder: "border-fuchsia-400/45",
        activeShadow: "shadow-[0_28px_100px_rgba(217,70,239,.10)]",
        microLabel: "FRAME // EXPRESSION",
        shortDescription:
          "Visual ideas, media and design with a distinct point of view.",
        indexLabel: "03 / STUDIO",
      };

    case "management":
      return {
        background:
          "bg-gradient-to-br from-[#09271F] via-[#081412] to-[#040605]",
        glow: "bg-emerald-400/[0.05]",
        activeBorder: "border-emerald-400/40",
        activeShadow: "shadow-[0_28px_100px_rgba(52,211,153,.09)]",
        microLabel: "NETWORK // ALIGN",
        shortDescription:
          "Planning, coordination and execution behind every moving part.",
        indexLabel: "04 / NETWORK",
      };

    case "cultural":
      return {
        background:
          "bg-gradient-to-br from-[#4B0A16] via-[#1B070C] to-[#060506]",
        glow: "bg-orange-400/[0.06]",
        activeBorder: "border-orange-400/45",
        activeShadow: "shadow-[0_28px_100px_rgba(251,146,60,.10)]",
        microLabel: "RHYTHM // LIVE",
        shortDescription:
          "Music, dance and performance powering Shrinik's cultural side.",
        indexLabel: "05 / RHYTHM",
      };

    default:
      return {
        background:
          "bg-gradient-to-br from-[#40000F] via-[#16040A] to-[#050505]",
        glow: "bg-[#C6922E]/10",
        activeBorder: "border-[#C6922E]/60",
        activeShadow: "shadow-[0_28px_100px_rgba(198,146,46,.10)]",
        microLabel: "SHRINIK",
        shortDescription: "Different skills. Different ideas. One community.",
        indexLabel: "SHRINIK",
      };
  }
}

/*
 * ============================================================
 * MEMBER CARD THEMES
 * ============================================================
 *
 * The team card artwork and the member cards share the same
 * department identity, so the visual language continues after
 * opening a team.
 */
function memberCardTheme(category: string) {
  switch (category) {
    case "core":
      return {
        imageTint:
          "bg-gradient-to-br from-[#5A0017]/35 via-transparent to-[#0A0808]",
        activeBorder: "border-amber-400/45",
        activeShadow: "shadow-[0_30px_90px_rgba(245,158,11,.14)]",
        badgeBorder: "border-amber-400/25",
        badgeText: "text-amber-200/70",
        leadershipBorder: "border-amber-400/30",
        accentText: "text-amber-300",
        initials: "text-amber-300/35",
        initialsHover: "group-hover:text-amber-300/60",
        decorBorder: "border-amber-300/10",
        actionBorder: "border-amber-400/50",
        actionBg: "bg-amber-400/10",
        actionText: "text-amber-300",
        actionHover:
          "group-hover:border-amber-400/40 group-hover:text-amber-300",
        outerBorder: "border-amber-300/15",
      };

    case "technical":
      return {
        imageTint:
          "bg-gradient-to-br from-cyan-950/35 via-transparent to-[#050708]",
        activeBorder: "border-cyan-400/45",
        activeShadow: "shadow-[0_30px_90px_rgba(34,211,238,.12)]",
        badgeBorder: "border-cyan-400/25",
        badgeText: "text-cyan-200/70",
        leadershipBorder: "border-cyan-400/25",
        accentText: "text-cyan-300",
        initials: "text-cyan-300/30",
        initialsHover: "group-hover:text-cyan-300/55",
        decorBorder: "border-cyan-300/10",
        actionBorder: "border-cyan-400/45",
        actionBg: "bg-cyan-400/10",
        actionText: "text-cyan-300",
        actionHover: "group-hover:border-cyan-400/40 group-hover:text-cyan-300",
        outerBorder: "border-cyan-300/15",
      };

    case "creative":
      return {
        imageTint:
          "bg-gradient-to-br from-fuchsia-950/30 via-purple-950/15 to-[#070507]",
        activeBorder: "border-fuchsia-400/45",
        activeShadow: "shadow-[0_30px_90px_rgba(217,70,239,.13)]",
        badgeBorder: "border-fuchsia-400/25",
        badgeText: "text-fuchsia-200/70",
        leadershipBorder: "border-fuchsia-400/25",
        accentText: "text-fuchsia-300",
        initials: "text-fuchsia-300/30",
        initialsHover: "group-hover:text-fuchsia-300/55",
        decorBorder: "border-fuchsia-300/10",
        actionBorder: "border-fuchsia-400/45",
        actionBg: "bg-fuchsia-400/10",
        actionText: "text-fuchsia-300",
        actionHover:
          "group-hover:border-fuchsia-400/40 group-hover:text-fuchsia-300",
        outerBorder: "border-fuchsia-300/15",
      };

    case "management":
      return {
        imageTint:
          "bg-gradient-to-br from-emerald-950/30 via-blue-950/10 to-[#050706]",
        activeBorder: "border-emerald-400/40",
        activeShadow: "shadow-[0_30px_90px_rgba(52,211,153,.11)]",
        badgeBorder: "border-emerald-400/25",
        badgeText: "text-emerald-200/70",
        leadershipBorder: "border-emerald-400/25",
        accentText: "text-emerald-300",
        initials: "text-emerald-300/30",
        initialsHover: "group-hover:text-emerald-300/55",
        decorBorder: "border-emerald-300/10",
        actionBorder: "border-emerald-400/40",
        actionBg: "bg-emerald-400/10",
        actionText: "text-emerald-300",
        actionHover:
          "group-hover:border-emerald-400/35 group-hover:text-emerald-300",
        outerBorder: "border-emerald-300/15",
      };

    case "cultural":
      return {
        imageTint:
          "bg-gradient-to-br from-orange-950/30 via-rose-950/15 to-[#070506]",
        activeBorder: "border-orange-400/45",
        activeShadow: "shadow-[0_30px_90px_rgba(251,146,60,.13)]",
        badgeBorder: "border-orange-400/25",
        badgeText: "text-orange-200/70",
        leadershipBorder: "border-orange-400/25",
        accentText: "text-orange-300",
        initials: "text-orange-300/30",
        initialsHover: "group-hover:text-orange-300/55",
        decorBorder: "border-orange-300/10",
        actionBorder: "border-orange-400/45",
        actionBg: "bg-orange-400/10",
        actionText: "text-orange-300",
        actionHover:
          "group-hover:border-orange-400/40 group-hover:text-orange-300",
        outerBorder: "border-orange-300/15",
      };

    default:
      return {
        imageTint: "bg-gradient-to-br from-red-950/25 via-transparent to-black",
        activeBorder: "border-[#C6922E]/45",
        activeShadow: "shadow-[0_30px_90px_rgba(198,146,46,.12)]",
        badgeBorder: "border-[#C6922E]/25",
        badgeText: "text-[#C6922E]/70",
        leadershipBorder: "border-[#C6922E]/30",
        accentText: "text-[#C6922E]",
        initials: "text-[#C6922E]/35",
        initialsHover: "group-hover:text-[#C6922E]/55",
        decorBorder: "border-[#C6922E]/10",
        actionBorder: "border-[#C6922E]/50",
        actionBg: "bg-[#C6922E]/10",
        actionText: "text-[#C6922E]",
        actionHover:
          "group-hover:border-[#C6922E]/40 group-hover:text-[#C6922E]",
        outerBorder: "border-[#C6922E]/15",
      };
  }
}

/*
 * ============================================================
 * MEMBER CARD
 * ============================================================
 */

function MemberCard({
  member,
  category,
  active,
  onClick,
  onPhotoClick,
}: {
  member: TeamMember;
  category: string;
  active: boolean;
  onClick: () => void;
  onPhotoClick: () => void;
}) {
  const cardRef = useRef<HTMLElement>(null);

  const imageRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number | null>(null);

  const pointerRef = useRef({
    x: 0,
    y: 0,
  });

  const initials = member.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const leadership =
    /director|president|head|lead|organizer|secretary|coordinator|expert|web master/i.test(
      member.role,
    );

  const memberTheme = memberCardTheme(category);

  const moveCard = (event: MouseEvent<HTMLElement>) => {
    if (
      !cardRef.current ||
      window.innerWidth < 768 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    pointerRef.current.x = event.clientX;
    pointerRef.current.y = event.clientY;

    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;

      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();

      const x = pointerRef.current.x - rect.left - rect.width / 2;

      const y = pointerRef.current.y - rect.top - rect.height / 2;

      gsap.to(cardRef.current, {
        rotationX: -(y / rect.height) * 5,
        rotationY: (x / rect.width) * 5,
        scale: active ? 1.015 : 1.005,
        duration: 0.28,
        ease: "power2.out",
        overwrite: true,
      });

      if (imageRef.current) {
        gsap.to(imageRef.current, {
          x: x * 0.02,
          y: y * 0.02,
          scale: 1.035,
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        });
      }
    });
  };

  const resetCard = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      rotationX: 0,
      rotationY: 0,
      scale: active ? 1.005 : 1,
      duration: 0.5,
      ease: "power3.out",
      overwrite: true,
    });

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
        overwrite: true,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <article
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      onMouseMove={moveCard}
      onMouseLeave={resetCard}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1200px",
        willChange: "transform",
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
        transition-[border-color,opacity,box-shadow]
        duration-500
        outline-none
        focus-visible:ring-2
        focus-visible:ring-[#C6922E]/60
        sm:min-w-[320px]
        md:h-[450px]
        md:min-w-[340px]
        ${
          active
            ? `${memberTheme.activeBorder} ${memberTheme.activeShadow}`
            : `
              border-white/[0.07]
              opacity-80
              hover:border-white/20
              hover:opacity-100
            `
        }
      `}
    >
      <div
        ref={imageRef}
        className={`
          absolute
          inset-0
          overflow-hidden
          ${memberTheme.imageTint}
        `}
        style={{
          willChange: "transform",
        }}
      >
        {member.image ? (
          <MemberImage
            src={member.image}
            name={member.name}
            initials={initials}
            onClick={(event) => {
              event.stopPropagation();
              onPhotoClick();
            }}
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
              className={`
                relative
                z-10
                text-7xl
                font-medium
                tracking-[-0.08em]
                ${memberTheme.initials}
                transition-colors
                duration-500
                ${memberTheme.initialsHover}
              `}
            >
              {initials}
            </span>

            <div
              className={`
                absolute
                h-48
                w-48
                rounded-full
                border
                ${memberTheme.decorBorder}
              `}
            />

            <div
              className={`
                absolute
                h-36
                w-36
                rounded-full
                border
                border-dashed
                ${memberTheme.decorBorder}
              `}
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
        className={`
          absolute
          right-5
          top-5
          z-20
          rounded-full
          border
          ${memberTheme.badgeBorder}
          bg-black/30
          px-3
          py-1.5
          backdrop-blur-md
        `}
      >
        <span
          className={`
            text-[8px]
            uppercase
            tracking-[0.18em]
            ${memberTheme.badgeText}
          `}
        >
          {member.role}
        </span>
      </div>

      {leadership && (
        <div
          className={`
            absolute
            left-5
            top-5
            z-20
            rounded-full
            border
            ${memberTheme.leadershipBorder}
            bg-[#12070A]/75
            px-3
            py-1.5
            backdrop-blur-md
          `}
        >
          <span
            className={`
              text-[8px]
              uppercase
              tracking-[0.18em]
              ${memberTheme.accentText}
            `}
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
            className={`
              mt-2
              text-[8px]
              uppercase
              tracking-[0.2em]
              ${memberTheme.accentText}
            `}
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
                ? `${memberTheme.actionBorder} ${memberTheme.actionBg} ${memberTheme.actionText}`
                : `border-white/10 text-white/25 ${memberTheme.actionHover}`
            }
          `}
        >
          <ArrowUpRight size={14} />
        </div>
      </div>

      {active && (
        <div
          className={`
            pointer-events-none
            absolute
            inset-0
            z-30
            rounded-[1.8rem]
            border
            ${memberTheme.outerBorder}
          `}
        />
      )}
    </article>
  );
}

/*
 * ============================================================
 * MEMBER IMAGE
 * ============================================================
 *
 * Photos live in /public/images, so Next serves them from
 * /images/<filename>. This component also handles stale/broken
 * data paths without breaking the card.
 */

function MemberImage({
  src,
  name,
  initials,
  onClick,
}: {
  src: string;
  name: string;
  initials: string;
  onClick?: (event: MouseEvent<HTMLImageElement>) => void;
}) {
  const [failed, setFailed] = useState(false);

  const imageSrc = useMemo(() => {
    const value = src.trim();

    if (!value) return "";

    // Already a valid public URL/path.
    if (
      value.startsWith("/") ||
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    // Make relative image names work too.
    return `/images/${value.replace(/^\/+/, "")}`;
  }, [src]);

  if (failed || !imageSrc) {
    return (
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
          "
          aria-hidden="true"
        >
          {initials}
        </span>

        <span className="sr-only">Photo unavailable for {name}</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={name}
      loading="lazy"
      decoding="async"
      draggable={false}
      onClick={onClick}
      onError={() => setFailed(true)}
      className={`
        absolute
        inset-0
        h-full
        w-full
        object-cover
        object-center
        grayscale-[35%]
        transition-[transform,filter]
        duration-700
        group-hover:scale-105
        group-hover:grayscale-0
        ${onClick ? "cursor-zoom-in" : ""}
      `}
    />
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
