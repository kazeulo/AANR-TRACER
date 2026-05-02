// components/assistant/WelcomeState.tsx
import BotAvatar from "./BotAvatar";
import { SUGGESTED_QUESTIONS } from "./suggestedQuestions";

interface Props {
  onSelectQuestion: (q: string) => void;
}

export default function WelcomeState({ onSelectQuestion }: Props) {
  return (
    <div className="space-y-3">
      {/* Welcome message */}
      <div className="flex items-start gap-2">
        <BotAvatar />
        <div className="bg-[#f5f2ec] rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[85%]">
          <p className="text-[12.5px] text-[#1a1a1a] leading-relaxed">
            Hi! I can help explain any terms, requirements, or concepts
            you encounter during your assessment.
          </p>
        </div>
      </div>

      {/* Suggested questions */}
      <div className="pl-8 space-y-1.5">
        <p className="text-[10px] text-[var(--color-accent)] uppercase tracking-[1px] font-medium mb-2">
          Try asking
        </p>
        {SUGGESTED_QUESTIONS.map(q => (
          <button
            key={q}
            onClick={() => onSelectQuestion(q)}
            className="block w-full text-left text-[12px] text-[#4aa35a] border border-[#4aa35a]/20 bg-[#4aa35a]/[0.04] hover:bg-[#4aa35a]/[0.08] px-3 py-2 rounded-xl transition-colors duration-150"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}