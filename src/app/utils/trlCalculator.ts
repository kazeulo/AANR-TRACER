// ─── Types ────────────────────────────────────────────────────────────────────

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

// Each checklist item now carries its own trlLevel
export interface ChecklistItem {
  text: string;
  trlLevel: number;
}

export interface MultiConditionalOption {
  label: string;
  value: string;
  action: "contacts" | "checklist" | "exempt";
  items?: ChecklistItem[];   
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
  // checkedItems stores item texts (same as ChecklistItem.text)
  checkedItems: string[];
}
export type AnswerValue = boolean | DropdownAnswer | MultiConditionalAnswer;

export interface TRLResult {
  highestCompletedTRL: number;
  highestAchievableTRL: number;
  completedQuestions: QuestionItem[];
  lackingForNextLevel: QuestionItem[];
  lackingForAchievable: QuestionItem[];
  lackingToLevel9: QuestionItem[];
}

// ─── IP synthetic questions ───────────────────────────────────────────────────

const PLANT_ANIMAL_TYPES = [
  "New Plant Variety (Conventional)",
  "New Plant Variety (Gene-Edited and GM)",
  "New Animal Breed (Aquatic and Terrestrial)",
];

const IP_INITIATED_LABEL = "Intellectual Property (IP) Initiated";
const IP_PENDING_LABEL   = "Intellectual Property (IP) is Pending for Review";
const IP_FILED_LABEL     = "IP Filed or Registered";

