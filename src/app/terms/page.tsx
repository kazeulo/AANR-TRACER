"use client";

import { useState, useRef } from "react";
import { categories } from "../utils/termsUtils";

export default function Terms() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0].title);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToId = (id: string) => {
    setActiveCategory(id);
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filtered = categories
    .map(cat => {
      const q = search.toLowerCase();
      const sections = cat.sections.filter(s =>
        !q ||
        cat.title.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.definition.toLowerCase().includes(q) ||
        ('examples' in s && Array.isArray(s.examples) && s.examples.some(e => e.toLowerCase().includes(q)))
      );
      if (!q || cat.title.toLowerCase().includes(q) || sections.length > 0) return { ...cat, sections };
      return null;
    })
    .filter(Boolean) as typeof categories;

  return (
    <main className="font-['DM_Sans',sans-serif] bg-[#f5f2ec] text-[#1a1a1a] min-h-screen">

      {/* ═══ HEADER ═══ */}
      <section className="relative bg-[#0f2e1a] px-6 lg:px-[6vw] pt-[80px] pb-[100px] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute -top-[150px] -right-[80px] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(74,163,90,0.15) 0%,transparent 70%)" }} />
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] mb-5 px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
            PCAARRD · AANR-TRacer
          </div>
          <h1 className="font-['DM_Serif_Display',serif] text-[clamp(38px,5vw,60px)] text-white leading-[1.1] tracking-tight mb-5 max-w-[600px]">
            Terms &amp; <em className="text-[#4aa35a]">Definitions</em>
          </h1>
          <p className="text-[16px] text-[#94a3a0] font-light max-w-[500px] leading-[1.7]">
            Clear explanations of technology types, assessment categories, and key terms used throughout the TRL assessment process.
          </p>
        </div>
      </section>

      {/* Wave */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full bg-[#0f2e1a]">
        <path fill="#1a3d26" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
      </svg>

      {/* ═══ SEARCH ═══ */}
      <div className="bg-[#1a3d26] px-6 lg:px-[6vw] py-6">
        <div className="max-w-[1200px] mx-auto relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6657] pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M16.5 16.5l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search terms, definitions, or examples…"
            className="w-full pl-12 pr-20 py-3.5 bg-white/[0.07] border border-white/10 rounded-xl text-[14px] text-white placeholder-[#4a6657] font-light focus:outline-none focus:border-[#4aa35a]/50 focus:bg-white/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#6b8a78] bg-white/10 hover:bg-white/20 hover:text-white px-2.5 py-1 rounded-md transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Wave */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full bg-[#1a3d26]">
        <path fill="#f5f2ec" d="M0,0 C360,60 1080,0 1440,40 L1440,60 L0,60 Z" />
      </svg>

      {/* ═══ BODY ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] max-w-[1400px] mx-auto min-h-[calc(100vh-400px)]">

        {/* Sidebar */}
        <aside className="hidden lg:block sticky top-0 h-screen overflow-y-auto bg-white border-r border-[#ede9e0] py-8">
          <div className="px-6 pb-5 mb-3 border-b border-[#f0ece3]">
            <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-[#94a3a0]">Browse Categories</div>
          </div>
          {categories.map(cat => (
            <button
              key={cat.title}
              onClick={() => scrollToId(cat.title)}
              className={`flex items-center gap-2.5 w-full px-6 py-2.5 border-l-2 text-left transition-all duration-200 ${
                activeCategory === cat.title
                  ? "border-[#4aa35a] bg-[#4aa35a]/[0.07]"
                  : "border-transparent hover:bg-[#0f2e1a]/[0.04]"
              }`}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[14px] flex-shrink-0 ${
                activeCategory === cat.title ? "bg-[#4aa35a]/15" : "bg-[#f5f2ec]"
              }`}>{cat.icon}</span>
              <span className={`text-[12px] leading-[1.3] ${
                activeCategory === cat.title ? "text-[#0f2e1a] font-semibold" : "text-[#6b7a75] font-medium"
              }`}>{cat.title}</span>
            </button>
          ))}
        </aside>

        {/* Main */}
        <main className="px-6 lg:px-12 py-14 max-w-[900px]">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[#94a3a0] text-[15px] font-light">
              <div className="text-[32px] mb-3">🔍</div>
              No matching terms found for "<strong className="text-[#0f2e1a]">{search}</strong>"
            </div>
          ) : (
            filtered.map(cat => (
              <div
                key={cat.title}
                className="mb-[72px] scroll-mt-10"
                ref={el => { refs.current[cat.title] = el ?? null; }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3.5 mb-8 pb-5 border-b border-[#ede9e0]">
                  <div className="w-12 h-12 bg-[#0f2e1a] rounded-[14px] flex items-center justify-center text-[22px] flex-shrink-0">
                    {cat.icon}
                  </div>
                  <h2 className="font-['DM_Serif_Display',serif] text-[26px] text-[#0f2e1a] tracking-tight leading-[1.2]">
                    {cat.title}
                  </h2>
                </div>

                {/* Section cards */}
                {cat.sections.map((section, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#ede9e0] rounded-2xl overflow-hidden mb-4 hover:shadow-[0_6px_24px_rgba(15,46,26,0.07)] transition-shadow duration-200"
                  >
                    {/* Card header */}
                    <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec]">
                      <span className="w-2 h-2 rounded-full bg-[#4aa35a] flex-shrink-0" />
                      <span className="text-[17px] font-semibold text-[#0f2e1a]">{section.title}</span>
                    </div>
                    {/* Card body */}
                    <div className="px-7 py-5">
                      <p className="text-[15px] leading-[1.85] text-[#4a5568] font-light mb-5">
                        {section.definition}
                      </p>
                      {'examples' in section && section.examples && (
                        <div className="bg-[#f8f6f1] rounded-[10px] px-5 py-4">
                          <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a] mb-2.5">
                            Examples
                          </div>
                          <ul className="flex flex-col gap-1.5">
                            {section.examples.map((ex, j) => (
                              <li key={j} className="flex items-start gap-2 text-[14px] text-[#5a6a65] font-light leading-[1.6]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a] flex-shrink-0 mt-[6px]" />
                                {ex}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </main>
      </div>
    </main>
  );
}