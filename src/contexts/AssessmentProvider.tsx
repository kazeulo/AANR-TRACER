"use client";

// contexts/AssessmentProvider.tsx
//
// Provides AssessmentContext to the tree. Import AssessmentContext from
// the shared assessmentContext.ts — never call createContext() here.

import { useState, useEffect, useRef, ReactNode } from "react";
import { AssessmentContext } from "@/contexts/AssessmentContext";

import type { AssessmentData } from "@/types/assessment";
export type { AnswerValue, MultiConditionalAnswer, DropdownAnswer, IPQuestionData, IPData, AssessmentData } from "@/types/assessment";

// ── Constants ─────────────────────────────────────────────────────────────────

const SESSION_KEY = "aanr_tracer_assessment";

const DEFAULT_DATA: AssessmentData = {
  technologyName:        "",
  technologyDescription: "",
  technologyType:        "",
  fundingSource:         "",
  answers:               {},
  ipData:                {},
};

// ── Session helpers ───────────────────────────────────────────────────────────

function loadFromSession(): AssessmentData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return DEFAULT_DATA;
    return { ...DEFAULT_DATA, ...(JSON.parse(raw) as Partial<AssessmentData>) };
  } catch {
    return DEFAULT_DATA;
  }
}

function saveToSession(data: AssessmentData): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage full or unavailable — fail silently
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AssessmentData>(() =>
    typeof window === "undefined" ? DEFAULT_DATA : loadFromSession()
  );
  const [hydrated,          setHydrated]          = useState(false);
  const [lastCategoryIndex, setLastCategoryIndex] = useState(0);
  const [lastPage,          setLastPage]          = useState(0);
  const isClearing = useRef(false); // prevents re-save after clearData()

  // Hydration — runs once on mount (client only)
  useEffect(() => {
    const isFresh =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("fresh") === "1";

    if (isFresh) {
      sessionStorage.removeItem(SESSION_KEY);
      setData(DEFAULT_DATA);
      setLastCategoryIndex(0);
      setLastPage(0);
    } else {
      setData(loadFromSession());
    }

    setHydrated(true);
  }, []);

  // Persist to sessionStorage whenever data changes post-hydration
  useEffect(() => {
    if (!hydrated) return;
    if (isClearing.current) { isClearing.current = false; return; }
    saveToSession(data);
  }, [data, hydrated]);

  const updateData = (values: Partial<AssessmentData>) =>
    setData(prev => ({ ...prev, ...values }));

  const clearData = () => {
    isClearing.current = true;
    setData(DEFAULT_DATA);
    setLastCategoryIndex(0);
    setLastPage(0);
    if (typeof window !== "undefined") sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <AssessmentContext.Provider
      value={{
        data,
        updateData,
        clearData,
        lastCategoryIndex,
        setLastCategoryIndex,
        lastPage,
        setLastPage,
        hydrated,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}