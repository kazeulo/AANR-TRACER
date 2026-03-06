"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";
import { calculateTRL, QuestionItem, TRLResult } from "../../utils/trlCalculator";

// ─── TRL label map ────────────────────────────────────────────────────────────

const TRL_LABELS: Record<number, string> = {
  1: "Basic Research",
  2: "Applied Research",
  3: "Proof of Concept",
  4: "Lab Validation",
  5: "Pilot Validation",
  6: "Industry Demonstration",
  7: "Pre-commercial",
  8: "Commercial Ready",
  9: "Fully Commercialized",
};

const TRL_COLORS: Record<number, string> = {
  1: "#94a3b8",
  2: "#64748b",
  3: "#f59e0b",
  4: "#f97316",
  5: "#10b981",
  6: "#06b6d4",
  7: "#3b82f6",
  8: "#8b5cf6",
  9: "#22c55e",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TRLGauge({ level, label, color }: { level: number; label: string; color: string }) {
  const pct = (level / 9) * 100;
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="text-5xl font-black tracking-tight"
        style={{ color }}
      >
        {level === 0 ? "—" : level}
      </div>
      <div className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</div>
      {level > 0 && (
        <div className="text-xs text-gray-500 font-medium">{TRL_LABELS[level]}</div>
      )}
      <div className="w-full h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function TRLStepBar({ completed, achievable }: { completed: number; achievable: number }) {
  return (
    <div className="flex gap-1 items-end">
      {Array.from({ length: 9 }, (_, i) => {
        const level = i + 1;
        const isCompleted = level <= completed;
        const isAchievable = !isCompleted && level <= achievable;
        const color = isCompleted
          ? TRL_COLORS[completed] ?? "#10b981"
          : isAchievable
          ? "#bfdbfe"
          : "#f1f5f9";
        const height = 8 + level * 4;
        return (
          <div key={level} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full rounded-sm transition-all duration-700"
              style={{
                height,
                backgroundColor: color,
                border: isAchievable ? "1.5px solid #93c5fd" : "none",
              }}
            />
            <span className="text-[9px] font-bold text-gray-400">{level}</span>
          </div>
        );
      })}
    </div>
  );
}

function QuestionGroup({
  title,
  questions,
  accent,
  icon,
  defaultOpen = false,
}: {
  title: string;
  questions: QuestionItem[];
  accent: string;
  icon: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  // Group by TRL level
  const byLevel: Record<number, QuestionItem[]> = {};
  questions.forEach(q => {
    if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
    byLevel[q.trlLevel].push(q);
  });
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div>
            <span className="font-semibold text-gray-800 text-sm">{title}</span>
            <span
              className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: accent }}
            >
              {questions.length}
            </span>
          </div>
        </div>
        <span className="text-gray-400 text-lg">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-6 pb-5 space-y-4 border-t border-gray-50">
          {levels.map(level => (
            <div key={level} className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: TRL_COLORS[level] ?? "#64748b" }}
                >
                  TRL {level}
                </span>
                <span className="text-xs text-gray-400">{TRL_LABELS[level]}</span>
              </div>
              <ul className="space-y-2">
                {byLevel[level].map(q => (
                  <li key={q.id} className="flex items-start gap-2 text-sm text-gray-600">
                    <span
                      className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: accent }}
                    />
                    <span>{q.questionText}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Results Page ────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { data } = useAssessment();
  const router = useRouter();
  const [result, setResult] = useState<TRLResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/questions.csv");
      const csvText = await res.text();

      const parsed = Papa.parse<{
        questionText: string;
        trlLevel: string;
        technologyType: string;
        category: string;
      }>(csvText, { header: true, skipEmptyLines: true });

      const questions: QuestionItem[] = parsed.data
        .filter(q => q.technologyType === data.technologyType)
        .map((q, i) => ({
          id: `${q.category}-${i}`,
          questionText: q.questionText,
          trlLevel: parseInt(q.trlLevel, 10),
          category: q.category,
        }));

      const calc = calculateTRL(questions, data.answers, data.ipData, data.technologyType);
      setResult(calc);
      setLoading(false);
    };

    run();
  }, [data]);

  if (loading || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[var(--secondary-color)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Calculating your TRL...</p>
        </div>
      </div>
    );
  }

  const completedColor = TRL_COLORS[result.highestCompletedTRL] ?? "#94a3b8";
  const achievableColor = TRL_COLORS[result.highestAchievableTRL] ?? "#3b82f6";
  const gap = result.highestAchievableTRL - result.highestCompletedTRL;

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
            Assessment Results
          </p>
          <h1 className="text-4xl font-black text-gray-900 leading-tight">
            Technology Readiness<br />
            <span style={{ color: completedColor }}>Level Report</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">{data.technologyType}</p>
        </div>

        {/* ── TRL Step Bar ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Progress Overview
          </p>
          <TRLStepBar completed={result.highestCompletedTRL} achievable={result.highestAchievableTRL} />
          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: completedColor }} />
              Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm border border-blue-300 bg-blue-100 inline-block" />
              Achievable
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gray-100 inline-block" />
              Not reached
            </span>
          </div>
        </div>

        {/* ── Score Cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <TRLGauge
              level={result.highestCompletedTRL}
              label="Highest Completed TRL"
              color={completedColor}
            />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <TRLGauge
              level={result.highestAchievableTRL}
              label="Highest Achievable TRL"
              color={achievableColor}
            />
          </div>
        </div>

        {/* ── Gap Callout ───────────────────────────────────────────── */}
        {gap > 0 && (
          <div className="rounded-2xl bg-blue-50 border border-blue-100 px-6 py-4 flex items-center gap-4">
            <span className="text-3xl font-black text-blue-400">+{gap}</span>
            <p className="text-sm text-blue-700">
              TRL levels of potential growth identified. Complete the items below to bridge
              the gap between your completed and achievable levels.
            </p>
          </div>
        )}

        {gap === 0 && result.highestCompletedTRL === 9 && (
          <div className="rounded-2xl bg-green-50 border border-green-100 px-6 py-4">
            <p className="text-sm text-green-700 font-semibold">
              🎉 Congratulations! Your technology has reached full commercialization (TRL 9).
            </p>
          </div>
        )}

        {/* ── Question Breakdowns ───────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-700">Detailed Breakdown</h2>

          <QuestionGroup
            title="Completed Questions"
            questions={result.completedQuestions}
            accent="#10b981"
            icon="✅"
            defaultOpen={false}
          />

          <QuestionGroup
            title={`Lacking for Next Level (TRL ${result.highestCompletedTRL + 1})`}
            questions={result.lackingForNextLevel}
            accent="#f97316"
            icon="📋"
            defaultOpen={true}
          />

          {result.lackingForAchievable.length > 0 && (
            <QuestionGroup
              title={`Lacking to Reach Highest Achievable (TRL ${result.highestAchievableTRL})`}
              questions={result.lackingForAchievable}
              accent="#3b82f6"
              icon="🎯"
              defaultOpen={false}
            />
          )}
        </div>

        {/* ── Actions ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 pt-2 pb-10">
          <button
            onClick={() => router.push("/assessment/questionnaire")}
            className="px-6 py-2.5 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            ← Back to Assessment
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 rounded-full bg-[var(--secondary-color)] text-white text-sm hover:scale-105 transition"
          >
            Print / Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}