export interface DropdownOption {
  label: string;
  value: string;
  trlSatisfied?: number | null;
  contactLabel?: string;
  action?: string;
  items?: { text: string; trlLevel: number }[];
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
  options?: DropdownOption[];
}