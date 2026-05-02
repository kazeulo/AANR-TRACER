// components/homepage/StatsStrip.tsx
import { STATS } from "@/constants/homepage";

export default function StatsStrip() {
  return (
    <div className="bg-[var(--color-primary-mid)] px-6 lg:px-[6vw] py-8">
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-around gap-4">
        {STATS.map(({ n, label, Icon }) => (
          <div key={label} className="text-center px-6 border-r border-white/[0.08] last:border-r-0 flex flex-col items-center gap-1">
            <Icon className="w-5 h-5 text-white mb-3" />
            <div className="text-[32px] text-white leading-none">{n}</div>
            <div className="text-[11px] text-white uppercase tracking-[1.5px] font-medium mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}