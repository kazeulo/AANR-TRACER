import { useState } from "react";
import { ConfirmChangeModal } from "@/components/summary/modals/confirmChangeModal";
import type { MultiConditionalAnswer } from "@/types/assessment";
import type { Question } from "@/types/questions";

interface Props {
  q: Question;
  answer: unknown;
  onChangeRequest: (q: Question, newValue: unknown) => void;
}

export function MultiConditionalRow({ q, answer, onChangeRequest }: Props) {
  const mc         = (answer as MultiConditionalAnswer | undefined) ?? { selection: "", checkedItems: [] };
  const selOpt     = q.options?.find(o => o.value === mc.selection);
  const selLabel   = selOpt?.label ?? mc.selection;
  const isPositive = mc.selection === "yes" || mc.selection === "exempt";
  const yesOption  = q.options?.find(o => o.value === "yes");

  const [pendingValue, setPendingValue] = useState<unknown>(null);
  const [showConfirm, setShowConfirm]   = useState(false);

  const requestChange = (val: unknown) => { setPendingValue(val); setShowConfirm(true); };
  const confirmChange = () => { onChangeRequest(q, pendingValue); setShowConfirm(false); setPendingValue(null); };
  const cancelChange  = () => { setShowConfirm(false); setPendingValue(null); };

  const toggleItem = (item: string) => {
    const updated: MultiConditionalAnswer = {
      selection:    mc.selection,
      checkedItems: mc.checkedItems.includes(item)
        ? mc.checkedItems.filter(i => i !== item)
        : [...mc.checkedItems, item],
    };
    onChangeRequest(q, updated);
  };

  return (
    <>
      {showConfirm && <ConfirmChangeModal questionText={q.questionText} onConfirm={confirmChange} onCancel={cancelChange} />}
      <li className="py-3.5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center ${
            mc.selection
              ? isPositive ? "bg-[#2d7a3a] border-[#2d7a3a]" : "bg-amber-100 border-amber-400"
              : "bg-white border-[#b0a99e]"
          }`}>
            {mc.selection ? (
              isPositive ? (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )
            ) : (
              <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
                <path d="M1 1h6" stroke="#b0a99e" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[14px] leading-relaxed ${mc.selection ? "text-[#1a2e1e] font-normal" : "text-[#7a756d]"}`}>
              {q.questionText}
            </p>
            {mc.selection ? (
              <span className={`inline-block mt-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-full border ${
                isPositive
                  ? "text-[#1a5c2a] bg-[#2d7a3a]/[0.08] border-[#2d7a3a]/25"
                  : "text-amber-800 bg-amber-50 border-amber-300"
              }`}>
                {selLabel}
              </span>
            ) : (
              <span className="inline-block mt-1.5 text-[12px] font-light text-[#94a3a0] italic">Not answered</span>
            )}
          </div>
        </div>

        {q.options && (
          <div className="ml-8 space-y-1.5 mb-3">
            <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#6b7a75] mb-2">Select an option:</p>
            {q.options.map(opt => {
              const isCurrent = mc.selection === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => !isCurrent && requestChange({ selection: opt.value, checkedItems: [] })}
                  disabled={isCurrent}
                  className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px] transition-all ${
                    isCurrent
                      ? "bg-[#2d7a3a]/[0.08] border-[#2d7a3a]/30 text-[#1a5c2a] font-semibold cursor-default"
                      : "bg-[#f8f5f0] border-[#e0dbd3] text-[#3d3d3d] hover:border-[#2d7a3a]/40 hover:bg-[#2d7a3a]/[0.04] cursor-pointer"
                  }`}
                >
                  <span className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    isCurrent ? "border-[#2d7a3a] bg-[#2d7a3a]" : "border-[#b0a99e]"
                  }`}>
                    {isCurrent && (
                      <svg width="6" height="5" viewBox="0 0 6 5" fill="none">
                        <path d="M0.5 2.5l1.5 1.5 3.5-3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                  {!isCurrent && <span className="ml-auto text-[11px] text-[#94a3a0]">select</span>}
                </button>
              );
            })}
          </div>
        )}

        {mc.selection === "yes" && yesOption?.items && yesOption.items.length > 0 && (
          <div className="ml-8 mt-1">
            <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#6b7a75] mb-2">Select all that apply:</p>
            <div className="space-y-1.5">
              {yesOption.items.map(item => {
                const checked = mc.checkedItems.includes(item.text);
                return (
                  <button
                    key={item.text}
                    onClick={() => toggleItem(item.text)}
                    className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px] transition-all ${
                      checked
                        ? "bg-[#2d7a3a]/[0.07] border-[#2d7a3a]/30 text-[#1a5c2a] font-medium"
                        : "bg-[#f8f5f0] border-[#e0dbd3] text-[#3d3d3d] hover:border-[#2d7a3a]/40 hover:bg-[#2d7a3a]/[0.03] cursor-pointer"
                    }`}
                  >
                    <span className={`flex-shrink-0 w-4 h-4 rounded-[4px] border-2 flex items-center justify-center ${
                      checked ? "bg-[#2d7a3a] border-[#2d7a3a]" : "border-[#b0a99e] bg-white"
                    }`}>
                      {checked && (
                        <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span>{item.text}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#94a3a0] mt-2 font-light">
              {mc.checkedItems.length} of {yesOption.items.length} selected — changes apply immediately
            </p>
          </div>
        )}
      </li>
    </>
  );
}