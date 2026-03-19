"use client";

import { useState, useEffect, useRef } from "react";
import { useFontSize } from "./FontsizeContext";

export default function FontSizeControl() {
  const { scaleIndex, label, canIncrease, canDecrease, increase, decrease, reset } = useFontSize();
  const [open, setOpen] = useState(false);
  const isDefault = scaleIndex === 1;
  const ref = useRef<HTMLDivElement>(null);

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
    <div ref={ref} className="fixed left-0 top-3/4 -translate-y-1/2 z-50 flex items-center">

      {/* Collapsed tab — always visible */}
      <div className="relative group">
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close text size panel" : "Open text size panel"}
          className="w-8 h-20 rounded-r-xl flex items-center justify-center shadow-xl
                     transition-all duration-200 bg-[#4aa35a]"
        >
          <span
            className="text-[12px] font-extrabold tracking-wider select-none text-white drop-shadow"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
          >
            Aa
          </span>
        </button>

        {/* Hover tooltip — only when panel is closed */}
        {!open && (
          <div className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
            <div className="flex items-center">
              {/* Arrow pointing left */}
              <div className="w-0 h-0
                              border-t-[6px] border-t-transparent
                              border-b-[6px] border-b-transparent
                              border-r-[7px] border-r-[#0f2e1a]" />
              {/* Label box */}
              <div className="bg-[#0f2e1a] text-[12px] text-white font-medium
                              px-5 py-2 rounded-lg shadow-xl whitespace-nowrap leading-snug">
                Adjust <span className="text-[#4aa35a] font-bold">text size</span>
                <br />
                <span className="text-white/50 text-[10px]">Click to expand</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expanded panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "w-[138px] opacity-100" : "w-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-3 w-[138px] rounded-r-2xl px-4 py-4
                        shadow-xl border-y border-r border-[#4aa35a]/50"
            style={{ background: "#1a3d26" }}>

          {/* Label */}
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">
            Text Size
          </p>

          {/* Current scale label */}
          <p className="text-[11px] text-white/60 font-light -mt-1">
            {label}
          </p>

          {/* A− / A+ buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={decrease}
              disabled={!canDecrease}
              aria-label="Decrease text size"
              className={`flex-1 h-9 rounded-lg border text-[13px] font-bold transition-all duration-150
                ${canDecrease
                  ? "border-[#4aa35a]/50 text-white hover:border-[#4aa35a] hover:bg-[#4aa35a]/20 hover:text-[#4aa35a]"
                  : "border-white/10 text-white/20 cursor-not-allowed"
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
                  ? "border-[#4aa35a]/50 text-white hover:border-[#4aa35a] hover:bg-[#4aa35a]/20 hover:text-[#4aa35a]"
                  : "border-white/10 text-white/20 cursor-not-allowed"
                }`}
            >
              A+
            </button>
          </div>

          {/* Scale indicator dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map(i => (
              <span
                key={i}
                className={`rounded-full transition-all duration-200 ${
                  i === scaleIndex
                    ? "w-2.5 h-2.5 bg-[#4aa35a] shadow-[0_0_6px_#4aa35a]"
                    : "w-1.5 h-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>

          {/* Reset — only when not at default */}
          {!isDefault && (
            <button
              onClick={reset}
              aria-label="Reset text size"
              className="w-full h-7 rounded-lg text-[10px] font-bold tracking-widest uppercase
                         text-[#4aa35a] border border-[#4aa35a]/40
                         hover:bg-[#4aa35a]/20 hover:border-[#4aa35a] transition-all duration-150"
            >
              Reset
            </button>
          )}

        </div>
      </div>

    </div>
  );
}