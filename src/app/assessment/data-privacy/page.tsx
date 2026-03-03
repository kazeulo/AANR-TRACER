"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DataPrivacyNotice() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const handleProceed = () => {
    router.push("/assessment/name");
  };

  return (
    <div className="h-[80vh] bg-[var(--bg-color-light)] py-20 px-6 lg:px-10 text-gray-800 flex flex-col justify-center">
      <section className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-center text-4xl md:text-5xl font-bold text-[var(--secondary-color)] mb-14">
          DATA PRIVACY STATEMENT
        </h1>

        {/* Statement Text */}
        <p className="text-justify text-gray-700 mb-12">
          No information disclosed, entered, or encoded by the user while using this application is stored on 
          any platform, nor is it accessible to the application developer. Data storage occurs only if the user 
          voluntarily chooses to download or send a copy of their responses to a specified email address for their 
          own intended purpose. In such cases, the responsibility for saving and handling the data rests solely 
          with the user.
        </p>

        {/* ===== Checkbox & Proceed Button ===== */}
        <div className="flex flex-col items-center space-y-6">
          <label className="flex items-center space-x-3 cursor-pointer mb-5">
            <input 
              type="checkbox" 
              checked={accepted} 
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 text-[var(--secondary-color)] border-gray-300 rounded focus:ring-[var(--secondary-color)]"
            />
            <span className="text-gray-700">
              I have read and understood the information above and wish to proceed with the assessment
            </span>
          </label>

          <button
            onClick={handleProceed}
            disabled={!accepted}
            className={`px-10 py-3 rounded-3xl font-semibold text-white shadow-lg transition-all duration-300
              ${accepted 
                ? "bg-[var(--secondary-color)] hover:scale-105 hover:shadow-2xl" 
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Proceed
          </button>
        </div>
      </section>
    </div>
  );
}