import { TRL_LABELS } from "./FetchRecommendation";
import TRLStepBar from "./TRLStepBar";

interface ScoreCardsProps {
  completedTRL:    number;
  achievableTRL:   number;
  completedColor:  string;
  achievableColor: string;
  lackingCount:    number;
}

export default function ScoreCards({
  completedTRL,
  achievableTRL,
  completedColor,
  achievableColor,
  lackingCount,
}: ScoreCardsProps) {
  const gap = achievableTRL - completedTRL;

  return (
    <div className="bg-white border border-[#ede9e0] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)]">

      {/* ── Two score columns ── */}
      <div className={`grid ${gap > 0 ? "sm:grid-cols-2" : "grid-cols-1"} divide-y sm:divide-y-0 sm:divide-x divide-[#f0ece3]`}>

        {/* Completed */}
        <div className="px-7 py-7 flex flex-col gap-2">
          <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#94a3a0]">
            Highest Completed TRL
          </p>
          <div className="flex items-end gap-3 leading-none">
            <span
              className="font-['DM_Serif_Display',serif] text-[56px] leading-none"
              style={{ color: completedColor }}
            >
              {completedTRL === 0 ? "—" : completedTRL}
            </span>
          </div>
          <p className="text-[14px] font-semibold text-[#0f2e1a] leading-tight">
            {TRL_LABELS[completedTRL] ?? "Not Yet Assessed"}
          </p>
          <p className="text-[12px] text-[#94a3a0] font-light leading-relaxed mt-0.5">
            {completedTRL === 0
              ? "No TRL level has been fully satisfied yet."
              : completedTRL === 9
              ? "Your technology has reached full commercial deployment."
              : `All criteria for TRACER Level ${completedTRL} and below have been met.`}
          </p>
        </div>

        {/* Achievable — only when gap > 0 */}
        {gap > 0 && (
          <div className="px-7 py-7 flex flex-col gap-2 bg-[#f8faf9]">
            <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#94a3a0]">
              Highest Achievable TRL
            </p>
            <div className="flex items-end gap-3 leading-none">
              <span
                className="font-['DM_Serif_Display',serif] text-[56px] leading-none"
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
            <p className="text-[14px] font-semibold text-[#0f2e1a] leading-tight">
              {TRL_LABELS[achievableTRL]}
            </p>
            <p className="text-[12px] text-[#94a3a0] font-light leading-relaxed mt-0.5">
              You have the foundation to reach this level by completing{" "}
              <span className="font-semibold text-[#4a5568]">
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
          <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
          <span className="text-[10px] font-bold tracking-[2px] uppercase text-[#4aa35a]">
            Progress Overview
          </span>
        </div>
        <TRLStepBar completed={completedTRL} achievable={achievableTRL} />
      </div>

      {/* ── Gap notice ── */}
      {gap > 0 && (
        <div className="mx-6 mb-6 px-5 py-4 rounded-xl bg-[#4aa35a]/[0.05] border border-[#4aa35a]/20 flex items-start gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4aa35a"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <p className="text-[12px] text-[#4a5568] font-light leading-relaxed">
            Currently at{" "}
            <span className="font-semibold text-[#0f2e1a]">TRACER Level {completedTRL}</span>
            {completedTRL > 0 && (
              <span className="text-[#94a3a0]"> ({TRL_LABELS[completedTRL]})</span>
            )}
            {" "}— with demonstrated progress toward{" "}
            <span className="font-semibold" style={{ color: achievableColor }}>
              TRACER Level {achievableTRL}
            </span>{" "}
            <span className="text-[#94a3a0]">({TRL_LABELS[achievableTRL]})</span>.
            {" "}Complete the{" "}
            <span className="font-semibold text-[#0f2e1a]">
              {lackingCount} item{lackingCount !== 1 ? "s" : ""}
            </span>{" "}
            in your action steps to unlock your full potential.
          </p>
        </div>
      )}

    </div>
  );
}