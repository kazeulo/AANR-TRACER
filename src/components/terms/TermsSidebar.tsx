// components/terms/TermsSidebar.tsx

import { TermIcon }    from "./TermIcon";
import type { Category } from "@/types/terms";

interface TermsSidebarProps {
  categories:     Category[];
  activeCategory: string;
  onSelect:       (title: string) => void;
}

export function TermsSidebar({ categories, activeCategory, onSelect }: TermsSidebarProps) {
  return (
    <aside className="hidden lg:block sticky top-0 h-screen overflow-y-auto bg-[var(--color-bg-card)] border-r border-[var(--color-border)] py-8">
      <div className="px-6 pb-5 mb-3 border-b border-[#f0ece3]">
        <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--color-accent-dark)]">
          Browse Categories
        </div>
      </div>

      {categories.map(cat => {
        const isActive = activeCategory === cat.title;
        return (
          <button
            key={cat.title}
            onClick={() => onSelect(cat.title)}
            className={`flex items-center gap-2.5 w-full px-6 py-2.5 border-l-2 text-left transition-all duration-200 ${
              isActive
                ? "border-[#4aa35a] bg-[var(--color-accent)]/[0.07]"
                : "border-transparent hover:bg-[#0f2e1a]/[0.04]"
            }`}
          >
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isActive ? "bg-[var(--color-accent)]/15" : "bg-[var(--color-bg)]"
            }`}>
              <TermIcon
                name={cat.icon}
                size={15}
                color={isActive ? "#4aa35a" : "#6b7a75"}
              />
            </span>
            <span className={`text-[12px] leading-[1.3] ${
              isActive
                ? "text-[var(--color-primary)] font-semibold"
                : "text-[#6b7a75] font-medium"
            }`}>
              {cat.title}
            </span>
          </button>
        );
      })}
    </aside>
  );
}