// types/assistant.ts

export interface Message {
  role: "user" | "assistant";
  text: string;
}

export interface AssistantContext {
  technologyType?: string;
  currentCategory?: string;
  currentTRLLevel?: number;
  questionText?: string;
}

export interface AssistantProps {
  context?: AssistantContext;
}