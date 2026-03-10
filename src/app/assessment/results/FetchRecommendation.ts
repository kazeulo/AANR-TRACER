// ─── Types ────────────────────────────────────────────────────────────────────

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

/** AI-generated header content */
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

// ─── Constants ────────────────────────────────────────────────────────────────

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

function stepsKey(input: RecommendationInput): string {
  return `tracer_steps_${input.completedTRL}_${input.achievableTRL}_${input.technologyName}`;
}

async function callProxy(
  messages: { role: string; content: string }[],
  maxTokens = 600
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

// ─── Header fetch ─────────────────────────────────────────────────────────────

export async function fetchHeader(
  input: RecommendationInput,
  officialDescription?: { title: string; description: string } | null
): Promise<AIHeader> {
  const headerKey = `tracer_header_${input.technologyName}_${input.technologyType}_${input.completedTRL}`;
  try {
    const cached = sessionStorage.getItem(headerKey);
    if (cached) return JSON.parse(cached) as AIHeader;
  } catch { /* unavailable */ }

  const trlLabel = TRL_LABELS[input.completedTRL] ?? "";
  const officialBlock = officialDescription
    ? `\n\nOFFICIAL TRACER LEVEL DEFINITION (use this as the factual basis — do not contradict it):\nTitle: ${officialDescription.title}\nDescription: ${officialDescription.description}`
    : "";

  const raw = await callProxy([
    {
      role: "system",
      content: `You are a warm, motivational TRACER advisor for AANR technology developers in the Philippines. Respond ONLY with valid JSON. No markdown, no extra text.`,
    },
    {
      role: "user",
      content: `CONTEXT:
- Technology Name: ${input.technologyName}
- Technology Domain: ${input.technologyType}
- Developer's Description: ${input.technologyDescription}
- Current TRACER Level: ${input.completedTRL} (${trlLabel})${input.completedTRL === 9 ? "\n- This is the highest possible TRACER Level — fully commercialised." : ""}${officialBlock}

INSTRUCTIONS:
1. headline: One short punchy warm sentence (max 12 words) celebrating what reaching TRACER Level ${input.completedTRL} means for this specific technology. Do NOT start with "Congratulations". Be specific to the technology name and domain.
2. explanation: 2-3 plain-language sentences grounded in the official TRACER Level definition above — what this level means for their specific technology and its end users, personalised to the developer's description. Be encouraging and concrete. Do not copy the official definition verbatim; rephrase it naturally with their technology in mind.

Return ONLY:
{
  "headline": "<short warm sentence>",
  "explanation": "<2-3 sentences>"
}`,
    },
  ], 300);

  try {
    const result = JSON.parse(raw) as AIHeader;
    try { sessionStorage.setItem(headerKey, JSON.stringify(result)); } catch { /* quota */ }
    return result;
  } catch {
    throw new Error("Could not parse header response.");
  }
}

// ─── Steps fetch ──────────────────────────────────────────────────────────────

export async function fetchSteps(input: RecommendationInput): Promise<AISteps> {
  const key = stepsKey(input);

  try {
    const cached = sessionStorage.getItem(key);
    if (cached) return JSON.parse(cached) as AISteps;
  } catch { /* unavailable */ }

  const raw = await callProxy([
    {
      role: "system",
      content: `You are a warm, motivational TRACER advisor for AANR technologies in the Philippines. Respond ONLY with valid JSON. No markdown, no extra text.`,
    },
    {
      role: "user",
      content: buildStepsPrompt(input),
    },
  ], 1600);

  let result: AISteps;
  try {
    result = JSON.parse(raw) as AISteps;
  } catch {
    throw new Error("Could not parse steps response. Please try again.");
  }

  try {
    sessionStorage.setItem(key, JSON.stringify(result));
  } catch { /* quota exceeded */ }

  return result;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

const STEPS_SCHEMA = `Return ONLY this JSON (no markdown):
{
  "roadmap": [
    {
      "trlLevel": <number>,
      "steps": [
        {
          "action": "<imperative verb phrase: Develop / Conduct / Identify / Build / Establish...>",
          "detail": "<2-3 sentences: what to do specifically, why it matters, and how to get started or who to involve>"
        }
      ]
    }
  ],
  "closing": "<1-2 warm, congratulatory and motivational sentences acknowledging how far they have come and encouraging them to keep going>"
}`;

function buildStepsPrompt(i: RecommendationInput): string {
  const trlLabel    = TRL_LABELS[i.completedTRL]  ?? "";
  const techContext = `- Technology Name: ${i.technologyName}\n- Technology Domain: ${i.technologyType}\n- Description: ${i.technologyDescription}`;

  // TRL 9, fully commercialised with no lacking items — guide for sustaining & scaling
  if (i.completedTRL === 9 && i.lackingItems.length === 0) {
    return `CONTEXT:
${techContext}
- Current TRACER Level: 9 (${TRL_LABELS[9]}) — the highest possible level. This technology is fully commercialised.

INSTRUCTIONS:
This technology has reached full commercial deployment. Provide 3-5 forward-looking action steps grouped under TRACER Level 9 that help the developer:
- Sustain and grow commercial operations
- Expand market reach (new regions, user segments, or export opportunities)
- Strengthen IP portfolio and licensing strategies
- Pursue continuous improvement and next-generation R&D
- Engage with policy, standards bodies, or industry associations

Each step must have:
- action: a clear imperative verb phrase
- detail: 2-3 sentences — what to do specifically, why it matters, and a concrete starting point

Also write a short warm closing message celebrating this milestone.

${STEPS_SCHEMA}`;
  }

  // TRL 9 with outstanding items
  if (i.completedTRL === 9) {
    return `CONTEXT:
${techContext}
- Current TRACER Level: 9 (${TRL_LABELS[9]}) — commercialised but with outstanding actions
- Outstanding actions:
${formatLacking(i.lackingItems)}

INSTRUCTIONS: Group by TRACER Level (${groupKeys(i.lackingItems)}). Rewrite each as a specific imperative + 2-3 sentence detail on what to do and why it matters. Then add 3 forward-looking sustaining steps under TRACER Level 9. Write a warm closing message.

${STEPS_SCHEMA}`;
  }

  // TRL 0 — just starting
  if (i.completedTRL === 0) {
    return `CONTEXT:
${techContext}
- Current TRACER Level: 0 — beginning of the journey
- Highest Achievable TRACER Level: ${i.achievableTRL}
- Steps needed:
${formatLacking(i.lackingItems)}

INSTRUCTIONS: Group by TRACER Level (${groupKeys(i.lackingItems)}). Rewrite each as a clear imperative + 2-3 sentence detail explaining what to do, why it matters, and how to get started. Tone: warm, encouraging, practical.

${STEPS_SCHEMA}`;
  }

  // General case
  return `CONTEXT:
${techContext}
- Current TRACER Level: ${i.completedTRL} (${trlLabel})
- Highest Achievable TRACER Level: ${i.achievableTRL} (${TRL_LABELS[i.achievableTRL] ?? ""})
- Actions needed to reach TRACER Level ${i.achievableTRL}:
${formatLacking(i.lackingItems)}

INSTRUCTIONS:
Group ALL actions by TRACER Level (${groupKeys(i.lackingItems)}). For each item:
- action: rewrite as a specific imperative ("Develop...", "Conduct...", "Identify...", "Establish...")
- detail: 2-3 sentences — what specifically to do, why it matters for reaching TRACER Level ${i.achievableTRL}, and a concrete first step or who to involve

Do not invent actions beyond those listed. Tone: warm, professional, encouraging.
Write a closing message congratulating them on their progress and motivating them to continue.

${STEPS_SCHEMA}`;
}