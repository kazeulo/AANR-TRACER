// components/terms/TermsSearch.tsx

import { Search, X } from "lucide-react";

interface TermsSearchProps {
  value:    string;
  onChange: (v: string) => void;
  onClear:  () => void;
}

export function TermsSearch({ value, onChange, onClear }: TermsSearchProps) {
  return (
    <>
      <div className="bg-[#1a3d26] px-6 lg:px-[6vw] py-6">
        <div className="max-w-[1000px] mx-auto relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6657] pointer-events-none"
            size={18}
            strokeWidth={1.8}
          />
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Search terms, definitions, or examples…"
            className="w-full pl-12 pr-20 py-3.5 bg-[var(--white-10)] border border-[var(--white-35)] rounded-xl text-[14px] text-white placeholder-white/40 font-light focus:outline-none focus:border-[#4aa35a] focus:bg-[var(--color-bg-card)]/10 transition-all"
          />
          {value && (
            <button
              onClick={onClear}
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
    </>
  );
}