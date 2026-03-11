"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";
import { useEffect, useState } from "react";

export default function TechnologyTypePage() {
  const { data, updateData } = useAssessment();
  const router = useRouter();
  const [technologyTypes, setTechnologyTypes] = useState<string[]>([]);

  useEffect(() => {
    const loadTypes = async () => {
      const res = await fetch("/questions.json");
      const grouped: Record<string, unknown> = await res.json();
      setTechnologyTypes(Object.keys(grouped));
    };
    loadTypes();
  }, []);

  const isValid = !!data.technologyType;

  return (
    <main className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] text-[#1a1a1a] px-6 lg:px-[6vw] py-20 flex flex-col justify-center">
      <div className="max-w-[760px] mx-auto w-full">

        {/* Eyebrow */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
            Step 2 — Technology Type
          </div>
        </div>

        {/* Title */}
        <h1 className="font-['DM_Serif_Display',serif] text-[clamp(28px,4vw,42px)] text-[#0f2e1a] leading-tight tracking-tight text-center mb-4">
          Select your <em className="text-[#4aa35a]">technology type</em>
        </h1>
        <p className="text-[14px] text-[#8a9a94] font-light text-center max-w-sm mx-auto leading-relaxed mb-12">
          This helps us tailor the questionnaire and provide relevant recommendations based on your innovation's category.
        </p>

        {/* Select card */}
        <div className="bg-white border border-[#ede9e0] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)] mb-4">

          {/* Card header */}
          <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[#f8f6f1]">
            <span className="w-2 h-2 rounded-full bg-[#4aa35a] flex-shrink-0" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">
              Technology Type
            </span>
          </div>

          {/* Select input */}
          <div className="px-7 py-7">
            <div className="relative">
              <select
                value={data.technologyType}
                onChange={e => updateData({ technologyType: e.target.value })}
                className="w-full appearance-none bg-[#f8f6f1] border border-[#e5e1d8] rounded-xl px-4 py-3.5 text-[15px] text-[#1a1a1a] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
              >
                <option value="">Select a technology type…</option>
                {technologyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {/* Custom chevron */}
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3a0]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <p className="text-[12px] text-[#94a3a0] font-light mt-3 leading-relaxed">
              Not sure which category fits? View detailed descriptions and examples in the{" "}
              <a href="/terms" className="text-[#4aa35a] underline underline-offset-2 hover:text-[#3d8f4c] transition-colors font-medium">
                Terms & Definitions
              </a>{" "}
              page.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => router.push("/assessment/name")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a] transition-all duration-200"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M5 8L2 5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>

          <button
            onClick={() => isValid && router.push("/assessment/description")}
            disabled={!isValid}
            className={`inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[15px] font-semibold text-white transition-all duration-300 ${
              isValid
                ? "bg-[#4aa35a] shadow-[0_8px_32px_rgba(74,163,90,0.35)] hover:bg-[#3d8f4c] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(74,163,90,0.45)]"
                : "bg-[#c8c3b8] cursor-not-allowed"
            }`}
          >
            Continue
            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${isValid ? "bg-white/20" : "bg-white/10"}`}>
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