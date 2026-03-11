import { useState } from "react";
import { QuestionItem } from "../../utils/trlCalculator";
import { TRL_LABELS, TRL_COLORS } from "./UsePDFExport";

interface AchievableBannerProps {
  completedTRL: number;
  achievableTRL: number;
  lackingItems: QuestionItem[];
  achievableColor: string;
}

export default function AchievableBanner({
  completedTRL,
  achievableTRL,
  lackingItems,
  achievableColor,
}: AchievableBannerProps) {
  const [open, setOpen] = useState(false);

  const byLevel: Record<number, QuestionItem[]> = {};
  lackingItems.forEach(q => {
    if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
    byLevel[q.trlLevel].push(q);
  });
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className="bg-[var(--color-bg-card)] border-2 border-[#4aa35a]/20 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)]">

      <div className="px-7 py-6 bg-[var(--color-accent)]/[0.04]">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4aa35a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-accent)] mb-1">
              Potential Identified
            </p>
            <p className="text-[15px] font-semibold text-[var(--color-primary)] leading-snug">
              Currently at{" "}
              <span className="font-black" style={{ color: TRL_COLORS[completedTRL] ?? "#64748b" }}>
                TRL {completedTRL}
              </span>
              {completedTRL > 0 && (
                <span className="font-normal text-[#6b7a75]"> ({TRL_LABELS[completedTRL]})</span>
              )}
              {" "}— with demonstrated progress toward{" "}
              <span className="font-black" style={{ color: achievableColor }}>
                TRL {achievableTRL}
              </span>{" "}
              <span className="font-normal text-[#6b7a75]">({TRL_LABELS[achievableTRL]})</span>.
            </p>
            <p className="text-[13px] text-[var(--color-text-faint)] font-light mt-1.5">
              Complete the{" "}
              <strong className="text-[var(--color-text-gray)] font-semibold">
                {lackingItems.length} item{lackingItems.length !== 1 ? "s" : ""}
              </strong>{" "}
              below to fully reach your highest achievable level.
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(o => !o)}
          className="mt-5 w-full flex items-center justify-between text-[13px] font-semibold px-4 py-3 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/15 transition-colors"
        >
          <span>{open ? "Hide" : "Show"} what you need to complete</span>
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="px-7 py-6 space-y-6 border-t border-[#f0ece3]">
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
                <span className="text-[11px] text-[#c8c3b8] ml-auto">
                  {byLevel[level].length} item{byLevel[level].length !== 1 ? "s" : ""}
                </span>
              </div>
              <ul className="space-y-2.5">
                {byLevel[level].map(q => (
                  <li
                    key={q.id}
                    className="flex items-start gap-3 text-[13px] text-[var(--color-text-gray)] font-light leading-relaxed"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
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