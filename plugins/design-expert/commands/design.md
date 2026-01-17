---
description: Expert UI/UX design workflow for React/Next.js with Tailwind CSS. Creates components using shadcn/ui, 21st.dev, with WCAG 2.2 accessibility and Framer Motion animations.
---

# Design Expert Workflow

Create production-ready UI components for React/Next.js with Tailwind CSS.

---

## Phase 1: DISCOVER (Inspiration)

> Search existing components for inspiration

**Tools**:
- `mcp__magic__21st_magic_component_inspiration` - Browse 21st.dev library
- `mcp__shadcn__search_items_in_registries` - Search shadcn/ui components

**Goals**:
- Find similar components for inspiration
- Identify design patterns to follow
- Note reusable elements

---

## Phase 2: DESIGN (System Alignment)

> Ensure component fits the design system

**Checklist**:
- [ ] Colors use OKLCH format with semantic tokens
- [ ] Typography follows scale (1.25 ratio)
- [ ] Spacing uses 4px grid system
- [ ] Dark mode support included

**References**: `designing-systems` skill, `references/tokens.md`

---

## Phase 3: BUILD (Component Generation)

> Generate the component

**Tools**:
- `mcp__magic__21st_magic_component_builder` - Generate from 21st.dev
- `mcp__shadcn__get_add_command_for_items` - Install shadcn components

**Standards**:
- File < 100 lines (split if needed)
- TypeScript with proper types
- JSDoc documentation
- Props interface separated

---

## Phase 4: ANIMATE (Micro-interactions)

> Add motion and feedback

**Timing Guidelines**:
| Interaction | Duration | Easing |
|-------------|----------|--------|
| Hover | 50-100ms | ease-out |
| Button press | 100-150ms | ease-out |
| Modal open | 200-300ms | ease-out |
| Page transition | 300-400ms | ease-in-out |

**Reference**: `adding-animations` skill, `references/framer-motion.md`

---

## Phase 5: VALIDATE (Accessibility)

> Ensure WCAG 2.2 Level AA compliance

**Checklist**:
- [ ] Color contrast 4.5:1 (text), 3:1 (UI)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA attributes correct
- [ ] Reduced motion respected

**Reference**: `validating-accessibility` skill

---

## Usage

**Arguments**:
- $ARGUMENTS specifies the component or page to create

**Examples**:
- `/design hero section with gradient` - Create hero component
- `/design pricing cards` - Create pricing section
- `/design contact form` - Create accessible form
- `/design dashboard sidebar` - Create navigation component

---

## Quality Guarantees

- WCAG 2.2 Level AA accessible
- Dark mode ready
- Mobile-first responsive
- Framer Motion animations
- < 100 lines per file
