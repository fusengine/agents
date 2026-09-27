---
name: detection-algorithm
description: 5-step weighted detection algorithm for Base UI vs Radix vs React Aria identification
when-to-use: When understanding scoring logic and edge cases
keywords: algorithm, score, confidence, detection, weight, decision
priority: high
related: radix-patterns.md, baseui-patterns.md
---

# Detection Algorithm

## Overview

The detection algorithm uses a weighted scoring system across 5 signals, scored separately for each base (Base UI, Radix, React Aria), to determine which primitive library a project uses. Higher confidence means more signals agree.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Weighted scoring** | Each signal contributes a fixed percentage to the final score |
| **Confidence level** | Total score 0-100 indicating certainty of detection |
| **Mixed state** | Signals from two or more bases (Base UI, Radix, React Aria) detected simultaneously |
| **Package manager** | Detected separately via lockfile, not scored |

---

## Flowchart

```
START
  |
  +- Step 0: components.json present?
  |  +- `{runner} shadcn@latest info --json` -> .config.base = base|radix|aria
  |     (authoritative; the scan below confirms it and detects mixed state)
  |
  +- Step 1: package.json (40%)
  |  +- radix-ui or @radix-ui/react-* found? -> +40 Radix
  |  +- @base-ui/react found?                -> +40 Base UI (ignore if only a radix-* Combobox needs it)
  |  +- react-aria-components found?         -> +40 React Aria
  |
  +- Step 2: components.json (20%)
  |  +- style: "radix-*"|"new-york"|"default" -> +20 Radix
  |  +- style: "base-*" (e.g. "base-nova")    -> +20 Base UI
  |  +- style: "aria-*" (e.g. "aria-nova")    -> +20 React Aria
  |
  +- Step 3: Import analysis (25%)
  |  +- "radix-ui" or @radix-ui imports?  -> +25 Radix
  |  +- @base-ui/react imports?           -> +25 Base UI
  |  +- react-aria-components imports?    -> +25 React Aria
  |
  +- Step 4: Data attributes (15%)
  |  +- data-[state=...] found?                      -> +15 Radix
  |  +- data-[open] / data-starting-style found?     -> +15 Base UI
  |  +- data-entering / data-exiting / data-[placement=...] -> +15 React Aria
  |  (the `data-open:` Tailwind variant from shadcn/tailwind.css matches
  |   both Radix and Base UI: do not score it)
  |
  +- Step 5: Package manager
  |  +- bun.lockb/bun.lock → bun (bunx)
  |  +- pnpm-lock.yaml     → pnpm (pnpm dlx)
  |  +- yarn.lock          → yarn (yarn dlx)
  |  +- package-lock.json  → npm (npx)
  |
  +- RESULT: Compare scores + PM
```

## Confidence Levels

| Score | Level | Meaning |
|-------|-------|---------|
| 80-100 | Definitive | Clear single primitive |
| 50-79 | Probable | Likely correct, minor ambiguity |
| 25-49 | Uncertain | Needs manual verification |
| 0-24 | Unknown | No signals or too weak |

## Decision Matrix

| Radix > 0 | Base UI > 0 | React Aria > 0 | Result |
|-----------|-------------|----------------|--------|
| Yes | No | No | `radix` |
| No | Yes | No | `base-ui` |
| No | No | Yes | `react-aria` |
| two or more Yes | | | `mixed` |
| No | No | No | `none` |

## Edge Cases

### Radix Combobox pulls Base UI
The `radix-*` Combobox is built on `@base-ui/react` (Radix has no Combobox primitive; registry `radix-nova/combobox.json` depends on `@base-ui/react`). A Radix project with only `components/ui/combobox.tsx` importing Base UI is `radix`, not `mixed`.

### Base-agnostic packages
`@shadcn/react` (headless Questionnaire, MessageScroller) and the `cn` package are used by all three bases: never score them.

### Base-only components
Toast (`@base-ui/react/toast`) exists only for Base UI; Radix and React Aria projects use Sonner.

### Migration in Progress
Two or more bases detected (typically Radix + Base UI during a progressive migration, where both coexist by design) -> `mixed` result.
Action: Check which components use which, plan migration.

### Third-party Libraries
Some libraries wrap Radix primitives internally.
Check: `@radix-ui` in `node_modules` transitive deps.
Mitigation: Prioritize direct `dependencies` over transitive.

### Custom Primitives
Project uses none of the three bases -> `none` result.
Action: Recommend fresh shadcn/ui setup; `init` defaults to Base UI since July 2026 (`-b radix` / `-b aria` to choose another base).

### Partial Adoption
Only some components use shadcn/ui.
Check: Count affected files vs total component count.

## Output Format

```json
{
  "primitive": "radix|base-ui|react-aria|mixed|none",
  "confidence": 85,
  "pm": "bun|npm|pnpm|yarn",
  "runner": "bunx|npx|pnpm dlx|yarn dlx",
  "signals": ["pkg:radix-ui", "style:new-york", "import:radix", "attr:data-state", "pm:bun"]
}
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Trusting low confidence (<50) | Require manual verification |
| Ignoring mixed results | Always flag for migration planning |
| Skipping PM detection | Runner must match project lockfile |

---

## Related References

- [radix-patterns.md](radix-patterns.md) - Radix signal details
- [baseui-patterns.md](baseui-patterns.md) - Base UI signal details

## Related Templates

- [detection-script.md](templates/detection-script.md) - Complete detection example
