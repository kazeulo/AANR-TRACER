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
  1: "Concept & Market Definition",
  2: "Design / Formulation / Prototype Planning",
  3: "Prototype Development & Laboratory Testing",
  4: "Controlled Validation & IP Filing",
  5: "Pilot Testing & Industry Engagement",
  6: "Multi-location Testing & Scale-up Preparation",
  7: "Industry Validation & Regulatory Submission",
  8: "Commercial Production Readiness",
  9: "Full Commercialization",
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

/* PDF Export Hook */

export function usePDFExport() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting]     = useState(false);
  const [exportForm, setExportForm]   = useState<ExportFormData | null>(null);

  useEffect(() => {
    if (!exportForm || !pdfRef.current) return;

    const generate = async () => {
      setExporting(true);
      try {
        const html2canvas = (await import("html2canvas")).default;
        const jsPDF       = (await import("jspdf")).default;

        const canvas = await html2canvas(pdfRef.current!, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const pdf   = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();

        const marginTop    = 48;
        const marginBottom = 40;
        const contentH     = pageH - marginTop - marginBottom;

        const scale = pageW / canvas.width;
        const totalH = canvas.height * scale;

        const container  = pdfRef.current!;
        const containerTop = container.getBoundingClientRect().top;

        const allEls = Array.from(container.querySelectorAll<HTMLElement>(
          "div, p, span, img, hr"
        ));

        // bottom positions in pdf px, sorted ascending
        const breakCandidates = allEls
          .map(el => {
            const r = el.getBoundingClientRect();
            return (r.bottom - containerTop);
          })
          .filter(y => y > 0 && y < totalH)
          .sort((a, b) => a - b);

        // Build actual page break positions: for each page, find the largest
        // safe break point that fits within contentH of where the page starts
        const pageBreaks: number[] = [0]; // srcY positions in pdf px
        while (true) {
          const pageStart = pageBreaks[pageBreaks.length - 1];
          const idealEnd  = pageStart + contentH;
          if (idealEnd >= totalH) break;

          // Find the last safe candidate that fits before idealEnd
          // Leave a small buffer (8px) so the cut isn't right at the element edge
          const safeBreak = breakCandidates
            .filter(y => y > pageStart + 20 && y <= idealEnd - 8)
            .pop(); // largest value that fits

          pageBreaks.push(safeBreak ?? idealEnd); // fallback to hard cut if no candidate
        }

        // Render each page slice 
        const offscreen = document.createElement("canvas");
        offscreen.width = canvas.width;

        for (let i = 0; i < pageBreaks.length; i++) {

          const startPdfY = pageBreaks[i];
          const endPdfY   = pageBreaks[i + 1] ?? totalH;

          const slicePdfH = endPdfY - startPdfY;

          // convert pdf units → canvas pixels
          const startPx   = startPdfY / scale;
          const slicePxH  = slicePdfH / scale;

          offscreen.height = Math.ceil(slicePxH);

          const ctx = offscreen.getContext("2d")!;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, offscreen.width, offscreen.height);

          ctx.drawImage(
            canvas,
            0, startPx,
            canvas.width, slicePxH,
            0, 0,
            canvas.width, slicePxH
          );

          if (i > 0) pdf.addPage();

          pdf.addImage(
            offscreen.toDataURL("image/png"),
            "PNG",
            0,
            marginTop,
            pageW,
            slicePdfH
          );
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

/* Design tokens  */

// A4 at 96 dpi ≈ 794px wide
// Margins: 72px left/right (≈ 1 inch), 64px top/bottom
const FONT  = "'Calibri', 'Gill Sans', 'Trebuchet MS', Arial, sans-serif";
const ML    = 72;   // margin left  (px)
const MR    = 72;   // margin right (px)
const MT    = 60;   // margin top
const MB    = 60;  // margin bottom — increased to prevent content clipping
const INNER = 794 - ML - MR; // usable width

const t = {
  page: {
    width: 794,
    boxSizing: "border-box" as const,
    backgroundColor: "#ffffff",
    fontFamily: FONT,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: ML,
    paddingRight: MR,
    color: "#111",
    fontSize: 12,
    lineHeight: 1.6,
  } as React.CSSProperties,

  hr: {
    border: "none",
    borderTop: "1px solid #d0d0d0",
    margin: "14px 0",
  } as React.CSSProperties,

  hrThick: {
    border: "none",
    borderTop: "2px solid #111",
    margin: "14px 0",
  } as React.CSSProperties,

  sectionLabel: {
    fontSize: 10,
    fontWeight: 700 as const,
    textTransform: "uppercase" as const,
    letterSpacing: 1.2,
    color: "#555",
    marginBottom: 6,
    marginTop: 18,
  } as React.CSSProperties,

  fieldRow: {
    display: "flex",
    gap: 0,
    marginBottom: 4,
    fontSize: 12,
  } as React.CSSProperties,

  fieldKey: {
    fontWeight: 700 as const,
    minWidth: 180,
    color: "#333",
  } as React.CSSProperties,

  fieldVal: {
    color: "#111",
    flex: 1,
  } as React.CSSProperties,

  trlLevelLabel: {
    fontSize: 11,
    fontWeight: 700 as const,
    color: "#333",
    marginTop: 12,
    marginBottom: 4,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  } as React.CSSProperties,

  bulletRow: {
    display: "flex",
    gap: 8,
    marginBottom: 4,
    alignItems: "flex-start",
    paddingLeft: 8,
  } as React.CSSProperties,

  bulletDot: {
    flexShrink: 0,
    marginTop: 6,
    width: 3,
    height: 3,
    borderRadius: "50%",
    backgroundColor: "#444",
  } as React.CSSProperties,
};

/* PDF Content Component */

interface PDFContentProps {
  result: TRLResult;
  techName?: string;
  techType?: string;
  techDescription?: string;
  form: ExportFormData;
}

function QuestionSection({ title, questions }: { title: string; questions: QuestionItem[] }) {
  if (questions.length === 0) return null;

  const byLevel: Record<number, QuestionItem[]> = {};
  questions.forEach(q => {
    if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
    byLevel[q.trlLevel].push(q);
  });
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  return (
    <div>
      <div style={t.sectionLabel}>{title}</div>
      <div style={t.hr} />
      {levels.map(level => (
        <div key={level}>
          {/* Plain text TRL level — no badge, no color */}
          <div style={t.trlLevelLabel}>TRL {level} — {TRL_LABELS[level]}</div>
          {byLevel[level].map(q => (
            <div key={q.id} style={t.bulletRow}>
              <div style={t.bulletDot} />
              <span style={{ fontSize: 12, color: "#222", lineHeight: 1.6 }}>{q.questionText}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function PDFContent({ result, techName, techType, techDescription, form }: PDFContentProps): JSX.Element {
  const { highestCompletedTRL, highestAchievableTRL, completedQuestions, lackingForAchievable, lackingForNextLevel } = result;
  const hasGap = highestAchievableTRL > highestCompletedTRL;
  const isMaxed = highestCompletedTRL === 9;

  return (
    <div style={t.page}>

      {/* ── Header: logo + agency name, right-aligned as a group ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14, marginBottom: 20 }}>

        {/* Agency text — right-aligned */}
        <div style={{ fontFamily: FONT, lineHeight: 1.5, textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
            DOST-PCAARRD
          </div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>
            Philippine Council for Agriculture, Aquatic
          </div>
          <div style={{ fontSize: 11, color: "#444" }}>
            and Natural Resources Research and Development
          </div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>
            Los Baños, Laguna, Philippines
          </div>
        </div>

        {/* Logo — right of the agency name */}
        <img
          src="/img/logos/dost-pcaarrd-logo.png"
          alt="DOST-PCAARRD"
          style={{ height: 56, width: "auto", objectFit: "contain", flexShrink: 0 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>

      {/* Thick rule below header */}
      <div style={t.hrThick} />

      {/* Report title — left aligned */}
      <div style={{ marginBottom: 18 }}>
        <div style={{
          fontFamily: FONT,
          fontSize: 16,
          fontWeight: 700,
          color: "#111",
          lineHeight: 1.3,
          letterSpacing: 0.3,
        }}>
          Technology Readiness Level
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: 16,
          fontWeight: 700,
          color: "#111",
          lineHeight: 1.3,
          letterSpacing: 0.3,
        }}>
          Assessment Report
        </div>
        <div style={{ fontSize: 10, color: "#777", marginTop: 4 }}>
          Generated on {new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      <div style={t.hr} />

      {/* ── Technology Details ── */}
      <div style={t.sectionLabel}>Technology Details</div>
      <div style={t.hr} />
      <div style={t.fieldRow}>
        <span style={t.fieldKey}>Technology Name:</span>
        <span style={t.fieldVal}>{techName || "—"}</span>
      </div>
      <div style={t.fieldRow}>
        <span style={t.fieldKey}>Technology Domain:</span>
        <span style={t.fieldVal}>{techType || "—"}</span>
      </div>
      <div style={t.fieldRow}>
        <span style={t.fieldKey}>Description:</span>
        <span style={t.fieldVal}>{techDescription || "—"}</span>
      </div>

      <div style={t.hr} />

      {/* ── Assessment Taken By ── */}
      <div style={t.sectionLabel}>Assessment Taken By</div>
      <div style={t.hr} />
      <div style={t.fieldRow}>
        <span style={t.fieldKey}>Name:</span>
        <span style={t.fieldVal}>{form.name}</span>
      </div>
      <div style={t.fieldRow}>
        <span style={t.fieldKey}>Email:</span>
        <span style={t.fieldVal}>{form.email}</span>
      </div>
      {form.role && (
        <div style={t.fieldRow}>
          <span style={t.fieldKey}>Role / Position:</span>
          <span style={t.fieldVal}>{form.role}</span>
        </div>
      )}
      {form.organization && (
        <div style={t.fieldRow}>
          <span style={t.fieldKey}>Organization:</span>
          <span style={t.fieldVal}>{form.organization}</span>
        </div>
      )}

      <div style={t.hr} />

      {/* ── Assessment Results ── */}
      <div style={t.sectionLabel}>Assessment Results</div>
      <div style={t.hr} />
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        border: "1.5px solid #2d7a3a",
        borderRadius: 6,
        padding: "10px 14px",
        marginBottom: 8,
      }}>
        <div style={{
          fontWeight: 700,
          fontSize: 20,
          color: "#2d7a3a",
          lineHeight: 1.2,
          letterSpacing: 0.5,
          flexShrink: 0,
          minWidth: 60,
        }}>
          TRL {highestCompletedTRL}
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#2d7a3a", marginBottom: 2 }}>
            Highest Completed TRL
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
            {TRL_LABELS[highestCompletedTRL] ?? "—"}
          </div>
        </div>
      </div>
      {hasGap && (
        <div style={t.fieldRow}>
          <span style={t.fieldKey}>Highest Achievable TRL:</span>
          <span style={{ ...t.fieldVal, fontWeight: 700 }}>
            TRL {highestAchievableTRL} — {TRL_LABELS[highestAchievableTRL] ?? "—"}
          </span>
        </div>
      )}

      <div style={t.hr} />

      {/* ── Completed Questions ── */}
      <QuestionSection title="Completed Questions" questions={completedQuestions} />

      <div style={t.hr} />

      {/* ── Lacking / Next Steps ── */}
      {isMaxed ? (
        <div>
          <div style={t.sectionLabel}>Next Steps</div>
          <div style={t.hr} />
          <p style={{ fontSize: 11, color: "#333", fontStyle: "italic" }}>
            Your technology has reached full commercialization (TRL 9). No further steps are required.
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
      <div style={{ ...t.hr, marginTop: 32 }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#999" }}>
        <span>AANR-TRacer · DOST-PCAARRD</span>
        <span>This report is system-generated and for reference purposes only.</span>
      </div>

      {/* Bottom spacer — ensures last line has breathing room before pdf margin */}
      <div style={{ height: 24 }} />

    </div>
  );
}