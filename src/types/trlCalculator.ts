import { QuestionItem } from "./questions";

export interface TRLResult {
  highestCompletedTRL:  number;
  highestAchievableTRL: number;
  completedQuestions:   QuestionItem[];
  lackingForNextLevel:  QuestionItem[];
  lackingForAchievable: QuestionItem[];
  lackingToLevel9:      QuestionItem[];
}
