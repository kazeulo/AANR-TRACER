"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";

export default function TechnologyNamePage() {
  const { data, updateData } = useAssessment();
  const router = useRouter();

  const isValid = data.technologyName.trim().length > 0;

  const handleNext = () => {
    if (!isValid) return;
    router.push("/assessment/type");
  };

  return (
    <main className="font-['DM Sans'] min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-6 lg:px-[6vw] py-20 flex flex-col justify-center">
      <div className="max-w-[760px] mx-auto w-full">

        {/* Eyebrow */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-accent)] px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[var(--color-accent)]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            Step 1 — Technology Details
          </div>
        </div>

        {/* Title */}
        <h1 className="font-['DM_Serif_Display'] text-[clamp(28px,4vw,42px)] text-[var(--color-primary)] leading-tight tracking-tight text-center mb-4">
          Tell us about your <em className="text-[var(--color-accent)]">technology</em>
        </h1>
        <p className="text-[14px] text-[var(--color-text-faint)] font-light text-center max-w-sm mx-auto leading-relaxed mb-12">
          Provide some basic details about your innovation. This helps us tailor the assessment and give you relevant recommendations.
        </p>

        {/* Input card */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)] mb-4">

          {/* Card header */}
          <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[var(--color-bg-subtle)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-accent)]">
              Technology Name
            </span>
          </div>

          {/* Input */}
          <div className="px-7 py-7">
            <input
              type="text"
              value={data.technologyName}
              onChange={e => updateData({ technologyName: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleNext()}
              placeholder="e.g. Solar-Powered Tilapia Feeder"
              className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-3.5 text-[15px] text-[var(--color-text)] placeholder-[#b0a99e] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all"
            />
            <p className="text-[12px] text-[var(--color-text-faintest)] font-light mt-3 leading-relaxed">
              Keep it short and clear. A working or temporary name is fine if you haven't decided on a final one yet.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <button
            onClick={handleNext}
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

          {!isValid && (
            <p className="text-[12px] text-[var(--color-text-faintest)] font-light">
              Enter a technology name to continue
            </p>
          )}
        </div>

      </div>
    </main>
  );
}