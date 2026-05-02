// components/assistant/AssistantContextPill.tsx
import type { AssistantContext } from "@/types/assistant";

interface Props {
  context?: AssistantContext;
}

export default function AssistantContextPill({ context }: Props) {
  return (
    <div className="px-3 py-2 bg-[#f5f2ec] border-b border-[#ede9e0] flex-shrink-0">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a] flex-shrink-0" />
        {context?.currentCategory ? (
          <p className="text-[11px] text-[#6b7a75] truncate">
            Currently:{" "}
            <span className="font-medium text-[#0f2e1a]">
              {context.currentCategory}
            </span>
          </p>
        ) : (
          <p className="text-[11px] text-[#6b7a75]">General TRACER guidance</p>
        )}
      </div>
    </div>
  );
}