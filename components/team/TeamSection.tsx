"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { teamGroups, type TeamMember } from "@/data/team";

export default function TeamSection() {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);

  const activeTeam = teamGroups[activeTeamIndex];

  const members = activeTeam?.members ?? [];

  const activeMember = members[activeMemberIndex];

  const goToTeam = (index: number) => {
    const nextIndex =
      (index + teamGroups.length) % teamGroups.length;

    setActiveTeamIndex(nextIndex);
    setActiveMemberIndex(0);
  };

  const previousTeam = () => {
    goToTeam(activeTeamIndex - 1);
  };

  const nextTeam = () => {
    goToTeam(activeTeamIndex + 1);
  };

  const previousMember = () => {
    if (!members.length) return;

    setActiveMemberIndex((current) =>
      current === 0 ? members.length - 1 : current - 1
    );
  };

  const nextMember = () => {
    if (!members.length) return;

    setActiveMemberIndex((current) =>
      current === members.length - 1 ? 0 : current + 1
    );
  };

  if (!activeTeam) {
    return null;
  }

  return (
    <section
      id="team"
      className="relative overflow-hidden bg-[#0d0206] px-6 py-32 md:px-12"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#C6922E]/[0.05] blur-[150px]" />

        <div className="absolute right-[-15%] top-[40%] h-[600px] w-[600px] rounded-full bg-[#7A001B]/20 blur-[170px]" />

        <div className="absolute inset-0 opacity-[0.025]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="text-xs uppercase tracking-[0.35em] text-[#C6922E]">
              Shrinik Club · 2026–27
            </span>

            <h2 className="mt-6 text-5xl font-medium leading-[0.92] tracking-[-0.045em] text-[#F5F1E8] md:text-7xl lg:text-8xl">
              The people
              <br />
              <span className="text-white/25">
                behind Shrinik.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-white/40">
            Meet the people building, creating, managing and
            performing with Shrinik at G.L. Bajaj.
          </p>
        </div>

        {/* ===================================================
            TEAM CATEGORY CAROUSEL
        =================================================== */}

        <div className="mt-20">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                Explore teams
              </span>

              <p className="mt-1 text-sm text-white/40">
                Select a team to discover its members.
              </p>
            </div>

            <div className="hidden gap-2 md:flex">
              <CarouselButton
                direction="left"
                onClick={previousTeam}
              />

              <CarouselButton
                direction="right"
                onClick={nextTeam}
              />
            </div>
          </div>

          {/* Horizontal category carousel */}

          <div
            className="
              flex
              snap-x
              snap-mandatory
              gap-4
              overflow-x-auto
              pb-5
              scrollbar-hide
            "
          >
            {teamGroups.map((team, index) => (
              <TeamCategoryCard
                key={team.id}
                team={team}
                index={index}
                active={index === activeTeamIndex}
                onClick={() => goToTeam(index)}
              />
            ))}
          </div>
        </div>

        {/* ===================================================
            ACTIVE TEAM TITLE
        =================================================== */}

        <div className="mt-16 flex items-end justify-between border-t border-white/[0.08] pt-10">

          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#C6922E]">
              Currently viewing
            </span>

            <h3 className="mt-3 text-4xl font-medium tracking-[-0.03em] text-[#F5F1E8] md:text-6xl">
              {activeTeam.name}
            </h3>
          </div>

          <div className="hidden text-right md:block">
            <span className="text-4xl font-light text-[#C6922E]">
              {String(members.length).padStart(2, "0")}
            </span>

            <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-white/25">
              People
            </p>
          </div>
        </div>

        {/* ===================================================
            MEMBER CAROUSEL
        =================================================== */}

        <div className="relative mt-12">

          {/* Previous */}

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
              bg-[#0d0206]/80
              text-white/60
              backdrop-blur-xl
              transition-all
              hover:border-[#C6922E]/50
              hover:text-[#C6922E]
              lg:flex
            "
          >
            <ChevronLeft size={18} />
          </button>

          {/* Cards */}

          <div
            className="
              flex
              snap-x
              snap-mandatory
              gap-5
              overflow-x-auto
              px-1
              pb-6
              scrollbar-hide
              lg:px-20
            "
          >
            {members.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                active={index === activeMemberIndex}
                onClick={() => setActiveMemberIndex(index)}
              />
            ))}
          </div>

          {/* Next */}

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
              bg-[#0d0206]/80
              text-white/60
              backdrop-blur-xl
              transition-all
              hover:border-[#C6922E]/50
              hover:text-[#C6922E]
              lg:flex
            "
          >
            <ChevronRight size={18} />
          </button>

        </div>

        {/* ===================================================
            MEMBER CONTROLS
        =================================================== */}

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-6">

          <button
            type="button"
            onClick={previousMember}
            className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/30 transition-colors hover:text-white lg:hidden"
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {members.map((member, index) => (
              <button
                key={member.id}
                type="button"
                aria-label={`View ${member.name}`}
                onClick={() => setActiveMemberIndex(index)}
                className={`
                  h-1.5 rounded-full transition-all duration-300
                  ${
                    index === activeMemberIndex
                      ? "w-8 bg-[#C6922E]"
                      : "w-1.5 bg-white/15 hover:bg-white/35"
                  }
                `}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextMember}
            className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/30 transition-colors hover:text-white lg:hidden"
          >
            Next
            <ChevronRight size={14} />
          </button>

        </div>

      </div>
    </section>
  );
}


/* ===========================================================
   TEAM CATEGORY CARD
=========================================================== */

function TeamCategoryCard({
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
  const number = String(index + 1).padStart(2, "0");

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        relative
        h-36
        min-w-[230px]
        snap-start
        overflow-hidden
        rounded-[1.5rem]
        border
        p-6
        text-left
        transition-all
        duration-500
        md:min-w-[280px]
        ${
          active
            ? "border-[#C6922E]/60 bg-[#C6922E]/[0.09]"
            : "border-white/[0.08] bg-white/[0.025] hover:border-[#C6922E]/30 hover:bg-white/[0.045]"
        }
      `}
    >
      {/* Background number */}

      <span
        className={`
          absolute
          -right-2
          -top-8
          text-[100px]
          font-medium
          tracking-[-0.08em]
          transition-colors
          duration-500
          ${
            active
              ? "text-[#C6922E]/[0.08]"
              : "text-white/[0.025] group-hover:text-white/[0.05]"
          }
        `}
      >
        {number}
      </span>

      {/* Top line */}

      <div className="relative z-10 flex items-center justify-between">
        <span
          className={`
            text-[9px]
            uppercase
            tracking-[0.25em]
            ${
              active
                ? "text-[#C6922E]"
                : "text-white/25"
            }
          `}
        >
          Team {number}
        </span>

        <span
          className={`
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            transition-all
            ${
              active
                ? "border-[#C6922E]/50 bg-[#C6922E] text-[#080808]"
                : "border-white/10 text-white/30 group-hover:border-[#C6922E]/40 group-hover:text-[#C6922E]"
            }
          `}
        >
          <ArrowUpRight size={13} />
        </span>
      </div>

      {/* Name */}

      <h4
        className={`
          relative
          z-10
          mt-7
          max-w-[190px]
          text-lg
          font-medium
          leading-tight
          tracking-tight
          transition-colors
          ${
            active
              ? "text-[#F5F1E8]"
              : "text-white/60 group-hover:text-white"
          }
        `}
      >
        {team.name}
      </h4>

      {/* Member count */}

      <span className="absolute bottom-5 right-6 text-[9px] uppercase tracking-[0.2em] text-white/20">
        {team.members.length} members
      </span>
    </button>
  );
}


/* ===========================================================
   MEMBER CARD
=========================================================== */

function MemberCard({
  member,
  active,
  onClick,
}: {
  member: TeamMember;
  active: boolean;
  onClick: () => void;
}) {
  const initials = member.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isLeadership =
    member.role.toLowerCase().includes("director") ||
    member.role.toLowerCase().includes("president") ||
    member.role.toLowerCase().includes("head") ||
    member.role.toLowerCase().includes("lead");

  return (
    <article
      onClick={onClick}
      className={`
        group
        relative
        min-w-[270px]
        max-w-[270px]
        snap-center
        cursor-pointer
        overflow-hidden
        rounded-[2rem]
        border
        bg-white/[0.025]
        transition-all
        duration-500
        sm:min-w-[310px]
        sm:max-w-[310px]
        md:min-w-[340px]
        md:max-w-[340px]
        ${
          active
            ? "border-[#C6922E]/40 shadow-[0_25px_80px_rgba(0,0,0,0.4)] lg:-translate-y-3"
            : "border-white/[0.08] opacity-70 hover:-translate-y-2 hover:opacity-100"
        }
      `}
    >

      {/* =================================================
          IMAGE
      ================================================= */}

      <div className="relative aspect-[4/4.6] overflow-hidden">

        {/* Gold ambient glow */}

        <div
          className={`
            absolute
            left-1/2
            top-1/2
            h-48
            w-48
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#C6922E]/10
            blur-[80px]
            transition-all
            duration-700
            ${
              active
                ? "bg-[#C6922E]/20"
                : "group-hover:bg-[#C6922E]/15"
            }
          `}
        />

        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="
              relative
              z-10
              h-full
              w-full
              object-cover
              grayscale
              transition-all
              duration-700
              group-hover:scale-105
              group-hover:grayscale-0
            "
          />
        ) : (
          <div className="relative z-10 flex h-full w-full items-center justify-center bg-gradient-to-br from-[#21050d] via-[#110205] to-[#050505]">

            <span
              className={`
                select-none
                text-7xl
                font-medium
                tracking-[-0.07em]
                transition-all
                duration-500
                ${
                  active
                    ? "scale-110 text-[#C6922E]/50"
                    : "text-[#C6922E]/25"
                }
              `}
            >
              {initials}
            </span>

          </div>
        )}

        {/* Bottom cinematic fade */}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-36 bg-gradient-to-t from-[#100207] to-transparent" />

        {/* Leadership */}

        {isLeadership && (
          <div className="absolute bottom-5 left-5 z-30 rounded-full border border-[#C6922E]/30 bg-[#0d0206]/75 px-3 py-1.5 backdrop-blur-md">
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#C6922E]">
              Leadership
            </span>
          </div>
        )}

        {/* Index */}

        <span className="absolute right-5 top-5 z-30 text-[9px] tracking-[0.2em] text-white/25">
          {member.role}
        </span>

      </div>

      {/* =================================================
          INFO
      ================================================= */}

      <div className="flex items-center justify-between gap-4 p-6">

        <div>
          <h4 className="text-lg font-medium tracking-tight text-[#F5F1E8]">
            {member.name}
          </h4>

          <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-[#C6922E]">
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
            ${
              active
                ? "border-[#C6922E]/50 bg-[#C6922E]/10 text-[#C6922E]"
                : "border-white/10 text-white/30 group-hover:border-[#C6922E]/40 group-hover:text-[#C6922E]"
            }
          `}
        >
          <ArrowUpRight size={14} />
        </div>

      </div>

    </article>
  );
}


/* ===========================================================
   CAROUSEL BUTTON
=========================================================== */

function CarouselButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={
        direction === "left"
          ? "Previous team"
          : "Next team"
      }
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
      "
    >
      {direction === "left" ? (
        <ChevronLeft size={16} />
      ) : (
        <ChevronRight size={16} />
      )}
    </button>
  );
}