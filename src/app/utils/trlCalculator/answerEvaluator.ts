// utils/trlCalculator/answerEvaluator.ts

import type { AnswerValue, IPData } from "@/types/assessment";
import type { QuestionItem } from "@/types/questions";
import { evaluateIPQuestion }              from "./ipCalculator";
import { dropdownSatisfiedTRL }            from "./dropdownHelpers";
import { multiConditionalFullySatisfied }  from "./multiconditionalHelpers";

/**
 * Returns true if question q is satisfied at the given checkLevel.
 * For checkbox questions, the level is exact (q.trlLevel must match).
 * For dropdown/multi-conditional, satisfaction is level-aware.
 */
export function isAnsweredYesAtLevel(
  q:             QuestionItem,
  answers:       Record<string, AnswerValue>,
  ipData:        IPData,
  checkLevel:    number,
  technologyType: string,
): boolean {
  // IP synthetic questions delegate to their own evaluator
  const ipResult = evaluateIPQuestion(q.id, ipData, technologyType);
  if (ipResult !== null) return ipResult;

  const answer = answers[q.id];
  const qType  = q.type ?? "checkbox";

  if (qType === "checkbox")          return answer === true;
  if (qType === "dropdown")          return (dropdownSatisfiedTRL(q, answer) ?? -1) >= checkLevel;
  if (qType === "multi-conditional") return multiConditionalFullySatisfied(q, answer, checkLevel);

  return false;
}

/**
 * Convenience wrapper — checks satisfaction at the question's own trlLevel.
 * Used when building completed/lacking lists rather than level-scanning.
 */
export function isAnsweredYes(
  q:             QuestionItem,
  answers:       Record<string, AnswerValue>,
  ipData:        IPData,
  technologyType: string,
): boolean {
  return isAnsweredYesAtLevel(q, answers, ipData, q.trlLevel, technologyType);
}