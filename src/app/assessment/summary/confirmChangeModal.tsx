// Confirm Change Modal 
export function ConfirmChangeModal({
  questionText,
  onConfirm,
  onCancel,
}: {
  questionText: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0a1f10]/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[440px] z-10 overflow-hidden">
        <div className="flex items-center gap-2.5 px-7 py-5 border-b border-amber-200 bg-amber-50">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="text-amber-600 flex-shrink-0">
            <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[12px] font-bold tracking-[2px] uppercase text-amber-700">Confirm Change</span>
          <button onClick={onCancel} className="ml-auto w-7 h-7 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center text-amber-700 transition-colors">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-7 py-6">
          <h2 className="font-['DM_Serif_Display',serif] text-[22px] text-[#0f2e1a] mb-2">Change this answer?</h2>
          <p className="text-[13px] text-[#6b7a75] font-light mb-2 leading-relaxed italic border-l-2 border-[#e8e4db] pl-3">
            "{questionText}"
          </p>
          <p className="text-[13px] text-[#4a5568] font-light mb-6 leading-relaxed">
            Changing this answer may affect your final TRACER Level score.
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-3 rounded-full text-[13px] font-medium text-[#4a5568] bg-white border border-[#d0ccc4] hover:border-[#0f2e1a]/40 transition-all">
              Keep original
            </button>
            <button onClick={onConfirm} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[13px] font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-[0_4px_16px_rgba(217,119,6,0.3)]">
              Yes, change it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}