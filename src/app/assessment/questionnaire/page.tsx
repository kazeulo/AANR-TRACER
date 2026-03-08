"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { useAssessment, IPData } from "../AssessmentContext";
import { categoryOrder, categoryDescriptions } from "../../utils/helperConstants";
import { useRouter } from "next/navigation";
import { 
  PLANT_ANIMAL_TYPES, 
  IP_INITIATED_LABEL, 
  IP_TYPES, 
  IP_STATUS_OPTIONS, 
  REGION_CONTACTS, 
  IP_CATEGORY,
} from "../../utils/ipHelpers";

// Types 

interface Question {
  id: string;
  questionText: string;
  trlLevel: string;
  technologyType: string;
  category: string;
  toolTip?: string;
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
    <div className="bg-white border border-[#ede9e0] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,46,26,0.05)]">

      {/* Card header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#f5f2ec] bg-[#f8f6f1]">
        <span className="w-2 h-2 rounded-full bg-[#4aa35a] flex-shrink-0" />
        <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">{label}</span>
      </div>

      <div className="px-6 py-6">

        {/* Main select */}
        <div className="relative mb-5">
          <select
            value={current.initiated}
            onChange={e => setField("initiated", e.target.value)}
            className="w-full appearance-none bg-[#f8f6f1] border border-[#e5e1d8] rounded-xl px-4 py-3 text-[14px] text-[#1a1a1a] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
          >
            <option value="">Select an option…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="trade_secret">IP is a Trade Secret</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3a0]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* YES → IP type checkboxes */}
        {current.initiated === "yes" && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#94a3a0] mb-3">
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
                        isChecked ? "bg-[#4aa35a] border-[#4aa35a]" : "bg-white border-[#c8c3b8] group-hover:border-[#4aa35a]/60"
                      }`}>
                        {isChecked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-[14px] font-light leading-snug transition-colors ${isChecked ? "text-[#0f2e1a] font-medium" : "text-[#4a5568]"}`}>
                      {ipType}
                    </span>
                  </label>
                  {isChecked && (
                    <div className="ml-8 relative">
                      <select
                        value={current.typeStatuses[ipType] ?? ""}
                        onChange={e => setField("typeStatuses", { ...current.typeStatuses, [ipType]: e.target.value })}
                        className="w-full max-w-xs appearance-none bg-[#f8f6f1] border border-[#e5e1d8] rounded-xl px-4 py-2.5 text-[13px] text-[#4a5568] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-8"
                      >
                        <option value="">IP Protection Status…</option>
                        {IP_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3a0]">
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
                  <a href={`mailto:${r.email}`} className="text-[#4aa35a] hover:underline underline-offset-2 truncate">{r.email}</a>
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
    const loadCSV = async () => {
      const res = await fetch("/questions.csv");
      const csvText = await res.text();
      const result = Papa.parse<Omit<Question, "id">>(csvText, { header: true, skipEmptyLines: true });
      const filtered = result.data.filter(q => q.technologyType === data.technologyType);
      const withIds: Question[] = filtered.map((item, index) => ({ ...item, id: `${item.category}-${index}` }));

      const groupedData: Record<string, Question[]> = {};
      withIds.forEach(q => {
        if (!groupedData[q.category]) groupedData[q.category] = [];
        groupedData[q.category].push(q);
      });

      const ordered = categoryOrder.filter(
        cat => cat === IP_CATEGORY || (groupedData[cat] && groupedData[cat].length > 0)
      );

      setGrouped(groupedData);
      setOrderedCategories(ordered);

      if (lastCategoryIndex < ordered.length && lastPage >= 0) {
        setCurrentCategoryIndex(lastCategoryIndex);
        setCurrentPage(lastPage);
      } else {
        setCurrentCategoryIndex(0);
        setCurrentPage(0);
      }
      setLoading(false);
    };

    if (data.technologyType) { setLoading(true); loadCSV(); }
  }, [data.technologyType, lastCategoryIndex, lastPage]);

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

  // IP validation — block Next if "yes" but no type checked or any checked type missing a status
  const ipBlocksNext = (() => {
    if (!isIPCategory) return false;
    const ipKey = IP_INITIATED_LABEL;
    const current = data.ipData[ipKey] ?? { initiated: "", selectedTypes: {}, typeStatuses: {} };
    if (current.initiated !== "yes") return false;
    const checkedTypes = Object.entries(current.selectedTypes)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (checkedTypes.length === 0) return true;
    return checkedTypes.some(t => !current.typeStatuses[t]);
  })();

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

  // ── Loading ──
  if (loading) {
    return (
      <div className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#4aa35a]/30 border-t-[#4aa35a] animate-spin" />
          <p className="text-[14px] text-[#94a3a0] font-light">Loading assessment…</p>
        </div>
      </div>
    );
  }

  if (orderedCategories.length === 0) {
    return (
      <div className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-3 w-12 h-12 rounded-xl bg-[#4aa35a]/10 flex items-center justify-center mx-auto">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4aa35a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <p className="text-[15px] text-[#4a5568] font-light">No questions available for the selected technology type.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] text-[#1a1a1a]">

      {/* ── Sticky progress bar ── */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-white border-b border-[#ede9e0] px-6 lg:px-[6vw] py-3 shadow-sm">
        <div className="max-w-[860px] mx-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[#4aa35a] uppercase tracking-[1.5px] truncate mr-4">
              {currentCategory}
            </span>
            <span className="text-[11px] text-[#94a3a0] font-light flex-shrink-0">
              Category {currentCategoryIndex + 1} of {orderedCategories.length}
              {!isIPCategory && ` · Page ${currentPage + 1} of ${totalPages}`}
            </span>
          </div>
          <div className="h-1 bg-[#e5e1d8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4aa35a] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1000px] mx-auto px-6 lg:px-[6vw] pt-[110px] pb-24">

        {/* Category header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] mb-4 px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
            Assessment · Category {currentCategoryIndex + 1}
          </div>
          <h1 className="font-['DM_Serif_Display',serif] text-[clamp(24px,3.5vw,36px)] text-[#0f2e1a] leading-tight tracking-tight mb-3">
            {currentCategory}
          </h1>
          {categoryDescriptions[currentCategory] && (
            <p className="text-[14px] text-[#8a9a94] font-light leading-relaxed max-w-2xl">
              {categoryDescriptions[currentCategory]}
            </p>
          )}
        </div>

        {/* ── IP Category ── */}
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
          /* ── Regular Questions ── */
          <div className="space-y-3">
            {visibleQuestions.map(q => {
              const checked = data.answers[q.id] ?? false;
              return (
                <label
                  key={q.id}
                  className={`flex items-start gap-4 cursor-pointer p-5 rounded-2xl border-2 transition-all duration-200 ${
                    checked
                      ? "bg-[#4aa35a]/[0.05] border-[#4aa35a]/40"
                      : "bg-white border-[#ede9e0] hover:border-[#4aa35a]/25 hover:bg-[#4aa35a]/[0.02]"
                  }`}
                >
                  {/* Custom checkbox */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input type="checkbox" checked={checked} onChange={() => handleCheckbox(q.id)} className="peer sr-only" />
                    <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 ${
                      checked ? "bg-[#4aa35a] border-[#4aa35a]" : "bg-white border-[#c8c3b8]"
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
                      <span className={`text-[14px] leading-relaxed transition-colors ${checked ? "text-[#0f2e1a] font-medium" : "text-[#4a5568] font-light"}`}>
                        {q.questionText}
                      </span>
                      {q.toolTip && (
                        <button
                          type="button"
                          onClick={e => { e.preventDefault(); setOpenTooltips(prev => ({ ...prev, [q.id]: !prev[q.id] })); }}
                          className="flex-shrink-0 w-5 h-5 rounded-full border border-[#c8c3b8] bg-white hover:border-[#4aa35a] hover:bg-[#4aa35a]/10 flex items-center justify-center transition-colors mt-0.5"
                          title="Show hint"
                        >
                          <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke={openTooltips[q.id] ? "#4aa35a" : "#94a3a0"} strokeWidth="2" strokeLinecap="round">
                            <circle cx="8" cy="8" r="7"/>
                            <path d="M8 7v5M8 5h.01"/>
                          </svg>
                        </button>
                      )}
                    </div>
                    {q.toolTip && openTooltips[q.id] && (
                      <p className="text-[12px] text-[#6b7a75] font-light mt-2 leading-relaxed bg-[#f8f6f1] border border-[#ede9e0] rounded-lg px-3 py-2">
                        {q.toolTip}
                      </p>
                    )}
                  </div>

                </label>
              );
            })}
          </div>
        )}

        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={handlePrev}
            disabled={isPrevDisabled}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium transition-all duration-200 ${
              isPrevDisabled
                ? "text-[#c8c3b8] bg-white border border-[#e5e1d8] cursor-not-allowed"
                : "text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a]"
            }`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M5 8L2 5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>

          <div className="flex flex-col items-end gap-2">
            {ipBlocksNext && (
              <p className="text-[12px] text-amber-600 font-light flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                  <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Select at least one IP type and set its status to continue.
              </p>
            )}
            <button
              onClick={handleNext}
              disabled={ipBlocksNext}
              className={`inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[15px] font-semibold transition-all duration-300 ${
                ipBlocksNext
                  ? "text-white/60 bg-[#4aa35a]/40 cursor-not-allowed shadow-none"
                  : "text-white bg-[#4aa35a] shadow-[0_8px_32px_rgba(74,163,90,0.35)] hover:bg-[#3d8f4c] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(74,163,90,0.45)]"
              }`}
            >
              {isLastStep ? "Finish Assessment" : "Continue"}
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
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