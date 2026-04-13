"use client";

import { useEffect, useMemo, useState } from "react";
import { useAssessment, IPData, AnswerValue } from "../AssessmentContext";
import type { MultiConditionalAnswer } from "../../utils/trlCalculator";
import { categoryOrder, categoryDescriptions } from "../../utils/helperConstants";
import { useRouter } from "next/navigation";
import {
  PLANT_ANIMAL_TYPES,
  PLANT_VARIETY_TYPES,
  IP_INITIATED_LABEL,
  IP_CATEGORY,
} from "../../utils/ipHelpers";
import { getQuestionsJSON } from "../../utils/questionsCache";

// components

import { IPSection } from './components/ip/ipSection';
import { ABHContactPanel } from "./components/contacts/ABHContactPanel";
import { ATBIContactPanel } from "./components/contacts/ATBIContactPanel";

const questionsCache: Record<string, Record<string, Question[]>> = {};

export interface IPSectionProps {
  label: string;
  ipData: IPData;
  onChange: (updated: IPData) => void;
  technologyType: string;
}

interface DropdownOption {
  label: string;
  value: string;
  trlSatisfied?: number | null;
  contactLabel?: string;
  action?: string;
  items?: { text: string; trlLevel: number }[];
}

interface Question {
  id: string;
  questionText: string;
  trlLevel: number;
  technologyType: string;
  category: string;
  toolTip?: string;
  expandedToolTip?: string;
  type?: "checkbox" | "dropdown" | "multi-conditional";
  options?: DropdownOption[];
}

// Tool tips

function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="ml-2 w-4 h-4 rounded-full border border-[var(--color-border-input)] text-[10px] flex items-center justify-center text-[var(--color-text-faintest)] hover:bg-[var(--color-bg-subtle)] transition"
      >
        ?
      </button>

      {open && (
        <div className="absolute left-0 top-6 z-50 w-[240px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 text-[12px] text-[var(--color-text-gray)] shadow-lg">
          {text}
        </div>
      )}
    </span>
  );
}

// Dropdown Question 

