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
    `Your job is to help technology developers — many of whom may not be familiar with TRL concepts — ` +
    `understand exactly what they need to do next in plain, simple language. ` +
    `Be warm, clear, and motivating. Avoid jargon. If you must use a technical term, briefly explain it. ` +
    `Always make the developer feel that their progress so far is meaningful and that the next steps are achievable.`;

  const userPrompt =
    `A technology developer has just completed their TRL self-assessment. Here are the details:\n\n` +
    `Technology name: ${technologyName || "their AANR technology"}\n` +
    `Technology type: ${technologyType}\n` +
    `Description: ${technologyDescription || "Not provided"}\n` +
    `Current TRL: ${completedTRL} — ${TRL_LABELS[completedTRL] ?? "Unknown"}\n` +
    `Target TRL: ${achievableTRL} — ${TRL_LABELS[achievableTRL] ?? "Unknown"}\n\n` +
    `The following items are what they still need to accomplish to reach TRL ${achievableTRL}:\n` +
    `${lackingList || "No specific gaps identified."}\n\n` +
    `For each gap above, write one short, actionable step the developer can take. ` +
    `Use plain language as if you are talking directly to the developer. ` +
    `Start each step with an encouraging action verb (e.g. "Start by...", "Reach out to...", "Document...", "Partner with..."). ` +
    `After the numbered steps, add a short 1–2 sentence closing message that acknowledges their progress and motivates them to keep going. ` +
    `Format: numbered list of steps, then the closing message on a new line after a blank line.`;

  const response = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt   },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error ?? `Server error ${response.status}`);
  }

  const data = await response.json();
  const completion: string = data.completion ?? "";

  if (!completion) throw new Error("No valid response from AI.");

  return completion;
}

/**
 * Splits the model output into:
 * - items: the numbered action steps
 * - closing: the motivational closing paragraph
 */
export function parseRecommendationOutput(text: string): {
  items: string[];
  closing: string;
} {
  const lines = text.split("\n").map(l => l.trim());

  const items: string[] = [];
  const closingLines: string[] = [];
  let current = "";
  let inClosing = false;

  for (const line of lines) {
    if (!line) {
      // blank line — if we were building a numbered item, flush it
      if (current) {
        items.push(current.trim());
        current = "";
      }
      continue;
    }

    if (/^\d+[\.\)]/.test(line)) {
      if (current) items.push(current.trim());
      current = line.replace(/^\d+[\.\)]\s*/, "");
      inClosing = false;
    } else if (current) {
      // continuation of a numbered item
      current += " " + line;
    } else {
      // non-numbered, non-blank line after items = closing
      inClosing = true;
      closingLines.push(line);
    }
  }

  if (current) items.push(current.trim());

  return {
    items: items.filter(i => i.length > 5),
    closing: closingLines.join(" ").trim(),
  };
}