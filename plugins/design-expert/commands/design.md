---
name: design
description: Expert UI/UX design workflow following APEX methodology. Creates components using shadcn/ui, 21st.dev, with WCAG 2.2 accessibility and Framer Motion animations.
---

# /design Command

Create production-ready UI components following APEX methodology.

## APEX WORKFLOW

**design-expert = Visual Architect → Delegates implementation**

| Phase | Step | Reference |
|-------|------|-----------|
| **A** | 00-init-branch | Create design/ branch |
| **A** | 01-analyze-design | `explore-codebase` → design tokens |
| **A** | 02-search-inspiration | 21st.dev + shadcn search |
| **P** | 03-plan-component | TaskCreate + file planning |
| **E** | 04-code-component | **DELEGATE to `react-expert` / `nextjs-expert`** |
| **E** | 05-add-motion | Framer Motion patterns |
| **E** | 06-validate-a11y | WCAG 2.2 AA checklist |
| **E** | 07-review-design | Elicitation self-review |
| **X** | 08-sniper-check | `sniper` validation |
| **X** | 09-create-pr | PR with screenshots |

## Quick Start

```
/design hero section with gradient background
/design pricing cards dark mode
/design contact form accessible
/design dashboard sidebar navigation
```

## Phase A: ANALYZE (Critical)

```
1. Task: explore-codebase
   "Analyze UI: colors, typography, spacing, animations"

2. Search inspiration:
   - mcp__magic__21st_magic_component_inspiration
   - mcp__shadcn__search_items_in_registries
```

## Phase E: EXECUTE (Delegation)

**Skills to use:**
- `generating-components` → design specs
- `designing-systems` → design tokens
- `adding-animations` → Framer Motion specs
- `validating-accessibility` → WCAG 2.2

**Delegate implementation to:** `react-expert` / `nextjs-expert`

## Phase X: EXAMINE

```
Task: sniper
"Validate design changes: TypeScript, ESLint, file sizes"
```

## Anti-AI Slop

| FORBIDDEN | USE INSTEAD |
|-----------|-------------|
| Inter, Roboto | Clash Display, Satoshi |
| Purple gradients | CSS variables |
| Border-left indicators | Icon + bg-*/10 |
| No animations | Framer Motion |

## Output Guarantees

- WCAG 2.2 Level AA
- Dark mode ready
- Mobile-first responsive
- Framer Motion animations
- Files < 100 lines
- Matches existing design

## References

- **APEX Design**: `references/design/` (10 files)
- **Typography**: `references/typography.md`
- **Colors**: `references/color-system.md`
- **Motion**: `references/motion-patterns.md`
