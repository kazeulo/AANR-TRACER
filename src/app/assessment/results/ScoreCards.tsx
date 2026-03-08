import { TRL_LABELS } from "./UsePDFExport";

interface ScoreCardsProps {
  completedTRL: number;
  achievableTRL: number;
  completedColor: string;
  achievableColor: string;
}

export default function ScoreCards({
  completedTRL,
  achievableTRL,
  completedColor,
  achievableColor,
}: ScoreCardsProps) {
  const cards = [
    { level: completedTRL,  label: "Highest Completed TRL", color: completedColor },
    { level: achievableTRL, label: "Highest Achievable TRL", color: achievableColor },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map(({ level, label, color }) => (
        <div
          key={label}
          className="bg-white border border-[#ede9e0] rounded-2xl p-6 shadow-[0_4px_24px_rgba(15,46,26,0.06)] flex flex-col items-center text-center gap-2"
        >
          <div className="text-[64px] font-black leading-none" style={{ color }}>
            {level === 0 ? "—" : level}
          </div>
          <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#94a3a0]">
            {label}
          </div>
          {level > 0 && (
            <div className="text-[13px] text-[#6b7a75] font-light">
              {TRL_LABELS[level]}
            </div>
          )}
          <div className="w-full h-1.5 bg-[#e5e1d8] rounded-full mt-1 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${(level / 9) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}