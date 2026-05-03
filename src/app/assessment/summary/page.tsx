"use client";

import { useEffect, useState } from "react";
import { useAssessment } from "@/hooks/assessment/useAssessment";
import { categoryOrder } from "../../utils/helperConstants";
import { useRouter } from "next/navigation";
import type { MultiConditionalAnswer } from "../../utils/trlCalculator";
import { getQuestionsJSON, prefetchQuestionsJSON } from "../../utils/questionsCache";
import { ConfirmSubmitModal } from "@/components/summary/modals/confirmSubmitModal";
import { ConfirmChangeModal } from "@/components/summary/modals/confirmChangeModal";

// Types
interface DropdownOption {
  label: string;
  value: string;
  trlSatisfied?: number | null;
  action?: string;
  items?: { text: string; trlLevel: number }[];
}

interface Question {
  id: string;
  questionText: string;
  trlLevel: number;
  category: string;
  type?: "checkbox" | "dropdown" | "multi-conditional";
  options?: DropdownOption[];
}

// Answer Row      

function AnswerRow({
  q,
  answer,
  onChangeRequest,
}: {
  q: Question;
  answer: unknown;
  onChangeRequest: (q: Question, newValue: unknown) => void;
}) {
  const qType = q.type ?? "checkbox";
  const [pendingValue, setPendingValue] = useState<unknown>(null);
  const [showConfirm, setShowConfirm]   = useState(false);

  const requestChange = (newValue: unknown) => {
    setPendingValue(newValue);
    setShowConfirm(true);
  };
  const confirmChange = () => {
    onChangeRequest(q, pendingValue);
    setShowConfirm(false);
    setPendingValue(null);
  };
  const cancelChange = () => {
    setShowConfirm(false);
    setPendingValue(null);
  };

  //     Checkbox   ─
  if (qType === "checkbox") {
    const checked = answer === true;
    return (
      <>
        {showConfirm && <ConfirmChangeModal questionText={q.questionText} onConfirm={confirmChange} onCancel={cancelChange} />}
        <li className="flex items-start gap-3 py-3 group">
          <button
            onClick={() => requestChange(!checked)}
            className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${
              checked ? "bg-[#2d7a3a] border-[#2d7a3a]" : "bg-white border-[#b0a99e] hover:border-[#2d7a3a]/60"
            }`}
          >
            {checked ? (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#b0a99e" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <span className={`flex-1 text-[14px] leading-relaxed ${checked ? "text-[#1a2e1e] font-normal" : "text-[#7a756d]"}`}>
            {q.questionText}
          </span>
          <span className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[#94a3a0] font-light mt-0.5 whitespace-nowrap">
            click to edit
          </span>
        </li>
      </>
    );
  }

  // Dropdown
  if (qType === "dropdown") {
    const raw      = answer as string | null | undefined;
    const selected = raw ? (q.options?.find(o => o.value === raw)?.label ?? raw) : null;

    return (
      <>
        {showConfirm && <ConfirmChangeModal questionText={q.questionText} onConfirm={confirmChange} onCancel={cancelChange} />}
        <li className="py-3.5">
          <div className="flex items-start gap-3 mb-3">
            <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center ${
              selected ? "bg-[#2d7a3a] border-[#2d7a3a]" : "bg-white border-[#b0a99e]"
            }`}>
              {selected ? (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
                  <path d="M1 1h6" stroke="#b0a99e" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[14px] leading-relaxed ${selected ? "text-[#1a2e1e] font-normal" : "text-[#7a756d]"}`}>
                {q.questionText}
              </p>
              {selected ? (
                <span className="inline-flex items-center gap-1.5 mt-1.5 text-[12px] font-semibold text-[#2d7a3a] bg-[#2d7a3a]/[0.08] border border-[#2d7a3a]/25 px-2.5 py-0.5 rounded-full">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <circle cx="4" cy="4" r="3" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M2.5 4l1 1 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {selected}
                </span>
              ) : (
                <span className="inline-block mt-1.5 text-[12px] font-light text-[#94a3a0] italic">No selection made</span>
              )}
            </div>
          </div>

          {/* All options */}
          {q.options && q.options.length > 0 && (
            <div className="ml-8 space-y-1.5">
              <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#6b7a75] mb-2">Available options:</p>
              {q.options.map(opt => {
                const isSelected = raw === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => !isSelected && requestChange(opt.value)}
                    disabled={isSelected}
                    className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px] transition-all ${
                      isSelected
                        ? "bg-[#2d7a3a]/[0.08] border-[#2d7a3a]/30 text-[#1a5c2a] font-semibold cursor-default"
                        : "bg-[#f8f5f0] border-[#e0dbd3] text-[#3d3d3d] hover:border-[#2d7a3a]/40 hover:bg-[#2d7a3a]/[0.04] cursor-pointer"
                    }`}
                  >
                    <span className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-[#2d7a3a] bg-[#2d7a3a]" : "border-[#b0a99e]"
                    }`}>
                      {isSelected && (
                        <svg width="6" height="5" viewBox="0 0 6 5" fill="none">
                          <path d="M0.5 2.5l1.5 1.5 3.5-3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {opt.label}
                    {!isSelected && <span className="ml-auto text-[11px] text-[#94a3a0]">select</span>}
                  </button>
                );
              })}
            </div>
          )}
        </li>
      </>
    );
  }

  // Multi-conditional
  if (qType === "multi-conditional") {
    const mc       = (answer as MultiConditionalAnswer | undefined) ?? { selection: "", checkedItems: [] };
    const selOpt   = q.options?.find(o => o.value === mc.selection);
    const selLabel = selOpt?.label ?? mc.selection;
    const isPositive = mc.selection === "yes" || mc.selection === "exempt";
    const yesOption  = q.options?.find(o => o.value === "yes");

    // Toggle a sub-item without confirm (minor change within already-confirmed selection)
    const toggleItem = (item: string) => {
      const already = mc.checkedItems.includes(item);
      const updated: MultiConditionalAnswer = {
        selection:    mc.selection,
        checkedItems: already
          ? mc.checkedItems.filter(i => i !== item)
          : [...mc.checkedItems, item],
      };
      onChangeRequest(q, updated);
    };

    return (
      <>
        {showConfirm && <ConfirmChangeModal questionText={q.questionText} onConfirm={confirmChange} onCancel={cancelChange} />}
        <li className="py-3.5">
          {/* Question + current selection status */}
          <div className="flex items-start gap-3 mb-3">
            <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center ${
              mc.selection
                ? isPositive ? "bg-[#2d7a3a] border-[#2d7a3a]" : "bg-amber-100 border-amber-400"
                : "bg-white border-[#b0a99e]"
            }`}>
              {mc.selection ? (
                isPositive ? (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )
              ) : (
                <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
                  <path d="M1 1h6" stroke="#b0a99e" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[14px] leading-relaxed ${mc.selection ? "text-[#1a2e1e] font-normal" : "text-[#7a756d]"}`}>
                {q.questionText}
              </p>
              {mc.selection ? (
                <span className={`inline-block mt-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  isPositive
                    ? "text-[#1a5c2a] bg-[#2d7a3a]/[0.08] border-[#2d7a3a]/25"
                    : "text-amber-800 bg-amber-50 border-amber-300"
                }`}>
                  {selLabel}
                </span>
              ) : (
                <span className="inline-block mt-1.5 text-[12px] font-light text-[#94a3a0] italic">Not answered</span>
              )}
            </div>
          </div>

          {/* Top-level options (yes/no/exempt etc.) */}
          {q.options && (
            <div className="ml-8 space-y-1.5 mb-3">
              <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#6b7a75] mb-2">Select an option:</p>
              {q.options.map(opt => {
                const isCurrent = mc.selection === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => !isCurrent && requestChange({ selection: opt.value, checkedItems: [] })}
                    disabled={isCurrent}
                    className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px] transition-all ${
                      isCurrent
                        ? "bg-[#2d7a3a]/[0.08] border-[#2d7a3a]/30 text-[#1a5c2a] font-semibold cursor-default"
                        : "bg-[#f8f5f0] border-[#e0dbd3] text-[#3d3d3d] hover:border-[#2d7a3a]/40 hover:bg-[#2d7a3a]/[0.04] cursor-pointer"
                    }`}
                  >
                    <span className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                      isCurrent ? "border-[#2d7a3a] bg-[#2d7a3a]" : "border-[#b0a99e]"
                    }`}>
                      {isCurrent && (
                        <svg width="6" height="5" viewBox="0 0 6 5" fill="none">
                          <path d="M0.5 2.5l1.5 1.5 3.5-3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {opt.label}
                    {!isCurrent && <span className="ml-auto text-[11px] text-[#94a3a0]">select</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Select-all-that-apply sub-items when "yes" is chosen */}
          {mc.selection === "yes" && yesOption?.items && yesOption.items.length > 0 && (
            <div className="ml-8 mt-1">
              <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#6b7a75] mb-2">Select all that apply:</p>
              <div className="space-y-1.5">
                {yesOption.items.map(item => {
                  const checked = mc.checkedItems.includes(item.text);
                  return (
                    <button
                      key={item.text}
                      onClick={() => toggleItem(item.text)}
                      className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px] transition-all ${
                        checked
                          ? "bg-[#2d7a3a]/[0.07] border-[#2d7a3a]/30 text-[#1a5c2a] font-medium"
                          : "bg-[#f8f5f0] border-[#e0dbd3] text-[#3d3d3d] hover:border-[#2d7a3a]/40 hover:bg-[#2d7a3a]/[0.03] cursor-pointer"
                      }`}
                    >
                      <span className={`flex-shrink-0 w-4 h-4 rounded-[4px] border-2 flex items-center justify-center ${
                        checked ? "bg-[#2d7a3a] border-[#2d7a3a]" : "border-[#b0a99e] bg-white"
                      }`}>
                        {checked && (
                          <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span>{item.text}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#94a3a0] mt-2 font-light">
                {mc.checkedItems.length} of {yesOption.items.length} selected — changes apply immediately
              </p>
            </div>
          )}
        </li>
      </>
    );
  }

  return null;
}

