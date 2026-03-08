"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import { useAssessment } from "../AssessmentContext";
import { categoryOrder } from "../../utils/helperConstants";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  questionText: string;
  trlLevel: string;
  technologyType: string;
  category: string;
}

export default function SummaryPage() {
  const { data, updateData, lastCategoryIndex, lastPage } = useAssessment();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadCSV = async () => {
      const res = await fetch("/questions.csv");
      const csvText = await res.text();
      const result = Papa.parse<Omit<Question, "id">>(csvText, { header: true, skipEmptyLines: true });
      const filtered = result.data.filter(q => q.technologyType === data.technologyType);
      const withIds: Question[] = filtered.map((item, index) => ({ ...item, id: `${item.category}-${index}` }));
      setQuestions(withIds);
      setLoading(false);
    };
    loadCSV();
  }, [data.technologyType]);

  const handleSubmit = () => {
    router.push("/assessment/results");
  };

  if (loading) {
    return (
      <div className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#4aa35a]/30 border-t-[#4aa35a] animate-spin" />
          <p className="text-[14px] text-[#94a3a0] font-light">Loading summary…</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.values(data.answers).filter(Boolean).length;
  const totalCount = questions.length;

  return (
    <main className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] text-[#1a1a1a] px-6 lg:px-[6vw] py-16">
      <div className="max-w-[860px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] mb-4 px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
            Final Step — Review & Submit
          </div>
          <h1 className="font-['DM_Serif_Display',serif] text-[clamp(28px,4vw,42px)] text-[#0f2e1a] leading-tight tracking-tight mb-3">
            Review your <em className="text-[#4aa35a]">responses</em>
          </h1>
          <p className="text-[14px] text-[#8a9a94] font-light leading-relaxed max-w-xl">
            Please carefully review your answers and technology details before submitting. You can edit inline if needed.
          </p>
        </div>

        {/* Amber notice */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8">
          <span className="text-amber-500 flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <p className="text-[13px] text-amber-800 font-light leading-relaxed">
            Submitting will calculate your TRL score. Make sure all answers reflect your technology's current state.
          </p>
        </div>

        {/* ── Technology Info Card ── */}
        <div className="bg-white border border-[#ede9e0] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)] mb-6">
          <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[#f8f6f1]">
            <span className="w-2 h-2 rounded-full bg-[#4aa35a] flex-shrink-0" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">Technology Details</span>
          </div>

          <div className="px-7 py-6 space-y-5">

            {/* Technology Name */}
            <div>
              <label className="block text-[11px] font-bold tracking-[1.5px] uppercase text-[#94a3a0] mb-2">
                Technology Name
              </label>
              <input
                type="text"
                value={data.technologyName}
                onChange={e => updateData({ technologyName: e.target.value })}
                className="w-full bg-[#f8f6f1] border border-[#e5e1d8] rounded-xl px-4 py-3 text-[14px] text-[#1a1a1a] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all"
              />
            </div>

            {/* Technology Type */}
            <div>
              <label className="block text-[11px] font-bold tracking-[1.5px] uppercase text-[#94a3a0] mb-2">
                Technology Type
              </label>
              <div className="relative">
                <select
                  value={data.technologyType}
                  onChange={e => updateData({ technologyType: e.target.value })}
                  className="w-full appearance-none bg-[#f8f6f1] border border-[#e5e1d8] rounded-xl px-4 py-3 text-[14px] text-[#1a1a1a] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
                >
                  <option value="">Select Technology Type</option>
                  <option value="New Animal Breed (Aquatic and Terrestrial)">New Animal Breed (Aquatic and Terrestrial)</option>
                  <option value="Crop Variety / Plant Technology">Crop Variety / Plant Technology</option>
                  <option value="Machinery / Equipment">Machinery / Equipment</option>
                  <option value="ICT (Apps and System involving IoT)">ICT (Apps and System involving IoT)</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3a0]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Funding Source */}
            <div>
              <label className="block text-[11px] font-bold tracking-[1.5px] uppercase text-[#94a3a0] mb-2">
                Funding Source
              </label>
              <div className="relative">
                <select
                  value={data.fundingSource}
                  onChange={e => updateData({ fundingSource: e.target.value })}
                  className="w-full appearance-none bg-[#f8f6f1] border border-[#e5e1d8] rounded-xl px-4 py-3 text-[14px] text-[#1a1a1a] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
                >
                  <option value="">Select Funding Source</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Not Funded Yet">Not Funded Yet</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3a0]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Answers summary ── */}
        <div className="space-y-4 mb-10">
          {categoryOrder.map(category => {
            const categoryQuestions = questions.filter(q => q.category === category);
            if (categoryQuestions.length === 0) return null;

            const checkedCount = categoryQuestions.filter(q => data.answers[q.id]).length;

            return (
              <div key={category} className="bg-white border border-[#ede9e0] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,46,26,0.04)]">

                {/* Category header */}
                <div className="flex items-center justify-between gap-3 px-7 py-4 border-b border-[#f5f2ec] bg-[#f8f6f1]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#4aa35a] flex-shrink-0" />
                    <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">{category}</span>
                  </div>
                  <span className="text-[11px] text-[#94a3a0] font-light flex-shrink-0">
                    {checkedCount} / {categoryQuestions.length} checked
                  </span>
                </div>

                {/* Questions */}
                <ul className="px-7 py-4 space-y-2.5">
                  {categoryQuestions.map(q => {
                    const checked = data.answers[q.id] ?? false;
                    return (
                      <li key={q.id} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-colors ${
                          checked ? "bg-[#4aa35a] border-[#4aa35a]" : "bg-white border-[#e0dbd3]"
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
                        <span className={`text-[13px] leading-relaxed ${checked ? "text-[#1a1a1a] font-light" : "text-[#b0a99e] font-light"}`}>
                          {q.questionText}
                        </span>
                      </li>
                    );
                  })}
                </ul>

              </div>
            );
          })}
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a] transition-all duration-200"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M5 8L2 5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>

          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[15px] font-semibold text-white bg-[#4aa35a] shadow-[0_8px_32px_rgba(74,163,90,0.35)] hover:bg-[#3d8f4c] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(74,163,90,0.45)] transition-all duration-300"
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
    </main>
  );
}