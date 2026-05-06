import { useState } from "react";
import { ConfirmChangeModal } from "@/components/summary/modals/confirmChangeModal";
import type { Question } from "@/types/questions";

interface Props {
  q: Question;
  answer: unknown;
  onChangeRequest: (q: Question, newValue: unknown) => void;
}

export function DropdownRow({ q, answer, onChangeRequest }: Props) {
  const raw      = answer as string | null | undefined;
  const selected = raw ? (q.options?.find(o => o.value === raw)?.label ?? raw) : null;
  const [pendingValue, setPendingValue] = useState<unknown>(null);
  const [showConfirm, setShowConfirm]   = useState(false);

  const requestChange = (val: unknown) => { setPendingValue(val); setShowConfirm(true); };
  const confirmChange = () => { onChangeRequest(q, pendingValue); setShowConfirm(false); setPendingValue(null); };
  const cancelChange  = () => { setShowConfirm(false); setPendingValue(null); };

  return (
    <>
      {showConfirm && <ConfirmChangeModal questionText={q.questionText} onConfirm={confirmChange} onCancel={cancelChange} />}
      <li className="py-3.5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center ${
            selected ? "bg-[#2d7a3a] border-[#2d7a3a]" : "bg-white border-[#b0a99e]"
          }`}>
            {selected ? (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
                <path d="M1 1h6" stroke="#b0a99e" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[14px] leading-relaxed ${selected ? "text-[#1a2e1e] font-normal" : "text-[#7a756d]"}`}>
              {q.questionText}
            </p>
            {selected ? (
              <span className="inline-flex items-center gap-1.5 mt-1.5 text-[12px] font-semibold text-[#2d7a3a] bg-[#2d7a3a]/[0.08] border border-[#2d7a3a]/25 px-2.5 py-0.5 rounded-full">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="3" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2.5 4l1 1 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {selected}
              </span>
            ) : (
              <span className="inline-block mt-1.5 text-[12px] font-light text-[#94a3a0] italic">No selection made</span>
            )}
          </div>
        </div>

        {q.options && q.options.length > 0 && (
          <div className="ml-8 space-y-1.5">
            <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#6b7a75] mb-2">Available options:</p>
            {q.options.map(opt => {
              const isSelected = raw === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => !isSelected && requestChange(opt.value)}
                  disabled={isSelected}
                  className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px] transition-all ${
                    isSelected
                      ? "bg-[#2d7a3a]/[0.08] border-[#2d7a3a]/30 text-[#1a5c2a] font-semibold cursor-default"
                      : "bg-[#f8f5f0] border-[#e0dbd3] text-[#3d3d3d] hover:border-[#2d7a3a]/40 hover:bg-[#2d7a3a]/[0.04] cursor-pointer"
                  }`}
                >
                  <span className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-[#2d7a3a] bg-[#2d7a3a]" : "border-[#b0a99e]"
                  }`}>
                    {isSelected && (
                      <svg width="6" height="5" viewBox="0 0 6 5" fill="none">
                        <path d="M0.5 2.5l1.5 1.5 3.5-3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                  {!isSelected && <span className="ml-auto text-[11px] text-[#94a3a0]">select</span>}
                </button>
              );
            })}
          </div>
        )}
      </li>
    </>
  );
}