// IP Summary      
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
  const selectedTypes = Object.entries(entry.selectedTypes ?? {}).filter(([, v]) => v).map(([k]) => k);

  const initiatedLabel =
    initiated === "yes"          ? "Yes — IP Protection Initiated" :
    initiated === "no"           ? "No — Not Yet Initiated" :
    initiated === "trade_secret" ? "Protected as Trade Secret" :
                                   "Not answered";
  const isPositive = initiated === "yes" || initiated === "trade_secret";

  return (
    <div className="bg-white border border-[#d8d3cc] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,46,26,0.06)]">
      <div className="flex items-center gap-2.5 px-7 py-4 border-b border-[#e8e4db] bg-[#f5f2ec]">
        <span className="w-2 h-2 rounded-full bg-[#2d7a3a] flex-shrink-0" />
        <span className="text-[12px] font-bold tracking-[2px] uppercase text-[#2d7a3a]">
          Intellectual Property Protection Status
        </span>
      </div>
      <ul className="px-7 py-3 divide-y divide-[#ede9e0]">
        <li className="flex items-start gap-3 py-3">
          <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center ${
            isPositive ? "bg-[#2d7a3a] border-[#2d7a3a]" : "bg-amber-100 border-amber-400"
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
            <p className="text-[14px] text-[#1a2e1e] leading-relaxed">Intellectual Property (IP) Initiated</p>
            <span className={`inline-block mt-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-full border ${
              isPositive
                ? "text-[#1a5c2a] bg-[#2d7a3a]/[0.08] border-[#2d7a3a]/25"
                : "text-amber-800 bg-amber-50 border-amber-300"
            }`}>
              {initiatedLabel}
            </span>
            {selectedTypes.length > 0 && (
              <ul className="mt-2.5 space-y-1.5 pl-0.5">
                {selectedTypes.map(type => {
                  const status = entry.typeStatuses?.[type];
                  const isDone = status === "Filed" || status === "Registered";
                  return (
                    <li key={type} className="flex items-center gap-2.5">
                      <div className={`flex-shrink-0 w-4 h-4 rounded-[4px] border-2 flex items-center justify-center ${
                        isDone ? "bg-[#2d7a3a] border-[#2d7a3a]" : "bg-white border-[#b0a99e]"
                      }`}>
                        {isDone && (
                          <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[13px] text-[#3d3d3d]">{type}</span>
                      {status && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isDone ? "bg-[#2d7a3a]/10 text-[#1a5c2a]" : "bg-[#f5f2ec] text-[#6b7a75]"
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

// Technology types

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

// Main Page

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

  useEffect(() => {
    router.prefetch("/assessment/results");
    prefetchQuestionsJSON();
  }, [router]);

  const handleAnswerChange = (q: Question, newValue: unknown) => {
    updateData({ answers: { ...data.answers, [q.id]: newValue as any } });
  };

  const handleConfirmedSubmit = () => {
    setShowConfirm(false);
    router.push("/assessment/results");
  };

  if (loading) {
    return (
      <div className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#2d7a3a]/30 border-t-[#2d7a3a] animate-spin" />
          <p className="text-[15px] text-[#6b7a75]">Loading summary…</p>
        </div>
      </div>
    );
  }

  // Group by category
  const grouped: Record<string, Question[]> = {};
  questions.forEach(q => {
    if (!grouped[q.category]) grouped[q.category] = [];
    grouped[q.category].push(q);
  });

  const displayCategories = categoryOrder.filter(c => c !== "Intellectual Property Protection Status");

  return (
    <main className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] text-[#1a2e1e] px-6 lg:px-[6vw] py-16">
      <div className="max-w-[900px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[3px] uppercase text-[#2d7a3a] mb-4 px-3.5 py-1.5 border border-[#2d7a3a]/30 rounded-full bg-[#2d7a3a]/[0.07]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d7a3a]" />
            Final Step — Review & Submit
          </div>
          <h1 className="font-['DM_Serif_Display',serif] text-[clamp(28px,4vw,42px)] text-[#0f2e1a] leading-tight tracking-tight mb-3">
            Review your <em className="text-[#2d7a3a]">responses</em>
          </h1>
          <p className="text-[15px] text-[#4a5568] leading-relaxed max-w-xl">
            Review your answers carefully. You can change any answer by clicking it or selecting a different option. Changes to selection questions require confirmation.
          </p>
        </div>

        {/* Amber notice */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl px-5 py-4 mb-8">
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5 text-amber-600">
            <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-[14px] text-amber-900 leading-relaxed">
            Submitting will calculate your TRACER Level score. Changing a selection will ask for confirmation first. Sub-items under <strong>"select all that apply"</strong> can be toggled freely.
          </p>
        </div>

        {/* Technology Details */}
        <div className="bg-white border border-[#d8d3cc] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.07)] mb-6">
          <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#e8e4db] bg-[#f5f2ec]">
            <span className="w-2 h-2 rounded-full bg-[#2d7a3a] flex-shrink-0" />
            <span className="text-[12px] font-bold tracking-[2px] uppercase text-[#2d7a3a]">Technology Details</span>
          </div>
          <div className="px-7 py-6 space-y-5">
            <div>
              <label className="block text-[12px] font-bold tracking-[1.5px] uppercase text-[#6b7a75] mb-2">Technology Name</label>
              <input
                type="text"
                value={data.technologyName}
                onChange={e => updateData({ technologyName: e.target.value })}
                className="w-full bg-[#f8f5f0] border border-[#d0ccc4] rounded-xl px-4 py-3 text-[15px] text-[#1a2e1e] focus:outline-none focus:ring-2 focus:ring-[#2d7a3a]/30 focus:border-[#2d7a3a] transition-all"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold tracking-[1.5px] uppercase text-[#6b7a75] mb-2">Technology Type</label>
              <div className="relative">
                <select
                  value={data.technologyType}
                  onChange={e => updateData({ technologyType: e.target.value })}
                  className="w-full appearance-none bg-[#f8f5f0] border border-[#d0ccc4] rounded-xl px-4 py-3 text-[15px] text-[#1a2e1e] focus:outline-none focus:ring-2 focus:ring-[#2d7a3a]/30 focus:border-[#2d7a3a] transition-all cursor-pointer pr-10"
                >
                  <option value="">Select Technology Type</option>
                  {TECHNOLOGY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7a75]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-bold tracking-[1.5px] uppercase text-[#6b7a75] mb-2">Funding Source</label>
              <div className="relative">
                <select
                  value={data.fundingSource}
                  onChange={e => updateData({ fundingSource: e.target.value })}
                  className="w-full appearance-none bg-[#f8f5f0] border border-[#d0ccc4] rounded-xl px-4 py-3 text-[15px] text-[#1a2e1e] focus:outline-none focus:ring-2 focus:ring-[#2d7a3a]/30 focus:border-[#2d7a3a] transition-all cursor-pointer pr-10"
                >
                  <option value="">Select Funding Source</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Not Funded Yet">Not Funded Yet</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7a75]">
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
              <div key={category} className="bg-white border border-[#d8d3cc] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,46,26,0.05)]">
                <div className="flex items-center justify-between gap-3 px-7 py-4 border-b border-[#e8e4db] bg-[#f5f2ec]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#2d7a3a] flex-shrink-0" />
                    <span className="text-[12px] font-bold tracking-[2px] uppercase text-[#2d7a3a]">{category}</span>
                  </div>
                  <span className="text-[12px] text-[#6b7a75] flex-shrink-0">
                    {answeredCount} / {qs.length} answered
                  </span>
                </div>
                <ul className="px-7 py-1 divide-y divide-[#ede9e0]">
                  {qs.map(q => (
                    <AnswerRow
                      key={q.id}
                      q={q}
                      answer={data.answers[q.id]}
                      onChangeRequest={handleAnswerChange}
                    />
                  ))}
                </ul>
              </div>
            );
          })}

          <IPSummary ipData={data.ipData ?? {}} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-medium text-[#4a5568] bg-white border border-[#d0ccc4] hover:border-[#0f2e1a]/40 hover:text-[#0f2e1a] transition-all duration-200"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M5 8L2 5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[15px] font-semibold text-white bg-[#2d7a3a] shadow-[0_8px_32px_rgba(45,122,58,0.35)] hover:bg-[#245f2e] hover:-translate-y-0.5 transition-all duration-300"
          >
            Submit Assessment
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
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