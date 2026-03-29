"use client";

/*
This component renders the TRACER Category Analysis section.
It shows:
• Radar chart of category progress
• Progress bars per category
• Strongest and focus areas
• Insight narrative summarizing strengths and gaps
*/

import { useMemo } from "react";
import { QuestionItem } from "../../utils/trlCalculator";
import { categoryOrder } from "../../utils/helperConstants";


// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

/*
Represents the calculated progress for a single category
after evaluating answered vs remaining questions.
*/
interface CategoryScore {
  category: string;        // category name
  answered: number;        // number of completed questions
  total: number;           // total questions in category
  percent: number;         // completion percentage
  label: "Strong" | "Moderate" | "Needs Work" | "Not Started"; // qualitative label
  color: string;           // label text color
  bgColor: string;         // label background color
  borderColor: string;     // label border color
}


/*
Props passed into the component from the TRACER results page.
*/
interface Props {
  completedQuestions: QuestionItem[];  // questions the user satisfied
  lackingToLevel9: QuestionItem[];     // remaining questions needed for TRL 9
  completedTRL: number;                // user's calculated TRACER level
  narrative?: string;                  // optional AI-generated narrative
}


// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

/*
Converts percentage completion into a qualitative status label.
*/
function getLabel(pct: number): CategoryScore["label"] {
  if (pct >= 75) return "Strong";
  if (pct >= 40) return "Moderate";
  if (pct > 0) return "Needs Work";
  return "Not Started";
}


/*
Returns styling colors for each label state.
Used for badges beside each category.
*/
function getLabelStyle(label: CategoryScore["label"]) {
  switch (label) {
    case "Strong":
      return { color: "#166534", bgColor: "#dcfce7", borderColor: "#86efac" };

    case "Moderate":
      return { color: "#92400e", bgColor: "#fef3c7", borderColor: "#fcd34d" };

    case "Needs Work":
      return { color: "#9a3412", bgColor: "#ffedd5", borderColor: "#fdba74" };

    case "Not Started":
      return { color: "#6b7280", bgColor: "#f3f4f6", borderColor: "#d1d5db" };
  }
}


/*
Returns the progress bar color based on completion.
*/
function getBarColor(pct: number): string {
  if (pct >= 75) return "#4aa35a";
  if (pct >= 40) return "#f59e0b";
  if (pct > 0) return "#f97316";
  return "#d1d5db";
}


/*
Friendly category names used in narrative sentences.
These are easier to read than the full titles.
*/
const PROSE_NAMES: Record<string, string> = {
  "Technology Development Status": "technology development",
  "Market and Pre-commercialization Preparedness":
    "market and pre-commercialization preparedness",
  "Intellectual Property Protection Status":
    "intellectual property protection",
  "Industry Validation and Adoption Status":
    "industry validation and adoption",
  "Regulatory Compliance Status": "regulatory compliance",
};


/*
Finds the highest TRACER level achieved in a category
based on completed questions.
*/
function highestLevelInCategory(
  category: string,
  completedQuestions: QuestionItem[]
): number {
  const levels = completedQuestions
    .filter((q) => q.category === category)
    .map((q) => q.trlLevel);

  return levels.length > 0 ? Math.max(...levels) : 0;
}


