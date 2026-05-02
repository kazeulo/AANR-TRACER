// components/assistant/AssistantHeader.tsx
import type { AssistantContext } from "@/types/assistant";

interface Props {
  context?: AssistantContext;
}

export default function AssistantHeader({ context }: Props) {
  return (
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
  );
}