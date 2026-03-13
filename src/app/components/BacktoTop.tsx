"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-12 right-10 z-50 w-14 h-14 rounded-full
                 bg-[var(--color-accent)] text-white shadow-[var(--shadow-btn-sm)]
                 flex items-center justify-center
                 hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5
                 transition-all duration-200"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 11V3M3 7l4-4 4 4"
          stroke="white" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}