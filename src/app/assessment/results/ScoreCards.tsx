import { TRL_LABELS } from "./FetchRecommendation";
import TRLStepBar from "./TRLStepBar";

interface ScoreCardsProps {
  completedTRL:    number;
  achievableTRL:   number;
  completedColor:  string;
  achievableColor: string;
  lackingCount:    number;
  pendingCount?:   number;
}

export default function ScoreCards({
  completedTRL,
  achievableTRL,
  completedColor,
  achievableColor,
  lackingCount,
  pendingCount = 0,
}: ScoreCardsProps) {
  const gap = achievableTRL - completedTRL;
  const atNineWithPending = completedTRL === 9 && pendingCount > 0;

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)]">

      {/* ── Two score columns ── */}
      <div className={`grid ${gap > 0 ? "sm:grid-cols-2" : "grid-cols-1"} divide-y sm:divide-y-0 sm:divide-x divide-[#f0ece3]`}>

        {/* Completed */}
        <div className="px-7 py-7 flex flex-col gap-2">
          <p className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--color-text-faintest)]">
            Highest Completed TRACER Level
          </p>
          <div className="flex items-end gap-3 leading-none">
            <span
              className="font-['DM_Serif_Display'] text-[56px] leading-none"
              style={{ color: completedColor }}
            >
              {completedTRL === 0 ? "—" : completedTRL}
            </span>
          </div>
          <p className="text-[14px] font-semibold text-[var(--color-primary)] leading-tight">
            {TRL_LABELS[completedTRL] ?? "Not Yet Assessed"}
          </p>
          <p className="text-[12px] text-[var(--color-text-faintest)] font-light leading-relaxed mt-0.5">
            {completedTRL === 0
              ? "No TRL level has been fully satisfied yet."
              : completedTRL === 9 && pendingCount > 0
              ? `Amazing work reaching TRACER Level 9! You're almost there — just ${pendingCount} item${pendingCount !== 1 ? "s" : ""} left to fully solidify your commercialization journey.`
              : completedTRL === 9
              ? "Your technology has reached full commercial deployment."
              : `All criteria for TRACER Level ${completedTRL} and below have been met.`}
          </p>
        </div>

        {/* Achievable — only when gap > 0 */}
        {gap > 0 && (
          <div className="px-7 py-7 flex flex-col gap-2 bg-[#f8faf9]">
            <p className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--color-text-faintest)]">
              Highest Potential TRACER Level
            </p>
            <div className="flex items-end gap-3 leading-none">
              <span
                className="font-['DM_Serif_Display'] text-[56px] leading-none"
                style={{ color: achievableColor }}
              >
                {achievableTRL}
              </span>
              <span
                className="mb-3 text-[11px] font-bold px-2 py-0.5 rounded-full text-white leading-none"
                style={{ backgroundColor: achievableColor }}
              >
                +{gap}
              </span>
            </div>
            <p className="text-[14px] font-semibold text-[var(--color-primary)] leading-tight">
              {TRL_LABELS[achievableTRL]}
            </p>
            <p className="text-[12px] text-[var(--color-text-faintest)] font-light leading-relaxed mt-0.5">
              You have the foundation to reach this level by completing{" "}
              <span className="font-semibold text-[var(--color-text-gray)]">
                {lackingCount} outstanding item{lackingCount !== 1 ? "s" : ""}
              </span>{" "}
              identified in your assessment.
            </p>
          </div>
        )}
      </div>

      {/* ── Progress bar ── */}
      <div className="px-7 py-6 border-t border-[#f0ece3]">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
          <span className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--color-accent)]">
            Progress Overview
          </span>
        </div>
        <TRLStepBar completed={completedTRL} achievable={achievableTRL} />
      </div>

      {/* ── Gap notice ── */}
      {gap > 0 && (
        <div className="mx-6 mb-6 px-5 py-4 rounded-xl bg-[var(--color-accent)]/[0.05] border border-[#4aa35a]/20 flex items-start gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4aa35a"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <p className="text-[12px] text-[var(--color-text-gray)] font-light leading-relaxed">
            Currently at{" "}
            <span className="font-semibold text-[var(--color-primary)]">TRACER Level {completedTRL}</span>
            {completedTRL > 0 && (
              <span className="text-[var(--color-text-faintest)]"> ({TRL_LABELS[completedTRL]})</span>
            )}
            {" "}— with demonstrated progress toward{" "}
            <span className="font-semibold" style={{ color: achievableColor }}>
              TRACER Level {achievableTRL}
            </span>{" "}
            <span className="text-[var(--color-text-faintest)]">({TRL_LABELS[achievableTRL]})</span>.
            {" "}Complete the{" "}
            <span className="font-semibold text-[var(--color-primary)]">
              {lackingCount} item{lackingCount !== 1 ? "s" : ""}
            </span>{" "}
            in your action steps to unlock your full potential.
          </p>
        </div>
      )}

      {/* ── At TRL 9 with pending items notice ── */}
      {atNineWithPending && (
        <div className="mx-6 mb-6 px-5 py-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-[12px] text-amber-800 font-light leading-relaxed">
            You've reached{" "}
            <span className="font-semibold">TRACER Level 9</span> — an outstanding achievement! A few finishing touches remain:{" "}
            <span className="font-semibold">
              {pendingCount} item{pendingCount !== 1 ? "s" : ""}
            </span>{" "}
            still to wrap up. Check your action steps below — you're closer than ever to full commercialization.
          </p>
        </div>
      )}

    </div>
  );
}