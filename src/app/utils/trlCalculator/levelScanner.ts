// utils/trlCalculator/levelScanner.ts

// Builds the level→questions map and scans through levels to determine
// highestCompletedTRL and highestAchievableTRL.
// Isolated here because this is the most algorithmic part of the calculator
// and benefits from being independently readable and testable.

import type { AnswerValue, IPData } from "@/types/assessment";
import type { QuestionItem, DropdownOption } from "@/types/questions";
import { hasLevel }               from "./dropdownHelpers";
import { getChecklistItems }      from "./multiconditionalHelpers";
import { isAnsweredYesAtLevel }   from "./answerEvaluator";

// Level map builder 

/**
 * Builds a map of trlLevel → QuestionItem[] covering all question types.
 * Dropdown and multi-conditional questions can appear at multiple levels.
 */
export function buildLevelMap(
  questions: QuestionItem[],
): Record<number, QuestionItem[]> {
  const byLevel: Record<number, QuestionItem[]> = {};

  const registerAt = (lvl: number, q: QuestionItem) => {
    if (!byLevel[lvl]) byLevel[lvl] = [];
    if (!byLevel[lvl].some(e => e.id === q.id)) byLevel[lvl].push(q);
  };

  questions.forEach(q => {
    if (q.type === "dropdown" && q.options) {
      (q.options as DropdownOption[])
        .filter(hasLevel)
        .forEach(o => registerAt(o.trlSatisfied, q));
      return;
    }

    if (q.type === "multi-conditional") {
      const items  = getChecklistItems(q);
      const levels = items.length
        ? [...new Set(items.map(i => i.trlLevel))]
        : [q.trlLevel];
      levels.forEach(lvl => registerAt(lvl, q));
      return;
    }

    // Default: checkbox
    registerAt(q.trlLevel, q);
  });

  return byLevel;
}

// In-scope filter

/**
 * Returns all questions that have any bearing on the given level —
 * i.e. questions that must be satisfied for the level to be complete.
 */
function questionsInScopeForLevel(
  questions: QuestionItem[],
  level:     number,
): QuestionItem[] {
  return questions.filter(q => {
    if (q.type === "dropdown" && q.options)
      return (q.options as DropdownOption[]).some(
        o => hasLevel(o) && o.trlSatisfied <= level,
      );
    if (q.type === "multi-conditional")
      return getChecklistItems(q).some(i => i.trlLevel <= level);
    return q.trlLevel <= level;
  });
}

// Null-answer cap 

/**
 * Clamps highestCompletedTRL when a dropdown is answered with a null-
 * satisfaction option (e.g. "Not Yet Initiated"). This intentionally does NOT
 * affect highestAchievableTRL — achievable represents potential and should not
 * be suppressed by a blocking answer on a single question.
 */
export function applyNullAnswerCap(
  highestCompletedTRL: number,
  questions:           QuestionItem[],
  answers:             Record<string, AnswerValue>,
): number {
  let capped = highestCompletedTRL;

  questions
    .filter(q => q.type === "dropdown")
    .forEach(q => {
      const answer = answers[q.id];
      if (typeof answer !== "string" || !answer) return;

      const opts     = q.options as DropdownOption[];
      const selected = opts.find(o => o.value === answer);
      if (selected?.trlSatisfied != null) return; // valid selection, no cap needed

      const withLevel = opts.filter(hasLevel);
      if (!withLevel.length) return;

      const lowestLevel = Math.min(...withLevel.map(o => o.trlSatisfied));
      if (capped >= lowestLevel)
        capped = Math.min(capped, lowestLevel - 1);
    });

  return capped;
}

// Main scanners

export interface ScanResult {
  highestCompletedTRL:  number;
  highestAchievableTRL: number;
  byLevel:              Record<number, QuestionItem[]>;
  levels:               number[];
  maxLevel:             number;
}

export function scanLevels(
  questions:     QuestionItem[],
  answers:       Record<string, AnswerValue>,
  ipData:        IPData,
  technologyType: string,
): ScanResult {
  const byLevel = buildLevelMap(questions);
  const levels  = Object.keys(byLevel).map(Number).sort((a, b) => a - b);
  const maxLevel = Math.max(...levels, 0);

  // Highest Completed TRL — scan forward, break on first incomplete level
  let highestCompletedTRL = 0;
  for (const level of levels) {
    const inScope = questionsInScopeForLevel(questions, level);
    const allDone = inScope.every(q =>
      isAnsweredYesAtLevel(q, answers, ipData, level, technologyType),
    );
    if (allDone) highestCompletedTRL = level;
    else break;
  }

  // Apply null-answer cap (completed only)
  highestCompletedTRL = applyNullAnswerCap(highestCompletedTRL, questions, answers);

  // Highest Achievable TRL — scan backward, stop at first level with any answer
  let highestAchievableTRL = highestCompletedTRL;
  for (const level of [...levels].reverse()) {
    const anyDone = (byLevel[level] ?? []).some(q =>
      isAnsweredYesAtLevel(q, answers, ipData, level, technologyType),
    );
    if (anyDone) {
      highestAchievableTRL = Math.max(highestAchievableTRL, level);
      break;
    }
  }

  return { highestCompletedTRL, highestAchievableTRL, byLevel, levels, maxLevel };
}