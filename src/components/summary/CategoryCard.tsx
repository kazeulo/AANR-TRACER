import type { Question } from "@/types/questions";
import type { MultiConditionalAnswer } from "@/types/assessment";
import { AnswerRow } from "./answerRow/answerRow";

interface Props {
  category: string;
  questions: Question[];
  answers: Record<string, unknown>;
  onAnswerChange: (q: Question, newValue: unknown) => void;
}

function countAnswered(questions: Question[], answers: Record<string, unknown>): number {
  return questions.filter(q => {
    const a = answers[q.id];
    const t = q.type ?? "checkbox";
    if (t === "checkbox")          return a === true;
    if (t === "dropdown")          return !!a;
    if (t === "multi-conditional") return !!(a as MultiConditionalAnswer)?.selection;
    return false;
  }).length;
}

export function CategoryCard({ category, questions, answers, onAnswerChange }: Props) {
  const answeredCount = countAnswered(questions, answers);

  return (
    <div className="bg-white border border-[#d8d3cc] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,46,26,0.05)]">
      <div className="flex items-center justify-between gap-3 px-7 py-4 border-b border-[#e8e4db] bg-[#f5f2ec]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#2d7a3a] flex-shrink-0" />
          <span className="text-[12px] font-bold tracking-[2px] uppercase text-[#2d7a3a]">{category}</span>
        </div>
        <span className="text-[12px] text-[#6b7a75] flex-shrink-0">
          {answeredCount} / {questions.length} answered
        </span>
      </div>
      <ul className="px-7 py-1 divide-y divide-[#ede9e0]">
        {questions.map(q => (
          <AnswerRow key={q.id} q={q} answer={answers[q.id]} onChangeRequest={onAnswerChange} />
        ))}
      </ul>
    </div>
  );
}