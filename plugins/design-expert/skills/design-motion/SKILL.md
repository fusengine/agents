---
name: design-motion
description: "Motion, states, and visual effects — gated by the motion profile from design-system.md, not applied uniformly. Most animation ideas should die at the gate; what survives gets full state coverage (hover/focus/disabled/loading) and a reduced-motion fallback."
when-to-use: "After design-web or design-webapp components are generated, before design-review."
keywords: motion, animation, framer-motion, states, reduced-motion, gate
priority: high
related: design-system, design-web, design-webapp, design-review
---

## Design Motion — Gated, Not Automatic

### When
After `design-web` or `design-webapp` components exist. Before `design-review`.

### Input
- Generated HTML/CSS components with variants and layouts.
- `MOTION_INTENSITY` dial and motion personality (corporate / modern / playful / luxury)
  from `design-system.md`.

### Steps

1. **Gate every candidate animation first** — run it through the 4-question framework in
   `references/animation-decision-framework.md` (should it exist → purpose → easing →
   duration) BEFORE writing any motion code. This is the default stance: most "let's
   animate this" ideas die here. Anything seen 100+ times/day, or triggered by keyboard
   navigation, gets no animation.
2. **Scale to `MOTION_INTENSITY`.** Load easing curves and spring configs from
   `references/motion-tokens.md`. Below `MOTION_INTENSITY` 4: restraint — only what
   survived the gate, nothing decorative. At `MOTION_INTENSITY > 4`: the page must
   actually animate on scroll (see `references/gsap-scroll-skeletons.md`), not merely
   claim to — this is checked in `design-review`'s motion audit.
3. **For everything that survives the gate**, apply the matching pattern:
   - Entrance: `references/entrance-patterns.md` — IntersectionObserver reveals,
     80-120ms stagger, fadeUp/fadeIn.
   - Hover: `references/patterns-buttons.md`, `references/patterns-cards.md` — depth via
     translateY + shadow, never scale-only.
   - Micro-interactions: `references/micro-interactions.md` — button press, toggle,
     input focus, skeleton pulse.
   - Navigation/page transitions: `references/patterns-navigation.md`,
     `references/page-transitions.md`.
4. **Mandatory regardless of intensity** — every interactive element gets `:focus-visible`
   (2px outline, 4px offset) and `:disabled` (opacity 0.4, cursor not-allowed) states. This
   is not gated; skipping it is a `design-review` failure, not a style choice.
5. **Visual layers**, if the tone calls for them: glassmorphism nav
   (`references/glassmorphism-advanced-ref.md`), layered backgrounds
   (`references/layered-backgrounds-ref.md`) — gate these too, don't default to them.
6. **Implement** directly in the HTML/CSS (or via `modify_frontend` if using the optional
   Gemini path from `design-web/references/gemini/`).
7. **Reduced motion is mandatory, not optional** — every animation added needs a
   `prefers-reduced-motion` fallback per `references/reduced-motion.md`. Timing limits:
   hover < 100ms, modal < 300ms, page < 400ms (`references/motion-principles.md`).

### Output
- Every surviving animation matches the motion personality and passes the 4-question gate.
- Every interactive element has hover/focus/disabled states (mandatory, ungated).
- `prefers-reduced-motion` fallback present wherever motion was added.

### Next → `design-review` (runs the full motion audit against
`design-review/references/motion-audit.md` and the Block/Approve verdict against `design-review/references/motion-verdict.md`).

### References
| File | Purpose |
|------|---------|
| `references/animation-decision-framework.md` | **Load first — the gate** |
| `references/motion-tokens.md` | Named easing curves + spring configs |
| `references/motion-principles.md` | Timing limits |
| `references/reduced-motion.md` | prefers-reduced-motion patterns (mandatory) |
| `references/entrance-patterns.md` | Scroll-reveal entrance patterns |
| `references/interactive-states-ref.md` | hover/focus/disabled/loading definitions |
| `references/micro-interactions.md` | Button press, toggle, input focus, skeleton |
| `references/motion-patterns.md` | Core Framer Motion patterns |
| `references/motion-physics.md` | Never scale(0), origin-aware, asymmetric timing |
| `references/motion-performance.md` | transform/opacity only, HW-accel caveats |
| `references/gsap-scroll-skeletons.md` | Scroll-driven patterns for `MOTION_INTENSITY > 4` |
| `references/animation-glossary.md` | Shared vocabulary (used by `design-review` too) |
| `references/page-transitions.md` | Route-level transitions |
| `references/patterns-cards.md` | Card animation patterns |
| `references/patterns-buttons.md` | Button animation patterns |
| `references/patterns-navigation.md` | Navigation animations |
| `references/patterns-microinteractions.md` | Detail micro-interactions |
| `references/glassmorphism-advanced-ref.md` | Glassmorphism technique (gated, not default) |
| `references/layered-backgrounds-ref.md` | Layered background effects (gated, not default) |
