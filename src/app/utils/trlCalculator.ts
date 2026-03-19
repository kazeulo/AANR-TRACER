// trlCalculator.ts

//  Types
export interface QuestionItem {
  id: string;
  questionText: string;
  trlLevel: number;
  category: string;
  type?: "checkbox" | "dropdown" | "multi-conditional";
  options?: DropdownOption[] | MultiConditionalOption[];
}

export interface DropdownOption {
  label: string;
  value: string;
  trlSatisfied: number | null;
  contactLabel?: string;
}

export interface MultiConditionalOption {
  label: string;
  value: string;
  action: "contacts" | "checklist" | "exempt";
  items?: string[];
  contactLabel?: string;
}

export interface IPQuestionData {
  initiated: "yes" | "no" | "trade_secret" | "";
  selectedTypes: Record<string, boolean>;
  typeStatuses: Record<string, string>;
}

export interface IPData {
  [questionKey: string]: IPQuestionData;
}

// Answer value types
export type DropdownAnswer = string | null;
export interface MultiConditionalAnswer {
  selection: string;
  checkedItems: string[];
}
export type AnswerValue = boolean | DropdownAnswer | MultiConditionalAnswer;

export interface TRLResult {
  highestCompletedTRL: number;
  highestAchievableTRL: number;
  completedQuestions: QuestionItem[];
  lackingForNextLevel: QuestionItem[];
  lackingForAchievable: QuestionItem[];
  lackingToLevel9: QuestionItem[];  // every unmet item from completedTRL+1 through Level 9
}

// ─── IP synthetic questions ───────────────────────────────────────────────────

const PLANT_ANIMAL_TYPES = [
  "New Plant Variety (Conventional)",
  "New Plant Variety (Gene-Edited and GM)",
  "New Animal Breed or Genetic Resources (Aquatic and Terrestrial)",
];

const IP_INITIATED_LABEL = "Intellectual Property (IP) Initiated";
const IP_FILED_LABEL = "IP Filed or Registered";
export const IP_PENDING_LABEL = "Intellectual Property (IP) is Pending for Review"

function isIPAnsweredYes(label: string, ipEntry: IPQuestionData | undefined): boolean {
  if (!ipEntry) return false;

  if (label === IP_INITIATED_LABEL) {
    return ipEntry.initiated === "yes" || ipEntry.initiated === "trade_secret";
  }

  if (label === IP_FILED_LABEL) {

    if (ipEntry.initiated === "trade_secret") return true;

    return Object.entries(ipEntry.selectedTypes ?? {}).some(
      ([ipType, checked]) =>
        checked &&
        (ipEntry.typeStatuses?.[ipType] === "Filed" ||
          ipEntry.typeStatuses?.[ipType] === "Registered")
    );
  }

  return false;
}

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
      id: "ip-pending",
      questionText: IP_PENDING_LABEL,
      trlLevel: isPlantAnimal ? 6 : 3,
      category: "Intellectual Property Protection Status",
    },
    {
      id: "ip-filed",
      questionText: IP_FILED_LABEL,
      trlLevel: isPlantAnimal ? 7 : 4,
      category: "Intellectual Property Protection Status",
    },
  ];
}

// ─── Answer evaluation ────────────────────────────────────────────────────────

/**
 * For a dropdown question, returns the highest TRL level the selected
 * option satisfies, or null if nothing is satisfied.
 */
function dropdownSatisfiedTRL(
  q: QuestionItem,
  answer: AnswerValue
): number | null {
  if (typeof answer !== "string" || !answer) return null;
  const opts = q.options as DropdownOption[] | undefined;
  if (!opts) return null;
  const selected = opts.find(o => o.value === answer);
  return selected?.trlSatisfied ?? null;
}

/**
 * For a multi-conditional question:
 * - "exempt" - satisfies q.trlLevel
 * - "yes" + at least one item checked - satisfies q.trlLevel
 * - "no"     - does not satisfy
 */
function multiConditionalSatisfied(
  q: QuestionItem,
  answer: AnswerValue
): boolean {
  if (typeof answer !== "object" || answer === null || Array.isArray(answer)) return false;
  const a = answer as MultiConditionalAnswer;
  if (a.selection === "exempt") return true;
  if (a.selection === "yes" && a.checkedItems.length > 0) return true;
  return false;
}

