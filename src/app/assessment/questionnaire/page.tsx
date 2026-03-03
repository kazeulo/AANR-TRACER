"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { useAssessment } from "../AssessmentContext";

interface Question {
  id: string;
  questionText: string;
  trlLevel: string;
  technologyType: string;
  category: string;
  toolTip?: string;
}

export default function QuestionnairePage() {
  const { data, updateData } = useAssessment();
  const [grouped, setGrouped] = useState<Record<string, Question[]>>({});
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const questionsPerPage = 5;

  useEffect(() => {
    const loadCSV = async () => {
      const res = await fetch("/questions.csv");
      const csvText = await res.text();

      const result = Papa.parse<Omit<Question, "id">>(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      // Filter by selected technology type
      const filteredData = result.data.filter(
        (q) => q.technologyType === data.technologyType
      );

      // Assign unique IDs
      const dataWithIds: Question[] = filteredData.map((item, index) => ({
        ...item,
        id: `${item.category}-${index}`,
      }));

      // Group by category
      const groupedData: Record<string, Question[]> = {};
      const order: string[] = [];

      dataWithIds.forEach((item) => {
        if (!groupedData[item.category]) {
          groupedData[item.category] = [];
          order.push(item.category);
        }
        groupedData[item.category].push(item);
      });

      setGrouped(groupedData);
      setCategoryOrder(order);
      setCurrentCategoryIndex(0);
      setCurrentPage(0);
      setLoading(false);
    };

    if (data.technologyType) {
      setLoading(true);
      loadCSV();
    }
  }, [String(data.technologyType)]);

  const currentCategory = categoryOrder[currentCategoryIndex] ?? "";
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
      setCurrentPage((prev) => prev + 1);
    } else if (currentCategoryIndex < categoryOrder.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
      setCurrentPage(0);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    } else if (currentCategoryIndex > 0) {
      const prevIndex = currentCategoryIndex - 1;
      const prevCategory = grouped[categoryOrder[prevIndex]] ?? [];
      const lastPage = Math.ceil(prevCategory.length / questionsPerPage) - 1;
      setCurrentCategoryIndex(prevIndex);
      setCurrentPage(lastPage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading assessment...</p>
      </div>
    );
  }

  if (categoryOrder.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          No questions available for the selected technology type.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl h-[80vh] mx-auto p-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[var(--secondary-color)]">
            Technology Readiness Assessment
          </h1>
          <div className="mt-4 text-sm text-gray-500">
            Category {currentCategoryIndex + 1} of {categoryOrder.length} • Page{" "}
            {currentPage + 1} of {totalPages || 1}
          </div>
        </div>

        {/* Category Heading */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">{currentCategory}</h2>
          <div className="h-1 w-20 bg-[var(--secondary-color)] mt-2 rounded" />
        </div>

        {/* Questions without card */}
        <div className="space-y-6">
          {visibleQuestions.map((q) => (
            <label
              key={q.id}
              className="flex items-start gap-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors"
              title={q.toolTip ?? ""}
            >
              <input
                type="checkbox"
                checked={data.answers[q.id] ?? false}
                onChange={() => handleCheckbox(q.id)}
                className="mt-1 w-5 h-5 accent-[var(--secondary-color)] flex-shrink-0"
              />
              <span className="text-gray-700 text-sm leading-snug">
                {q.questionText}
              </span>
            </label>
          ))}
        </div>

        {/* Navigation Buttons */}
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
            disabled={
              currentCategoryIndex === categoryOrder.length - 1 &&
              currentPage === totalPages - 1
            }
            className="px-8 py-2 rounded-full bg-[var(--secondary-color)] text-white hover:scale-105 transition disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}