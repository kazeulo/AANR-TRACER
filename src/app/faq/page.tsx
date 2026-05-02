"use client";

import { useState, useRef } from "react";
import { categories } from "@/data/faqUtils";

// SVG Icon component 

function CategoryIcon({ name, size = 16, color = "#4aa35a" }: { name: string; size?: number; color?: string }) {
  const s = { width: size, height: size, fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "chat")      return <svg viewBox="0 0 24 24" style={s}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
  if (name === "flask")     return <svg viewBox="0 0 24 24" style={s}><path d="M9 3h6M10 3v7l-4 9h12l-4-9V3"/><path d="M9 16h6"/></svg>;
  if (name === "lightbulb") return <svg viewBox="0 0 24 24" style={s}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26A7 7 0 0 1 12 2z"/></svg>;
  if (name === "chart")     return <svg viewBox="0 0 24 24" style={s}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
  return null;
}

//  Page 

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<Record<string, number | null>>({});
  const [activeCategory, setActiveCategory] = useState(categories[0].title);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleFAQ = (category: string, index: number) => {
    setOpenIndex(prev => ({ ...prev, [category]: prev[category] === index ? null : index }));
  };

  const scrollToCategory = (title: string) => {
    setActiveCategory(title);
    refs.current[title]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="font-['DM Sans'] bg-[var(--color-bg)] text-[var(--color-text)]">

      {/* ═══ HEADER ═══ */}
      <section className="relative bg-[#0f2e1a] px-6 lg:px-[6vw] pt-[80px] pb-[100px] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute -top-[150px] -right-[80px] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(74,163,90,0.15) 0%,transparent 70%)" }} />
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <h1 className=" text-[clamp(38px,5vw,60px)] text-white leading-[1.1] tracking-tight mb-5 max-w-[580px]">
            Frequently Asked <em className="text-[var(--color-accent)]">Questions</em>
          </h1>
          <p className="text-[16px] text-[var(--color-text-faintest)] font-light max-w-[500px] leading-[1.7]">
            Everything you need to know about AANR TRACER — how it works, what to expect, and how to make the most of your assessment.
          </p>
        </div>
      </section>

      {/* Wave */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full bg-[#0f2e1a]">
        <path fill="#f5f2ec" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
      </svg>

      {/* ═══ BODY ═══ */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-[6vw] py-20 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-16 items-start">

        {/* Sidebar */}
        <aside className="hidden lg:block sticky top-[72px]">
          <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--color-text-gray)] mb-4 pb-3 border-b border-[var(--color-border-input)]">
            Categories
          </div>
          {categories.map(cat => (
            <button
              key={cat.title}
              onClick={() => scrollToCategory(cat.title)}
              className={`flex items-center gap-2.5 w-full px-3.5 py-3 rounded-[10px] text-[14px] font-medium text-left mb-0.5 border transition-all duration-200 ${
                activeCategory === cat.title
                  ? "bg-white text-[var(--color-primary)] border-[#4aa35a]/25 font-semibold"
                  : "bg-transparent text-[#6b7a75] border-transparent hover:bg-[#0f2e1a]/[0.05] hover:text-[var(--color-primary)]"
              }`}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                activeCategory === cat.title ? "bg-[var(--color-accent)]/15" : "bg-[var(--color-bg)]"
              }`}>
                <CategoryIcon
                  name={cat.icon}
                  size={15}
                  color={activeCategory === cat.title ? "#4aa35a" : "#6b7a75"}
                />
              </span>
              <span className="flex-1">{cat.title}</span>
              <span className={`text-[11px] ${activeCategory === cat.title ? "text-[var(--color-accent)] font-semibold" : "text-[var(--color-text-faintest)]"}`}>
                {cat.faqs.length}
              </span>
            </button>
          ))}
        </aside>

        {/* FAQ groups */}
        <div className="flex flex-col gap-14">
          {categories.map(cat => (
            <div
              key={cat.title}
              className="scroll-mt-[100px]"
              ref={el => { refs.current[cat.title] = el ?? null; }}
            >
              {/* Group header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0f2e1a] rounded-[12px] flex items-center justify-center flex-shrink-0">
                  <CategoryIcon name={cat.icon} size={18} color="#4aa35a" />
                </div>
                <h2 className=" text-[24px] text-[var(--color-primary)] tracking-tight">
                  {cat.title}
                </h2>
                <div className="flex-1 h-px bg-[#e5e1d8]" />
              </div>

              {/* Accordion */}
              {cat.faqs.map((faq, fidx) => {
                const isOpen = openIndex[cat.title] === fidx;
                return (
                  <div
                    key={fidx}
                    className={`mb-2 rounded-[14px] border overflow-hidden transition-all duration-200 ${
                      isOpen
                        ? "border-[#4aa35a]/30 shadow-[0_4px_20px_rgba(74,163,90,0.08)]"
                        : "border-[var(--color-border)] hover:shadow-[0_4px_20px_rgba(15,46,26,0.06)]"
                    } bg-[var(--color-bg-card)]`}
                  >
                    <button
                      onClick={() => toggleFAQ(cat.title, fidx)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                    >
                      <span className={`text-[15px] leading-[1.4] ${isOpen ? "text-[var(--color-primary)] font-semibold" : "text-[var(--color-text)] font-medium"}`}>
                        {faq.question}
                      </span>
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-250 ${
                        isOpen ? "bg-[var(--color-accent)] text-white rotate-180" : "bg-[var(--color-bg)] text-[var(--color-text-faintest)]"
                      }`}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-0 text-[14px] leading-[1.8] text-[#5a6a65] font-light border-t border-[#f0ece3]">
                        <div className="pt-4">{faq.answer}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}