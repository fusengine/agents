# Umbrel — Design System

Register: **brand**. Hardware and an operating system are on sale, but nothing on
the page is a spec table: the product is shown as an object under studio light and
the design carries the argument. Scope: FULL (single-page marketing site).
Design Read: a home server sold as ownership of your own data; vibe = pure-black
product theatre, aluminium and walnut, one warm word per screen; constraints =
static HTML/CSS/JS, Inter from Google Fonts, imagery served from the Framer CDN,
desktop + mobile.
Dials: `DESIGN_VARIANCE 5` · `VISUAL_DENSITY 6` · `MOTION_INTENSITY 4`.

Tone (one extreme): **imperative and unexplained.** "Stop renting your digital
life. And start owning it." "Don't trust. Verify." Sentences are short, prices
are stated bare with no framing ("From $699 Shipping now."), and the page never
defines what a home server is — it assumes you already want one. The copy never
uses a testimonial voice, never names a customer or a persona, never quotes a
figure of adoption, and never asks a question except as a section eyebrow.

Signature element: **the descending gradient used as relief.** Nothing on this
page is an opaque fill and nothing is lifted by a shadow: a short vertical
gradient, light at the top and dark at the bottom, does the whole job. It fills
both buttons, fills the support cards (body in `padding-box`, hairline in
`border-box`, on a transparent border), fills the carousel card rings, fills the
headings themselves (`#fff` to white 80 % bottom-to-top, clipped to the text),
and becomes the App Store's two indigo grid lines fading out in opposite
directions. Learn that one recipe and the rest of the page follows.

Macrostructure: **Solo–Duet Cadence, Store Pivot.** The page alternates two modes.
A *solo* band gives one object the full width; a *duet* section splits into two
parallel tracks that never merge. Order [relevé] on `index.html`, read on content
because the classes repeat: fixed nav pill → hero band, centred, one line of
title and three usage proofs (solo) → Umbrel Pro band, full-bleed photo with the
text set left and a 160px gradient joint dissolving into black (solo) → duo,
Umbrel Home against umbrelOS, each column carrying its own nested 2×2 spec grid
so the section reads as two parallel arguments rather than one stack (duet) →
Files band, a single wide card backed by a photograph (solo) → superpowers,
eyebrow plus a gradient-filled word over a horizontal snap rail of five saturated
cards (duet, in the sense that the rail always shows a neighbour) → App Store,
the pivot: a photographic glow, two 1px indigo grid lines, a centred collage,
then two marquees running in opposite directions (solo and duet at once) →
support cards, a deliberately asymmetric 349/211/349 grid where the fourth cell
is a newsletter form (duet) → footer, social row against link row.
Absent from the canon: **testimonials**, **the pricing section**, **the FAQ** and
**the closing CTA band**. Pricing is dissolved into the two product bands as a
single bare line each; the CTA's job is done by the last card of the support grid.
There is also no feature grid in the usual sense — each spec tile *is* a render
that already contains its own engraved title, so no text is ever overlaid.
Organising principle: the order follows what you can buy first and how far it
reaches — the machine, then the OS that runs on it, then one app, then what the
apps let you do, then the store they come from, then the people around it. Each
band is one circle wider than the object in your hand.

## Design Reference

Source: https://umbrel.com — homepage, measured on a full DOM capture and
cross-checked against the live render at 1440px and 390px.

The palette comes from the product photography and the app icons, not from a
colour system: the warm accent is the walnut of the Umbrel Pro shell, the cold
accent is the OS's own action colour, and the five carousel cards keep the
saturated tints of the apps they advertise.

### Colors

```css
--surface-page:      #000;
--surface-profonde:  #131415;
--surface-elevee:    #222426;
--surface-carte:     rgba(255,255,255,.035);
--surface-verre:     rgba(18,18,20,.72);
--filet:             rgba(255,255,255,.09);
--filet-fort:        rgba(255,255,255,.16);
--texte-primaire:    #fff;
--texte-secondaire:  rgba(255,255,255,.62);
--texte-tertiaire:   #ababab;
--texte-eyebrow:     #e0e0e0;
--texte-inverse:     #1d1d1f;
--accent-chaud:      #e3a081;
--accent-froid:      #5351ea;
--accent-electrique: #1c1aff;
--accent-signal:     #e9c341;
--accent-bois:       #bd9366;
```

