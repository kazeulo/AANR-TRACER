"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SCALES, LABELS, DEFAULT_INDEX, SCALE_STORAGE_KEY } from "@/constants/fontSizeConfig";

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

function getInitialIndex(): number {
  if (typeof window === "undefined") return DEFAULT_INDEX;
  try {
    const saved = localStorage.getItem(SCALE_STORAGE_KEY);
    if (saved !== null) {
      const idx = Number(saved);
      if (idx >= 0 && idx < SCALES.length) return idx;
    }
  } catch { /* localStorage unavailable */ }
  return DEFAULT_INDEX;
}

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [scaleIndex, setScaleIndex] = useState<number>(getInitialIndex);

  useEffect(() => {
    const scale = SCALES[scaleIndex];
    const root = document.documentElement;
    root.style.zoom = String(scale);
    // iOS/WebKit fallback — zoom is non-standard; font-size keeps text correct
    root.style.fontSize = `${16 * scale}px`;
    try {
      localStorage.setItem(SCALE_STORAGE_KEY, String(scaleIndex));
    } catch { /* ignore */ }

    return () => {
      // Only runs on unmount (app teardown) — safe to clear
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

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) throw new Error("useFontSize must be used within FontSizeProvider");
  return ctx;
}