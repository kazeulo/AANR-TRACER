import { useRef, useEffect, useState } from "react";
import type { JSX } from "react";
import { TRLResult, QuestionItem } from "../../utils/trlCalculator";

/* ─── Types ───────────────────────────────────────── */

export interface ExportFormData {
  name: string;
  email: string;
  role: string;
  organization: string;
}

/* ─── TRL Maps ────────────────────────────────────── */

export const TRL_LABELS: Record<number, string> = {
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

export const TRL_COLORS: Record<number, string> = {
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

/* ─── PDF Export Hook ─────────────────────────────── */

export function usePDFExport() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [exportForm, setExportForm] = useState<ExportFormData | null>(null);

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
          backgroundColor: "#ffffff",
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
      }
    };

    const t = setTimeout(generate, 300);
    return () => clearTimeout(t);
  }, [exportForm]);

  const triggerExport = (form: ExportFormData) => setExportForm(form);

  return { pdfRef, exporting, exportForm, triggerExport };
}

/* ─── PDF Content Component ───────────────────────── */

interface PDFContentProps {
  result: TRLResult;
  techName?: string;
  techType?: string;
  techDescription?: string;
  form: ExportFormData;
}

const s = {
  page: {
    width: 794,
    backgroundColor: "#ffffff",
    fontFamily: "Georgia, 'Times New Roman', serif",
    padding: "56px 64px",
    boxSizing: "border-box" as const,
    color: "#111",
    fontSize: 13,
    lineHeight: 1.6,
  },
  hr: {
    border: "none",
    borderTop: "1px solid #ccc",
    margin: "18px 0",
  },
  hrThick: {
    border: "none",
    borderTop: "2px solid #111",
    margin: "0 0 18px",
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    color: "#444",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    margin: "22px 0 10px",
    color: "#111",
  },
  row: {
    display: "flex",
    gap: 8,
    marginBottom: 5,
    alignItems: "flex-start",
  },
  bullet: {
    flexShrink: 0,
    marginTop: 5,
    width: 5,
    height: 5,
    borderRadius: "50%",
    backgroundColor: "#444",
  },
  trlBadge: (color: string) => ({
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    color,
    border: `1px solid ${color}`,
    padding: "1px 7px",
    borderRadius: 3,
    marginBottom: 6,
    marginTop: 10,
  }),
};

function QuestionSection({
  title,
  questions,
}: {
  title: string;
  questions: QuestionItem[];
}) {
  if (questions.length === 0) return null;

  const byLevel: Record<number, QuestionItem[]> = {};
  questions.forEach(q => {
    if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
    byLevel[q.trlLevel].push(q);
  });
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  return (
    <div>
      <div style={s.sectionTitle}>{title}</div>
      <div style={s.hr} />
      {levels.map(level => (
        <div key={level}>
          <div style={s.trlBadge(TRL_COLORS[level] ?? "#444")}>
            TRL {level} — {TRL_LABELS[level]}
          </div>
          {byLevel[level].map(q => (
            <div key={q.id} style={s.row}>
              <div style={s.bullet} />
              <span style={{ fontSize: 12, color: "#222" }}>{q.questionText}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function PDFContent({
  result,
  techName,
  techType,
  techDescription,
  form,
}: PDFContentProps): JSX.Element {
  const {
    highestCompletedTRL,
    highestAchievableTRL,
    completedQuestions,
    lackingForAchievable,
    lackingForNextLevel,
  } = result;

  const hasGap = highestAchievableTRL > highestCompletedTRL;
  const isMaxed = highestCompletedTRL === 9;

  return (
    <div style={s.page}>

      {/* ── Letterhead ── */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
          DOST-PCAARRD
        </div>
        <div style={{ fontSize: 12, color: "#333", marginTop: 3, lineHeight: 1.5 }}>
          Philippine Council for Agriculture, Aquatic and Natural Resources<br />
          Research and Development
        </div>
      </div>

      <div style={s.hrThick} />

      {/* ── Report Title ── */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", lineHeight: 1.3 }}>
          Technology Readiness Level<br />Assessment Report
        </div>
      </div>

      <div style={s.hr} />

      {/* ── Technology Details ── */}
      <div style={s.sectionTitle}>Technology Details</div>
      <div style={{ marginBottom: 5 }}>
        <span style={s.label}>Technology Name: </span>
        <span>{techName || "—"}</span>
      </div>
      <div style={{ marginBottom: 5 }}>
        <span style={s.label}>Technology Domain: </span>
        <span>{techType || "—"}</span>
      </div>
      <div style={{ marginBottom: 5 }}>
        <span style={s.label}>Technology Description: </span>
        <span>{techDescription || "—"}</span>
      </div>

      <div style={s.hr} />

      {/* ── Assessment Taken By ── */}
      <div style={s.sectionTitle}>Assessment Taken By</div>
      <div style={{ marginBottom: 3 }}>
        <span style={s.label}>Name: </span><span>{form.name}</span>
      </div>
      <div style={{ marginBottom: 3 }}>
        <span style={s.label}>Email: </span><span>{form.email}</span>
      </div>
      {form.role && (
        <div style={{ marginBottom: 3 }}>
          <span style={s.label}>Role: </span><span>{form.role}</span>
        </div>
      )}
      {form.organization && (
        <div style={{ marginBottom: 3 }}>
          <span style={s.label}>Organization: </span><span>{form.organization}</span>
        </div>
      )}

      <div style={s.hr} />

      {/* ── TRL Results ── */}
      <div style={s.sectionTitle}>Assessment Results</div>
      <div style={{ marginBottom: 5 }}>
        <span style={s.label}>Highest Completed TRL: </span>
        <span style={{ fontWeight: 700 }}>
          TRL {highestCompletedTRL} — {TRL_LABELS[highestCompletedTRL] ?? "—"}
        </span>
      </div>
      {hasGap && (
        <div style={{ marginBottom: 5 }}>
          <span style={s.label}>Highest Achievable TRL: </span>
          <span style={{ fontWeight: 700 }}>
            TRL {highestAchievableTRL} — {TRL_LABELS[highestAchievableTRL] ?? "—"}
          </span>
        </div>
      )}

      <div style={s.hr} />

      {/* ── Completed Questions ── */}
      <QuestionSection title="Completed Questions" questions={completedQuestions} />

      <div style={s.hr} />

      {/* ── Lacking / Next Steps ── */}
      {isMaxed ? (
        <div>
          <div style={s.sectionTitle}>Next Steps</div>
          <div style={s.hr} />
          <p style={{ fontSize: 13, color: "#333", fontStyle: "italic" }}>
            Your technology has reached full commercialization (TRL 9). No further steps required.
          </p>
        </div>
      ) : hasGap ? (
        <QuestionSection
          title={`Lacking to Reach Highest Achievable (TRL ${highestAchievableTRL})`}
          questions={lackingForAchievable}
        />
      ) : (
        <QuestionSection
          title={`Lacking for Next Level (TRL ${highestCompletedTRL + 1})`}
          questions={lackingForNextLevel}
        />
      )}

      {/* ── Footer ── */}
      <div style={{ ...s.hr, marginTop: 32 }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#888" }}>
        <span>
          Generated on {new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
        </span>
        <span>AANR-TRacer · DOST-PCAARRD</span>
      </div>

    </div>
  );
}