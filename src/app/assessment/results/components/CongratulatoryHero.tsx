import { AIHeader, TRL_LABELS } from "../types/FetchRecommendation";

export function CongratulatoryHero({
  trl,
  technologyName,
  technologyType,
  completedColor,
  header,
  tracerLabel,
  congratulatoryMessage,
}: {
  trl: number;
  technologyName: string;
  technologyType: string;
  completedColor: string;
  header: AIHeader | null;
  tracerLabel: string;
  congratulatoryMessage: string;
}) {
  const isTRL9 = trl === 9;

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f2e1a 0%, #1a3d26 100%)" }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow */}
      <div
        className="absolute top-0 right-0 w-[320px] h-[320px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${completedColor}20 0%, transparent 65%)` }}
      />

      {/* TRL9 dots */}
      {isTRL9 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {(
            [
              [8,  null, 14, 0.50], [22, null, 28, 0.35], [62, null,  8, 0.45],
              [78, null, 20, 0.30], [null, 10, 18, 0.50], [null,  6, 52, 0.40],
              [null, 16, 78, 0.55],
            ] as [number | null, number | null, number, number][]
          ).map(([l, r, t, o], i) => (
            <span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#4aa35a]"
              style={{
                top:   `${t}%`,
                left:  l != null ? `${l}%` : undefined,
                right: r != null ? `${r}%` : undefined,
                opacity: o,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 px-8 py-10 pb-14">

        {/* TRL badge */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div
            className="w-[84px] h-[84px] rounded-2xl flex flex-col items-center justify-center border-2"
            style={{ backgroundColor: `${completedColor}15`, borderColor: `${completedColor}35` }}
          >
            <span className="text-[9px] font-bold tracking-[2px] uppercase text-white/40 leading-none mb-0.5 text-center">TRACER Level</span>
            <span
              className="font-['DM_Serif_Display',serif] text-[46px] leading-none"
              style={{ color: completedColor }}
            >
              {trl === 0 ? "—" : trl}
            </span>
          </div>
          {trl > 0 && (
            <span className="text-[10px] text-white/35 text-center max-w-[84px] leading-tight">
              {tracerLabel || TRL_LABELS[trl]}
            </span>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">

          {/* Badge pill + TRL line */}
          <div className="mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] mb-2">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="#4aa35a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="text-[10px] font-bold tracking-[2px] uppercase text-[#4aa35a]">
                {isTRL9 ? "Maximum Readiness Reached" : "Assessment Complete"}
              </span>
            </div>
            <p className="font-['DM_Serif_Display',serif] text-[clamp(22px,3vw,32px)] text-white leading-[1.15] tracking-tight">
              {trl === 0
                ? "Your technology is at the starting line."
                : <>
                    Your technology is currently at{" "}
                    <span style={{ color: completedColor }}>TRACER Level {trl}</span>
                    {tracerLabel && (
                      <span className="text-white/60 font-normal"> — {tracerLabel}</span>
                    )}
                  </>
                }
            </p>
          </div>

          {/* Tech identity */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {technologyName && (
              <span className="text-[12px] font-semibold text-[#4aa35a]">{technologyName}</span>
            )}
            {technologyName && technologyType && (
              <span className="text-white/20 text-[12px]">·</span>
            )}
            {technologyType && (
              <span className="text-[11px] text-white/40 font-light">{technologyType}</span>
            )}
          </div>

          {/* AI headline */}
          {header === null ? (
            <div className="h-5 w-64 rounded-md bg-white/10 animate-pulse mb-2" />
          ) : header.headline ? (
            <h2 className="font-['DM_Serif_Display',serif] text-[clamp(14px,1.8vw,18px)] text-white/80 leading-[1.3] tracking-tight font-normal italic mb-2">
              {header.headline}
            </h2>
          ) : null}

          {/* AI explanation */}
          {congratulatoryMessage ? (
          <p className="text-[13px] text-white/50 font-light leading-relaxed max-w-[650px]">
            {congratulatoryMessage}
          </p>
        ) : header === null ? (
          <div className="space-y-1.5">
            <div className="h-3 w-full max-w-[480px] rounded bg-white/10 animate-pulse" />
            <div className="h-3 w-4/5 max-w-[380px] rounded bg-white/10 animate-pulse" />
          </div>
        ) : header.explanation ? (
          <p className="text-[13px] text-white/50 font-light leading-relaxed max-w-[650px]">
            {header.explanation}
          </p>
        ) : null}
        </div>
      </div>

      {/* Wave */}
      <svg
        className="absolute bottom-[-1px] left-0 w-full pointer-events-none"
        viewBox="0 0 860 24" preserveAspectRatio="none"
      >
        <path fill="#f5f2ec" d="M0,12 C215,24 645,0 860,12 L860,24 L0,24 Z" />
      </svg>
    </div>
  );
}