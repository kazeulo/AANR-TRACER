import { useState } from "react";
import { QuestionItem } from "../../utils/trlCalculator";
import { fetchRecommendation, parseRecommendationOutput, RecommendationInput } from "./FetchRecommendation";
type Status = "idle" | "loading" | "done" | "error";

interface ParsedOutput {
  items: string[];
  closing: string;
}

export default function AIRecommendationCard(props: RecommendationInput) {
  const [status, setStatus]   = useState<Status>("idle");
  const [output, setOutput]   = useState<ParsedOutput>({ items: [], closing: "" });
  const [errorMsg, setErrorMsg] = useState<string>("");

  const generate = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const text = await fetchRecommendation(props);
      setOutput(parseRecommendationOutput(text));
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  };

  return (
    <div className="bg-white border border-[#ede9e0] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.06)]">

      {/* Header */}
      <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[#f8f6f1]">
        <span className="w-2 h-2 rounded-full bg-[#4aa35a] flex-shrink-0" />
        <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">
          Your Next Steps
        </span>
        <span className="ml-auto text-[10px] font-medium text-[#94a3a0] bg-[#f0ece3] px-2 py-0.5 rounded-full">
          AI-powered · Llama 3.1
        </span>
      </div>

      <div className="px-7 py-6">
        {status === "idle"    && <IdleState onGenerate={generate} lackingCount={props.lackingItems.length} />}
        {status === "loading" && <LoadingState />}
        {status === "error"   && <ErrorState message={errorMsg} onRetry={generate} />}
        {status === "done"    && (
          <DoneState
            output={output}
            completedTRL={props.completedTRL}
            achievableTRL={props.achievableTRL}
            onRegenerate={generate}
          />
        )}
      </div>
    </div>
  );
}

// States 

function IdleState({
  onGenerate,
  lackingCount,
}: {
  onGenerate: () => void;
  lackingCount: number;
}) {
  return (
    <div className="flex flex-col items-center text-center py-6 gap-5">
      <div className="w-14 h-14 rounded-2xl bg-[#4aa35a]/[0.07] flex items-center justify-center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4aa35a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <div>
        <p className="text-[15px] font-semibold text-[#0f2e1a] mb-2">
          Not sure what to do next?
        </p>
        <p className="text-[13px] text-[#8a9a94] font-light max-w-sm leading-relaxed">
          We'll turn your{" "}
          <span className="font-semibold text-[#4a5568]">
            {lackingCount} gap{lackingCount !== 1 ? "s" : ""}
          </span>{" "}
          into clear, plain-language action steps so you know exactly where to focus.
        </p>
      </div>
      <button
        onClick={onGenerate}
        className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-[14px] font-semibold text-white bg-[#4aa35a] shadow-[0_6px_24px_rgba(74,163,90,0.3)] hover:bg-[#3d8f4c] hover:-translate-y-0.5 transition-all duration-300"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        Show Me My Next Steps
      </button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center py-10 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[#4aa35a]/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#4aa35a] animate-spin" />
        <div
          className="absolute inset-[6px] rounded-full border-2 border-transparent border-t-[#4aa35a]/40 animate-spin"
          style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
        />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-medium text-[#0f2e1a]">Working on your action steps…</p>
        <p className="text-[12px] text-[#94a3a0] font-light mt-1">Turning your gaps into a clear path forward</p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center py-6 gap-4 text-center">
      <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <div>
        <p className="text-[14px] font-semibold text-[#0f2e1a] mb-1">Could not generate recommendations</p>
        <p className="text-[12px] text-[#94a3a0] font-light">{message || "Please check your connection and try again."}</p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-medium text-[#4aa35a] border border-[#4aa35a]/30 hover:bg-[#4aa35a]/[0.06] transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
        Try again
      </button>
    </div>
  );
}

// Coverts markdown into <strong> spans for display */
function renderMarkdown(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-[#0f2e1a]">{part}</strong>
      : part
  );
}

function DoneState({
  output,
  completedTRL,
  achievableTRL,
  onRegenerate,
}: {
  output: ParsedOutput;
  completedTRL: number;
  achievableTRL: number;
  onRegenerate: () => void;
}) {
  return (
    <div>

      {/* Sub-header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#6b7a75] font-light">
            To go from
          </span>
          <span className="text-[12px] font-bold text-[#0f2e1a] bg-[#f0ece3] px-2.5 py-1 rounded-full">
            TRL {completedTRL}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span className="text-[12px] font-bold text-white bg-[#4aa35a] px-2.5 py-1 rounded-full">
            TRL {achievableTRL}
          </span>
        </div>
        <button
          onClick={onRegenerate}
          className="inline-flex items-center gap-1.5 text-[11px] text-[#94a3a0] hover:text-[#4aa35a] transition-colors font-medium"
          title="Regenerate"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          Regenerate
        </button>
      </div>

      {/* Action steps */}
      <ol className="space-y-3 mb-6">
        {output.items.map((item, i) => (
          <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[#f8f6f1] border border-[#ede9e0]">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#4aa35a] text-white text-[12px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            {/* <p className="text-[14px] text-[#4a5568] leading-relaxed flex-1">{item}</p> */}
            <p className="text-[14px] text-[#4a5568] leading-relaxed flex-1">{renderMarkdown(item)}</p>
          </li>
        ))}
      </ol>

      {/* Closing motivational message */}
      {output.closing && (
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-[#4aa35a]/[0.06] border border-[#4aa35a]/15">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4aa35a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M8 12l3 3 5-5" />
          </svg>
          <p className="text-[13px] text-[#3d6b4a] font-medium leading-relaxed">{renderMarkdown(output.closing)}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-5 pt-4 border-t border-[#f0ece3] flex items-center gap-2">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
        </svg>
        <p className="text-[11px] text-[#94a3a0] font-light">
          AI-generated guidance. Validate with a technology transfer specialist before major decisions.
        </p>
      </div>

    </div>
  );
}