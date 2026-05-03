// utils/trlCalculator/ipCalculator.ts

// Builds synthetic IP QuestionItems and evaluates their answers.
// Isolated here because IP logic has its own branching rules per tech type
// that are unrelated to the core checkbox/dropdown/multi-conditional flow.

import {
  PLANT_VARIETY_TYPES,
  ANIMAL_BREED_TYPES,
  IP_INITIATED_LABEL,
  IP_PENDING_LABEL,
  IP_FILED_LABEL,
  PLANT_ANIMAL_TYPES,
} from "@/constants/ip";

import type { IPQuestionData, IPData } from "@/types/assessment";
import type { QuestionItem } from "@/types/questions";

// IP answer evaluation 

export function isIPAnsweredYes(
  label:         string,
  ipEntry:       IPQuestionData | undefined,
  technologyType: string,
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
      ([t, checked]) => checked && !!ipEntry.typeStatuses?.[t],
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
          ipEntry.typeStatuses?.[t] === "Registered"),
    );
  }

  return false;
}

// IP question builder 

export function buildIPQuestions(technologyType: string): QuestionItem[] {
  const isPlantAnimal = PLANT_ANIMAL_TYPES.includes(technologyType);
  const category      = "Intellectual Property Protection Status";

  return [
    { id: "ip-initiated", questionText: IP_INITIATED_LABEL, trlLevel: isPlantAnimal ? 5 : 3, category },
    { id: "ip-pending",   questionText: IP_PENDING_LABEL,   trlLevel: isPlantAnimal ? 6 : 3, category },
    { id: "ip-filed",     questionText: IP_FILED_LABEL,     trlLevel: isPlantAnimal ? 7 : 4, category },
  ];
}

// IP answer checker (used by answerEvaluator) 

export function evaluateIPQuestion(
  questionId:    string,
  ipData:        IPData,
  technologyType: string,
): boolean | null {
  if (questionId === "ip-initiated")
    return isIPAnsweredYes(IP_INITIATED_LABEL, ipData[IP_INITIATED_LABEL], technologyType);
  if (questionId === "ip-pending")
    return isIPAnsweredYes(IP_PENDING_LABEL, ipData[IP_INITIATED_LABEL], technologyType);
  if (questionId === "ip-filed")
    return isIPAnsweredYes(IP_FILED_LABEL, ipData[IP_INITIATED_LABEL], technologyType);

  return null; // not an IP question
}