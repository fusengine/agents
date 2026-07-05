---
name: animation-glossary
description: Feel → term reverse glossary for animation specs and handoff — turn "the springy thing when a popover opens" into the exact word
when-to-use: Writing an animation spec, naming a motion effect for a designer or another agent, precise handoff
keywords: vocabulary, glossary, term, naming, stagger, morph, crossfade, rubber-banding, origin-aware, spec
priority: low
related: animation-decision-framework.md
---

# Animation Glossary

Adapted from [emilkowalski/skills](https://github.com/emilkowalski/skills) (`animation-vocabulary/SKILL.md`). Use this to name an effect precisely in a spec or handoff — a shared word removes ambiguity between what was asked and what gets built.

When two terms compete, name the best fit first, then contrast the alternates in one line.

## Entrances & exits
- **Fade in / out** — appear/disappear by opacity.
- **Slide in** — enters from off-screen.
- **Scale in** — grows from smaller to full size, usually with a fade.
- **Pop in** — appears with a slight overshoot, bounces into place.
- **Reveal** — uncovered gradually via clip-path or mask.

## Movement & origin
- **Translate / Scale / Rotate / Skew** — the base transforms.
- **Transform origin** — the anchor a scale or rotation grows from.
- **Origin-aware animation** — an element animates out of its trigger (a popover growing from its button, not from its own center).

## Transitions between states
- **Crossfade** — one element fades out as another fades in, same spot.
- **Morph** — one shape smoothly turns into another (Dynamic Island).
- **Shared element transition** — an element travels and transforms from one position into another (thumbnail expanding into a card).
- **Layout animation** — size/position change animates to the new spot instead of snapping.
- **Continuity transition** — keeps the user oriented by visually connecting before and after.

Disambiguation: **Crossfade** = fades in place · **Morph** = shape changes in place · **Shared element** = travels *and* transforms.

## Scroll
- **Scroll reveal** — fades/slides in as it enters the viewport.
- **Scroll-driven animation** — progress tied directly to scroll position.
- **Parallax** — foreground and background move at different speeds.
- **Page / View transition** — motion when navigating routes; View transition morphs shared elements.

## Feedback & interaction
- **Press / tap feedback** — subtle scale-down on click, so it feels physical.
- **Hold to confirm** — a progress fill while the user holds.
- **Swipe to dismiss** — drag off-screen to close (drawer, toast).
- **Rubber-banding** — resistance and snap-back when dragging past a boundary (iOS overscroll).
- **Ripple** — a circle expanding from the tap point.

## Easing & springs
- **Ease-out / -in / -in-out / Linear** — see [[animation-decision-framework]] for when each applies.
- **Asymmetric easing** — accelerates and decelerates at different rates; feels more alive.
- **Spring** — physics-driven (stiffness/damping/mass) instead of a fixed duration.
- **Bounce** — a spring that overshoots and settles.
- **Momentum / Velocity** — carried motion after a drag; a spring keeps it into the next animation when interrupted.
- **Interruptible animation** — redirectable mid-flight instead of finishing first.

## Sequencing & ambient
- **Stagger** — animate several items one after another with a small delay, a cascade.
- **Orchestration** — timing multiple animations so they read as one coordinated motion.
- **Marquee** — content scrolling continuously in a loop.
- **Pulse / Float** — a gentle repeating scale/opacity change, or a slow up-and-down drift.

## Polish
- **Blur** — softens an element or masks a tiny imperfect crossfade.
- **Clip-path / Mask** — clip to a shape (hard edge) vs reveal with soft fadeable edges.
- **Skeleton / Shimmer** — a placeholder with a moving sheen while content loads.
- **Number ticker / Tabular numbers** — digits rolling to a value; fixed-width digits so they don't shift.
- **Line drawing** — an SVG path that draws itself in.
