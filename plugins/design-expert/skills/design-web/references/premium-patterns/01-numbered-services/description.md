---
name: Numbered Services
device: Bracketed index rows with hover image reveal
source: https://crevo-wbs.framer.website
seen-in: Agency
---

## Numbered Services — indexed rows, image revealed on hover

> `source:` is provenance — where the device was measured. Not a site to browse
> for taste; `../../design-inspiration.md` owns that ban. Read the values here.

### The device

One section: a vertical stack of rows, each carrying a bracketed zero-padded
index, a title, and a right-pushed description. The row is the whole card — no
box, no shadow, only a hairline separator. Hovering a row tints it and fades a
photograph in from the right edge. The images exist only on hover, so the
section reads as a quiet text list until the reader engages with it.

Progressive disclosure is the point: the index gives the list a spine, the
reveal gives it depth without spending vertical space on a photo grid.

### CSS (measured)

```css
.row {
  display: flex; align-items: center; gap: 32px;
  padding: 28px 0;
  border-bottom: 1px solid oklch(0.22 0 0);
  cursor: pointer;
  transition: background 0.3s ease;
}
.row:hover { background: oklch(0.13 0 0); }

.row__index { font-family: ui-monospace, monospace;
  font-size: 0.8125rem; letter-spacing: 0.06em; color: oklch(0.42 0 0); }
.row__title { font-size: clamp(1.25rem, 2vw, 1.75rem); font-weight: 500;
  letter-spacing: -0.01em; color: oklch(0.95 0 0); }
.row__desc  { margin-left: auto; max-width: 320px;
  font-size: 0.875rem; line-height: 1.6; color: oklch(0.42 0 0); }

.row__img {
  position: absolute; right: 40px; top: 50%;
  width: 260px; height: 180px; border-radius: 6px; object-fit: cover;
  opacity: 0; transform: translateY(-50%) translateX(0);
  transition: opacity 0.4s ease, transform 0.4s ease;
  pointer-events: none;
}
.row:hover .row__img { opacity: 1; transform: translateY(-50%) translateX(-20px); }
```

Row container needs `position: relative`. The measured source ran this on a dark
surface (`oklch(0.10 0 0)`, text `0.95` / `0.42`), which is why the hairline sits
at `0.22`; on a light surface use the equivalent low-contrast separator instead
of these literal values.

### Conditions of use

- 4 to 6 rows. Under 4 the index reads as decoration; over 6 the hover reveal
  becomes a slot machine and an accordion (10) or tabs (09) serve better.
- Requires one real photograph per row. No photograph, no device — do not ship
  the reveal with a placeholder or a duplicate image.
- Touch: disable the reveal below the hover breakpoint and let the rows stand as
  a list. Do not substitute an always-visible thumbnail column — that is a
  different, denser layout.
- The index must number something the reader can count (services, steps, cases).
  Numbering three unrelated value props is decoration.

### Anti-patterns

- Do not show the images by default — the reveal is the whole device.
- Do not wrap the rows in cards with shadows; the hairline separator is the
  separation.
- Do not center the rows — left-aligned title with the description pushed right
  is what creates the horizontal tension the reveal lands in.
- Do not let the reveal image overlap the title at narrow widths; clip it or
  drop it.
- Do not pair this with another row-list disclosure elsewhere on the page —
  `../../layout-discipline.md` §5, one layout family per page.

### Optional section prompt (this section only)

Build ONE services section: a vertical stack of 4-6 rows on the page's existing
surface. Each row is `display:flex; align-items:center; gap:32px; padding:28px 0;
border-bottom:1px solid` a hairline in the surface's own scale. Left: bracketed
zero-padded index in monospace 0.8125rem, letter-spacing 0.06em, muted. Then the
title at `clamp(1.25rem, 2vw, 1.75rem)` weight 500, tracking -0.01em. Then a
0.875rem/1.6 muted description with `margin-left:auto; max-width:320px`. On row
hover, tint the row background and fade in a 260x180px `object-fit:cover` image,
6px radius, absolutely positioned at `right:40px; top:50%`, from
`opacity:0 translateX(0)` to `opacity:1 translateX(-20px)` over 0.4s ease.
Nothing else — no nav, no hero, no adjacent sections.
