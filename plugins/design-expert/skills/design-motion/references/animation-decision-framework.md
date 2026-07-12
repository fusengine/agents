---
name: animation-decision-framework
description: The 4-question gate to answer BEFORE writing any animation — should it exist, what purpose, what easing, what duration
when-to-use: Before adding ANY animation. Run every candidate motion through this gate first.
keywords: decision, framework, gate, frequency, purpose, easing, duration, taste, when-not-to-animate
priority: high
related: motion-tokens.md, motion-physics.md, reduced-motion.md
---

# Animation Decision Framework

Adapted from [emilkowalski/skills](https://github.com/emilkowalski/skills) (`review-animations/STANDARDS.md`, `emil-design-eng/SKILL.md`). Distilled from Emil Kowalski's design-engineering philosophy ([animations.dev](https://animations.dev/)).

Run EVERY candidate animation through these four questions, in order, before writing a line of motion code. Most "let's animate this" ideas die at question 1 — that is the point. Taste is knowing what *not* to animate.

## 1. Should this animate at all?

Frequency decides. The more often a user sees it, the shorter and subtler it must be — until it disappears.

| Frequency | Decision |
| --- | --- |
| 100+ times/day (keyboard shortcuts, command-palette toggle) | No animation. Ever. |
| Tens of times/day (hover effects, list navigation) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare / first-time (onboarding, feedback, celebrations) | Can add delight |

**Never animate keyboard-initiated actions.** They repeat hundreds of times daily; animation makes them feel slow and disconnected. Raycast has no open/close animation — correct for something opened hundreds of times a day.

## 2. What is the purpose?

Every animation needs a one-sentence justification from this list. "It looks cool" on a frequently-seen element is not a valid purpose.

- **Spatial consistency** — a toast enters and exits from the same edge, so swipe-to-dismiss feels intuitive.
- **State indication** — a morphing button shows the state changed.
- **Explanation** — a marketing animation shows how a feature works.
- **Feedback** — a button scales down on press, confirming the interface heard the user.
- **Preventing jarring change** — elements appearing or vanishing with no transition read as broken.

## 3. What easing should it use?

Decision order:

- Entering or exiting → **`ease-out`** (starts fast, feels responsive)
- Moving / morphing on screen → **`ease-in-out`**
- Hover / color change → **`ease`**
- Constant motion (marquee, progress bar) → **`linear`**
- Default → **`ease-out`**

**Never `ease-in` on UI.** It starts slow, delaying the exact moment the user watches most closely — `ease-out` at 200ms *feels* faster than `ease-in` at the same 200ms. Use the strong custom curves in [[motion-tokens]] rather than the weak built-in CSS easings.

## 4. How fast should it be?

| Element | Duration |
| --- | --- |
| Button press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–500ms |
| Marketing / explanatory | Can be longer |

**Hard rule: UI animations stay under 300ms.** A 180ms dropdown feels more responsive than a 400ms one. Perceived speed matters as much as real speed: a faster-spinning spinner makes loading *feel* faster at the same actual load time; instant tooltips after the first one (skip delay + skip animation) make a whole toolbar feel faster.

## Accessibility gate (always)

Reduced motion means *fewer and gentler* animations, not zero — keep opacity and color transitions that aid comprehension, drop movement and position changes. Full patterns in [[reduced-motion]]. Gate hover motion behind pointer capability so a tap does not fire a phantom hover:

```css
@media (hover: hover) and (pointer: fine) {
  .element:hover { transform: scale(1.05); }
}
```
