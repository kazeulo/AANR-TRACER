"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";
import { useState } from "react";

export default function TechnologyDescriptionPage() {
  const { data, updateData } = useAssessment();
  const router = useRouter();
  const maxWords = 200;

  const [wordCount, setWordCount] = useState<number>(
    data.technologyDescription.trim()
      ? data.technologyDescription.trim().split(/\s+/).length
      : 0
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) {
      updateData({ technologyDescription: text });
      setWordCount(words.length);
    }
  };

  const isValid = !!data.technologyDescription.trim();
  const isFull = wordCount >= maxWords;
  const pct = Math.min((wordCount / maxWords) * 100, 100);

  return (
    <main className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] text-[#1a1a1a] px-6 lg:px-[6vw] py-20 flex flex-col justify-center">
      <div className="max-w-[760px] mx-auto w-full">

        {/* Eyebrow */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
            Step 3 — Description
          </div>
        </div>

        {/* Title */}
        <h1 className="font-['DM_Serif_Display',serif] text-[clamp(28px,4vw,42px)] text-[#0f2e1a] leading-tight tracking-tight text-center mb-4">
          Describe your <em className="text-[#4aa35a]">technology</em>
        </h1>
        <p className="text-[14px] text-[#8a9a94] font-light text-center max-w-sm mx-auto leading-relaxed mb-12">
          A brief description helps us understand your innovation and tailor the assessment questions to your context.
        </p>

        {/* Textarea card */}
        <div className="bg-white border border-[#ede9e0] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)] mb-4">

          {/* Card header */}
          <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[#f8f6f1]">
            <span className="w-2 h-2 rounded-full bg-[#4aa35a] flex-shrink-0" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">
              Technology Description
            </span>
          </div>

          {/* Textarea */}
          <div className="px-7 py-7">
            <textarea
              value={data.technologyDescription}
              onChange={handleChange}
              placeholder="Briefly describe what your technology does, how it works, and who it's intended for…"
              rows={6}
              className="w-full bg-[#f8f6f1] border border-[#e5e1d8] rounded-xl px-4 py-3.5 text-[15px] text-[#1a1a1a] placeholder-[#b0a99e] font-light resize-none focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all leading-relaxed"
            />

            {/* Word count bar */}
            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="flex-1 h-1 bg-[#e5e1d8] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${isFull ? "bg-amber-400" : "bg-[#4aa35a]"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`text-[12px] font-medium flex-shrink-0 ${isFull ? "text-amber-500" : "text-[#94a3a0]"}`}>
                {wordCount} / {maxWords} words
              </span>
            </div>

            {isFull && (
              <p className="text-[12px] text-amber-500 font-light mt-2">
                Word limit reached. Please keep your description concise.
              </p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => router.push("/assessment/type")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a] transition-all duration-200"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M5 8L2 5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>

          <button
            onClick={() => isValid && router.push("/assessment/funding-source")}
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