/*
Builds the natural-language insight paragraph.

Logic:
1. Identify strongest category (highest TRACER level reached)
2. Identify focus category (lowest level with progress)
3. Determine fully-completed categories
4. Construct readable narrative explaining strengths and next focus
*/
function buildInsight(
  scores: CategoryScore[],
  completedQuestions: QuestionItem[]
): string {

  const withLevels = scores.map((s) => ({
    category: s.category,
    highestLevel: highestLevelInCategory(s.category, completedQuestions),
    isComplete: s.total > 0 && s.answered === s.total,
  }));


  const withProgress = withLevels.filter((s) => s.highestLevel > 0);
  const allZero = withProgress.length === 0;


  const strengthEntry = allZero
    ? withLevels[0]
    : withLevels.reduce((a, b) =>
        b.highestLevel > a.highestLevel ? b : a
      );


  const focusCandidates = withProgress.filter((s) => !s.isComplete);


  const focusEntry = allZero
    ? withLevels[withLevels.length - 1]
    : focusCandidates.length > 0
    ? focusCandidates.reduce((a, b) =>
        b.highestLevel < a.highestLevel ? b : a
      )
    : null;


  const strengthName =
    PROSE_NAMES[strengthEntry.category] ?? strengthEntry.category;

  const focusName = focusEntry
    ? PROSE_NAMES[focusEntry.category] ?? focusEntry.category
    : null;


  const completedCategories = withLevels.filter(
    (s) => s.isComplete && s.highestLevel > 0
  );

  let insight = "";


  /*
  Construct narrative depending on how many categories are complete
  */
  if (completedCategories.length === 0) {

    insight += `Your key strength lies in ${strengthName}`;

    if (strengthEntry.highestLevel > 0) {
      insight += `, already addressing requirements aligned with TRACER Level ${strengthEntry.highestLevel}.`;
    } else {
      insight += `.`;
    }

  } else if (completedCategories.length === 1) {

    const name =
      PROSE_NAMES[completedCategories[0].category] ??
      completedCategories[0].category;

    insight += `Your key strength lies in ${strengthName}. You have fully addressed all requirements under ${name} (up to TRACER Level ${completedCategories[0].highestLevel}).`;

  } else {

    const names = completedCategories.map(
      (s) => PROSE_NAMES[s.category] ?? s.category
    );

    const listed =
      names.length === 2
        ? `${names[0]} and ${names[1]}`
        : `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;

    insight += `Your key strength lies in ${strengthName}. You have fully addressed requirements across ${listed}.`;
  }


  /*
  Focus recommendation sentence
  */
  if (!focusEntry || allZero) {

    insight += ` All active categories have been fully addressed — continue building across any remaining areas to reach full commercialization.`;

  } else if (focusEntry.category === strengthEntry.category) {

    insight += ` Continue building across all areas to move closer to successful commercialization.`;

  } else if (focusEntry.highestLevel > 0) {

    insight += ` To move closer to successful commercialization, focus your efforts on ${focusName}, currently at TRACER Level ${focusEntry.highestLevel}.`;

  } else {

    insight += ` To move closer to successful commercialization, focus your efforts on ${focusName} — this area has no completed requirements yet and will be critical in later stages.`;
  }

  insight += ` The guide below outlines your next steps forward.`;

  return insight;
}


/*
Short category names used around the radar chart
to prevent long labels from overflowing.
*/
const SHORT_NAMES: Record<string, string> = {
  "Technology Development Status": "Tech Dev",
  "Market and Pre-commercialization Preparedness": "Market",
  "Intellectual Property Protection Status": "IP",
  "Industry Validation and Adoption Status": "Industry",
  "Regulatory Compliance Status": "Regulatory",
};



// ─────────────────────────────────────────────────────────────
// Radar Chart Component
// ─────────────────────────────────────────────────────────────

/*
Displays category performance in a radar/spider chart.

Each axis = category
Distance from center = completion percentage
*/
function RadarChart({ scores }: { scores: CategoryScore[] }) {

  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 80;
  const n = scores.length;

  /*
  Calculates polygon coordinates for grid rings
  */
  function polygonPoints(scale: number): string {
    return scores
      .map((_, i) => {
        const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
        const r = radius * scale;

        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      })
      .join(" ");
  }


  /*
  Axis endpoints for category lines
  */
  const axes = scores.map((s, i) => {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;

    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      label: SHORT_NAMES[s.category] ?? s.category,
      pct: s.percent,
      color: getBarColor(s.percent),
    };
  });


  /*
  Data polygon showing user's progress
  */
  const dataPoints = scores
    .map((s, i) => {
      const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
      const r = radius * (s.percent / 100);

      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(" ");


  /*
  Positions labels slightly outside radar radius
  */
  const labelRadius = radius + 28;

  const labels = scores.map((s, i) => {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;

    return {
      x: cx + labelRadius * Math.cos(angle),
      y: cy + labelRadius * Math.sin(angle),
      label: SHORT_NAMES[s.category] ?? s.category,
      pct: s.percent,
    };
  });


  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>

      {/* grid rings */}
      {[0.25, 0.5, 0.75, 1].map(scale => (
        <polygon
          key={scale}
          points={polygonPoints(scale)}
          fill="none"
          stroke="#e8e4dc"
        />
      ))}

      {/* axis lines */}
      {axes.map((ax, i) => (
        <line key={i} x1={cx} y1={cy} x2={ax.x} y2={ax.y}
          stroke="#e8e4dc" />
      ))}

      {/* radar data polygon */}
      <polygon
        points={dataPoints}
        fill="rgba(74,163,90,0.15)"
        stroke="#4aa35a"
        strokeWidth="2"
      />

      {/* data points */}
      {scores.map((s, i) => {
        const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
        const r = radius * (s.percent / 100);

        return (
          <circle
            key={i}
            cx={cx + r * Math.cos(angle)}
            cy={cy + r * Math.sin(angle)}
            r={4}
            fill={getBarColor(s.percent)}
            stroke="white"
          />
        );
      })}

      {/* axis labels */}
      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          fontSize="9"
        >
          {l.label}
        </text>
      ))}

    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CategoryAnalysis({ completedQuestions, lackingToLevel9, completedTRL, narrative }: Props) {

  const scores: CategoryScore[] = useMemo(() => {
    return categoryOrder.map(category => {
      const answered = completedQuestions.filter(q => q.category === category).length;
      const lacking  = lackingToLevel9.filter(q => q.category === category).length;
      const total    = answered + lacking;
      const percent  = total === 0 ? 0 : Math.round((answered / total) * 100);
      const label    = getLabel(percent);
      const style    = getLabelStyle(label);
      return { category, answered, total, percent, label, ...style };
    });
  }, [completedQuestions, lackingToLevel9]);

  // Strongest = category with highest TRACER level reached
  // Focus     = category with lowest TRACER level (among those with progress but NOT fully complete)
  const BADGE_CATEGORIES = new Set([
    "Technology Development Status",
    "Market and Pre-commercialization Preparedness",
    "Industry Validation and Adoption Status",
  ]);

  const categoryLevels = scores.map(s => ({
    ...s,
    highestLevel: highestLevelInCategory(s.category, completedQuestions),
    isComplete:   s.total > 0 && s.answered === s.total,
  }));

  // Strongest and Focus badges only consider the three core categories
  const badgeLevels        = categoryLevels.filter(s => BADGE_CATEGORIES.has(s.category));
  const withProgress       = badgeLevels.filter(s => s.highestLevel > 0);
  const incompleteWithProgress = withProgress.filter(s => !s.isComplete);

  const strongest = badgeLevels.reduce((a, b) => b.highestLevel > a.highestLevel ? b : a);
  const weakest   = incompleteWithProgress.length > 0
    ? incompleteWithProgress.reduce((a, b) => b.highestLevel < a.highestLevel ? b : a)
    : withProgress.length > 0
      ? withProgress[withProgress.length - 1]
      : badgeLevels[badgeLevels.length - 1];

  const insight = useMemo(() => buildInsight(scores, completedQuestions), [scores, completedQuestions]);

  return (
    <div className="bg-white border border-[#ede9e0] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)]">

      {/* Header */}
      <div className="flex items-center gap-2.5 px-7 py-4 border-b border-[#f0ede6] bg-[#f8f6f1]">
        <span className="w-2 h-2 rounded-full bg-[#4aa35a]" />
        <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">
          Category Analysis
        </span>
      </div>

      <div className="px-7 py-6 space-y-6">

        {/* Strength / Weakness badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl px-4 py-3 border border-[#86efac] bg-[#dcfce7]">
            <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#166534] mb-1">
              💪 Strongest Area
            </p>
            <p className="text-[13px] font-semibold text-[#166534] leading-snug">
              {strongest.category}
            </p>
            <p className="text-[11px] text-[#16a34a] mt-0.5">
              TRACER Level {strongest.highestLevel > 0 ? strongest.highestLevel : "—"}
            </p>
          </div>
          <div className="rounded-xl px-4 py-3 border border-[#fdba74] bg-[#ffedd5]">
            <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#9a3412] mb-1">
              🎯 Focus Area
            </p>
            <p className="text-[13px] font-semibold text-[#9a3412] leading-snug">
              {weakest.category}
            </p>
            <p className="text-[11px] text-[#ea580c] mt-0.5">
              TRACER Level {weakest.highestLevel > 0 ? weakest.highestLevel : "—"}
            </p>
          </div>
        </div>

        {/* Radar + breakdown side by side on larger screens */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Radar chart */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2 w-full lg:w-auto">
            <RadarChart scores={scores} />
            {/* Legend */}
            <div className="flex items-center gap-4 text-[10px] text-[#94a3a0]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4aa35a]" /> Completed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#e8e4dc]" /> Remaining
              </span>
            </div>
          </div>

          {/* Progress bars breakdown */}
          <div className="flex-1 w-full space-y-4">
            {scores.map(s => (
              <div key={s.category}>
                {/* Row header */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-medium text-[#1a1a1a] leading-snug">
                    {s.category}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-[11px] text-[#94a3a0]">
                      {s.answered}/{s.total}
                    </span>
                    <span
                      className="text-[9px] font-bold tracking-[1px] uppercase px-2 py-0.5 rounded-full border"
                      style={{ color: s.color, backgroundColor: s.bgColor, borderColor: s.borderColor }}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="h-2 w-full bg-[#f0ece3] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width:           `${s.percent}%`,
                      backgroundColor: getBarColor(s.percent),
                    }}
                  />
                </div>

                {/* Percent */}
                <p className="text-[10px] text-[#94a3a0] mt-1">{s.percent}% complete</p>
              </div>
            ))}
          </div>
        </div>
        
         {/* Insight paragraph */}
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-gradient-to-r from-[#0f2e1a]/[0.03] to-[#4aa35a]/[0.04] border border-[#4aa35a]/20">
          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#4aa35a]/10 flex items-center justify-center mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4aa35a"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <p className="text-[13px] text-[#2d4a38] leading-relaxed font-light">
            {narrative || insight}
          </p>
        </div>
        
      </div>
    </div>
  );
}