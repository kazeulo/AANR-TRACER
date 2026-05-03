// components/homepage/HowItWorksSection.tsx
"use client";

import { useRef, useEffect } from "react";
import { STEPS } from "@/constants/homepage";

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef      = useRef<HTMLDivElement>(null);

  // parallax lives here
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !bgRef.current) return;
      const rect   = sectionRef.current.getBoundingClientRect();
      const offset = rect.top * 0.35;
      bgRef.current.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-[100px] px-6 lg:px-[6vw] bg-[#0f2e1a] overflow-hidden">
      <div ref={bgRef} className="absolute inset-[-20%] pointer-events-none will-change-transform"
        style={{ backgroundImage: "url('/img/pcaarrd-building.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.05, filter: "grayscale(100%)" }}
      />
      <div className="absolute inset-0 bg-[#0f2e1a]/60 pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="mb-14">
          <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 pb-4 border-b-2 border-[var(--color-accent)]">
            Process
          </span>
          <h2 className="text-[clamp(30px,3vw,42px)] text-white tracking-tight">
            How <span className="text-[var(--color-accent)] italic">TRACER</span> works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map(({ n, Icon, title, desc }) => (
            <div key={n} className="bg-[var(--white-10)] border border-[var(--white-35)] hover:bg-[var(--white-15)] hover:border-[var(--color-accent)]/20 transition-all duration-300 rounded-2xl p-8">
              <div className="text-[54px] text-[var(--color-accent)] leading-none mb-5 tracking-[-2px]">{n}</div>
              <div className="w-10 h-10 rounded-[10px] bg-[var(--color-accent)]/12 flex items-center justify-center mb-5">
                <Icon className="w-[18px] h-[18px] text-[var(--color-accent)]" />
              </div>
              <div className="text-[15px] font-semibold text-white mb-3 leading-snug">{title}</div>
              <p className="text-[13px] leading-[1.75] text-white font-light">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <svg className="absolute bottom-[-1px] left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path fill="#f5f2ec" d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
      </svg>
    </section>
  );
}