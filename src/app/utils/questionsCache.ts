type QuestionsJSON = Record<string, Record<string, unknown[]>>;

export async function getQuestionsJSON(): Promise<QuestionsJSON> {
  const res = await fetch("/data/questions.json");

  if (!res.ok) {
    throw new Error("Failed to load questions.json");
  }

  const data = await res.json();
  return data as QuestionsJSON;
}

/** Optional: preload helper */
export function prefetchQuestionsJSON(): void {
  fetch("/data/questions.json");
}