function DropdownQuestion({
  q, 
  value, 
  onChange, 
  technologyType, 
  expanded, 
  toggleTip,
  setOpenModal
}: {
  q: Question;
  value: string | null;
  onChange: (val: string) => void;
  technologyType: string;
  expanded?: boolean;
  toggleTip?: () => void;
  setOpenModal: (val: boolean) => void;
}) {
  const selected = q.options?.find(o => o.value === value);
  const showContact = selected?.contactLabel;

  return (
    <div className="bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] rounded-2xl overflow-visible transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-[14px] text-[var(--color-text-gray)] font-light leading-relaxed">
            {q.questionText}
          </p>

          {q.toolTip && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTip?.();
                
              }}
              className="flex-shrink-0 w-5 h-5 rounded-full border border-[var(--color-border-input)] text-[12px] flex items-center justify-center text-[var(--color-text-gray)] hover:bg-[var(--color-bg-subtle)] transition"
            >
              +
            </button>
          )}
          
        </div>

        {q.toolTip && expanded && (
          <div className="mb-4 text-[13px] text-[var(--color-text-light-gray)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-lg p-3 leading-relaxed transition-all duration-300">
            <p>{q.toolTip}</p> 

            <button 
              onClick={() => setOpenModal(true)} 
              className="inline-flex items-center gap-1 mt-2 text-[12px] text-[#4aa35a] hover:underline underline-offset-2 font-medium"
            >
                Learn more
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {setOpenModal && (
              <div
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                onClick={(e) => e.target === e.currentTarget && setOpenModal(false)}
              >
                <div className="bg-white border border-[#ede9e0] rounded-2xl w-full max-w-[480px] overflow-hidden shadow-[0_20px_60px_rgba(15,46,26,0.15)]">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4 border-b border-[#f0ede6]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#4aa35a]/[0.08] border border-[#4aa35a]/25 flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4aa35a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#4aa35a] mb-0.5">Definition</p>
                        <p className="text-[15px] font-semibold text-[#0f2e1a] leading-snug">{q.questionText}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setOpenModal(false)}
                      className="w-7 h-7 rounded-lg bg-[#f5f2ec] border border-[#ede9e0] flex items-center justify-center text-[#94a3a0] hover:text-[#0f2e1a] transition-colors flex-shrink-0"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-5">
                    <p className="text-[14px] text-[#2d3748] leading-[1.75] mb-4">{q.expandedToolTip}</p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setOpenModal(false)}
                        className="px-5 py-2 rounded-full bg-[#4aa35a] text-white text-[13px] font-semibold hover:bg-[#3d8f4c] transition-colors"
                      >
                        Got it
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <select
            value={value ?? ""}
            onChange={e => onChange(e.target.value)}
            className="w-full appearance-none bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-3 text-[14px] text-[var(--color-text)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
          >
            <option value="">Select an option…</option>
            {q.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faintest)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {showContact && <ATBIContactPanel technologyType={technologyType} />}
      </div>
    </div>
  );
}

// Multi-Conditional Question 

function MultiConditionalQuestion({
  q, value, onSelectionChange, onItemToggle, expanded, toggleTip
}: {
  q: Question;
  value: MultiConditionalAnswer;
  expanded?: boolean;
  toggleTip?: () => void;
  onSelectionChange: (sel: string) => void;
  onItemToggle: (item: string) => void;
}) {
  const yesOption = q.options?.find(o => o.action === "checklist");
  const noOption  = q.options?.find(o => o.action === "contacts");

  return (
    <div className="bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] rounded-2xl overflow-visible transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-[14px] text-[var(--color-text-gray)] font-light leading-relaxed">
            {q.questionText}
          </p>

          {q.toolTip && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTip?.();
              }}
              className="flex-shrink-0 w-5 h-5 rounded-full border border-[var(--color-border-input)] text-[12px] flex items-center justify-center text-[var(--color-text-faintest)] hover:bg-[var(--color-bg-subtle)] transition"
            >
              +
            </button>
          )}
        </div>

        {q.toolTip && expanded && (
          <div className="mb-4 text-[13px] text-[var(--color-text-light-gray)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-lg p-3 leading-relaxed transition-all duration-300">
            {q.toolTip} 
            
            <a  href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-[12px] text-[#4aa35a] hover:underline underline-offset-2 font-medium"
            >
              Learn more
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        )}

        <div className="relative mb-4">
          <select
            value={value.selection}
            onChange={e => onSelectionChange(e.target.value)}
            className="w-full appearance-none bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-3 text-[14px] text-[var(--color-text)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
          >
            <option value="">Select an option…</option>
            {q.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faintest)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {value.selection === "no" && noOption?.contactLabel && <ABHContactPanel />}
        {value.selection === "yes" && yesOption?.items && (
          <div className="space-y-2.5 mt-1">
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-text-faintest)] mb-2">
              Select all that apply
            </p>
            {yesOption.items.map(item => {
              const checked = value.checkedItems.includes(item.text);
              return (
                <label key={item.text} className={`flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border transition-all duration-200 ${
                  checked ? "bg-[var(--color-accent)]/[0.05] border-[#4aa35a]/40" : "bg-[var(--color-bg-subtle)] border-[var(--color-border-input)] hover:border-[#4aa35a]/30"
                }`}>
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input type="checkbox" checked={checked} onChange={() => onItemToggle(item.text)} className="peer sr-only" />
                    <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 ${
                      checked ? "bg-[var(--color-accent)] border-[#4aa35a]" : "bg-[var(--color-bg-card)] border-[#c8c3b8]"
                    }`}>
                      {checked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={`text-[13px] leading-relaxed ${checked ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-text-gray)] font-light"}`}>
                    {item.text}
                  </span>
                </label>
              );
            })}
          </div>
        )}
        {value.selection === "exempt" && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-[13px] text-blue-800 font-light leading-relaxed">
            This requirement is exempted for privately funded technologies.
          </div>
        )}
      </div>
    </div>
  );
}

// Main Page

