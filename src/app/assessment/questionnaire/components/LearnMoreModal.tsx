"use client";

interface Question {
  id: string;
  questionText: string;
  trlLevel: number;
  technologyType: string;
  category: string;
  toolTip?: string;
  expandedToolTip?: string;
  type?: "checkbox" | "dropdown" | "multi-conditional";
}

interface LearnMoreModalProps {
  q: Question;
  onClose: () => void;
}

export function LearnMoreModal({ q, onClose }: LearnMoreModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-[#ede9e0] rounded-2xl w-full max-w-[480px] overflow-hidden shadow-[0_20px_60px_rgba(15,46,26,0.15)]">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4 border-b border-[#f0ede6]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#4aa35a]/[0.08] border border-[#4aa35a]/25 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4aa35a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#4aa35a] mb-0.5">Definition</p>
              <p className="text-[15px] font-semibold text-[#0f2e1a] leading-snug">{q.questionText}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#f5f2ec] border border-[#ede9e0] flex items-center justify-center text-[#94a3a0] hover:text-[#0f2e1a] transition-colors flex-shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-[14px] text-[#2d3748] leading-[1.75] mb-4 text-justify">{q.expandedToolTip}</p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#4aa35a] text-white text-[13px] font-semibold hover:bg-[#3d8f4c] transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
}