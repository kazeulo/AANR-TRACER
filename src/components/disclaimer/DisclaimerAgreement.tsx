"use client";

// Checkbox agreement and continue button.
// Accepts onContinue so the parent page controls navigation.

interface DisclaimerAgreementProps {
  agreed:      boolean;
  onToggle:    () => void;
  onContinue:  () => void;
}

export function DisclaimerAgreement({
  agreed,
  onToggle,
  onContinue,
}: DisclaimerAgreementProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <label className="flex items-start gap-3 cursor-pointer group max-w-md">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={onToggle}
            className="peer sr-only"
          />
          <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 ${
            agreed
              ? "bg-[var(--color-accent)] border-[#4aa35a]"
              : "bg-[var(--color-bg-card)] border-[#c8c3b8] group-hover:border-[#4aa35a]/60"
          }`}>
            {agreed && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
        <span className="text-[14px] text-[var(--color-text-gray)] font-light leading-snug">
          I have read and understood the information above and confirm that my technology is intended for commercialization
        </span>
      </label>

      <button
        onClick={onContinue}
        disabled={!agreed}
        className={`inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[15px] font-semibold text-white transition-all duration-300 ${
          agreed
            ? "bg-[var(--color-accent)] shadow-[0_8px_32px_rgba(74,163,90,0.35)] hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(74,163,90,0.45)]"
            : "bg-[#c8c3b8] cursor-not-allowed"
        }`}
      >
        Continue
        <span className={`w-5 h-5 rounded-full flex items-center justify-center ${
          agreed ? "bg-[var(--color-bg-card)]/20" : "bg-[var(--color-bg-card)]/10"
        }`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {!agreed && (
        <p className="text-[12px] text-[var(--color-text-faint)] font-light">
          Please check the box above to continue
        </p>
      )}
    </div>
  );
}