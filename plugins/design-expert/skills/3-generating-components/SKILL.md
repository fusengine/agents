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
- CSS-precise observations from Phase 1 fuse-browser browsing (oklch values, clamp sizes, grid ratios).
- `copy-guide.md` from Phase 2 (voice, CTAs, microcopy).

### Steps
1. **Pre-generation checklist** — Verify: design-system.md exists, OKLCH tokens defined, typography pair set, motion profile set, visual-technique-matrix consulted.
2. **Browse inspiration** — `mcp__fuse-browser__browser_open` then `mcp__fuse-browser__browser_navigate` + `mcp__fuse-browser__browser_screenshot` on sector-matching sites (see `../1-designing-systems/references/design-inspiration.md` and `../1-designing-systems/references/design-inspiration-urls.md`). New project: 4 sites. New page: 2 sites. New component: 1 site.
3. **Search 21st.dev** — `mcp__magic__21st_magic_component_inspiration` for component patterns.
4. **Read premium patterns** — Read `references/premium-patterns/PATTERNS.md`, pick 2-3 patterns matching your sector, then read their `description.md`. Copy the "Gemini Context Prompt" section from each.
5. **Prepare 7 XML blocks** for Gemini: `<aesthetics>`, `<typography>`, `<color_system>`, `<spacing>`, `<layout>`, `<states>`, `<forbidden>`. Inject the hard layout constraints from `references/layout-discipline.md` into `<layout>`, `<spacing>`, and `<forbidden>` — these are non-negotiable numeric limits, not style hints.
6. **Generate** — `mcp__gemini-design__create_frontend` with design-system.md tokens + premium pattern context prompts combined. In the `context` parameter, ALWAYS include the copied Gemini Context Prompts + "Visual depth required: hero >= 75vh, 3-level shadows, alternating section backgrounds, glassmorphism nav, typography contrast 3:1 H1 vs body. NO flat design."
   - **Hard layout constraints (from `references/layout-discipline.md`) — verify mechanically in the returned markup:** hero headline ≤2 lines, subtext ≤20 words AND ≤4 lines, top padding ≤`pt-24`, max 4 hero-stack elements (trust strip / pricing teaser / feature bullets banned in the hero); eyebrows ≤ `ceil(sections/3)`; max 2 consecutive image+text (zigzag) sections; bento cells = content items exactly (zero filler); each layout family used once per page (8 sections → ≥4 families); CTA labels fit one line and one label per intention site-wide; quotes ≤3 lines, lists >5 items never a raw `<ul>`, spec sheets never a bordered row-list.
7. **Add variants** per `references/component-variants-ref.md` — size, state, color variants.
8. **Compose layouts** using `references/layouts/` (pages, navigation, patterns) and `references/component-composition-ref.md`.
9. **Iterate** — `mcp__gemini-design__modify_frontend` per `references/gemini-feedback-loop.md`.

### Output
- HTML/CSS components generated via Gemini, matching design-system.md identity.
- Variants (size, state, color) defined. Page layouts composed.
- Components ready for animation in Phase 4.

### Next → Phase 4: ADDING ANIMATIONS
`4-adding-animations/SKILL.md` — Add motion, interactions, and visual effects.

### References
| File | Purpose |
|------|---------|
| `references/layout-discipline.md` | **Hard layout constraints (hero numbers, eyebrow restraint, zigzag cap, bento cell count, section-repetition ban, CTA + density limits)** (Fusengine rules, hero/bento principles inspired by taste-skill) |
| `references/gemini-design-workflow.md` | Gemini MCP workflow |
| `references/gemini-tool-signatures.md` | Gemini tool API signatures |
| `references/gemini-feedback-loop.md` | Iterative refinement process |
| `references/premium-patterns/PATTERNS.md` | **10 premium design patterns with CSS specs + Gemini prompts** |
| `../1-designing-systems/references/design-inspiration.md` | Browsing methodology (Phase 1) |
| `../1-designing-systems/references/design-inspiration-urls.md` | Sector-specific URLs (Phase 1) |
| `references/component-variants-ref.md` | Variant patterns |
| `references/component-composition-ref.md` | Composition patterns |
| `references/layouts/` | Page layouts, navigation, patterns |
| `references/templates/` | Component templates (hero, pricing, etc.) |
| `references/21st-dev.md` | 21st.dev component library |
| `references/shadcn.md` | shadcn/ui integration |

### Detailed References
| File | Load when … |
|------|------|
| `references/reference-index.md` | Unsure which reference file covers a specific component type — it indexes all references/ files. |
| `references/ui-visual-design.md` | Establishing overall visual design principles (contrast, depth, hierarchy) before generating components. |
| `references/forms-guide.md` | Generating form components (inputs, validation states, multi-step forms). |
| `references/grids-layout.md` | Composing page/section grid layouts beyond what `layouts/` templates cover. |
| `references/buttons-guide.md` | Generating button components and their variants (primary/secondary/ghost, sizes, states). |
| `references/photos-images.md` | Components include photography or imagery and need treatment guidance (cropping, overlays, aspect ratio). |
| `references/icons-guide.md` | Choosing or generating icon sets consistent with the design system. |
| `references/component-examples.md` | Concrete before/after component examples are needed to calibrate Gemini output quality. |
| `references/design-patterns.md` | Selecting proven UI patterns (cards, modals, tabs) beyond the premium-patterns set. |
| `references/cards-guide.md` | Generating card components (product cards, pricing cards, content cards). |
