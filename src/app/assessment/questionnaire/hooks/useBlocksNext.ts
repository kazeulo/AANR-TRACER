"use client";

import { IP_INITIATED_LABEL, PLANT_VARIETY_TYPES } from "../../../utils/ipHelpers";
import type { IPData, AnswerValue } from "../../AssessmentContext";
import type { MultiConditionalAnswer } from "../../../utils/trlCalculator";
import type { Question } from "@/types/questions";

interface UseBlocksNextProps {
  isIPCategory: boolean;
  visibleQuestions: Question[];
  answers: Record<string, AnswerValue>;
  ipData: IPData;
  technologyType: string;
}

export function useBlocksNext({
  isIPCategory,
  visibleQuestions,
  answers,
  ipData,
  technologyType,
}: UseBlocksNextProps) {
  const dropdownBlocksNext = !isIPCategory && visibleQuestions.some((q) => {
    if (q.type === "dropdown") return !answers[q.id];
    if (q.type === "multi-conditional") {
      const val = answers[q.id] as { selection?: string } | undefined;
      return !val?.selection;
    }
    return false;
  });

  const ipBlocksNext = (() => {
    if (!isIPCategory) return false;
    const current = ipData[IP_INITIATED_LABEL] ?? {
      initiated: "", selectedTypes: {}, typeStatuses: {}, dusPvpStatus: "",
    };

    if (current.initiated === "") return true;
    if (current.initiated === "no" || current.initiated === "trade_secret") return false;
    if (PLANT_VARIETY_TYPES.includes(technologyType)) return !current.dusPvpStatus;

    const checkedTypes = Object.entries(current.selectedTypes ?? {})
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (checkedTypes.length === 0) return true;
    return checkedTypes.some((t) => !current.typeStatuses[t]);
  })();

  const blocksNext = ipBlocksNext || dropdownBlocksNext;

  const blockMessage = (() => {
    if (!blocksNext) return null;
    if (dropdownBlocksNext) return "Please answer all questions on this page to continue.";
    const current = ipData[IP_INITIATED_LABEL] ?? { initiated: "" };
    if (current.initiated === "") return "Please answer the IP initiation question to continue.";
    if (PLANT_VARIETY_TYPES.includes(technologyType)) return "Please select a Plant Variety Protection status to continue.";
    return "Select at least one IP type and set its status to continue.";
  })();

  return { blocksNext, blockMessage };
}