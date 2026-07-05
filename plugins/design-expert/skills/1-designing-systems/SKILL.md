---
name: designing-systems
description: "Phase 1: Browse 4 catalog sites via fuse-browser, write CSS-precise observations (oklch values, font-size clamp, grid ratios, border-radius, shadows), declare reference site + 3 elements. Feed specs to Gemini context."
phase: 1
---

## Phase 1: RESEARCH — Browse, observe, extract CSS specs

### When
After Phase 0 identity templates are read. Before writing design-system.md.

### Input (from Phase 0)
- Sector identified (creative/fintech/ecommerce/devtool/health)
- Typography pair chosen, OKLCH palette direction known
- The 3 dials `DESIGN_VARIANCE`, `VISUAL_DENSITY`, `MOTION_INTENSITY` (set in Phase 0) — read them, do not re-derive

### Steps
1. **Read inspiration catalog** — `references/design-inspiration.md` + `references/design-inspiration-urls.md`
2. **Pick 4 URLs** from catalog matching the project sector (MUST be from KNOWN_DOMAINS)
3. **Browse each site** via fuse-browser (open one session, reuse for all 4):
   - `browser_open` → sessionId (once)
   - `browser_navigate` → URL
   - `browser_scroll` → `to: "end"` (loads lazy content)
   - Wait 5s → `browser_scroll` `deltaY: -100000` (back to top) → wait 2s
   - `browser_screenshot` fullPage: true
4. **Write 5 CSS-precise observations** per screenshot (NOT vague descriptions):
   - (1) Colors: exact oklch() values for primary, accent, background, text
   - (2) Typography: font-family name, font-size as clamp(min, preferred, max), font-weight
   - (3) Layout: grid/flex structure with column ratios (60/40, 1fr/1fr), gap in px
   - (4) Effects: border-radius in px, box-shadow values, backdrop-blur, opacity
   - (5) Spacing: section padding in px, margin between elements, max-width
5. **Declare reference** — "Site choisi: {URL}. Je reproduis: {el1}, {el2}, {el3}"
   Pick 3 visually distinctive elements with their CSS specs.

### Consistency rules (fed by the Phase 0 dials)
Apply these while writing the CSS-precise observations above — they constrain what the
observations may commit to. *Anti-default composition, single-corner-radius scale, and
one-theme continuity are adapted from Leonxlnx/taste-skill (`imagegen-frontend-web`
Composition Anchor + Continuity Rule); tying their strength to `DESIGN_VARIANCE` is a
Fusengine design decision.*

- **Vary composition, don't center everything.** `left-text / right-image` is the most
  overused AI layout. Across the page use **≥ 3 distinct composition anchors**, and scale
  the aggressiveness with `DESIGN_VARIANCE` (at ≥ 5, actively push asymmetry; below, stay
  measured but still avoid repeating one anchor twice in a row).
- **One corner-radius scale per page.** Declare a single radius language (e.g. one small +
  one large token) and reuse it everywhere — no per-section radius drift.
- **One theme, no mid-scroll flips.** Keep a single light/dark theme through the scroll.
  The only exception is a **deliberate color-block story** (an intentional flat-field
  section switch), never an accidental theme change.

### Output
- 4 fullPage screenshots taken (state: screenshots_count >= 4)
- 20 CSS-precise observations (5 per site)
- 1 reference site declared with 3 elements to reproduce
- Ready to write design-system.md (Phase 2)

### Next → Phase 2: UX COPY
`2-ux-copy/SKILL.md` — Define voice, tone, and microcopy patterns.

### References
| File | Purpose |
|------|---------|
| `references/design-inspiration.md` | Browsing methodology and observation format |
| `references/design-inspiration-urls.md` | Catalog of sector-matched inspiration URLs |
| `references/color-system.md` | OKLCH palette generation |
| `references/typography.md` | Font scale and pairings |
| `references/ui-hierarchy.md` | Visual hierarchy patterns |
| `references/ui-spacing.md` | Spacing systems |

### Detailed References
| File | Load when … |
|------|------|
| `references/container-queries.md` | Component-level responsive rules are needed (e.g. a card or sidebar that resizes based on its container, not the viewport). |
| `references/edge-cases.md` | Defining empty states, loading states, error states, or extreme content lengths (very long/short text, missing images). |
| `references/multi-brand.md` | The project must support multiple brands or white-label themes sharing one design system. |
| `references/image-handling.md` | Defining image aspect ratios, responsive image strategy, or placeholder/fallback treatment. |
| `references/color-mapping.md` | Translating raw OKLCH palette values into semantic color tokens (e.g. `--color-surface`, `--color-danger`). |
| `references/gradients-guide.md` | The identity calls for gradient backgrounds or accents and non-generic, sector-appropriate gradient recipes are needed. |
| `references/tailwind-utilities.md` | Mapping design tokens to Tailwind utility classes. |
| `references/tailwind-config.md` | The design system needs custom Tailwind theme configuration (extending colors, spacing, fonts). |
| `references/fluid-typography.md` | Defining the `clamp()`-based fluid type scale referenced in Step 4 (Typography). |
| `references/tailwind-performance.md` | Optimizing Tailwind output size or purge strategy for the generated design system. |
| `references/theme-presets.md` | Starting from a sector preset instead of building the palette from scratch. |
| `references/ui-trends-2026.md` | Validating that the visual direction feels current rather than dated. |
| `references/complex-themes.md` | The design system must support nested or conditional theming beyond simple light/dark. |
| `references/breakpoint-patterns.md` | Defining the responsive breakpoint strategy for the layout grid. |
