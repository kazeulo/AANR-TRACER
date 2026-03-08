"use client";

import { useState, useRef } from "react";
import { categories } from "../utils/faqUtils";

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
    <main className="font-['DM_Sans',sans-serif] bg-[#f5f2ec] text-[#1a1a1a]">

      {/* ═══ HEADER ═══ */}
      <section className="relative bg-[#0f2e1a] px-6 lg:px-[6vw] pt-[80px] pb-[100px] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute -top-[150px] -right-[80px] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(74,163,90,0.15) 0%,transparent 70%)" }} />
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] mb-5 px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
            PCAARRD · AANR-TRACER
          </div>
          <h1 className="font-['DM_Serif_Display',serif] text-[clamp(38px,5vw,60px)] text-white leading-[1.1] tracking-tight mb-5 max-w-[580px]">
            Frequently Asked <em className="text-[#4aa35a]">Questions</em>
          </h1>
          <p className="text-[16px] text-[#94a3a0] font-light max-w-[500px] leading-[1.7]">
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
          <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-[#94a3a0] mb-4 pb-3 border-b border-[#e5e1d8]">
            Categories
          </div>
          {categories.map(cat => (
            <button
              key={cat.title}
              onClick={() => scrollToCategory(cat.title)}
              className={`flex items-center gap-2.5 w-full px-3.5 py-3 rounded-[10px] text-[14px] font-medium text-left mb-0.5 border transition-all duration-200 ${
                activeCategory === cat.title
                  ? "bg-[#4aa35a]/10 text-[#0f2e1a] border-[#4aa35a]/25 font-semibold"
                  : "bg-transparent text-[#6b7a75] border-transparent hover:bg-[#0f2e1a]/[0.05] hover:text-[#0f2e1a]"
              }`}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[14px] flex-shrink-0 ${
                activeCategory === cat.title ? "bg-[#4aa35a]/15" : "bg-[#f5f2ec]"
              }`}>{cat.icon}</span>
              <span className="flex-1">{cat.title}</span>
              <span className={`text-[11px] ${activeCategory === cat.title ? "text-[#4aa35a] font-semibold" : "text-[#94a3a0]"}`}>
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
                <div className="w-10 h-10 bg-[#0f2e1a] rounded-[12px] flex items-center justify-center text-[18px] flex-shrink-0">
                  {cat.icon}
                </div>
                <h2 className="font-['DM_Serif_Display',serif] text-[24px] text-[#0f2e1a] tracking-tight">
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
                        : "border-[#ede9e0] hover:shadow-[0_4px_20px_rgba(15,46,26,0.06)]"
                    } bg-white`}
                  >
                    <button
                      onClick={() => toggleFAQ(cat.title, fidx)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                    >
                      <span className={`text-[15px] leading-[1.4] ${isOpen ? "text-[#0f2e1a] font-semibold" : "text-[#1a1a1a] font-medium"}`}>
                        {faq.question}
                      </span>
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-250 ${
                        isOpen ? "bg-[#4aa35a] text-white rotate-180" : "bg-[#f5f2ec] text-[#94a3a0]"
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