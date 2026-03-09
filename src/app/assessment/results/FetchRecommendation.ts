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

export async function fetchRecommendation({
  technologyName,
  technologyType,
  technologyDescription,
  completedTRL,
  achievableTRL,
  lackingItems,
}: RecommendationInput): Promise<string> {
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