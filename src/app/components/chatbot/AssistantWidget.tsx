"use client";

import { useAssistant } from "@/hooks/assistant/useAssistant";
import type { AssistantProps } from "@/types/assistant";

import AssistantHeader      from "./AssistantHeader";
import AssistantContextPill from "./AssistantContextPill";
import AssistantMessages    from "./AssistantMessages";
import AssistantInput       from "./AssistantInput";

export default function AssistantWidget({ context }: AssistantProps) {
  const {
    open, setOpen,
    messages,
    input, setInput,
    loading,
    send,
    bottomRef, inputRef, widgetRef,
  } = useAssistant(context ?? {});

  return (
    <div ref={widgetRef} className="fixed bottom-8 right-4 sm:right-6 z-50">

      {/* Panel */}
      <div className={`absolute bottom-16 right-0 w-[calc(100vw-3rem)] max-w-[340px] z-20 bg-white border border-[#ede9e0] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-[0_16px_48px_rgba(15,46,26,0.14)] ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ height: 500 }}
      >
        <AssistantHeader context={context} />
        <AssistantContextPill context={context} />
        <AssistantMessages
          messages={messages}
          loading={loading}
          input={input}
          setInput={setInput}
          inputRef={inputRef}
          bottomRef={bottomRef}
        />
        <AssistantInput
          input={input}
          loading={loading}
          inputRef={inputRef}
          setInput={setInput}
          send={send}
        />
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close assistant" : "Open TRACER Assistant"}
        className={`relative z-10 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(15,46,26,0.25)] transition-all duration-300 ${
          open
            ? "bg-[#0f2e1a] scale-95"
            : "bg-[#4aa35a] hover:bg-[#3d8f4c] hover:-translate-y-0.5"
        }`}
        style={{ width: 52, height: 52 }}
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

    </div>
  );
}