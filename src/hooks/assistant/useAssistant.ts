// hooks/useAssistant.ts

import { useState, useRef, useEffect } from "react";
import { fetchAssistantReply } from "@/lib/assistant/assistantService";
import type { Message, AssistantContext } from "@/types/assistant";

/**
 * Manages all chat state and side effects for the AssistantWidget.
 */
export function useAssistant(context: AssistantContext) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef  = useRef<HTMLInputElement | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const reply = await fetchAssistantReply(text, context, messages);
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error("[useAssistant] send failed:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Something went wrong. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return {
    open, setOpen,
    messages,
    input, setInput,
    loading,
    send,
    bottomRef, inputRef, widgetRef,      // refs passed down to components that need them
  };
}