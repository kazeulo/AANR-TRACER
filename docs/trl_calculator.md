# TRL Calculator

The TRL Calculator is the core engine of AANR-TRACER. It takes a user's answers from the assessment questionnaire and figures out two things: **what TRACER level they've already reached**, and **how high they could potentially go** based on partial progress.

---

## How it works (the big picture)

The calculator receives three inputs:

- **Questions** — the full list of checklist items for the selected technology type
- **Answers** — what the user has checked, selected, or filled in
- **IP Data** — the user's intellectual property status, handled separately because IP has its own branching rules

It then returns a result object with everything the Results page needs to display scores, badges, and recommendations.

---

## What it returns

```
highestCompletedTRL   — the TRACER level the user has fully satisfied
highestAchievableTRL  — the highest level where any progress has been made
completedQuestions    — list of all questions the user has answered correctly
lackingForNextLevel   — what's missing to reach the very next level
lackingForAchievable  — what's missing to reach their highest potential level
lackingToLevel9       — everything still outstanding across all levels
```

---

## The three question types

The assessment has three kinds of questions, each evaluated differently.

### Checkbox
The simplest type. A question at TRL 3, for example, must be checked `true` for that level to count. Nothing more to it.

### Dropdown
Dropdown questions can satisfy **multiple TRL levels** depending on which option is selected. For example, selecting "Filed" might satisfy TRL 4, while selecting "Registered" satisfies TRL 4 and TRL 5. The calculator expands each dropdown into synthetic per-level items so they can be counted individually in the completed and lacking lists.

### Multi-conditional
These are yes/no/exempt questions that come with a sub-checklist. Selecting "Yes" opens a list of items the user must tick off. The question is only fully satisfied at a given level when **all checklist items at or below that level are checked**. Selecting "Exempt" counts the entire question as complete.

---

## How levels are calculated

### Highest Completed TRL
The calculator scans levels from 1 to 9 in order. For each level, it checks whether **every question that applies to that level** is answered correctly. The moment it hits a level where something is missing, it stops — that previous level is the completed TRL.

There is one special case: if a dropdown is answered with a blocking option (like "Not Yet Initiated"), the completed TRL is clamped to just below where that question first becomes relevant. This prevents a user from claiming a level they haven't actually unlocked.

### Highest Achievable TRL
The calculator scans backwards from level 9. The first level where **any question has been answered correctly** becomes the achievable TRL. This represents the user's ceiling — the level they could reach if they completed the remaining requirements.

### TRL 9 Promotion
If the achievable TRL is 9, the completed TRL is also promoted to 9. This handles the case where a user has answered all level-9 questions but the forward scan stopped at a lower level due to a gap.

---

## IP questions

Intellectual Property is treated as a special category. Instead of reading from the regular answers object, the calculator generates three synthetic questions:

| Question | TRL (standard tech) | TRL (plant/animal) |
|---|---|---|
| IP process initiated | 3 | 5 |
| IP application pending | 3 | 6 |
| IP filed or registered | 4 | 7 |

Each is evaluated against the `ipData` object using its own logic — for example, a "trade secret" selection automatically satisfies all three IP questions, while plant variety types check a DUS/PVP status field instead of the standard type/status structure.

---

## Module breakdown

The calculator is split into focused files so each piece can be understood and changed independently.

```
utils/trlCalculator/
├── index.ts                   ← the only import point for the rest of the app
├── trlCalculator.ts           ← orchestrator — wires everything together
├── levelScanner.ts            ← scans levels, finds completed and achievable TRL
├── answerEvaluator.ts         ← "is this question answered at this level?"
├── dropdownHelpers.ts         ← completed/lacking logic for dropdown questions
├── multiConditionalHelpers.ts ← completed/lacking logic for yes/no/exempt questions
└── ipCalculator.ts            ← IP question builder and IP answer evaluator
```

### What each module is responsible for

**`levelScanner.ts`** builds the map of which questions belong to which TRL level, then runs the forward and backward scans to determine completed and achievable TRL. It also applies the null-answer cap for blocking dropdown selections.

**`answerEvaluator.ts`** is the single entry point for "is this question done?" — it looks at the question type and delegates to the right helper. IP questions are detected here by ID and routed to `ipCalculator`.

**`dropdownHelpers.ts`** handles everything specific to dropdown questions — figuring out which TRL levels a given answer satisfies, and producing synthetic `QuestionItem` objects for the completed and lacking lists.

**`multiConditionalHelpers.ts`** handles yes/no/exempt questions — extracting the checklist items, checking which are ticked, and determining whether the question is fully satisfied at a given level.

**`ipCalculator.ts`** builds the three synthetic IP questions and evaluates them against `ipData`. It knows about plant variety types, animal breed types, and trade secret rules.

---

## Importing

Always import from the barrel file — never from individual modules directly.

```ts
import { calculateTRL } from "@/utils/trlCalculator";
import type { TRLResult, QuestionItem } from "@/utils/trlCalculator";
```

Types for answers and IP data come from the shared types file:

```ts
import type { AnswerValue, IPData } from "@/types/assessment";
```

---

## Example usage

```ts
import { calculateTRL } from "@/utils/trlCalculator";

const result = calculateTRL(
  questions,      // QuestionItem[] for the selected technology type
  answers,        // Record<string, AnswerValue> from AssessmentContext
  ipData,         // IPData from AssessmentContext
  technologyType  // e.g. "Agricultural Machinery and Equipment"
);

console.log(result.highestCompletedTRL);   // e.g. 5
console.log(result.highestAchievableTRL);  // e.g. 7
console.log(result.lackingForNextLevel);   // QuestionItem[] missing for TRL 6
```

---

## Common questions

**Why does achievable TRL sometimes equal completed TRL?**
If the user hasn't answered any question beyond their current completed level, there's no partial progress to detect — achievable falls back to completed.

**Why does a single unanswered dropdown block the completed TRL?**
The completed TRL requires every question at every level up to that point to be fully satisfied. A dropdown answered with a null-satisfaction option (like "Not Yet Initiated") signals that a required step hasn't been started, so the level cannot be claimed.

**Why are IP questions handled separately from regular answers?**
IP data has a more complex structure than a simple boolean or string — it tracks multiple IP types, their statuses, and special cases like DUS/PVP for plant varieties. Mixing this into the regular answers object would make both harder to understand and maintain.