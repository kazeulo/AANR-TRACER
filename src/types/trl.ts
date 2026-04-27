// src/types/trl.ts

import { QuestionItem } from "../app/utils/trlCalculator";

export interface IPQuestionData {
  initiated: "yes" | "no" | "trade_secret" | "";
  selectedTypes: Record<string, boolean>;
  typeStatuses: Record<string, string>;
  dusPvpStatus: string;
}

export interface IPData {
  [questionKey: string]: IPQuestionData;
}

export type DropdownAnswer = string | null;

export interface MultiConditionalAnswer {
  selection: string;
  checkedItems: string[];
}

export type AnswerValue = boolean | DropdownAnswer | MultiConditionalAnswer;

export interface TRLResult {
  highestCompletedTRL: number;
  highestAchievableTRL: number;
  completedQuestions: QuestionItem[];
  lackingForNextLevel: QuestionItem[];
  lackingForAchievable: QuestionItem[];
  lackingToLevel9: QuestionItem[];
}