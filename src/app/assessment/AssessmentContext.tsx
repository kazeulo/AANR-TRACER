// AssessmentContext.tsx

"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import type { AnswerValue } from "../utils/trlCalculator";
export type { AnswerValue, MultiConditionalAnswer, DropdownAnswer } from "../utils/trlCalculator";

// ─── IP Types ─────────────────────────────────────────────────────────────────

export interface IPQuestionData {
  dusPvpStatus: any;
  initiated: "yes" | "no" | "trade_secret" | "";
  selectedTypes: Record<string, boolean>;
  typeStatuses: Record<string, string>;
}

export interface IPData {
  [questionKey: string]: IPQuestionData;
}

// ─── Assessment Data ──────────────────────────────────────────────────────────

interface AssessmentData {
  technologyName:        string;
  technologyDescription: string;
  technologyType:        string;
  fundingSource:         string;
  answers:               Record<string, AnswerValue>;
  ipData:                IPData;
}

interface AssessmentContextType {
  data:                   AssessmentData;
  updateData:             (newData: Partial<AssessmentData>) => void;
  clearData:              () => void;
  lastCategoryIndex:      number;
  setLastCategoryIndex:   (index: number) => void;
  lastPage:               number;
  setLastPage:            (page: number) => void;
}

const SESSION_KEY = "aanr_tracer_assessment";

const DEFAULT_DATA: AssessmentData = {
  technologyName:        "",
  technologyDescription: "",
  technologyType:        "",
  fundingSource:         "",
  answers:               {},
  ipData:                {},
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadFromSession(): AssessmentData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as Partial<AssessmentData>;
    return { ...DEFAULT_DATA, ...parsed };
  } catch {
    return DEFAULT_DATA;
  }
}

function saveToSession(data: AssessmentData) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage full or unavailable — fail silently
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [data, setData]         = useState<AssessmentData>(DEFAULT_DATA);
  const [hydrated, setHydrated] = useState(false);
  const isClearing              = useRef(false);   // ← prevents re-save after clear

  const [lastCategoryIndex, setLastCategoryIndex] = useState(0);
  const [lastPage, setLastPage]                   = useState(0);

  // Load from sessionStorage once on mount (client only)
  useEffect(() => {
    const saved = loadFromSession();
    setData(saved);
    setHydrated(true);
  }, []);

  // Persist to sessionStorage whenever data changes —
  // but skip the write if we're in the middle of a clear.
  useEffect(() => {
    if (!hydrated) return;
    if (isClearing.current) {
      isClearing.current = false;
      return;
    }
    saveToSession(data);
  }, [data, hydrated]);

  const updateData = (values: Partial<AssessmentData>) => {
    setData(prev => ({ ...prev, ...values }));
  };

  const clearData = () => {
    // Set the flag BEFORE setState so the persist effect skips the next write
    isClearing.current = true;
    setData(DEFAULT_DATA);
    setLastCategoryIndex(0);
    setLastPage(0);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
    }
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
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used inside AssessmentProvider");
  }
  return context;
}