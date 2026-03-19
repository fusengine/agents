---
name: adding-animations
description: "Phase 4: Add Framer Motion scroll reveals (IntersectionObserver), hover scale/opacity transitions, focus ring states, loading skeletons, glassmorphism blur layers, gradient orb backgrounds — all via modify_frontend."
phase: 4
---

## Phase 4: ADDING ANIMATIONS — Motion, states, and visual effects

### When
After Phase 3 components are generated. Before design audit.

### Input (from Phase 3)
- Generated HTML/CSS components with variants and layouts.
- Motion personality from `design-system.md` (corporate / modern / playful / luxury).

### Steps
1. **Read motion personality** from `design-system.md` — determines timing, easing, and intensity.
2. **Apply entrance animations** per `references/entrance-patterns.md` — fade, slide, stagger for lists/grids.
3. **Add interactive states** per `references/interactive-states-ref.md` — hover, focus, active, disabled, loading for every interactive element.
4. **Add micro-interactions** from `references/micro-interactions.md` — button press, toggle, form validation feedback.
5. **Apply visual effects** — glassmorphism (`references/glassmorphism-advanced-ref.md`), layered backgrounds (`references/layered-backgrounds-ref.md`), only if allowed by visual-technique-matrix.
6. **Add page transitions** from `references/page-transitions.md` — route-level animations.
7. **Implement** — Use `mcp__gemini-design__modify_frontend` to inject Framer Motion code into existing components.
8. **Validate accessibility** — `prefers-reduced-motion` support required. Timing limits: hover <100ms, modal <300ms, page <400ms (see `references/motion-principles.md`).

### Output
- All components animated with Framer Motion matching the motion personality.
- Interactive states (hover, focus, active, disabled, loading) on every interactive element.
- Visual effects applied where allowed. Reduced-motion fallbacks included.

### Next → Phase 5: DESIGN AUDIT
`5-design-audit/SKILL.md` — Audit visual consistency, accessibility, and anti-AI-slop.

### References
| File | Purpose |
|------|---------|
| `references/motion-patterns.md` | Core Framer Motion patterns |
| `references/motion-principles.md` | Timing limits and principles |
| `references/entrance-patterns.md` | Entrance animation patterns |
| `references/interactive-states-ref.md` | State definitions (hover, focus, etc.) |
| `references/micro-interactions.md` | Micro-interaction patterns |
| `references/glassmorphism-advanced-ref.md` | Glassmorphism techniques |
| `references/layered-backgrounds-ref.md` | Layered background effects |
| `references/page-transitions.md` | Route-level transitions |
| `references/patterns-cards.md` | Card animation patterns |
| `references/patterns-buttons.md` | Button animation patterns |
| `references/patterns-navigation.md` | Navigation animations |
| `references/patterns-microinteractions.md` | Detail micro-interactions |
