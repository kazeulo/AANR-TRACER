# Terms & Definitions Page

The Terms & Definitions page gives users a searchable, browsable reference for all technology types, assessment categories, and key concepts used throughout AANR-TRACER. It's designed to be self-contained — users can look up any term without leaving the app or opening a separate document.

---

## What the page does

Users land on this page when they want to understand a specific term or browse what technology types are covered. They can either scroll through categories freely or search for a specific word to narrow things down instantly. Every section is sorted alphabetically so terms are always easy to find.

---

## Page structure

The page is made up of four visible areas:

**Hero section** — a dark banner at the top with the page title and a short description of what the page covers.

**Search bar** — a full-width input that filters all categories and sections in real time. Matching is done across category titles, section titles, definitions, and examples — so users can search by concept, not just exact term names. A Clear button appears once the user starts typing.

**Sidebar** — a sticky left panel showing all available categories. Clicking a category smoothly scrolls the page to that section and highlights it as active. The sidebar is hidden on mobile.

**Content area** — the main reading area, showing category blocks one after another. Each category has a heading with an icon, followed by individual term cards. Inside each card is a definition and, where available, a list of real-world examples.

---

## How search works

Search is handled by the `useTermsFilter` hook. As the user types, it checks every category and every section against the query. A section is kept in results if its title, definition, or any of its examples contain the search text. A category is kept if its own title matches or if it has at least one matching section.

Results are always sorted alphabetically within each category regardless of whether a search is active. This means browsing and searching both present terms in the same consistent order.

If no results match, an empty state message appears with the search query highlighted so the user knows exactly what was searched.

---

## Alphabetical ordering

Sections within each category are sorted A→Z automatically. This sorting happens inside `useTermsFilter` using `localeCompare`, which handles special characters and accented letters correctly. Category order itself is preserved as defined in `terms.json` since that ordering is intentional.

---

## File breakdown

The page is split into focused files so each piece can be changed independently.

```
app/terms/
└── page.tsx                  ← owns search state, active category, and scroll logic

components/terms/
├── TermIcon.tsx              ← renders the icon for a category
├── TermsHeader.tsx           ← hero banner and wave divider
├── TermsSearch.tsx           ← search input and clear button
├── TermsSidebar.tsx          ← category navigation sidebar
├── CategoryBlock.tsx         ← one category heading and its term cards
├── SectionCard.tsx           ← a single term with definition and examples
└── TermsEmptyState.tsx       ← message shown when search returns nothing

hooks/terms/
└── useTermsFilter.ts         ← filters categories by query, sorts sections alphabetically
```

### What each file is responsible for

**`page.tsx`** is the orchestrator. It holds the search text, the currently active sidebar category, and the scroll refs that let clicking a sidebar item jump to the right section. It contains no visual markup of its own beyond wiring the components together.

**`useTermsFilter`** is the only place filtering and sorting logic lives. It receives the full category list and the current search query, and returns a filtered, sorted copy. It uses `useMemo` so it only recalculates when the search query actually changes.

**`TermsHeader`** and **`TermsSearch`** are purely presentational — they accept props for values and callbacks but hold no state themselves.

**`TermsSidebar`** receives the category list, the currently active category, and an `onSelect` callback. It renders the nav buttons and delegates scroll behavior to the parent.

**`CategoryBlock`** uses `forwardRef` so the parent page can attach a scroll ref to it without the component needing to know why.

**`SectionCard`** is the smallest unit — it receives a single section object and renders the definition and examples. No logic, no state.

---

## Adding new terms

All content comes from `src/data/terms.json`. To add a new term, open that file and find the relevant category. Add a new object to its `sections` array:

```json
{
  "title": "Your Term",
  "definition": "A clear explanation of what this term means.",
  "examples": [
    "An optional real-world example here.",
    "Another example if needed."
  ]
}
```

The term will appear automatically, sorted alphabetically within its category. No code changes needed.

To add a new **category**, add a new object to the top-level `categories` array and make sure its `icon` value matches a key in `src/constants/terms.ts`. Available icon names are: `leaf`, `fish`, `cog`, `wrench`, `chip`, `seedling`, `animal`, `tree`, `book`, `bargraph`.

