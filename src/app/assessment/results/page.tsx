"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";
import { calculateTRL, QuestionItem, TRLResult } from "../../utils/trlCalculator";
import { IP_CATEGORY } from "../../utils/ipHelpers";
import { usePDFExport, PDFContent, generateAndDownloadPDF, generatePDFAsBase64 } from "./exportPDF/UsePDFExport";
import { getTracerInfo, TracerLevelInfo } from "../../utils/tracerDescriptions";
import { getTracerLabel } from "./Levelsdescription";
import {
  fetchRecommendation,
  AIResult,
  AIHeader,
  RecommendationInput,
  TRL_COLORS,
  TRL_LABELS,
} from "./FetchRecommendation";
import { getCongratulatoryMessage } from "../../utils/congratulatoryMessages";

import { getQuestionsJSON } from "../../utils/questionsCache";
import ScoreCards           from "./ScoreCards";
import QuestionGroup        from "./QuestionGroup";
import AIRecommendationCard from "./RecommendationCard";
import ExportModal, { AssessmentMeta } from "./exportPDF/exportModal";
import CategoryAnalysis     from "./CategoryAnalysis";

// Skeleton shimmer

function PageLoader() {

  const steps = [
    "Calculating your TRACER Level score\u2026",
    "Analysing your assessment answers\u2026",
    "Generating your personalised roadmap\u2026",
    "Preparing your commercialization steps\u2026",
    "Almost ready\u2026",
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => Math.min(i + 1, steps.length - 1)), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 max-w-xs text-center">

        {/* Spinner */}
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

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-500"
              style={{ backgroundColor: i <= idx ? "#4aa35a" : "#d1d5db" }} />
          ))}
        </div>

        <p className="text-[13px] text-[#6b7a75] font-light transition-all duration-500">
          {steps[idx]}
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

// Main page

