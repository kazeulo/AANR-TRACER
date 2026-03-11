"use client";

import { useEffect, useMemo, useState } from "react";
import { useAssessment, IPData, AnswerValue } from "../AssessmentContext";
import type { MultiConditionalAnswer } from "../../utils/trlCalculator";
import { categoryOrder, categoryDescriptions } from "../../utils/helperConstants";
import { useRouter } from "next/navigation";
import { PLANT_ANIMAL_TYPES, IP_INITIATED_LABEL, IP_FILED_LABEL, IP_CATEGORY, IP_TYPES, IP_STATUS_OPTIONS, REGION_CONTACTS} from "../../utils/ipHelpers";
import { getQuestionsJSON } from "../../utils/questionsCache";

// Module-level cache — shared with ResultsPage so the JSON is only ever
// fetched once per browser session, regardless of which page loads first.
const questionsCache: Record<string, Record<string, Question[]>> = {};

// Types 

interface DropdownOption {
  label: string;
  value: string;
  trlSatisfied?: number | null;
  contactLabel?: string;
  action?: string;
  items?: string[];
}

interface Question {
  id: string;
  questionText: string;
  trlLevel: number;
  technologyType: string;
  category: string;
  toolTip?: string;
  type?: "checkbox" | "dropdown" | "multi-conditional";
  options?: DropdownOption[];
}

// IP Section 

interface IPSectionProps {
  label: string;
  ipData: IPData;
  onChange: (updated: IPData) => void;
}

