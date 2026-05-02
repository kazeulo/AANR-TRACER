// components/assistant/AssistantInput.tsx

interface Props {
  input: string;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  setInput: (val: string) => void;
  send: () => void;
}

export default function AssistantInput({ input, loading, inputRef, setInput, send }: Props) {
  return (
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
  );
}