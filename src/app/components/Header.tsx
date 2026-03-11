"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/terms", label: "Terms & Definitions" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQs" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <>
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a1f10]/95 backdrop-blur-sm border-b border-white/5 shadow-lg shadow-black/20"
            : "bg-[#0f2e1a]"
        }`}
      >
        {/* Main bar */}
        <div className="max-w-[1370px] mx-auto px-6 py-5 lg:px-[6vw] h-[72px] flex items-center justify-between gap-8">

          {/* Brand */}
          <Link
            href="/"
            className="font-['DM_Serif_Display'] text-[24px] text-white text-bold tracking-tight leading-none flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            AANR-<span className="text-[var(--color-accent)] italic ">TRACER</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-[14px] font-medium px-3.5 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  pathname === href
                    ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                    : "text-white/60 hover:text-white hover:bg-[var(--color-bg-card)]/[0.07]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            href="/assessment/disclaimer"
            className="hidden md:inline-flex items-center text-[13px] font-semibold text-white bg-[var(--color-accent)] px-5 py-2.5 rounded-full flex-shrink-0 shadow-[0_4px_16px_rgba(74,163,90,0.35)] hover:bg-[var(--color-accent-hover)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(74,163,90,0.45)] transition-all duration-200"
          >
            Start Assessment
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(o => !o)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-[10px] bg-[var(--color-bg-card)]/[0.07] border border-white/10 gap-[5px] hover:bg-[var(--color-bg-card)]/[0.12] transition-colors flex-shrink-0"
          >
            <span className={`block w-[18px] h-[1.5px] bg-[var(--color-bg-card)] rounded-full transition-all duration-300 origin-center ${isOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
            <span className={`block w-[18px] h-[1.5px] bg-[var(--color-bg-card)] rounded-full transition-all duration-300 ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-[18px] h-[1.5px] bg-[var(--color-bg-card)] rounded-full transition-all duration-300 origin-center ${isOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden bg-[#0a1f10]/95 backdrop-blur-xl border-t border-white/[0.06] transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[400px]" : "max-h-0"
          }`}
        >
          <div className="px-6 pt-3 pb-6 flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between text-sm font-medium px-4 py-3.5 rounded-[10px] transition-all duration-200 ${
                  pathname === href
                    ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold"
                    : "text-white/60 hover:bg-[var(--color-bg-card)]/[0.06] hover:text-white"
                }`}
              >
                <span>{label}</span>
                <span className={`text-xs ${pathname === href ? "text-[var(--color-accent)]" : "text-white/30"}`}>›</span>
              </Link>
            ))}
            <div className="h-px bg-[var(--color-bg-card)]/[0.05] my-2" />
            <Link
              href="/assessment/disclaimer"
              className="flex items-center justify-center text-sm font-semibold text-white bg-[var(--color-accent)] px-4 py-3.5 rounded-[10px] hover:bg-[var(--color-accent-hover)] transition-colors mt-1"
            >
              Start Assessment →
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}