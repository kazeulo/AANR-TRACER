// components/terms/TermsEmptyState.tsx

import { Search } from "lucide-react";

export function TermsEmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-20 text-[var(--color-text-faintest)] text-[15px] font-light">
      <div className="mb-3 w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto">
        <Search size={20} color="#4aa35a" strokeWidth={1.8} />
      </div>
      No matching terms found for "
      <strong className="text-[var(--color-primary)]">{query}</strong>"
    </div>
  );
}