// utils/trlCalculator/multiConditionalHelpers.ts

// Handles completed items, lacking items, and full satisfaction checks
// for multi-conditional questions (yes/no/exempt with sub-checklists).

import type { AnswerValue, MultiConditionalAnswer } from "@/types/assessment";
import type { QuestionItem, ChecklistItem, MultiConditionalOption } from "@/types/questions";

// Checklist extraction 

export function getChecklistItems(q: QuestionItem): ChecklistItem[] {
  if (!q.options) return [];
  const yesOpt = (q.options as MultiConditionalOption[]).find(
    o => o.action === "checklist",
  );
  return yesOpt?.items ?? [];
}

// Lacking items 

export function multiConditionalLackingItems(
  q:          QuestionItem,
  answer:     AnswerValue,
  upToLevel?: number,
): QuestionItem[] {
  const items = getChecklistItems(q);
  if (!items.length) return [];

  const inRange = (item: ChecklistItem) =>
    upToLevel === undefined || item.trlLevel <= upToLevel;

  const toQuestionItem = (item: ChecklistItem): QuestionItem => ({
    id:           `${q.id}__${item.text}`,
    questionText: item.text,
    trlLevel:     item.trlLevel,
    category:     q.category,
    type:         "checkbox" as const,
  });

  // Unanswered — all items are lacking
  if (typeof answer !== "object" || answer === null || Array.isArray(answer)) {
    return items.filter(inRange).map(toQuestionItem);
  }

  const a = answer as MultiConditionalAnswer;

  if (a.selection === "exempt") return [];

  if (a.selection === "no") {
    return items.filter(inRange).map(toQuestionItem);
  }

  if (a.selection === "yes") {
    return items
      .filter(item => inRange(item) && !a.checkedItems.includes(item.text))
      .map(toQuestionItem);
  }

  return [];
}

// Completed items

export function multiConditionalCompletedItems(
  q:      QuestionItem,
  answer: AnswerValue,
): QuestionItem[] {
  if (typeof answer !== "object" || answer === null || Array.isArray(answer)) return [];
  const a = answer as MultiConditionalAnswer;

  // Exempt counts the whole question as complete
  if (a.selection === "exempt") return [q];

  if (a.selection === "yes") {
    return getChecklistItems(q)
      .filter(item => a.checkedItems.includes(item.text))
      .map(item => ({
        id:           `${q.id}__${item.text}`,
        questionText: item.text,
        trlLevel:     item.trlLevel,
        category:     q.category,
        type:         "checkbox" as const,
      }));
  }

  return [];
}

// Full satisfaction check 

/** Returns true if all checklist items at or below checkLevel are ticked. */
export function multiConditionalFullySatisfied(
  q:          QuestionItem,
  answer:     AnswerValue,
  checkLevel: number,
): boolean {
  if (typeof answer !== "object" || answer === null || Array.isArray(answer)) return false;
  const a = answer as MultiConditionalAnswer;

  if (a.selection === "exempt") return true;

  if (a.selection === "yes") {
    const required = getChecklistItems(q).filter(i => i.trlLevel <= checkLevel);
    return required.length > 0 && required.every(i => a.checkedItems.includes(i.text));
  }

  return false;
}