export default function ResultsPage() {
  const { data, clearData, hydrated } = useAssessment();
  const router   = useRouter();

  type ScoreData = { result: TRLResult; aiInput: RecommendationInput; officialInfo: ReturnType<typeof getTracerInfo> };
  const [scoreData,  setScoreData]  = useState<ScoreData | null>(null);
  const [aiResult,   setAiResult]   = useState<AIResult | null>(null);
  const [aiError,    setAiError]    = useState<string | undefined>();
  const [showModal,  setShowModal]  = useState(false);
  const { exporting, setExporting, exportForm, triggerExport, clearForm } = usePDFExport();

  useEffect(() => {
    
    // Wait for sessionStorage hydration before calculating.
    // hydrated=false means the context is still on DEFAULT_DATA - ipData would be empty
    // causing all IP questions to appear as unanswered on refresh 
    if (!hydrated || !data.technologyType) return;

    const run = async () => {
      const allGrouped = await getQuestionsJSON() as Record<string, Record<string, QuestionItem[]>>;
      const questions  = Object.values(allGrouped[data.technologyType] ?? {}).flat() as QuestionItem[];
      const result     = calculateTRL(questions, data.answers, data.ipData, data.technologyType);

      const aiInput: RecommendationInput = {
        technologyName:        data.technologyName,
        technologyType:        data.technologyType,
        technologyDescription: data.technologyDescription ?? "",
        completedTRL:          result.highestCompletedTRL,
        achievableTRL:         result.highestAchievableTRL,
        lackingItems:          result.lackingToLevel9.filter(q => q.category !== IP_CATEGORY)
          .map(q => ({
            trlLevel:     q.trlLevel,
            questionText: q.questionText,
          })),
      };
      const officialInfo = getTracerInfo(data.technologyType, result.highestCompletedTRL);

      let aiRes: AIResult;
      try {
        aiRes = await fetchRecommendation(aiInput, officialInfo);
      } catch (err) {
        aiRes = {
          header: {
            headline:    officialInfo?.title ?? "",
            explanation: officialInfo?.description ?? "",
          },
          steps: { roadmap: [], closing: "" },
        };
        setAiError(err instanceof Error ? err.message : "Unknown error");
      }

      setScoreData({ result, aiInput, officialInfo });
      setAiResult(aiRes);
    };

    run();
  }, [data, hydrated]);

  if (!scoreData || !aiResult) return <PageLoader />;

  const { result, aiInput, officialInfo } = scoreData;

  const completedColor  = TRL_COLORS[result.highestCompletedTRL]  ?? "#94a3b8";
  const achievableColor = TRL_COLORS[result.highestAchievableTRL] ?? "#4aa35a";
  const gap             = result.highestAchievableTRL - result.highestCompletedTRL;

  return (
    <main className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] text-[#1a1a1a] px-6 lg:px-[6vw] py-16">
      <div className="max-w-[950px] mx-auto space-y-6">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
          Assessment Results
        </div>

        {/* Hero */}
        <CongratulatoryHero
          trl={result.highestCompletedTRL}
          technologyName={data.technologyName}
          technologyType={data.technologyType}
          completedColor={completedColor}
          header={aiResult?.header ?? null}
          tracerLabel={getTracerLabel(data.technologyType, result.highestCompletedTRL)}
          congratulatoryMessage={getCongratulatoryMessage(data.technologyType, result.highestCompletedTRL)}
        />

        {/* ScoreCards */}
        <ScoreCards
          completedTRL={result.highestCompletedTRL}
          achievableTRL={result.highestAchievableTRL}
          completedColor={completedColor}
          achievableColor={achievableColor}
          lackingCount={result.lackingForAchievable.length}
          pendingCount={result.highestCompletedTRL === 9 ? result.lackingForAchievable.length : 0}
          techType={data.technologyType}
        />

        {/* Category analysis */}
        <CategoryAnalysis
          completedQuestions={result.completedQuestions}
          lackingToLevel9={result.lackingToLevel9}
          completedTRL={result.highestCompletedTRL}
        />

        {/* AI roadmap */}
        <AIRecommendationCard
          {...aiInput}
          initialSteps={aiResult?.steps ?? null}
          initialError={aiError}
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
              techType={data.technologyType}
            />
            {result.lackingForAchievable.length > 0 ? (
              <QuestionGroup
                title={`Lacking to Reach Highest Potential TRACER Level ${result.highestAchievableTRL}`}
                questions={result.lackingForAchievable}
                accent="#3b82f6"
                defaultOpen={false}
                techType={data.technologyType}
              />
            ) : result.lackingForNextLevel.length > 0 ? (
              <QuestionGroup
                title={`Lacking for Next Level (TRACER Level ${result.highestCompletedTRL + 1})`}
                questions={result.lackingForNextLevel}
                accent="#f97316"
                defaultOpen={false}
                techType={data.technologyType}
              />
            ) : null}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pb-5">
          <button
            onClick={() => { clearData(); router.push("/assessment/name"); }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a] transition-all duration-200"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M5 8L2 5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Start New Assessment
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

        {/* Feedback banner */}
        <div className="rounded-2xl border border-[#4aa35a]/20 bg-white px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#4aa35a]/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#4aa35a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#0f2e1a] mb-0.5">
              Help us improve AANR-TRACER
            </p>
            <p className="text-[12px] text-[#6b7a75] leading-relaxed">
              Share your experience and suggestions — your feedback helps us make this tool better for everyone in the AANR sector.
            </p>
          </div>
          <a
            href="https://forms.gle/7kTGomz9ZSMuh5pE6"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                        text-[13px] font-semibold text-white bg-[#0f2e1a]
                        hover:bg-[#1a3d26] hover:-translate-y-0.5 transition-all duration-200 shadow-sm whitespace-nowrap"
          >
            Give Feedback
          </a>
        </div>

      </div>

      {/* Export modal */}
      {showModal && (
        <ExportModal
          onClose={() => !exporting && setShowModal(false)}
          exporting={exporting}
          meta={{
            technologyName: data.technologyName,
            technologyType: data.technologyType,
            trlLevel:       result.highestCompletedTRL,
            trlDescription: getTracerLabel(data.technologyType, result.highestCompletedTRL) ?? TRL_LABELS[result.highestCompletedTRL] ?? "",
          }}
          onExport={async (form: { name: any; email: any; organization: any; role: any; }, mode: string, recipientEmail: any) => {
            setExporting(true);
            try {
              const pdfProps = {
                result,
                techName:        data.technologyName,
                techType:        data.technologyType,
                techDescription: data.technologyDescription,
                form,
                roadmap: aiResult?.steps?.roadmap ?? [],
                closing: aiResult?.steps?.closing ?? "",
              };

              const needsDownload = mode === "download" || mode === "both";
              const needsEmail    = mode === "email"    || mode === "both";

              // Generate PDF — once, shared between download and email
              const pdfBase64 = needsEmail ? await generatePDFAsBase64(pdfProps) : null;

              if (needsDownload) {
                await generateAndDownloadPDF(pdfProps);
              }

              if (needsEmail && pdfBase64) {
                const trlDescription = getTracerLabel(data.technologyType, result.highestCompletedTRL)
                  ?? TRL_LABELS[result.highestCompletedTRL]
                  ?? "";
                await fetch("/api/send-report", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    recipientEmail,
                    submittedByName:  form.name,
                    submittedByEmail: form.email,
                    submittedByOrg:   form.organization,
                    submittedByRole:  form.role,
                    technologyName:   data.technologyName,
                    technologyType:   data.technologyType,
                    trlLevel:         result.highestCompletedTRL,
                    trlDescription,
                    assessmentDate:   new Date().toLocaleDateString(),
                    pdfBase64,
                  }),
                });
              }
            } finally {
              setExporting(false);
              clearForm();
            }
          }}
        />
      )}

      {/* PDF generated via @react-pdf/renderer */}

    </main>
  );
}