function IPSection({ label, ipData, onChange }: IPSectionProps) {
  const key = label;
  const current = ipData[key] ?? { initiated: "", selectedTypes: {}, typeStatuses: {} };

  const setField = (field: string, value: unknown) => {
    onChange({ ...ipData, [key]: { ...current, [field]: value } });
  };

  const handleTypeToggle = (ipType: string) => {
    const isChecked = current.selectedTypes[ipType] ?? false;
    const updatedTypes = { ...current.selectedTypes, [ipType]: !isChecked };
    const updatedStatuses = { ...current.typeStatuses };
    if (isChecked) delete updatedStatuses[ipType];
    onChange({ ...ipData, [key]: { ...current, selectedTypes: updatedTypes, typeStatuses: updatedStatuses } });
  };

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,46,26,0.05)]">

      {/* Card header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#f5f2ec] bg-[var(--color-bg-subtle)]">
        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
        <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-accent)]">{label}</span>
      </div>

      <div className="px-6 py-6">

        {/* Main select */}
        <div className="relative mb-5">
          <select
            value={current.initiated}
            onChange={e => setField("initiated", e.target.value)}
            className="w-full appearance-none bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-3 text-[14px] text-[var(--color-text)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
          >
            <option value="">Select an option…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="trade_secret">IP is a Trade Secret</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faintest)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* YES → IP type checkboxes */}
        {current.initiated === "yes" && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-text-faintest)] mb-3">
              Select IP Protection Type(s)
            </p>
            {IP_TYPES.map(ipType => {
              const isChecked = current.selectedTypes[ipType] ?? false;
              return (
                <div key={ipType} className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0">
                      <input type="checkbox" checked={isChecked} onChange={() => handleTypeToggle(ipType)} className="peer sr-only" />
                      <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 ${
                        isChecked ? "bg-[var(--color-accent)] border-[#4aa35a]" : "bg-[var(--color-bg-card)] border-[#c8c3b8] group-hover:border-[#4aa35a]/60"
                      }`}>
                        {isChecked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-[14px] font-light leading-snug transition-colors ${isChecked ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-text-gray)]"}`}>
                      {ipType}
                    </span>
                  </label>
                  {isChecked && (
                    <div className="ml-8 relative">
                      <select
                        value={current.typeStatuses[ipType] ?? ""}
                        onChange={e => setField("typeStatuses", { ...current.typeStatuses, [ipType]: e.target.value })}
                        className="w-full max-w-xs appearance-none bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-2.5 text-[13px] text-[var(--color-text-gray)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-8"
                      >
                        <option value="">IP Protection Status…</option>
                        {IP_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faintest)]">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* NO */}
        {current.initiated === "no" && (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
            <p className="text-[14px] font-semibold text-amber-800">
              Protecting your technology is an important step toward commercialization.
            </p>
            <p className="text-[13px] text-amber-700 font-light leading-relaxed">
              Contact a Regional Office below for guidance on filing intellectual property protection.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {REGION_CONTACTS.map(r => (
                <div key={r.label} className="flex items-baseline gap-1.5 text-[12px]">
                  <span className="font-medium text-amber-800 flex-shrink-0">{r.label}</span>
                  <span className="text-amber-600">–</span>
                  <a href={`mailto:${r.email}`} className="text-[var(--color-accent)] hover:underline underline-offset-2 truncate">{r.email}</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRADE SECRET */}
        {current.initiated === "trade_secret" && (
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-[14px] text-blue-800 leading-relaxed font-light">
            Your technology is protected as a <strong className="font-semibold">Trade Secret</strong>. Ensure that appropriate
            confidentiality measures and non-disclosure agreements are in place to maintain its protection.
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Dropdown Question ────────────────────────────────────────────────────────

function DropdownQuestion({
  q,
  value,
  onChange,
}: {
  q: Question;
  value: string | null;
  onChange: (val: string) => void;
}) {
  const selected = q.options?.find(o => o.value === value);
  const showContact = selected?.contactLabel;

  return (
    <div className="bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-200">
      <div className="p-5">
        <p className="text-[14px] text-[var(--color-text-gray)] font-light leading-relaxed mb-3">
          {q.questionText}
        </p>
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
        {showContact && (
          <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-800 font-light leading-relaxed">
            {selected?.contactLabel}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Multi-Conditional Question ───────────────────────────────────────────────

function MultiConditionalQuestion({
  q,
  value,
  onSelectionChange,
  onItemToggle,
}: {
  q: Question;
  value: MultiConditionalAnswer;
  onSelectionChange: (sel: string) => void;
  onItemToggle: (item: string) => void;
}) {
  const yesOption = q.options?.find(o => o.action === "checklist");
  const noOption  = q.options?.find(o => o.action === "contacts");

  return (
    <div className="bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-200">
      <div className="p-5">
        <p className="text-[14px] text-[var(--color-text-gray)] font-light leading-relaxed mb-3">
          {q.questionText}
        </p>

        {/* Top-level selection */}
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

        {/* No → show contact info */}
        {value.selection === "no" && noOption?.contactLabel && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-800 font-light leading-relaxed">
            {noOption.contactLabel}
          </div>
        )}

        {/* Yes → checklist of sub-items */}
        {value.selection === "yes" && yesOption?.items && (
          <div className="space-y-2.5 mt-1">
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-text-faintest)] mb-2">
              Select all that apply
            </p>
            {yesOption.items.map(item => {
              const checked = value.checkedItems.includes(item);
              return (
                <label key={item} className={`flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border transition-all duration-200 ${
                  checked ? "bg-[var(--color-accent)]/[0.05] border-[#4aa35a]/40" : "bg-[var(--color-bg-subtle)] border-[var(--color-border-input)] hover:border-[#4aa35a]/30"
                }`}>
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input type="checkbox" checked={checked} onChange={() => onItemToggle(item)} className="peer sr-only" />
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
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {/* Exempt */}
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
  const [openTooltips, setOpenTooltips] = useState<Record<string, boolean>>({});

  const questionsPerPage = 5;
  const isPlantAnimal = PLANT_ANIMAL_TYPES.includes(data.technologyType ?? "");

  useEffect(() => {
    if (!data.technologyType) return;

    // Restore position from context — runs on every render but is instant
    if (lastCategoryIndex >= 0 && lastPage >= 0 && orderedCategories.length > 0) {
      setCurrentCategoryIndex(Math.min(lastCategoryIndex, orderedCategories.length - 1));
      setCurrentPage(lastPage);
    }
  }, [lastCategoryIndex, lastPage, orderedCategories.length]);

  useEffect(() => {
    if (!data.technologyType) return;

    // Return immediately from cache if already loaded for this type
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

      const groupedData: Record<string, Question[]> = {};
      flat.forEach(q => {
        if (!groupedData[q.category]) groupedData[q.category] = [];
        groupedData[q.category].push(q);
      });

      // Store in module cache for instant reuse
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
  const totalPages = isIPCategory ? 1 : Math.ceil(currentQuestions.length / questionsPerPage);

  const visibleQuestions = useMemo(() => {
    if (isIPCategory) return [];
    return currentQuestions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);
  }, [currentPage, currentQuestions, isIPCategory]);

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
      const lastPageOfPrev = prevCat === IP_CATEGORY ? 0 : Math.ceil(prevQuestions.length / questionsPerPage) - 1;
      setCurrentCategoryIndex(prevIndex);
      setCurrentPage(lastPageOfPrev);
    }
  };

  const isLastStep =
    currentCategoryIndex === orderedCategories.length - 1 &&
    (isIPCategory || currentPage === totalPages - 1);

  const isPrevDisabled = currentCategoryIndex === 0 && currentPage === 0;

  // IP validation
  const ipBlocksNext = (() => {
    if (!isIPCategory) return false;
    const ipKey = IP_INITIATED_LABEL;
    const current = data.ipData[ipKey] ?? { initiated: "", selectedTypes: {}, typeStatuses: {} };
    if (current.initiated === "") return true;
    if (current.initiated !== "yes") return false;
    const checkedTypes = Object.entries(current.selectedTypes)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (checkedTypes.length === 0) return true;
    return checkedTypes.some(t => !current.typeStatuses[t]);
  })();

  // Block Next if any visible dropdown or multi-conditional on this page has no selection
  const dropdownBlocksNext = (() => {
    if (isIPCategory) return false;
    return visibleQuestions.some(q => {
      if (q.type === "dropdown") {
        const val = data.answers[q.id];
        return !val; // null or empty string = not selected
      }
      if (q.type === "multi-conditional") {
        const val = data.answers[q.id] as { selection?: string } | undefined;
        return !val?.selection; // no top-level selection made
      }
      return false;
    });
  })();

  const blocksNext = ipBlocksNext || dropdownBlocksNext;

  // Progress
  const totalSteps = orderedCategories.reduce((acc, cat) => {
    if (cat === IP_CATEGORY) return acc + 1;
    return acc + Math.ceil((grouped[cat]?.length ?? 0) / questionsPerPage);
  }, 0);
  const stepsCompleted = orderedCategories.slice(0, currentCategoryIndex).reduce((acc, cat) => {
    if (cat === IP_CATEGORY) return acc + 1;
    return acc + Math.ceil((grouped[cat]?.length ?? 0) / questionsPerPage);
  }, 0) + currentPage;
  const progressPct = totalSteps > 0 ? Math.round((stepsCompleted / totalSteps) * 100) : 0;

  // Loading
  if (loading) {
    return (
      <div className="font-[var(--font-body)] min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#4aa35a]/30 border-t-[#4aa35a] animate-spin" />
          <p className="text-[14px] text-[var(--color-text-faintest)] font-light">Loading assessment…</p>
        </div>
      </div>
    );
  }

  if (orderedCategories.length === 0) {
    return (
      <div className="font-[var(--font-body)] min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-3 w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4aa35a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <p className="text-[15px] text-[var(--color-text-gray)] font-light">No questions available for the selected technology type.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="font-[var(--font-body)] min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">

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
          <h1 className="font-[var(--font-heading)] text-[clamp(24px,3.5vw,36px)] text-[var(--color-primary)] leading-tight tracking-tight mb-3">
            {currentCategory}
          </h1>
          {categoryDescriptions[currentCategory] && (
            <p className="text-[14px] text-[var(--color-text-faint)] font-light leading-relaxed max-w-2xl">
              {categoryDescriptions[currentCategory]}
            </p>
          )}
        </div>

        {/* IP Category */}
        <div style={{ minHeight: 420 }}>
        {isIPCategory ? (
          <div className="space-y-6">
            <IPSection
              label={IP_INITIATED_LABEL}
              ipData={data.ipData}
              onChange={handleIPChange}
            />
          </div>
        ) : (
          /* Questions — checkbox / dropdown / multi-conditional */
          <div className="space-y-3">
            {visibleQuestions.map(q => {
              const qType = q.type ?? "checkbox";

              // ── Dropdown ──────────────────────────────────────────────────
              if (qType === "dropdown") {
                return (
                  <DropdownQuestion
                    key={q.id}
                    q={q}
                    value={(data.answers[q.id] as string | null) ?? null}
                    onChange={val => handleDropdown(q.id, val)}
                  />
                );
              }

              // ── Multi-conditional ─────────────────────────────────────────
              if (qType === "multi-conditional") {
                const mcVal = (data.answers[q.id] as MultiConditionalAnswer) ?? { selection: "", checkedItems: [] };
                return (
                  <MultiConditionalQuestion
                    key={q.id}
                    q={q}
                    value={mcVal}
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

              // ── Checkbox (default) ────────────────────────────────────────
              const checked = data.answers[q.id] === true;
              const tooltipOpen = openTooltips[q.id] ?? false;
              return (
                <label
                  key={q.id}
                  className={`flex items-start gap-4 cursor-pointer p-5 rounded-2xl border-2 transition-all duration-200 ${
                    checked
                      ? "bg-[var(--color-accent)]/[0.05] border-[#4aa35a]/40"
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
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[14px] leading-relaxed transition-colors ${checked ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-text-gray)] font-light"}`}>
                        {q.questionText}
                      </span>
                      {q.toolTip && (
                        <button
                          type="button"
                          onClick={e => {
                            e.preventDefault();
                            setOpenTooltips(prev => ({ ...prev, [q.id]: !prev[q.id] }));
                          }}
                          className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 mt-0.5 ${
                            tooltipOpen
                              ? "bg-[var(--color-accent)] border-[#4aa35a]"
                              : "bg-[var(--color-bg-card)] border-[#c8c3b8] hover:border-[#4aa35a] hover:bg-[var(--color-accent)]/10"
                          }`}
                          title={tooltipOpen ? "Hide hint" : "Show hint"}
                        >
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"
                            stroke={tooltipOpen ? "white" : "#6b7a75"} strokeWidth="1.8"
                            strokeLinecap="round">
                            <line x1="4" y1="1" x2="4" y2="7" className={`transition-all duration-200 ${tooltipOpen ? "opacity-0" : "opacity-100"}`} />
                            <line x1="1" y1="4" x2="7" y2="4" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {q.toolTip && tooltipOpen && (
                      <div className="mt-2.5 flex items-start gap-2 bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
                          stroke="#4aa35a" strokeWidth="1.8" strokeLinecap="round"
                          className="flex-shrink-0 mt-[1px]">
                          <circle cx="8" cy="8" r="7"/>
                          <path d="M8 7v4M8 5h.01"/>
                        </svg>
                        <p className="text-[12px] text-[#6b7a75] font-light leading-relaxed">
                          {q.toolTip}
                        </p>
                      </div>
                    )}
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
                  const current = data.ipData[IP_INITIATED_LABEL] ?? { initiated: "", selectedTypes: {}, typeStatuses: {} };
                  if (current.initiated === "") return "Please answer the IP initiation question to continue.";
                  return "Select at least one IP type and set its status to continue.";
                })()}
              </p>
            )}
            <button
              onClick={handleNext}
              disabled={blocksNext}
              className={`inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[15px] font-semibold transition-all duration-300 ${
                blocksNext
                  ? "text-white/60 bg-[var(--color-accent)]/40 cursor-not-allowed shadow-none"
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