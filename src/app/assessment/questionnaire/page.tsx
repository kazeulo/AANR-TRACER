"use client";

import { useEffect, useMemo, useState } from "react";
import { useAssessment, IPData, AnswerValue } from "../AssessmentContext";
import type { MultiConditionalAnswer } from "../../utils/trlCalculator";
import { categoryOrder, categoryDescriptions } from "../../utils/helperConstants";
import { useRouter } from "next/navigation";
import { PLANT_ANIMAL_TYPES, IP_INITIATED_LABEL, IP_FILED_LABEL, IP_CATEGORY, IP_TYPES, IP_STATUS_OPTIONS, REGION_CONTACTS} from "../../utils/ipHelpers";
import { ABH_REGIONS, ATBI_REGIONS, REGULATORY_BODIES} from "../../utils/contacts";
import { getQuestionsJSON } from "../../utils/questionsCache";

const questionsCache: Record<string, Record<string, Question[]>> = {};

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
            onChange={e => {
              const newVal = e.target.value as "yes" | "no" | "trade_secret" | "";
              if (newVal !== "yes") {
                onChange({ ...ipData, [key]: { initiated: newVal, selectedTypes: {}, typeStatuses: {} } });
              } else {
                setField("initiated", newVal);
              }
            }}
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
              For assistance with Intellectual Property Protection applications, you may contact the following Regional IP-TBM Offices under the RAISE Program.
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

// ─── ABH Contact Panel ────────────────────────────────────────────────────────

