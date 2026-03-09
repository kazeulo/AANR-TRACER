import { QuestionItem } from "../../utils/trlCalculator";
import { TRL_LABELS } from "./UsePDFExport";

export interface RecommendationInput {
  technologyName: string;
  technologyType: string;
  technologyDescription: string;
  completedTRL: number;
  achievableTRL: number;
  lackingItems: QuestionItem[];
}

export interface RecommendationItem {
  title: string;
  body: string;
}

export interface RecommendationOutput {
  items: RecommendationItem[];
  closing: string;
}

// Cache

export function getCacheKey(input: Pick<RecommendationInput, "technologyName" | "technologyType" | "completedTRL" | "achievableTRL">): string {
  return `aanr_rec_${input.technologyName}_${input.technologyType}_${input.completedTRL}_${input.achievableTRL}`;
}

export function getHeroCacheKey(input: Pick<RecommendationInput, "technologyName" | "technologyType" | "completedTRL">): string {
  return `aanr_hero_${input.technologyName}_${input.technologyType}_${input.completedTRL}`;
}

function readCache<T>(key: string): T | null {
  try { return JSON.parse(sessionStorage.getItem(key) ?? "null"); } catch { return null; }
}

function writeCache<T>(key: string, value: T): void {
  try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function getCached(key: string): RecommendationOutput | null {
  return readCache<RecommendationOutput>(key);
}

export function setCache(key: string, value: RecommendationOutput): void {
  writeCache(key, value);
}

// Hero message — Qwen 0.5B (fast, cheap)

export async function fetchHeroMessage(input: Pick<
  RecommendationInput,
  "technologyName" | "technologyType" | "completedTRL"
>): Promise<{ headline: string; sub: string }> {
  const cacheKey = getHeroCacheKey(input);
  const cached = readCache<{ headline: string; sub: string }>(cacheKey);
  if (cached) return cached;

  const { technologyName, technologyType, completedTRL } = input;

  const systemPrompt =
    `You are a warm, encouraging advisor for AANR technology developers in the Philippines. ` +
    `Write short celebratory messages. Be specific to the TRL level achieved.`;

  const userPrompt =
    `Technology: ${technologyName || "an AANR technology"}\n` +
    `Type: ${technologyType}\n` +
    `Achieved TRL: ${completedTRL} — ${TRL_LABELS[completedTRL] ?? "Unknown"}\n\n` +
    `Write exactly two parts separated by a blank line:\n` +
    `1. One headline sentence (max 12 words) celebrating this TRL achievement.\n` +
    `2. Two sentences (max 40 words total) explaining what this TRL means and motivating them to continue.\n` +
    `No bullet points, numbers, or labels. Just the headline, a blank line, then the two sentences.`;

  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "small",
      max_tokens: 120,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt   },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Hero fetch failed: ${res.status}`);

  const data = await res.json();
  const text: string = (data.completion ?? "").trim();
  const parts = text.split(/\n\s*\n/).map((s: string) => s.trim()).filter(Boolean);

  const result = {
    headline: parts[0] ?? "",
    sub:      parts.slice(1).join(" ").trim(),
  };

  writeCache(cacheKey, result);
  return result;
}

export async function fetchRecommendation(
  input: RecommendationInput
): Promise<string> {
  const {
    technologyName, technologyType, technologyDescription,
    completedTRL, achievableTRL, lackingItems,
  } = input;

  const lackingList = lackingItems
    .slice(0, 10)
    .map((q, i) => `${i + 1}. ${q.questionText}`)
    .join("\n");

  const systemPrompt =
    `You are a friendly and encouraging Technology Readiness Level (TRL) advisor for AANR ` +
    `(Agriculture, Aquatic, and Natural Resources) technologies in the Philippines. ` +
    `Your job is to help technology developers understand exactly what they need to do next in plain, simple language. ` +
    `Be warm, clear, and motivating. Avoid jargon. Always make the developer feel their progress is meaningful.`;

  const userPrompt =
    `A technology developer has just completed their TRL self-assessment. Here are the details:\n\n` +
    `Technology name: ${technologyName || "their AANR technology"}\n` +
    `Technology type: ${technologyType}\n` +
    `Description: ${technologyDescription || "Not provided"}\n` +
    `Current TRL: ${completedTRL} — ${TRL_LABELS[completedTRL] ?? "Unknown"}\n` +
    `Target TRL: ${achievableTRL} — ${TRL_LABELS[achievableTRL] ?? "Unknown"}\n\n` +
    `The following items are what they still need to accomplish to reach TRL ${achievableTRL}:\n` +
    `${lackingList || "No specific gaps identified."}\n\n` +
    `For each gap above, write one actionable step using EXACTLY this format:\n` +
    `[Number]. [Action Title]: [1–2 sentences]\n\n` +
    `Rules:\n` +
    `- The Action Title must be a short imperative phrase (3–6 words) that turns the gap directly into a task. ` +
    `Convert the gap name into an action — e.g. "System Design Formulated" → "Design a Formulated System".\n` +
    `- After the colon, write 1–2 plain sentences of specific guidance: what to do, how to start, or who to involve.\n` +
    `- Do not add extra labels, headers, or commentary between steps.\n\n` +
    `After all numbered steps, leave a blank line then write a short 1–2 sentence closing message ` +
    `acknowledging their progress and motivating them to keep going.`;

  const response = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt   },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error ?? `Server error ${response.status}`);
  }

  const data = await response.json();
  const raw: string = (data.completion ?? "").trim();
  if (!raw) throw new Error("No valid response from AI.");
  return raw;
}

// Parser

function parseStepsOutput(text: string): RecommendationOutput {
  const lines = text.split("\n").map(l => l.trim());
  const rawItems: string[] = [];
  const closingLines: string[] = [];
  let current = "";

  for (const line of lines) {
    if (!line) {
      if (current) { rawItems.push(current.trim()); current = ""; }
      continue;
    }
    if (/^\d+[\.\)]/.test(line)) {
      if (current) rawItems.push(current.trim());
      current = line.replace(/^\d+[\.\)]\s*/, "");
    } else if (current) {
      current += " " + line;
    } else {
      closingLines.push(line);
    }
  }
  if (current) rawItems.push(current.trim());

  const items: RecommendationItem[] = rawItems
    .filter(r => r.length > 5)
    .map(r => {
      const colonIdx = r.indexOf(":");
      if (colonIdx > 0 && colonIdx < 80) {
        return { title: r.slice(0, colonIdx).trim(), body: r.slice(colonIdx + 1).trim() };
      }
      return { title: "", body: r };
    });

  return { items, closing: closingLines.join(" ").trim() };
}

// Legacy string-based parser (used by AIRecommendationCard) 

export function parseRecommendationOutput(text: string): {
  items: string[];
  closing: string;
} {
  const lines = text.split("\n").map(l => l.trim());
  const items: string[] = [];
  const closingLines: string[] = [];
  let current = "";

  for (const line of lines) {
    if (!line) {
      if (current) { items.push(current.trim()); current = ""; }
      continue;
    }
    if (/^\d+[\.\)]/.test(line)) {
      if (current) items.push(current.trim());
      current = line.replace(/^\d+[\.\)]\s*/, "");
    } else if (current) {
      current += " " + line;
    } else {
      closingLines.push(line);
    }
  }
  if (current) items.push(current.trim());

  return {
    items: items.filter(i => i.length > 5),
    closing: closingLines.join(" ").trim(),
  };
}