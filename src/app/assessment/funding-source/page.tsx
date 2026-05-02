"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "@/contexts/AssessmentContext";

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
    <main className="font-['DM Sans'] min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-6 lg:px-[6vw] py-20 flex flex-col justify-center">
      <div className="max-w-[900px] mx-auto w-full">

        {/* Eyebrow */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-accent)] px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[var(--color-accent)]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            Step 4 — Funding Source
          </div>
        </div>

        {/* Title */}
        <h1 className=" text-[clamp(28px,4vw,42px)] text-[var(--color-primary)] leading-tight tracking-tight text-center mb-4">
          Who is funding your <em className="text-[var(--color-accent)]">technology?</em>
        </h1>
        <p className="text-[14px] text-[var(--color-text-light-gray)] font-light text-center max-w-sm mx-auto leading-relaxed mb-12">
          Indicate the primary source of funding. This helps us understand the background and support behind your innovation.
        </p>

        {/* Options card */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)] mb-4">

          {/* Card header */}
          <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[var(--color-bg-subtle)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-accent)]">
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
                      ? "border-[#4aa35a] bg-[var(--color-accent)]/[0.06]"
                      : "border-[var(--color-border-input)] bg-[var(--color-bg-subtle)] hover:border-[#4aa35a]/40 hover:bg-[var(--color-accent)]/[0.03]"
                  }`}
                >
                  <span className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px] flex-shrink-0 transition-colors ${
                    selected ? "bg-[var(--color-accent)]/15" : "bg-[var(--color-bg-card)]"
                  }`}>
                    {icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[14px] font-semibold leading-snug ${selected ? "text-[var(--color-primary)]" : "text-[var(--color-text-gray)]"}`}>
                      {value}
                    </div>
                    <div className="text-[12px] text-[var(--color-text-gray)] font-light mt-0.5">{desc}</div>
                  </div>
                  {/* Radio indicator */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selected ? "border-[#4aa35a] bg-[var(--color-accent)]" : "border-[#c8c3b8] bg-[var(--color-bg-card)]"
                  }`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-[var(--color-bg-card)]" />}
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-[var(--color-bg-card)] border border-[var(--color-border-input)] hover:border-[#0f2e1a]/30 hover:text-[var(--color-primary)] transition-all duration-200"
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
                ? "bg-[var(--color-accent)] shadow-[0_8px_32px_rgba(74,163,90,0.35)] hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(74,163,90,0.45)]"
                : "bg-[#c8c3b8] cursor-not-allowed"
            }`}
          >
            Continue
            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${isValid ? "bg-[var(--color-bg-card)]/20" : "bg-[var(--color-bg-card)]/10"}`}>
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