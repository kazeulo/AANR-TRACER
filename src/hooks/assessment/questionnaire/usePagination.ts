"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IP_CATEGORY } from "@/constants/ip";
import { buildPageGroups } from "@/lib/questionnaire/buildPageGroups";
import type { Question } from "@/types/questions";

interface UsePaginationProps {
  orderedCategories: string[];
  grouped: Record<string, Question[]>;
  lastCategoryIndex: number;
  lastPage: number;
  setLastCategoryIndex: (i: number) => void;
  setLastPage: (p: number) => void;
}

export function usePagination({
  orderedCategories,
  grouped,
  lastCategoryIndex,
  lastPage,
  setLastCategoryIndex,
  setLastPage,
}: UsePaginationProps) {
  const router = useRouter();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Restore position from context on load
  useEffect(() => {
    if (lastCategoryIndex >= 0 && lastPage >= 0 && orderedCategories.length > 0) {
      setCurrentCategoryIndex(Math.min(lastCategoryIndex, orderedCategories.length - 1));
      setCurrentPage(lastPage);
    }
  }, [lastCategoryIndex, lastPage, orderedCategories.length]);

  const currentCategory = orderedCategories[currentCategoryIndex] ?? "";
  const isIPCategory = currentCategory === IP_CATEGORY;
  const currentQuestions = grouped[currentCategory] ?? [];

  const pageGroups = useMemo(() => {
    if (isIPCategory) return [];
    return buildPageGroups(currentQuestions);
  }, [currentQuestions, isIPCategory]);

  const totalPages = isIPCategory ? 1 : pageGroups.length;

  const visibleQuestions = useMemo(() => {
    if (isIPCategory) return [];
    return pageGroups[currentPage] ?? [];
  }, [currentPage, pageGroups, isIPCategory]);

  const isLastStep =
    currentCategoryIndex === orderedCategories.length - 1 &&
    (isIPCategory || currentPage === totalPages - 1);

  const isPrevDisabled = currentCategoryIndex === 0 && currentPage === 0;

  const handleNext = () => {
    if (!isIPCategory && currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
      setLastCategoryIndex(currentCategoryIndex);
      setLastPage(currentPage + 1);
    } else if (currentCategoryIndex < orderedCategories.length - 1) {
      setCurrentCategoryIndex((c) => c + 1);
      setCurrentPage(0);
      setLastCategoryIndex(currentCategoryIndex + 1);
      setLastPage(0);
    } else {
      router.push("/assessment/summary");
    }
  };

  const handlePrev = () => {
    if (!isIPCategory && currentPage > 0) {
      setCurrentPage((p) => p - 1);
    } else if (currentCategoryIndex > 0) {
      const prevIndex = currentCategoryIndex - 1;
      const prevCat = orderedCategories[prevIndex];
      const prevQuestions = grouped[prevCat] ?? [];
      const prevPageGroups = prevCat === IP_CATEGORY ? [] : buildPageGroups(prevQuestions);
      setCurrentCategoryIndex(prevIndex);
      setCurrentPage(prevCat === IP_CATEGORY ? 0 : Math.max(0, prevPageGroups.length - 1));
    }
  };

  return {
    currentCategoryIndex,
    currentPage,
    currentCategory,
    isIPCategory,
    visibleQuestions,
    pageGroups,
    totalPages,
    isLastStep,
    isPrevDisabled,
    handleNext,
    handlePrev,
  };
}