function ABHContactPanel() {
  return (
    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-amber-200 bg-amber-100/60">
        <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-amber-800 mb-0.5">
          Agribusiness Hub (ABH) Contacts
        </p>
        <p className="text-[11.5px] text-amber-700 font-light leading-relaxed">
          For pre-commercialization packaging, coordinate with the ABH Project under the RAISE Program in your region.
        </p>
      </div>
      <div className="divide-y divide-amber-100">
        {ABH_REGIONS.map(({ region, university, email }) => (
          <div key={region} className="flex items-center justify-between gap-3 px-4 py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[12px] text-amber-900 font-light truncate">{region}</span>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-0.5">
              <span className="text-[12px] font-semibold text-amber-800">{university}</span>
              {email && (
                <a href={`mailto:${email}`} className="text-[10px] text-amber-600 hover:text-amber-800 underline underline-offset-2 transition-colors">
                  {email}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ATBI Contact Panel ───────────────────────────────────────────────────────

function ATBIContactPanel({ technologyType }: { technologyType: string }) {
  const reg = REGULATORY_BODIES[technologyType];
  return (
    <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 overflow-hidden">

      {/* Regional ATBI contacts */}
      <div className="px-4 py-3 border-b border-blue-200">
        <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-blue-700 mb-1.5">
          Regional ATBI Contact Information
        </p>
        <p className="text-[11.5px] text-blue-600 font-light leading-relaxed mb-3">
          For assistance with regulatory requirements, you may reach out to ATBI at the email address below or visit the official regulatory body website for detailed application guidelines.
        </p>
        <div className="divide-y divide-blue-100 rounded-lg border border-blue-100 overflow-hidden">
          {ATBI_REGIONS.map(({ region, university, email }) => (
            <div key={region} className="flex items-center justify-between gap-3 px-3 py-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-300" />
                <span className="text-[11.5px] text-blue-800 font-light truncate">{region}</span>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-0.5">
                <span className="text-[11.5px] font-semibold text-blue-900">{university}</span>
                {email && (
                  <a href={`mailto:${email}`} className="text-[10px] text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors">
                    {email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory body website */}
      {reg && (
        <div className="px-4 py-3 space-y-3">
          <p className="text-[11.5px] text-blue-700 font-light leading-relaxed">
            You may also visit the official website of the relevant regulatory body to review requirements and begin your application.
          </p>
          <div className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
            <div>
              <p className="text-[11px] font-bold tracking-[1px] uppercase text-blue-600 mb-0.5">
                Relevant Regulatory Body
              </p>
              <p className="text-[12.5px] text-blue-900 font-medium leading-relaxed mb-1">
                {reg.body}
              </p>
              <a
                href={reg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors break-all"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                {reg.url}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dropdown Question ────────────────────────────────────────────────────────

function DropdownQuestion({
  q,
  value,
  onChange,
  technologyType,
}: {
  q: Question;
  value: string | null;
  onChange: (val: string) => void;
  technologyType: string;
}) {
  const selected = q.options?.find(o => o.value === value);
  const showContact = selected?.contactLabel;

  return (
    <div className="bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-[14px] text-[var(--color-text-gray)] font-light leading-relaxed">
            {q.questionText}
          </p>
        </div>
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
          <ATBIContactPanel technologyType={technologyType} />
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
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-[14px] text-[var(--color-text-gray)] font-light leading-relaxed">
            {q.questionText}
          </p>
        </div>

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

        {/* No → show ABH regional contacts */}
        {value.selection === "no" && noOption?.contactLabel && (
          <ABHContactPanel />
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

// ─── Main Page ────────────────────────────────────────────────────────────────

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

  // ── Page groups ────────────────────────────────────────────────────────────
  // precom_docs questions (id starts with "precom_docs") always get their own
  // solo page. All other questions are batched up to questionsPerPage.
  const pageGroups: Question[][] = useMemo(() => {
    if (isIPCategory) return [];
    const groups: Question[][] = [];
    let batch: Question[] = [];

    for (const q of currentQuestions) {
      if (q.id.startsWith("precom_docs")) {
        // Flush current batch first
        if (batch.length > 0) { groups.push(batch); batch = []; }
        // precom_docs gets its own solo page
        groups.push([q]);
      } else {
        batch.push(q);
        if (batch.length >= questionsPerPage) { groups.push(batch); batch = []; }
      }
    }
    if (batch.length > 0) groups.push(batch);
    return groups;
  }, [currentQuestions, isIPCategory, questionsPerPage]);

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
      const prevPageGroups: Question[][] = (() => {
        if (prevCat === IP_CATEGORY) return [];
        const gs: Question[][] = [];
        let b: Question[] = [];
        for (const q of prevQuestions) {
          if (q.id.startsWith("precom_docs")) {
            if (b.length > 0) { gs.push(b); b = []; }
            gs.push([q]);
          } else {
            b.push(q);
            if (b.length >= questionsPerPage) { gs.push(b); b = []; }
          }
        }
        if (b.length > 0) gs.push(b);
        return gs;
      })();
      const lastPageOfPrev = prevCat === IP_CATEGORY ? 0 : Math.max(0, prevPageGroups.length - 1);
      setCurrentCategoryIndex(prevIndex);
      setCurrentPage(lastPageOfPrev);
    }
  };

  const isLastStep =
    currentCategoryIndex === orderedCategories.length - 1 &&
    (isIPCategory || currentPage === totalPages - 1);

  const isPrevDisabled = currentCategoryIndex === 0 && currentPage === 0;

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

  const dropdownBlocksNext = (() => {
    if (isIPCategory) return false;
    return visibleQuestions.some(q => {
      if (q.type === "dropdown") {
        const val = data.answers[q.id];
        return !val;
      }
      if (q.type === "multi-conditional") {
        const val = data.answers[q.id] as { selection?: string } | undefined;
        return !val?.selection;
      }
      return false;
    });
  })();

  const blocksNext = ipBlocksNext || dropdownBlocksNext;

  // Progress calculation using pageGroups
  const totalSteps = orderedCategories.reduce((acc, cat) => {
    if (cat === IP_CATEGORY) return acc + 1;
    const catQs = grouped[cat] ?? [];
    const gs: Question[][] = [];
    let b: Question[] = [];
    for (const q of catQs) {
      if (q.id.startsWith("precom_docs")) { if (b.length > 0) { gs.push(b); b = []; } gs.push([q]); }
      else { b.push(q); if (b.length >= questionsPerPage) { gs.push(b); b = []; } }
    }
    if (b.length > 0) gs.push(b);
    return acc + gs.length;
  }, 0);

  const stepsCompleted = orderedCategories.slice(0, currentCategoryIndex).reduce((acc, cat) => {
    if (cat === IP_CATEGORY) return acc + 1;
    const catQs = grouped[cat] ?? [];
    const gs: Question[][] = [];
    let b: Question[] = [];
    for (const q of catQs) {
      if (q.id.startsWith("precom_docs")) { if (b.length > 0) { gs.push(b); b = []; } gs.push([q]); }
      else { b.push(q); if (b.length >= questionsPerPage) { gs.push(b); b = []; } }
    }
    if (b.length > 0) gs.push(b);
    return acc + gs.length;
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
          <h1 className="font-['DM_Serif_Display'] text-[clamp(24px,3.5vw,36px)] text-[var(--color-primary)] leading-tight tracking-tight mb-3">
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
                      <span className={`text-[14px] leading-relaxed transition-colors ${checked ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-text-gray)] font-light"}`}>
                        {q.questionText}
                      </span>
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