---
name: design-system
description: "Design tokens: OKLCH palette, typography pair, spacing, motion profile, and the mechanical contrast-check step. Canonical source for the forbidden-fonts list and contrast thresholds — referenced, never restated, elsewhere in this plugin."
when-to-use: "No design-system.md exists yet at the project root, or an existing one needs auditing/extending."
keywords: tokens, oklch, typography, contrast, spacing, motion-profile, design-system
priority: critical
related: design-method, design-web, design-webapp, design-review
---

## Design System — Tokens and the Mechanical Contrast Check

### When
Start of a new project (no `design-system.md` at project root), or extending/auditing an
existing one. Assumes `design-method`'s Step 1 brief and Step 2 signature element are
already defined.

### Steps

1. **Design Read + dials** — `references/design-read-dials.md`. Infer the brief (page
   kind, vibe words, audience, quiet constraints) and fix the 3 dials `DESIGN_VARIANCE`,
   `VISUAL_DENSITY`, `MOTION_INTENSITY` (1-10). These are contractual inputs for every
   later step — set once, read everywhere else.
2. **Match sector** in `references/sector-palettes.md` — pick the OKLCH palette base.
3. **Generate palette** using `references/oklch-system.md` — primary, secondary, accent,
   neutral + semantic colors. All colors `oklch()`. Color must be **committed**: either
   chromatic (chroma ≥ 0.05) or a deliberately near-mono system with one decisive accent —
   the slop is a timid, uncommitted gray, not low chroma itself (Linear/Vercel/Stripe ship
   premium near-mono palettes). Derive the dark-mode set with `references/color-mapping.md`, checking
   `references/edge-cases.md` and `references/image-handling.md` for what breaks on flip.
4. **Choose typography pair** from `references/typography-pairs.md` — display + body
   fonts matching the tone from `design-method`. See Forbidden Fonts below.
5. **Set spacing density** from `references/spacing-density.md` — dense / standard / editorial.
6. **Define motion personality** from `references/motion-personality.md` — corporate /
   modern / playful / luxury. Consumed later by `design-motion`.
7. **Check visual techniques** in `references/visual-technique-matrix.md` — what's allowed
   for this personality × density combination.
8. **Run the Mechanical Contrast Check and Mechanical Type-Scale Check** (below).
9. **Generate `design-system.md`** at project root from `references/templates/` (fintech,
   ecommerce, devtool, creative, or blank).

### Forbidden Fonts (canonical list — defined here only)

**Hard-forbidden**: `Inter`, `Roboto`, `Arial`, `Open Sans`, `Lato`, `Poppins`. Any other
file in this plugin that mentions forbidden fonts must point here instead of restating
its own list.

**Flag-when-undeclared**: `Fraunces`, `Instrument Serif`, `Playfair Display`, `Geist`,
`Space Grotesk`. These fonts are legitimate *when declared as the deliberate signature
element* (see `design-method` Step 2) — they are not banned outright. The tell isn't the
font itself, it's the *reflexive, undeclared* combo: serif-display + italic accent + cream
background for the first three; the "safe modern-technical" grotesk reached for on
autopilot, with no stated rationale, for Geist/Space Grotesk. If one of these fonts shows
up without an explicit signature-element rationale in `design-system.md`, flag it for
review rather than auto-passing it.

### Font Self-Hosting (canonical — defined here only)

A named display/premium font MUST be self-hosted: `@font-face` with a `woff2` source,
`font-display: swap`, and a `<link rel="preload">` for the file. If that pipeline isn't
wired up, don't name the font — fall back to a system stack instead. Naming a font in
`design-system.md` without ever loading it is aspirational typography that never ships;
the presence of `@font-face` is the check that the intent is real.

### Mechanical Contrast Check (canonical — defined here only)

Not a vibe check — a calculation from the OKLCH lightness (`L`) of each token pair,
per `references/contrast-ratios.md`:

