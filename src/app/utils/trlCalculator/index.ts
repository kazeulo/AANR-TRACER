// utils/trlCalculator/index.ts
//
// Public barrel — consumers import from here, never from sub-modules directly.
// This keeps internal module structure free to change without breaking imports.
//
// Usage:
//   import { calculateTRL, TRLResult, QuestionItem } from "@/utils/trlCalculator";

export { calculateTRL }        from "./trlCalculator";
export type { TRLResult }      from "./trlCalculator";
export type { QuestionItem }   from "@/types/questions";
export type {
  AnswerValue,
  IPData,
  IPQuestionData,
  MultiConditionalAnswer,
  DropdownAnswer,
}                              from "@/types/assessment";