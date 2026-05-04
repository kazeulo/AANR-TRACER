// contexts/assessmentContext.ts
//
// Single source of the AssessmentContext object.
// Both AssessmentProvider and useAssessment must import from HERE —
// never call createContext() in more than one place for the same context.

import { createContext } from "react";
import type { AssessmentContextType } from "@/types/assessment";

export const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);