"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { useAssessment, IPData } from "../AssessmentContext";
import { categoryOrder, categoryDescriptions } from "../../utils/helperConstants";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  id: string;
  questionText: string;
  trlLevel: string;
  technologyType: string;
  category: string;
  toolTip?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLANT_ANIMAL_TYPES = [
  "New Plant Variety (Conventional)",
  "New Plant Variety (Gene-Edited and GM)",
  "New Animal Breed (Aquatic and Terrestrial)",
];

const IP_INITIATED_LABEL = "Intellectual Property (IP) Initiated";
const IP_FILED_LABEL = "IP Filed or Registered";
const IP_CATEGORY = "Intellectual Property Protection Status";

const IP_TYPES = [
  "Patent - Product",
  "Patent - Process",
  "Utility Model - Product",
  "Utility Model - Process",
  "Industrial Design",
  "Trademark",
  "Copyright",
];

const IP_STATUS_OPTIONS = [
  "Pending for Review/Drafting",
  "Filed",
  "Registered",
];

const REGION_CONTACTS = [
  { label: "Region I", email: "region1.email.com" },
  { label: "Region II", email: "region2.email.com" },
  { label: "Region III", email: "region3.email.com" },
  { label: "Region IV-A (CALABARZON)", email: "region4a.email.com" },
  { label: "Region IV-B (MIMAROPA)", email: "region4b.email.com" },
  { label: "Region V", email: "region5.email.com" },
  { label: "Region VI", email: "region6.email.com" },
  { label: "Region VII", email: "region7.email.com" },
  { label: "Region VIII", email: "region8.email.com" },
  { label: "Region IX", email: "region9.email.com" },
  { label: "Region X", email: "region10.email.com" },
  { label: "Region XI", email: "region11.email.com" },
  { label: "Region XII", email: "region12.email.com" },
  { label: "Region XIII (CARAGA)", email: "region13.email.com" },
  { label: "National Capital Region (NCR)", email: "ncr.email.com" },
  { label: "Cordillera Administrative Region (CAR)", email: "car.email.com" },
  { label: "BARMM", email: "barmm.email.com" },
];

// ─── IP Section Sub-component ─────────────────────────────────────────────────

interface IPSectionProps {
  label: string;
  ipData: IPData;
  onChange: (updated: IPData) => void;
}

