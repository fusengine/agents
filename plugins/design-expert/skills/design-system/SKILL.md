---
name: design-system
description: "Token-strategy core — OKLCH color rules, neutral tinting, accent-commitment levels, type scale, 8pt spacing grid, touch targets, and the canonical output format of design-system.md (the file the harness gates on). This is routing step 1 of design-method/SKILL.md — read it before design-web/design-webapp/design-ios/design-android, before picking or auditing a single color/type/spacing value."
when-to-use: "First read of every design task, unconditionally (design-method routing step 1) — before choosing or auditing any token, and before writing design-system.md."
keywords: tokens, oklch, color, typography, spacing, design-system.md, contrast, fonts, density
priority: critical
related: design-method, design-web, design-webapp, contrast-ratios.md, sector-palettes.md, typography-pairs.md, forbidden-fonts.md, design-read-dials.md
---

<!-- Grounding: grounding-corpus.md §B (thresholds), §H (kept anchors); harness-contract.md invariant #2 (design-system.md format) + #3 (this file's read-path triggers harness phase 1). -->

# Design System — Token Core

Single source for token **strategy** — not values, values live in `references/*.md` and are
read from there, never re-derived here. `design-method/SKILL.md` reads this file
**unconditionally as routing step 1**, once per task, before dispatching to any move or
target skill — that read is also what advances the harness past phase 0. If a design
question is purely about a token (a color, a type pair, a spacing value) this file plus its
reference index already answers it; otherwise continue back into `design-method`'s routing.

## Color strategy

- **OKLCH only** for new tokens: `oklch(L% C H)`. Never hex/HSL/RGB for anything you're
  defining fresh (existing legacy tokens in an inherited codebase are a different problem —
  don't rewrite what wasn't asked for).
- **Neutrals** — tint every neutral toward the brand hue, chroma **0.005–0.015**. Never a
  pure gray (chroma 0), never `#000`/`#fff`.
- **Accent commitment** — pick the strategy BEFORE picking hues:
  - **Restrained** — tinted neutrals + one accent ≤10% of surface. Product register default.
  - **Committed** — one saturated color carries 30–60% of surface. Brand register default.
  - **Full palette** (3–4 named roles) / **Drenched** (surface IS the color) — brand
    campaigns, product data-viz. See `design-method/references/register/brand.md` §4 and
    `register/product.md` §1 for which strategy each register defaults to and when to
    deviate.
- Reduce chroma as lightness approaches 0 or 100 — high chroma at the extremes reads garish.
- Mechanics: `references/oklch-system.md`. Concrete per-sector values:
  `references/sector-palettes.md`. Contrast floors: `references/contrast-ratios.md` — WCAG
  AA 4.5:1 body text / 3:1 large text + UI components (AAA 7:1 where feasible).

## Typography scale

- Ratio **≥1.25** between steps (1.25 major-third is the default, 1.333 for editorial), 6–8
  sizes max, **≤3 contrast variations per view**.
- Line-height: body 1.5×, display 1.05–1.15×. Body measure 65–75ch.
- Validated pairs: `references/typography-pairs.md`. Forbidden/flagged fonts — canonical
  list, don't restate it anywhere else in this plugin: `references/forbidden-fonts.md`.

## Spacing

- **8pt grid**: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- Density profile (Enterprise Dense / Standard / Editorial) chosen per register:
  `references/spacing-density.md` — product defaults dense, brand defaults editorial (see
  `register/brand.md` §4 and `register/product.md` §1).

## Touch targets

iOS 44×44pt · Android 48×48dp · WCAG 2.5.8 minimum 24×24 CSS px regardless of platform.

## The `design-system.md` output — canonical format

This is the generated file the harness gates on (`gates-pipeline.ts` triggers on any read
path ending `design-system.md`; `gates.ts` validates its contents). Every requirement below
is a **present/absent check**, not a suggestion — missing one fails the gate silently
downstream, with no error surfaced at write time.

```markdown
## Design Reference
Inspiration: https://example.com/the-actual-site-browsed-in-generate-step-2

### Colors
--color-accent: oklch(0.62 0.19 250);
--color-neutral-900: oklch(0.18 0.01 250);
... (full token set — chroma > 0 required on at least the accent token)

### Typography
--font-display: "Fraunces", ui-serif;
--font-body: "Public Sans", ui-sans-serif;
... (never the four hard-forbidden families below, whichever fonts are actually chosen)
```

**The 4 hard requirements (all must hold):**

1. Heading `## Design Reference` present verbatim.
2. At least one `https?://` URL — the real inspiration source browsed in
   `design-web/references/design-inspiration.md` step 2, not a placeholder.
3. At least one `oklch(...)` token with **chroma > 0** — a chroma-0 neutral alone does not
   satisfy this; the accent (or any committed-strategy token) must carry chroma.
4. Must **not** contain `Inter`, `Roboto`, `Arial`, or `Open Sans` anywhere in the file —
   this is the harness-checked subset of the full 6-font hard-forbidden tier in
   `references/forbidden-fonts.md` (which also bans `Lato`/`Poppins`, not harness-checked
   but still enforced by this skill).

Check this list explicitly before writing `design-system.md` — don't rely on having "used
OKLCH generally" earlier in the task; the gate reads the file, not the process.

## Reference index (data lives here, read from source, never restated above)

| Concern | File |
|---|---|
| OKLCH mechanics | `references/oklch-system.md` |
| Contrast ratios (WCAG) | `references/contrast-ratios.md` |
| Sector palettes (concrete OKLCH) | `references/sector-palettes.md` |
| Typography pairs | `references/typography-pairs.md` |
| Forbidden/flagged fonts (canonical) | `references/forbidden-fonts.md` |
| Spacing / density profiles | `references/spacing-density.md` |
| Identity brief questionnaire | `references/identity-brief.md` |
| Design Read + the 3 dials (VARIANCE/DENSITY/MOTION) | `references/design-read-dials.md` |
| Color-token mapping | `references/color-mapping.md` |
| Gradients | `references/gradients-guide.md` |
| Fluid typography | `references/fluid-typography.md` |
| Breakpoints | `references/breakpoint-patterns.md` |
| Container queries | `references/container-queries.md` |
| Multi-brand theming | `references/multi-brand.md` |
| Complex themes (dark mode etc.) | `references/complex-themes.md` |
| Motion personality | `references/motion-personality.md` |
| UI hierarchy / spacing rhythm | `references/ui-hierarchy.md`, `references/ui-spacing.md` |
| UI trends 2026 | `references/ui-trends-2026.md` |
| Visual technique matrix | `references/visual-technique-matrix.md` |
| Edge cases (empty/error/loading) | `references/edge-cases.md` |
| Image handling | `references/image-handling.md` |
| Tailwind config / utilities / perf | `references/tailwind-config.md`, `tailwind-utilities.md`, `tailwind-performance.md` |
| Per-sector `design-system.md` templates | `references/templates/*.md` |

## Next

This read is `design-method/SKILL.md` routing step 1, not a standalone task — return there
for Register resolution, Gate 0, and move dispatch. A pure token question is already
answered by the sections above; everything else (page structure, moves, register floors)
lives in `design-method` and the target-platform skills.
