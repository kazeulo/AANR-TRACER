"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";
import { useState } from "react";

export default function TechnologyDescriptionPage() {
  const { data, updateData } = useAssessment();
  const router = useRouter();
  const maxWords = 300;

  const [wordCount, setWordCount] = useState<number>(
    data.technologyDescription.trim() ? data.technologyDescription.trim().split(/\s+/).length : 0
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) {
      updateData({ technologyDescription: text });
      setWordCount(words.length);
    }
  };

  const handleNext = () => {
    if (!data.technologyDescription.trim()) return;
    router.push("/assessment/funding-source");
  };

  return (
    <div className="h-[80vh] bg-[var(--bg-color-light)] py-20 px-6 lg:px-20 text-gray-800 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto">

        {/* Title & Instructions */}
        <h1 className="text-4xl font-bold text-[var(--secondary-color)] text-center mb-8">
          Describe Your Technology
        </h1>
        <p className="text-gray-700 mb-16 text-center">
          Please provide a brief description of your technology (max {maxWords} words). This helps us understand the context of your innovation
          and tailor the assessment questions to your technology type.
        </p>

        {/* Textarea Section */}
        <label className="block mb-2 font-semibold text-gray-800">
          Technology Description
        </label>
        <textarea
          value={data.technologyDescription}
          onChange={handleChange}
          placeholder="Enter a short description of your technology"
          className="w-full bg-white border border-gray-800 rounded-3xl p-3 min-h-[150px] focus:outline-none focus:ring-4 focus:ring-[var(--secondary-color)] focus:border-[var(--secondary-color)] mb-2"
        />
        <p className="text-sm text-gray-500 mb-6 text-right">
          {wordCount} / {maxWords} words
        </p>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {/* Previous Button */}
          <button
            onClick={() => router.push("/assessment/name")}
            className="px-8 py-3 rounded-full font-semibold bg-red-900 border border-gray-400 text-white hover:bg-gray-100 transition"
          >
            Previous
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!data.technologyDescription.trim()}
            className={`px-8 py-3 rounded-full font-semibold transition
              ${data.technologyDescription.trim()
                ? "bg-[var(--secondary-color)] text-white hover:scale-105"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}