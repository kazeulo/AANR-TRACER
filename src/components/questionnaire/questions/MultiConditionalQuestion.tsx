
import { Question } from "@/types/questions";
import { ABHContactPanel } from "../contacts/ABHContactPanel";
import { MultiConditionalAnswer } from "@/types/assessment";

// Multi-Conditional Question
export function MultiConditionalQuestion({
  q, value, onSelectionChange, onItemToggle, expanded, toggleTip
}: {
  q: Question;
  value: MultiConditionalAnswer;
  expanded?: boolean;
  toggleTip?: () => void;
  onSelectionChange: (sel: string) => void;
  onItemToggle: (item: string) => void;
}) {
  const yesOption = q.options?.find((o) => o.action === "checklist");
  const noOption = q.options?.find((o) => o.action === "contacts");

  return (
    <div className="bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] rounded-2xl overflow-visible transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-[14px] text-[var(--color-text-gray)] font-light leading-relaxed">
            {q.questionText}
          </p>

          {q.toolTip && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTip?.();
              }}
              className="flex-shrink-0 w-5 h-5 rounded-full border border-[var(--color-border-input)] text-[12px] flex items-center justify-center text-[var(--color-text-faintest)] hover:bg-[var(--color-bg-subtle)] transition"
            >
              +
            </button>
          )}
        </div>

        {q.toolTip && expanded && (
          <div className="mb-4 text-[13px] text-[var(--color-text-light-gray)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-lg p-3 leading-relaxed transition-all duration-300">
            {q.toolTip}

            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-[12px] text-[#4aa35a] hover:underline underline-offset-2 font-medium"
            >
              Learn more
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        )}

        <div className="relative mb-4">
          <select
            value={value.selection}
            onChange={(e) => onSelectionChange(e.target.value)}
            className="w-full appearance-none bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-3 text-[14px] text-[var(--color-text)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
          >
            <option value="">Select an option…</option>
            {q.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faintest)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {value.selection === "no" && noOption?.contactLabel && <ABHContactPanel />}

        {value.selection === "yes" && yesOption?.items && (
          <div className="space-y-2.5 mt-1">
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-text-faintest)] mb-2">
              Select all that apply
            </p>
            {yesOption.items.map((item) => {
              const checked = value.checkedItems.includes(item.text);
              return (
                <label
                  key={item.text}
                  className={`flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border transition-all duration-200 ${
                    checked
                      ? "bg-[var(--color-accent)]/[0.05] border-[#4aa35a]/40"
                      : "bg-[var(--color-bg-subtle)] border-[var(--color-border-input)] hover:border-[#4aa35a]/30"
                  }`}
                >
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input type="checkbox" checked={checked} onChange={() => onItemToggle(item.text)} className="peer sr-only" />
                    <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 ${
                      checked ? "bg-[var(--color-accent)] border-[#4aa35a]" : "bg-[var(--color-bg-card)] border-[#c8c3b8]"
                    }`}>
                      {checked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={`text-[13px] leading-relaxed ${checked ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-text-gray)] font-light"}`}>
                    {item.text}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {value.selection === "exempt" && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-[13px] text-blue-800 font-light leading-relaxed">
            This requirement is exempted for privately funded technologies.
          </div>
        )}
      </div>
    </div>
  );
}