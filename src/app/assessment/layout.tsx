"use client";

import { AssessmentProvider } from "./AssessmentContext";

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <AssessmentProvider>{children}</AssessmentProvider>;
}