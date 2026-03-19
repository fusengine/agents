---
name: generating-components
description: "Phase 3: Map design-system.md to 7 Gemini XML blocks (aesthetics, style_reference, typography, color_system, spacing, states, forbidden), call create_frontend, add component variants (Glass/Outline/Flat via CVA)."
phase: 3
---

## Phase 3: GENERATING COMPONENTS — Build UI with Gemini Design

### When
After Phases 0-2 are complete. design-system.md, tokens, and copy-guide.md must exist.

### Input (from Phases 0-2)
- `design-system.md` with OKLCH palette, typography, motion personality.
- CSS tokens from Phase 1 (colors.css, typography.css, spacing.css).
- `copy-guide.md` from Phase 2 (voice, CTAs, microcopy).

### Steps
1. **Pre-generation checklist** — Verify: design-system.md exists, OKLCH tokens defined, typography pair set, motion profile set, visual-technique-matrix consulted.
2. **Browse inspiration** — `mcp__playwright__browser_navigate` + `mcp__playwright__browser_take_screenshot` on sector-matching sites (see `references/design-inspiration.md` and `references/design-inspiration-urls.md`). New project: 4 sites. New page: 2 sites. New component: 1 site.
3. **Search 21st.dev** — `mcp__magic__21st_magic_component_inspiration` for component patterns.
4. **Prepare 7 XML blocks** for Gemini: `<aesthetics>`, `<typography>`, `<color_system>`, `<spacing>`, `<layout>`, `<states>`, `<forbidden>`.
5. **Generate** — `mcp__gemini-design__create_frontend` with design-system.md tokens + screenshot insights.
6. **Add variants** per `references/component-variants-ref.md` — size, state, color variants.
7. **Compose layouts** using `references/layouts/` (pages, navigation, patterns) and `references/component-composition-ref.md`.
8. **Iterate** — `mcp__gemini-design__modify_frontend` per `references/gemini-feedback-loop.md`.

### Output
- HTML/CSS components generated via Gemini, matching design-system.md identity.
- Variants (size, state, color) defined. Page layouts composed.
- Components ready for animation in Phase 4.

### Next → Phase 4: ADDING ANIMATIONS
`4-adding-animations/SKILL.md` — Add motion, interactions, and visual effects.

### References
| File | Purpose |
|------|---------|
| `references/gemini-design-workflow.md` | Gemini MCP workflow |
| `references/gemini-tool-signatures.md` | Gemini tool API signatures |
| `references/gemini-feedback-loop.md` | Iterative refinement process |
| `references/design-inspiration.md` | Browsing methodology |
| `references/design-inspiration-urls.md` | Sector-specific URLs |
| `references/component-variants-ref.md` | Variant patterns |
| `references/component-composition-ref.md` | Composition patterns |
| `references/layouts/` | Page layouts, navigation, patterns |
| `references/templates/` | Component templates (hero, pricing, etc.) |
| `references/21st-dev.md` | 21st.dev component library |
| `references/shadcn.md` | shadcn/ui integration |
