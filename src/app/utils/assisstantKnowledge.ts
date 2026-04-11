import knowledge from "./knowledge.json";

interface KnowledgeEntry {
  id: string;
  topic: string;
  question: string;
  keywords: string[];
  answer: string;
}

export function retrieveRelevant(query: string, topK = 4): KnowledgeEntry[] {
  const q = query.toLowerCase();
  return (knowledge.entries as KnowledgeEntry[])
    .map(entry => ({
      ...entry,
      score: entry.keywords.filter(k => q.includes(k.toLowerCase())).length,
    }))
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}