---
name: design-component
description: "Generate a single component using existing design-system.md tokens. Skips inspiration browsing — fast path for isolated UI elements."
---

# /design:component — Single Component (COMPONENT scope)

Generate one UI component using existing design tokens.

**Complete documentation**: `skills/design-web/SKILL.md` (or `skills/design-webapp/SKILL.md` for an app-specific pattern like a data table or command palette).

## Usage

```
/design:component pricing card with 3 tiers
/design:component testimonial carousel
/design:component data table with sorting
```

## Prerequisites
`design-system.md` must exist at project root. If missing, use `/design` instead.

## Workflow

1. Read `design-system.md` — this is the single source of truth for tokens.
2. No inspiration browsing (COMPONENT scope skips it per `design-method`'s routing table). Optionally search `skills/design-web/references/21st-dev.md` or `shadcn.md` for pattern inspiration.
3. Generate the component directly as HTML/CSS from `design-system.md` tokens, following `skills/design-web/references/component-variants-ref.md` for size/state/color variants.
4. Read `skills/design-motion/SKILL.md` — gate micro-interactions; mandatory hover/focus/disabled states regardless.
5. Read `skills/design-review/SKILL.md`, component-scoped: contrast, forbidden fonts, OKLCH-only, all states present, light+dark screenshot of the component in isolation.

## Forbidden
Creating a new `design-system.md`. Inspiration browsing (use the search tools above instead). Skipping light+dark validation.
