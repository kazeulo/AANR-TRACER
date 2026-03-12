// Types 

export interface LackingItem {
  trlLevel: number;
  questionText: string;
}

export interface RecommendationInput {
  technologyName: string;
  technologyType: string;
  technologyDescription: string;
  completedTRL: number;
  achievableTRL: number;
  lackingItems: LackingItem[];
}

export interface AIHeader {
  headline: string;
  explanation: string;
}

export interface ActionStep {
  action: string;
  detail: string;
}

export interface RoadmapGroup {
  trlLevel: number;
  steps: ActionStep[];
}

export interface AISteps {
  roadmap: RoadmapGroup[];
  closing: string;
}

/** Combined response — single AI call returns both */
export interface AIResult {
  header: AIHeader;
  steps: AISteps;
}

// Constants

export const TRL_LABELS: Record<number, string> = {
  0: "Not Yet Assessed",
  1: "Basic Research",
  2: "Technology Concept",
  3: "Experimental Proof-of-Concept",
  4: "Laboratory Validation",
  5: "Relevant Environment Validation",
  6: "Relevant Environment Demonstration",
  7: "Operational Environment Demonstration",
  8: "System Complete & Qualified",
  9: "Full Commercial Deployment",
};

export const TRL_COLORS: Record<number, string> = {
  0: "#94a3b8",
  1: "#6366f1",
  2: "#8b5cf6",
  3: "#ec4899",
  4: "#f97316",
  5: "#eab308",
  6: "#84cc16",
  7: "#22c55e",
  8: "#14b8a6",
  9: "#4aa35a",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatLacking(items: LackingItem[]): string {
  return items.map(i => `- [TRACER Level ${i.trlLevel}] ${i.questionText}`).join("\n");
}

function groupKeys(items: LackingItem[]): string {
  return [...new Set(items.map(i => i.trlLevel))]
    .sort((a, b) => a - b)
    .join(", ");
}

function cacheKey(input: RecommendationInput): string {
  return `tracer_v4_${input.completedTRL}_${input.technologyName}_${input.technologyType}`;
}

async function callProxy(
  messages: { role: string; content: string }[],
  maxTokens = 2100
): Promise<string> {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "large", max_tokens: maxTokens, messages }),
  });
  if (!res.ok) throw new Error(`Request failed ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return (data.completion ?? "").replace(/```json|```/g, "").trim();
}

// Combined schema 

const COMBINED_SCHEMA = `Return ONLY this JSON (no markdown, no extra text):
{
  "header": {
    "headline": "<one short warm sentence, max 10 words, celebrating their TRACER Level — do NOT start with Congratulations>",
    "explanation": "<1-3 sentences grounded in the official level definition, personalised to this technology>"
  },
  "roadmap": [
    {
      "trlLevel": <number>,
      "steps": [
        {
          "action": "<requirement text copied EXACTLY as provided>",
          "detail": "<2 sentences: the most important concrete action to accomplish this>"
        }
      ]
    }
  ],
  "closing": "<2 warm sentences motivating them toward full commercialization>"
}`;

// Prompt builder 

function buildPrompt(
  i: RecommendationInput,
  officialDescription?: { title: string; description: string } | null
): string {
  const trlLabel    = TRL_LABELS[i.completedTRL] ?? "";
  const techContext = `- Technology Name: ${i.technologyName}\n- Technology Domain: ${i.technologyType}\n- Developer's Description: ${i.technologyDescription}`;

  const officialBlock = officialDescription
    ? `\n\nOFFICIAL TRACER LEVEL ${i.completedTRL} DEFINITION (use as factual basis for the header explanation — do not contradict it):\nTitle: ${officialDescription.title}\nDescription: ${officialDescription.description}`
    : "";

  // TRL 9 fully done — sustain & scale 
  if (i.completedTRL === 9 && i.lackingItems.length === 0) {
    return `CONTEXT:
${techContext}
- TRACER Level: 9 — fully commercialised.${officialBlock}

INSTRUCTIONS:
HEADER: headline (max 10 words) + 1-2 sentence explanation grounded in the official definition.
ROADMAP: 4-5 sustaining steps under TRACER Level 9 (expand markets, IP, R&D, partnerships, policy). Each step: action = imperative phrase, detail = 1 concrete sentence.
CLOSING: 1 warm sentence.

${COMBINED_SCHEMA}`;
  }

  // All other cases — full roadmap to Level 9 
  const allLevels = groupKeys(i.lackingItems);

  return `CONTEXT:
${techContext}
- Current TRACER Level: ${i.completedTRL}${i.completedTRL > 0 ? ` (${trlLabel})` : " — beginning of the journey"}
- Goal: TRACER Level 9 — Full Commercialization${officialBlock}

UNMET REQUIREMENTS (grouped by TRACER Level):
${formatLacking(i.lackingItems)}

INSTRUCTIONS:
HEADER: headline (max 10 words, no "Congratulations", specific to this technology) + 1-2 sentence explanation grounded in the official definition.
ROADMAP:
Produce a complete roadmap to TRACER Level 9.
1. Group ALL items by TRACER Level (${allLevels}). Each level = one roadmap entry.
2. For EACH item, one step: action = exact requirement text, detail = 2 concrete sentence.
3. Every requirement = its own step. Do not merge or skip any.
4. Do NOT invent requirements. Completed levels (≤ ${i.completedTRL}) must NOT appear.
CLOSING: 1 warm sentence.

${COMBINED_SCHEMA}`;
}

// Single combined fetch

export async function fetchRecommendation(
  input: RecommendationInput,
  officialDescription?: { title: string; description: string } | null
): Promise<AIResult> {
  const key = cacheKey(input);

  // Check cache first
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) return JSON.parse(cached) as AIResult;
  } catch { /* unavailable */ }

  const raw = await callProxy([
    {
      role: "system",
      content: `You are a warm, motivational TRACER advisor for AANR technology developers in the Philippines. Respond ONLY with valid JSON. No markdown, no extra text.`,
    },
    {
      role: "user",
      content: buildPrompt(input, officialDescription),
    },
  ], 1600);

  let parsed: { header: AIHeader; roadmap: RoadmapGroup[]; closing: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Could not parse AI response. Please try again.");
  }

  const result: AIResult = {
    header: parsed.header,
    steps:  { roadmap: parsed.roadmap, closing: parsed.closing },
  };

  try {
    sessionStorage.setItem(key, JSON.stringify(result));
  } catch { /* quota exceeded */ }

  return result;
}

// Legacy exports (kept so existing imports don't break)
// These are thin wrappers that call fetchRecommendation internally.
// Remove once all callers are migrated to fetchRecommendation directly.

export async function fetchHeader(
  input: RecommendationInput,
  officialDescription?: { title: string; description: string } | null
): Promise<AIHeader> {
  const result = await fetchRecommendation(input, officialDescription);
  return result.header;
}

export async function fetchSteps(input: RecommendationInput): Promise<AISteps> {
  const result = await fetchRecommendation(input);
  return result.steps;
}