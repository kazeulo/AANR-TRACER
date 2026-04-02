"use client";

import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { TRLResult, QuestionItem } from "../../../utils/trlCalculator";
import { RoadmapGroup } from "../FetchRecommendation";
import { TRACER_DESCRIPTIONS } from "../../../utils/tracerDescriptions";

/*    ─ Types  */

export interface ExportFormData {
  name:         string;
  email:        string;
  role:         string;
  organization: string;
}

export interface PDFContentProps {
  result:           TRLResult;
  techName?:        string;
  techType?:        string;
  techDescription?: string;
  fundingSource?:   string;
  form:             ExportFormData;
  roadmap?:         RoadmapGroup[];
  closing?:         string;
}

/*    ─ TRL Maps   ─ */

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

/** Returns the TRACER level title for the given tech type, falling back to TRL_LABELS. */
function getLevelTitle(techType: string | undefined, level: number): string {
  return TRACER_DESCRIPTIONS[techType ?? ""]?.[level]?.title ?? TRL_LABELS[level] ?? "";
}

/** Returns the TRACER level description for the given tech type, or empty string. */
function getLevelDescription(techType: string | undefined, level: number): string {
  return TRACER_DESCRIPTIONS[techType ?? ""]?.[level]?.description ?? "";
}

export const TRL_COLORS: Record<number, string> = {
  1: "#94a3b8", 2: "#64748b", 3: "#f59e0b", 4: "#f97316",
  5: "#10b981", 6: "#06b6d4", 7: "#3b82f6", 8: "#8b5cf6", 9: "#22c55e",
};

/*    ─ Hook ─ */

export function usePDFExport() {
  const [exporting,  setExporting]  = useState(false);
  const [exportForm, setExportForm] = useState<ExportFormData | null>(null);

  // pdfRef kept for API compatibility — not used with react-pdf
  const pdfRef = { current: null } as unknown as React.RefObject<HTMLDivElement>;

  const triggerExport = (form: ExportFormData) => setExportForm(form);
  const clearForm     = () => setExportForm(null);

  return { pdfRef, exporting, setExporting, exportForm, triggerExport, clearForm };
}

/*    ─ PDF Document (react-pdf)    ────────────────────────────────────────── */
// Loaded dynamically so it never runs on the server.
// Call generateAndDownloadPDF() from a client component.

