/**
 * questions-to-csv.mjs
 *
 * Converts src/data/questions.json into a clean, client-readable CSV file.
 *
 * Usage (run from your project root):
 *   node scripts/questions-to-csv.mjs
 *
 * Output:
 *   questions-export.csv  (created in your project root)
 *
 * Each row = one question. Dropdown options and multi-conditional
 * checklist items are expanded into readable columns.
 */

import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT     = path.resolve(__dirname, "../src/data/questions.json");
const OUTPUT    = path.resolve(__dirname, "../questions-export.csv");

// ── Load ──────────────────────────────────────────────────────────────────────
if (!fs.existsSync(INPUT)) {
  console.error(`❌  Could not find ${INPUT}`);
  console.error(`    Run this script from your project root.`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, "utf8"));

// ── CSV helpers ───────────────────────────────────────────────────────────────

/** Wrap a value in quotes and escape any internal quotes. */
function cell(val) {
  if (val === null || val === undefined) return "";
  const str = String(val).trim();
  // Always quote — simplest way to handle commas, newlines, quotes
  return `"${str.replace(/"/g, '""')}"`;
}

function row(...values) {
  return values.map(cell).join(",");
}

// ── Build rows ────────────────────────────────────────────────────────────────

const HEADERS = [
  "Technology Type",
  "TRACER Level",
  "Category",
  "Question ID",
  "Question Text",
  "Question Type",
  "Dropdown / Selection Options",
  "Checklist Items (Yes sub-items)",
  "Tooltip / Hint",
];

const rows = [HEADERS.map(cell).join(",")];

for (const [techType, levels] of Object.entries(data)) {
  // Sort levels numerically
  const sortedLevels = Object.keys(levels).sort((a, b) => Number(a) - Number(b));

  for (const level of sortedLevels) {
    const questions = levels[level];

    for (const q of questions) {
      const qType = q.type ?? "checkbox";

      // ── Format options column ─────────────────────────────────────────────
      let optionsStr = "";
      let checklistStr = "";

      if (qType === "dropdown" && q.options?.length) {
        optionsStr = q.options
          .map(o => {
            const satisfied = o.trlSatisfied != null ? ` → satisfies TRL ${o.trlSatisfied}` : "";
            return `• ${o.label}${satisfied}`;
          })
          .join("\n");
      }

      if (qType === "multi-conditional" && q.options?.length) {
        // Top-level options
        optionsStr = q.options
          .map(o => `• ${o.label}`)
          .join("\n");

        // Checklist items under "Yes"
        const yesOpt = q.options.find(o => o.action === "checklist");
        if (yesOpt?.items?.length) {
          checklistStr = yesOpt.items
            .map(item => `• ${item}`)
            .join("\n");
        }
      }

      rows.push(row(
        techType,
        `TRACER Level ${level}`,
        q.category ?? "",
        q.id ?? "",
        q.questionText ?? "",
        qType,
        optionsStr,
        checklistStr,
        q.toolTip ?? "",
      ));
    }
  }
}

// ── Write ─────────────────────────────────────────────────────────────────────
fs.writeFileSync(OUTPUT, rows.join("\n"), "utf8");

const totalRows = rows.length - 1; // exclude header
console.log(`✅  Done.`);
console.log(`   Questions exported : ${totalRows}`);
console.log(`   Output file        : ${OUTPUT}`);
console.log();
console.log(`   Open in Excel or Google Sheets.`);
console.log(`   If characters look wrong in Excel, import as UTF-8.`);