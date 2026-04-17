"use client";

import { useState, useEffect, useRef } from "react";
import { useFontSize } from "./FontsizeContext";

const STORAGE_KEY = "rrc-fontsize-tooltip-seen";

export default function FontSizeControl() {
  const { scaleIndex, label, canIncrease, canDecrease, increase, decrease, reset } = useFontSize();
  const [open, setOpen] = useState(false);
  const [autoTooltip, setAutoTooltip] = useState(false);
  const isDefault = scaleIndex === 1;
  const ref = useRef<HTMLDivElement>(null);

  // Show tooltip automatically on first visit
  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Small delay so the page has settled before it appears
      const showTimer = setTimeout(() => setAutoTooltip(true), 800);
      // Auto-dismiss after 4 seconds
      const hideTimer = setTimeout(() => {
        setAutoTooltip(false);
        sessionStorage.setItem(STORAGE_KEY, "1");
      }, 4800);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  // Dismiss auto-tooltip immediately if user opens the panel
  function handleOpen() {
    setAutoTooltip(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(true);
  }

  // Close panel on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="fixed left-0 top-3/4 -translate-y-1/2 z-10 flex items-center">

      {/* Collapsed Aa button */}
      {!open && (
        <div className="relative group">
          <button
            onClick={handleOpen}
            aria-label="Open text size panel"
            className="w-8 h-20 rounded-r-xl flex items-center justify-center shadow-xl
                       transition-all duration-200 bg-[var(--color-accent)]"
          >
            <span
              className="text-[12px] font-extrabold tracking-wider select-none text-white drop-shadow"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
            >
              Aa
            </span>
          </button>

          {/* Auto-show tooltip on first visit */}
          <div
            className={`pointer-events-none absolute left-10 top-1/2 -translate-y-1/2
                        transition-all duration-300
                        ${autoTooltip ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"}
                        group-hover:opacity-0`}
          >
            <div className="flex items-center">
              <div className="w-0 h-0
                              border-t-[6px] border-t-transparent
                              border-b-[6px] border-b-transparent
                              border-r-[7px] border-r-[var(--color-primary)]" />
              <div className="bg-[var(--color-primary-mid)] text-[12px] text-white font-medium
                              px-5 py-2 rounded-lg shadow-xl whitespace-nowrap leading-snug">
                Adjust <span className="text-[var(--color-accent)] font-bold">text size</span>
                <br />
                <span className="text-white/60 text-[10px]">Click to expand</span>
              </div>
            </div>
          </div>

          {/* Hover tooltip (always available after first visit) */}
          <div className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
            <div className="flex items-center">
              <div className="w-0 h-0
                              border-t-[6px] border-t-transparent
                              border-b-[6px] border-b-transparent
                              border-r-[7px] border-r-[var(--color-primary)]" />
              <div className="bg-[var(--color-primary-mid)] text-[12px] text-white font-medium
                              px-5 py-2 rounded-lg shadow-xl whitespace-nowrap leading-snug">
                Adjust <span className="text-[var(--color-accent)] font-bold">text size</span>
                <br />
                <span className="text-white/60 text-[10px]">Click to expand</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "w-[138px] opacity-100" : "w-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-3 w-[138px] rounded-r-2xl px-4 py-4
                        shadow-xl border-y border-r border-[var(--color-accent-20)]"
            style={{ background: "var(--color-primary-mid)" }}>

          <p className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-accent)]">Text Size</p>
          <p className="text-[11px] text-white/70 font-light -mt-1">{label}</p>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={decrease}
              disabled={!canDecrease}
              aria-label="Decrease text size"
              className={`flex-1 h-9 rounded-lg border text-[13px] font-bold transition-all duration-150
                ${canDecrease
                  ? "border-[var(--color-accent-20)] text-white hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-15)] hover:text-[var(--color-accent-dark)]"
                  : "border-[var(--color-accent-08)] text-white/40 cursor-not-allowed"
                }`}
            >
              A−
            </button>
            <button
              onClick={increase}
              disabled={!canIncrease}
              aria-label="Increase text size"
              className={`flex-1 h-9 rounded-lg border text-[16px] font-bold transition-all duration-150
                ${canIncrease
                  ? "border-[var(--color-accent-20)] text-white hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-15)] hover:text-[var(--color-accent-dark)]"
                  : "border-[var(--color-accent-08)] text-white/40 cursor-not-allowed"
                }`}
            >
              A+
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map(i => (
              <span
                key={i}
                className={`rounded-full transition-all duration-200 ${
                  i === scaleIndex
                    ? "w-2.5 h-2.5 bg-[var(--color-accent)] shadow-[0_0_6px_var(--color-accent)]"
                    : "w-1.5 h-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>

          {!isDefault && (
            <button
              onClick={reset}
              aria-label="Reset text size"
              className="w-full h-7 rounded-lg text-[10px] font-bold tracking-widest uppercase
                         text-[var(--color-accent-dark)] border border-[var(--color-accent-20)]
                         hover:bg-[var(--color-accent-15)] hover:border-[var(--color-accent)] transition-all duration-150"
            >
              Reset
            </button>
          )}

        </div>
      </div>
    </div>
  );
}