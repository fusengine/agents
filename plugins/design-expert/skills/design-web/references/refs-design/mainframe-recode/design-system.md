# Mainframe — Design System

Register: **brand** — a public launch page whose job is conversion (two Get started
buttons, two plans, no application chrome). It is worth reading because it argues in
the `product` register: no display type, no accent, no proof section, no persuasion
device. Scope: FULL (single page, header to footer).
Design Read: launch page for a tool that turns agent runs into videos a team can watch;
vibe = flat, achromatic, understated, everything shown rather than claimed;
constraints = static HTML/CSS/JS, all media remote, forced dark, desktop + mobile.
Dials: `DESIGN_VARIANCE 5` · `VISUAL_DENSITY 4` · `MOTION_INTENSITY 6`.

Tone (one extreme): **release-note flat.** Every visible string is one short declarative
sentence, and three blocks are a possessive noun phrase with a five-word gloss under it
(Your avatar / A persona for your agent). The copy never promises, never quantifies,
never asks a question: no exclamation, no urgency, no metric, no adjective of scale, no
em dash in any visible string [relevé].

Signature element: **the 10px frame with an inset hairline.** One radius runs the whole
page (`--rayon: .625rem` [relevé]) and every media surface is that rectangle with
`inset 0 0 0 1px rgb(255 255 255 / 0.08)` drawn inside it instead of a border, so the
line never eats a pixel of image. It is the carousel panel, the showcase frame, the
brand-rail card, the attribute card, the pricing card. The only shape that escapes it is
the primary button, a pill. Second-order signature: the two halos — one image used
twice, cut by opposite vertical alpha masks [relevé] — the only colour not inside a frame.

Macrostructure: **Shrinking Aperture.** Order relevé on `index.html`:

- `.halo--haut` — decor, absolutely positioned behind everything, 140vh
- `header.entete` — brand plus three nav entries, the first an icon only; **not sticky**,
  it scrolls away and never returns
- `section.hero` — h1, subtitle, a row of four 24px icons, two actions; then `.carrousel`,
  a full-window track of five panels that select nothing (an appearance, not a state)
- `section.section` — three blocks under one 56rem ceiling: the bordered card trio; the
  showcase (sticky accordion contents plus a stack of 52rem frames overflowing their
  column, shipped as two complete trees with one hidden per media query); the attribute
  duo (discs card, waveform card) plus the wide brand card and its rail
- `section.section--espacee` — pricing, two plans, order reversed below 640px
- `.zone-basse` — `.halo--bas`, then `section.cloture` (a 180px object, a heading, one
  button) and `footer.pied`, a single row of five links

Absent from the canonical skeleton: **testimonials in any form** — no quote, no logo
wall, no customer name, no metric; **FAQ**; comparison table; newsletter; footer columns;
sticky nav; burger. Present but mutated: features exist three times over, in three
different geometries, so the page has no single features block; the CTA band is the
closing section and repeats the hero's exact button.

Principle: the order is set by **decreasing display surface**, not by argument — 100vw
carousel, then 52rem frames, then 16rem cards, then 400px rail cards, then pricing with
no media at all, then a 180px object — and the type never re-amplifies to compensate.

## Design Reference

Source: https://mainframe.app (Next.js, compiled Tailwind v4 sheet).

The palette is sampled from nothing. The interface is strictly achromatic and every hue
on the page arrives inside a frame: the halo wallpaper, the five carousel tint fills, the
pricing background, the waveform.

### Colors

```css
--fond-page:          #000;
--fond-surface:       #ffffff14;
--fond-champ:         #ffffff1a;
--fond-inverse:       #fff;
--fond-flottant:      #0a0a0ab3;
--texte-primaire:     #fff;
--texte-secondaire:   #ffffffa3;
--texte-tertiaire:    #fff6;
--texte-sur-inverse:  rgb(0 0 0 / 0.8);
--trait:              #ffffff1f;
--trait-interne:      rgb(255 255 255 / 0.08);
--trait-interne-fort: rgb(255 255 255 / 0.2);
```

Strategy: **achromatic, opacity-built.** There is no accent colour anywhere in the
interface. Three white opacities build every surface and every line — 8% for surfaces and
inner rims, 12% for borders, 20% for the rim of the one featured element — and the page
background is pure `#000`, not the theme's `#0a0a0a`.

