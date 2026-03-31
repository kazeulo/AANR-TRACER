"use client";

import { createContext, useContext, useEffect, useState } from "react";

//    ─ Config 

const SCALES = [0.9, 1, 1.1, 1.2, 1.3] as const;
const LABELS = ["Small", "Default", "Large", "X-Large", "XX-Large"] as const;
const STORAGE_KEY = "aanr-font-scale";
const DEFAULT_INDEX = 1; // "Default" = 1.0

//    ─ Context ─

interface FontSizeContextValue {
  scaleIndex: number;
  scale: number;
  label: string;
  canIncrease: boolean;
  canDecrease: boolean;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

const FontSizeContext = createContext<FontSizeContextValue | null>(null);

//    ─ Provider 

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [scaleIndex, setScaleIndex] = useState<number>(DEFAULT_INDEX);

  // Load saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const idx = Number(saved);
        if (idx >= 0 && idx < SCALES.length) setScaleIndex(idx);
      }
    } catch { /* localStorage unavailable */ }
  }, []);

  // Apply zoom to <html> so ALL elements (px, rem, em, spacing) scale uniformly.
  // iOS Safari doesn't support zoom on <html> — we work around this by also
  // setting font-size as a fallback, and the CSS in globals.css pins the
  // font-family so it never falls back to the system font.
  useEffect(() => {
    const scale = SCALES[scaleIndex];
    const root = document.documentElement;
    root.style.zoom = String(scale);
    // iOS/WebKit fallback — won't scale px values but keeps fonts correct
    root.style.fontSize = `${16 * scale}px`;
    try {
      localStorage.setItem(STORAGE_KEY, String(scaleIndex));
    } catch { /* ignore */ }

    return () => {
      root.style.zoom = "";
      root.style.fontSize = "";
    };
  }, [scaleIndex]);

  const increase = () => setScaleIndex(i => Math.min(i + 1, SCALES.length - 1));
  const decrease = () => setScaleIndex(i => Math.max(i - 1, 0));
  const reset    = () => setScaleIndex(DEFAULT_INDEX);

  return (
    <FontSizeContext.Provider value={{
      scaleIndex,
      scale:       SCALES[scaleIndex],
      label:       LABELS[scaleIndex],
      canIncrease: scaleIndex < SCALES.length - 1,
      canDecrease: scaleIndex > 0,
      increase,
      decrease,
      reset,
    }}>
      {children}
    </FontSizeContext.Provider>
  );
}

//    ─ Hook ──

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) throw new Error("useFontSize must be used within FontSizeProvider");
  return ctx;
}