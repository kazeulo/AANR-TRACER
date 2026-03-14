"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error:  Error & { digest?: string };
  reset:  () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {

  useEffect(() => {
    console.error("[AANR-TRACER] Runtime error:", error);
  }, [error]);

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

        {/* Icon backdrop */}
        <div className="relative mb-8 select-none">
          <span className="font-['DM_Serif_Display',serif] text-[clamp(100px,20vw,160px)] leading-none tracking-tight text-[#0f2e1a]/[0.06]">
            Err
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#ede9e0] shadow-[0_8px_32px_rgba(15,46,26,0.10)] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>
        </div>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#f97316] px-3.5 py-1.5 border border-[#f97316]/30 rounded-full bg-[#f97316]/[0.08] mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
          Something Went Wrong
        </div>

        {/* Heading */}
        <h1 className="font-['DM_Serif_Display',serif] text-[clamp(28px,4vw,40px)] text-[#0f2e1a] leading-[1.15] tracking-tight mb-4">
          An unexpected{" "}
          <em className="text-[#f97316]">error</em>{" "}occurred
        </h1>

        {/* Body */}
        <p className="text-[15px] text-[#6b7a75] font-light leading-relaxed mb-3 max-w-[400px] mx-auto">
          Something went wrong while loading this page. Your assessment data is safe —
          try again or return to the home page.
        </p>

        {/* Error detail — only shown in dev or when digest exists */}
        {(process.env.NODE_ENV === "development" || error.digest) && (
          <div className="mx-auto mb-6 max-w-[420px] rounded-xl border border-[#f97316]/20 bg-[#fff7f0] px-4 py-3 text-left">
            <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#f97316]/70 mb-1">
              Error Details
            </p>
            {error.digest && (
              <p className="text-[11px] text-[#6b7a75] font-mono mb-1">
                ID: {error.digest}
              </p>
            )}
            {process.env.NODE_ENV === "development" && error.message && (
              <p className="text-[11px] text-[#9a3412] font-mono leading-relaxed break-all">
                {error.message}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <button
            onClick={reset}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-[14px] font-semibold text-white bg-[#0f2e1a] shadow-[0_8px_32px_rgba(15,46,26,0.20)] hover:bg-[#1a3d26] hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Try Again
          </button>

          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[14px] font-medium text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a] transition-all duration-200"
          >
            Back to Home
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Help note */}
        <div className="rounded-2xl border border-[#ede9e0] bg-white px-6 py-5 flex items-start gap-4 text-left">
          <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-[#4aa35a]/10 flex items-center justify-center mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#4aa35a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#0f2e1a] mb-1">
              If this keeps happening
            </p>
            <p className="text-[12px] text-[#6b7a75] font-light leading-relaxed">
              Try refreshing the page or clearing your browser cache. If the issue persists,
              please use the feedback form on the results page to let us know.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}