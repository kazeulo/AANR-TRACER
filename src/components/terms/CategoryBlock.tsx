// components/terms/CategoryBlock.tsx

import { forwardRef }  from "react";
import { TermIcon }    from "./TermIcon";
import { SectionCard } from "./SectionCard";
import type { Category } from "@/types/terms";

interface CategoryBlockProps {
  category: Category;
}

export const CategoryBlock = forwardRef<HTMLDivElement, CategoryBlockProps>(
  function CategoryBlock({ category }, ref) {
    return (
      <div ref={ref} className="mb-[72px] scroll-mt-10">
        {/* Category heading */}
        <div className="flex items-center gap-3.5 mb-8 pb-5 border-b border-[var(--color-border)]">
          <div className="w-12 h-12 bg-[#0f2e1a] rounded-[14px] flex items-center justify-center flex-shrink-0">
            <TermIcon name={category.icon} size={22} color="#4aa35a" />
          </div>
          <h2 className="text-[26px] text-[var(--color-primary)] tracking-tight leading-[1.2]">
            {category.title}
          </h2>
        </div>

        {/* Section cards — already sorted alphabetically by useTermsFilter */}
        {category.sections.map((section, i) => (
          <SectionCard key={i} section={section} />
        ))}
      </div>
    );
  }
);