// ─── Shared questions cache ────────────────────────────────────────────────────
// Single fetch for the entire session. Imported by QuestionnairePage,
// SummaryPage, and ResultsPage so the JSON is only ever downloaded once
// regardless of which page hits it first.

let _raw: Record<string, Record<string, unknown[]>> | null = null;
let _promise: Promise<Record<string, Record<string, unknown[]>>> | null = null;

export async function getQuestionsJSON(): Promise<Record<string, Record<string, unknown[]>>> {
  if (_raw) return _raw;

  // Coalesce parallel calls — only one fetch in flight at a time
  if (!_promise) {
    _promise = fetch("/questions.json")
      .then(r => r.json())
      .then(data => {
        _raw = data;
        _promise = null;
        return data;
      });
  }

  return _promise;
}

/** Warm the cache without blocking — call from SummaryPage on mount. */
export function prefetchQuestionsJSON(): void {
  getQuestionsJSON().catch(() => {});
}