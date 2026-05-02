// components/assistant/TypingIndicator.tsx
import BotAvatar from "./BotAvatar";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <BotAvatar />
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
  );
}