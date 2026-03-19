---
name: designing-systems
description: "Phase 1: Browse 4 sites via Playwright (navigate + scroll bottom + wait 5s + scroll top + wait 2s + fullPage screenshot), write 5 observations per site (color, typo, layout, effects, sections), declare reference site + 3 elements to reproduce."
phase: 1
---

## Phase 1: DESIGNING SYSTEMS — Tokens, breakpoints, and modes

### When
After Phase 0 identity is established. Before any browsing or component generation.

### Input (from Phase 0)
- `design-system.md` with OKLCH palette, typography pair, spacing profile, motion personality.

### Steps
1. **Define primitive tokens** from `references/color-system.md` — raw OKLCH values as CSS variables (`--color-blue-500`).
2. **Map semantic tokens** using `references/color-mapping.md` — map primitives to roles (`--color-primary`, `--color-destructive`).
3. **Set up Tailwind v4 @theme** per `references/tailwind-config.md` — wire CSS variables into `@theme` block.
4. **Configure fluid typography** from `references/fluid-typography.md` — `clamp()` scales for display, heading, body, caption.
5. **Define breakpoints** using `references/breakpoint-patterns.md` — mobile-first with container queries from `references/container-queries.md`.
6. **Build dark mode** — duplicate semantic tokens for `.dark` selector, adjust L/C values per `references/color-system.md`.
7. **Apply theme preset** if relevant from `references/theme-presets.md` (brutalist, solarpunk, glassmorphism, etc.).
8. **Validate** — check hierarchy (`references/ui-hierarchy.md`), spacing (`references/ui-spacing.md`), and Tailwind performance (`references/tailwind-performance.md`).

### Output
- CSS token files: `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`.
- `app.css` with `@import` + `@theme` block.
- Dark mode tokens defined. Breakpoints and fluid typography configured.

### Next → Phase 2: UX COPY
`2-ux-copy/SKILL.md` — Define voice, tone, and microcopy patterns.

### References
| File | Purpose |
|------|---------|
| `references/color-system.md` | OKLCH palette generation and psychology |
| `references/color-mapping.md` | Primitive to semantic token mapping |
| `references/tailwind-config.md` | Tailwind v4 @theme setup |
| `references/fluid-typography.md` | Clamp-based responsive type |
| `references/breakpoint-patterns.md` | Mobile-first breakpoint system |
| `references/container-queries.md` | Container query patterns |
| `references/theme-presets.md` | Predefined theme styles |
| `references/typography.md` | Font scale and mobile sizes |
| `references/ui-hierarchy.md` | Visual hierarchy patterns |
| `references/ui-spacing.md` | Spacing systems |
| `references/tailwind-utilities.md` | Utility class patterns |
| `references/tailwind-performance.md` | Performance optimization |
| `references/gradients-guide.md` | Gradient techniques |
