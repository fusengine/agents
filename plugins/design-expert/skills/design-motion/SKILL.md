---
name: design-motion
description: "Motion pass on a settled layout — the animation-decision gate, transform/opacity-first materials, the 100/300/500 duration scale, exponential/emphasized easing (no bounce), mandatory reduced-motion, and the AI-motion-signature ban."
when-to-use: "After the static body/component exists (design-web/design-webapp/design-ios/design-android) and motion is being added or reviewed — never to hide an unfinished layout."
keywords: motion, animation, easing, duration, transform, opacity, reduced-motion, ai-slop
priority: high
related: design-web, design-webapp, design-review, design-system
---

## Design Motion — Timing, Easing, Materials, Restraint

### When
After the static body/component exists. Motion is applied on top of a settled layout —
never used to compensate for or distract from an unfinished one. Hands off to
`design-review` next (Part 1 checks the reduced-motion fallback + transform/opacity
discipline; Part 2's `motion-verdict.md` issues the Block/Approve).

### Input
- `design-system.md` motion personality / `MOTION_INTENSITY` dial (1-10).
- The static markup/components to animate.

### The animation gate — before writing any motion code
Run every candidate through `references/animation-decision-framework.md`'s 4 questions,
in order: (1) should this animate at all — frequency decides, never animate
keyboard-initiated or 100+/day actions; (2) what's the one-sentence purpose (spatial
consistency / state indication / explanation / feedback / preventing jarring change); (3)
what easing; (4) what duration. Most "let's animate this" ideas should die at question 1
— that is the point, not a formality to skip.

### Materials — transform/opacity first, other properties gated
Default to `transform` and `opacity` — they skip layout and paint and run on the GPU.
Animating `width`/`height`/`top`/`left`/`margin`/`padding` triggers layout+paint+composite
and drops frames; see `references/motion-performance.md` for the Framer Motion shorthand
caveat (`x`/`y`/`scale` shorthands are NOT hardware-accelerated, use the full `transform`
string), the CSS-var recalc trap (never drive child transforms via a custom property on
the parent), CSS transitions vs. keyframes for interruptible UI, and velocity-based drag
dismissal (~0.11 threshold, not distance alone). Other atmospheric materials — blur,
backdrop-filter, clip-path, shadow bloom, masks — are allowed when they demonstrably read
as premium and stay smooth on the target viewports, verified in-browser, never a default
reach; keep expensive effects bounded to small/isolated areas. `references/motion-physics.md`
covers physical-correctness rules for whichever material is used: never `scale(0)`,
origin-aware popovers, asymmetric enter/exit timing (exit ~75% of enter duration),
staggered lists (cap total stagger time), blur masking, `@starting-style`.

### Durations — the 100/300/500 rule

| Tier | Duration | Use |
|---|---|---|
| Micro | 100-150ms | button press, toggle, instant feedback |
| State | 200-300ms | menu open, tooltip, hover states |
| Layout | 300-500ms | accordion, modal, drawer |
| Entrance | 500-800ms | page load, hero reveal |

Exit animations run at ~75% of the matching enter duration. Hard rule for anything that
isn't a marketing/explanatory sequence: **UI feedback stays under 300ms** — a 180ms
dropdown reads as more responsive than a 400ms one
(`references/animation-decision-framework.md` §4).

### Easing — exponential/emphasized, no bounce
Entering/exiting → `ease-out`. Moving/morphing on-screen (A→B) or state toggles →
`ease-in-out`. Hover/color change → `ease`. Constant motion (marquee, progress) →
`linear`. **Never `ease-in` on UI** — it delays the exact moment the user is watching
most closely. Use the strong custom curves in `references/motion-tokens.md`
(`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out`, `--ease-drawer`) or the
exponential/quint-out family (`cubic-bezier(0.16, 1, 0.3, 1)` and similar) — never the
weak built-in CSS easings. **Bounce and elastic curves are banned outright** — they read
as a toy interaction, not a premium one. Hard mechanical gate, zero tolerance: any
`cubic-bezier` with a y-control-point > 1, or the literal `elastic`/`bounce` keywords,
fails `design-review/references/pre-flight-checklist.md` check 9. Springs (when used —
gesture-driven/interruptible motion only) keep `bounce` in **0.1-0.3**, biased toward 0.1
for dashboards/product register and up to 0.3 for playful/brand register.

### Reduced motion — mandatory, not optional
Every animated deliverable ships a `prefers-reduced-motion: reduce` fallback in the same
commit — never a follow-up pass. Full patterns: `references/reduced-motion.md` (global
override, Framer Motion's `useReducedMotion()`/`MotionConfig`, per-animation-type
disable-vs-simplify table, WCAG 2.2 SC 2.3.3/2.3.1/2.2.2). Disable spatial movement
entirely (parallax, auto-playing carousels, zoom/scale transitions — vestibular risk);
simplify functional feedback rather than remove it (progress bars and loading spinners
stay, slowed and non-spatial; page-slide transitions become an instant swap that keeps
navigation feedback). ~35% of adults over 40 are affected by vestibular disorders — this
is not an edge case. `design-review` Part 1 treats a missing reduced-motion fallback as a
**Critical**-severity finding (`audit-checklist.md` Motion row) that blocks the review.

