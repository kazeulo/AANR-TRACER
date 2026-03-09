import { TRL_LABELS } from "./UsePDFExport";

interface ScoreCardsProps {
  completedTRL: number;
  achievableTRL: number;
  completedColor: string;
  achievableColor: string;
}

export default function ScoreCards({
  completedTRL,
  achievableTRL,
  completedColor,
  achievableColor,
}: ScoreCardsProps) {
  const hasGap = achievableTRL > completedTRL;

  return (
    <div className="space-y-3">

      {/* ── Secondary: Achievable (only shown when there's a gap) ── */}
      {hasGap && (
        <div className="bg-white border border-[#ede9e0] rounded-2xl px-8 py-6 shadow-[0_4px_24px_rgba(15,46,26,0.06)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

            {/* Icon + number */}
            <div className="flex-shrink-0 flex items-center gap-3">
              {/* Upward arrow icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${achievableColor}15` }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={achievableColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </div>
              <span
                className="font-['DM_Serif_Display',serif] text-[52px] leading-none font-black"
                style={{ color: achievableColor }}
              >
                {achievableTRL}
              </span>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#94a3a0] mb-0.5">
                Highest Achievable TRL
              </p>
              <p className="text-[15px] font-semibold text-[#0f2e1a] leading-tight mb-1">
                {TRL_LABELS[achievableTRL]}
              </p>
              <p className="text-[13px] text-[#6b8a78] font-light leading-relaxed">
                Although your current level is{" "}
                <span className="font-semibold text-[#0f2e1a]">TRL {completedTRL}</span>,
                you have the foundation to reach{" "}
                <span className="font-semibold" style={{ color: achievableColor }}>TRL {achievableTRL}</span>{" "}
                by addressing the gaps identified below.
              </p>
            </div>

            {/* Gap badge */}
            <div
              className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 text-center"
              style={{ borderColor: `${achievableColor}40`, backgroundColor: `${achievableColor}08` }}
            >
              <span className="text-[10px] font-bold tracking-[1px] uppercase leading-none mb-0.5" style={{ color: achievableColor }}>
                gap
              </span>
              <span className="text-[28px] font-black leading-none" style={{ color: achievableColor }}>
                +{achievableTRL - completedTRL}
              </span>
            </div>

          </div>

          {/* Progress comparison bar */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#94a3a0] w-20 flex-shrink-0">Current</span>
              <div className="flex-1 h-2 bg-[#f0ece3] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(completedTRL / 9) * 100}%`, backgroundColor: completedColor }}
                />
              </div>
              <span className="text-[11px] font-bold text-[#4a5568] w-6 text-right">{completedTRL}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#94a3a0] w-20 flex-shrink-0">Achievable</span>
              <div className="flex-1 h-2 bg-[#f0ece3] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(achievableTRL / 9) * 100}%`, backgroundColor: achievableColor }}
                />
              </div>
              <span className="text-[11px] font-bold text-[#4a5568] w-6 text-right">{achievableTRL}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}