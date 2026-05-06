"use client";

import { useState, useRef }   from "react";
import { TermsHeader }        from "@/components/terms/TermsHeader";
import { TermsSearch }        from "@/components/terms/TermsSearch";
import { TermsSidebar }       from "@/components/terms/TermsSidebar";
import { CategoryBlock }      from "@/components/terms/CategoryBlock";
import { TermsEmptyState }    from "@/components/terms/TermsEmptyState";
import { useTermsFilter }     from "@/hooks/terms/useTermsFilter";

import termsData   from "@/data/terms.json";
import type { Category } from "@/types/terms";

const categories = termsData.categories as Category[];

export default function TermsPage() {
  const [search,         setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0]?.title ?? "");
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const filtered = useTermsFilter(categories, search);

  const scrollToCategory = (title: string) => {
    setActiveCategory(title);
    refs.current[title]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!categories.length) {
    return <div className="p-10 text-center">No data found</div>;
  }

  return (
    <main className="font-['DM Sans'] bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen">

      <TermsHeader />

      <TermsSearch
        value={search}
        onChange={setSearch}
        onClear={() => setSearch("")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] max-w-[1400px] mx-auto min-h-[calc(100vh-400px)]">

        <TermsSidebar
          categories={categories}
          activeCategory={activeCategory}
          onSelect={scrollToCategory}
        />

        <section className="px-6 lg:px-12 py-14 max-w-[1100px]">
          {filtered.length === 0 ? (
            <TermsEmptyState query={search} />
          ) : (
            filtered.map(cat => (
              <CategoryBlock
                key={cat.title}
                category={cat}
                ref={el => { refs.current[cat.title] = el ?? null; }}
              />
            ))
          )}
        </section>

      </div>
    </main>
  );
}