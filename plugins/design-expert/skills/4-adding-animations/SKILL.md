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
0. **Gate every animation first** — run each candidate motion through the 4-question framework in `references/animation-decision-framework.md` (should it exist → purpose → easing → duration) BEFORE writing any motion. Most "let's animate this" ideas should die here. Anything seen 100+ times/day or triggered by keyboard gets no animation.
1. **Read motion personality + `MOTION_INTENSITY`** from `design-system.md` — determines timing, easing, and intensity. Load default easing curves and spring configs from `references/motion-tokens.md`. If `MOTION_INTENSITY > 4`, the page must actually animate on scroll (see `references/gsap-scroll-skeletons.md`), not just claim to.
2. **Entrance animations** — EVERY section must animate on scroll (IntersectionObserver). Stagger children by 80-120ms. Use fadeUp (translateY 30px→0) + fadeIn (opacity 0→1). Cards stagger in grid order.
3. **Hover depth** — buttons: translateY(-3px) + shadow-lg + brightness(1.05). Cards: translateY(-8px) + shadow-xl + scale(1.01). Links: color transition 150ms.
4. **Focus/disabled** — :focus-visible with 2px outline + 4px offset. :disabled with opacity 0.4 + cursor not-allowed. MANDATORY on all interactive elements.
5. **Visual layers** — glassmorphism on nav (backdrop-blur 12px + bg oklch/0.85). Hero gradient overlay (oklch dark/0.6→transparent). Section separators (clip-path polygon or SVG wave). Background gradient orbs (radial-gradient oklch with blur).
6. **Micro-interactions** — button press scale(0.97), toggle slide 200ms, form input focus border-color transition, loading skeleton pulse animation.
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
| `references/animation-decision-framework.md` | **Load first** — 4-question gate (should it exist / purpose / easing / duration) |
| `references/motion-tokens.md` | Named easing curves + spring configs (the token layer) |
| `references/motion-physics.md` | Physical rules — never scale(0), origin-aware, asymmetric timing, stagger, blur, @starting-style |
| `references/motion-performance.md` | transform/opacity only, Framer Motion HW-accel caveat, drag velocity dismissal |
| `references/gsap-scroll-skeletons.md` | GSAP Sticky-Stack + Horizontal-Pan, `start:"top top"` fix, motion-claimed/shown |
| `references/animation-glossary.md` | Feel → term vocabulary for specs and handoff |
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
| `references/reduced-motion.md` | prefers-reduced-motion a11y patterns |
