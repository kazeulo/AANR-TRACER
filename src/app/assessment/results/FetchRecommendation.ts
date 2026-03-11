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

// Helpers

function formatLacking(items: LackingItem[]): string {
  return items.map(i => `- [TRACER Level ${i.trlLevel}] ${i.questionText}`).join("\n");
}

function groupKeys(items: LackingItem[]): string {
  return [...new Set(items.map(i => i.trlLevel))]
    .sort((a, b) => a - b)
    .join(", ");
}

function cacheKey(input: RecommendationInput): string {
  return `tracer_v3_${input.completedTRL}_${input.technologyName}_${input.technologyType}`;
}

async function callProxy(
  messages: { role: string; content: string }[],
  maxTokens = 2800
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
    "headline": "<one short warm sentence, max 12 words, celebrating their TRACER Level — do NOT start with Congratulations>",
    "explanation": "<2-3 plain-language sentences grounded in the official level definition, personalised to this technology and its end users>"
  },
  "roadmap": [
    {
      "trlLevel": <number>,
      "steps": [
        {
          "action": "<the requirement text copied EXACTLY as provided — do not rephrase or shorten>",
          "detail": "<2-3 sentences: what exactly to do to accomplish this, why it matters for commercialization, and a concrete first step or who to involve>"
        }
      ]
    }
  ],
  "closing": "<1-2 warm sentences acknowledging their current progress and motivating them toward full commercialization>"
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
- Current TRACER Level: 9 (${TRL_LABELS[9]}) — fully commercialised.${officialBlock}

INSTRUCTIONS:

HEADER:
Write a headline (max 12 words) and a 2-3 sentence explanation celebrating full commercialisation, grounded in the official definition above.

ROADMAP:
Provide 4-5 forward-looking sustaining steps grouped under TRACER Level 9:
- Expand market reach (new regions, user segments, or export opportunities)
- Strengthen IP portfolio and licensing strategies
- Pursue continuous improvement and next-generation R&D
- Engage with policy bodies, standards bodies, or industry associations
- Build long-term partnerships and supply chain resilience
Each step: action = clear imperative verb phrase. detail = 2-3 sentences on what to do, why it matters, and a concrete starting point.

CLOSING: A warm message celebrating this milestone.

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

HEADER:
1. headline: One short punchy warm sentence (max 12 words) celebrating what reaching TRACER Level ${i.completedTRL} means for this specific technology. Do NOT start with "Congratulations". Be specific to the technology name and domain.
2. explanation: 2-3 plain-language sentences grounded in the official TRACER Level definition above — personalised to this technology and its end users. Do not copy the definition verbatim.

ROADMAP:
Produce a complete roadmap of every step needed to reach TRACER Level 9.
1. Group ALL items by TRACER Level (${allLevels}). Each level = one entry in the roadmap array.
2. For EACH item listed above, create exactly one step:
   - action: copy the requirement text EXACTLY as written — do not shorten, rephrase, or summarize.
   - detail: 2-3 sentences — what exactly to do, why it matters for commercialization, and a concrete first step or who to involve.
3. Every requirement must appear as its own step. Do not merge, skip, or combine any.
4. Do NOT invent requirements beyond those listed.
5. Levels already completed (≤ ${i.completedTRL}) must NOT appear in the roadmap.

CLOSING: 1-2 warm sentences acknowledging current progress and motivating toward full commercialization.
Tone throughout: warm, professional, practical.

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
  ], 2800);

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