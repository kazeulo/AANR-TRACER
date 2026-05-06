// components/terms/SectionCard.tsx

import type { Section } from "@/types/terms";

interface SectionCardProps {
  section: Section;
}

export function SectionCard({ section }: SectionCardProps) {
  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden mb-4 hover:shadow-[0_6px_24px_rgba(15,46,26,0.07)] transition-shadow duration-200">
      {/* Card header */}
      <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec]">
        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
        <span className="text-[15px] font-semibold text-[var(--color-primary)]">
          {section.title}
        </span>
      </div>

      {/* Card body */}
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
                <li
                  key={j}
                  className="flex items-start gap-2 text-[13px] text-[#5a6a65] font-light leading-[1.6]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0 mt-[6px]" />
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}