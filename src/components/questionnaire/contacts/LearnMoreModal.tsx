"use client";

interface LearnMoreModalProps {
  title: string;
  body: string;
  onClose: () => void;
}

export function LearnMoreModal({ title, body, onClose }: LearnMoreModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-amber-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100/40 border-b border-amber-100">
          <p className="text-[12px] font-bold tracking-[1.5px] uppercase text-amber-800">About</p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-amber-100 hover:bg-amber-200 transition-colors text-amber-700"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-[16px] font-bold text-amber-900 mb-3">{title}</p>
          <p className="text-[13px] text-amber-800 leading-relaxed text-justify">{body}</p>
        </div>
        <div className="px-6 py-4 border-t border-amber-100 bg-amber-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-[13px] font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}