"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AssessmentData {
  technologyName: string;
  technologyDescription: string;
  technologyType: string;
  answers: Record<string, boolean>; // store question id → checked
}

interface AssessmentContextType {
  data: AssessmentData;
  updateData: (values: Partial<AssessmentData>) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AssessmentData>({
    technologyName: "",
    technologyDescription: "",
    technologyType: "",
    answers: {},
  });

  const updateData = (values: Partial<AssessmentData>) => {
    setData((prev) => ({ ...prev, ...values }));
  };

  return (
    <AssessmentContext.Provider value={{ data, updateData }}>
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