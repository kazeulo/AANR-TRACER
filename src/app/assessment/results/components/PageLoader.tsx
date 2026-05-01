import { useEffect, useState } from "react";

export function PageLoader() {

  const steps = [
    "Calculating your TRACER Level score\u2026",
    "Analysing your assessment answers\u2026",
    "Generating your personalised roadmap\u2026",
    "Preparing your commercialization steps\u2026",
    "Almost ready\u2026",
  ];

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => Math.min(i + 1, steps.length - 1)), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 max-w-xs text-center">

        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#4aa35a]/15" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#4aa35a] animate-spin" />
          <div className="absolute inset-[6px] rounded-full bg-[#4aa35a]/[0.06] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4aa35a"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
            </svg>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-500"
              style={{ backgroundColor: i <= idx ? "#4aa35a" : "#d1d5db" }} />
          ))}
        </div>

        <p className="text-[13px] text-[#6b7a75] font-light transition-all duration-500">
          {steps[idx]}
        </p>
      </div>
    </div>
  );
}