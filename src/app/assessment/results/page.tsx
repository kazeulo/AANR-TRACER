"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";
import { calculateTRL, QuestionItem, TRLResult } from "../../utils/trlCalculator";
import { usePDFExport, PDFContent, TRL_COLORS, TRL_LABELS } from "./UsePDFExport";

import ScoreCards           from "./ScoreCards";
import AchievableBanner     from "./AchievableBanner";
import QuestionGroup        from "./QuestionGroup";
import AIRecommendationCard from "./RecommendationCard";
import ExportModal          from "./ExportModal";

// ─── Congratulatory copy per TRL level ───────────────────────────────────────

// ─── Hardcoded TRL messages ───────────────────────────────────────────────────

const TRL_MESSAGES: Record<number, { headline: string; sub: string }> = {
  0: {
    headline: "Every great technology starts with an idea.",
    sub: "Completing this assessment helps you understand where your technology stands. Use the results below as a roadmap to move from concept to real-world impact.",
  },
  1: {
    headline: "You've defined the concept and the market need.",
    sub: "TRL 1 means you've identified the problem and clarified the opportunity your technology addresses. This clear direction is the foundation for meaningful innovation.",
  },
  2: {
    headline: "Your design and prototype plan are taking shape.",
    sub: "At TRL 2, you've translated your concept into an initial design or formulation and planned how the prototype will be built. You're moving from ideas toward tangible development.",
  },
  3: {
    headline: "Your prototype is being developed and tested.",
    sub: "TRL 3 marks the stage where your prototype is built and evaluated in the laboratory. Early testing provides valuable insights that refine the technology and strengthen its potential.",
  },
  4: {
    headline: "Your technology has passed controlled validation.",
    sub: "At TRL 4, your prototype has been validated in controlled conditions and may be progressing toward intellectual property protection. This strengthens credibility and readiness for broader testing.",
  },
  5: {
    headline: "Pilot testing has begun with industry engagement.",
    sub: "TRL 5 shows that your technology is moving beyond the lab into pilot testing with potential partners or stakeholders. Collaboration at this stage helps align your solution with real-world needs.",
  },
  6: {
    headline: "Testing across locations prepares you for scale.",
    sub: "At TRL 6, your technology is being evaluated in multiple environments while preparing for larger-scale deployment. This stage builds confidence that the solution can perform reliably in diverse settings.",
  },
  7: {
    headline: "Industry validation and regulatory preparation are underway.",
    sub: "TRL 7 indicates that your technology has been validated with industry partners and is progressing through regulatory processes. You're now approaching full operational readiness.",
  },
  8: {
    headline: "Your technology is ready for commercial production.",
    sub: "TRL 8 means the system has been finalized and qualified for market entry. Production processes, supply chains, and operational readiness are coming together.",
  },
  9: {
    headline: "Your technology has reached full commercialization.",
    sub: "TRL 9 represents the highest level of readiness. Your technology is deployed in the market and delivering real-world impact.",
  },
};

// ─── Congratulatory Hero ──────────────────────────────────────────────────────

