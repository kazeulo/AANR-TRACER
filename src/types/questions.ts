// src/types/questions.ts

import { IPData } from "@/app/utils/trlCalculator/trlCalculator";



export interface DropdownOption {
  label: string;
  value: string;
  trlSatisfied?: number | null;
  contactLabel?: string;
  action?: string;
  items?: { text: string; trlLevel: number }[];
}

export interface ChecklistItem {
  text: string;
  trlLevel: number;
}

export interface MultiConditionalOption {
  label: string;
  value: string;
  action: "contacts" | "checklist" | "exempt";
  items?: ChecklistItem[];
  contactLabel?: string;
}

export interface Question {
  id: string;
  questionText: string;
  trlLevel: number;
  technologyType: string;
  category: string;
  toolTip?: string;
  expandedToolTip?: string;
  type?: "checkbox" | "dropdown" | "multi-conditional";
  options?: DropdownOption[] | MultiConditionalOption[];
}

// QuestionItem is the calculator-facing version (no UI fields like toolTip)
export interface QuestionItem {
  id: string;
  questionText: string;
  trlLevel: number;
  category: string;
  type?: "checkbox" | "dropdown" | "multi-conditional";
  options?: DropdownOption[] | MultiConditionalOption[];
}

export interface IPSectionProps {
  label: string;
  ipData: IPData;
  onChange: (updated: IPData) => void;
  technologyType: string;
}