export default function QuestionnairePage() {
  const { data, updateData, lastCategoryIndex, setLastCategoryIndex, lastPage, setLastPage } = useAssessment();
  const router = useRouter();

  const [grouped, setGrouped] = useState<Record<string, Question[]>>({});
  const [orderedCategories, setOrderedCategories] = useState<string[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const questionsPerPage = 5;
  const isPlantAnimal = PLANT_ANIMAL_TYPES.includes(data.technologyType ?? "");
  
  // for tool tips
  const [expandedTips, setExpandedTips] = useState<Record<string, boolean>>({});
  const [openModal, setOpenModal] = useState(false);  // learn more modal

  const toggleTip = (id: string) => {
    setExpandedTips(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    if (lastCategoryIndex >= 0 && lastPage >= 0 && orderedCategories.length > 0) {
      setCurrentCategoryIndex(Math.min(lastCategoryIndex, orderedCategories.length - 1));
      setCurrentPage(lastPage);
    }
  }, [lastCategoryIndex, lastPage, orderedCategories.length]);

  useEffect(() => {
    if (!data.technologyType) return;

    if (questionsCache[data.technologyType]) {
      const groupedData = questionsCache[data.technologyType];
      const ordered = categoryOrder.filter(
        cat => cat === IP_CATEGORY || (groupedData[cat] && groupedData[cat].length > 0)
      );
      setGrouped(groupedData);
      setOrderedCategories(ordered);
      setCurrentCategoryIndex(Math.min(lastCategoryIndex, ordered.length - 1));
      setCurrentPage(lastPage);
      setLoading(false);
      return;
    }

    setLoading(true);
    const loadQuestions = async () => {
      const allGrouped = await getQuestionsJSON() as Record<string, Record<string, Question[]>>;
      const byLevel = allGrouped[data.technologyType] ?? {};
      const flat: Question[] = Object.values(byLevel).flat();

      const seen = new Set<string>();
      const uniqueFlat = flat.filter(q => {
        if (seen.has(q.id)) return false;
        seen.add(q.id);
        return true;
      });

      const groupedData: Record<string, Question[]> = {};
      uniqueFlat.forEach(q => {
        if (!groupedData[q.category]) groupedData[q.category] = [];
        groupedData[q.category].push(q);
      });

      questionsCache[data.technologyType] = groupedData;

      const ordered = categoryOrder.filter(
        cat => cat === IP_CATEGORY || (groupedData[cat] && groupedData[cat].length > 0)
      );

      setGrouped(groupedData);
      setOrderedCategories(ordered);
      setCurrentCategoryIndex(Math.min(lastCategoryIndex, ordered.length - 1));
      setCurrentPage(lastPage);
      setLoading(false);
    };

    loadQuestions();
  }, [data.technologyType]);

  const currentCategory = orderedCategories[currentCategoryIndex] ?? "";
  const isIPCategory = currentCategory === IP_CATEGORY;
  const currentQuestions = grouped[currentCategory] ?? [];

  function buildPageGroups(questions: Question[]): Question[][] {
    const before: Question[] = [];
    const precomList: Question[] = [];
    const after: Question[] = [];
    let seenPrecom = false;

    for (const q of questions) {
      if (q.id.startsWith("precom_docs") || q.id.startsWith("packaging")) {
        seenPrecom = true;
        precomList.push(q);
      } else if (seenPrecom) {
        after.push(q);
      } else {
        before.push(q);
      }
    }

    if (precomList.length === 0) {
      const groups: Question[][] = [];
      let b: Question[] = [];
      for (const q of questions) {
        b.push(q);
        if (b.length >= questionsPerPage) { groups.push(b); b = []; }
      }
      if (b.length > 0) groups.push(b);
      return groups;
    }

    const groups: Question[][] = [];
    let b: Question[] = [];
    for (const q of before) {
      b.push(q);
      if (b.length >= questionsPerPage) { groups.push(b); b = []; }
    }
    const slotsLeft = b.length > 0 ? questionsPerPage - b.length : 0;
    const beforeBatch = [...b];
    b = [];

    for (const q of precomList) groups.push([q]);

    const afterWithBackfill = [...after];
    const backfillItems = afterWithBackfill.splice(0, Math.min(slotsLeft, afterWithBackfill.length));

    if (beforeBatch.length > 0 || backfillItems.length > 0) {
      groups.splice(groups.length - precomList.length, 0, [...beforeBatch, ...backfillItems]);
    }

    for (const q of afterWithBackfill) {
      b.push(q);
      if (b.length >= questionsPerPage) { groups.push(b); b = []; }
    }
    if (b.length > 0) groups.push(b);
    return groups;
  }

  const pageGroups: Question[][] = useMemo(() => {
    if (isIPCategory) return [];
    return buildPageGroups(currentQuestions);
  }, [currentQuestions, isIPCategory]);

  const totalPages = isIPCategory ? 1 : pageGroups.length;

  const visibleQuestions = useMemo(() => {
    if (isIPCategory) return [];
    return pageGroups[currentPage] ?? [];
  }, [currentPage, pageGroups, isIPCategory]);

  const handleCheckbox = (id: string) => {
    updateData({ answers: { ...data.answers, [id]: !data.answers[id] } });
  };

  const handleDropdown = (id: string, value: string) => {
    updateData({ answers: { ...data.answers, [id]: value || null } });
  };

  const handleMultiConditional = (id: string, update: Partial<MultiConditionalAnswer>) => {
    const prev = (data.answers[id] as MultiConditionalAnswer) ?? { selection: "", checkedItems: [] };
    updateData({ answers: { ...data.answers, [id]: { ...prev, ...update } } });
  };

  const handleIPChange = (updated: IPData) => {
    updateData({ ipData: updated });
  };

  const handleNext = () => {
    if (!isIPCategory && currentPage < totalPages - 1) {
      setCurrentPage(p => p + 1);
      setLastCategoryIndex(currentCategoryIndex);
      setLastPage(currentPage + 1);
    } else if (currentCategoryIndex < orderedCategories.length - 1) {
      setCurrentCategoryIndex(c => c + 1);
      setCurrentPage(0);
      setLastCategoryIndex(currentCategoryIndex + 1);
      setLastPage(0);
    } else {
      router.push("/assessment/summary");
    }
  };

  const handlePrev = () => {
    if (!isIPCategory && currentPage > 0) {
      setCurrentPage(p => p - 1);
    } else if (currentCategoryIndex > 0) {
      const prevIndex = currentCategoryIndex - 1;
      const prevCat = orderedCategories[prevIndex];
      const prevQuestions = grouped[prevCat] ?? [];
      const prevPageGroups: Question[][] =
        prevCat === IP_CATEGORY ? [] : buildPageGroups(prevQuestions);
      const lastPageOfPrev = prevCat === IP_CATEGORY ? 0 : Math.max(0, prevPageGroups.length - 1);
      setCurrentCategoryIndex(prevIndex);
      setCurrentPage(lastPageOfPrev);
    }
  };

  const isLastStep =
    currentCategoryIndex === orderedCategories.length - 1 &&
    (isIPCategory || currentPage === totalPages - 1);

  const isPrevDisabled = currentCategoryIndex === 0 && currentPage === 0;

  // ipBlocksNext
  const ipBlocksNext = (() => {
    if (!isIPCategory) return false;
    const ipKey = IP_INITIATED_LABEL;
    const current = data.ipData[ipKey] ?? { initiated: "", selectedTypes: {}, typeStatuses: {}, dusPvpStatus: "" };

    if (current.initiated === "") return true;
    if (current.initiated === "no" || current.initiated === "trade_secret") return false;

    if (PLANT_VARIETY_TYPES.includes(data.technologyType)) {
      return !current.dusPvpStatus;
    }

    const checkedTypes = Object.entries(current.selectedTypes ?? {})
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (checkedTypes.length === 0) return true;
    return checkedTypes.some(t => !current.typeStatuses[t]);
  })();

  const dropdownBlocksNext = (() => {
    if (isIPCategory) return false;
    return visibleQuestions.some(q => {
      if (q.type === "dropdown") return !data.answers[q.id];
      if (q.type === "multi-conditional") {
        const val = data.answers[q.id] as { selection?: string } | undefined;
        return !val?.selection;
      }
      return false;
    });
  })();

  const blocksNext = ipBlocksNext || dropdownBlocksNext;

  // Progress
  const totalSteps = orderedCategories.reduce((acc, cat) => {
    if (cat === IP_CATEGORY) return acc + 1;
    return acc + buildPageGroups(grouped[cat] ?? []).length;
  }, 0);

  const stepsCompleted = orderedCategories.slice(0, currentCategoryIndex).reduce((acc, cat) => {
    if (cat === IP_CATEGORY) return acc + 1;
    return acc + buildPageGroups(grouped[cat] ?? []).length;
  }, 0) + currentPage;

  const progressPct = totalSteps > 0 ? Math.round((stepsCompleted / totalSteps) * 100) : 0;

  if (loading) {
    return (
      <div className="font-['DM Sans'] min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#4aa35a]/30 border-t-[#4aa35a] animate-spin" />
          <p className="text-[14px] text-[var(--color-text-faintest)] font-light">Loading assessment…</p>
        </div>
      </div>
    );
  }

  if (orderedCategories.length === 0) {
    return (
      <div className="font-['DM Sans'] min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[15px] text-[var(--color-text-gray)] font-light">No questions available for the selected technology type.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="font-['DM Sans'] min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">

      {/* Sticky progress bar */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] px-6 lg:px-[6vw] py-3 shadow-sm">
        <div className="max-w-[860px] mx-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[var(--color-accent)] uppercase tracking-[1.5px] truncate mr-4">
              {currentCategory}
            </span>
            <span className="text-[11px] text-[var(--color-text-faintest)] font-light flex-shrink-0">
              Category {currentCategoryIndex + 1} of {orderedCategories.length}
              {!isIPCategory && ` · Page ${currentPage + 1} of ${totalPages}`}
            </span>
          </div>
          <div className="h-1 bg-[#e5e1d8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1000px] mx-auto px-6 lg:px-[6vw] pt-[110px] pb-24">

        {/* Category header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[var(--color-accent)]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            Assessment · Category {currentCategoryIndex + 1}
          </div>
          <h1 className=" text-[clamp(24px,3.5vw,36px)] text-[var(--color-primary)] leading-tight tracking-tight mb-3">
            {currentCategory}
          </h1>
          {categoryDescriptions[currentCategory] && (
            <p className="text-[14px] text-[var(--color-text-faint)] font-light leading-relaxed max-w-2xl">
              {categoryDescriptions[currentCategory]}
            </p>
          )}
        </div>

        {/* Questions */}
        <div style={{ minHeight: 420 }}>
          {isIPCategory ? (
            <div className="space-y-6">
              <IPSection
                label={IP_INITIATED_LABEL}
                ipData={data.ipData}
                onChange={handleIPChange}
                technologyType={data.technologyType}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {visibleQuestions.map(q => {
                const qType = q.type ?? "checkbox";

                if (qType === "dropdown") {
                  return (
                    <DropdownQuestion
                      key={q.id}
                      q={q}
                      value={(data.answers[q.id] as string | null) ?? null}
                      onChange={val => handleDropdown(q.id, val)}
                      technologyType={data.technologyType}
                      expanded={!!expandedTips[q.id]}
                      toggleTip={() => toggleTip(q.id)}
                      setOpenModal={setOpenModal}
                    />
                  );
                }

                if (qType === "multi-conditional") {
                  const mcVal = (data.answers[q.id] as MultiConditionalAnswer) ?? { selection: "", checkedItems: [] };
                  return (
                    <MultiConditionalQuestion
                      key={q.id}
                      q={q}
                      value={mcVal}
                      expanded={!!expandedTips[q.id]}
                      toggleTip={() => toggleTip(q.id)}
                      onSelectionChange={sel =>
                        handleMultiConditional(q.id, {
                          selection: sel,
                          checkedItems: sel !== "yes" ? [] : mcVal.checkedItems,
                        })
                      }
                      onItemToggle={item => {
                        const already = mcVal.checkedItems.includes(item);
                        handleMultiConditional(q.id, {
                          checkedItems: already
                            ? mcVal.checkedItems.filter(i => i !== item)
                            : [...mcVal.checkedItems, item],
                        });
                      }}
                    />
                  );
                }

                const checked = data.answers[q.id] === true;
                return (
                  <label
                    key={q.id}
                    className={`flex items-start gap-4 cursor-pointer p-5 rounded-2xl border-2 transition-all duration-200 ${
                      checked
                        ? "bg-[var(--color-bg-clicked)] border-[#4aa35a]/40"
                        : "bg-[var(--color-bg-card)] border-[var(--color-border)] hover:border-[#4aa35a]/25 hover:bg-[var(--color-accent)]/[0.02]"
                    }`}
                  >
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input type="checkbox" checked={checked} onChange={() => handleCheckbox(q.id)} className="peer sr-only" />
                      <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 ${
                        checked ? "bg-[var(--color-accent)] border-[#4aa35a]" : "bg-[var(--color-bg-card)] border-[#c8c3b8]"
                      }`}>
                        {checked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className={`text-[14px] leading-relaxed ${
                              checked
                                ? "text-[var(--color-primary)] font-medium"
                                : "text-[var(--color-text-gray)] font-light"
                            }`}
                          >
                            {q.questionText}
                          </span>

                          {q.toolTip && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleTip(q.id);
                              }}
                              className="flex-shrink-0 w-5 h-5 rounded-full border border-[var(--color-border-input)] text-[12px] flex items-center justify-center text-[var(--color-text-gray)] hover:bg-[var(--color-bg-subtle)] transition"
                            >
                              +
                            </button>
                          )}
                        </div>

                        {q.toolTip && expandedTips[q.id] && (
                          <div className="mb-4 text-[13px] text-[var(--color-text-light-gray)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-lg p-3 leading-relaxed transition-all duration-300">
                            <p>{q.toolTip}</p> 
                        
                            {q.expandedToolTip && (
                              <button 
                                onClick={() => setOpenModal(true)} 
                                className="inline-flex items-center gap-1 mt-2 text-[12px] text-[#4aa35a] hover:underline underline-offset-2 font-medium"
                              >
                                Learn more
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            )}

                            {openModal && (
                              <div
                                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                                onClick={(e) => e.target === e.currentTarget && setOpenModal(false)}
                              >
                                <div className="bg-white border border-[#ede9e0] rounded-2xl w-full max-w-[480px] overflow-hidden shadow-[0_20px_60px_rgba(15,46,26,0.15)]">

                                  {/* Header */}
                                  <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4 border-b border-[#f0ede6]">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-xl bg-[#4aa35a]/[0.08] border border-[#4aa35a]/25 flex items-center justify-center flex-shrink-0">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4aa35a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                                        </svg>
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#4aa35a] mb-0.5">Definition</p>
                                        <p className="text-[15px] font-semibold text-[#0f2e1a] leading-snug">{q.questionText}</p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => setOpenModal(false)}
                                      className="w-7 h-7 rounded-lg bg-[#f5f2ec] border border-[#ede9e0] flex items-center justify-center text-[#94a3a0] hover:text-[#0f2e1a] transition-colors flex-shrink-0"
                                    >
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                      </svg>
                                    </button>
                                  </div>

                                  {/* Body */}
                                  <div className="px-6 py-5">
                                    <p className="text-[14px] text-[#2d3748] leading-[1.75] mb-4 text-justify">{q.expandedToolTip}</p>

                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => setOpenModal(false)}
                                        className="px-5 py-2 rounded-full bg-[#4aa35a] text-white text-[13px] font-semibold hover:bg-[#3d8f4c] transition-colors"
                                      >
                                        Got it
                                      </button>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={handlePrev}
            disabled={isPrevDisabled}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium transition-all duration-200 ${
              isPrevDisabled
                ? "text-[#c8c3b8] bg-[var(--color-bg-card)] border border-[var(--color-border-input)] cursor-not-allowed"
                : "text-[#6b7a75] bg-[var(--color-bg-card)] border border-[var(--color-border-input)] hover:border-[#0f2e1a]/30 hover:text-[var(--color-primary)]"
            }`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M5 8L2 5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>

          <div className="flex flex-col items-end gap-2">
            {blocksNext && (
              <p className="text-[12px] text-amber-600 font-light flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                  <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {(() => {
                  if (dropdownBlocksNext) return "Please answer all questions on this page to continue.";
                  const current = data.ipData[IP_INITIATED_LABEL] ?? { initiated: "", selectedTypes: {}, typeStatuses: {}, dusPvpStatus: "" };
                  if (current.initiated === "") return "Please answer the IP initiation question to continue.";
                  if (PLANT_VARIETY_TYPES.includes(data.technologyType)) return "Please select a Plant Variety Protection status to continue.";
                  return "Select at least one IP type and set its status to continue.";
                })()}
              </p>
            )}
            <button
              onClick={handleNext}
              disabled={blocksNext}
              className={`inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[15px] font-semibold transition-all duration-300 ${
                blocksNext
                  ? "text-white/60 bg-[var(--color-accent-35)] cursor-not-allowed shadow-none"
                  : "text-white bg-[var(--color-accent)] shadow-[0_8px_32px_rgba(74,163,90,0.35)] hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(74,163,90,0.45)]"
              }`}
            >
              {isLastStep ? "Finish Assessment" : "Continue"}
              <span className="w-5 h-5 rounded-full bg-[var(--color-bg-card)]/20 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}