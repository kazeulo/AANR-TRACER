"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAssessment } from "@/hooks/assessment/useAssessment";
import { categoryOrder } from "../../utils/helperConstants";
import { getQuestionsJSON, prefetchQuestionsJSON } from "../../utils/questionsCache";
import { ConfirmSubmitModal } from "@/components/summary/modals/confirmSubmitModal";
import { TechnologyDetailsCard } from "@/components/summary/TechnologyDetailsCard";
import { CategoryCard } from "@/components/summary/CategoryCard";
import { IPSummary } from "@/components/summary/IPSummary";
import type { Question } from "@/types/questions";

export default function SummaryPage() {
  const { data, updateData } = useAssessment();
  const [questions, setQuestions]     = useState<Question[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const grouped = await getQuestionsJSON() as Record<string, Record<string, Question[]>>;
      setQuestions(Object.values(grouped[data.technologyType] ?? {}).flat());
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

  const grouped: Record<string, Question[]> = {};
  questions.forEach(q => {
    (grouped[q.category] ??= []).push(q);
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

        <TechnologyDetailsCard
          technologyName={data.technologyName}
          technologyType={data.technologyType}
          fundingSource={data.fundingSource}
          onNameChange={val => updateData({ technologyName: val })}
          onTypeChange={val => updateData({ technologyType: val })}
          onFundingChange={val => updateData({ fundingSource: val })}
        />

        <div className="space-y-4 mb-10">
          {displayCategories.map(category => {
            const qs = grouped[category];
            if (!qs?.length) return null;
            return (
              <CategoryCard
                key={category}
                category={category}
                questions={qs}
                answers={data.answers}
                onAnswerChange={handleAnswerChange}
              />
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
          onConfirm={() => { setShowConfirm(false); router.push("/assessment/results"); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </main>
  );
}