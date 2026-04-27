import { TRACER_LEVELS } from "../../../utils/helperConstants";

export const levelsDescription = [
  { level: 1, label: "Concept & Market Definition" },
  { level: 2, label: "Design / Formulation / Prototype Planning" },
  { level: 3, label: "Prototype Development & Laboratory Testing" },
  { level: 4, label: "Controlled Validation & IP Filing" },
  { level: 5, label: "Pilot Testing & Industry Engagement" },
  { level: 6, label: "Multi-location Testing & Scale-up Preparation" },
  { level: 7, label: "Industry Validation & Regulatory Submission" },
  { level: 8, label: "Commercial Production Readiness" },
  { level: 9, label: "Full Commercialization" },
] as const;

/** Quick lookup: levelsMap[5] → "Pilot Testing & Industry Engagement" */
export const levelsMap: Record<number, string> = Object.fromEntries(
  levelsDescription.map(({ level, label }) => [level, label])
);

// Type to TRACER_LEVELS field mapping

const TYPE_TO_FIELD: Record<string, keyof typeof TRACER_LEVELS[0]> = {
  "Food, Food Ingredients and Beverages":                    "food",
  "Animal Feed, Feed Ingredients and Animal Nutrition":      "animalFeed",
  "Fertilizer and Pesticide":                                "fertilizer",
  "Agri-Aqua Machinery and Facility":                        "machinery",
  "Agri-Aqua Device and Diagnostic Kits":                    "device",
  "ICT (Apps and System involving IoT)":                     "ict",
  "Natural Resource–Derived Materials":                      "naturalResourceMaterials",
  "New Plant Variety":                                       "plantVarietyConventional",
  "New Plant Variety (Gene-Edited and GM)":                  "plantVarietyGeneEdited",
  "New Animal Breed (Aquatic and Terrestrial)":              "animalBreed",
};

/**
 * Returns the domain-specific TRACER level label for a given technology type and level.
 * Falls back to the consolidated label if the type is not found.
 */
export function getTracerLabel(technologyType: string, level: number): string {
  const row = TRACER_LEVELS.find(r => r.level === level);
  if (!row) return "";
  const field = TYPE_TO_FIELD[technologyType];
  return field ? (row[field] as string) : row.consolidated;
}