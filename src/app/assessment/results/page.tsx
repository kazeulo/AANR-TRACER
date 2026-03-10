"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";
import { calculateTRL, QuestionItem, TRLResult } from "../../utils/trlCalculator";
import { usePDFExport, PDFContent } from "./UsePDFExport";
import { getTracerInfo, TracerLevelInfo } from "../../utils/TRACERdescriptions";
import { getTracerLabel } from "./Levelsdescription";
import {
  fetchHeader,
  fetchSteps,
  AIHeader,
  AISteps,
  RecommendationInput,
  TRL_COLORS,
  TRL_LABELS,
} from "./FetchRecommendation";

import ScoreCards           from "./ScoreCards";
import QuestionGroup        from "./QuestionGroup";
import AIRecommendationCard from "./RecommendationCard";
import ExportModal          from "./ExportModal";

// Full-page loading screen

function PageLoader() {
  const messages = [
    "Calculating your TRACER Level score…",
    "Analysing your assessment answers…",
    "Generating your personalised results…",
    "Preparing your action steps…",
    "Almost ready…",
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => Math.min(i + 1, messages.length - 1)), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 max-w-xs text-center">

        {/* Spinner ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#4aa35a]/15" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#4aa35a] animate-spin" />
          <div className="absolute inset-[6px] rounded-full bg-[#4aa35a]/[0.06] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4aa35a"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
            </svg>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex gap-1.5">
          {messages.map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-500"
              style={{ backgroundColor: i <= idx ? "#4aa35a" : "#d1d5db" }}
            />
          ))}
        </div>

        <p className="text-[13px] text-[#6b7a75] font-light transition-all duration-500">
          {messages[idx]}
        </p>
      </div>
    </div>
  );
}

// Hero 

function CongratulatoryHero({
  trl,
  technologyName,
  technologyType,
  completedColor,
  header,
  tracerLabel,
}: {
  trl: number;
  technologyName: string;
  technologyType: string;
  completedColor: string;
  header: AIHeader;
  tracerLabel: string;
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
            <span className="text-[9px] font-bold tracking-[2px] uppercase text-white/40 leading-none mb-0.5">TRL</span>
            <span
              className="font-['DM_Serif_Display',serif] text-[46px] leading-none"
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
                    Your technology is at{" "}
                    <span style={{ color: completedColor }}>TRACER Level {trl}</span>
                    {tracerLabel && (
                      <span className="text-white/60 font-normal">: {tracerLabel}</span>
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
          {header?.headline && (
            <h2 className="font-['DM_Serif_Display',serif] text-[clamp(14px,1.8vw,18px)] text-white/80 leading-[1.3] tracking-tight font-normal italic mb-2">
              {header.headline}
            </h2>
          )}

          {/* AI explanation */}
          {header?.explanation && (
            <p className="text-[13px] text-white/50 font-light leading-relaxed max-w-[600px]">
              {header.explanation}
            </p>
          )}
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

// Main page 

export default function ResultsPage() {
  const { data } = useAssessment();
  const router   = useRouter();

  // Everything loads together before page shows
  type PageData = {
    result: TRLResult;
    header: AIHeader;
    steps:  AISteps;
    stepsError?: string;
  };

  const [pageData,   setPageData]   = useState<PageData | null>(null);
  const [showModal,  setShowModal]  = useState(false);

  const { pdfRef, exporting, exportForm, triggerExport } = usePDFExport();

  useEffect(() => {
    const run = async () => {
      // 1. Parse CSV + calculate TRL
      const res     = await fetch("/questions.csv");
      const csvText = await res.text();
      const parsed  = Papa.parse<{
        questionText: string;
        trlLevel: string;
        technologyType: string;
        category: string;
      }>(csvText, { header: true, skipEmptyLines: true });

      const questions: QuestionItem[] = parsed.data
        .filter(q => q.technologyType === data.technologyType)
        .map((q, i) => ({
          id:           `${q.category}-${i}`,
          questionText: q.questionText,
          trlLevel:     parseInt(q.trlLevel, 10),
          category:     q.category,
        }));

      const result = calculateTRL(questions, data.answers, data.ipData, data.technologyType);

      const gap          = result.highestAchievableTRL - result.highestCompletedTRL;
      const lackingForAI = gap > 0 ? result.lackingForAchievable : result.lackingForNextLevel;

      const aiInput: RecommendationInput = {
        technologyName:        data.technologyName,
        technologyType:        data.technologyType,
        technologyDescription: data.technologyDescription ?? "",
        completedTRL:          result.highestCompletedTRL,
        achievableTRL:         result.highestAchievableTRL,
        lackingItems:          lackingForAI.map(q => ({
          trlLevel:     q.trlLevel,
          questionText: q.questionText,
        })),
      };

      // 2. Look up official description to ground the AI header
      const officialInfo = getTracerInfo(data.technologyType, result.highestCompletedTRL);

      // 3. Fire header + steps in parallel
      const [headerResult, stepsResult] = await Promise.allSettled([
        fetchHeader(aiInput, officialInfo),
        fetchSteps(aiInput),
      ]);

      const header: AIHeader =
        headerResult.status === "fulfilled"
          ? headerResult.value
          : { headline: officialInfo?.title ?? "", explanation: officialInfo?.description ?? "" };

      const steps: AISteps | null =
        stepsResult.status === "fulfilled" ? stepsResult.value : null;

      const stepsError =
        stepsResult.status === "rejected"
          ? (stepsResult.reason instanceof Error ? stepsResult.reason.message : "Unknown error")
          : undefined;

      setPageData({ result, header, steps: steps ?? { roadmap: [], closing: "" }, stepsError });
    };

    run();
  }, [data]);

  // Show full-page loader until everything is ready
  if (!pageData) return <PageLoader />;

  const { result, header, steps, stepsError } = pageData;

  const completedColor  = TRL_COLORS[result.highestCompletedTRL]  ?? "#94a3b8";
  const achievableColor = TRL_COLORS[result.highestAchievableTRL] ?? "#4aa35a";
  const gap             = result.highestAchievableTRL - result.highestCompletedTRL;
  const lackingForAI    = gap > 0 ? result.lackingForAchievable : result.lackingForNextLevel;

  const aiInput: RecommendationInput = {
    technologyName:        data.technologyName,
    technologyType:        data.technologyType,
    technologyDescription: data.technologyDescription ?? "",
    completedTRL:          result.highestCompletedTRL,
    achievableTRL:         result.highestAchievableTRL,
    lackingItems:          lackingForAI.map(q => ({
      trlLevel:     q.trlLevel,
      questionText: q.questionText,
    })),
  };

  return (
    <main className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] text-[#1a1a1a] px-6 lg:px-[6vw] py-16">
      <div className="max-w-[860px] mx-auto space-y-6">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
          Assessment Results
        </div>

        {/* Hero — AI header already resolved */}
        <CongratulatoryHero
          trl={result.highestCompletedTRL}
          technologyName={data.technologyName}
          technologyType={data.technologyType}
          completedColor={completedColor}
          header={header}
          tracerLabel={getTracerLabel(data.technologyType, result.highestCompletedTRL)}
        />

        {/* ScoreCards + achievable gap combined */}
        <ScoreCards
          completedTRL={result.highestCompletedTRL}
          achievableTRL={result.highestAchievableTRL}
          completedColor={completedColor}
          achievableColor={achievableColor}
          lackingCount={result.lackingForAchievable.length}
        />

        {/* AI action steps — pre-fetched, passed as prop */}
        <AIRecommendationCard
          {...aiInput}
          initialSteps={steps}
          initialError={stepsError}
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
                title={`Lacking to Reach Highest Achievable (TRACER Level ${result.highestAchievableTRL})`}
                questions={result.lackingForAchievable}
                accent="#3b82f6"
                defaultOpen={true}
              />
            ) : result.lackingForNextLevel.length > 0 ? (
              <QuestionGroup
                title={`Lacking for Next Level (TRACER Level ${result.highestCompletedTRL + 1})`}
                questions={result.lackingForNextLevel}
                accent="#f97316"
                defaultOpen={true}
              />
            ) : null}
          </div>
        </div>

        {/* Action buttons */}
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