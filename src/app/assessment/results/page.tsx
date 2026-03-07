"use client";

import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { useAssessment } from "../AssessmentContext";
import { calculateTRL, QuestionItem, TRLResult } from "../../utils/trlCalculator";

// ─── TRL Maps ─────────────────────────────────────────────────────────────────

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
      <div className="text-5xl font-black tracking-tight" style={{ color }}>
        {level === 0 ? "—" : level}
      </div>
      <div className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</div>
      {level > 0 && <div className="text-xs text-gray-500 font-medium">{TRL_LABELS[level]}</div>}
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
              className="w-full rounded-sm"
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
  forPDF = false,
}: {
  title: string;
  questions: QuestionItem[];
  accent: string;
  icon: string;
  defaultOpen?: boolean;
  forPDF?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isOpen = forPDF ? true : open;

  const byLevel: Record<number, QuestionItem[]> = {};
  questions.forEach(q => {
    if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
    byLevel[q.trlLevel].push(q);
  });
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => !forPDF && setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
        style={{ cursor: forPDF ? "default" : "pointer" }}
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
        {!forPDF && <span className="text-gray-400 text-lg">{isOpen ? "▲" : "▼"}</span>}
      </button>

      {isOpen && (
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

function AchievableBanner({
  completedTRL,
  achievableTRL,
  lackingItems,
  achievableColor,
  forPDF = false,
}: {
  completedTRL: number;
  achievableTRL: number;
  lackingItems: QuestionItem[];
  achievableColor: string;
  forPDF?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isOpen = forPDF ? true : open;

  const byLevel: Record<number, QuestionItem[]> = {};
  lackingItems.forEach(q => {
    if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
    byLevel[q.trlLevel].push(q);
  });
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  return (
    <div
      className="rounded-2xl border-2 overflow-hidden shadow-sm"
      style={{ borderColor: achievableColor + "55" }}
    >
      <div className="px-6 py-5" style={{ backgroundColor: achievableColor + "12" }}>
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
            style={{ backgroundColor: achievableColor + "22" }}
          >
            🚀
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: achievableColor }}>
              Potential Identified
            </p>
            <p className="text-gray-800 font-semibold text-base leading-snug">
              Although your technology is currently at{" "}
              <span className="font-black" style={{ color: TRL_COLORS[completedTRL] ?? "#64748b" }}>
                TRL {completedTRL}
              </span>
              {completedTRL > 0 ? ` (${TRL_LABELS[completedTRL]})` : ""}, you have already
              demonstrated progress that could bring you to{" "}
              <span className="font-black" style={{ color: achievableColor }}>
                TRL {achievableTRL}
              </span>{" "}
              ({TRL_LABELS[achievableTRL]}).
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Complete the{" "}
              <strong className="text-gray-700">
                {lackingItems.length} item{lackingItems.length !== 1 ? "s" : ""}
              </strong>{" "}
              below to fully reach your highest achievable level.
            </p>
          </div>
        </div>

        {!forPDF && (
          <button
            onClick={() => setOpen(o => !o)}
            className="mt-4 w-full flex items-center justify-between text-sm font-semibold px-4 py-2.5 rounded-xl transition"
            style={{ backgroundColor: achievableColor + "18", color: achievableColor }}
          >
            <span>{isOpen ? "Hide" : "Show"} what you need to complete</span>
            <span>{isOpen ? "▲" : "▼"}</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="px-6 py-5 bg-white space-y-5">
          {levels.map(level => (
            <div key={level}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: TRL_COLORS[level] ?? "#64748b" }}
                >
                  TRL {level}
                </span>
                <span className="text-xs text-gray-400 font-medium">{TRL_LABELS[level]}</span>
                <span className="text-xs text-gray-300 ml-auto">
                  {byLevel[level].length} item{byLevel[level].length !== 1 ? "s" : ""}
                </span>
              </div>
              <ul className="space-y-2">
                {byLevel[level].map(q => (
                  <li key={q.id} className="flex items-start gap-2 text-sm text-gray-600">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: achievableColor }}
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

// ─── Export Modal ─────────────────────────────────────────────────────────────

interface ExportFormData {
  name: string;
  email: string;
  role: string;
  organization: string;
}

function ExportModal({
  onClose,
  onExport,
  exporting,
}: {
  onClose: () => void;
  onExport: (form: ExportFormData) => void;
  exporting: boolean;
}) {
  const [form, setForm] = useState<ExportFormData>({ name: "", email: "", role: "", organization: "" });
  const [errors, setErrors] = useState<Partial<ExportFormData>>({});

  const validate = () => {
    const e: Partial<ExportFormData> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onExport(form);
  };

  const field = (
    key: keyof ExportFormData,
    label: string,
    placeholder: string,
    required = false,
    type = "text"
  ) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}{" "}
        {required
          ? <span className="text-red-400">*</span>
          : <span className="text-gray-300 font-normal">(optional)</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={e => {
          setForm(f => ({ ...f, [key]: e.target.value }));
          if (required) setErrors(er => ({ ...er, [key]: "" }));
        }}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] transition ${
          errors[key] ? "border-red-300 bg-red-50" : "border-gray-200"
        }`}
      />
      {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !exporting && onClose()} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10">
        <button
          onClick={() => !exporting && onClose()}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition"
        >
          ✕
        </button>

        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3"
            style={{ backgroundColor: "var(--secondary-color)", opacity: 0.9 }}>
            📄
          </div>
          <h2 className="text-xl font-black text-gray-900">Export Results as PDF</h2>
          <p className="text-sm text-gray-400 mt-1">Enter your details to include in the report.</p>
        </div>

        <div className="space-y-4">
          {field("name", "Full Name", "e.g. Juan dela Cruz", true)}
          {field("email", "Email Address", "e.g. juan@example.com", true, "email")}
          {field("role", "Role / Position", "e.g. Researcher, Project Lead")}
          {field("organization", "Organization / Company", "e.g. DOST, State University")}
        </div>

        <div className="flex gap-3 mt-7">
          <button
            onClick={() => !exporting && onClose()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={exporting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--secondary-color)] text-white text-sm font-semibold hover:scale-105 transition disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating…
              </>
            ) : (
              "Download PDF"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PDF Content (rendered off-screen, captured by html2canvas) ───────────────

function PDFContent({
  result,
  techName,
  techType,
  form,
  completedColor,
  achievableColor,
  gap,
}: {
  result: TRLResult;
  techName: string;
  techType: string;
  form: ExportFormData;
  completedColor: string;
  achievableColor: string;
  gap: number;
}) {
  const sections = [
    { title: "✅ Completed Questions", questions: result.completedQuestions, accent: "#10b981" },
    result.lackingForAchievable.length > 0
      ? { title: `🎯 Lacking to Reach TRL ${result.highestAchievableTRL}`, questions: result.lackingForAchievable, accent: "#3b82f6" }
      : { title: `📋 Lacking for Next Level (TRL ${result.highestCompletedTRL + 1})`, questions: result.lackingForNextLevel, accent: "#f97316" },
  ];

  return (
    <div style={{ width: 794, backgroundColor: "#f9fafb", fontFamily: "system-ui, sans-serif", padding: "48px 56px", boxSizing: "border-box" }}>

      {/* Report Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#9ca3af", textTransform: "uppercase", margin: "0 0 4px" }}>
          TRL Assessment Report
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#111827", lineHeight: 1.2, margin: 0 }}>
          Technology Readiness Level Report
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "6px 0 0" }}>{techType}</p>
        {techName && <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "2px 0 0" }}>{techName}</p>}
        <div style={{ height: 3, backgroundColor: completedColor, width: 60, borderRadius: 2, marginTop: 12 }} />
      </div>

      {/* Submitted By */}
      <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "16px 20px", marginBottom: 24 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px" }}>
          Submitted by
        </p>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {[
            { label: "Name", value: form.name },
            { label: "Email", value: form.email },
            ...(form.role ? [{ label: "Role", value: form.role }] : []),
            ...(form.organization ? [{ label: "Organization", value: form.organization }] : []),
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{label}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Score Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {[
          { level: result.highestCompletedTRL, label: "Highest Completed TRL", color: completedColor },
          { level: result.highestAchievableTRL, label: "Highest Achievable TRL", color: achievableColor },
        ].map(({ level, label, color }) => (
          <div key={label} style={{ flex: 1, backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "20px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 900, color, lineHeight: 1 }}>{level || "—"}</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#9ca3af", textTransform: "uppercase", marginTop: 6 }}>{label}</div>
            {level > 0 && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{TRL_LABELS[level]}</div>}
            <div style={{ height: 6, backgroundColor: "#f3f4f6", borderRadius: 4, marginTop: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(level / 9) * 100}%`, backgroundColor: color, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Achievable Banner */}
      {gap > 0 && (
        <div style={{ borderRadius: 16, border: `2px solid ${achievableColor}55`, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ backgroundColor: achievableColor + "12", padding: "20px 24px" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ fontSize: 28, lineHeight: 1 }}>🚀</span>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: achievableColor, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 4px" }}>
                  Potential Identified
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", margin: 0, lineHeight: 1.5 }}>
                  Although your technology is currently at TRL {result.highestCompletedTRL}
                  {result.highestCompletedTRL > 0 ? ` (${TRL_LABELS[result.highestCompletedTRL]})` : ""},
                  you have already demonstrated progress that could bring you to TRL {result.highestAchievableTRL} ({TRL_LABELS[result.highestAchievableTRL]}).
                </p>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 0" }}>
                  Complete the {result.lackingForAchievable.length} item{result.lackingForAchievable.length !== 1 ? "s" : ""} listed below to fully reach your highest achievable level.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question sections */}
      {sections.map(({ title, questions, accent }) => {
        const byLevel: Record<number, QuestionItem[]> = {};
        questions.forEach(q => {
          if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
          byLevel[q.trlLevel].push(q);
        });
        const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

        return (
          <div key={title} style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", marginBottom: 16, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>{title}</span>
              <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: accent, color: "#fff", padding: "2px 8px", borderRadius: 999 }}>
                {questions.length}
              </span>
            </div>
            <div style={{ padding: "12px 20px 16px" }}>
              {levels.map(level => (
                <div key={level} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: TRL_COLORS[level] ?? "#64748b", color: "#fff", padding: "2px 8px", borderRadius: 999 }}>
                      TRL {level}
                    </span>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{TRL_LABELS[level]}</span>
                  </div>
                  {byLevel[level].map(q => (
                    <div key={q.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: accent, flexShrink: 0, marginTop: 5 }} />
                      <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.5 }}>{q.questionText}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
          Generated on {new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>TRL Assessment System</p>
      </div>
    </div>
  );
}

// ─── Main Results Page ────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { data } = useAssessment();
  const router = useRouter();
  const [result, setResult] = useState<TRLResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportForm, setExportForm] = useState<ExportFormData | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/questions.csv");
      const csvText = await res.text();
      const parsed = Papa.parse<{ questionText: string; trlLevel: string; technologyType: string; category: string }>(
        csvText, { header: true, skipEmptyLines: true }
      );
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

  // Generate PDF once exportForm is set and PDFContent is rendered
  useEffect(() => {
    if (!exportForm || !pdfRef.current) return;
    const generate = async () => {
      setExporting(true);
      try {
        const html2canvas = (await import("html2canvas")).default;
        const jsPDF = (await import("jspdf")).default;

        const canvas = await html2canvas(pdfRef.current!, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#f9fafb",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const imgH = (canvas.height * pageW) / canvas.width;

        let y = 0;
        while (y < imgH) {
          if (y > 0) pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, -y, pageW, imgH);
          y += pageH;
        }

        const safeName = exportForm.name.replace(/\s+/g, "_").toLowerCase();
        pdf.save(`trl_report_${safeName}.pdf`);
      } finally {
        setExporting(false);
        setExportForm(null);
        setShowModal(false);
      }
    };
    const t = setTimeout(generate, 300);
    return () => clearTimeout(t);
  }, [exportForm]);

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

        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Assessment Results</p>
          <h1 className="text-4xl font-black text-gray-900 leading-tight">
            Technology Readiness<br />
            <span style={{ color: completedColor }}>Level Report</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">{data.technologyType}</p>
          {data.technologyName && <p className="text-sm font-semibold text-gray-700 mt-0.5">{data.technologyName}</p>}
        </div>

        {/* Step Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Progress Overview</p>
          <TRLStepBar completed={result.highestCompletedTRL} achievable={result.highestAchievableTRL} />
          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: completedColor }} />Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm border border-blue-300 bg-blue-100 inline-block" />Achievable
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gray-100 inline-block" />Not reached
            </span>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <TRLGauge level={result.highestCompletedTRL} label="Highest Completed TRL" color={completedColor} />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <TRLGauge level={result.highestAchievableTRL} label="Highest Achievable TRL" color={achievableColor} />
          </div>
        </div>

        {/* Achievable Banner */}
        {gap > 0 && (
          <AchievableBanner
            completedTRL={result.highestCompletedTRL}
            achievableTRL={result.highestAchievableTRL}
            lackingItems={result.lackingForAchievable}
            achievableColor={achievableColor}
          />
        )}

        {gap === 0 && result.highestCompletedTRL === 9 && (
          <div className="rounded-2xl bg-green-50 border border-green-100 px-6 py-4">
            <p className="text-sm text-green-700 font-semibold">
              🎉 Congratulations! Your technology has reached full commercialization (TRL 9).
            </p>
          </div>
        )}

        {/* Breakdown */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-700">Detailed Breakdown</h2>
          <QuestionGroup title="Completed Questions" questions={result.completedQuestions} accent="#10b981" icon="✅" defaultOpen={false} />
          {result.lackingForAchievable.length > 0 ? (
            <QuestionGroup
              title={`Lacking to Reach Highest Achievable (TRL ${result.highestAchievableTRL})`}
              questions={result.lackingForAchievable} accent="#3b82f6" icon="🎯" defaultOpen={true}
            />
          ) : (
            <QuestionGroup
              title={`Lacking for Next Level (TRL ${result.highestCompletedTRL + 1})`}
              questions={result.lackingForNextLevel} accent="#f97316" icon="📋" defaultOpen={true}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2 pb-10">
          <button
            onClick={() => router.push("/assessment/questionnaire")}
            className="px-6 py-2.5 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            ← Back to Assessment
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 rounded-full bg-[var(--secondary-color)] text-white text-sm font-semibold hover:scale-105 transition flex items-center gap-2"
          >
            📄 Export as PDF
          </button>
        </div>
      </div>

      {/* Export Modal */}
      {showModal && (
        <ExportModal
          onClose={() => !exporting && setShowModal(false)}
          onExport={form => setExportForm(form)}
          exporting={exporting}
        />
      )}

      {/* Hidden PDF render target */}
      {exportForm && result && (
        <div style={{ position: "fixed", top: 0, left: "-9999px", zIndex: -1, pointerEvents: "none" }}>
          <div ref={pdfRef}>
            <PDFContent
              result={result}
              techName={data.technologyName}
              techType={data.technologyType}
              form={exportForm}
              completedColor={completedColor}
              achievableColor={achievableColor}
              gap={gap}
            />
          </div>
        </div>
      )}
    </div>
  );
}