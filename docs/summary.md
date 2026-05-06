# Summary Page

The Summary Page is the final step of the TRACER assessment. It gives users a chance to review all their answers before submitting and receiving their TRACER Level score.

---

## What It Does

- Shows all answers grouped by category
- Lets users edit any answer before submitting
- Displays technology details (name, type, funding source) as editable fields
- Shows IP protection status separately at the bottom
- Confirms submission before navigating to the results page

---

## Page Structure

### Header
A title and short description reminding the user this is the final review step. There's also an amber notice explaining how editing works and which changes require confirmation.

### Technology Details Card
Three editable fields at the top of the page:
- **Technology Name** — free text input
- **Technology Type** — dropdown (e.g. Food & Beverages, ICT, New Plant Variety)
- **Funding Source** — dropdown (Government, Private, Not Funded Yet)

### Answer Categories
Questions are grouped into their respective categories (e.g. Market Readiness, Technical Readiness). Each category card shows:
- The category name
- How many questions have been answered out of the total
- Each question with its current answer and options to change it

### IP Protection Status
Shown as its own card at the bottom of the answers section. Displays whether IP has been initiated, the type of protection, and the filing/registration status of each IP type.

### Navigation
- **Previous** — goes back to the previous step
- **Submit Assessment** — opens a confirmation modal, then navigates to the results page

---

## Question Types

There are three types of questions, each displayed differently:

| Type | How It Works |
|---|---|
| **Checkbox** | A single yes/no toggle. Click to check or uncheck. |
| **Dropdown** | Shows the current selection and all available options below it. Click any option to change. |
| **Multi-conditional** | Has a top-level selection (e.g. Yes / No / Exempt) and optionally a checklist of sub-items when "Yes" is chosen. |

---

## Editing Answers

Most answer changes require a **confirmation step** — a small modal appears asking the user to confirm before the change is saved. This prevents accidental edits.

The one exception is the sub-item checklist inside multi-conditional questions (the "select all that apply" list). Those can be toggled freely without confirmation since they're considered minor adjustments within an already-confirmed selection.

---

## Components Used

| Component | What It Renders |
|---|---|
| `TechnologyDetailsCard` | The editable name, type, and funding fields |
| `CategoryCard` | One category section with its questions and answered count |
| `AnswerRow` | Picks the right row style based on the question type |
| `CheckboxRow` | A checkbox question |
| `DropdownRow` | A dropdown question with all options listed |
| `MultiConditionalRow` | A yes/no/exempt question with optional sub-checklist |
| `IPSummary` | The IP protection status card |
| `ConfirmSubmitModal` | The modal shown before final submission |
| `ConfirmChangeModal` | The modal shown before saving an answer change |

---

## Data Flow

The page reads from and writes to a shared assessment context via the `useAssessment` hook. Any edits made here are saved immediately to that context. When the user submits, the app navigates to `/assessment/results` where the score is calculated from the saved answers.

Questions are loaded from a cached JSON file based on the selected technology type. If the technology type changes on this page, the question list reloads automatically.