/**
 * Returns true if question q is "answered yes" at the given TRL check level.
 * For dropdowns, the selected option must satisfy >= checkLevel.
 */
function isAnsweredYesAtLevel(
  q: QuestionItem,
  answers: Record<string, AnswerValue>,
  ipData: IPData,
  checkLevel: number
): boolean {
  // IP synthetic questions
  if (q.id === "ip-initiated") return isIPAnsweredYes(IP_INITIATED_LABEL, ipData[IP_INITIATED_LABEL]);
  if (q.id === "ip-filed") return isIPAnsweredYes(IP_FILED_LABEL, ipData[IP_INITIATED_LABEL]);

  const answer = answers[q.id];
  const qType = q.type ?? "checkbox";

  if (qType === "checkbox") {
    return answer === true;
  }

  if (qType === "dropdown") {
    const satisfied = dropdownSatisfiedTRL(q, answer);
    // The dropdown satisfies checkLevel if its trlSatisfied >= checkLevel
    return satisfied !== null && satisfied >= checkLevel;
  }

  if (qType === "multi-conditional") {
    return multiConditionalSatisfied(q, answer);
  }

  return false;
}

function isAnsweredYes(
  q: QuestionItem,
  answers: Record<string, AnswerValue>,
  ipData: IPData
): boolean {
  return isAnsweredYesAtLevel(q, answers, ipData, q.trlLevel);
}

// ─── Main Calculator ──────────────────────────────────────────────────────────