### Ban — the AI motion signature
The single most common AI-generated motion tell: `opacity: 0` + `translateY(20px)` +
`ease-in-out`, applied uniformly to every entrance on the page with zero variation by
element role (grounding: ~83% of AI-generated pages ship this exact pattern). Vary
instead: stagger timing and entrance direction/distance by section role, easing chosen
per the Q3 decision table above, duration chosen per the tier table above — never one
blanket transition rule copy-pasted down every section. `design-review` catches leftovers
of this at `pre-flight-checklist.md` check 4 (motion-claimed-motion-shown: a declared
`MOTION_INTENSITY > 4` must ship actual motion code) and check 10 (layout-property
animation, warning-tier), plus the co-occurrence detectors in `anti-ai-slop-audit.md`.

### Steps
1. Gate every candidate animation through `references/animation-decision-framework.md`.
2. Pick the duration tier (table above) and the easing token from `references/motion-tokens.md`.
3. Choose the material — `transform`/`opacity` by default; consult
   `references/motion-physics.md` for physical correctness and
   `references/motion-performance.md` for the GPU/perf guardrails before reaching for
   anything else.
4. Apply the category pattern: `references/entrance-patterns.md` (stagger/fade/slide/scale),
   `references/micro-interactions.md` (buttons/toggles/copy actions/loading),
   `references/page-transitions.md` (route changes/drill-down/modal),
   `references/patterns-buttons.md` / `references/patterns-cards.md` /
   `references/patterns-navigation.md` / `references/patterns-microinteractions.md` for
   component-specific treatments, `references/interactive-states-ref.md` for
   hover/active/focus/disabled/loading state choreography.
   `references/gsap-scroll-skeletons.md` for pinned/scroll-driven sections (Sticky-Stack,
   Horizontal-Pan) — carries the same motion-claimed/motion-shown honesty rule as the ban
   above. `references/glassmorphism-advanced-ref.md` and
   `references/layered-backgrounds-ref.md` are gated-use references (blur/layering
   effects), never a default reach — see design-method's cluster 4 AI-slop warning
   (glassmorphism + `rounded-2xl` applied everywhere instead of gated).
5. Ship the reduced-motion fallback in the same pass — not a follow-up.
6. Name every effect in the handoff/spec using `references/animation-glossary.md`'s
   feel→term vocabulary ("the springy thing when a popover opens" → the exact word) —
   precise handoff, not vibes.

### Failure Handling
- An effect needs blur/filter/backdrop-filter and visibly drops frames on target
  viewports → fall back to transform/opacity only, note the tradeoff in the handoff.
- A purely spatial effect (e.g. parallax) has no sane reduced form → disable entirely
  under the media query rather than approximate a "lite" version.

### Output
- Animated component/page reusing motion tokens (durations/easings) from
  `references/motion-tokens.md` — never hand-rolled per instance.
- `prefers-reduced-motion` fallback shipped in the same pass.
- Effects named per `references/animation-glossary.md` for handoff to `design-review` or
  another agent.

### Next → `design-review` — Part 1 checks the reduced-motion fallback and the
transform/opacity discipline mechanically; Part 2's `motion-verdict.md` issues the
Block/Approve on feel, physicality, and accessibility.

### References
| File | Purpose |
|------|---------|
| `references/animation-decision-framework.md` | **The 4-question gate — run first, every time** |
| `references/motion-performance.md` | GPU/perf guardrails, Framer Motion caveat, drag velocity |
| `references/motion-tokens.md` | Named easing curves + spring configs (the token layer) |
| `references/motion-physics.md` | Physical-correctness rules (never `scale(0)`, origin, stagger, `@starting-style`) |
| `references/reduced-motion.md` | **Mandatory** — media query, Framer Motion hooks, WCAG 2.2, disable-vs-simplify table |
| `references/animation-glossary.md` | Feel → term vocabulary for specs/handoff |
| `references/entrance-patterns.md` | Stagger/fade/slide/scale entrance patterns |
| `references/micro-interactions.md` | Button/toggle/copy-action/loading micro-animations |
| `references/page-transitions.md` | Route changes, drill-down, modal transitions |
| `references/patterns-buttons.md` | Button component motion patterns |
| `references/patterns-cards.md` | Card motion/hover patterns |
| `references/patterns-navigation.md` | Navigation/responsive-navbar motion |
| `references/patterns-microinteractions.md` | Broader micro-interaction/transition patterns |
| `references/interactive-states-ref.md` | Hover/active/focus/disabled/loading state choreography |
| `references/motion-principles.md` | Motion hierarchy, duration scale, easing — general principles |
| `references/motion-patterns.md` | Framer Motion pattern library, timing guidelines |
| `references/gsap-scroll-skeletons.md` | Scroll-driven/pinned skeletons + motion-claimed/motion-shown rule |
| `references/glassmorphism-advanced-ref.md` | Gated-use glass effects (blur/layering) — never default |
| `references/layered-backgrounds-ref.md` | Gated-use gradient orbs/blur layers/noise textures |
