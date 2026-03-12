"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DataPrivacyNotice() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  return (
    <main className="font-['DM Sans'] min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-6 lg:px-[6vw] py-20 flex flex-col justify-center">
      <div className="max-w-[900px] mx-auto w-full">

        {/* Page title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[var(--color-accent)]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            Data Privacy Notice
          </div>

          <h1 className="font-['DM_Serif_Display'] text-[clamp(28px,4vw,42px)] text-[var(--color-primary)] leading-tight tracking-tight mb-3">
            Your data stays with you
          </h1>
          <p className="text-[14px] text-[var(--color-text-faint)] font-light max-w-sm mx-auto leading-relaxed">
            Please read the following before proceeding with the assessment.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)] mb-8">

          {/* Card header */}
          <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[var(--color-bg-subtle)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-accent)]">
              AANR-TRACER · Data Privacy Notice
            </span>
          </div>

          {/* Card body */}
          <div className="px-7 py-8 space-y-5">
            <p className="text-[15px] leading-[1.85] text-[var(--color-text-gray)] font-light text-justify">
              No information disclosed, entered, or encoded by the user while using this application is stored on any 
              platform, nor is it accessible to the application developer.
            </p>
            <div className="h-px bg-[#f0ece3]" />
            <p className="text-[15px] leading-[1.85] text-[var(--color-text-gray)] font-light text-justify">
              Data storage occurs only if the user voluntarily chooses to download or send a copy of their responses to a 
              specified email address for their own intended purpose. In such cases, the responsibility for saving and handling 
              the data rests solely with the user.
            </p>
          </div>
        </div>

        {/* Checkbox + CTA */}
        <div className="flex flex-col items-center gap-5">
          <label className="flex items-start gap-3 cursor-pointer group max-w-md">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={accepted}
                onChange={e => setAccepted(e.target.checked)}
                className="peer sr-only"
              />
              <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 ${
                accepted
                  ? "bg-[var(--color-accent)] border-[#4aa35a]"
                  : "bg-[var(--color-bg-card)] border-[#c8c3b8] group-hover:border-[#4aa35a]/60"
              }`}>
                {accepted && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[14px] text-[var(--color-text-gray)] font-light leading-snug">
              I have read and understood the information above and wish to proceed with the assessment
            </span>
          </label>

          <button
            onClick={() => router.push("/assessment/name")}
            disabled={!accepted}
            className={`inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[15px] font-semibold text-white transition-all duration-300 ${
              accepted
                ? "bg-[var(--color-accent)] shadow-[0_8px_32px_rgba(74,163,90,0.35)] hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(74,163,90,0.45)]"
                : "bg-[#c8c3b8] cursor-not-allowed"
            }`}
          >
            Proceed to Assessment
            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${accepted ? "bg-[var(--color-bg-card)]/20" : "bg-[var(--color-bg-card)]/10"}`}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

          {!accepted && (
            <p className="text-[12px] text-[var(--color-text-faintest)] font-light">
              Please check the box above to continue
            </p>
          )}
        </div>

      </div>
    </main>
  );
}