export function calculateTRL(
  allQuestions: QuestionItem[],
  answers: Record<string, AnswerValue>,
  ipData: IPData,
  technologyType: string
): TRLResult {
  const ipQuestions = buildIPQuestions(technologyType);
  const questions: QuestionItem[] = [...allQuestions, ...ipQuestions];

  // Group by TRL level
  const byLevel: Record<number, QuestionItem[]> = {};
  questions.forEach(q => {
    // Dropdown questions span multiple levels — register at each level they can satisfy
    if ((q.type ?? "checkbox") === "dropdown" && q.options) {
      const opts = q.options as DropdownOption[];
      const satisfiableLevels = [...new Set(
        opts.map(o => o.trlSatisfied).filter((v): v is number => v !== null)
      )];
      satisfiableLevels.forEach(lvl => {
        if (!byLevel[lvl]) byLevel[lvl] = [];
        // Only add once per level
        if (!byLevel[lvl].find(existing => existing.id === q.id)) {
          byLevel[lvl].push(q);
        }
      });
    } else {
      if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
      byLevel[q.trlLevel].push(q);
    }
  });

  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);
  const maxLevel = Math.max(...levels);

  // ── Highest Completed TRL ─────────────────────────────────────────────────
  // Highest level N where ALL questions at levels 1..N are satisfied
  let highestCompletedTRL = 0;

  for (const level of levels) {
    const allUpToLevel = questions.filter(q => {
      if ((q.type ?? "checkbox") === "dropdown" && q.options) {
        const opts = q.options as DropdownOption[];
        return opts.some(o => o.trlSatisfied !== null && o.trlSatisfied <= level && o.trlSatisfied >= 1);
      }
      return q.trlLevel <= level;
    });

    const allDone = allUpToLevel.every(q =>
      isAnsweredYesAtLevel(q, answers, ipData, level)
    );

    if (allDone) {
      highestCompletedTRL = level;
    } else {
      break;
    }
  }

  // ── Null-answer cap ───────────────────────────────────────────────────────
  // Only cap if the user's natural TRL reaches (or passes) a dropdown question
  // where they selected a "nothing done yet" option (trlSatisfied: null).
  // Example: if user naturally reaches Level 7 but answered "No Licensing Yet"
  // on a Level 7 question, cap at 6. But if they only reach Level 2 and that
  // same Level 7 question is "No Licensing Yet", don't drag them down to 6.
  questions.forEach(q => {
    if ((q.type ?? "checkbox") !== "dropdown" || !q.options) return;
    const answer = answers[q.id];
    if (typeof answer !== "string" || !answer) return;
    const opts = q.options as DropdownOption[];
    const selected = opts.find(o => o.value === answer);
    if (selected && selected.trlSatisfied === null) {
      // Only apply cap if the user's achieved TRL has reached this question's level
      if (highestCompletedTRL >= q.trlLevel) {
        highestCompletedTRL = Math.min(highestCompletedTRL, q.trlLevel - 1);
      }
    }
  });

  // ── Highest Achievable TRL ────────────────────────────────────────────────
  let highestAchievableTRL = highestCompletedTRL;
  for (const level of [...levels].reverse()) {
    const questionsAtLevel = byLevel[level] ?? [];
    const anyDone = questionsAtLevel.some(q =>
      isAnsweredYesAtLevel(q, answers, ipData, level)
    );
    if (anyDone) {
      highestAchievableTRL = Math.max(highestAchievableTRL, level);
      break;
    }
  }

  // Apply the same null-answer cap to achievable — only when it's in range
  questions.forEach(q => {
    if ((q.type ?? "checkbox") !== "dropdown" || !q.options) return;
    const answer = answers[q.id];
    if (typeof answer !== "string" || !answer) return;
    const opts = q.options as DropdownOption[];
    const selected = opts.find(o => o.value === answer);
    if (selected && selected.trlSatisfied === null) {
      if (highestAchievableTRL >= q.trlLevel) {
        highestAchievableTRL = Math.min(highestAchievableTRL, q.trlLevel - 1);
      }
    }
  });
  // ── Completed Questions ───────────────────────────────────────────────────
  const completedQuestions = questions.filter(q => isAnsweredYes(q, answers, ipData));

  // ── Lacking for Next Level ────────────────────────────────────────────────
  const nextLevel = highestCompletedTRL + 1;
  const lackingForNextLevel =
    nextLevel <= maxLevel
      ? questions.filter(q => {
        if ((q.type ?? "checkbox") === "dropdown" && q.options) {
          const opts = q.options as DropdownOption[];
          const relevant = opts.some(o => o.trlSatisfied !== null && o.trlSatisfied <= nextLevel);
          return relevant && !isAnsweredYesAtLevel(q, answers, ipData, nextLevel);
        }
        return q.trlLevel <= nextLevel && !isAnsweredYes(q, answers, ipData);
      })
      : [];

  // ── Lacking for Achievable ────────────────────────────────────────────────
  const lackingForAchievable =
    highestAchievableTRL > highestCompletedTRL
      ? questions.filter(q => {
        if ((q.type ?? "checkbox") === "dropdown" && q.options) {
          const opts = q.options as DropdownOption[];
          const relevant = opts.some(o => o.trlSatisfied !== null && o.trlSatisfied <= highestAchievableTRL);
          return relevant && !isAnsweredYesAtLevel(q, answers, ipData, highestAchievableTRL);
        }
        return q.trlLevel <= highestAchievableTRL && !isAnsweredYes(q, answers, ipData);
      })
      : [];

  // ── Lacking all the way to Level 9 (full commercialization roadmap) ─────
  const lackingToLevel9 = questions.filter(q => {
    if ((q.type ?? "checkbox") === "dropdown" && q.options) {
      const opts = q.options as DropdownOption[];
      const answer = answers[q.id];
      // If answered with a null-satisfaction option, it's blocking — include it
      if (typeof answer === "string" && answer) {
        const selected = opts.find(o => o.value === answer);
        if (selected && selected.trlSatisfied === null) return true;
      }
      // Include if the dropdown hasn't satisfied its highest possible level yet
      const maxSatisfiable = Math.max(
        ...opts.map(o => o.trlSatisfied ?? 0).filter(v => v > 0)
      );
      return !isAnsweredYesAtLevel(q, answers, ipData, maxSatisfiable);
    }
    return q.trlLevel > highestCompletedTRL && !isAnsweredYes(q, answers, ipData);
  });

  // ── TRL 9 promotion ───────────────────────────────────────────────────────
  if (highestAchievableTRL === 9 && highestCompletedTRL < 9) {
    highestCompletedTRL = 9;
  }

  return {
    highestCompletedTRL,
    highestAchievableTRL,
    completedQuestions,
    lackingForNextLevel,
    lackingForAchievable,
    lackingToLevel9,
  };
}