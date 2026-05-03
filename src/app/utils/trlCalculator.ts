import {
  PLANT_VARIETY_TYPES,
  ANIMAL_BREED_TYPES,
  IP_INITIATED_LABEL,
  IP_PENDING_LABEL,
  IP_FILED_LABEL,
} from "@/constants/ip";

// Types

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
  dusPvpStatus?: string; // only used for plant variety types
}

export interface IPData {
  [questionKey: string]: IPQuestionData;
}

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
  lackingToLevel9: QuestionItem[];
}

// IP synthetic questions 

const PLANT_ANIMAL_TYPES_LOCAL = [
  "New Plant Variety (Conventional)",
  "New Plant Variety (Gene-Edited and GM)",
  "New Animal Breed or Genetic Resources (Aquatic and Terrestrial)",
];

function isIPAnsweredYes(
  label: string,
  ipEntry: IPQuestionData | undefined,
  technologyType: string
): boolean {
  if (!ipEntry) return false;

  const isPlantVariety = PLANT_VARIETY_TYPES.includes(technologyType);
  const isAnimalBreed  = ANIMAL_BREED_TYPES.includes(technologyType);

  if (label === IP_INITIATED_LABEL) {
    return ipEntry.initiated === "yes" || ipEntry.initiated === "trade_secret";
  }

  if (label === IP_PENDING_LABEL) {
    if (ipEntry.initiated === "trade_secret") return true;

    if (isPlantVariety) {
      const val = ipEntry.dusPvpStatus ?? "";
      return val === "submitted" || val === "registered";
    }

    if (isAnimalBreed) {
      return Object.entries(ipEntry.selectedTypes ?? {}).some(([t, checked]) => {
        if (!checked) return false;
        const status = ipEntry.typeStatuses?.[t];
        return status === "pending" || status === "filed" || status === "registered";
      });
    }

    return Object.entries(ipEntry.selectedTypes ?? {}).some(
      ([t, checked]) => checked && !!ipEntry.typeStatuses?.[t]
    );
  }

  if (label === IP_FILED_LABEL) {
    if (ipEntry.initiated === "trade_secret") return true;

    if (isPlantVariety) {
      return ipEntry.dusPvpStatus === "registered";
    }

    if (isAnimalBreed) {
      return Object.entries(ipEntry.selectedTypes ?? {}).some(([t, checked]) => {
        if (!checked) return false;
        const status = ipEntry.typeStatuses?.[t];
        return status === "filed" || status === "registered";
      });
    }

    return Object.entries(ipEntry.selectedTypes ?? {}).some(
      ([t, checked]) =>
        checked &&
        (ipEntry.typeStatuses?.[t] === "Filed" ||
          ipEntry.typeStatuses?.[t] === "Registered")
    );
  }

  return false;
}

function buildIPQuestions(technologyType: string): QuestionItem[] {
  const isPlantAnimal = PLANT_ANIMAL_TYPES_LOCAL.includes(technologyType);
  return [
    { id: "ip-initiated", questionText: IP_INITIATED_LABEL, trlLevel: isPlantAnimal ? 5 : 2, category: "Intellectual Property Protection Status" },
    { id: "ip-pending",   questionText: IP_PENDING_LABEL,   trlLevel: isPlantAnimal ? 6 : 3, category: "Intellectual Property Protection Status" },
    { id: "ip-filed",     questionText: IP_FILED_LABEL,     trlLevel: isPlantAnimal ? 7 : 4, category: "Intellectual Property Protection Status" },
  ];
}

// Dropdown helpers

function dropdownSatisfiedTRL(q: QuestionItem, answer: AnswerValue): number | null {
  if (typeof answer !== "string" || !answer) return null;
  const opts = q.options as DropdownOption[] | undefined;
  if (!opts) return null;
  return opts.find(o => o.value === answer)?.trlSatisfied ?? null;
}

