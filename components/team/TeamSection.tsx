"use client";

import { teamMembers } from "@/data/team";
import { ArrowUpRight } from "lucide-react";

export default function TeamSection() {
    return (
    <section
        id="team"
        className="relative min-h-screen overflow-hidden bg-[#0d0206] px-6 py-32 md:px-12"
    >
        <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
            <span className="text-xs uppercase tracking-[0.35em] text-[#C6922E]">
            Team
            </span>

            <h2 className="mt-6 text-4xl font-medium tracking-tight text-[#F5F1E8] md:text-7xl">
                The people
                <br />
                <span className="text-white/35">behind Shrinik.</span>
            </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-white/40">
            [Team introduction will be added here.]
            </p>
        </div>

        {teamMembers.length === 0 ? (
            <div className="mt-16 grid min-h-[380px] place-items-center rounded-[2rem] border border-dashed border-[#C6922E]/20 bg-white/[0.015]">
            <div className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#C6922E]/25 text-[#C6922E]">
                <ArrowUpRight size={22} />
                </div>

                <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                Team members will appear here
                </p>
            </div>
            </div>
        ) : (
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
                <article
                key={member.id}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]"
                >
                <div className="aspect-[4/5] overflow-hidden">
                    <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>

                <div className="p-6">
                    <h3 className="text-xl text-[#F5F1E8]">{member.name}</h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#C6922E]">
                    {member.role}
                    </p>
                </div>
                </article>
            ))}
            </div>
        )}
        </div>
    </section>
    );
}
