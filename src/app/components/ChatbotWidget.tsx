"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface AssistantContext {
  technologyType?: string;
  currentCategory?: string;
  currentTRLLevel?: number;
  questionText?: string;
}

interface Props {
  context?: AssistantContext;
}

export default function AssistantWidget({ context }: Props) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

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
      const res = await fetch("../api/assisstant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, context: context ?? {} }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        text: data.reply ?? "Sorry, I couldn't generate a response.",
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Something went wrong. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "What is proximate analysis?",
    "What does pilot-scale mean?",
    "What is an FTO report?",
    "What is a Business Model Canvas?",
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close assistant" : "Open TRACER Assistant"}
        className={`fixed bottom-12 right-10 z-50 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(15,46,26,0.25)] transition-all duration-300 ${
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

      {/* Panel */}
      <div
        className={`fixed bottom-24 right-10 z-50 w-[340px] bg-white border border-[#ede9e0] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-[0_16px_48px_rgba(15,46,26,0.14)] ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ height: 500 }}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#0f2e1a] flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#4aa35a]/20 flex items-center justify-center flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="#4aa35a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white leading-none">TRACER Assistant</p>
            <p className="text-[10px] text-white/40 mt-0.5 truncate">
              {context?.technologyType || "Assessment helper"}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a] animate-pulse" />
            <span className="text-[10px] text-white/40">online</span>
          </div>
        </div>

        {/* Context pill */}
        <div className="px-3 py-2 bg-[#f5f2ec] border-b border-[#ede9e0] flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a] flex-shrink-0" />
            {context?.currentCategory ? (
              <p className="text-[11px] text-[#6b7a75] truncate">
                Currently: <span className="font-medium text-[#0f2e1a]">{context.currentCategory}</span>
              </p>
            ) : (
              <p className="text-[11px] text-[#6b7a75]">General TRACER guidance</p>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">

          {/* Welcome state */}
          {messages.length === 0 && (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#4aa35a]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="#4aa35a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="bg-[#f5f2ec] rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[85%]">
                  <p className="text-[12.5px] text-[#1a1a1a] leading-relaxed">
                    Hi! I can help explain any terms, requirements, or concepts you encounter during your assessment.
                  </p>
                </div>
              </div>

              <div className="pl-8 space-y-1.5">
                <p className="text-[10px] text-[#94a3a0] uppercase tracking-[1px] font-medium mb-2">
                  Try asking
                </p>
                {suggestedQuestions.map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    className="block w-full text-left text-[12px] text-[#4aa35a] border border-[#4aa35a]/20 bg-[#4aa35a]/[0.04] hover:bg-[#4aa35a]/[0.08] px-3 py-2 rounded-xl transition-colors duration-150"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              {m.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-[#4aa35a]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="#4aa35a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              )}
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
          {loading && (
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-[#4aa35a]/10 flex items-center justify-center flex-shrink-0">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="#4aa35a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="bg-[#f5f2ec] px-3 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#94a3a0]"
                      style={{ animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Disclaimer */}
        <div className="px-3 py-1.5 bg-[#f5f2ec] border-t border-[#ede9e0] flex-shrink-0">
          <p className="text-[10px] text-[#94a3a0] text-center leading-relaxed">
            AI-generated guidance only. It's best to consult and verify with your technology transfer specialist.
          </p>
        </div>

        {/* Input */}
        <div className="px-3 py-2.5 border-t border-[#ede9e0] flex gap-2 items-center flex-shrink-0 bg-white">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask about a term or requirement…"
            className="flex-1 text-[13px] bg-[#f5f2ec] rounded-xl px-3 py-2 outline-none placeholder:text-[#c8c3b8] text-[#1a1a1a] focus:bg-[#f0ece3] transition-colors"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              input.trim() && !loading
                ? "bg-[#4aa35a] hover:bg-[#3d8f4c] hover:scale-105"
                : "bg-[#e5e1d8] cursor-not-allowed"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4"
                stroke={input.trim() && !loading ? "white" : "#94a3a0"}
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}