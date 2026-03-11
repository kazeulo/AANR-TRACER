import { TRL_COLORS } from "./UsePDFExport";

interface TRLStepBarProps {
  completed: number;
  achievable: number;
}

export default function TRLStepBar({ completed, achievable }: TRLStepBarProps) {
  return (
    <div>
      <div className="flex gap-1.5 items-end">
        {Array.from({ length: 9 }, (_, i) => {
          const level = i + 1;
          const isCompleted = level <= completed;
          const isAchievable = !isCompleted && level <= achievable;
          const bg = isCompleted
            ? (TRL_COLORS[completed] ?? "#4aa35a")
            : isAchievable
            ? "#bbf7d0"
            : "#e5e1d8";
          const height = 10 + level * 5;
          return (
            <div key={level} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className="w-full rounded-sm transition-all duration-700"
                style={{
                  height,
                  backgroundColor: bg,
                  border: isAchievable ? "1.5px solid #4aa35a55" : "none",
                }}
              />
              <span className="text-[9px] font-bold text-[var(--color-text-faintest)]">{level}</span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-5 mt-4">
        {[
          { color: TRL_COLORS[completed] ?? "#4aa35a", label: "Completed", style: {} },
          { color: "#bbf7d0", label: "Achievable", style: { border: "1px solid #4aa35a55" } },
          { color: "#e5e1d8", label: "Not reached", style: {} },
        ].map(({ color, label, style }) => (
          <span key={label} className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-faintest)]">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: color, ...style }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}