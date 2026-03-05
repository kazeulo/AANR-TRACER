"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";

export default function FundingSourcePage() {
  const { data, updateData } = useAssessment();
  const router = useRouter();

  const handleNext = () => {
    if (!data.fundingSource) return;
    router.push("/assessment/questionnaire");
  };

  return (
    <div className="h-[80vh] bg-[var(--bg-color-light)] py-20 px-6 lg:px-20 text-gray-800 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold text-[var(--secondary-color)] text-center mb-8">
          Funding Source
        </h1>

        {/* Instructions */}
        <p className="text-gray-700 mb-16 text-center">
          Please indicate the primary source of funding for the development of your technology.
          This helps us understand the background and support behind the innovation.
        </p>

        {/* Select Section */}
        <label className="block mb-2 font-semibold text-gray-800">
          Funding Source
        </label>

        <select
          value={data.fundingSource || ""}
          onChange={(e) => updateData({ fundingSource: e.target.value })}
          className="w-full bg-white border border-gray-800 rounded-3xl p-3 focus:outline-none focus:ring-4 focus:ring-[var(--secondary-color)] focus:border-[var(--secondary-color)] mb-16"
        >
          <option value="">Select...</option>
          <option value="Government">Government</option>
          <option value="Private">Private</option>
          <option value="Not funded yet">Not funded yet</option>
        </select>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          
          {/* Previous */}
          <button
            onClick={() => router.push("/assessment/description")}
            className="px-8 py-3 rounded-full font-semibold bg-red-900 text-white hover:bg-red-700 transition"
          >
            Previous
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={!data.fundingSource}
            className={`px-8 py-3 rounded-full font-semibold transition
              ${
                data.fundingSource
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