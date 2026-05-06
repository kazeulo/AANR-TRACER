"use client";

// Thin orchestrator — owns only state and navigation.
// All visual blocks live in their own components.

import { useState }              from "react";
import { useRouter }             from "next/navigation";
import { DisclaimerCard }        from "@/components/disclaimer/DisclaimerCard";
import { DisclaimerAgreement }   from "@/components/disclaimer/DisclaimerAgreement";

export default function DisclaimerPage() {
  const [agreed, setAgreed] = useState(false);
  const router              = useRouter();

  return (
    <main className="font-['DM Sans'] min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-6 lg:px-[6vw] py-20 flex flex-col justify-center">
      <div className="max-w-[900px] mx-auto w-full">

        {/* Page title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[var(--color-accent)]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            Disclaimer
          </div>
          <h1 className="text-[clamp(28px,4vw,42px)] text-[var(--color-primary)] leading-tight tracking-tight mb-3">
            Before you begin
          </h1>
          <p className="text-[14px] text-[var(--color-text-faint)] font-light max-w-sm mx-auto leading-relaxed">
            Please read the following important information before proceeding with the assessment.
          </p>
        </div>

        {/* Disclaimer text with inline tooltips */}
        <DisclaimerCard />

        {/* User manual banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8">
          <p className="text-[13px] text-amber-800 font-light leading-[1.7]">
            Not sure if your technology qualifies? Check the{" "}
            <a
              href="https://drive.google.com/file/d/1baQGFaAyWe0yONORw3aArAEctstu1kHi/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2 hover:text-amber-900 transition-colors"
            >
              User Manual
            </a>{" "}
            to determine if this tool is appropriate for your use case.
          </p>
        </div>

        <div className="h-px bg-[#e5e1d8] mb-8" />

        {/* Checkbox + continue button */}
        <DisclaimerAgreement
          agreed={agreed}
          onToggle={() => setAgreed(v => !v)}
          onContinue={() => router.push("/assessment/data-privacy")}
        />

      </div>
    </main>
  );
}