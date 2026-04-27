import { IP_CATEGORY } from "../../../utils/ipHelpers";
import { buildPageGroups } from "../utils/buildPageGroups";
import type { Question } from "@/types/questions";

interface UseProgressBarProps {
  orderedCategories: string[];
  grouped: Record<string, Question[]>;
  currentCategoryIndex: number;
  currentPage: number;
}

export function useProgressBar({
  orderedCategories,
  grouped,
  currentCategoryIndex,
  currentPage,
}: UseProgressBarProps) {
  const countSteps = (cats: string[]) =>
    cats.reduce((acc, cat) => {
      if (cat === IP_CATEGORY) return acc + 1;
      return acc + buildPageGroups(grouped[cat] ?? []).length;
    }, 0);

  const totalSteps = countSteps(orderedCategories);
  const stepsCompleted = countSteps(orderedCategories.slice(0, currentCategoryIndex)) + currentPage;
  const progressPct = totalSteps > 0 ? Math.round((stepsCompleted / totalSteps) * 100) : 0;

  return { progressPct, totalSteps, stepsCompleted };
}