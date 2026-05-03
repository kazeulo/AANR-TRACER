// components/assistant/BotAvatar.tsx
import { Bot } from "lucide-react";

export default function BotAvatar() {
  return (
    <div className="w-6 h-6 rounded-full bg-[#4aa35a]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Bot size={12} stroke="#4aa35a" strokeWidth={2.5} />
    </div>
  );
}