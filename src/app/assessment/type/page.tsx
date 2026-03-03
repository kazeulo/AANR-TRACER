"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";
import { useEffect, useState } from "react";
import Papa from "papaparse";

interface Question {
  questionText: string;
  trlLevel: string;
  technologyType: string;
  category: string;
  toolTip?: string;
}

export default function TechnologyTypePage() {
  const { data, updateData } = useAssessment();
  const router = useRouter();

  const [technologyTypes, setTechnologyTypes] = useState<string[]>([]);

  useEffect(() => {
    const loadCSV = async () => {
      const res = await fetch("/questions.csv");
      const csvText = await res.text();

      const result = Papa.parse<Question>(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      const types = Array.from(
        new Set(result.data.map((q) => q.technologyType))
      ).filter(Boolean); // remove empty strings

      setTechnologyTypes(types);
    };

    loadCSV();
  }, []);

  const handleNext = () => {
    if (!data.technologyType) return;
    router.push("/assessment/questionnaire");
  };

  return (
    <div className="h-[80vh] bg-[var(--bg-color-light)] py-20 px-6 lg:px-20 text-gray-800 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto">

        {/* Title & Instructions */}
        <h1 className="text-4xl font-bold text-[var(--secondary-color)] text-center mb-8">
          Select Technology Type
        </h1>
        <p className="text-gray-700 mb-16 text-center">
          Please select the type of technology you are assessing. This helps us tailor the questionnaire and 
          provide relevant recommendations based on the category of your innovation.
        </p>

        {/* Select Section */}
        <label className="block mb-2 font-semibold text-gray-800">
          Technology Type
        </label>
        <select
          value={data.technologyType}
          onChange={(e) => updateData({ technologyType: e.target.value })}
          className="w-full bg-white border border-gray-800 rounded-3xl p-3 focus:outline-none focus:ring-4 focus:ring-[var(--secondary-color)] focus:border-[var(--secondary-color)] mb-2"
        >
          <option value="">Select...</option>
          {technologyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <p className="text-sm text-gray-500 mb-16 text-center">
          If you’re unsure which category best fits your technology, select each option to view a brief description. 
          You can also view detailed category descriptions and examples{" "}
          <a className="underline text-blue-600" href="../../terms">here</a>.
        </p>

        {/* Next Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleNext}
            disabled={!data.technologyType}
            className={`px-8 py-3 rounded-full font-semibold transition
              ${data.technologyType
                ? "bg-[var(--secondary-color)] text-white hover:scale-105"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
          >
            Start Questionnaire
          </button>
        </div>

      </div>
    </div>
  );
}