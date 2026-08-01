# Sylva AI — Design System

Register: **brand** — a public launch page for an AI assistant whose job is conversion
(two identical CTA pairs, three plans, a FAQ, a logo wall). It is worth reading because it
is a **reproduction**: the macrostructure, the grids, the type scale and the component
states are lifted from a live production page; only the name, the palette, the photographs
and the strings are this page's own. Scope: FULL (single page, header to footer).
Design Read: landing page for an assistant that writes, codes, researches and holds focus;
vibe = dark, dense, mono-labelled, everything demonstrated in a fake UI rather than claimed;
constraints = static HTML/CSS/JS, media LOCAL to the folder, forced dark, desktop + mobile.
Dials: `DESIGN_VARIANCE 4` · `VISUAL_DENSITY 8` · `MOTION_INTENSITY 5`.

Tone (one extreme): **understated to the point of quiet.** Every heading is split in two
colours mid-sentence and the second half is always the softer one, so the page never
finishes a claim at full contrast. No exclamation, no metric, no urgency, no superlative,
no em dash in any visible string [relevé on the rebuild; the source uses six].

Signature element: **the 4px rectangle and the fake interface inside it.** One radius runs
the whole page (`--rayon: 4px` [relevé on the source: 69 × `rounded-sm`]) and every media
surface is that rectangle: a photograph darkened to `brightness(.55)`, a gradient over it,
and a **chat panel, a chip chain or a composer drawn in HTML/CSS** floating on top. Not one
of those interface fragments is an image. The only shapes that escape the 4px rule are the
avatar disc, the send pill, the toggle and the accordion sign, all `border-radius: 50%`
or `999px`.

Macrostructure: **Demonstrate, then enumerate, then price.** Order relevé on the source's
DOM (10 `<section>`, `grep -oE '<section[^>]*>' mosa.html | wc -l` → 10):

- `header.entete` — brand, a **segmented nav pill** (four links inside one bordered box),
  Signup + LOGIN; fixed, transparent, opaque past 24px of scroll
- `section.heros` — `100svh` photograph, h1 and subtitle bottom-left, a **backers strip**
  bottom-right on the same baseline
- `section#apercu` — eyebrow, split h2, **three cards**: a 4:3 scene, a mono title, a body
- `section#usages` — eyebrow, split h2, **four tabs**, then a 1:1 scene beside a label,
  a 24px heading and one button; the tab switch swaps the whole pair
- `section#etapes` — eyebrow, split h2, a scene beside **three steps on a hairline rail**,
  the active one lit by scroll position
- `section#benefices` — eyebrow, split h2, **six bordered cards**, disc icon, mono title
- `section#temoignages` — eyebrow, split h2, a **full-bleed snap rail** of six quote cards
  with prev/next discs
- `section#partenaires` — one bordered box divided into **ten logo cells**, no heading
- `section#tarifs` — eyebrow, split h2, a monthly/yearly switch, **three plans**
- `section#faq` — heading column beside **seven accordions**, one open at a time
- `section.section--cloture` — a rounded image band, centred, repeating the hero's buttons
- `footer.pied` — a brand column plus **four link columns**, then a status bar

Absent from the canonical skeleton: **no numbered feature rows**, no comparison table, no
video, no stats band, no team section, no blog teaser. Present but mutated: features exist
**three times over** — as three scenes, as six cards, as three steps — so the page has no
single features block; the CTA band is the closing section and repeats the hero verbatim.

Principle: the page **shows the product before naming a benefit.** Three of the first four
blocks are a fake interface; the first sentence that promises anything arrives 2,600px in.

## Design Reference

Source: https://mosa-ai.nextjsshop-preview.workers.dev (Next.js, compiled Tailwind v4 sheet,
Geist + Geist Mono). The layout, the grids, the type scale, the spacing rhythm and the
component states are reproduced. **The palette is not**: the source is `#000` plus a blue-grey
haze; this page is forest green plus brass, imposed by the brief and applied to every token.

### Colors

```css
--fond-page:      #050a07;
--surface-basse:  rgba(210, 232, 214, 0.02);
--surface:        rgba(210, 232, 214, 0.04);
--surface-haute:  rgba(210, 232, 214, 0.07);
--trait-faible:   rgba(198, 222, 203, 0.10);
--trait:          rgba(198, 222, 203, 0.15);
--trait-fort:     rgba(198, 222, 203, 0.28);
--texte:          #f2f7f0;
--texte-2:        rgba(232, 241, 229, 0.72);
--texte-3:        rgba(232, 241, 229, 0.54);
--texte-4:        rgba(232, 241, 229, 0.40);
--laiton:         #c9a227;
--laiton-clair:   #e7cb74;
--laiton-sourd:   rgba(201, 162, 39, 0.16);
--laiton-trait:   rgba(201, 162, 39, 0.42);
--vert-mousse:    #14251a;
```

