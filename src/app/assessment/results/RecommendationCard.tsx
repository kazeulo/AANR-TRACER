"use client";

import { useState } from "react";
import {
  fetchSteps,
  AISteps,
  RecommendationInput,
  TRL_COLORS,
  TRL_LABELS,
} from "./FetchRecommendation";
import { TRACER_DESCRIPTIONS } from "../../utils/TRACERdescriptions";

//    ─ Markdown bold renderer    ───────────────────────────────────────────────
function Md({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1
          ? <strong key={i} className="font-semibold text-[#0f2e1a]">{p}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

//    ─ Roadmap renderer    ─────────────────────────────────────────────────────
function RoadmapSteps({
  roadmap,
  closing,
  technologyName,
  technologyType,
  completedTRL,
}: {
  roadmap: AISteps["roadmap"];
  closing: string;
  technologyName: string;
  technologyType: string;
  completedTRL?: number;
}) {
  const levelTitle = (lvl: number) =>
    TRACER_DESCRIPTIONS[technologyType ?? ""]?.[lvl]?.title ?? TRL_LABELS[lvl] ?? "";
  return (
    <div className="space-y-1">

      {/* Tech identity strip */}
      <div className="flex flex-wrap items-center gap-2 pb-5 border-b border-[#f0ece3] mb-5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0f2e1a]/[0.05] border border-[#0f2e1a]/10">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0f2e1a"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
          <span className="text-[11px] font-semibold text-[#0f2e1a]">{technologyName}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4aa35a]/[0.07] border border-[#4aa35a]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
          <span className="text-[11px] font-medium text-[#2d6e3a]">{technologyType}</span>
        </div>
      </div>

      {/* Roadmap groups */}
      {roadmap?.length > 0 ? (
        <div className="space-y-7">
          {roadmap.map((group, gi) => {
            const color      = TRL_COLORS[group.trlLevel] ?? "#4aa35a";
            const label      = levelTitle(group.trlLevel);
            const hasNoLacking = !roadmap || roadmap.every(g => g.steps.length === 0);

            const headerText =
              completedTRL === 9 && hasNoLacking
                ? "Scaling Up for Long-Term Market Success"
                : completedTRL === 9
                ? "Remaining Requirements for Full Commercialization"
                : `Advancing Towards TRACER Level ${group.trlLevel}`;

            return (
              <div key={gi}>
                {/* Group header */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                    style={{ background: color }}
                  >
                    {group.trlLevel}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold tracking-[1.5px] uppercase leading-none" style={{ color }}>
                      {headerText}
                    </span>
                    <span className="text-[10.5px] text-[#94a3a0] leading-none mt-0.5">{label}</span>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-5 pl-2 border-l-2 border-[#f0ece3] ml-3">
                  {group.steps.map((step, si) => (
                    <div key={si} className="flex items-start gap-3.5 pl-4 -ml-[1px]">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white mt-0.5"
                        style={{ background: color }}
                      >
                        {si + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-semibold text-[#0f2e1a] leading-snug mb-1.5">
                          <Md text={step.action} />
                        </p>
                        <p className="text-[12.5px] text-[#6b7a75] leading-relaxed">
                          <Md text={step.detail} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[13px] text-[#94a3a0] font-light py-2">
          No outstanding action steps found.
        </p>
      )}

      {/* Closing congratulatory message */}
      {closing && (
        <div className="mt-8 pt-6 border-t border-[#f0ece3]">
          <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-gradient-to-r from-[#0f2e1a]/[0.04] to-[#4aa35a]/[0.04] border border-[#4aa35a]/20">
            <div className="w-8 h-8 rounded-xl bg-[#4aa35a]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4aa35a"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p className="text-[13px] text-[#2d4a38] font-light leading-relaxed italic">
              {closing}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

//    ─ Main component    ───────────────────────────────────────────────────────
interface Props extends RecommendationInput {
  initialSteps: AISteps | null;
  initialError?: string;
}

//    ─ Static fallback when AI is unavailable    ───────────────────────────────
function FallbackSteps({
  completedTRL,
  technologyType,
  technologyName,
  lackingItems,
}: {
  completedTRL: number;
  technologyType: string;
  technologyName: string;
  lackingItems: RecommendationInput["lackingItems"];
}) {
  // Group lacking items by TRL level
  const byLevel: Record<number, string[]> = {};
  lackingItems.forEach(item => {
    if (!byLevel[item.trlLevel]) byLevel[item.trlLevel] = [];
    byLevel[item.trlLevel].push(item.questionText);
  });
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  const color = TRL_COLORS[completedTRL] ?? "#4aa35a";

  // Tech identity strip
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2 pb-5 border-b border-[#f0ece3] mb-5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0f2e1a]/[0.05] border border-[#0f2e1a]/10">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0f2e1a"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
          <span className="text-[11px] font-semibold text-[#0f2e1a]">{technologyName}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4aa35a]/[0.07] border border-[#4aa35a]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
          <span className="text-[11px] font-medium text-[#2d6e3a]">{technologyType}</span>
        </div>
      </div>

      {levels.length === 0 ? (
        <p className="text-[13px] text-[#94a3a0] font-light py-2">
          No outstanding requirements found.
        </p>
      ) : (
        <div className="space-y-7">
          {levels.map(level => {
            const levelColor = TRL_COLORS[level] ?? "#4aa35a";
            const levelTitle = TRACER_DESCRIPTIONS[technologyType]?.[level]?.title ?? TRL_LABELS[level] ?? "";
            return (
              <div key={level}>
                {/* Group header */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                    style={{ background: levelColor }}
                  >
                    {level}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold tracking-[1.5px] uppercase leading-none" style={{ color: levelColor }}>
                      {completedTRL === 9
                        ? "Scaling Up for Long-Term Market Success"
                        : `Advancing Towards TRACER Level ${level}`}
                    </span>
                    <span className="text-[10.5px] text-[#94a3a0] leading-none mt-0.5">{levelTitle}</span>
                  </div>
                </div>

                {/* Requirement items */}
                <div className="space-y-3 pl-2 border-l-2 border-[#f0ece3] ml-3">
                  {byLevel[level].map((text, si) => (
                    <div key={si} className="flex items-start gap-3.5 pl-4 -ml-[1px]">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white mt-0.5"
                        style={{ background: levelColor }}
                      >
                        {si + 1}
                      </span>
                      <p className="text-[13px] text-[#0f2e1a] leading-snug flex-1 min-w-0">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Static closing note */}
      <div className="mt-8 pt-6 border-t border-[#f0ece3]">
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-gradient-to-r from-[#0f2e1a]/[0.04] to-[#4aa35a]/[0.04] border border-[#4aa35a]/20">
          <div className="w-8 h-8 rounded-xl bg-[#4aa35a]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4aa35a"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <p className="text-[13px] text-[#2d4a38] font-light leading-relaxed italic">
            Address each requirement above to advance your technology toward full commercialization. For personalized guidance, contact your regional Technology Transfer Specialist or retry to load AI-generated steps.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AIRecommendationCard({
  initialSteps,
  initialError,
  ...input
}: Props) {
  type Status = "done" | "error" | "loading";

  // Parent always waits for AI before rendering this card, so initialSteps
  // is always populated on mount. Internal state is only needed for Regenerate.
  const [status, setStatus] = useState<Status>(
    initialError ? "error" : initialSteps ? "done" : "loading"
  );
  const [steps,  setSteps]  = useState<AISteps | null>(initialSteps);
  const [errMsg, setErrMsg] = useState(initialError ?? "");

  const reload = (clearCache = false) => {
    if (clearCache) {
      try {
        const key = `tracer_v5_${input.completedTRL}_${input.technologyName}_${input.technologyType}`;
        sessionStorage.removeItem(key);
      } catch { /* ignore */ }
    }
    setStatus("loading");
    setSteps(null);
    setErrMsg("");
    fetchSteps(input)
      .then(s  => { setSteps(s); setStatus("done"); })
      .catch(e => { setErrMsg(e instanceof Error ? e.message : "Unknown error"); setStatus("error"); });
  };

  return (
    <div className="bg-white border border-[#ede9e0] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)]">

      {/* Card header */}
      <div className="flex items-center gap-2.5 px-7 py-4 border-b border-[#f0ede6] bg-[#f8f6f1]">
        <span className="w-2 h-2 rounded-full bg-[#4aa35a]" />
        <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">
          Action Steps
        </span>
        <span className="ml-auto text-[10px] text-[#94a3a0] bg-[#f0ece3] px-2 py-0.5 rounded-full font-medium">
          AI-powered
        </span>
      </div>

      {/* Body */}
      <div className="px-7 py-6">
        {status === "loading" && (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-7 h-7 rounded-full border-2 border-[#4aa35a]/30 border-t-[#4aa35a] animate-spin" />
            <p className="text-[12px] text-[#94a3a0]">Preparing your action steps…</p>
          </div>
        )}

        {status === "error" && (
        <div className="space-y-5">

          {/* Error notice + retry */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
              <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M8 6v3.5M8 11.5v.5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-semibold text-amber-800 mb-0.5">
                Recommendations unavailable
              </p>
              <p className="text-[11.5px] text-amber-700 font-light leading-relaxed">
                We couldn't generate personalized steps right now. Here are general guidance points based on your current TRACER Level.
              </p>
            </div>
            <button
              onClick={() => reload(true)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium text-amber-700 border border-amber-300 hover:bg-amber-100 transition-colors"
            >
              Retry
            </button>
          </div>

          {/* Static fallback content */}
          <FallbackSteps
            completedTRL={input.completedTRL}
            technologyType={input.technologyType}
            technologyName={input.technologyName}
            lackingItems={input.lackingItems}
          />

        </div>
      )}
        {status === "done" && steps && (
          <RoadmapSteps
            roadmap={steps.roadmap}
            closing={steps.closing ?? ""}
            technologyName={input.technologyName}
            technologyType={input.technologyType}
            completedTRL={input.completedTRL}
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-7 pb-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3a0"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
          </svg>
          <p className="text-[10.5px] text-[#94a3a0] font-light">
            AI-generated. Validate with a technology transfer specialist. For further assistance, contact your regional Technology Transfer Specialist.
          </p>
        </div>
      </div>
    </div>
  );
}