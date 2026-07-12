---
name: design
description: "Full design pipeline for a web or web-app target: brief → tokens → generation → motion → review. Use /design:mobile for iOS/Android instead."
---

# /design — Full Pipeline (FULL scope)

Generate a complete design from scratch — no `design-system.md` exists yet, or a full redesign was requested.

**Complete documentation**: `skills/design-method/SKILL.md`

## Usage

```
/design hero section for fintech startup
/design landing page for physiotherapy clinic
/design dashboard for a project management SaaS
```

## Workflow

1. Read `skills/design-method/SKILL.md` — answer the 4-question brief, name the signature element, run the two-pass process.
2. Read `skills/design-system/SKILL.md` — build `design-system.md` (OKLCH tokens, typography, spacing, motion profile) and run the Mechanical Contrast Check.
3. Route per `design-method`'s table: `skills/design-web/SKILL.md` (marketing/landing) or `skills/design-webapp/SKILL.md` (dashboard/app). Browse 4 inspiration sites if web/marketing.
4. Read `skills/design-motion/SKILL.md` — gate every animation candidate; mandatory states (hover/focus/disabled) regardless of gate outcome.
5. Read `skills/design-review/SKILL.md` — deterministic checks, then the bounded screenshot loop (light+dark, max 2 fix cycles), report.

## Copy
If the brief needs dedicated UX copy work, read `skills/ux-copy/SKILL.md` at any point in the pipeline above — it isn't tied to a fixed step.

## Forbidden
Skipping the `design-method` brief. Restating fonts/contrast/screenshot procedure instead of pointing to their canonical skill. Reporting a review as passed when `design-review` wasn't actually run.
