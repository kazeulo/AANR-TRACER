"use client";

// react imports
import { useState } from "react";

// utils
import { useAssessment} from "@/hooks/assessment/useAssessment";
import { IPData, MultiConditionalAnswer } from "@/types/assessment";
import { categoryDescriptions } from "@/constants/categories";
import { IP_INITIATED_LABEL } from "@/constants/ip";

// hooks
import { useBlocksNext } from "@/hooks/assessment/questionnaire/useBlocksNext";
import { usePagination } from "@/hooks/assessment/questionnaire/usePagination";
import { useQuestions } from "@/hooks/assessment/questionnaire/useQuestions";
import { useProgressBar } from "@/hooks/assessment/questionnaire/useProgressBar";

// components
import { IPSection } from "@/components/questionnaire/ip/ipSection";
import { CheckboxQuestion } from "@/components/questionnaire/questions/CheckboxQuestion";
import { DropdownQuestion } from "@/components/questionnaire/questions/DropdownQuestion";
import { MultiConditionalQuestion } from "@/components/questionnaire/questions/MultiConditionalQuestion";

export default function QuestionnairePage() {
  const { data, updateData, lastCategoryIndex, setLastCategoryIndex, lastPage, setLastPage } = useAssessment();

  const { grouped, orderedCategories, loading } = useQuestions(data.technologyType, lastCategoryIndex, lastPage);

  const pagination = usePagination({ orderedCategories, grouped, lastCategoryIndex, lastPage, setLastCategoryIndex, setLastPage });

  const { blocksNext, blockMessage } = useBlocksNext({
    isIPCategory: pagination.isIPCategory,
    visibleQuestions: pagination.visibleQuestions,
    answers: data.answers,
    ipData: data.ipData,
    technologyType: data.technologyType,
  });

  const { progressPct } = useProgressBar({
    orderedCategories,
    grouped,
    currentCategoryIndex: pagination.currentCategoryIndex,
    currentPage: pagination.currentPage,
  });

  const [expandedTips, setExpandedTips] = useState<Record<string, boolean>>({});
  const toggleTip = (id: string) => setExpandedTips((prev) => ({ ...prev, [id]: !prev[id] }));

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
              {pagination.currentCategory}
            </span>
            <span className="text-[11px] text-[var(--color-text)] font-light flex-shrink-0">
              Category {pagination.currentCategoryIndex + 1} of {orderedCategories.length}
              {!pagination.isIPCategory && ` · Page ${pagination.currentPage + 1} of ${pagination.totalPages}`}
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
            Assessment · Category {pagination.currentCategoryIndex + 1}
          </div>
          <h1 className="text-[clamp(24px,3.5vw,36px)] text-[var(--color-primary)] leading-tight tracking-tight mb-3">
            {pagination.currentCategory}
          </h1>
          {categoryDescriptions[pagination.currentCategory] && (
            <p className="text-[14px] text-[var(--color-text-gray)] font-light leading-relaxed max-w-2xl">
              {categoryDescriptions[pagination.currentCategory]}
            </p>
          )}
        </div>

        {/* Questions */}
        <div style={{ minHeight: 420 }}>
          {pagination.isIPCategory ? (
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
              {pagination.visibleQuestions.map((q) => {
                const qType = q.type ?? "checkbox";

                if (qType === "dropdown") {
                  return (
                    <DropdownQuestion
                      key={q.id}
                      q={q}
                      value={(data.answers[q.id] as string | null) ?? null}
                      onChange={(val) => handleDropdown(q.id, val)}
                      technologyType={data.technologyType}
                      expanded={!!expandedTips[q.id]}
                      toggleTip={() => toggleTip(q.id)}
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
                      onSelectionChange={(sel) =>
                        handleMultiConditional(q.id, {
                          selection: sel,
                          checkedItems: sel !== "yes" ? [] : mcVal.checkedItems,
                        })
                      }
                      onItemToggle={(item) => {
                        const already = mcVal.checkedItems.includes(item);
                        handleMultiConditional(q.id, {
                          checkedItems: already
                            ? mcVal.checkedItems.filter((i) => i !== item)
                            : [...mcVal.checkedItems, item],
                        });
                      }}
                    />
                  );
                }

                return (
                  <CheckboxQuestion
                    key={q.id}
                    q={q}
                    checked={data.answers[q.id] === true}
                    onChange={() => handleCheckbox(q.id)}
                    expandedTip={!!expandedTips[q.id]}
                    toggleTip={() => toggleTip(q.id)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={pagination.handlePrev}
            disabled={pagination.isPrevDisabled}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium transition-all duration-200 ${
              pagination.isPrevDisabled
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
                {blockMessage}
              </p>
            )}
            <button
              onClick={pagination.handleNext}
              disabled={blocksNext}
              className={`inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[15px] font-semibold transition-all duration-300 ${
                blocksNext
                  ? "text-white/60 bg-[var(--color-accent-35)] cursor-not-allowed shadow-none"
                  : "text-white bg-[var(--color-accent)] shadow-[0_8px_32px_rgba(74,163,90,0.35)] hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(74,163,90,0.45)]"
              }`}
            >
              {pagination.isLastStep ? "Finish Assessment" : "Continue"}
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