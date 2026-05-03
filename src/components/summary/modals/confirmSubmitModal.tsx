// Confirm Submit Modal 
export function ConfirmSubmitModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0a1f10]/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[420px] z-10 overflow-hidden">
        <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#e8e4db] bg-[#f8f5f0]">
          <span className="w-2 h-2 rounded-full bg-[#2d7a3a] flex-shrink-0" />
          <span className="text-[12px] font-bold tracking-[2px] uppercase text-[#2d7a3a]">Confirm Submission</span>
          <button onClick={onCancel} className="ml-auto w-7 h-7 rounded-full bg-[#e8e4db] hover:bg-[#ddd8ce] flex items-center justify-center text-[#4a5568] transition-colors">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-7 py-7">
          <h2 className="font-['DM_Serif_Display',serif] text-[24px] text-[#0f2e1a] mb-2">Ready to submit?</h2>
          <p className="text-[14px] text-[#4a5568] font-light mb-7 leading-relaxed">
            Your TRACER Level score will be calculated from your answers. Make sure everything looks right before proceeding.
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-3 rounded-full text-[14px] font-medium text-[#4a5568] bg-white border border-[#d0ccc4] hover:border-[#0f2e1a]/40 hover:text-[#0f2e1a] transition-all">
              Not yet
            </button>
            <button onClick={onConfirm} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[14px] font-semibold text-white bg-[#2d7a3a] shadow-[0_6px_24px_rgba(45,122,58,0.35)] hover:bg-[#245f2e] transition-all">
              Yes, submit
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}