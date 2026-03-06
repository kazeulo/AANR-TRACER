"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AssessmentData {
  technologyName: string;
  technologyDescription: string;
  technologyType: string;
  fundingSource: string;
  answers: Record<string, boolean>; // store question id, checked
}

interface AssessmentContextType {
  data: AssessmentData;
  updateData: (newData: Partial<AssessmentData>) => void;
  lastCategoryIndex: number;
  setLastCategoryIndex: (index: number) => void;
  lastPage: number;
  setLastPage: (page: number) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AssessmentData>({
    technologyName: "",
    technologyDescription: "",
    technologyType: "",
    fundingSource: "",
    answers: {},
  });

  // ✅ Move these inside the provider
  const [lastCategoryIndex, setLastCategoryIndex] = useState(0);
  const [lastPage, setLastPage] = useState(0);

  const updateData = (values: Partial<AssessmentData>) => {
    setData((prev) => ({ ...prev, ...values }));
  };

  return (
    <AssessmentContext.Provider
      value={{
        data,
        updateData,
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