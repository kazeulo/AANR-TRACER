// components/assistant/AssistantMessages.tsx
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Message } from "@/types/assistant";

import BotAvatar       from "./BotAvatar";
import TypingIndicator from "./TypingIndicator";
import WelcomeState    from "./WelcomeState";

interface Props {
  messages: Message[];
  loading: boolean;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

export default function AssistantMessages({
  messages,
  loading,
  inputRef,
  bottomRef,
  setInput,
}: Props) {

  const handleSelectQuestion = (q: string) => {
    setInput(q);
    inputRef.current?.focus();
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">

      {/* Empty state */}
      {messages.length === 0 && (
        <WelcomeState onSelectQuestion={handleSelectQuestion} />
      )}

      {/* Message list */}
      {messages.map((m, i) => (
        <div
          key={i}
          className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
        >
          {m.role === "assistant" && <BotAvatar />}

          <div className={`max-w-[82%] px-3 py-2.5 rounded-2xl text-[12.5px] leading-relaxed ${
            m.role === "user"
              ? "bg-[#4aa35a] text-white rounded-tr-sm"
              : "bg-[#f5f2ec] text-[#1a1a1a] rounded-tl-sm"
          }`}>
            {m.text}
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {loading && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}