function dropdownLackingItems(
  q: QuestionItem,
  answer: AnswerValue,
  upToLevel?: number
): QuestionItem[] {
  const opts = (q.options as DropdownOption[] | undefined) ?? [];
  const nonNull = opts.filter((o): o is DropdownOption & { trlSatisfied: number } =>
    o.trlSatisfied !== null
  );
  if (!nonNull.length) return [];

  const selectedValue = typeof answer === "string" ? answer : null;
  const selectedOpt   = selectedValue ? opts.find(o => o.value === selectedValue) : null;
  const satisfiedUpTo = selectedOpt?.trlSatisfied ?? null;

  const lacking = nonNull.filter(o =>
    satisfiedUpTo === null ? true : o.trlSatisfied > satisfiedUpTo
  );

  const capped = upToLevel !== undefined
    ? lacking.filter(o => o.trlSatisfied <= upToLevel)
    : lacking;

  const byLevel = new Map<number, DropdownOption & { trlSatisfied: number }>();
  capped.forEach(o => {
    if (!byLevel.has(o.trlSatisfied)) byLevel.set(o.trlSatisfied, o);
  });

  return [...byLevel.values()].map(o => ({
    id:           `${q.id}__lvl${o.trlSatisfied}`,
    questionText: `${q.questionText} — ${o.label}`,
    trlLevel:     o.trlSatisfied,
    category:     q.category,
    type:         "checkbox" as const,
  }));
}

const EXEMPT_LABEL_PATTERNS = [
  /not required/i,
  /not applicable/i,
  /optional only/i,
  /privately funded/i,
  /spin.?off/i,
];

function isExemptLabel(label: string): boolean {
  return EXEMPT_LABEL_PATTERNS.some(p => p.test(label));
}

function dropdownCompletedItems(q: QuestionItem, answer: AnswerValue): QuestionItem[] {
  const opts = (q.options as DropdownOption[] | undefined) ?? [];
  const nonNull = opts.filter((o): o is DropdownOption & { trlSatisfied: number } =>
    o.trlSatisfied !== null
  );
  if (!nonNull.length) return [];

  const selectedValue = typeof answer === "string" ? answer : null;
  const selectedOpt   = selectedValue ? opts.find(o => o.value === selectedValue) : null;
  const satisfiedUpTo = selectedOpt?.trlSatisfied ?? null;
  if (satisfiedUpTo === null) return [];

  if (selectedOpt && isExemptLabel(selectedOpt.label)) {
    return [{
      id:           `${q.id}__lvl${satisfiedUpTo}`,
      questionText: q.questionText,
      trlLevel:     satisfiedUpTo,
      category:     q.category,
      type:         "checkbox" as const,
    }];
  }

  const satisfied = nonNull.filter(o =>
    o.trlSatisfied <= satisfiedUpTo && !isExemptLabel(o.label)
  );

  const byLevel = new Map<number, DropdownOption & { trlSatisfied: number }>();
  satisfied.forEach(o => byLevel.set(o.trlSatisfied, o));

  return [...byLevel.values()].map(o => ({
    id:           `${q.id}__lvl${o.trlSatisfied}`,
    questionText: q.questionText,
    trlLevel:     o.trlSatisfied,
    category:     q.category,
    type:         "checkbox" as const,
  }));
}

// Multi-conditional helpers

function getChecklistItems(q: QuestionItem): ChecklistItem[] {
  if (!q.options) return [];
  const yesOpt = (q.options as MultiConditionalOption[]).find(o => o.action === "checklist");
  return yesOpt?.items ?? [];
}

function multiConditionalLackingItems(
  q: QuestionItem,
  answer: AnswerValue,
  upToLevel?: number
): QuestionItem[] {
  const items = getChecklistItems(q);
  if (!items.length) return [];

  const inRange = (item: ChecklistItem) =>
    upToLevel === undefined || item.trlLevel <= upToLevel;

  if (typeof answer !== "object" || answer === null || Array.isArray(answer)) {
    return items.filter(inRange).map(item => ({
      id: `${q.id}__${item.text}`, questionText: item.text,
      trlLevel: item.trlLevel, category: q.category, type: "checkbox" as const,
    }));
  }

  const a = answer as MultiConditionalAnswer;
  if (a.selection === "exempt") return [];

  if (a.selection === "no") {
    return items.filter(inRange).map(item => ({
      id: `${q.id}__${item.text}`, questionText: item.text,
      trlLevel: item.trlLevel, category: q.category, type: "checkbox" as const,
    }));
  }

  if (a.selection === "yes") {
    return items
      .filter(item => inRange(item) && !a.checkedItems.includes(item.text))
      .map(item => ({
        id: `${q.id}__${item.text}`, questionText: item.text,
        trlLevel: item.trlLevel, category: q.category, type: "checkbox" as const,
      }));
  }

  return [];
}

