# Motion Audit

Load when Phase 5 Step "Motion Audit" runs — i.e. whenever the output added animation,
transition, scroll-reveal, hover, or gesture code in Phase 4.

Craft bar and review method adapted from Emil Kowalski's `review-animations` skill
(github.com/emilkowalski/skills — `SKILL.md` + `STANDARDS.md`). Default to flagging;
a motion passes only when it earns approval. A transition that *runs* but feels
sluggish, lands from the wrong origin, fires too often, or drops frames is a finding,
not a pass.

## The 10 non-negotiable standards

Measure every animation in the output against all ten. Each violation is a finding.

1. **Justified motion** — every animation answers "why does this move?" (spatial
   continuity, state indication, feedback, explanation, or masking a jarring change).
   "It looks cool" on a frequently-seen element is a block.
2. **Frequency-appropriate** — match motion to how often it is seen. Keyboard-triggered
   and 100+/day actions get no animation; tens/day get reduced motion; occasional gets
   standard; rare / first-time can carry delight.
3. **Responsive easing** — entering/exiting elements use `ease-out` or a strong custom
   cubic-bezier. `ease-in` on UI is a block (it delays the moment the user watches most).
   Built-in CSS easings are too weak for deliberate motion.
4. **Sub-300ms UI** — UI animations stay under 300ms; anything slower on a UI element
   needs a stated reason or it is a finding.
5. **Origin & physical correctness** — popovers/dropdowns/tooltips scale from their
   trigger (`transform-origin`), not center. Never animate from `scale(0)`; start from
   `scale(0.9–0.97)` + opacity. Modals are exempt (they stay centered).
6. **Interruptibility** — rapidly-triggered or gesture-driven motion (toasts, toggles,
   drags) must retarget from its current state (CSS transitions or springs), not
   keyframes that restart from zero.
7. **GPU-only properties** — animate `transform` and `opacity` only. Animating
   `width`/`height`/`margin`/`padding`/`top`/`left` (or Motion `x`/`y`/`scale`
   shorthands under load) is a performance finding.
8. **Accessibility** — `prefers-reduced-motion` is honored (gentler, not zero — keep
   opacity/color, drop movement). Hover motion is gated behind
   `@media (hover: hover) and (pointer: fine)`.
9. **Asymmetric enter/exit** — deliberate actions (a press, a hold, a destructive
   confirm) animate slower; system responses snap. Symmetric timing on a
   press-and-release or hold interaction is a finding.
10. **Cohesion** — motion matches the component's personality and the rest of the
    product. Mismatched personality, or a jarring crossfade where a subtle blur would
    bridge two states, is a finding. When unsure whether motion feels right, deleting
    it is often the strongest move.

## Escalation triggers (immediate fail)

Flag these on sight, hard:

- `transition: all` (unbounded property animation)
- `scale(0)` or a pure-fade entrance with no initial transform
- `ease-in` on any UI interaction; weak built-in easing on a deliberate animation
- animation on a keyboard shortcut, command-palette toggle, or 100+/day action
- UI duration > 300ms with no stated reason
- `transform-origin: center` on a trigger-anchored popover/dropdown/tooltip
- keyframes on toasts, toggles, or anything added/triggered rapidly
- animating layout properties (`width`/`height`/`margin`/`padding`/`top`/`left`)
- Motion `x`/`y`/`scale` props on motion that runs while the page is busy
- updating a CSS variable on a parent to drive a child transform (recalc storm)
- missing `prefers-reduced-motion` handling on movement
- ungated `:hover` motion
- symmetric enter/exit timing on a press-and-release or hold interaction

## Remediation hierarchy (imposed triage order)

When proposing fixes for the flagged findings, prefer earlier moves over later ones —
apply this exact order:

1. **Delete** the animation (high-frequency / no purpose / keyboard-triggered).
2. **Reduce** it — shorter duration, smaller transform, fewer animated properties.
3. **Fix the easing** — swap `ease-in` → `ease-out` / a strong custom curve.
4. **Fix the origin** — correct `transform-origin`; replace `scale(0)` with
   `scale(0.95)` + opacity.
5. **Make it interruptible** — keyframes → transitions, or a spring for gestures.
6. **Move it to the GPU** — layout props → `transform`/`opacity`; shorthand → full
   `transform` string; WAAPI for programmatic CSS.
7. **Asymmetric timing** — slow the deliberate phase, snap the response.
8. **Polish** — blur to mask crossfades, stagger groups, `@starting-style` for entry.
9. **Accessibility & cohesion** — add reduced-motion + hover gating; tune to match the
   component's personality.

Precise curves, duration tables, and spring config: see Emil's `STANDARDS.md`. The
Phase 6 verdict reuses the shared animation vocabulary — do not redefine terms here.
