
import { useState } from "react";
import { Question } from "@/types/questions";
import { LearnMoreModal } from "../modal/LearnMoreModal";
import { ATBIContactPanel } from "../contacts/ATBIContactPanel";

// Dropdown Question 
export function DropdownQuestion({
  q,
  value,
  onChange,
  technologyType,
  expanded,
  toggleTip,
}: {
  q: Question;
  value: string | null;
  onChange: (val: string) => void;
  technologyType: string;
  expanded?: boolean;
  toggleTip?: () => void;
}) {
  const [openModal, setOpenModal] = useState(false);

  const selected = q.options?.find((o) => o.value === value);
  const showContact = selected?.contactLabel;

  return (
    <div className="bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] rounded-2xl overflow-visible transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-[14px] text-[var(--color-text-gray)] font-light leading-relaxed">
            {q.questionText}
          </p>

          {q.toolTip && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTip?.();
              }}
              className="flex-shrink-0 w-5 h-5 rounded-full border border-[var(--color-border-input)] text-[12px] flex items-center justify-center text-[var(--color-text-gray)] hover:bg-[var(--color-bg-subtle)] transition"
            >
              +
            </button>
          )}
        </div>

        {/* Tooltip — only the text + Learn more button, no modal nested here */}
        {q.toolTip && expanded && (
          <div className="mb-4 text-[13px] text-[var(--color-text-light-gray)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-lg p-3 leading-relaxed transition-all duration-300">
            <p>{q.toolTip}</p>
            {q.expandedToolTip && (
              <button
                onClick={() => setOpenModal(true)}
                className="inline-flex items-center gap-1 mt-2 text-[12px] text-[#4aa35a] hover:underline underline-offset-2 font-medium"
              >
                Learn more
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Modal is outside the tooltip guard — survives tooltip collapse */}
        {openModal && <LearnMoreModal q={q} onClose={() => setOpenModal(false)} />}

        <div className="relative">
          <select
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-3 text-[14px] text-[var(--color-text)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
          >
            <option value="">Select an option…</option>
            {q.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faintest)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {showContact && <ATBIContactPanel technologyType={technologyType} />}
      </div>
    </div>
  );
}