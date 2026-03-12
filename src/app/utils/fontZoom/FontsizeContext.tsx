"use client";

import { createContext, useContext, useEffect, useState } from "react";

// ─── Config ───────────────────────────────────────────────────────────────────

const SCALES = [0.9, 1, 1.1, 1.2] as const;
const LABELS = ["Small", "Default", "Large", "Extra Large"] as const;
const STORAGE_KEY = "aanr-font-scale";
const DEFAULT_INDEX = 1; // "Default" = 1.0

// ─── Context ──────────────────────────────────────────────────────────────────

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

// ─── Provider ─────────────────────────────────────────────────────────────────

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

  // Apply zoom to <html> whenever scale changes
  useEffect(() => {
    const scale = SCALES[scaleIndex];
    document.documentElement.style.zoom = String(scale);
    try {
      localStorage.setItem(STORAGE_KEY, String(scaleIndex));
    } catch { /* ignore */ }

    // Cleanup on unmount
    return () => {
      document.documentElement.style.zoom = "1";
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) throw new Error("useFontSize must be used within FontSizeProvider");
  return ctx;
}