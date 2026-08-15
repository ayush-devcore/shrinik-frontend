"use client";

import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/35 px-5 py-3 backdrop-blur-xl md:px-7">
        <a
          href="#top"
          className="group flex items-center gap-3"
          onClick={handleClick}
        >
          <div className="flex items-center gap-3">
            <img
              src="/assets/image.png"
              alt="Shrinik Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
          <span className="text-sm font-semibold tracking-[0.28em] text-[#F5F1E8]">
            SHRINIK
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-[0.18em] text-white/55 transition-colors duration-300 hover:text-[#F5F1E8]"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#contact"
            className="group flex items-center gap-2 rounded-full border border-[#C6922E]/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#F5F1E8] transition-all duration-300 hover:border-[#C6922E] hover:bg-[#C6922E]/10"
          >
            Connect
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="mx-2 mt-2 rounded-3xl border border-white/10 bg-[#100306]/95 p-5 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleClick}
                className="rounded-2xl px-4 py-4 text-sm uppercase tracking-[0.16em] text-white/65 transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
