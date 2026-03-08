"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";
import { calculateTRL, QuestionItem, TRLResult } from "../../utils/trlCalculator";
import { usePDFExport, PDFContent, ExportFormData, TRL_LABELS, TRL_COLORS } from "./UsePDFExport";

// Sub-components 

function TRLStepBar({ completed, achievable }: { completed: number; achievable: number }) {
  return (
    <div className="flex gap-1.5 items-end">
      {Array.from({ length: 9 }, (_, i) => {
        const level = i + 1;
        const isCompleted = level <= completed;
        const isAchievable = !isCompleted && level <= achievable;
        const bg = isCompleted
          ? (TRL_COLORS[completed] ?? "#4aa35a")
          : isAchievable
          ? "#bbf7d0"
          : "#e5e1d8";
        const height = 10 + level * 5;
        return (
          <div key={level} className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className="w-full rounded-sm transition-all duration-700"
              style={{
                height,
                backgroundColor: bg,
                border: isAchievable ? "1.5px solid #4aa35a55" : "none",
              }}
            />
            <span className="text-[9px] font-bold text-[#94a3a0]">{level}</span>
          </div>
        );
      })}
    </div>
  );
}

function QuestionGroup({
  title,
  questions,
  accent,
  defaultOpen = false,
}: {
  title: string;
  questions: QuestionItem[];
  accent: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const byLevel: Record<number, QuestionItem[]> = {};
  questions.forEach(q => {
    if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
    byLevel[q.trlLevel].push(q);
  });
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className="bg-white border border-[#ede9e0] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,46,26,0.04)]">

      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-7 py-5 border-b border-[#f5f2ec] bg-[#f8f6f1] hover:bg-[#f3efe8] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
          <span className="text-[11px] font-bold tracking-[2px] uppercase" style={{ color: accent }}>{title}</span>
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
                <span className="text-[12px] text-[#94a3a0] font-light">{TRL_LABELS[level]}</span>
              </div>
              <ul className="space-y-2.5">
                {byLevel[level].map(q => (
                  <li key={q.id} className="flex items-start gap-3 text-[13px] text-[#4a5568] font-light leading-relaxed">
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

function AchievableBanner({
  completedTRL,
  achievableTRL,
  lackingItems,
  achievableColor,
}: {
  completedTRL: number;
  achievableTRL: number;
  lackingItems: QuestionItem[];
  achievableColor: string;
}) {
  const [open, setOpen] = useState(false);

  const byLevel: Record<number, QuestionItem[]> = {};
  lackingItems.forEach(q => {
    if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
    byLevel[q.trlLevel].push(q);
  });
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className="bg-white border-2 border-[#4aa35a]/20 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)]">

      <div className="px-7 py-6 bg-[#4aa35a]/[0.04]">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-[#4aa35a]/10 flex items-center justify-center text-[20px] flex-shrink-0">
            🚀
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a] mb-1">
              Potential Identified
            </p>
            <p className="text-[15px] font-semibold text-[#0f2e1a] leading-snug">
              Currently at{" "}
              <span className="font-black" style={{ color: TRL_COLORS[completedTRL] ?? "#64748b" }}>
                TRL {completedTRL}
              </span>
              {completedTRL > 0 && <span className="font-normal text-[#6b7a75]"> ({TRL_LABELS[completedTRL]})</span>}
              {" "}— with demonstrated progress toward{" "}
              <span className="font-black" style={{ color: achievableColor }}>
                TRL {achievableTRL}
              </span>{" "}
              <span className="font-normal text-[#6b7a75]">({TRL_LABELS[achievableTRL]})</span>.
            </p>
            <p className="text-[13px] text-[#8a9a94] font-light mt-1.5">
              Complete the{" "}
              <strong className="text-[#4a5568] font-semibold">
                {lackingItems.length} item{lackingItems.length !== 1 ? "s" : ""}
              </strong>{" "}
              below to fully reach your highest achievable level.
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(o => !o)}
          className="mt-5 w-full flex items-center justify-between text-[13px] font-semibold px-4 py-3 rounded-xl bg-[#4aa35a]/10 text-[#4aa35a] hover:bg-[#4aa35a]/15 transition-colors"
        >
          <span>{open ? "Hide" : "Show"} what you need to complete</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`transition-transform ${open ? "rotate-180" : ""}`}>
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
                <span className="text-[12px] text-[#94a3a0] font-light">{TRL_LABELS[level]}</span>
                <span className="text-[11px] text-[#c8c3b8] ml-auto">
                  {byLevel[level].length} item{byLevel[level].length !== 1 ? "s" : ""}
                </span>
              </div>
              <ul className="space-y-2.5">
                {byLevel[level].map(q => (
                  <li key={q.id} className="flex items-start gap-3 text-[13px] text-[#4a5568] font-light leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#4aa35a] flex-shrink-0" />
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

// ─── Export Modal ─────────────────────────────────────────────────────────────

function ExportModal({
  onClose,
  onExport,
  exporting,
}: {
  onClose: () => void;
  onExport: (form: ExportFormData) => void;
  exporting: boolean;
}) {
  const [form, setForm] = useState<ExportFormData>({ name: "", email: "", role: "", organization: "" });
  const [errors, setErrors] = useState<Partial<ExportFormData>>({});

  const validate = () => {
    const e: Partial<ExportFormData> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onExport(form);
  };

  const inputClass = (key: keyof ExportFormData) =>
    `w-full appearance-none bg-[#f8f6f1] border rounded-xl px-4 py-3 text-[14px] text-[#1a1a1a] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all ${
      errors[key] ? "border-red-300 bg-red-50" : "border-[#e5e1d8]"
    }`;

  const Field = ({
    id, label, placeholder, required = false, type = "text",
  }: { id: keyof ExportFormData; label: string; placeholder: string; required?: boolean; type?: string }) => (
    <div>
      <label className="block text-[11px] font-bold tracking-[1.5px] uppercase text-[#94a3a0] mb-2">
        {label}{" "}
        {required
          ? <span className="text-red-400">*</span>
          : <span className="text-[#c8c3b8] normal-case tracking-normal font-normal">(optional)</span>}
      </label>
      <input
        type={type}
        value={form[id]}
        onChange={e => {
          setForm(f => ({ ...f, [id]: e.target.value }));
          if (required) setErrors(er => ({ ...er, [id]: "" }));
        }}
        placeholder={placeholder}
        className={inputClass(id)}
      />
      {errors[id] && <p className="text-[12px] text-red-400 mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0a1f10]/60 backdrop-blur-sm" onClick={() => !exporting && onClose()} />

      <div className="relative font-['DM_Sans',sans-serif] bg-white rounded-3xl shadow-2xl w-full max-w-[440px] z-10 overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[#f8f6f1]">
          <span className="w-2 h-2 rounded-full bg-[#4aa35a] flex-shrink-0" />
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">Export Results</span>
          <button
            onClick={() => !exporting && onClose()}
            className="ml-auto w-7 h-7 rounded-full bg-[#ede9e0] hover:bg-[#e0dbd3] flex items-center justify-center text-[#6b7a75] transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-7 py-7">
          <h2 className="font-['DM_Serif_Display',serif] text-[22px] text-[#0f2e1a] mb-1">Export as PDF</h2>
          <p className="text-[13px] text-[#8a9a94] font-light mb-7">Your details will be included in the report header.</p>

          <div className="space-y-4 mb-7">
            <Field id="name" label="Full Name" placeholder="e.g. Juan dela Cruz" required />
            <Field id="email" label="Email Address" placeholder="e.g. juan@example.com" required type="email" />
            <Field id="role" label="Role / Position" placeholder="e.g. Researcher, Project Lead" />
            <Field id="organization" label="Organization" placeholder="e.g. DOST, State University" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => !exporting && onClose()}
              className="flex-1 px-4 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={exporting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[14px] font-semibold text-white bg-[#4aa35a] shadow-[0_6px_24px_rgba(74,163,90,0.35)] hover:bg-[#3d8f4c] disabled:opacity-60 disabled:shadow-none transition-all"
            >
              {exporting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  Download PDF
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Results Page ────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { data } = useAssessment();
  const router = useRouter();
  const [result, setResult] = useState<TRLResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { pdfRef, exporting, exportForm, triggerExport } = usePDFExport();

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/questions.csv");
      const csvText = await res.text();
      const parsed = Papa.parse<{ questionText: string; trlLevel: string; technologyType: string; category: string }>(
        csvText, { header: true, skipEmptyLines: true }
      );
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

  const completedColor = TRL_COLORS[result.highestCompletedTRL] ?? "#94a3b8";
  const achievableColor = TRL_COLORS[result.highestAchievableTRL] ?? "#4aa35a";
  const gap = result.highestAchievableTRL - result.highestCompletedTRL;

  return (
    <main className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] text-[#1a1a1a] px-6 lg:px-[6vw] py-16">
      <div className="max-w-[860px] mx-auto space-y-6">

        {/* ── Page header ── */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] mb-4 px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
            Assessment Results
          </div>
          <h1 className="font-['DM_Serif_Display',serif] text-[clamp(28px,4vw,48px)] text-[#0f2e1a] leading-tight tracking-tight mb-2">
            Technology Readiness<br />
            <em style={{ color: completedColor }}>Level Report</em>
          </h1>
          <p className="text-[13px] text-[#8a9a94] font-light">{data.technologyType}</p>
          {data.technologyName && (
            <p className="text-[14px] font-semibold text-[#4a5568] mt-0.5">{data.technologyName}</p>
          )}
        </div>

        {/* ── Step bar card ── */}
        <div className="bg-white border border-[#ede9e0] rounded-2xl p-6 shadow-[0_4px_24px_rgba(15,46,26,0.06)]">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#4aa35a]" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">Progress Overview</span>
          </div>
          <TRLStepBar completed={result.highestCompletedTRL} achievable={result.highestAchievableTRL} />
          <div className="flex gap-5 mt-4">
            <span className="flex items-center gap-1.5 text-[11px] text-[#94a3a0]">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: completedColor }} />
              Completed
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#94a3a0]">
              <span className="w-3 h-3 rounded-sm border border-[#4aa35a]/30 bg-[#bbf7d0] inline-block" />
              Achievable
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#94a3a0]">
              <span className="w-3 h-3 rounded-sm bg-[#e5e1d8] inline-block" />
              Not reached
            </span>
          </div>
        </div>

        {/* ── Score cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { level: result.highestCompletedTRL, label: "Highest Completed TRL", color: completedColor },
            { level: result.highestAchievableTRL, label: "Highest Achievable TRL", color: achievableColor },
          ].map(({ level, label, color }) => (
            <div key={label} className="bg-white border border-[#ede9e0] rounded-2xl p-6 shadow-[0_4px_24px_rgba(15,46,26,0.06)] flex flex-col items-center text-center gap-2">
              <div className="text-[64px] font-black leading-none" style={{ color }}>
                {level === 0 ? "—" : level}
              </div>
              <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#94a3a0]">{label}</div>
              {level > 0 && <div className="text-[13px] text-[#6b7a75] font-light">{TRL_LABELS[level]}</div>}
              <div className="w-full h-1.5 bg-[#e5e1d8] rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(level / 9) * 100}%`, backgroundColor: color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Achievable banner ── */}
        {gap > 0 && (
          <AchievableBanner
            completedTRL={result.highestCompletedTRL}
            achievableTRL={result.highestAchievableTRL}
            lackingItems={result.lackingForAchievable}
            achievableColor={achievableColor}
          />
        )}

        {gap === 0 && result.highestCompletedTRL === 9 && (
          <div className="bg-[#4aa35a]/[0.06] border border-[#4aa35a]/20 rounded-2xl px-6 py-4">
            <p className="text-[14px] text-[#0f2e1a] font-semibold">
              🎉 Congratulations! Your technology has reached full commercialization (TRL 9).
            </p>
          </div>
        )}

        {/* ── Detailed breakdown ── */}
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
            ) : (
              <QuestionGroup
                title={`Lacking for Next Level (TRL ${result.highestCompletedTRL + 1})`}
                questions={result.lackingForNextLevel}
                accent="#f97316"
                defaultOpen={true}
              />
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-wrap items-center gap-3 pb-10">
          <button
            onClick={() => router.push("/assessment/questionnaire")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a] transition-all duration-200"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M5 8L2 5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Assessment
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

      {/* Export Modal */}
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