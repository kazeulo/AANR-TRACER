import type { Question } from "@/types/questions";
import { CheckboxRow } from "./CheckboxRow";
import { DropdownRow } from "./DropdownRow";
import { MultiConditionalRow } from "./MultiConditionalRow";

interface Props {
  q: Question;
  answer: unknown;
  onChangeRequest: (q: Question, newValue: unknown) => void;
}

export function AnswerRow({ q, answer, onChangeRequest }: Props) {
  const type = q.type ?? "checkbox";
  if (type === "checkbox")          return <CheckboxRow          q={q} answer={answer} onChangeRequest={onChangeRequest} />;
  if (type === "dropdown")          return <DropdownRow          q={q} answer={answer} onChangeRequest={onChangeRequest} />;
  if (type === "multi-conditional") return <MultiConditionalRow  q={q} answer={answer} onChangeRequest={onChangeRequest} />;
  return null;
}