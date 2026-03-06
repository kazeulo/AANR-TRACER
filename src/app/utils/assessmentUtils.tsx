// utils/assessmentUtils.ts
import { categoryOrder } from "./helperConstants";

export interface Answer {
  id: string;
  questionText: string;
  trlLevel: string;
  technologyType: string;
  category: string;
  checked: boolean;
}

export interface AssessmentResult {
  highestCompletedTRL: number;
  nextLevel: number;
  highestAchievableTRL: number;
  lackingForNextLevel: string[];
  lackingForAchievable: Record<number, string[]>;
  completedByCategory: Record<string, string[]>;
}

export function handleFinalAssessment(
  globalAnswers: Answer[],
  categories: string[] = categoryOrder,
  techType?: string
): AssessmentResult {
  const lackingForNextLevel: string[] = [];

  // Group answers by category
  const answersByCategory: Record<string, Answer[]> = {};
  categories.forEach(cat => {
    answersByCategory[cat] = globalAnswers.filter(q => q.category === cat);
  });

  // Max TRL allowed (optional, can customize)
  const maxAllowedTRL = 9;

  let highestCompletedTRL = 0;

  // Calculate highest completed TRL
  for (let level = 1; level <= 9; level++) {
    if (level > maxAllowedTRL) break;

    const levelSatisfied = categories.every(cat => {
      const levelItems = answersByCategory[cat].filter(q => Number(q.trlLevel) === level);
      return levelItems.length === 0 ? true : levelItems.every(q => q.checked === true);
    });

    if (levelSatisfied) highestCompletedTRL = level;
    else break;
  }

  const nextLevel = Math.min(highestCompletedTRL + 1, 9);

  // Highest achievable TRL (at least one checked)
  let highestAchievableTRL = 0;
  const lackingForAchievable: Record<number, string[]> = {};

  for (let level = 1; level <= 9; level++) {
    const levelItems = categories.flatMap(cat =>
      answersByCategory[cat].filter(q => Number(q.trlLevel) === level)
    );

    if (levelItems.length === 0) continue;

    const anyChecked = levelItems.some(q => q.checked === true);
    if (anyChecked) highestAchievableTRL = level;

    // Build lacking list
    const missingQuestions = levelItems.filter(q => !q.checked).map(q => q.questionText);
    if (missingQuestions.length > 0) lackingForAchievable[level] = missingQuestions;
  }

  // Build lacking for next level
  categories.forEach(cat => {
    const nextLevelItems = answersByCategory[cat].filter(q => Number(q.trlLevel) === nextLevel);
    nextLevelItems.filter(q => !q.checked).forEach(q => lackingForNextLevel.push(q.questionText));
  });

  // Completed by category
  const completedByCategory: Record<string, string[]> = {};
  categories.forEach(cat => {
    completedByCategory[cat] = [];
  });
  globalAnswers.filter(q => q.checked).forEach(q => {
    if (completedByCategory[q.category]) completedByCategory[q.category].push(q.questionText);
  });

  // Cap highestCompletedTRL if all TRL 9 checked
  if (highestAchievableTRL === 9) highestCompletedTRL = 9;

  return {
    highestCompletedTRL,
    nextLevel,
    highestAchievableTRL,
    lackingForNextLevel,
    lackingForAchievable,
    completedByCategory,
  };
}