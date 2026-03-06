"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import { useAssessment } from "../AssessmentContext";
import { categoryOrder } from "../../utils/helperConstants";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  questionText: string;
  trlLevel: string;
  technologyType: string;
  category: string;
}

export default function SummaryPage() {
  const { data, updateData, lastCategoryIndex, lastPage } = useAssessment();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const loadCSV = async () => {
      const res = await fetch("/questions.csv");
      const csvText = await res.text();

      const result = Papa.parse<Omit<Question, "id">>(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      const filtered = result.data.filter(
        (q) => q.technologyType === data.technologyType
      );

      const withIds: Question[] = filtered.map((item, index) => ({
        ...item,
        id: `${item.category}-${index}`,
      }));

      setQuestions(withIds);
      setLoading(false);
    };

    loadCSV();
  }, [data.technologyType]);

  const handleSubmit = () => {
    console.log("Submitting assessment data:", data);
    alert("Assessment submitted successfully!");
    router.push("/"); // Redirect after submission, to be edited
  };

  const handlePrevious = () => {
    router.push(`/assessment/questionnaire?category=${lastCategoryIndex}&page=${lastPage}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading summary...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold text-[var(--secondary-color)] mb-10">
          Assessment Summary
        </h1>

        <div className="bg-yellow-50 border text-sm border-yellow-300 text-yellow-800 p-4 rounded-lg mb-10">
          Please carefully review your answers before submitting.
        </div>

        {/* Technology Info */}
        <div className="mb-10 space-y-6 bg-white p-6 rounded-xl shadow-sm">

          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Technology Name
            </label>
            <input
              type="text"
              value={data.technologyName}
              onChange={(e) =>
                updateData({ technologyName: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Technology Type
            </label>
            <select
              value={data.technologyType}
              onChange={(e) =>
                updateData({ technologyType: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
            >
              <option value="">Select Technology Type</option>
              <option value="New Animal Breed (Aquatic and Terrestrial)">
                New Animal Breed (Aquatic and Terrestrial)
              </option>
              <option value="Crop Variety / Plant Technology">
                Crop Variety / Plant Technology
              </option>
              <option value="Machinery / Equipment">
                Machinery / Equipment
              </option>
              <option value="ICT (Apps and System involving IoT)">
                ICT (Apps and System involving IoT)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Funding Source
            </label>
            <select
              value={data.fundingSource}
              onChange={(e) =>
                updateData({ fundingSource: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
            >
              <option value="">Select Funding Source</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Not Funded Yet">Not Funded Yet</option>
            </select>
          </div>

        </div>

        {/* Questions */}
        <div className="space-y-8">
          {categoryOrder.map((category) => {
            const categoryQuestions = questions.filter(
              (q) => q.category === category
            );

            if (categoryQuestions.length === 0) return null;

            return (
              <div key={category} className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  {category}
                </h2>

                <ul className="space-y-3 text-sm">
                  {categoryQuestions.map((q) => {
                    const checked = data.answers[q.id] ?? false;

                    return (
                      <li key={q.id} className="flex gap-3">
                        <span
                          className={
                            checked
                              ? "text-green-600 font-bold"
                              : "text-gray-400 font-bold"
                          }
                        >
                          {checked ? "✔" : "✖"}
                        </span>

                        <span
                          className={
                            checked ? "text-gray-800" : "text-gray-500"
                          }
                        >
                          {q.questionText}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-12">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            Previous
          </button>

          <button
            onClick={handleSubmit}
            className="px-8 py-2 rounded-full bg-[var(--secondary-color)] text-white hover:scale-105 transition"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}