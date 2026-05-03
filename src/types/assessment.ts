// src/types/assessment.ts

// Assessment context
// Context shape
export interface AssessmentContextType {
  data:                 AssessmentData;
  updateData:           (newData: Partial<AssessmentData>) => void;
  clearData:            () => void;
  lastCategoryIndex:    number;
  setLastCategoryIndex: (index: number) => void;
  lastPage:             number;
  setLastPage:          (page: number) => void;
  hydrated:             boolean;
}

// Answer types 
export type DropdownAnswer = string | null;

export interface MultiConditionalAnswer {
  selection:    string;
  checkedItems: string[];
}

export type AnswerValue = boolean | DropdownAnswer | MultiConditionalAnswer;

// IP types 
export interface IPQuestionData {
  initiated:     "yes" | "no" | "trade_secret" | "";
  selectedTypes: Record<string, boolean>;
  typeStatuses:  Record<string, string>;
  dusPvpStatus?: string; // only used for plant variety technology types
}

export interface IPData {
  [questionKey: string]: IPQuestionData;
}

// Assessment session data 
export interface AssessmentData {
  technologyName:        string;
  technologyDescription: string;
  technologyType:        string;
  fundingSource:         string;
  answers:               Record<string, AnswerValue>;
  ipData:                IPData;
}