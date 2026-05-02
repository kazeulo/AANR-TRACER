import { AANR_TYPES } from "@/constants/homepage";
import { useState } from "react";

// showcase of supported technology types
export function TechTypeGrid() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start ">
      {AANR_TYPES.map(({ Icon, label, sub, definition }) => {
        const isOpen = expanded === label;
        return (
          <button
            aria-expanded={isOpen}
            key={label}
            onClick={() => setExpanded(prev => prev === label ? null : label)}
            className={`bg-[var(--color-bg-card)] border rounded-2xl px-5 py-5 flex flex-col items-start text-left gap-2.5 transition-all duration-200 group w-full h-fit
              ${isOpen
                ? "border-[var(--color-accent)]/40 shadow-[0_6px_24px_rgba(15,46,26,0.10)]"
                : "border-[var(--color-border)] hover:border-[var(--color-accent-hover)] hover:shadow-[0_6px_20px_rgba(15,46,26,0.07)]"
              }`}
          >
            {/* Top row */}
            <div className="flex items-center gap-3 w-full">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
                ${isOpen
                  ? "bg-[var(--color-accent)]/[0.15]"
                  : "bg-[var(--color-bg)] group-hover:bg-[var(--color-accent)]/[0.12]"
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors duration-200 ${isOpen ? "text-[#2d8a3e]" : "text-[var(--color-accent)] group-hover:text-[#2d8a3e]"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-[var(--color-primary)] leading-snug">{label}</div>
                <div className="text-[12px] text-[var(--color-text-gray)] font-light leading-tight mt-1.5">{sub}</div>
              </div>

              {/* +/− toggle icon */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 ${
                isOpen
                  ? "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10"
                  : "border-[var(--color-border)] bg-transparent group-hover:border-[var(--color-accent-hover)]/40 group-hover:bg-[#var(--color-accent)-hover]/[0.06]"
              }`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                  stroke={isOpen ? "#4aa35a" : "#94a3a0"} strokeWidth="1.8"
                  strokeLinecap="round"
                  className="transition-colors duration-200 group-hover:stroke-[var(--color-accent-hover)]"
                >
                  {isOpen ? (
                    <path d="M2 5h6" />
                  ) : (
                    <>
                      <path d="M5 2v6" />
                      <path d="M2 5h6" />
                    </>
                  )}
                </svg>
              </div>
            </div>

            {/* "Tap to learn more" hint - only shown when collapsed */}
            {!isOpen && (
              <p className="text-[10.5px] text-[var(--color-text-light-gray)] font-light italic pl-[52px] -mt-1 group-hover:text-[#4aa35a]/60 transition-colors duration-200">
                View details →
              </p>
            )}

            {/* Expanded definition */}
            {isOpen && (
              <p className="text-[12px] text-[var(--color-text)] font-light leading-relaxed border-t border-[#f0ece3] pt-3 w-full">
                {definition}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}