export async function generatePDFBlob(props: PDFContentProps): Promise<Blob> {
  // Dynamic imports — keeps the bundle lean
  const { pdf, Document, Page, Text, View, Image, StyleSheet, Font } =
    await import("@react-pdf/renderer");

  //     Fonts ─
  // Use built-in Helvetica

  //     Styles 
  const s = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: 10,
      color: "#111111",
      paddingTop: 48,
      paddingBottom: 56,
      paddingHorizontal: 52,
      backgroundColor: "#ffffff",
    },

    //     Header    
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
      marginBottom: 10,
    },
    agencyBlock: {
      flexDirection: "column",
    },
    agencyName: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      color: "#111111",
    },
    agencySubtitle: {
      fontSize: 8.5,
      color: "#555555",
      marginTop: 2,
      lineHeight: 1.5,
    },
    logo: {
      width: 48,
      height: 48,
      objectFit: "contain",
    },

    //     Dividers    
    hrThick: {
      borderBottomWidth: 1.5,
      borderBottomColor: "#111111",
      marginBottom: 12,
    },
    hr: {
      borderBottomWidth: 0.5,
      borderBottomColor: "#cccccc",
      marginVertical: 8,
    },

    //     Report title    
    reportTitle: {
      fontSize: 18,
      fontFamily: "Helvetica-Bold",
      color: "#0f2e1a",
      letterSpacing: 0.3,
      marginBottom: 2,
    },
    reportDate: {
      fontSize: 8,
      color: "#888888",
      marginBottom: 10,
    },

    //     Section labels    
    sectionLabel: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 1.2,
      color: "#4aa35a",
      marginBottom: 5,
      marginTop: 14,
    },

    //     Field rows    
    fieldRow: {
      flexDirection: "row",
      marginBottom: 4,
      gap: 0,
    },
    fieldKey: {
      fontSize: 9.5,
      fontFamily: "Helvetica-Bold",
      color: "#333333",
      width: 200,
      flexShrink: 0,
    },
    fieldVal: {
      fontSize: 9.5,
      color: "#111111",
      flex: 1,
      lineHeight: 1.5,
    },

    //     TRACER level badge    
    tracerBadge: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      backgroundColor: "#f0f7f1",
      borderWidth: 1,
      borderColor: "#2d7a3a",
      borderRadius: 5,
      padding: 10,
      marginBottom: 8,
    },
    tracerBadgeLevel: {
      fontSize: 20,
      fontFamily: "Helvetica-Bold",
      color: "#2d7a3a",
      width: 180,
    },
    tracerBadgeLabel: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#2d7a3a",
      marginBottom: 3,
    },
    tracerBadgeName: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      color: "#111111",
    },

    //     Question sections    
    trlLevelHeader: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: "#2d7a3a",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginTop: 8,
      marginBottom: 3,
    },
    bulletRow: {
      flexDirection: "row",
      gap: 6,
      marginBottom: 3,
      paddingLeft: 8,
    },
    bulletDot: {
      width: 3,
      height: 3,
      borderRadius: 2,
      backgroundColor: "#444444",
      marginTop: 4,
      flexShrink: 0,
    },
    bulletText: {
      fontSize: 9.5,
      color: "#222222",
      flex: 1,
      lineHeight: 1.5,
    },

    //     Roadmap    
    roadmapGroupHeader: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f0f7f1",
      borderWidth: 0.5,
      borderColor: "#c3e6cb",
      borderRadius: 4,
      padding: "5 10",
      marginBottom: 5,
      gap: 8,
    },
    roadmapLevel: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: "#1a5c2a",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    roadmapLevelName: {
      fontSize: 8.5,
      color: "#2d7a3a",
    },
    roadmapStepRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 5,
      paddingLeft: 10,
      alignItems: "flex-start",
    },
    roadmapStepNum: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: "#2d7a3a",
      color: "#ffffff",
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      textAlign: "center",
      paddingTop: 2,
      flexShrink: 0,
    },
    roadmapStepAction: {
      fontSize: 9.5,
      fontFamily: "Helvetica-Bold",
      color: "#111111",
      lineHeight: 1.4,
    },
    roadmapStepDetail: {
      fontSize: 9,
      color: "#555555",
      lineHeight: 1.5,
      marginTop: 1,
    },
    roadmapGroup: {
      marginBottom: 12,
    },
    closingBox: {
      marginTop: 8,
      padding: "8 10",
      backgroundColor: "#f8f6f1",
      borderLeftWidth: 3,
      borderLeftColor: "#2d7a3a",
    },
    closingText: {
      fontSize: 9,
      color: "#333333",
      lineHeight: 1.6,
      fontStyle: "italic" as const,
    },

    //     Footer    
    footer: {
      position: "absolute",
      bottom: 24,
      left: 52,
      right: 52,
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 0.5,
      borderTopColor: "#cccccc",
      paddingTop: 6,
    },
    footerText: {
      fontSize: 7.5,
      color: "#aaaaaa",
    },
  });

  //     Helper components    ──────────────────────────────────────────────────

  function FieldRow({ label, value }: { label: string; value?: string }) {
    if (!value) return null;
    return (
      <View style={s.fieldRow}>
        <Text style={s.fieldKey}>{label}</Text>
        <Text style={s.fieldVal}>{value}</Text>
      </View>
    );
  }

  function QuestionSection({ title, questions, type }: { title: string; questions: QuestionItem[]; type?: string }) {
    if (!questions.length) return null;

    const byLevel: Record<number, QuestionItem[]> = {};
    questions.forEach(q => {
      byLevel[q.trlLevel] = byLevel[q.trlLevel] ?? [];
      byLevel[q.trlLevel].push(q);
    });
    const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

    return (
      <View>
        <Text style={s.sectionLabel}>{title}</Text>
        <View style={s.hr} />
        {levels.map(level => (
          <View key={level}>
            <Text style={s.trlLevelHeader}>
              TRACER Level {level} — {getLevelTitle(type, level)}
            </Text>
            {byLevel[level].map(q => (
              <View key={q.id} style={s.bulletRow}>
                <View style={s.bulletDot} />
                <Text style={s.bulletText}>{q.questionText}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  function RoadmapSection({ roadmap, closing, type, completedTRL }: { roadmap: RoadmapGroup[]; closing?: string; type?: string; completedTRL?: number }) {
    if (!roadmap?.length) return null;

    return (
      <View>
        <Text style={s.sectionLabel}>Commercialization Roadmap</Text>
        <View style={s.hr} />
        {roadmap.map((group, gi) => {
          const headerText = completedTRL === 9
            ? "Remaining Requirements for Full Commercialization"
            : `Advancing Towards TRACER Level ${group.trlLevel}`;
          return (
          <View key={gi} style={s.roadmapGroup}>
            <View style={s.roadmapGroupHeader}>
              <Text style={s.roadmapLevel}>{headerText}</Text>
              <Text style={s.roadmapLevelName}>{getLevelTitle(type, group.trlLevel)}</Text>
            </View>
            {(group.steps ?? []).map((step: { action: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; detail: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, si: any) => (
              <View key={si ?? 0} style={s.roadmapStepRow}>
                <Text style={s.roadmapStepNum}>{(si ?? 0) + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.roadmapStepAction}>{step.action}</Text>
                  {step.detail ? (
                    <Text style={s.roadmapStepDetail}>{step.detail}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          );
        })}
        {closing ? (
          <View style={s.closingBox}>
            <Text style={s.closingText}>{closing}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  //     Build document    ─────────────────────────────────────────────────────

  const {
    result, techName, techType, techDescription, fundingSource,
    form, roadmap, closing,
  } = props;

  const {
    highestCompletedTRL, highestAchievableTRL,
    completedQuestions,
  } = result;

  const hasGap  = highestAchievableTRL > highestCompletedTRL;
  const dateStr = new Date().toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
  });

  const MyDoc = (
    <Document
      title="TRACER Assessment Report"
      author="DOST-PCAARRD AANR-TRACER"
      subject={`TRACER Assessment — ${techName ?? "Technology"}`}
    >
      <Page size="A4" style={s.page}>

        {/*     Header     */}
        <View style={s.headerRow}>
          <Image
            style={s.logo}
            src="/img/logos/dost-pcaarrd-logo.png"
          />
          <View style={s.agencyBlock}>
            <Text style={s.agencyName}>DOST-PCAARRD</Text>
            <Text style={s.agencySubtitle}>
              Philippine Council for Agriculture, Aquatic{"\n"}
              and Natural Resources Research and Development{"\n"}
              Los Baños, Laguna, Philippines
            </Text>
          </View>
        </View>

        <View style={s.hrThick} />

        {/*     Title     */}
        <Text style={s.reportTitle}>TRACER Assessment Report</Text>
        <Text style={s.reportDate}>Generated on {dateStr}</Text>

        <View style={s.hr} />

        {/*     Technology Details     */}
        <Text style={s.sectionLabel}>Technology Details</Text>
        <View style={s.hr} />
        <FieldRow label="Technology Name:"    value={techName}        />
        <FieldRow label="Technology Type:"    value={techType}        />
        <FieldRow label="Funding Source:"     value={fundingSource}   />
        <FieldRow label="Description:"        value={techDescription} />

        <View style={s.hr} />

        {/*     Assessment Results     */}
        <Text style={s.sectionLabel}>Assessment Results</Text>
        <View style={s.hr} />

        <View style={s.tracerBadge}>
        <View>
          <Text style={s.tracerBadgeLabel}>Current TRACER Level</Text>
          <Text style={s.tracerBadgeLevel}>TRACER Level {highestCompletedTRL}</Text>
        </View>
        <Text style={s.tracerBadgeName}>
          {getLevelTitle(techType, highestCompletedTRL)}
        </Text>
      </View>

        {hasGap && (
          <FieldRow
            label="Highest Potential TRACER Level:"
            value={`TRACER ${highestAchievableTRL} — ${getLevelTitle(techType, highestAchievableTRL)}`}
          />
        )}

        <View style={s.hr} />

        {/*     Assessment Taken By     */}
        <Text style={s.sectionLabel}>Assessment Taken By</Text>
        <View style={s.hr} />
        <FieldRow label="Name:"          value={form.name}         />
        <FieldRow label="Email:"         value={form.email}        />
        <FieldRow label="Role:"          value={form.role}         />
        <FieldRow label="Organization:"  value={form.organization} />

        <View style={s.hr} />

        {/*     Completed Requirements     */}
        <QuestionSection
          title="Completed Requirements"
          questions={completedQuestions}
          type={techType}
        />

        <View style={s.hr} />

        {/*     Commercialization Roadmap     */}
        <RoadmapSection
          roadmap={roadmap ?? []}
          closing={closing}
          type={techType}
          completedTRL={result.highestCompletedTRL}
        />

        <View style={{ height: 24 }} />

        {/*     Footer (fixed at bottom of every page)     */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>AANR-TRACER · DOST-PCAARRD</Text>
          <Text style={s.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
          <Text style={s.footerText}>
            System-generated. For reference only.
          </Text>
        </View>

      </Page>
    </Document>
  );

  //     Build blob    ────────────────────────────────────────────────────────
  const blob = await pdf(MyDoc).toBlob();
  return blob;
}

/** Generate PDF, trigger a browser download, and return the Blob. */
export async function generateAndDownloadPDF(props: PDFContentProps): Promise<void> {
  const blob = await generatePDFBlob(props);
  const url      = URL.createObjectURL(blob);
  const anchor   = document.createElement("a");
  const safeName = (props.form.name || "report").replace(/\s+/g, "_").toLowerCase();
  anchor.href     = url;
  anchor.download = `tracer_report_${safeName}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Generate PDF and return as base64 string — for email attachment. */
export async function generatePDFAsBase64(props: PDFContentProps): Promise<string> {
  const blob        = await generatePDFBlob(props);
  const arrayBuffer = await blob.arrayBuffer();
  const bytes       = new Uint8Array(arrayBuffer);
  let   binary      = "";
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary);
}


/*    ─ Dummy PDFContent — kept so ResultsPage import doesn't break    ─────── */
// ResultsPage renders this into a hidden div; with react-pdf we no longer need
// that div. Keep the export so the import compiles without changes.
export function PDFContent(_props: PDFContentProps) {
  return null;
}