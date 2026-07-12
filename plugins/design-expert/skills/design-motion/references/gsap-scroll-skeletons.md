---
name: gsap-scroll-skeletons
description: Canonical GSAP ScrollTrigger skeletons (Sticky-Stack, Horizontal-Pan) and the motion-claimed/motion-shown honesty rule
when-to-use: Building scroll-driven sections, pinned narratives, horizontal scroll, when MOTION_INTENSITY is high
keywords: gsap, scrolltrigger, pin, scrub, sticky-stack, horizontal-pan, scroll-reveal, motion-intensity
priority: medium
related: motion-performance.md, animation-decision-framework.md
---

# GSAP Scroll Skeletons

Adapted from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (`gpt-tasteskill/SKILL.md`, Section 5: Advanced GSAP Motion).

**Provenance (verify before you cite):**
- *Verified in taste-skill §5* — the scroll numbers: `scale: 0.8 → 1.0`, fade to `opacity: 0.2`, scrub text `0.1 → 1.0`, hover `scale-105` at `duration-700`, and the paradigms (Scroll Pinning `pin: true`, Card Stacking, Image Scale & Fade).
- *Standard GSAP ScrollTrigger API* — `pin`, `scrub`, `start: "top top"`. Framework knowledge, not a taste-skill value.
- *Fusengine design decisions* — the skeleton **names** "Sticky-Stack" / "Horizontal-Pan" (our wrapping of §5's Card Stacking + Scroll Pinning), and the `MOTION_INTENSITY` gate below. taste-skill has no such dial.

## Motion claimed → motion shown (Fusengine design decision)

`MOTION_INTENSITY` is a **Fusengine** Phase-0 dial (an **Input** to this phase — set upstream in `design-system.md`, not defined here; it does **not** exist in taste-skill). Our rule: if `MOTION_INTENSITY > 4`, the page must **actually** animate on scroll, not just declare intent. A high dial with a static page is a failure. Below that, keep scroll motion restrained and lean on entrance + hover only.

Everything here still passes the [[animation-decision-framework]] gate first — scroll spectacle is "occasional/rare" motion, never applied to something seen 100+ times a day.

## The `start: "top top"` fix (standard GSAP, not a taste-skill value)

Pinned sections mis-pin when the trigger's start is left at the default — the section jumps before it reaches the top of the viewport. Anchor the pin start to `"top top"` (trigger's top hits the viewport's top) so the section locks exactly when it fills the screen.

## Sticky-Stack

Pin a section while its cards stack and scrub in from the bottom, overlapping as the user scrolls down.

```js
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".stack",
  start: "top top",          // lock when the section fills the viewport
  end: "+=200%",
  pin: true,
  scrub: true,
});

gsap.utils.toArray(".stack .card").forEach((card, i) => {
  gsap.from(card, {
    yPercent: 100, opacity: 0.2, scale: 0.8,   // start small + dim (taste-skill §5)
    scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true },
  });
});
```

Cards start at `scale: 0.8` and grow to `1.0` in view; scrolling out, they darken and fade toward `opacity: 0.2` — the source's stated scale/fade values.

## Horizontal-Pan

Pin a title on the left while a track pans horizontally on the right as the user scrolls vertically.

```js
const track = document.querySelector(".pan-track");

gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".pan",
    start: "top top",        // same fix: pin exactly at the top
    end: () => "+=" + (track.scrollWidth - window.innerWidth),
    pin: true,
    scrub: true,
  },
});
```

## Scrubbing text reveal

Central paragraph words start near-invisible (`opacity: 0.1`) and scrub to full `opacity: 1.0` sequentially as the user scrolls through the block — the source's stated values.

## Hover physics on scroll cards

Every clickable card and image reacts, kept CSS-side so it survives scroll jank:

```css
.card { overflow: hidden; }
.card img { transition: transform 700ms var(--ease-out); }  /* duration-700, taste-skill §5 */
.card:hover img { transform: scale(1.05); }
```

Gate this hover behind `@media (hover: hover) and (pointer: fine)` (see [[motion-physics]]) and honor reduced motion via [[reduced-motion]] — disable pin/scrub and parallax, keep opacity reveals.
