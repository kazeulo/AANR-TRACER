// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuestionItem {
  id: string;
  questionText: string;
  trlLevel: number;
  category: string;
}

export interface IPQuestionData {
  initiated: "yes" | "no" | "trade_secret" | "";
  selectedTypes: Record<string, boolean>;
  typeStatuses: Record<string, string>;
}

export interface IPData {
  [questionKey: string]: IPQuestionData;
}

export interface TRLResult {
  highestCompletedTRL: number;   // highest level where ALL questions (1..level) are answered yes
  highestAchievableTRL: number;  // highest level where at least one question was answered yes
  completedQuestions: QuestionItem[];
  lackingForNextLevel: QuestionItem[];
  lackingForAchievable: QuestionItem[];
}

// ─── IP synthetic questions ───────────────────────────────────────────────────
// IP questions are treated as regular questions at their TRL level.
// "IP Initiated" → trlLevel depends on tech type (2 or 5)
// "IP Filed or Registered" → trlLevel depends on tech type (3 or 6)

const PLANT_ANIMAL_TYPES = [
  "New Plant Variety (Conventional)",
  "New Plant Variety (Gene-Edited and GM)",
  "New Animal Breed (Aquatic and Terrestrial)",
];

const IP_INITIATED_LABEL = "Intellectual Property (IP) Initiated";
const IP_FILED_LABEL = "IP Filed or Registered";

/**
 * Determines whether an IP question counts as "answered yes".
 * - IP Initiated: yes if initiated === "yes" or "trade_secret"
 * - IP Filed or Registered: yes if at least one selected IP type has status "Filed" or "Registered"
 */
function isIPAnsweredYes(label: string, ipEntry: IPQuestionData | undefined): boolean {
  if (!ipEntry) return false;

  if (label === IP_INITIATED_LABEL) {
    return ipEntry.initiated === "yes" || ipEntry.initiated === "trade_secret";
  }

  if (label === IP_FILED_LABEL) {
    // Types and their statuses are entered under the "IP Initiated" section.
    // Filed counts as "yes" if at least ONE checked type has status Filed or Registered —
    // even if other checked types are still Pending.
    const initiatedEntry = ipEntry; // ipData[IP_FILED_LABEL] shares structure; but we
    // actually need to read from the Initiated entry. This is handled in the caller
    // by passing ipData[IP_INITIATED_LABEL] when label === IP_FILED_LABEL.
    return Object.entries(initiatedEntry.selectedTypes ?? {}).some(
      ([ipType, checked]) =>
        checked &&
        (initiatedEntry.typeStatuses?.[ipType] === "Filed" ||
          initiatedEntry.typeStatuses?.[ipType] === "Registered")
    );
  }

  return false;
}

/**
 * Builds synthetic IP question items to inject into the question pool.
 */
function buildIPQuestions(technologyType: string): QuestionItem[] {
  const isPlantAnimal = PLANT_ANIMAL_TYPES.includes(technologyType);
  return [
    {
      id: "ip-initiated",
      questionText: IP_INITIATED_LABEL,
      trlLevel: isPlantAnimal ? 5 : 2,
      category: "Intellectual Property Protection Status",
    },
    {
      id: "ip-filed",
      questionText: IP_FILED_LABEL,
      trlLevel: isPlantAnimal ? 6 : 3,
      category: "Intellectual Property Protection Status",
    },
  ];
}

// ─── Main Calculator ──────────────────────────────────────────────────────────

export function calculateTRL(
  allQuestions: QuestionItem[],      // all questions for the selected technology type (from CSV)
  answers: Record<string, boolean>,  // question id → true/false
  ipData: IPData,                    // ip section answers
  technologyType: string
): TRLResult {
  // Merge regular questions with synthetic IP questions
  const ipQuestions = buildIPQuestions(technologyType);
  const questions: QuestionItem[] = [...allQuestions, ...ipQuestions];

  // Build a unified answered-yes set
  const isAnsweredYes = (q: QuestionItem): boolean => {
    if (q.id === "ip-initiated") return isIPAnsweredYes(IP_INITIATED_LABEL, ipData[IP_INITIATED_LABEL]);
    // ip-filed: pass the Initiated entry so we read the same selectedTypes/typeStatuses
    // the user filled in — at least one type must be Filed or Registered
    if (q.id === "ip-filed") return isIPAnsweredYes(IP_FILED_LABEL, ipData[IP_INITIATED_LABEL]);
    return answers[q.id] === true;
  };

  // Group questions by TRL level
  const byLevel: Record<number, QuestionItem[]> = {};
  questions.forEach(q => {
    if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
    byLevel[q.trlLevel].push(q);
  });

  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);
  const maxLevel = Math.max(...levels);

  // ── Highest Completed TRL ──────────────────────────────────────────────────
  // Find the highest level N such that ALL questions at levels 1..N are answered yes
  let highestCompletedTRL = 0;
  for (const level of levels) {
    // Check all questions from level 1 up to this level
    const allUpToLevel = questions.filter(q => q.trlLevel <= level);
    const allDone = allUpToLevel.every(q => isAnsweredYes(q));
    if (allDone) {
      highestCompletedTRL = level;
    } else {
      break; // TRL must be contiguous from the bottom
    }
  }

  // ── Highest Achievable TRL ─────────────────────────────────────────────────
  // Find the highest level where at least one question was answered yes
  let highestAchievableTRL = highestCompletedTRL;
  for (const level of [...levels].reverse()) {
    const questionsAtLevel = byLevel[level] ?? [];
    const anyDone = questionsAtLevel.some(q => isAnsweredYes(q));
    if (anyDone) {
      highestAchievableTRL = Math.max(highestAchievableTRL, level);
      break;
    }
  }

  // ── Completed Questions ────────────────────────────────────────────────────
  const completedQuestions = questions.filter(q => isAnsweredYes(q));

  // ── Lacking for Next Level ─────────────────────────────────────────────────
  // All unanswered questions at levels 1..(highestCompletedTRL + 1)
  const nextLevel = highestCompletedTRL + 1;
  const lackingForNextLevel =
    nextLevel <= maxLevel
      ? questions.filter(q => q.trlLevel <= nextLevel && !isAnsweredYes(q))
      : [];

  // ── Lacking for Achievable 
  // All unanswered questions at levels 1..highestAchievableTRL
  const lackingForAchievable =
    highestAchievableTRL > highestCompletedTRL
      ? questions.filter(q => q.trlLevel <= highestAchievableTRL && !isAnsweredYes(q))
      : [];

  return {
    highestCompletedTRL,
    highestAchievableTRL,
    completedQuestions,
    lackingForNextLevel,
    lackingForAchievable,
  };
}