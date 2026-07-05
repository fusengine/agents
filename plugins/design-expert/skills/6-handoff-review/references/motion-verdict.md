# Motion Verdict Format

Load when the Phase 6 "Motion verdict" step runs — i.e. the handoff review touches any
animation, transition, hover, or gesture found during the light/dark screenshot pass.

Verdict structure adapted from Emil Kowalski's `review-animations` skill
(github.com/emilkowalski/skills — Required Output Format). The shared animation
vocabulary lives in the Phase 4 glossary (`4-adding-animations/references/`) — point to
it for term definitions; do not redefine terms here.

Output two parts, in this order.

## Part 1 — Findings table (required)

A single markdown table. One row per motion issue. Never a "Before:/After:" prose list.
Cite `file:line`. Pull exact curves/durations from Emil's `STANDARDS.md` rather than
approximating.

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms ease-out` | `all` animates unintended properties off the GPU; name exact properties |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing appears from nothing — `scale(0)` looks like it came from nowhere |
| `ease-in` on dropdown | `ease-out` + strong custom curve | `ease-in` delays the moment the user watches most; feels sluggish |
| `transform-origin: center` on popover | `var(--radix-popover-content-transform-origin)` | Popovers scale from their trigger, not center (modals are exempt) |

If the table is empty, state "No motion findings" — do not omit Part 1.

## Part 2 — Tiered verdict (required)

Group remaining commentary by impact tier, highest first. Omit empty tiers.

1. **Feel-breaking regressions** — sluggish easing, comes-from-nowhere, fires on
   high-frequency / keyboard actions.
2. **Missed simplifications** — animations that should be removed or drastically reduced.
3. **Performance** — non-GPU properties, dropped-frame risks, recalc storms.
4. **Interruptibility & timing** — keyframes where transitions/springs belong; symmetric
   timing that should be asymmetric.
5. **Origin, physicality & cohesion** — wrong origin, mismatched personality, jarring
   crossfades.
6. **Accessibility** — reduced-motion and pointer/hover gating.

## Decision (required, explicit)

Close every review with one word:

- **Block** — any feel-breaking regression, animation on a keyboard / high-frequency
  action, `scale(0)` or `ease-in` on UI, or a non-GPU animation with an easy GPU fix.
- **Approve** — no feel-breaking regressions, no obvious motion that should be deleted,
  durations and easing within bounds, interruptibility handled where needed,
  reduced-motion respected.

A Block routes back to Phase 5's remediation hierarchy for the fix (max 2 cycles per the
handoff loop); an Approve completes the handoff.
