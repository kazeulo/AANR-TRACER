"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { useAssessment } from "../AssessmentContext";
import { categoryOrder, categoryDescriptions } from "../../utils/helperConstants";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  questionText: string;
  trlLevel: string;
  technologyType: string;
  category: string;
  toolTip?: string;
}

export default function QuestionnairePage() {
  const { data, updateData, lastCategoryIndex, setLastCategoryIndex, lastPage, setLastPage } = useAssessment();
  const router = useRouter();

  const [grouped, setGrouped] = useState<Record<string, Question[]>>({});
  const [orderedCategories, setOrderedCategories] = useState<string[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const questionsPerPage = 5;

  // Load CSV and group questions
  useEffect(() => {
    const loadCSV = async () => {
      const res = await fetch("/questions.csv");
      const csvText = await res.text();

      const result = Papa.parse<Omit<Question, "id">>(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      const filtered = result.data.filter(q => q.technologyType === data.technologyType);

      const withIds: Question[] = filtered.map((item, index) => ({
        ...item,
        id: `${item.category}-${index}`,
      }));

      const groupedData: Record<string, Question[]> = {};
      withIds.forEach(q => {
        if (!groupedData[q.category]) groupedData[q.category] = [];
        groupedData[q.category].push(q);
      });

      const ordered = categoryOrder.filter(cat => groupedData[cat] && groupedData[cat].length > 0);

      setGrouped(groupedData);
      setOrderedCategories(ordered);

      // Restore last position if exists
      if (lastCategoryIndex < ordered.length && lastPage >= 0) {
        setCurrentCategoryIndex(lastCategoryIndex);
        setCurrentPage(lastPage);
      } else {
        setCurrentCategoryIndex(0);
        setCurrentPage(0);
      }

      setLoading(false);
    };

    if (data.technologyType) {
      setLoading(true);
      loadCSV();
    }
  }, [data.technologyType, lastCategoryIndex, lastPage]);

  const currentCategory = orderedCategories[currentCategoryIndex] ?? "";
  const currentQuestions = grouped[currentCategory] ?? [];
  const totalPages = Math.ceil(currentQuestions.length / questionsPerPage);

  const visibleQuestions = useMemo(() => {
    const start = currentPage * questionsPerPage;
    return currentQuestions.slice(start, start + questionsPerPage);
  }, [currentPage, currentQuestions]);

  const handleCheckbox = (id: string) => {
    updateData({
      answers: { ...data.answers, [id]: !data.answers[id] },
    });
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(p => p + 1);
      setLastCategoryIndex(currentCategoryIndex);
      setLastPage(currentPage + 1);
    } else if (currentCategoryIndex < orderedCategories.length - 1) {
      setCurrentCategoryIndex(c => c + 1);
      setCurrentPage(0);
      setLastCategoryIndex(currentCategoryIndex + 1);
      setLastPage(0);
    } else {
      router.push("/assessment/summary");
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
    } else if (currentCategoryIndex > 0) {
      const prevIndex = currentCategoryIndex - 1;
      const prevCategory = grouped[orderedCategories[prevIndex]] ?? [];
      const lastPageOfPrev = Math.ceil(prevCategory.length / questionsPerPage) - 1;
      setCurrentCategoryIndex(prevIndex);
      setCurrentPage(lastPageOfPrev);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading assessment...</p>
      </div>
    );
  }

  if (orderedCategories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          No questions available for the selected technology type.
        </p>
      </div>
    );
  }

  // Progress calculation for all questions
  const allQuestions = Object.values(grouped).flat();
  const lastVisibleId = visibleQuestions[visibleQuestions.length - 1]?.id ?? "";
  const completedIndex = allQuestions.findIndex(q => q.id === lastVisibleId);
  const progressPercent =
    allQuestions.length > 0 ? ((completedIndex + 1) / allQuestions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto p-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[var(--secondary-color)]">
            Technology Readiness Level Assessment
          </h1>
          <div className="mt-2 text-sm text-gray-500">
            Category {currentCategoryIndex + 1} of {orderedCategories.length} • Page {currentPage + 1} of {totalPages || 1}
          </div>
        </div>

        {/* Progress Bar */}
        {/* <div className="mb-6">
          <div className="w-full bg-gray-200 h-4 rounded-full">
            <div
              className="bg-[var(--secondary-color)] h-4 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.min(completedIndex + 1, allQuestions.length)} of {allQuestions.length} questions completed
          </div>
        </div> */}

        {/* Category Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700">{currentCategory}</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">{categoryDescriptions[currentCategory]}</p>
          <div className="h-1 w-20 bg-[var(--secondary-color)] mt-3 rounded" />
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {visibleQuestions.map(q => (
            <label
              key={q.id}
              className="flex items-start gap-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition"
              title={q.toolTip ?? ""}
            >
              <input
                type="checkbox"
                checked={data.answers[q.id] ?? false}
                onChange={() => handleCheckbox(q.id)}
                className="mt-1 w-5 h-5 accent-[var(--secondary-color)] flex-shrink-0"
              />
              <span className="text-gray-700 text-sm leading-snug">{q.questionText}</span>
            </label>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <button
            onClick={handlePrev}
            disabled={currentCategoryIndex === 0 && currentPage === 0}
            className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-2 rounded-full bg-[var(--secondary-color)] text-white hover:scale-105 transition"
          >
            {currentCategoryIndex === orderedCategories.length - 1 && currentPage === totalPages - 1
              ? "Finish Assessment"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}