Strategy: **one hue for structure, one for intent.** Every surface and every line is a
green-tinted white at four opacities (2 / 4 / 7% for surfaces, 10 / 15 / 28% for lines) —
the exact opacity ladder relevé on the source, retinted. Brass never builds a surface: it
marks the active tab, the step rail, the check discs, the featured plan, the focus ring
and the primary button, and nothing else.

Contrast floors: primary `#f2f7f0` on `#050a07` ≈ 17.6:1 [estimé]. `--texte-2` ≈ 10.5:1,
`--texte-3` ≈ 6.2:1, both above 4.5. `--texte-4` ≈ 3.9:1 [estimé] carries only ranks,
placeholders and inactive tabs. Brass `#c9a227` on the page ≈ 8.4:1; the primary button
inverts it, `#0a1109` on brass ≈ 8.1:1.

### Typography

Geist and Geist Mono, the source's two families, kept. **Mono carries every label**: eyebrows,
card titles, step titles, plan names, buttons, footer column heads, the brand word — sans
carries only headings and body. Scale relevé, verbatim from the source's arbitrary values:
h1 42 → 48 → 56 → 64, h2 28 → 36 → 42 → 44, closing h2 32 → 42 → 52 → 60, use-case h3
20 → 22 → 24, step h3 18, benefit h3 15, card h3 17, footer h3 11. Weights: 400 on every
large heading (never 700), 500 on card titles and buttons, 600 on mono titles and the plan
names. Line-heights 1.05 / 1.15 / 1.35 / 1.6, tracking `-0.02em` on headings and `+0.01em`
to `+0.1em` on mono labels.

Never used: a third family, a serif, an italic, a gradient fill, an uppercase heading. The
one deliberate departure from the source: its 10-13px micro-labels are floored at **14px
below 640px** and only restored to 11-13px above it.

### Spacing

Section rhythm 64 / 80 / 96px by breakpoint, with two exceptions kept from the source: the
logo wall at 48 / 56 / 72 and the closing band at 64-88 / 80-96 / 96-112. Container
`1380px` with a 24px gutter that becomes 32 at 1024 — nav and content share it, value for
value. Grid gaps 12 / 16 / 24 / 32 / 48 / 64.

Density profile: **high**. Ten sections, 44 cards or cells, six fake interface panels; the
page length comes from what the blocks contain, and no block is padded to fill.

### Motion

`MOTION_INTENSITY 5` — everything moves a little, nothing performs. Zero `@keyframes`.
Durations are the source's three: **200ms** when the user acted, **300ms** for a state that
settles, **700ms** for a reveal nobody asked for. Two curves: `cubic-bezier(.16, 1, .3, 1)`
for anything travelling, `cubic-bezier(0, 0, .2, 1)` for colour. No bounce, no overshoot.

Materials: `opacity`, `transform: translateY(14px)`, `scaleX` on the tab underline,
`background-color`, `border-color`, `backdrop-filter`. The reveal is a 14px rise at 700ms
with a 60ms stagger inside a group, capped at six steps.

`prefers-reduced-motion: reduce` is read **before the resting state is written**: the
`opacity: 0` lives under a `.js-mouvement` class that JS adds only when motion is allowed,
so a failed script or a reduced-motion user gets a fully visible page. `motion.js` paces
nothing; every duration and curve is in CSS.

### Components

Two button variants and no third. Six fake interfaces, all HTML and CSS, zero `<svg>` and
zero screenshot: a chip chain, two chat panels, a suggestion stack, a composer, a set of
monogram discs. Native `<details>` for the FAQ, so the page answers a question with JS
disabled. A `role="tablist"` with roving `tabindex` and arrow navigation, four real panels
behind it. A snap rail whose two buttons scroll by one measured card width and disable
themselves at each end. A `role="switch"` that rewrites prices from `data-*` attributes on
the elements themselves.

## Absolute bans observed

No `@keyframes`. No gradient text. No third typeface. No uppercase heading. No shadow used
as elevation. No glassmorphism outside the six fake panels, where it is the point. No
theme flip: one dark lock end to end. No image behind body text without a gradient veil.
No `<svg>` standing in for a photograph. No marquee. No carousel that auto-plays. No modal,
no dropdown, no toast. No em dash in any visible string. No text rendered under 14px at
360px, labels and captions included.
