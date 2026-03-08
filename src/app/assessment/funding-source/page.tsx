"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";

const fundingOptions = [
  { value: "Government", icon: "🏛️", desc: "Funded by a government agency, department, or program" },
  { value: "Private",    icon: "🏢", desc: "Funded by private individuals, companies, or investors" },
  { value: "Not funded yet", icon: "🌱", desc: "Currently self-funded or still seeking funding" },
];

export default function FundingSourcePage() {
  const { data, updateData } = useAssessment();
  const router = useRouter();

  const isValid = !!data.fundingSource;

  return (
    <main className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] text-[#1a1a1a] px-6 lg:px-[6vw] py-20 flex flex-col justify-center">
      <div className="max-w-[760px] mx-auto w-full">

        {/* Eyebrow */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
            Step 4 — Funding Source
          </div>
        </div>

        {/* Title */}
        <h1 className="font-['DM_Serif_Display',serif] text-[clamp(28px,4vw,42px)] text-[#0f2e1a] leading-tight tracking-tight text-center mb-4">
          Who is funding your <em className="text-[#4aa35a]">technology?</em>
        </h1>
        <p className="text-[14px] text-[#8a9a94] font-light text-center max-w-sm mx-auto leading-relaxed mb-12">
          Indicate the primary source of funding. This helps us understand the background and support behind your innovation.
        </p>

        {/* Options card */}
        <div className="bg-white border border-[#ede9e0] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)] mb-4">

          {/* Card header */}
          <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[#f8f6f1]">
            <span className="w-2 h-2 rounded-full bg-[#4aa35a] flex-shrink-0" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">
              Funding Source
            </span>
          </div>

          {/* Option buttons */}
          <div className="px-7 py-6 flex flex-col gap-3">
            {fundingOptions.map(({ value, icon, desc }) => {
              const selected = data.fundingSource === value;
              return (
                <button
                  key={value}
                  onClick={() => updateData({ fundingSource: value })}
                  className={`flex items-center gap-4 w-full px-5 py-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selected
                      ? "border-[#4aa35a] bg-[#4aa35a]/[0.06]"
                      : "border-[#e5e1d8] bg-[#f8f6f1] hover:border-[#4aa35a]/40 hover:bg-[#4aa35a]/[0.03]"
                  }`}
                >
                  <span className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px] flex-shrink-0 transition-colors ${
                    selected ? "bg-[#4aa35a]/15" : "bg-white"
                  }`}>
                    {icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[14px] font-semibold leading-snug ${selected ? "text-[#0f2e1a]" : "text-[#4a5568]"}`}>
                      {value}
                    </div>
                    <div className="text-[12px] text-[#94a3a0] font-light mt-0.5">{desc}</div>
                  </div>
                  {/* Radio indicator */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selected ? "border-[#4aa35a] bg-[#4aa35a]" : "border-[#c8c3b8] bg-white"
                  }`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => router.push("/assessment/description")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a] transition-all duration-200"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M5 8L2 5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>

          <button
            onClick={() => isValid && router.push("/assessment/questionnaire")}
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