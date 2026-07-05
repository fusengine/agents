---
name: identity-system
description: "Phase 0: Read sector template (creative/fintech/ecommerce/devtool), generate OKLCH palette with chroma > 0.05, pick approved typography pair (never Inter/Roboto/Arial), define spacing base unit + motion profile."
phase: 0
---

## Phase 0: IDENTITY SYSTEM — Define the brand DNA

### When
Start of a new project, or when no `design-system.md` exists at project root.

### Input (from user)
- User brief: sector, audience, personality, competitors, desired feeling.
- If no brief provided, ask the 5 identity questions (see references/identity-brief.md).

### Steps
0. **Design Read + dials** — `references/design-read-dials.md`. Before any palette or font,
   infer the brief (page kind, vibe words, audience, brand assets, quiet constraints) and
   write one `Design Read:` line, then fix the 3 dials `DESIGN_VARIANCE`, `VISUAL_DENSITY`,
   `MOTION_INTENSITY` (1-10). Use the preset defaults for the use-case; use the documented
   per-dial fallback for anything the brief does not specify. These dials are contractual
   Inputs for every later phase.
1. **Read** `references/identity-brief.md` — collect answers to the 5 questions.
2. **Match sector** in `references/sector-palettes.md` — pick the OKLCH palette base.
3. **Generate palette** using `references/oklch-system.md` — primary, secondary, accent, neutral + semantic colors. Validate contrast with `references/contrast-ratios.md`.
4. **Choose typography pair** from `references/typography-pairs.md` — display + body fonts matching sector personality. NEVER use Inter, Roboto, Arial.
5. **Set spacing density** from `references/spacing-density.md` — dense / standard / editorial.
6. **Define motion personality** from `references/motion-personality.md` — corporate / modern / playful / luxury.
7. **Check visual techniques** in `references/visual-technique-matrix.md` — what is allowed for this personality x density combination.
8. **Generate `design-system.md`** at project root using the matching template from `references/templates/` (fintech, ecommerce, devtool, creative, or blank).

### Output
- `Design Read:` line + the 3 dials (`DESIGN_VARIANCE`, `VISUAL_DENSITY`, `MOTION_INTENSITY`) recorded at the top of `design-system.md` — carried forward as Inputs of Phases 1+.
- `design-system.md` at project root with: OKLCH palette, typography pair, spacing profile, motion personality, visual techniques allowed.
- All colors in OKLCH format, dark mode palette included.

### Next → Phase 1: DESIGNING SYSTEMS
`1-designing-systems/SKILL.md` — Convert identity into design tokens and responsive system.

### References
| File | Purpose |
|------|---------|
| `references/design-read-dials.md` | Design Read (brief inference) + the 3 direction dials with presets |
| `references/identity-brief.md` | 5-question brand questionnaire |
| `references/sector-palettes.md` | Sector-specific OKLCH palettes |
| `references/oklch-system.md` | OKLCH color generation rules |
| `references/contrast-ratios.md` | WCAG contrast validation |
| `references/typography-pairs.md` | Approved font pairings |
| `references/spacing-density.md` | Density profiles |
| `references/motion-personality.md` | Motion personality definitions |
| `references/visual-technique-matrix.md` | Allowed techniques per personality |
| `references/templates/` | design-system.md templates per sector |
