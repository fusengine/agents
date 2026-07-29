---
name: Accordion and Snap Carousel
device: Single-open accordion with a rotating plus; horizontal snap carousel with a peeking card
source: https://b2bizz-wbs.framer.website
seen-in: B2B
---

## Accordion and Snap Carousel — two independent section devices

> `source:` is provenance — where the device was measured. Not a site to browse
> for taste; `../../design-inspiration.md` owns that ban. Read the values here.

This folder carries **two** devices because the measured source used both. They
are independent: take one, or the other. Using both on the same page puts two
progressive-disclosure families next to each other, which
`../../layout-discipline.md` §5 rules out — if you want both, they belong on
different pages.

---

## Device A — single-open accordion, rotating plus

### What it is

A list where each row expands one at a time. The affordance is a circular `+`
that rotates 45 degrees into an `x` and fills with the accent as the row opens;
the body slides via an animated `max-height`. Single-open behaviour keeps the
section's height predictable so the page below never jumps unpredictably.

### CSS (measured)

```css
.acc__item    { border-bottom: 1px solid oklch(0.2 0.01 70); }
.acc__trigger { display: flex; justify-content: space-between; align-items: center;
                width: 100%; padding: 24px 0;
                font-size: 1.1875rem; font-weight: 600; }
.acc__icon    { width: 28px; height: 28px; border-radius: 50%;
                border: 1px solid oklch(0.3 0.01 70);
                display: grid; place-items: center;
                transition: transform 0.35s ease, background 0.35s ease,
                            border-color 0.35s ease, color 0.35s ease; }
.acc__item[open] .acc__icon { transform: rotate(45deg);
                background: oklch(0.75 0.1 70); border-color: oklch(0.75 0.1 70);
                color: oklch(0.1 0 0); }
.acc__body    { max-height: 0; overflow: hidden;
                transition: max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1); }
.acc__item[open] .acc__body { max-height: 180px; }
.acc__body p  { font-size: 0.9375rem; line-height: 1.7; max-width: 600px; }

@media (prefers-reduced-motion: reduce) {
  .acc__icon, .acc__body { transition: none; }
}
```

Container `max-width: 800px`. The `180px` open height is a measured value for
that copy length — set it from the real content, or use
`interpolate-size: allow-keywords` with `max-height: max-content` where support
allows, since a too-small `max-height` silently clips text.

### Conditions of use

- 4 to 8 items. Under 4, the disclosure costs more than it saves.
- Every answer must be shorter than the `max-height`. Verify with real copy, not
  lorem.
- Use `<details>`/`<summary>` or a button with `aria-expanded` and
  `aria-controls`. A `div` with a click handler is not this device.
- Single-open is a decision, not a default: it suits a section where the reader
  compares one item at a time. For scanning, allow multiple.
- Content behind an accordion is content most readers will not read. Do not hide
  the section's actual argument in it.

### Anti-patterns

- Do not allow multiple items open if the layout below depends on a stable
  height.
- Do not animate `height: auto` — it does not animate; that is why `max-height`
  is here.
- Do not use a chevron and a plus on the same page; one disclosure glyph.
- Do not omit the `prefers-reduced-motion` escape.

---

## Device B — horizontal snap carousel, peeking card

### What it is

A row of fixed-width cards scrolling horizontally with mandatory scroll-snap.
The card width is deliberately set so the next card is partly visible at rest —
that peek is the entire affordance, and it is why the scrollbar can stay thin
instead of being replaced by arrow buttons.

### CSS (measured)

```css
.carousel {
  display: flex; gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 48px 0 24px;
  scrollbar-width: thin;
}
.carousel::-webkit-scrollbar       { height: 4px; }
.carousel::-webkit-scrollbar-thumb { background: oklch(0.3 0.01 70);
                                     border-radius: 2px; }
.carousel__card {
  flex: 0 0 340px;
  scroll-snap-align: start;
  border-radius: 16px;
  background: oklch(0.14 0.01 70);
  border: 1px solid oklch(0.2 0.01 70);
  transition: border-color 0.3s ease;
}
.carousel__card:hover  { border-color: oklch(0.35 0.01 70); }
.carousel__card img    { aspect-ratio: 16 / 10; object-fit: cover; }
.carousel__card .body  { padding: 20px 24px; }
```

Responsive: 280px cards below 768px — narrow enough that the peek survives on a
360px viewport.

### Conditions of use

- Card width must leave the next card visibly cut at the container edge. If the
  cards happen to fill the width exactly, the section reads as a static grid
  that mysteriously scrolls.
- Keyboard and screen readers reach horizontally scrolled content poorly: the
  container needs `tabindex="0"` and an accessible name, and each card's link
  must be reachable in tab order.
- Do not use it for content the page argues with. It suits parallel, equivalent
  items (cases, articles, logos) where order does not matter.
- 5 or more cards. With 3, a grid is better and needs no interaction.

### Anti-patterns

- Do not hide the scrollbar — the thin styled bar is discoverability.
- Do not exceed ~340px card width at desktop; the peek disappears.
- Do not auto-advance the scroll. An auto-playing carousel is a motion violation
  and a usability one.
- Do not nest a vertical accordion inside a carousel card.

### Optional section prompt (pick ONE device, this section only)

**A.** Build ONE accordion section, `max-width: 800px`, 4-8 items, each a
`<details>` with a `border-bottom` hairline. Trigger: `display: flex;
justify-content: space-between; padding: 24px 0`, title 1.1875rem weight 600,
plus a 28px circular `+` with a 1px border. On open, rotate the icon 45deg and
fill it with the accent over 0.35s; slide the body with
`max-height: 0 → <real content height>` over 0.45s
`cubic-bezier(0.4, 0, 0.2, 1)`. Single-open. Disable transitions under
`prefers-reduced-motion`.

**B.** Build ONE horizontal carousel section: `display: flex; gap: 20px;
overflow-x: auto; scroll-snap-type: x mandatory`, cards `flex: 0 0 340px`
(280px under 768px) with `scroll-snap-align: start`, 16px radius, 1px border, a
16:10 cover image and a 20px 24px body. Thin 4px styled scrollbar, visible. The
next card must peek at rest. `tabindex="0"` and an accessible name on the
container. No auto-advance.

Emit one of these, and nothing outside its section.
