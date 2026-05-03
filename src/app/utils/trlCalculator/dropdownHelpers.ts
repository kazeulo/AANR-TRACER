// utils/trlCalculator/dropdownHelpers.ts

// Handles TRL satisfaction, completed items, and lacking items
// for dropdown-type questions. Dropdown questions can satisfy
// multiple TRL levels depending on which option is selected.

import type { AnswerValue } from "@/types/assessment";
import type { QuestionItem, DropdownOption } from "@/types/questions";

// Type guard 

// Narrows DropdownOption to one that has a concrete trlSatisfied number,
// ruling out both null and undefined without needing non-null assertions.
export function hasLevel(
  o: DropdownOption,
): o is DropdownOption & { trlSatisfied: number } {
  return o.trlSatisfied != null;
}

// Exempt label detection

const EXEMPT_LABEL_PATTERNS = [
  /not required/i,
  /not applicable/i,
  /optional only/i,
  /privately funded/i,
  /spin.?off/i,
];

export function isExemptLabel(label: string): boolean {
  return EXEMPT_LABEL_PATTERNS.some(p => p.test(label));
}

// Core helpers 

/** Returns the highest TRL level satisfied by the selected dropdown option. */
export function dropdownSatisfiedTRL(
  q:      QuestionItem,
  answer: AnswerValue,
): number | null {
  if (typeof answer !== "string" || !answer) return null;
  const opts = q.options as DropdownOption[] | undefined;
  if (!opts) return null;
  return opts.find(o => o.value === answer)?.trlSatisfied ?? null;
}

/**
 * Returns synthetic QuestionItems representing dropdown levels that are
 * NOT yet satisfied by the current answer, optionally capped to upToLevel.
 */
export function dropdownLackingItems(
  q:          QuestionItem,
  answer:     AnswerValue,
  upToLevel?: number,
): QuestionItem[] {
  const opts    = (q.options as DropdownOption[] | undefined) ?? [];
  const nonNull = opts.filter(hasLevel);
  if (!nonNull.length) return [];

  const selectedValue = typeof answer === "string" ? answer : null;
  const selectedOpt   = selectedValue ? opts.find(o => o.value === selectedValue) : null;
  const satisfiedUpTo = selectedOpt?.trlSatisfied ?? null;

  const lacking = nonNull.filter(o =>
    satisfiedUpTo == null ? true : o.trlSatisfied > satisfiedUpTo,
  );
  const capped = upToLevel !== undefined
    ? lacking.filter(o => o.trlSatisfied <= upToLevel)
    : lacking;

  // One synthetic item per TRL level — keep the first option at each level
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

/**
 * Returns synthetic QuestionItems representing dropdown levels that ARE
 * satisfied by the current answer.
 */
export function dropdownCompletedItems(
  q:      QuestionItem,
  answer: AnswerValue,
): QuestionItem[] {
  const opts    = (q.options as DropdownOption[] | undefined) ?? [];
  const nonNull = opts.filter(hasLevel);
  if (!nonNull.length) return [];

  const selectedValue = typeof answer === "string" ? answer : null;
  const selectedOpt   = selectedValue ? opts.find(o => o.value === selectedValue) : null;
  const satisfiedUpTo = selectedOpt?.trlSatisfied ?? null;
  if (satisfiedUpTo == null) return [];

  // Exempt options satisfy one synthetic item at their level
  if (selectedOpt && isExemptLabel(selectedOpt.label)) {
    return [{
      id:           `${q.id}__lvl${satisfiedUpTo}`,
      questionText: q.questionText,
      trlLevel:     satisfiedUpTo,
      category:     q.category,
      type:         "checkbox" as const,
    }];
  }

  const satisfied = nonNull.filter(
    o => o.trlSatisfied <= satisfiedUpTo && !isExemptLabel(o.label),
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