function multiConditionalCompletedItems(q: QuestionItem, answer: AnswerValue): QuestionItem[] {
  if (typeof answer !== "object" || answer === null || Array.isArray(answer)) return [];
  const a = answer as MultiConditionalAnswer;

  if (a.selection === "exempt") return [q];

  if (a.selection === "yes") {
    const items = getChecklistItems(q);
    return items
      .filter(item => a.checkedItems.includes(item.text))
      .map(item => ({
        id: `${q.id}__${item.text}`, questionText: item.text,
        trlLevel: item.trlLevel, category: q.category, type: "checkbox" as const,
      }));
  }

  return [];
}

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
    const required = items.filter(i => i.trlLevel <= checkLevel);
    return required.length > 0 && required.every(i => a.checkedItems.includes(i.text));
  }
  return false;
}

// Answer evaluation
function isAnsweredYesAtLevel(
  q: QuestionItem,
  answers: Record<string, AnswerValue>,
  ipData: IPData,
  checkLevel: number,
  technologyType: string
): boolean {
  if (q.id === "ip-initiated") return isIPAnsweredYes(IP_INITIATED_LABEL, ipData[IP_INITIATED_LABEL], technologyType);
  if (q.id === "ip-pending")   return isIPAnsweredYes(IP_PENDING_LABEL,   ipData[IP_INITIATED_LABEL], technologyType);
  if (q.id === "ip-filed")     return isIPAnsweredYes(IP_FILED_LABEL,     ipData[IP_INITIATED_LABEL], technologyType);

  const answer = answers[q.id];
  const qType  = q.type ?? "checkbox";

  if (qType === "checkbox") return answer === true;

  if (qType === "dropdown") {
    const satisfied = dropdownSatisfiedTRL(q, answer);
    return satisfied !== null && satisfied >= checkLevel;
  }

  if (qType === "multi-conditional")
    return multiConditionalFullySatisfied(q, answer, checkLevel);

  return false;
}

function isAnsweredYes(
  q: QuestionItem,
  answers: Record<string, AnswerValue>,
  ipData: IPData,
  technologyType: string
): boolean {
  return isAnsweredYesAtLevel(q, answers, ipData, q.trlLevel, technologyType);
}

// Main Calculator

