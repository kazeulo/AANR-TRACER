// components/terms/TermIcon.tsx

import { iconMap } from "@/constants/terms";

interface TermIconProps {
  name:   string;
  size?:  number;
  color?: string;
}

export function TermIcon({ name, size = 18, color = "#4aa35a" }: TermIconProps) {
  const Icon = iconMap[name as keyof typeof iconMap];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={1.8} />;
}