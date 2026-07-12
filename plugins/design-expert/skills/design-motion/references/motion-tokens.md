---
name: motion-tokens
description: Default named easing curves and spring configs — the token layer to drop into design-system.md
when-to-use: Setting up motion tokens for a project, choosing an easing curve or spring config
keywords: easing, cubic-bezier, spring, bounce, tokens, ease-out, ease-drawer, apple-spring
priority: high
related: animation-decision-framework.md, motion-physics.md
---

# Motion Tokens

Adapted from [emilkowalski/skills](https://github.com/emilkowalski/skills) (`emil-design-eng/SKILL.md`, `review-animations/STANDARDS.md`).

The built-in CSS easings are too weak — they lack the punch that makes motion feel intentional. Ship these named curves as tokens instead of hand-rolling per component. Find variants at [easing.dev](https://easing.dev/) or [easings.co](https://easings.co/); don't invent curves from scratch.

## Easing curves

```css
:root {
  /* Strong ease-out for UI interactions (enter / exit) */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  /* Strong ease-in-out for on-screen movement (A → B) */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

  /* iOS-like drawer curve (from Ionic Framework) */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}
```

Reach for `--ease-drawer` on sheet/drawer slide-ups, `--ease-out` on everything that enters or exits, `--ease-in-out` for elements repositioning on screen. Never `ease-in` on UI (see [[animation-decision-framework]]).

## Spring configs

Springs simulate physics, so they have no fixed duration — they settle on their parameters. Prefer them for gesture-driven and "alive" motion (see [[motion-performance]]).

```js
// Apple-style — easier to reason about (recommended default)
{ type: "spring", duration: 0.5, bounce: 0.2 }

// Traditional physics — more control
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }
```

Keep `bounce` subtle: **0.1–0.3**, and avoid bounce in most UI — reserve it for drag-to-dismiss and playful interactions. A dashboard should stay crisp and near-zero bounce; a playful product can push toward 0.3.

## Cohesion

Match the token choice to the component's personality. Sonner's toasts feel right partly because their motion is slightly slower and uses `ease` rather than `ease-out`, to read as elegant rather than snappy. Pick the curve that matches the voice, not just the fastest one.
