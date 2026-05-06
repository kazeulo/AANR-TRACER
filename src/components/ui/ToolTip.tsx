"use client";

// components/ui/Tooltip.tsx
//
// Hover shows the bubble. Clicking locks it open.
// Clicking again or clicking outside dismisses it.

import { useState, useRef, useEffect } from "react";

export function Tooltip({
  text,
  children,
}: {
  text:     string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const [locked,  setLocked]  = useState(false); // true = click-locked open
  const ref                   = useRef<HTMLSpanElement>(null);

  const visible = hovered || locked;

  // Click outside unlocks
  useEffect(() => {
    if (!locked) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setLocked(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [locked]);

  const handleClick = () => {
    setLocked(prev => !prev); // toggle lock on each click
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setLocked(false); setHovered(false); }
    if (e.key === "Enter" || e.key === " ") handleClick();
  };

  return (
    <span ref={ref} className="relative inline">
      <span
        role="button"
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`font-medium text-[#1a5c2a] underline decoration-dotted underline-offset-[3px] cursor-help transition-colors ${
          locked
            ? "decoration-[#2d7a3a]"           // solid underline when locked
            : "decoration-[#2d7a3a]/50"         // dotted when just hovering
        }`}
      >
        {children}
      </span>

      {/* Bubble */}
      <span
        aria-hidden={!visible}
        className={`
          pointer-events-none
          absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2.5
          w-[260px] text-left
          transition-all duration-200 ease-out
          ${visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1"
          }
        `}
      >
        {/* Arrow */}
        <span className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-3 h-3 rotate-45 bg-[#0f2e1a] border-r border-b border-[#1a3d26]" />
        <span className="block bg-[#0f2e1a] border border-[#1a3d26] rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
          <span role="tooltip" className="block text-[12px] text-white/85 font-light leading-relaxed">
            {text}
          </span>
        </span>
      </span>
    </span>
  );
}