function CongratulatoryHero({
  trl,
  technologyName,
  completedColor,
}: {
  trl: number;
  technologyName: string;
  completedColor: string;
}) {
  const isTL9 = trl === 9;
  const msg   = TRL_MESSAGES[trl] ?? TRL_MESSAGES[0];

  return (
    <div className="relative rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f2e1a 0%, #1a3d26 100%)" }}>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

      {/* Radial glow behind TRL number */}
      <div className="absolute top-0 right-0 w-[320px] h-[320px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${completedColor}20 0%, transparent 65%)` }} />

      {/* Scattered dots for TRL 9 */}
      {isTL9 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {([
            [8, null, 14, 0.5], [22, null, 28, 0.35], [62, null, 8, 0.45],
            [78, null, 20, 0.3], [null, 10, 18, 0.5], [null, 6, 52, 0.4],
            [null, 16, 78, 0.55],
          ] as [number|null, number|null, number, number][]).map(([l, r, t, o], i) => (
            <span key={i} className="absolute w-1 h-1 rounded-full bg-[#4aa35a]"
              style={{ top: `${t}%`, left: l != null ? `${l}%` : undefined, right: r != null ? `${r}%` : undefined, opacity: o }} />
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
            <span className="text-[9px] font-bold tracking-[2px] uppercase text-white/40 leading-none mb-0.5">TRL</span>
            <span
              className="font-[\'DM_Serif_Display\',serif] text-[46px] leading-none"
              style={{ color: completedColor }}
            >
              {trl === 0 ? "—" : trl}
            </span>
          </div>
          {trl > 0 && (
            <span className="text-[10px] text-white/35 text-center max-w-[84px] leading-tight">
              {TRL_LABELS[trl]}
            </span>
          )}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          {/* TRL announcement */}
          <div className="mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] mb-2">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4aa35a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="text-[10px] font-bold tracking-[2px] uppercase text-[#4aa35a]">
                {isTL9 ? "Maximum Readiness Reached" : "Assessment Complete"}
              </span>
            </div>
            <p className="font-[\'DM_Serif_Display\',serif] text-[clamp(22px,3vw,32px)] text-white leading-[1.15] tracking-tight">
              {trl === 0
                ? "Your technology is at the starting line."
                : <>Your technology is at <span style={{ color: completedColor }}>TRL {trl}</span>.</>
              }
            </p>
          </div>

          <h2 className="font-[\'DM_Serif_Display\',serif] text-[clamp(14px,1.8vw,18px)] text-white/70 leading-[1.3] tracking-tight mb-2 font-normal italic">
            {msg.headline}
          </h2>

          {technologyName && (
            <p className="text-[12px] font-semibold text-[#4aa35a] mb-2 truncate">
              {technologyName}
            </p>
          )}

          <p className="text-[13px] text-white/55 font-light leading-relaxed max-w-[500px]">
            {msg.sub}
          </p>
        </div>
      </div>

      {/* Wave bottom */}
      <svg className="absolute bottom-[-1px] left-0 w-full pointer-events-none" viewBox="0 0 860 24" preserveAspectRatio="none">
        <path fill="#f5f2ec" d="M0,12 C215,24 645,0 860,12 L860,24 L0,24 Z" />
      </svg>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { data } = useAssessment();
  const router   = useRouter();

  const [result, setResult]           = useState<TRLResult | null>(null);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);

  const { pdfRef, exporting, exportForm, triggerExport } = usePDFExport();

  useEffect(() => {
    const run = async () => {
      const res     = await fetch("/questions.csv");
      const csvText = await res.text();
      const parsed  = Papa.parse<{
        questionText: string; trlLevel: string;
        technologyType: string; category: string;
      }>(csvText, { header: true, skipEmptyLines: true });

      const questions: QuestionItem[] = parsed.data
        .filter(q => q.technologyType === data.technologyType)
        .map((q, i) => ({
          id: `${q.category}-${i}`,
          questionText: q.questionText,
          trlLevel: parseInt(q.trlLevel, 10),
          category: q.category,
        }));

      const calc = calculateTRL(questions, data.answers, data.ipData, data.technologyType);
      setResult(calc);
      setLoading(false);
    };
    run();
  }, [data]);

  if (loading || !result) {
    return (
      <div className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#4aa35a]/30 border-t-[#4aa35a] animate-spin" />
          <p className="text-[14px] text-[#94a3a0] font-light">Calculating your TRL…</p>
        </div>
      </div>
    );
  }

  const completedColor  = TRL_COLORS[result.highestCompletedTRL]  ?? "#94a3b8";
  const achievableColor = TRL_COLORS[result.highestAchievableTRL] ?? "#4aa35a";
  const gap             = result.highestAchievableTRL - result.highestCompletedTRL;
  const lackingForAI    = gap > 0 ? result.lackingForAchievable : result.lackingForNextLevel;

  return (
    <main className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] text-[#1a1a1a] px-6 lg:px-[6vw] py-16">
      <div className="max-w-[860px] mx-auto space-y-6">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
          Assessment Results
        </div>

        {/* Congratulatory hero */}
        <CongratulatoryHero
          trl={result.highestCompletedTRL}
          technologyName={data.technologyName}
          completedColor={completedColor}
        />

        {/* Score cards */}
        <ScoreCards
          completedTRL={result.highestCompletedTRL}
          achievableTRL={result.highestAchievableTRL}
          completedColor={completedColor}
          achievableColor={achievableColor}
        />

        {/* Achievable banner */}
        {gap > 0 && (
          <AchievableBanner
            completedTRL={result.highestCompletedTRL}
            achievableTRL={result.highestAchievableTRL}
            lackingItems={result.lackingForAchievable}
            achievableColor={achievableColor}
          />
        )}

        {/* AI Recommendations — always shown */}
        <AIRecommendationCard
          technologyName={data.technologyName}
          technologyType={data.technologyType}
          technologyDescription={data.technologyDescription ?? ""}
          completedTRL={result.highestCompletedTRL}
          achievableTRL={result.highestAchievableTRL}
          lackingItems={lackingForAI}

        />

        {/* Detailed breakdown */}
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[22px] text-[#0f2e1a] mb-4">
            Detailed <em className="text-[#4aa35a]">Breakdown</em>
          </h2>
          <div className="space-y-3">
            <QuestionGroup
              title="Completed Questions"
              questions={result.completedQuestions}
              accent="#4aa35a"
              defaultOpen={false}
            />
            {result.lackingForAchievable.length > 0 ? (
              <QuestionGroup
                title={`Lacking to Reach Highest Achievable (TRL ${result.highestAchievableTRL})`}
                questions={result.lackingForAchievable}
                accent="#3b82f6"
                defaultOpen={true}
              />
            ) : result.lackingForNextLevel.length > 0 ? (
              <QuestionGroup
                title={`Lacking for Next Level (TRL ${result.highestCompletedTRL + 1})`}
                questions={result.lackingForNextLevel}
                accent="#f97316"
                defaultOpen={true}
              />
            ) : null}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pb-10">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a] transition-all duration-200"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M5 8L2 5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full text-[14px] font-semibold text-white bg-[#4aa35a] shadow-[0_8px_32px_rgba(74,163,90,0.35)] hover:bg-[#3d8f4c] hover:-translate-y-0.5 transition-all duration-300"
          >
            Export as PDF
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1v6M2 5l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>

      </div>

      {/* Export modal */}
      {showModal && (
        <ExportModal
          onClose={() => !exporting && setShowModal(false)}
          onExport={form => triggerExport(form)}
          exporting={exporting}
        />
      )}

      {/* Hidden PDF render target */}
      {exportForm && result && (
        <div style={{ position: "fixed", top: 0, left: "-9999px", zIndex: -1, pointerEvents: "none" }}>
          <div ref={pdfRef}>
            <PDFContent
              result={result}
              techName={data.technologyName}
              techType={data.technologyType}
              techDescription={data.technologyDescription}
              form={exportForm}
            />
          </div>
        </div>
      )}
    </main>
  );
}