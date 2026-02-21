---
name: detection-algorithm
description: 5-step weighted detection algorithm for Radix vs Base UI identification
when-to-use: When understanding scoring logic and edge cases
keywords: algorithm, score, confidence, detection, weight, decision
priority: high
related: radix-patterns.md, baseui-patterns.md
---

# Detection Algorithm

## Overview

The detection algorithm uses a weighted scoring system across 5 signals to determine which primitive library a project uses. Higher confidence means more signals agree.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Weighted scoring** | Each signal contributes a fixed percentage to the final score |
| **Confidence level** | Total score 0-100 indicating certainty of detection |
| **Mixed state** | Both Radix and Base UI signals detected simultaneously |
| **Package manager** | Detected separately via lockfile, not scored |

---

## Flowchart

```
START
  |
  +- Step 1: package.json (40%)
  |  +- @radix-ui/react-* found? -> +40 Radix
  |  +- @base-ui/react found?    -> +40 Base UI
  |
  +- Step 2: components.json (20%)
  |  +- style: "new-york"|"default" -> +20 Radix
  |  +- style: "base-vega"          -> +20 Base UI
  |
  +- Step 3: Import analysis (25%)
  |  +- @radix-ui imports found?     -> +25 Radix
  |  +- @base-ui/react imports?      -> +25 Base UI
  |
  +- Step 4: Data attributes (15%)
  |  +- data-state= found?           -> +15 Radix
  |  +- data-[open] found?           -> +15 Base UI
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

| Radix > 0 | Base UI > 0 | Result |
|------------|-------------|--------|
| Yes | No | `radix` |
| No | Yes | `base-ui` |
| Yes | Yes | `mixed` |
| No | No | `none` |

## Edge Cases

### Migration in Progress
Both Radix and Base UI detected -> `mixed` result.
Action: Check which components use which, plan migration.

### Third-party Libraries
Some libraries wrap Radix primitives internally.
Check: `@radix-ui` in `node_modules` transitive deps.
Mitigation: Prioritize direct `dependencies` over transitive.

### Custom Primitives
Project uses neither Radix nor Base UI -> `none` result.
Action: Recommend fresh shadcn/ui setup with preferred primitive.

### Partial Adoption
Only some components use shadcn/ui.
Check: Count affected files vs total component count.

## Output Format

```json
{
  "primitive": "radix|base-ui|mixed|none",
  "confidence": 0-100,
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
