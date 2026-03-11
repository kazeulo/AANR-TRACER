"use client";

import { useEffect, useState } from "react";
import { useAssessment } from "../AssessmentContext";
import { categoryOrder } from "../../utils/helperConstants";
import { useRouter } from "next/navigation";
import type { MultiConditionalAnswer } from "../../utils/trlCalculator";
import { getQuestionsJSON, prefetchQuestionsJSON } from "../../utils/questionsCache";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DropdownOption {
  label: string;
  value: string;
  trlSatisfied?: number | null;
  action?: string;
  items?: string[];
}

interface Question {
  id: string;
  questionText: string;
  trlLevel: number;
  category: string;
  type?: "checkbox" | "dropdown" | "multi-conditional";
  options?: DropdownOption[];
}

// ─── Confirmation Modal ───────────────────────────────────────────────────────

function ConfirmSubmitModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0a1f10]/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative font-[var(--font-body)] bg-[var(--color-bg-card)] rounded-3xl shadow-2xl w-full max-w-[400px] z-10 overflow-hidden">
        <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[var(--color-bg-subtle)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-accent)]">
            Confirm Submission
          </span>
          <button
            onClick={onCancel}
            className="ml-auto w-7 h-7 rounded-full bg-[#ede9e0] hover:bg-[#e0dbd3] flex items-center justify-center text-[#6b7a75] transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-7 py-7">
          <h2 className="font-[var(--font-heading)] text-[22px] text-[var(--color-primary)] mb-2">
            Ready to submit?
          </h2>
          <p className="text-[13px] text-[var(--color-text-faint)] font-light mb-7 leading-relaxed">
            Your TRACER Level score will be calculated from your answers. Make sure everything looks right before proceeding.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-[var(--color-bg-card)] border border-[var(--color-border-input)] hover:border-[#0f2e1a]/30 hover:text-[var(--color-primary)] transition-all"
            >
              Not yet
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[14px] font-semibold text-white bg-[var(--color-accent)] shadow-[0_6px_24px_rgba(74,163,90,0.35)] hover:bg-[var(--color-accent-hover)] transition-all"
            >
              Yes, submit
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Answer Row ───────────────────────────────────────────────────────────────

function AnswerRow({ q, answer }: { q: Question; answer: unknown }) {
  const qType = q.type ?? "checkbox";

  // ── Checkbox ──────────────────────────────────────────────────────────────
  if (qType === "checkbox") {
    const checked = answer === true;
    return (
      <li className="flex items-start gap-3 py-2.5">
        <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center ${
          checked ? "bg-[var(--color-accent)] border-[#4aa35a]" : "bg-[var(--color-bg-card)] border-[#e0dbd3]"
        }`}>
          {checked ? (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#c8c3b8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <span className={`text-[13px] leading-relaxed ${checked ? "text-[var(--color-text)] font-light" : "text-[#b0a99e] font-light"}`}>
          {q.questionText}
        </span>
      </li>
    );
  }

  // ── Dropdown ──────────────────────────────────────────────────────────────
  if (qType === "dropdown") {
    const raw = answer as string | null | undefined;
    const selected = raw ? (q.options?.find(o => o.value === raw)?.label ?? raw) : null;
    return (
      <li className="flex items-start gap-3 py-2.5">
        <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center ${
          selected ? "bg-[var(--color-accent)] border-[#4aa35a]" : "bg-[var(--color-bg-card)] border-[#e0dbd3]"
        }`}>
          {selected ? (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
              <path d="M1 1h6" stroke="#c8c3b8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] leading-relaxed ${selected ? "text-[var(--color-text)]" : "text-[#b0a99e]"} font-light`}>
            {q.questionText}
          </p>
          {selected ? (
            <span className="inline-flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/[0.08] border border-[#4aa35a]/20 px-2.5 py-0.5 rounded-full">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="3" stroke="currentColor" strokeWidth="1.2" />
                <path d="M2.5 4l1 1 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {selected}
            </span>
          ) : (
            <span className="inline-block mt-1.5 text-[11px] font-light text-[#b0a99e] italic">No selection made</span>
          )}
        </div>
      </li>
    );
  }

  // ── Multi-conditional ─────────────────────────────────────────────────────
  if (qType === "multi-conditional") {
    const mc = answer as MultiConditionalAnswer | undefined;
    if (!mc?.selection) {
      return (
        <li className="flex items-start gap-3 py-2.5">
          <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 border-[#e0dbd3] bg-[var(--color-bg-card)] flex items-center justify-center">
            <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
              <path d="M1 1h6" stroke="#c8c3b8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[13px] text-[#b0a99e] font-light leading-relaxed">{q.questionText}</p>
            <span className="inline-block mt-1.5 text-[11px] font-light text-[#b0a99e] italic">Not answered</span>
          </div>
        </li>
      );
    }

    const selOpt = q.options?.find(o => o.value === mc.selection);
    const selLabel = selOpt?.label ?? mc.selection;
    const isPositive = mc.selection === "yes" || mc.selection === "exempt";

    return (
      <li className="flex items-start gap-3 py-2.5">
        <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center ${
          isPositive ? "bg-[var(--color-accent)] border-[#4aa35a]" : "bg-amber-100 border-amber-300"
        }`}>
          {isPositive ? (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-[var(--color-text)] font-light leading-relaxed">{q.questionText}</p>
          <span className={`inline-block mt-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
            isPositive
              ? "text-[var(--color-accent)] bg-[var(--color-accent)]/[0.08] border-[#4aa35a]/20"
              : "text-amber-700 bg-amber-50 border-amber-200"
          }`}>
            {selLabel}
          </span>
          {mc.checkedItems.length > 0 && (
            <ul className="mt-2 space-y-1 pl-0.5">
              {mc.checkedItems.map(item => (
                <li key={item} className="flex items-start gap-2 text-[12px] text-[#6b7a75] font-light">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="flex-shrink-0 mt-[3px]">
                    <path d="M1 4l3 3 5-6" stroke="#4aa35a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </li>
    );
  }

  return null;
}

// ─── IP Summary ───────────────────────────────────────────────────────────────

function IPSummary({ ipData }: {
  ipData: Record<string, {
    initiated: string;
    selectedTypes: Record<string, boolean>;
    typeStatuses: Record<string, string>;
  }>
}) {
  const entry = ipData?.["Intellectual Property (IP) Initiated"];
  if (!entry) return null;

  const initiated = entry.initiated;
  const selectedTypes = Object.entries(entry.selectedTypes ?? {})
    .filter(([, v]) => v)
    .map(([k]) => k);

  const initiatedLabel =
    initiated === "yes"          ? "Yes — IP Protection Initiated" :
    initiated === "no"           ? "No — Not Yet Initiated" :
    initiated === "trade_secret" ? "Protected as Trade Secret" :
                                   "Not answered";

  const isPositive = initiated === "yes" || initiated === "trade_secret";

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,46,26,0.04)]">
      <div className="flex items-center gap-2.5 px-7 py-4 border-b border-[#f5f2ec] bg-[var(--color-bg-subtle)]">
        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
        <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-accent)]">
          Intellectual Property Protection Status
        </span>
      </div>

      <ul className="px-7 py-3 divide-y divide-[#f5f2ec]">
        {/* Initiated row */}
        <li className="flex items-start gap-3 py-2.5">
          <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center ${
            isPositive ? "bg-[var(--color-accent)] border-[#4aa35a]" : "bg-amber-100 border-amber-300"
          }`}>
            {isPositive ? (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-light text-[var(--color-text)] leading-relaxed">
              Intellectual Property (IP) Initiated
            </p>
            <span className={`inline-block mt-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
              isPositive
                ? "text-[var(--color-accent)] bg-[var(--color-accent)]/[0.08] border-[#4aa35a]/20"
                : "text-amber-700 bg-amber-50 border-amber-200"
            }`}>
              {initiatedLabel}
            </span>

            {/* IP types */}
            {selectedTypes.length > 0 && (
              <ul className="mt-2.5 space-y-1.5 pl-0.5">
                {selectedTypes.map(type => {
                  const status = entry.typeStatuses?.[type];
                  const isDone = status === "Filed" || status === "Registered";
                  return (
                    <li key={type} className="flex items-center gap-2.5">
                      <div className={`flex-shrink-0 w-4 h-4 rounded-[4px] border flex items-center justify-center ${
                        isDone ? "bg-[var(--color-accent)] border-[#4aa35a]" : "bg-[var(--color-bg-card)] border-[#d0d7d4]"
                      }`}>
                        {isDone && (
                          <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[12px] text-[var(--color-text-gray)] font-light">{type}</span>
                      {status && (
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          isDone
                            ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                            : "bg-[var(--color-bg)] text-[var(--color-text-faintest)]"
                        }`}>
                          {status}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TECHNOLOGY_TYPES = [
  "Food, Food Ingredients and Beverages",
  "Animal Feed, Feed Ingredients and Animal Nutrition",
  "Fertilizer and Pesticide (including Organic and Bio-based Products)",
  "Agri-Aqua Machinery and Facility",
  "Agri-Aqua Device and Diagnostic Kits",
  "ICT (Apps and System involving IoT)",
  "Natural Resource\u2013Derived Materials",
  "New Plant Variety (Conventional)",
  "New Plant Variety (Gene-Edited and GM)",
  "New Animal Breed or Genetic Resources (Aquatic and Terrestrial)",
];

export default function SummaryPage() {
  const { data, updateData } = useAssessment();
  const [questions, setQuestions]     = useState<Question[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const grouped = await getQuestionsJSON() as Record<string, Record<string, Question[]>>;
      const byLevel = grouped[data.technologyType] ?? {};
      setQuestions(Object.values(byLevel).flat());
      setLoading(false);
    };
    load();
  }, [data.technologyType]);

  // Prefetch the results page bundle and questions.json as soon as
  // the summary is shown — so clicking Submit feels near-instant.
  useEffect(() => {
    router.prefetch("/assessment/results");
    prefetchQuestionsJSON(); // warm shared module cache
  }, [router]);

  const handleConfirmedSubmit = () => {
    setShowConfirm(false);
    router.push("/assessment/results");
  };

  if (loading) {
    return (
      <div className="font-[var(--font-body)] min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#4aa35a]/30 border-t-[#4aa35a] animate-spin" />
          <p className="text-[14px] text-[var(--color-text-faintest)] font-light">Loading summary…</p>
        </div>
      </div>
    );
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const checkboxQs  = questions.filter(q => (q.type ?? "checkbox") === "checkbox");
  const dropdownQs  = questions.filter(q => q.type === "dropdown");
  const mcQs        = questions.filter(q => q.type === "multi-conditional");
  const ipEntry     = data.ipData?.["Intellectual Property (IP) Initiated"];

  const cbAnswered  = checkboxQs.filter(q => data.answers[q.id] === true).length;
  const ddAnswered  = dropdownQs.filter(q => !!data.answers[q.id]).length;
  const mcAnswered  = mcQs.filter(q => !!(data.answers[q.id] as MultiConditionalAnswer)?.selection).length;
  const ipAnswered  = ipEntry?.initiated ? 1 : 0;

  // ── Group by category ──────────────────────────────────────────────────────
  const grouped: Record<string, Question[]> = {};
  questions.forEach(q => {
    if (!grouped[q.category]) grouped[q.category] = [];
    grouped[q.category].push(q);
  });

  const displayCategories = categoryOrder.filter(c => c !== "Intellectual Property Protection Status");

  return (
    <main className="font-[var(--font-body)] min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-6 lg:px-[6vw] py-16">
      <div className="max-w-[860px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[var(--color-accent)]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            Final Step — Review & Submit
          </div>
          <h1 className="font-[var(--font-heading)] text-[clamp(28px,4vw,42px)] text-[var(--color-primary)] leading-tight tracking-tight mb-3">
            Review your <em className="text-[var(--color-accent)]">responses</em>
          </h1>
          <p className="text-[14px] text-[var(--color-text-faint)] font-light leading-relaxed max-w-xl">
            Please carefully review your answers before submitting.
          </p>
        </div>

        {/* Stats bar */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Checked",    value: `${cbAnswered} / ${checkboxQs.length}` },
            { label: "Dropdowns",  value: `${ddAnswered} / ${dropdownQs.length}` },
            { label: "Documents",  value: `${mcAnswered} / ${mcQs.length}` },
            { label: "IP Status",  value: ipAnswered ? "Answered" : "Not answered",
              highlight: !ipAnswered },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`bg-[var(--color-bg-card)] border rounded-xl px-4 py-3 text-center shadow-[0_2px_8px_rgba(15,46,26,0.04)] ${
              highlight ? "border-amber-200" : "border-[var(--color-border)]"
            }`}>
              <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-[var(--color-text-faintest)] mb-1">{label}</p>
              <p className={`text-[15px] font-semibold ${highlight ? "text-amber-600" : "text-[var(--color-primary)]"}`}>{value}</p>
            </div>
          ))}
        </div> */}

        {/* Amber notice */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5 text-amber-500">
            <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-[13px] text-amber-800 font-light leading-relaxed">
            Submitting will calculate your TRACER Level score. Make sure all answers reflect your technology's current state.
          </p>
        </div>

        {/* Technology Details */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)] mb-6">
          <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[var(--color-bg-subtle)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-accent)]">Technology Details</span>
          </div>
          <div className="px-7 py-6 space-y-5">
            <div>
              <label className="block text-[11px] font-bold tracking-[1.5px] uppercase text-[var(--color-text-faintest)] mb-2">
                Technology Name
              </label>
              <input
                type="text"
                value={data.technologyName}
                onChange={e => updateData({ technologyName: e.target.value })}
                className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-3 text-[14px] text-[var(--color-text)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[1.5px] uppercase text-[var(--color-text-faintest)] mb-2">
                Technology Type
              </label>
              <div className="relative">
                <select
                  value={data.technologyType}
                  onChange={e => updateData({ technologyType: e.target.value })}
                  className="w-full appearance-none bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-3 text-[14px] text-[var(--color-text)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
                >
                  <option value="">Select Technology Type</option>
                  {TECHNOLOGY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faintest)]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[1.5px] uppercase text-[var(--color-text-faintest)] mb-2">
                Funding Source
              </label>
              <div className="relative">
                <select
                  value={data.fundingSource}
                  onChange={e => updateData({ fundingSource: e.target.value })}
                  className="w-full appearance-none bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-3 text-[14px] text-[var(--color-text)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
                >
                  <option value="">Select Funding Source</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Not Funded Yet">Not Funded Yet</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faintest)]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers by category */}
        <div className="space-y-4 mb-10">
          {displayCategories.map(category => {
            const qs = grouped[category];
            if (!qs || qs.length === 0) return null;

            const answeredCount = qs.filter(q => {
              const a = data.answers[q.id];
              const t = q.type ?? "checkbox";
              if (t === "checkbox")          return a === true;
              if (t === "dropdown")          return !!a;
              if (t === "multi-conditional") return !!(a as MultiConditionalAnswer)?.selection;
              return false;
            }).length;

            return (
              <div key={category} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,46,26,0.04)]">
                <div className="flex items-center justify-between gap-3 px-7 py-4 border-b border-[#f5f2ec] bg-[var(--color-bg-subtle)]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                    <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-accent)]">{category}</span>
                  </div>
                  <span className="text-[11px] text-[var(--color-text-faintest)] font-light flex-shrink-0">
                    {answeredCount} / {qs.length} answered
                  </span>
                </div>
                <ul className="px-7 py-1 divide-y divide-[#f5f2ec]">
                  {qs.map(q => (
                    <AnswerRow key={q.id} q={q} answer={data.answers[q.id]} />
                  ))}
                </ul>
              </div>
            );
          })}

          {/* IP — always last */}
          <IPSummary ipData={data.ipData ?? {}} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-[var(--color-bg-card)] border border-[var(--color-border-input)] hover:border-[#0f2e1a]/30 hover:text-[var(--color-primary)] transition-all duration-200"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M5 8L2 5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[15px] font-semibold text-white bg-[var(--color-accent)] shadow-[0_8px_32px_rgba(74,163,90,0.35)] hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(74,163,90,0.45)] transition-all duration-300"
          >
            Submit Assessment
            <span className="w-5 h-5 rounded-full bg-[var(--color-bg-card)]/20 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>

      </div>

      {showConfirm && (
        <ConfirmSubmitModal
          onConfirm={handleConfirmedSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </main>
  );
}