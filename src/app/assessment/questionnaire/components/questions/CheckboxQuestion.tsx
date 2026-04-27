// Checkbox Question
import { useState } from "react";

// component
import { LearnMoreModal } from "../LearnMoreModal";

// type
import { Question } from "@/types/questions";

export function CheckboxQuestion({
  q,
  checked,
  onChange,
  expandedTip,
  toggleTip,
}: {
  q: Question;
  checked: boolean;
  onChange: () => void;
  expandedTip: boolean;
  toggleTip: () => void;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <label
      className={`flex items-start gap-4 cursor-pointer p-5 rounded-2xl border-2 transition-all duration-200 ${
        checked
          ? "bg-[var(--color-bg-clicked)] border-[#4aa35a]/40"
          : "bg-[var(--color-bg-card)] border-[var(--color-border)] hover:border-[#4aa35a]/25 hover:bg-[var(--color-accent)]/[0.02]"
      }`}
    >
      <div className="relative flex-shrink-0 mt-0.5">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 ${
          checked ? "bg-[var(--color-accent)] border-[#4aa35a]" : "bg-[var(--color-bg-card)] border-[#c8c3b8]"
        }`}>
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <span className={`text-[14px] leading-relaxed ${
            checked ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-text-gray)] font-light"
          }`}>
            {q.questionText}
          </span>

          {q.toolTip && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTip();
              }}
              className="flex-shrink-0 w-5 h-5 rounded-full border border-[var(--color-border-input)] text-[12px] flex items-center justify-center text-[var(--color-text-gray)] hover:bg-[var(--color-bg-subtle)] transition"
            >
              +
            </button>
          )}
        </div>

        {/* Tooltip — only text + Learn more button, no modal nested here */}
        {q.toolTip && expandedTip && (
          <div className="mb-4 text-[13px] text-[var(--color-text-light-gray)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-lg p-3 leading-relaxed transition-all duration-300">
            <p>{q.toolTip}</p>
            {q.expandedToolTip && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenModal(true);
                }}
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
      </div>
    </label>
  );
}
