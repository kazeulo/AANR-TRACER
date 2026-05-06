// Filters categories by search query and sorts sections alphabetically.

import { useMemo }     from "react";
import type { Category } from "@/types/terms";

export function useTermsFilter(categories: Category[], search: string): Category[] {
  return useMemo(() => {
    const q = search.toLowerCase().trim();

    return categories
      .map(cat => {
        const sections = cat.sections
          // Filter by search query
          .filter(s =>
            !q ||
            cat.title.toLowerCase().includes(q) ||
            s.title.toLowerCase().includes(q) ||
            s.definition.toLowerCase().includes(q) ||
            s.examples?.some(e => e.toLowerCase().includes(q))
          )
          // Sort sections alphabetically within each category
          .sort((a, b) => a.title.localeCompare(b.title));

        // Keep category if it matches the query or has matching sections
        if (!q || cat.title.toLowerCase().includes(q) || sections.length > 0) {
          return { ...cat, sections };
        }
        return null;
      })
      .filter((cat): cat is Category => cat !== null);
  }, [categories, search]);
}