function isIPAnsweredYes(label: string, ipEntry: IPQuestionData | undefined): boolean {
  if (!ipEntry) return false;

  if (label === IP_INITIATED_LABEL)
    return ipEntry.initiated === "yes" || ipEntry.initiated === "trade_secret";

  if (label === IP_PENDING_LABEL) {
    if (ipEntry.initiated === "trade_secret") return true;
    return Object.entries(ipEntry.selectedTypes ?? {}).some(
      ([ipType, checked]) => checked && !!ipEntry.typeStatuses?.[ipType]
    );
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

// ─── Multi-conditional helpers ────────────────────────────────────────────────

/**
 * Extract the checklist items (with their individual trlLevels) from a
 * multi-conditional question's "yes" option.
 */
function getChecklistItems(q: QuestionItem): ChecklistItem[] {
  if (!q.options) return [];
  const yesOpt = (q.options as MultiConditionalOption[]).find(o => o.action === "checklist");
  return yesOpt?.items ?? [];
}

/**
 * Expand unchecked checklist items into individual QuestionItem objects,
 * each carrying the item's own trlLevel (not the parent question's trlLevel).
 *
 * - "exempt"  → nothing lacking
 * - "no"      → all items lacking
 * - "yes"     → only unchecked items lacking
 * - unanswered → all items lacking
 */
function multiConditionalLackingItems(
  q: QuestionItem,
  answer: AnswerValue,
  upToLevel?: number        // if provided, only return items at trlLevel <= upToLevel
): QuestionItem[] {
  const items = getChecklistItems(q);
  if (!items.length) return [];

  const inRange = (item: ChecklistItem) =>
    upToLevel === undefined || item.trlLevel <= upToLevel;

  // Unanswered — all items lacking
  if (typeof answer !== "object" || answer === null || Array.isArray(answer)) {
    return items.filter(inRange).map(item => ({
      id: `${q.id}__${item.text}`,
      questionText: item.text,
      trlLevel: item.trlLevel,       // ← per-item level
      category: q.category,
      type: "checkbox" as const,
    }));
  }

  const a = answer as MultiConditionalAnswer;

  if (a.selection === "exempt") return [];

  if (a.selection === "no") {
    return items.filter(inRange).map(item => ({
      id: `${q.id}__${item.text}`,
      questionText: item.text,
      trlLevel: item.trlLevel,
      category: q.category,
      type: "checkbox" as const,
    }));
  }

  if (a.selection === "yes") {
    return items
      .filter(item => inRange(item) && !a.checkedItems.includes(item.text))
      .map(item => ({
        id: `${q.id}__${item.text}`,
        questionText: item.text,
        trlLevel: item.trlLevel,
        category: q.category,
        type: "checkbox" as const,
      }));
  }

  return [];
}

/**
 * Expand checked checklist items into individual completed QuestionItem objects.
 * Each carries the item's own trlLevel.
 *
 * - "exempt"  → the parent question itself counts as complete (at q.trlLevel)
 * - "yes"     → each checked item is a completed sub-question at item.trlLevel
 * - "no"      → nothing complete
 */
function multiConditionalCompletedItems(q: QuestionItem, answer: AnswerValue): QuestionItem[] {
  if (typeof answer !== "object" || answer === null || Array.isArray(answer)) return [];
  const a = answer as MultiConditionalAnswer;

  if (a.selection === "exempt") return [q];

  if (a.selection === "yes") {
    const items = getChecklistItems(q);
    return items
      .filter(item => a.checkedItems.includes(item.text))
      .map(item => ({
        id: `${q.id}__${item.text}`,
        questionText: item.text,
        trlLevel: item.trlLevel,     // ← per-item level
        category: q.category,
        type: "checkbox" as const,
      }));
  }

  return [];
}

/**
 * A multi-conditional question is FULLY satisfied at a given checkLevel when:
 * - selection is "exempt", OR
 * - selection is "yes" AND every item whose trlLevel <= checkLevel is checked.
 */
function multiConditionalFullySatisfied(
  q: QuestionItem,
  answer: AnswerValue,
  checkLevel: number
): boolean {
  if (typeof answer !== "object" || answer === null || Array.isArray(answer)) return false;
  const a = answer as MultiConditionalAnswer;

  if (a.selection === "exempt") return true;

  if (a.selection === "yes") {
    const items = getChecklistItems(q);
    // Only items required at or below this level must be checked
    const requiredAtLevel = items.filter(item => item.trlLevel <= checkLevel);
    return (
      requiredAtLevel.length > 0 &&
      requiredAtLevel.every(item => a.checkedItems.includes(item.text))
    );
  }

  return false;
}

// ─── Answer evaluation ────────────────────────────────────────────────────────

function dropdownSatisfiedTRL(q: QuestionItem, answer: AnswerValue): number | null {
  if (typeof answer !== "string" || !answer) return null;
  const opts = q.options as DropdownOption[] | undefined;
  if (!opts) return null;
  const selected = opts.find(o => o.value === answer);
  return selected?.trlSatisfied ?? null;
}

function isAnsweredYesAtLevel(
  q: QuestionItem,
  answers: Record<string, AnswerValue>,
  ipData: IPData,
  checkLevel: number
): boolean {
  if (q.id === "ip-initiated") return isIPAnsweredYes(IP_INITIATED_LABEL, ipData[IP_INITIATED_LABEL]);
  if (q.id === "ip-pending")   return isIPAnsweredYes(IP_PENDING_LABEL,   ipData[IP_INITIATED_LABEL]);
  if (q.id === "ip-filed")     return isIPAnsweredYes(IP_FILED_LABEL,     ipData[IP_INITIATED_LABEL]);

  const answer = answers[q.id];
  const qType = q.type ?? "checkbox";

  if (qType === "checkbox") return answer === true;

  if (qType === "dropdown") {
    const satisfied = dropdownSatisfiedTRL(q, answer);
    return satisfied !== null && satisfied >= checkLevel;
  }

  if (qType === "multi-conditional") {
    // Pass checkLevel so only items required at this level are evaluated
    return multiConditionalFullySatisfied(q, answer, checkLevel);
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

  const regularQuestions = questions.filter(q => (q.type ?? "checkbox") !== "multi-conditional");
  const mcQuestions      = questions.filter(q => q.type === "multi-conditional");

  // Group regular questions by TRL level
  const byLevel: Record<number, QuestionItem[]> = {};

  regularQuestions.forEach(q => {
    if ((q.type ?? "checkbox") === "dropdown" && q.options) {
      const opts = q.options as DropdownOption[];
      const satisfiableLevels = [...new Set(
        opts.map(o => o.trlSatisfied).filter((v): v is number => v !== null)
      )];
      satisfiableLevels.forEach(lvl => {
        if (!byLevel[lvl]) byLevel[lvl] = [];
        if (!byLevel[lvl].find(e => e.id === q.id)) byLevel[lvl].push(q);
      });
    } else {
      if (!byLevel[q.trlLevel]) byLevel[q.trlLevel] = [];
      byLevel[q.trlLevel].push(q);
    }
  });

  // Register multi-conditional questions at every level their items span
  mcQuestions.forEach(q => {
    const items = getChecklistItems(q);
    const levels = items.length
      ? [...new Set(items.map(i => i.trlLevel))]
      : [q.trlLevel];

    levels.forEach(lvl => {
      if (!byLevel[lvl]) byLevel[lvl] = [];
      if (!byLevel[lvl].find(e => e.id === q.id)) byLevel[lvl].push(q);
    });
  });

  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);
  const maxLevel = Math.max(...levels);

  // ── Highest Completed TRL ─────────────────────────────────────────────────
  let highestCompletedTRL = 0;

  for (const level of levels) {
    const allUpToLevel = questions.filter(q => {
      if ((q.type ?? "checkbox") === "dropdown" && q.options) {
        const opts = q.options as DropdownOption[];
        return opts.some(o => o.trlSatisfied !== null && o.trlSatisfied <= level && o.trlSatisfied >= 1);
      }
      if (q.type === "multi-conditional") {
        const items = getChecklistItems(q);
        // Include this MC question if any of its items are required at or below this level
        return items.some(i => i.trlLevel <= level);
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

  // Null-answer cap for dropdowns
  questions.forEach(q => {
    if ((q.type ?? "checkbox") !== "dropdown" || !q.options) return;
    const answer = answers[q.id];
    if (typeof answer !== "string" || !answer) return;
    const opts = q.options as DropdownOption[];
    const selected = opts.find(o => o.value === answer);
    if (selected && selected.trlSatisfied === null && highestCompletedTRL >= q.trlLevel) {
      highestCompletedTRL = Math.min(highestCompletedTRL, q.trlLevel - 1);
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

  questions.forEach(q => {
    if ((q.type ?? "checkbox") !== "dropdown" || !q.options) return;
    const answer = answers[q.id];
    if (typeof answer !== "string" || !answer) return;
    const opts = q.options as DropdownOption[];
    const selected = opts.find(o => o.value === answer);
    if (selected && selected.trlSatisfied === null && highestAchievableTRL >= q.trlLevel) {
      highestAchievableTRL = Math.min(highestAchievableTRL, q.trlLevel - 1);
    }
  });

  // ── Completed Questions ───────────────────────────────────────────────────
  const completedQuestions: QuestionItem[] = [];

  regularQuestions.forEach(q => {
    if (isAnsweredYes(q, answers, ipData)) completedQuestions.push(q);
  });

  mcQuestions.forEach(q => {
    completedQuestions.push(...multiConditionalCompletedItems(q, answers[q.id]));
  });

  // ── Lacking for Next Level ────────────────────────────────────────────────
  const nextLevel = highestCompletedTRL + 1;
  const lackingForNextLevel: QuestionItem[] = [];

  if (nextLevel <= maxLevel) {
    regularQuestions.forEach(q => {
      if ((q.type ?? "checkbox") === "dropdown" && q.options) {
        const opts = q.options as DropdownOption[];
        const relevant = opts.some(o => o.trlSatisfied !== null && o.trlSatisfied <= nextLevel);
        if (relevant && !isAnsweredYesAtLevel(q, answers, ipData, nextLevel))
          lackingForNextLevel.push(q);
      } else if (q.trlLevel <= nextLevel && !isAnsweredYes(q, answers, ipData)) {
        lackingForNextLevel.push(q);
      }
    });

    mcQuestions.forEach(q => {
      // Only expand items required at or below nextLevel
      lackingForNextLevel.push(
        ...multiConditionalLackingItems(q, answers[q.id], nextLevel)
      );
    });
  }

  // ── Lacking for Achievable ────────────────────────────────────────────────
  const lackingForAchievable: QuestionItem[] = [];

  if (highestAchievableTRL > highestCompletedTRL) {
    regularQuestions.forEach(q => {
      if ((q.type ?? "checkbox") === "dropdown" && q.options) {
        const opts = q.options as DropdownOption[];
        const relevant = opts.some(o => o.trlSatisfied !== null && o.trlSatisfied <= highestAchievableTRL);
        if (relevant && !isAnsweredYesAtLevel(q, answers, ipData, highestAchievableTRL))
          lackingForAchievable.push(q);
      } else if (q.trlLevel <= highestAchievableTRL && !isAnsweredYes(q, answers, ipData)) {
        lackingForAchievable.push(q);
      }
    });

    mcQuestions.forEach(q => {
      lackingForAchievable.push(
        ...multiConditionalLackingItems(q, answers[q.id], highestAchievableTRL)
      );
    });
  }

  // ── Lacking to Level 9 ────────────────────────────────────────────────────
  const lackingToLevel9: QuestionItem[] = [];

  regularQuestions.forEach(q => {
    if ((q.type ?? "checkbox") === "dropdown" && q.options) {
      const opts = q.options as DropdownOption[];
      const answer = answers[q.id];
      if (typeof answer === "string" && answer) {
        const selected = opts.find(o => o.value === answer);
        if (selected && selected.trlSatisfied === null) {
          lackingToLevel9.push(q);
          return;
        }
      }
      const maxSatisfiable = Math.max(
        ...opts.map(o => o.trlSatisfied ?? 0).filter(v => v > 0)
      );
      if (!isAnsweredYesAtLevel(q, answers, ipData, maxSatisfiable))
        lackingToLevel9.push(q);
    } else if (q.trlLevel > highestCompletedTRL && !isAnsweredYes(q, answers, ipData)) {
      lackingToLevel9.push(q);
    }
  });

  // All missing MC items above completedTRL (no level cap = full roadmap)
  mcQuestions.forEach(q => {
    lackingToLevel9.push(
      ...multiConditionalLackingItems(q, answers[q.id])
        .filter(item => item.trlLevel > highestCompletedTRL)
    );
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