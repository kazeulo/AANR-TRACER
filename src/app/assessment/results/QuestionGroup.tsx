import { useState } from "react";
import { QuestionItem } from "../../utils/trlCalculator";
import { TRL_LABELS, TRL_COLORS } from "./UsePDFExport";

interface QuestionGroupProps {
  title: string;
  questions: QuestionItem[];
  accent: string;
  defaultOpen?: boolean;
}

export default function QuestionGroup({
  title,
  questions,
  accent,
  defaultOpen = false,
}: QuestionGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  const byLevel: Record<number, QuestionItem[]> = {};
  questions.forEach(q => {
    if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
    byLevel[q.trlLevel].push(q);
  });
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,46,26,0.04)]">

      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-7 py-5 border-b border-[#f5f2ec] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-subtle)] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
          <span className="text-[11px] font-bold tracking-[2px] uppercase" style={{ color: accent }}>
            {title}
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: accent }}
          >
            {questions.length}
          </span>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ color: accent }}
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="px-7 py-6 space-y-6">
          {levels.map(level => (
            <div key={level}>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: TRL_COLORS[level] ?? "#64748b" }}
                >
                  TRL {level}
                </span>
                <span className="text-[12px] text-[var(--color-text-faintest)] font-light">{TRL_LABELS[level]}</span>
              </div>
              <ul className="space-y-2.5">
                {byLevel[level].map(q => (
                  <li
                    key={q.id}
                    className="flex items-start gap-3 text-[13px] text-[var(--color-text-gray)] font-light leading-relaxed"
                  >
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: accent }}
                    />
                    {q.questionText}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}