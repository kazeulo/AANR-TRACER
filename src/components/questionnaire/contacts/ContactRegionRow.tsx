"use client";

import { Institution } from "@/types/contacts";
import { useState } from "react";

interface ContactRegionRowProps {
  region: string;
  universities: Institution[];
  accentColor?: "amber" | "blue" | "violet";
}

// Color map
const COLORS = {
  amber: {
    dot:          "bg-amber-400",
    region:       "text-amber-900",
    regionHover:  "hover:text-amber-700",
    university:   "text-amber-800",
    email:        "text-amber-600 hover:text-amber-900",
    tba:          "text-[#94a3a0]",
    rowHover:     "hover:bg-amber-50/70",
    chevron:      "text-amber-400",
    divider:      "divide-amber-50",
    badge:        "bg-amber-100 text-amber-700 border-amber-200",
  },
  blue: {
    dot:          "bg-blue-400",
    region:       "text-blue-900",
    regionHover:  "hover:text-blue-700",
    university:   "text-blue-800",
    email:        "text-blue-500 hover:text-blue-800",
    tba:          "text-[#94a3a0]",
    rowHover:     "hover:bg-blue-50/70",
    chevron:      "text-blue-400",
    divider:      "divide-blue-50",
    badge:        "bg-blue-100 text-blue-700 border-blue-200",
  },
  violet: {
    dot:          "bg-violet-400",
    region:       "text-violet-900",
    regionHover:  "hover:text-violet-700",
    university:   "text-violet-800",
    email:        "text-violet-500 hover:text-violet-800",
    tba:          "text-[#94a3a0]",
    rowHover:     "hover:bg-violet-50/70",
    chevron:      "text-violet-400",
    divider:      "divide-violet-50",
    badge:        "bg-violet-100 text-violet-700 border-violet-200",
  },
};

export function ContactRegionRow({
  region,
  universities,
  accentColor = "amber",
}: ContactRegionRowProps) {
  const [open, setOpen] = useState(false);
  const c = COLORS[accentColor];

  const hasAny     = universities.length > 0;
  const emailCount = universities.filter(u => u.email).length;

  return (
    <div>
      {/* Layer 1 — region header, always visible */}
      <button
        onClick={() => hasAny && setOpen(prev => !prev)}
        disabled={!hasAny}
        className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 transition-colors text-left ${
          hasAny ? `${c.rowHover} cursor-pointer` : "opacity-50 cursor-default"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${c.dot} mt-[1px]`} />
          <span className={`text-[13px] font-semibold ${c.region} leading-snug truncate`}>
            {region}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Chevron */}
          {hasAny && (
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              className={`transition-transform duration-200 ${c.chevron} ${open ? "rotate-180" : ""}`}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </button>

      {/* Layer 2 — universities + emails, shown on expand */}
      {open && hasAny && (
        <div className={`divide-y ${c.divider} border-t border-opacity-50`} style={{ borderColor: "inherit" }}>
          {universities.map(({ name, email }) => (
            <div
              key={name}
              className="flex items-start justify-between gap-3 pl-10 pr-5 py-2.5"
            >
              <p className={`text-[12px] font-light ${c.university} leading-snug flex-1 min-w-0`}>
                {name}
              </p>
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className={`flex-shrink-0 text-[11px] font-light underline underline-offset-2 transition-colors ${c.email}`}
                  onClick={e => e.stopPropagation()}
                >
                  {email}
                </a>
              ) : (
                <span className={`flex-shrink-0 text-[11px] italic font-light ${c.tba}`}>
                  TBA
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}