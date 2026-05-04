// hooks/assessment/useAssessment.ts

import { useContext } from "react";
import { AssessmentContext } from "@/contexts/AssessmentContext";
import type { AssessmentContextType } from "@/types/assessment";

export function useAssessment(): AssessmentContextType {
  const context = useContext(AssessmentContext);
  if (!context) throw new Error("useAssessment must be used inside AssessmentProvider");
  return context;
}