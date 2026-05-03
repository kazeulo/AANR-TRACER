"use client";

import { Search, X } from "lucide-react";
import { useState, useRef } from "react";
import { iconMap } from "@/constants/terms";
import { Category } from "@/types/terms";

// terms data
import termsData from "@/data/terms.json";
const categories = termsData.categories as Category[];

function TermIcon({ name, size = 18, color = "#4aa35a" }: { name: string; size?: number; color?: string }) {
  const Icon = iconMap[name as keyof typeof iconMap];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={1.8} />;
}

export default function Terms() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0]?.title ?? "");
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToId = (id: string) => {
    setActiveCategory(id);
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filtered = categories
    .map(cat => {
      const q = search.toLowerCase();
      const sections = cat.sections?.filter(s =>
        !q ||
        cat.title.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.definition.toLowerCase().includes(q) ||
        s.examples?.some(e => e.toLowerCase().includes(q))
      );
      if (!q || cat.title.toLowerCase().includes(q) || sections.length > 0) return { ...cat, sections };
      return null;
    })
    .filter(Boolean) as Category[];

  if (!categories.length) return <div className="p-10 text-center">No data found</div>;

  return (
    <main className="font-['DM Sans'] bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen">

      {/* HEADER */}
      <section className="relative bg-[#0f2e1a] px-6 lg:px-[6vw] pt-[140px] pb-[100px] overflow-hidden">
        {/* grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "35px 35px" }} />
        
        {/* glows */}
        <div className="absolute -top-[200px] -right-[100px] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(141,197,64,0.18) 0%,transparent 50%)" }} />
        
        {/* hero */}
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <h1 className="text-[clamp(38px,5vw,60px)] text-white leading-[1.1] tracking-tight mb-5 max-w-[600px]">
            Terms &amp; <em className="text-[var(--color-accent)]">Definitions</em>
          </h1>
          <p className="text-[16px] text-[var(--color-text-faintest)] font-light max-w-[500px] leading-[1.7]">
            Clear explanations of technology types, assessment categories, and key terms used throughout the TRL assessment process.
          </p>
        </div>
      </section>

      {/* Wave */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full bg-[#0f2e1a]">
        <path fill="#1a3d26" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
      </svg>

      {/* SEARCH */}
      <div className="bg-[#1a3d26] px-6 lg:px-[6vw] py-6">
        <div className="max-w-[1000px] mx-auto relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6657] pointer-events-none"
            size={18}
            strokeWidth={1.8}
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search terms, definitions, or examples…"
            className="w-full pl-12 pr-20 py-3.5 bg-[var(--white-10)] border border-[var(--white-35)] rounded-xl text-[14px] text-white placeholder-white/40 font-light focus:outline-none focus:border-[#4aa35a] focus:bg-[var(--color-bg-card)]/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[13px] text-white bg-[var(--white-15)] hover:bg-[var(--color-bg-card)] hover:text-black px-2.5 py-1 rounded-md transition-colors"
            >
              <X size={12} strokeWidth={2} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Wave */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full bg-[#1a3d26]">
        <path fill="#f5f2ec" d="M0,0 C360,60 1080,0 1440,40 L1440,60 L0,60 Z" />
      </svg>

      {/* BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] max-w-[1400px] mx-auto min-h-[calc(100vh-400px)]">

        {/* Sidebar */}
        <aside className="hidden lg:block sticky top-0 h-screen overflow-y-auto bg-[var(--color-bg-card)] border-r border-[var(--color-border)] py-8">
          <div className="px-6 pb-5 mb-3 border-b border-[#f0ece3]">
            <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--color-accent-dark)]">Browse Categories</div>
          </div>
          {categories.map(cat => (
            <button
              key={cat.title}
              onClick={() => scrollToId(cat.title)}
              className={`flex items-center gap-2.5 w-full px-6 py-2.5 border-l-2 text-left transition-all duration-200 ${
                activeCategory === cat.title
                  ? "border-[#4aa35a] bg-[var(--color-accent)]/[0.07]"
                  : "border-transparent hover:bg-[#0f2e1a]/[0.04]"
              }`}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                activeCategory === cat.title ? "bg-[var(--color-accent)]/15" : "bg-[var(--color-bg)]"
              }`}>
                <TermIcon name={cat.icon} size={15} color={activeCategory === cat.title ? "#4aa35a" : "#6b7a75"} />
              </span>
              <span className={`text-[12px] leading-[1.3] ${
                activeCategory === cat.title ? "text-[var(--color-primary)] font-semibold" : "text-[#6b7a75] font-medium"
              }`}>{cat.title}</span>
            </button>
          ))}
        </aside>

        {/* Main */}
        <main className="px-6 lg:px-12 py-14 max-w-[1100px]">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[var(--color-text-faintest)] text-[15px] font-light">
              <div className="mb-3 w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto">
                <Search size={20} color="#4aa35a" strokeWidth={1.8} />
              </div>
              No matching terms found for "<strong className="text-[var(--color-primary)]">{search}</strong>"
            </div>
          ) : (
            filtered.map(cat => (
              <div
                key={cat.title}
                className="mb-[72px] scroll-mt-10"
                ref={el => { refs.current[cat.title] = el ?? null; }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3.5 mb-8 pb-5 border-b border-[var(--color-border)]">
                  <div className="w-12 h-12 bg-[#0f2e1a] rounded-[14px] flex items-center justify-center flex-shrink-0">
                    <TermIcon name={cat.icon} size={22} color="#4aa35a" />
                  </div>
                  <h2 className="text-[26px] text-[var(--color-primary)] tracking-tight leading-[1.2]">
                    {cat.title}
                  </h2>
                </div>

                {/* Section cards */}
                {cat.sections.map((section, i) => (
                  <div
                    key={i}
                    className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden mb-4 hover:shadow-[0_6px_24px_rgba(15,46,26,0.07)] transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec]">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                      <span className="text-[15px] font-semibold text-[var(--color-primary)]">{section.title}</span>
                    </div>
                    <div className="px-7 py-5">
                      <p className="text-[14px] leading-[1.85] text-[var(--color-text-gray)] font-light mb-5 text-justify">
                        {section.definition}
                      </p>
                      {section.examples && section.examples.length > 0 && (
                        <div className="bg-[var(--color-bg-subtle)] rounded-[10px] px-5 py-4">
                          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--color-accent)] mb-2.5">
                            Examples
                          </div>
                          <ul className="flex flex-col gap-1.5">
                            {section.examples.map((ex, j) => (
                              <li key={j} className="flex items-start gap-2 text-[13px] text-[#5a6a65] font-light leading-[1.6]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0 mt-[6px]" />
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