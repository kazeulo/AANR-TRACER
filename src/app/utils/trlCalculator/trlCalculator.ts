// utils/trlCalculator/trlCalculator.ts

// Public API — imports from all sub-modules and orchestrates the calculation.
// This file should contain no logic of its own beyond wiring the modules
// together and building the final result arrays.

import type { AnswerValue, IPData } from "@/types/assessment";
import type { QuestionItem }        from "@/types/questions";

import { buildIPQuestions }                from "./ipCalculator";
import { isAnsweredYes }                   from "./answerEvaluator";
import { scanLevels }                      from "./levelScanner";
import {
  dropdownCompletedItems,
  dropdownLackingItems,
}                                          from "./dropdownHelpers";
import {
  multiConditionalCompletedItems,
  multiConditionalLackingItems,
}                                          from "./multiconditionalHelpers";
import { TRLResult } from "@/types/trlCalculator";

// Re-export types so consumers keep their existing import paths
export type { AnswerValue, IPData } from "@/types/assessment";
export type { QuestionItem }        from "@/types/questions";

// Helpers 

function partitionByType(questions: QuestionItem[]) {
  return {
    checkboxQuestions:  questions.filter(q => (q.type ?? "checkbox") === "checkbox"),
    dropdownQuestions:  questions.filter(q => q.type === "dropdown"),
    mcQuestions:        questions.filter(q => q.type === "multi-conditional"),
  };
}

function buildCompletedList(
  checkboxQuestions: QuestionItem[],
  dropdownQuestions: QuestionItem[],
  mcQuestions:       QuestionItem[],
  answers:           Record<string, AnswerValue>,
  ipData:            IPData,
  technologyType:    string,
): QuestionItem[] {
  const completed: QuestionItem[] = [];

  checkboxQuestions.forEach(q => {
    if (isAnsweredYes(q, answers, ipData, technologyType)) completed.push(q);
  });
  dropdownQuestions.forEach(q =>
    completed.push(...dropdownCompletedItems(q, answers[q.id])),
  );
  mcQuestions.forEach(q =>
    completed.push(...multiConditionalCompletedItems(q, answers[q.id])),
  );

  return completed;
}

function buildLackingList(
  checkboxQuestions: QuestionItem[],
  dropdownQuestions: QuestionItem[],
  mcQuestions:       QuestionItem[],
  answers:           Record<string, AnswerValue>,
  ipData:            IPData,
  technologyType:    string,
  upToLevel:         number,
  filterFn:          (q: QuestionItem) => boolean = () => true,
): QuestionItem[] {
  const lacking: QuestionItem[] = [];

  checkboxQuestions.forEach(q => {
    if (filterFn(q) && !isAnsweredYes(q, answers, ipData, technologyType))
      lacking.push(q);
  });
  dropdownQuestions.forEach(q =>
    lacking.push(
      ...dropdownLackingItems(q, answers[q.id], upToLevel).filter(filterFn),
    ),
  );
  mcQuestions.forEach(q =>
    lacking.push(
      ...multiConditionalLackingItems(q, answers[q.id], upToLevel).filter(filterFn),
    ),
  );

  return lacking;
}

// Main export

export function calculateTRL(
  allQuestions:   QuestionItem[],
  answers:        Record<string, AnswerValue>,
  ipData:         IPData,
  technologyType: string,
): TRLResult {
  const questions = [...allQuestions, ...buildIPQuestions(technologyType)];
  const { checkboxQuestions, dropdownQuestions, mcQuestions } = partitionByType(questions);

  const { highestCompletedTRL: rawCompleted, highestAchievableTRL, maxLevel } =
    scanLevels(questions, answers, ipData, technologyType);

  let highestCompletedTRL = rawCompleted;

  // Completed questions 
  const completedQuestions = buildCompletedList(
    checkboxQuestions, dropdownQuestions, mcQuestions,
    answers, ipData, technologyType,
  );

  // Lacking for next level 
  const nextLevel = highestCompletedTRL + 1;
  const lackingForNextLevel = nextLevel <= maxLevel
    ? buildLackingList(
        checkboxQuestions, dropdownQuestions, mcQuestions,
        answers, ipData, technologyType,
        nextLevel,
        q => q.trlLevel <= nextLevel,
      )
    : [];

  // Lacking for achievable 
  const lackingForAchievable = highestAchievableTRL > highestCompletedTRL
    ? buildLackingList(
        checkboxQuestions, dropdownQuestions, mcQuestions,
        answers, ipData, technologyType,
        highestAchievableTRL,
        q => q.trlLevel <= highestAchievableTRL,
      )
    : [];

  // Lacking to level 9 
  const lackingToLevel9 = buildLackingList(
    checkboxQuestions, dropdownQuestions, mcQuestions,
    answers, ipData, technologyType,
    9,
    q => q.trlLevel > highestCompletedTRL,
  );

  // TRL 9 promotion 
  // If the technology has answered everything needed to achieve TRL 9,
  // promote completed to 9 as well.
  if (highestAchievableTRL === 9 && highestCompletedTRL < 9)
    highestCompletedTRL = 9;

  return {
    highestCompletedTRL,
    highestAchievableTRL,
    completedQuestions,
    lackingForNextLevel,
    lackingForAchievable,
    lackingToLevel9,
  };
}

export type { TRLResult };
