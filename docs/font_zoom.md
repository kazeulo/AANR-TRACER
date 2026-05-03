# Font size control

Lets users scale the page text between five sizes. The preference is saved and restored on next visit.

---

## File structure

```
src/
├── constants/
│   └── fontSizeConfig.ts       # Scales, labels, and storage keys
├── context/
│   └── FontSizeContext.tsx     # State management and zoom logic
└── components/
    └── FontSizeControl.tsx     # The side-tab UI
```

---

## `fontSizeConfig.ts`

All shared values live here. Both the context and the UI component import from this file — nothing is repeated elsewhere.

| Constant | Value | Notes |
|---|---|---|
| `SCALES` | `[0.9, 1, 1.1, 1.2, 1.3]` | Zoom multipliers |
| `LABELS` | `["Small", "Default", ...]` | Display name for each step |
| `DEFAULT_INDEX` | `1` | The 1.0× "Default" step |
| `SCALE_STORAGE_KEY` | `"aanr-font-scale"` | Saved to `localStorage` |
| `TOOLTIP_SEEN_KEY` | `"aanr-fontsize-tooltip-seen"` | Saved to `sessionStorage` |

---

## `FontSizeContext.tsx`

Wrap your root layout with `FontSizeProvider` once. Any component can then call `useFontSize()` to read or change the scale.

```tsx
// app/layout.tsx
import { FontSizeProvider } from "@/context/FontSizeContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FontSizeProvider>{children}</FontSizeProvider>
      </body>
    </html>
  );
}
```

### What the hook gives you

```ts
const { label, increase, decrease, reset, canIncrease, canDecrease } = useFontSize();
```

| Value | Description |
|---|---|
| `label` | Current size name e.g. `"Large"` |
| `scale` | Current multiplier e.g. `1.1` |
| `scaleIndex` | Current position in the SCALES array |
| `canIncrease` | `false` when already at maximum |
| `canDecrease` | `false` when already at minimum |
| `increase` / `decrease` / `reset` | Change the scale |

---

## `FontSizeControl.tsx`

A fixed tab on the left edge of the screen.

- **Collapsed** — shows a vertical `Aa` button
- **Expanded** — shows A− / A+ buttons, five position dots, and a Reset button when not at default
- **Closes** on outside click or Escape key
- **First visit** — a tooltip auto-appears after a short delay, then dismisses itself

### Accessibility

- All buttons have descriptive `aria-label` attributes
- Disabled buttons use the `disabled` attribute
- A hidden `aria-live` region announces the current size to screen readers

---

## Adding a new size step

1. Add the multiplier to `SCALES` in `fontSizeConfig.ts`
2. Add its label to `LABELS` in the same file
3. Update the dot indicators in `FontSizeControl.tsx` — find `[0, 1, 2, 3, 4].map(...)` and extend the array to match