| L difference | Approx. ratio | Passes |
|---|---|---|
| ≥ 50% | > 7:1 | AAA normal text |
| ≥ 40% | > 4.5:1 | AA normal text (the floor for body copy) |
| ≥ 30% | > 3:1 | AA large text / UI components (the floor for borders, icons, focus rings) |
| < 25% | < 3:1 | Fails everything — do not ship |

Run this against every text-on-background and UI-element-on-background pair in both
light and dark mode before calling the system done. Thresholds: **4.5:1 text, 3:1 UI** —
this is the only place that number is defined; every other file in this plugin that cites
a contrast ratio points back here.

### Mechanical Type-Scale Check (canonical — defined here only)

- **Type-Scale Floor**: ≥ 1.2× between adjacent **title** steps only (display→h1→h2→h3) — mechanical check `step[n].fontSize / step[n-1].fontSize ≥ 1.2`; 1.25× is the preferred target, FAIL is <1.2. Body→caption tier is **exempt** (tighter ratios are legitimate there, see `references/fluid-typography.md`).
- **Body-Size Floor**: the main paragraph token (`--text-base`/body) ≥ 16px in every breakpoint. Caption/small/label tokens (e.g. `--text-small` 14px) are **exempt**.

Run both alongside the Mechanical Contrast Check above before calling the system done.

### Output
- `design-system.md` at project root: OKLCH palette (light + dark), typography pair,
  spacing profile, motion personality, visual techniques allowed, the 3 dials recorded
  at the top.
- Every token pair passes the Mechanical Contrast Check above.

### Next
Route back to `design-method`'s table: `design-web`, `design-webapp`, `design-ios`, or
`design-android`.

### References
| File | Purpose |
|------|---------|
| `references/design-read-dials.md` | Design Read (brief inference) + the 3 direction dials with presets |
| `references/identity-brief.md` | 5-question brand questionnaire (extends `design-method` Step 1) |
| `references/sector-palettes.md` | Sector-specific OKLCH palettes |
| `references/oklch-system.md` | OKLCH color generation rules |
| `references/contrast-ratios.md` | **Canonical WCAG contrast reference — full method + checklist** |
| `references/color-mapping.md` | Light → dark OKLCH transformation rules |
| `references/typography-pairs.md` | **Canonical forbidden-fonts list** + approved pairings |
| `references/spacing-density.md` | Density profiles |
| `references/motion-personality.md` | Motion personality definitions (consumed by `design-motion`) |
| `references/visual-technique-matrix.md` | Allowed techniques per personality × density |
| `references/templates/` | `design-system.md` templates per sector |

### Detailed References
| File | Load when … |
|------|------|
| `references/color-system.md` | Building the full semantic color-token layer beyond the base palette. |
| `references/typography.md` | Defining the type scale beyond the pair itself (weights, line-height). |
| `references/fluid-typography.md` | Defining the `clamp()`-based fluid type scale. |
| `references/ui-hierarchy.md` | Establishing visual hierarchy rules across a page. |
| `references/ui-spacing.md` | Detailing the spacing system beyond the base density profile. |
| `references/ui-trends-2026.md` | Validating that the visual direction feels current, not dated. |
| `references/breakpoint-patterns.md` | Defining the responsive breakpoint strategy. |
| `references/container-queries.md` | A component must respond to its container, not the viewport. |
| `references/gradients-guide.md` | The identity calls for gradient backgrounds/accents. |
| `references/theme-presets.md` | Starting from a sector preset instead of building from scratch. |
| `references/complex-themes.md` | Nested or conditional theming beyond simple light/dark. |
| `references/multi-brand.md` | Multiple brands or white-label themes share one system. |
| `references/edge-cases.md` | Dark-mode-specific breakage (shadows, elevation). |
| `references/image-handling.md` | Dark-mode image treatment strategy. |
| `references/tailwind-config.md` | Custom Tailwind theme configuration for these tokens. |
| `references/tailwind-utilities.md` | Mapping tokens to Tailwind utility classes. |
| `references/tailwind-performance.md` | Optimizing Tailwind output size / purge strategy. |