Contrast floors: primary 21:1, secondary `#ffffffa3` ≈8.3:1 [estimé]. `--texte-tertiaire`
`#fff6` ≈3.7:1 [estimé] carries icons, the price unit and the footer link row: below the
4.5:1 floor, recorded as found rather than corrected. The focus ring is the one place the
rebuild departs from the source, whose `rgb(115 115 115 / 0.2)` is invisible on black.

### Typography

Inter, and nothing else. The source loads it from `rsms.me`; this page pulls the same
family from the Google Fonts CDN [relevé, `index.html` head]. Custom scale on a 15px base,
not 16: 15/17/20/24/28 with line-heights 20/20/24/28/32. Weights: 700 for the two large
headings only, 600 for card titles and tabs, 500 for nav, buttons and prices, 400 for the
rest. `text-wrap: balance` on the hero heading and subheading. Measure: 36rem text block
inside a 56rem content ceiling.

Never used: a second family, a serif or mono face, any `letter-spacing`, any responsive
type step. The h1 is 28px from 390 to 1440, and the closing heading (24px) is *smaller*
than it. The page never re-amplifies.

### Spacing

Increments of 4px used almost exclusively at 8px multiples: 4 / 8 / 12 / 16 / 24 / 32 /
48 / 64, a 112px section bottom inset, a **single** inter-block gap of 128px, a 72px
header, and a 24px side margin identical on mobile and desktop [relevé]. Off-grid values
are all in px and belong to components (36px button height, 18px inline padding, the
76/106/124/302px disc geometry).

Density profile: low, with one gap value repeated so page length comes from what a block
contains, never from padding. Six blocks over 5,752px at 1440 [relevé]: this is a page
short in *section count*, not in scroll — the showcase alone carries about 40% of it,
while pricing, closing and footer share the last fifth.

### Motion

`MOTION_INTENSITY 6` — total coverage, minimal amplitude. Nothing here is *played*: two
`@keyframes` ship with the framework and neither is applied [relevé]; all 75 transition
occurrences are a move between two states.

Durations fall into two regimes with a deliberate hole between them: **response** at
150/200ms when the user acted, **reveal** at 400/800/850/1000ms when nothing was clicked.
No value sits between 200 and 400 [relevé]. Three curves: `cubic-bezier(0, 0, .2, 1)` ×14,
`cubic-bezier(.23, 1, .32, 1)` ×10 reserved for media layers that appear, and the implicit
`cubic-bezier(.4, 0, .2, 1)`. No bounce, no elastic, no overshoot. Materials: `opacity`,
`filter: blur()`, `transform` capped at 8px of translateY, `scale`, `background-color`,
`saturate()`.

Entrances are distinguished by their **starting blur**, not by their distance: 8px blur at
1000ms (fade), 4px blur plus an 8px rise at 850ms, 4px blur on the reveal curve (media).
There is no blanket `opacity 0 + translateY(20px)` rule anywhere.

Hover subtracts instead of adding: nav links and the primary button label drop to 70%
opacity and never change colour. Two exceptions, both named: the 48px play pill is the
only element that grows (`scale(1.05)`), and the flagship pricing card is the only rich
hover (`saturate(.4)→1.2`, `scale(1.2)→1`, 800ms) — the only place hover *adds* intensity.
`will-change` always names the exact transitioning properties, never `auto`.

`prefers-reduced-motion: reduce` neutralises the **resting states**, not just the
durations: a resting `opacity: 0` left in place would keep the page blank. And `motion.js`
paces nothing — it toggles a class or writes a height in pixels; every duration and curve
lives in CSS.

## Absolute bans observed

No `@keyframes`. No accent colour in the interface — every hue arrives inside an image.
No section background at all: everything is transparent over black [relevé]. No gradient
text. No second typeface. No `letter-spacing`. No border on any media, an inner rim
instead. No elevation shadow (the one non-rim `box-shadow` is `0 2px 4px #00000005`, 2%
black). No glassmorphism outside the play pill. No sticky header, no burger, no dropdown,
no modal. No testimonial, no logo wall, no metric, no FAQ, no comparison table. No
responsive type step.