function IPSection({ label, ipData, onChange }: IPSectionProps) {
  const key = label;
  const current = ipData[key] ?? {
    initiated: "",
    selectedTypes: {},
    typeStatuses: {},
  };

  const setField = (field: string, value: unknown) => {
    onChange({ ...ipData, [key]: { ...current, [field]: value } });
  };

  const handleTypeToggle = (ipType: string) => {
    const isChecked = current.selectedTypes[ipType] ?? false;
    const updatedTypes = { ...current.selectedTypes, [ipType]: !isChecked };
    const updatedStatuses = { ...current.typeStatuses };
    if (isChecked) delete updatedStatuses[ipType]; // clear status on uncheck
    onChange({ ...ipData, [key]: { ...current, selectedTypes: updatedTypes, typeStatuses: updatedStatuses } });
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
      <p className="text-gray-700 text-sm font-medium mb-3">{label}</p>

      {/* Main dropdown */}
      <select
        value={current.initiated}
        onChange={e => setField("initiated", e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] bg-white"
      >
        <option value="">Select an option </option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
        <option value="trade_secret">IP is a Trade Secret</option>
      </select>

      {/* YES → checkboxes + per-type status dropdown */}
      {current.initiated === "yes" && (
        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Select IP Protection Type(s)
          </p>
          {IP_TYPES.map(ipType => {
            const isChecked = current.selectedTypes[ipType] ?? false;
            return (
              <div key={ipType} className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleTypeToggle(ipType)}
                    className="w-4 h-4 accent-[var(--secondary-color)]"
                  />
                  <span className="text-sm text-gray-700">{ipType}</span>
                </label>

                {/* Status dropdown — only shown when this type is checked */}
                {isChecked && (
                  <div className="ml-7">
                    <select
                      value={current.typeStatuses[ipType] ?? ""}
                      onChange={e =>
                        setField("typeStatuses", { ...current.typeStatuses, [ipType]: e.target.value })
                      }
                      className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] bg-white"
                    >
                      <option value="">IP Protection Status </option>
                      {IP_STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* NO */}
      {current.initiated === "no" && (
        <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm space-y-3">
          <p className="font-medium text-amber-800">
            Protecting your technology is an important step to support its further development.
          </p>
          <p className="text-gray-600">
            Below are the contact details of the Regional Offices for your reference, where you
            may ask for guidance or help in filing your intellectual property protection.
          </p>
          <ul className="space-y-1">
            {REGION_CONTACTS.map(r => (
              <li key={r.label} className="flex gap-1 text-sm">
                <span className="font-medium text-gray-700">{r.label} –</span>
                <a href={`mailto:${r.email}`} className="text-[var(--secondary-color)] hover:underline">
                  {r.email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TRADE SECRET */}
      {current.initiated === "trade_secret" && (
        <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          Your technology is protected as a <strong>Trade Secret</strong>. Ensure that appropriate
          confidentiality measures and non-disclosure agreements are in place to maintain its protection.
        </div>
      )}
    </div>
  );
}

// Main page

export default function QuestionnairePage() {
  const { data, updateData, lastCategoryIndex, setLastCategoryIndex, lastPage, setLastPage } = useAssessment();
  const router = useRouter();

  const [grouped, setGrouped] = useState<Record<string, Question[]>>({});
  const [orderedCategories, setOrderedCategories] = useState<string[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const questionsPerPage = 5;
  const isPlantAnimal = PLANT_ANIMAL_TYPES.includes(data.technologyType ?? "");

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

      // Always inject IP category at its fixed position in categoryOrder
      const ordered = categoryOrder.filter(
        cat => cat === IP_CATEGORY || (groupedData[cat] && groupedData[cat].length > 0)
      );

      setGrouped(groupedData);
      setOrderedCategories(ordered);

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
  const isIPCategory = currentCategory === IP_CATEGORY;
  const currentQuestions = grouped[currentCategory] ?? [];
  const totalPages = isIPCategory ? 1 : Math.ceil(currentQuestions.length / questionsPerPage);

  const visibleQuestions = useMemo(() => {
    if (isIPCategory) return [];
    const start = currentPage * questionsPerPage;
    return currentQuestions.slice(start, start + questionsPerPage);
  }, [currentPage, currentQuestions, isIPCategory]);

  const handleCheckbox = (id: string) => {
    updateData({ answers: { ...data.answers, [id]: !data.answers[id] } });
  };

  const handleIPChange = (updated: IPData) => {
    updateData({ ipData: updated });
  };

  const handleNext = () => {
    if (!isIPCategory && currentPage < totalPages - 1) {
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
    if (!isIPCategory && currentPage > 0) {
      setCurrentPage(p => p - 1);
    } else if (currentCategoryIndex > 0) {
      const prevIndex = currentCategoryIndex - 1;
      const prevCat = orderedCategories[prevIndex];
      const prevQuestions = grouped[prevCat] ?? [];
      const lastPageOfPrev =
        prevCat === IP_CATEGORY ? 0 : Math.ceil(prevQuestions.length / questionsPerPage) - 1;
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
        <p className="text-gray-500">No questions available for the selected technology type.</p>
      </div>
    );
  }

  const isLastStep =
    currentCategoryIndex === orderedCategories.length - 1 &&
    (isIPCategory || currentPage === totalPages - 1);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto p-10">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[var(--secondary-color)]">
            Technology Readiness Level Assessment
          </h1>
          <div className="mt-2 text-sm text-gray-500">
            Category {currentCategoryIndex + 1} of {orderedCategories.length}
            {!isIPCategory && ` • Page ${currentPage + 1} of ${totalPages || 1}`}
          </div>
        </div>

        {/* Category Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700">{currentCategory}</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            {categoryDescriptions[currentCategory]}
          </p>
          <div className="h-1 w-20 bg-[var(--secondary-color)] mt-3 rounded" />
        </div>

        {/* ── IP Category ───────────────────────────────────────── */}
        {isIPCategory ? (
          <div className="space-y-6">
            <IPSection
              label={IP_INITIATED_LABEL}
              ipData={data.ipData}
              onChange={handleIPChange}
            />
          </div>
        ) : (
          /* ── Regular Questions ────────────────────────────────── */
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
        )}

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
            {isLastStep ? "Finish Assessment" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}