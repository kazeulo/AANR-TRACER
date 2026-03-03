"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";

export default function TechnologyNamePage() {
  const { data, updateData } = useAssessment();
  const router = useRouter();

  const handleNext = () => {
    if (!data.technologyName.trim()) return;
    router.push("/assessment/description");
  };

  return (
    <div className="h-[80vh] bg-[var(--bg-color-light)] py-20 px-6 lg:px-20 text-gray-800 flex flex-col justify-center">
        <div className="max-w-2xl mx-auto">
        
            {/* Title & Instructions */}
            <h1 className="text-4xl font-bold text-[var(--secondary-color)] text-center mb-8">
                Tell us about your technology
            </h1>
            <p className="text-gray-700 mb-16 text-center">
                Please provide some basic details about your innovation. This helps us tailor the assessment 
                and give you relevant recommendations.
            </p>

            {/* Input Section */}
            <label className="block mb-2 font-semibold text-gray-800">
                Technology Name
            </label>
            <input
                type="text"
                value={data.technologyName}
                onChange={(e) => updateData({ technologyName: e.target.value })}
                placeholder="Enter the name of your technology"
                className="w-full bg-white border border-gray-800 rounded-3xl p-3 focus:outline-none focus:ring-4 focus:ring-[var(--secondary-color)] focus:border-[var(--secondary-color)] mb-2"
            />
            <p className="text-sm text-gray-500 mb-16 text-center">
                Your technology name should preferably be short and clear, making it easy to recognize. 
                If you haven’t decided on a final name yet, you can enter a working or temporary name for now.
            </p>

            {/* Next Button */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={handleNext}
                    disabled={!data.technologyName.trim()}
                    className={`px-8 py-3 rounded-full font-semibold transition
                    ${data.technologyName.trim()
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