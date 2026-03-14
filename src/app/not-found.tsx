"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="font-['DM_Sans',sans-serif] min-h-screen bg-[#f5f2ec] flex items-center justify-center px-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,46,26,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,46,26,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <div className="max-w-[520px] w-full text-center">

        {/* Large 404 */}
        <div className="relative mb-8 select-none">
          <span
            className="font-['DM_Serif_Display',serif] text-[clamp(100px,20vw,160px)] leading-none tracking-tight text-[#0f2e1a]/[0.06]"
          >
            404
          </span>
          {/* Floating badge over the number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#ede9e0] shadow-[0_8px_32px_rgba(15,46,26,0.10)] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="#4aa35a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <path d="M11 8v3M11 14h.01" />
              </svg>
            </div>
          </div>
        </div>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08] mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a]" />
          Page Not Found
        </div>

        {/* Heading */}
        <h1 className="font-['DM_Serif_Display',serif] text-[clamp(28px,4vw,40px)] text-[#0f2e1a] leading-[1.15] tracking-tight mb-4">
          This page doesn't{" "}
          <em className="text-[#4aa35a]">exist</em>
        </h1>

        {/* Body */}
        <p className="text-[15px] text-[#6b7a75] font-light leading-relaxed mb-8 max-w-[380px] mx-auto">
          The page you're looking for may have been moved, renamed, or never existed.
          Double-check the URL or head back to a known page.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-[14px] font-semibold text-white bg-[#4aa35a] shadow-[0_8px_32px_rgba(74,163,90,0.30)] hover:bg-[#3d8f4c] hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </Link>

          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[14px] font-medium text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a] transition-all duration-200"
          >
            Visit FAQ
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-[#ede9e0]">
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#94a3a0] mb-4">
            You might be looking for
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Start Assessment", href: "/assessment/disclaimer" },
              { label: "About TRACER",     href: "/about" },
              { label: "FAQ",              href: "/faq" },
              { label: "Terms of Use",     href: "/terms" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-[12px] text-[#6b7a75] font-light px-3.5 py-1.5 rounded-full border border-[#e5e1d8] bg-white hover:border-[#4aa35a]/40 hover:text-[#0f2e1a] transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}