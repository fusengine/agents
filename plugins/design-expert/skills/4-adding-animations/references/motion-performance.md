---
name: motion-performance
description: Performance guardrails — transform/opacity only, the Framer Motion hardware-acceleration caveat, CSS-var recalc trap, drag velocity dismissal
when-to-use: Animating anything that must stay at 60fps, building drag/gesture interactions, debugging dropped frames
keywords: performance, transform, opacity, hardware-acceleration, framer-motion, gpu, drag, velocity, waapi
priority: high
related: motion-tokens.md, motion-physics.md
---

# Motion Performance

Adapted from [emilkowalski/skills](https://github.com/emilkowalski/skills) (`emil-design-eng/SKILL.md`, `review-animations/STANDARDS.md`).

## Only animate transform and opacity

These skip layout and paint and run on the GPU. Animating `width`, `height`, `top`, `left`, `padding` or `margin` triggers all three rendering steps and drops frames.

## The Framer Motion shorthand caveat

Framer Motion's `x` / `y` / `scale` shorthands are **NOT hardware-accelerated** — they run on the main thread via `requestAnimationFrame` and drop frames under load. Use the full `transform` string for anything that must stay smooth while the browser is busy:

```jsx
<motion.div animate={{ x: 100 }} />                          // drops frames under load
<motion.div animate={{ transform: "translateX(100px)" }} />  // hardware accelerated
```

This is a documented, real failure: Vercel's dashboard tab animation used Shared Layout Animations, dropped frames during page loads, and was fixed by moving to CSS animations (off the main thread).

## Don't drive child transforms via a CSS variable on the parent

CSS variables are inheritable, so mutating one on a parent recalculates styles for **every** child. In a drawer with many rows, updating `--swipe-amount` on the container is expensive. Set `transform` directly on the element instead.

```js
element.style.setProperty('--swipe-amount', `${d}px`); // bad: recalc on all children
element.style.transform = `translateY(${d}px)`;        // good: only this element
```

## CSS transitions over keyframes for interruptible UI

CSS **transitions** can be interrupted and retargeted mid-animation; **keyframes** restart from zero. For anything triggered rapidly (toasts being added, toggles), transitions produce smoother results. Use CSS for predetermined motion (runs off the main thread, survives page-load jank), JS/springs for dynamic and interruptible motion. WAAPI gives JS control with CSS performance when you need both.

## Springs for gesture-driven motion

Springs maintain velocity when interrupted; keyframes restart from zero. That makes them ideal for gestures a user may reverse mid-motion — click an expanded item, hit Escape, and a spring reverses smoothly from its current position. See spring configs in [[motion-tokens]].

## Drag: dismiss by velocity, not just distance

Don't require dragging past a distance threshold. Compute velocity — `Math.abs(distance) / elapsedMs` — and dismiss when it exceeds **~0.11**, so a quick flick is enough regardless of how far it travelled.

```js
const velocity = Math.abs(swipeAmount) / timeTaken;
if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) dismiss();
```

Round it out with damping at boundaries (over-drag moves less the further it goes), pointer capture once dragging starts, and ignoring extra touch points after the drag begins (`if (isDragging) return`) to prevent jumps. Friction over hard stops — real things slow before they stop.
