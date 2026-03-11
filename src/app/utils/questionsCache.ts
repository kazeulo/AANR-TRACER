// Questions data 
// Statically imported at build time — no fetch, no network, no env vars.
// Move questions.json from /public to /src/data/questions.json (or adjust path).

import questionsData from "../../data/questions.json";

type QuestionsJSON = Record<string, Record<string, unknown[]>>;

export async function getQuestionsJSON(): Promise<QuestionsJSON> {
  return questionsData as unknown as QuestionsJSON;
}

/** No-op — kept so existing callers don't break. */
export function prefetchQuestionsJSON(): void {}