Strategy: **pure black ground, alpha veils, four accents with one role each.**
The black is `#000` and not a dark grey — that is what makes the edges of the
full-bleed product photographs disappear. Cards are not fills but very faint white
veils doubled by a hairline at 9 %. The accents are never interchangeable: warm
for the pivot word of the h1 and nothing else, cold for the primary action,
electric for the superpowers gradient word, signal for the NEW pill.

Contrast floors held [estimé] on `#000`: white 21:1, secondary white 62 % ≈ 7.8:1,
tertiary `#ababab` ≈ 9:1, warm accent ≈ 9.6:1. The lowest text value on the page
is the carousel paragraph at `opacity:.8`, which sits on a saturated card rather
than on black; the app pill carries a faint white text-shadow for the same reason.

### Typography

```css
--police: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

One family, loaded from the Google Fonts CDN at 500/600/700. The source runs Inter
Display on headings and Inter Variable on labels [relevé]; Inter alone covers both.
The scale is explicitly **not** modular — 48 / 43 / 32 / 27 / 24 / 20 / 18 / 14 /
13 / 12, whose measured ratios are 1.12 · 1.59 · 1.13 · 1.20 · 1.11 · 1.29 · 1.08:
two tight clusters (display ≈1.12, interface ≈1.08) separated by two hard jumps.
It is hand-tuned, and replacing it with a single ratio breaks it. Two weights
only, 500 for anything read and 600 for anything that titles; 700 appears twice
in the whole source and is kept only on the NEW pill. Tracking graded by size:
−.03em display, −.02em product name, −.01em UI. Line-heights are written as
percentages: 110 % lead, 120 % titles, 124 % eyebrows, 130 % body. Measure is
capped at 46ch on cards, 52ch on the store deck, and hard-set at 326px inside the
carousel card — that width is what dictates the line breaks and therefore the
card's rhythm.

Never used: a serif, a mono, a second family, or any weight below 500.

### Spacing

The step is **10, not 8** [relevé]: paddings run 60 / 50 / 40 / 30 / 20 / 10 in
that order of frequency, and only the micro gaps (4, 8, 12, 14, 25, 26) leave that
rhythm. Containers: 960px for running text, 1044px for the photo bands, full bleed
for photography and marquees; 20px gutter on mobile. Radii: 24 large cards, 22
medium, 12 thumbnails, 99 pills.
Density profile: deliberately tight. Section stack is 60px at desktop, raised to
90px then 70px at the two breakpoints — a value worth noting as found, since it
inverts the usual direction. The source page is roughly 5500px tall at 1440 for
ten sections; an earlier reconstruction at 7300px read as a different site with
the same content. Vertical density here is a style trait, not a neutral setting.

### Motion

`MOTION_INTENSITY 4`. Materials are `opacity` and `transform` only for entrances,
in three named variants — rise 20px, descend −20px, zoom 1.06 — plus two CSS
keyframe marquees, one native `scroll-snap` rail, and `mask-image` fades at both
ends of the rail and of each marquee. There is one 3D use in the page and it does
not animate: a `perspective: 1200px` scene holding the tablet and phone at fixed
`rotateX/rotateY`. Curves: `cubic-bezier(.44,0,.56,1)`, the only CSS transition the
source carries [relevé], for hovers at .3s; `cubic-bezier(.16,1,.3,1)` for the .7s
reveals. Hover is colour or `brightness(1.15)`, nothing moves.

What distinguishes the entrances is which variant a block carries and at what
granularity: the two duo columns reveal as wholes, but the eight spec tiles inside
them reveal individually, so the section fills in twice. The two marquees run at
46s and 54s in opposite directions, each writing its content exactly twice so the
`translateX(-50%)` loop has no seam, and both pause on hover and on focus.

`prefers-reduced-motion: reduce` is handled at the source: the script does not add
its `.js` class at all, so no element is ever hidden in the first place; the
marquees stop, the carousel scrolls with `behavior:auto`, and the side-card dimming
is removed.

## Absolute bans observed

No relief by drop shadow: the only two shadows in the stylesheet are an inset
highlight catching the top-left edge of the app pill and a separation shadow under
the tilted icon stack — no card, button, band or pill is ever lifted. No opaque
coloured border: every ring is a gradient painted in `border-box` behind a
transparent border. No section wash — the one tinted radial that was measured is
left declared and unapplied, because every section of this page sits on pure
black. No text overlaid on a spec tile. No identically repeating card grid: the
support grid alternates 585/349 then 349/585 on purpose. No modal, no
testimonial, no pricing table, no cookie-style pill stack.