export function calculateTRL(
  allQuestions: QuestionItem[],
  answers: Record<string, AnswerValue>,
  ipData: IPData,
  technologyType: string
): TRLResult {
  const ipQuestions = buildIPQuestions(technologyType);
  const questions: QuestionItem[] = [...allQuestions, ...ipQuestions];

  const dropdownQuestions = questions.filter(q => q.type === "dropdown");
  const mcQuestions       = questions.filter(q => q.type === "multi-conditional");
  const checkboxQuestions = questions.filter(q => (q.type ?? "checkbox") === "checkbox");

  // Build byLevel map
  const byLevel: Record<number, QuestionItem[]> = {};

  const registerAt = (lvl: number, q: QuestionItem) => {
    if (!byLevel[lvl]) byLevel[lvl] = [];
    if (!byLevel[lvl].find(e => e.id === q.id)) byLevel[lvl].push(q);
  };

  checkboxQuestions.forEach(q => registerAt(q.trlLevel, q));

  dropdownQuestions.forEach(q => {
    const opts = (q.options as DropdownOption[]).filter(o => o.trlSatisfied !== null);
    opts.forEach(o => registerAt(o.trlSatisfied!, q));
  });

  mcQuestions.forEach(q => {
    const items = getChecklistItems(q);
    const levels = items.length ? [...new Set(items.map(i => i.trlLevel))] : [q.trlLevel];
    levels.forEach(lvl => registerAt(lvl, q));
  });

  const levels   = Object.keys(byLevel).map(Number).sort((a, b) => a - b);
  const maxLevel = Math.max(...levels, 0);

  // Highest Completed TRL
  let highestCompletedTRL = 0;

  for (const level of levels) {
    const inScope = questions.filter(q => {
      if (q.type === "dropdown" && q.options) {
        const opts = q.options as DropdownOption[];
        return opts.some(o => o.trlSatisfied !== null && o.trlSatisfied <= level);
      }
      if (q.type === "multi-conditional") {
        const items = getChecklistItems(q);
        return items.some(i => i.trlLevel <= level);
      }
      return q.trlLevel <= level;
    });

    const allDone = inScope.every(q =>
      isAnsweredYesAtLevel(q, answers, ipData, level, technologyType)
    );
    if (allDone) highestCompletedTRL = level;
    else break;
  }

  // Null-answer cap for highestCompletedTRL only.
  // A dropdown answered with a null-satisfaction option (e.g. "Not Yet Initiated")
  // blocks completion — clamp completed TRL to just below that level.
  // This cap is intentionally NOT applied to highestAchievableTRL because
  // achievable represents potential, and a blocking answer on one question
  // should not suppress genuine progress already made at higher levels.
  dropdownQuestions.forEach(q => {
    const answer = answers[q.id];
    if (typeof answer !== "string" || !answer) return;
    const opts     = q.options as DropdownOption[];
    const selected = opts.find(o => o.value === answer);
    if (selected?.trlSatisfied !== null) return;

    const lowestLevel = Math.min(
      ...opts.filter(o => o.trlSatisfied !== null).map(o => o.trlSatisfied!)
    );
    if (highestCompletedTRL >= lowestLevel) {
      highestCompletedTRL = Math.min(highestCompletedTRL, lowestLevel - 1);
    }
  });

  // Highest Achievable TRL
  let highestAchievableTRL = highestCompletedTRL;
  for (const level of [...levels].reverse()) {
    const anyDone = (byLevel[level] ?? []).some(q =>
      isAnsweredYesAtLevel(q, answers, ipData, level, technologyType)
    );
    if (anyDone) { highestAchievableTRL = Math.max(highestAchievableTRL, level); break; }
  }

  // Completed Questions 
  const completedQuestions: QuestionItem[] = [];

  checkboxQuestions.forEach(q => {
    if (isAnsweredYes(q, answers, ipData, technologyType)) completedQuestions.push(q);
  });

  dropdownQuestions.forEach(q => {
    completedQuestions.push(...dropdownCompletedItems(q, answers[q.id]));
  });

  mcQuestions.forEach(q => {
    completedQuestions.push(...multiConditionalCompletedItems(q, answers[q.id]));
  });

  // Lacking for Next Level
  const nextLevel = highestCompletedTRL + 1;
  const lackingForNextLevel: QuestionItem[] = [];

  if (nextLevel <= maxLevel) {
    checkboxQuestions.forEach(q => {
      if (q.trlLevel <= nextLevel && !isAnsweredYes(q, answers, ipData, technologyType))
        lackingForNextLevel.push(q);
    });

    dropdownQuestions.forEach(q => {
      lackingForNextLevel.push(...dropdownLackingItems(q, answers[q.id], nextLevel));
    });

    mcQuestions.forEach(q => {
      lackingForNextLevel.push(...multiConditionalLackingItems(q, answers[q.id], nextLevel));
    });
  }

  // Lacking for Achievable
  const lackingForAchievable: QuestionItem[] = [];

  if (highestAchievableTRL > highestCompletedTRL) {
    checkboxQuestions.forEach(q => {
      if (q.trlLevel <= highestAchievableTRL && !isAnsweredYes(q, answers, ipData, technologyType))
        lackingForAchievable.push(q);
    });

    dropdownQuestions.forEach(q => {
      lackingForAchievable.push(...dropdownLackingItems(q, answers[q.id], highestAchievableTRL));
    });

    mcQuestions.forEach(q => {
      lackingForAchievable.push(...multiConditionalLackingItems(q, answers[q.id], highestAchievableTRL));
    });
  }

  // Lacking to Level 9
  const lackingToLevel9: QuestionItem[] = [];

  checkboxQuestions.forEach(q => {
    if (q.trlLevel > highestCompletedTRL && !isAnsweredYes(q, answers, ipData, technologyType))
      lackingToLevel9.push(q);
  });

  dropdownQuestions.forEach(q => {
    lackingToLevel9.push(
      ...dropdownLackingItems(q, answers[q.id])
        .filter(item => item.trlLevel > highestCompletedTRL)
    );
  });

  mcQuestions.forEach(q => {
    lackingToLevel9.push(
      ...multiConditionalLackingItems(q, answers[q.id])
        .filter(item => item.trlLevel > highestCompletedTRL)
    );
  });

  // TRL 9 promotion
  if (highestAchievableTRL === 9 && highestCompletedTRL < 9)
    highestCompletedTRL = 9;

  return {
    highestCompletedTRL,
    highestAchievableTRL,
    completedQuestions,
    lackingForNextLevel,
    lackingForAchievable,
    lackingToLevel9,
  };
}