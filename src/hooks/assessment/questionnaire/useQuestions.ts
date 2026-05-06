"use client";

import { useEffect, useState } from "react";

import { getQuestionsJSON } from "@/app/utils/questionsCache";
import { categoryOrder } from "@/constants/categories";
import { IP_CATEGORY } from "@/constants/ip";
import type { Question } from "@/types/questions";

const questionsCache: Record<string, Record<string, Question[]>> = {};

export function useQuestions(technologyType: string, lastCategoryIndex: number, lastPage: number) {
  const [grouped, setGrouped] = useState<Record<string, Question[]>>({});
  const [orderedCategories, setOrderedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!technologyType) return;

    const applyGrouped = (groupedData: Record<string, Question[]>) => {
      const ordered = categoryOrder.filter(
        (cat) => cat === IP_CATEGORY || (groupedData[cat]?.length > 0)
      );
      setGrouped(groupedData);
      setOrderedCategories(ordered);
      setLoading(false);
    };

    if (questionsCache[technologyType]) {
      applyGrouped(questionsCache[technologyType]);
      return;
    }

    setLoading(true);
    const load = async () => {
      const allGrouped = await getQuestionsJSON() as Record<string, Record<string, Question[]>>;
      const byLevel = allGrouped[technologyType] ?? {};
      const flat: Question[] = Object.values(byLevel).flat();

      const seen = new Set<string>();
      const uniqueFlat = flat.filter((q) => {
        if (seen.has(q.id)) return false;
        seen.add(q.id);
        return true;
      });

      const groupedData: Record<string, Question[]> = {};
      uniqueFlat.forEach((q) => {
        if (!groupedData[q.category]) groupedData[q.category] = [];
        groupedData[q.category].push(q);
      });

      questionsCache[technologyType] = groupedData;
      applyGrouped(groupedData);
    };

    load();
  }, [technologyType]);

  return { grouped, orderedCategories, loading };
}