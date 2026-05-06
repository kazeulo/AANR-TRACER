import { useState } from "react";
import { ConfirmChangeModal } from "@/components/summary/modals/confirmChangeModal";
import type { Question } from "@/types/questions";

interface Props {
  q: Question;
  answer: unknown;
  onChangeRequest: (q: Question, newValue: unknown) => void;
}

export function CheckboxRow({ q, answer, onChangeRequest }: Props) {
  const checked = answer === true;
  const [pendingValue, setPendingValue] = useState<unknown>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const requestChange = (val: unknown) => { setPendingValue(val); setShowConfirm(true); };
  const confirmChange = () => { onChangeRequest(q, pendingValue); setShowConfirm(false); setPendingValue(null); };
  const cancelChange  = () => { setShowConfirm(false); setPendingValue(null); };

  return (
    <>
      {showConfirm && <ConfirmChangeModal questionText={q.questionText} onConfirm={confirmChange} onCancel={cancelChange} />}
      <li className="flex items-start gap-3 py-3 group">
        <button
          onClick={() => requestChange(!checked)}
          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${
            checked ? "bg-[#2d7a3a] border-[#2d7a3a]" : "bg-white border-[#b0a99e] hover:border-[#2d7a3a]/60"
          }`}
        >
          {checked ? (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#b0a99e" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <span className={`flex-1 text-[14px] leading-relaxed ${checked ? "text-[#1a2e1e] font-normal" : "text-[#7a756d]"}`}>
          {q.questionText}
        </span>
        <span className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[#94a3a0] font-light mt-0.5 whitespace-nowrap">
          click to edit
        </span>
      </li>
    </>
  );
}