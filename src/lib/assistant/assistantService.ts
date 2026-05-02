// lib/assistantService.ts
import type { AssistantContext, Message } from "@/types/assistant";

/**
 * Sends a message to the assistant API and returns the reply.
 * @throws Error if the network request fails
 */
export async function fetchAssistantReply(
  message: string,
  context: AssistantContext,
  history: Message[]
): Promise<string> {
  const res = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context, history }),
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  const data = await res.json();
  return data.reply ?? "Sorry, I couldn't generate a response.";
}