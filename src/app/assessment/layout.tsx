"use client";

import { AssessmentProvider } from "@/contexts/AssessmentProvider";

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <AssessmentProvider>{children}</AssessmentProvider>;
}