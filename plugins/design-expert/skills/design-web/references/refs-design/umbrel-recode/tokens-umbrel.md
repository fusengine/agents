# Tokens — umbrel.com

A design reading of the `umbrel.com` homepage, measured on a full
DOM capture (`wget -p -k`, 804 KB) cross-checked against the site's actual render at
1440px and 390px.

**Two statuses, never mixed:**

| Status | Meaning |
|---|---|
| **relevé** | value read in the source or measured on the render |
| **estimé** | reconstructed value — the source doesn't carry it explicitly |

---

## 0. The six techniques to remember

A value without the technique that implements it teaches nothing. Here is
what, at Umbrel, produces the render — the rest of the document gives
the numbers.

### P1 — Almost no drop shadows. Descending gradients.

The relief comes from a **very short vertical gradient, light at the top,
dark at the bottom**, applied to both the background AND the hairline. A button, a card,
a pill: same recipe.

```css
/* primary button */   linear-gradient(#5351f3 0%, #312ee9 100%)
/* secondary button */ linear-gradient(#2e2e2e 0%, #191919 100%)
/* card body */         linear-gradient(#0a0a0a 0%, #0d0d0d36 100%)
/* card hairline */     linear-gradient(#303030 0%, #121212 100%)
```

The source's only `box-shadow` values are **inset**, and they light
the top and left like a metallic edge — never a shadow
cast under the element:

```css
inset .8px .8px .96px #ffffff29
inset 1.2px 0 #ffffff0a, inset -1.2px 0 #ffffff0a, inset 0 1.2px #ffffff1a, inset 0 .6px #ffffff1a
```

Only one drop shadow exists, and it's very low and very wide,
paired with an inset:
`inset .8px .8px .96px #ffffff29, 0 2px 38px #0000008a`. The vertical
offset (2px) is nearly nil for a 38px blur: this isn't
a relief shadow, it's a darkening of the background behind
the element.

### P2 — The hairline is a gradient, not a colored border

Two backgrounds on the same element: the body in `padding-box`, the hairline
in `border-box`, on a **transparent** border. No extra
element, no pseudo-element.

```css
.carte {
  border: 1px solid transparent;
  background:
    linear-gradient(#0a0a0a 0%, #0d0d0d36 100%) padding-box,
    linear-gradient(#303030 0%, #121212 100%)   border-box;
}
```

It's this lighter-at-the-top hairline that simulates a raking
light — where a `box-shadow` would have weighed down the page.

### P3 — Block backgrounds are radials anchored AT THE TOP

Never a flat fill, never a vertical linear. Always
`radial-gradient(… at 50% 0)` or `at 52.4614% 0`: a saturated start at
the top edge, dropping to a near-black that's **tinted** (never pure
`#000`) before the end. Light thus falls from the same point on every
block, which holds a series of cards together even with five
different hues.

```css
radial-gradient(200.828% 100% at 52.4614% 0, #006868 5.96336%, #01204fe0 51.5019%, #00001c 100%)
radial-gradient(131.767% 100% at 52.4614% 0, #212121 5.96336%, #000000e0 63.2584%, #000     100%)
radial-gradient(113.039% 100% at 50%      0, #181818 0%,       #191919    .01%,    #080808cf 100%)
radial-gradient(116.887% 100% at 50%      0, #8f0100 0%,       #400011    50%,     #05001a  100%)
radial-gradient(192.93%  100% at 50%      0, #d77700 0%,       #291a08 60.1135%,   #000808  100%)
radial-gradient( 94.423% 100% at 50%      0, #ec770a 0%,       #1b006a 100%)
```

Two others share a different geometry, anchored at the
**top-left** corner (`at 0 0`), and come in body + hairline pairs:

```css
radial-gradient(100% 147.839% at 0 0, #0657a1 0%, #051e22 36.2271%, #031d3cf7 72.4655%, #1e53a1ed 84.8958%, #355aa3 100%)
radial-gradient(100% 147.839% at 0 0, #969696 0%, #1c1c1c 36.2271%, #242424f7 72.4655%, #737373ed 84.8958%, #050505 100%)
```

The radii systematically exceed 100% (up to 200%): the
gradient is **bigger than its box**, only its core is visible.
This is what avoids the "bubble" effect of a cropped radial.

### P4 — A halo is a container + an image, not a gradient

The umbrelOS section's only chromatic contribution is neither a
`radial-gradient` nor a `box-shadow`: it's a **3099 × 3099 PNG image
placed at 8% opacity on pure black**. The exact mechanism
matters:

- **opacity is carried by the container**, never by the image;
- the container has a **fixed size** — three values, one per breakpoint:
  `938.82px` ≥ 1220 · `958.82px` 810→1219.98 · `957.82px` ≤ 809.98;
- the image fills it via `width:100%; height:100%; object-fit:cover`;
- it's served by a `srcset` at 4 tiers
  (`scale-down-to=512/1024/2048`, then native) with the `sizes`
  matching the three widths above.

Separating the framing (container) from the intensity (opacity) and the weight
(srcset) is what makes the halo tunable without redoing it.

And there's **no section background under this halo**: `body` is
`rgb(0,0,0)` and the section sets nothing. A halo at 8% on pure
black — that's it.

### P5 — Text is filled by a gradient, not colored

Three occurrences, three different intents:

```css
/* titles: very slightly hollows out the white */
linear-gradient(0deg, #fff 0%, rgba(255,255,255,.8) 100%)
/* the word "endless…": becomes transparent toward the RIGHT,
   so the repeated "s"s fade out — the word says what it shows */
linear-gradient(270deg, rgba(28,26,255,0) 15.4156%, rgb(28,26,255) 70.4955%)
/* "app store.": vertical radius of 1182%, so a horizontal
   band rather than a circle */
radial-gradient(100% 1182.8% at 100% 50%, rgb(191,88,202) 0%, rgb(94,92,255) 100%)
```

With `-webkit-background-clip: text; background-clip: text;
color: transparent`.

### P6 — What overflows is never cropped

Three deliberate overflows, all structural:

- the app icon is anchored to `top: 0` of the card's
  **wrapper**, not of the card: it overlaps its top edge;
- the screenshot is **438px in a 398px card**: it spills
  out on the right and touches the bottom;
- the carousel cards spill out on both sides of the viewport, and a
  fade (`mask-image`) extinguishes them into the page's black.

Overflow replaces shadow as the depth tool.

### P7 — A grid of 1px hairlines, not washes

The indigo `#2d2a89` in the App Store section isn't a background. These are
**1px-wide elements**, as tall as the entire section and
overflowing by 199px at the top and bottom, filled with a gradient that
fades out — one toward the bottom, the other toward the top:

```css
.filet { position:absolute; top:-199px; bottom:-199px; width:1px; }
.filet--descend { left:200px;  background: linear-gradient(#0000 0%, #2d2a89 100%); }
.filet--monte   { right:200px; background: linear-gradient(#2d2a89 0%, #0000 100%); }
```

A horizontal variant exists (`825 × 2px`, `bottom:28px`,
`left: calc(50% - 412.5px)`), and a vertical one at 70% opacity,
360px tall, centered. This is the page's most discreet and
most reusable decoration: **a construction grid made visible**,
where most sites would apply a colored wash.

### P8 — Frosted glass is a precise recipe

The app pill isn't "a semi-transparent background". It
combines four things, and removing any one makes it collapse:

```css
background-color: #00000080;                 /* black at 50%, not a gray */
backdrop-filter: blur(14.4px);               /* the blur makes the glass */
box-shadow: inset .8px .8px .96px #ffffff29; /* the top-left edge */
text-shadow: 0 0 24px #ffffff52;             /* halo under the text */
```

The `text-shadow` is what lets the pill sit on saturated
backgrounds without the word becoming illegible — it's the one
systematically forgotten.

---

## 1. What to know before reading the numbers

Three facts change how everything that follows should be read.

1. **No separate CSS sheet.** Everything fits in 3 inline `<style>` blocks,
   and most typographic values are set as **`style` attributes
   on the elements themselves**, via variables `--framer-font-size`,
   `--framer-font-weight`, `--framer-letter-spacing`, `--framer-line-height`.
   There are only **2 `.framer-styles-preset-*` classes** in the entire page,
   and they only carry link colors.

2. **The SSR render duplicates the responsive variants.** Every text block is
   written **three times** in the HTML — once per breakpoint — with `hidden-*`
   classes that hide two of them. This is what makes the responsive scale
   fully readable in the source, and it's also a large part of the
   804KB.

3. **Motion isn't in the CSS.** Zero `@keyframes`, zero `:hover`
   rule in the `<style>` blocks, even though 50 `:hover` references exist
   in the HTML. Only one CSS transition exists in the entire source. Everything
   else is driven by Framer's JS runtime.

---

## 2. Breakpoints

| Tier | Media query | status |
|---|---|---|
| Desktop | `min-width: 1220px` | **relevé** |
| Tablet | `min-width: 810px` and `max-width: 1219.98px` | **relevé** |
| Mobile | `max-width: 809.98px` | **relevé** |

The upper threshold really is **1220**, not 1200.

---

## 3. Type scale

Families: **Inter Display** (titles) and **Inter Variable** (labels) — relevé.
`Inter Tight` and `Manrope` also appear, but on third-party components
(support widget), not on the page itself.

Two weights carry 99% of the text: **500** (110 occurrences) and **600**
(88). **700** appears only **2 times** in the 804KB.

### 3.1 Measured tiers

| Role | Desktop | Tablet | Mobile | Weight | Tracking | Line-height | status |
|---|---|---|---|---|---|---|---|
| Hero title | **48** | **36** | **30** | 600 | −0.03em | 120% | **relevé** (3 tiers) |
| Product name (`h2`) | **43** | — | — | 600 | −0.02em | 120% | **relevé** (desktop) |
| Section / column title | **32** | — | **24** | 600 | −0.03em | 120% | **relevé** (see § 5.4) |
| Large card title | **27** | — | **23** | 600 | −0.03em | 120% | **relevé** |
| Block title / price | 24 | — | — | 600 | −0.03em | 110–120% | **relevé** |
| Lede | 20 | — | — | 500 | −0.03em | 110% | **relevé** |
| Body / eyebrow | **18** | — | **16** | 500 | −0.03em | 124–130% | **relevé** |
| Interface (nav, caption, button) | 14 | — | — | 500 | −0.01em | 130% | **relevé** |
| Fine print | 13 | — | — | 500 | −0.01em | 130% | **relevé** |
| Pill | 12 | — | — | 600–700 | −0.01em | — | **relevé** |

Sizes also present in the source, not assigned to a stable role:
21, 15, 12.96px — **relevé**.

The tablet/mobile tiers marked "—" aren't declared: the desktop
value applies to all three widths. **Relevé**: the scale only
recalculates where it would break.

### 3.2 There is no ratio

Measured ratios between successive tiers:

```
48/43 = 1,12   43/27 = 1,59   27/24 = 1,13   24/20 = 1,20
20/18 = 1,11   18/14 = 1,29   14/13 = 1,08
```

Two tight clusters — **display ≈ 1.12**, **interface ≈ 1.08** — separated
by two sharp jumps (1.59 then 1.29). This is a **hand-tuned** scale,
not a geometric progression. Reconstructing it with a single ratio
(1.25, 1.333, whatever it may be) destroys exactly what holds it together: the
distance between the "display" register and the "interface" register.

### 3.3 Tracking

Graduated by size, never uniform:

| Tracking | Where | Occurrences | status |
|---|---|---|---|
| −0.03em | display, lede, body | 141 | **relevé** |
| −0.02em | product name only | 48 | **relevé** |
| −0.01em | interface, captions | 71 | **relevé** |

### 3.4 Line-heights

| Value | Usage | Occurrences | status |
|---|---|---|---|
| 110% | lede, feature word | 17 | **relevé** |
| 120% | every title | 78 | **relevé** |
| 124% | eyebrows | 15 | **relevé** |
| 130% | paragraphs | 64 | **relevé** |

### 3.5 Line measure

| Block | Measure | status |
|---|---|---|
| Hero lede | ~71 ch on **a single line** | **relevé** (measured on the 1440 render) |
| Product-band paragraph | ~34 ch | **relevé** |
| Support-card body | ~46 ch | **estimé** (measured, not declared) |
| "Superpower" card body | ~40 ch | **estimé** |

The hero lede is a **deliberate outlier**: 71 characters held
on a single line. This isn't a reading measure, it's a graphic
gesture — it gives the hero its wide, low horizon line.

---

## 4. Colors

### 4.1 Declared tokens

Measured in the `body { --token-…: … }` block of the source.

| Value | Role | status |
|---|---|---|
| `#5351ea` | main accent — solid button, active link, hovered link. Declared **twice** under two distinct tokens | **relevé** |
| `#131415` | deep background | **relevé** |
| `#222426` | elevated surface | **relevé** |
| `#1d1d1f` | text on light background | **relevé** |
| `#f2f2f5` | light surface | **relevé** |
| `#242424` | link text on light background | **relevé** |
| `#848b96` / `#79797d` / `#797985` | three near-identical grays for secondary text | **relevé** |
| `#7cb572` / `#5f8258` | green (positive state) | **relevé** |
| `#bd9366` | wood — evokes the product's walnut finish | **relevé** |
| `#fff` | primary text | **relevé** |

### 4.2 Colors set inline, outside the tokens

These are the most interesting ones: they are **not** in the token
system, but they carry the identity.

| Value | Role | status |
|---|---|---|
| `rgb(227, 160, 129)` | **the `h1`'s pivot word** ("home."), and nothing else on the page | **relevé** |
| `rgba(255, 255, 255, .62)` | secondary text — transparent white, not a gray: it re-tints over a photo | **relevé** |
| `rgb(171, 171, 171)` | card body | **relevé** |
| `rgb(224, 224, 224)` | section eyebrow | **relevé** |
| `rgb(28, 26, 255)` | blue of the "endlessssssssss" gradient | **relevé** |

### 4.3 Page background

**Pure black `#000`** — relevé. Not a very dark gray. This is what lets
full-bleed product photos blend into the page with no visible edge.

### 4.4 Text-fill gradients

The page's most distinctive typographic trait: the titles aren't
a flat white, they're a gradient applied to the glyph.

| Gradient | Where | status |
|---|---|---|
| `linear-gradient(0deg, #fff 0%, rgba(255,255,255,.8) 100%)` | hero title | **relevé** |
| `linear-gradient(0deg, #fff 0%, rgba(255,255,255,.75) 100%)` | card titles | **relevé** |
| `linear-gradient(270deg, rgba(28,26,255,0) 0%, rgb(28,26,255) 36.7731%)` | word "endlessssssssss" — fades out toward the right, which *is* what makes the word's meaning | **relevé** |
| `radial-gradient(100% 1182.8% at 100% 50%, rgb(191,88,202) 0%, rgb(94,92,255) 100%)` | word "app store." — the 1182% vertical radius flattens the gradient into a horizontal band | **relevé** |

### 4.5 "Superpowers" cards

Five ring / interior pairs, all measured. The ring is a
**linear** gradient at −26°, the interior a **radial** gradient
anchored at the top center: light thus falls from the same point on all five
cards, which holds the series together despite five hues.

| Hue | Ring (2px) | Interior |
|---|---|---|
| Gold | `linear-gradient(-26deg,#0056ff4a,#c28e01)` | `radial-gradient(192.93% 100% at 50% 0%,#d77700,#291a08 60.1135%,#000808)` |
| Night | `linear-gradient(-26deg,#7c2424,#2c27ff75 22.631%,#ff000080)` | `radial-gradient(131.767% 100% at 52.4614% 0,#212121 5.96336%,#000000e0 63.2584%,#000)` |
| Blue | `linear-gradient(305deg,#7d24245e,#2c27ff75 22.631%,#ff000080)` | `radial-gradient(131.767% 100% at 52.4614% 0,#004ba3 5.96336%,#030f4de0 63.2584%,#000a1a)` |
| Purple | `linear-gradient(-26deg,#855dff45,#fe7900)` | `radial-gradient(94.423% 100% at 50% 0%,#ec770a,#12004a)` |
| Red | `linear-gradient(-26deg,#591010,#45001075 22.631%,#ff3b3b80)` | `radial-gradient(116.887% 100% at 50% 0%,#8f0100,#400011 50%,#00080d)` |

Two other interiors exist in the source without being used on
the homepage: `#006868 → #01204fe0 → #00001c` (turquoise) and
`#7d1f1f → #3b0202 → #05001a` (garnet) — **relevé**.

All these colors are written in **8-digit hexadecimal**
(`#0056ff4a`), i.e. with the alpha inside the color code.
The ring is therefore never opaque: it lets what's
behind it show through. **Relevé.**

---

## 5. Grid and spacing

| Measure | Value | status |
|---|---|---|
| Text container | **960px** (content from x=240 to x=1200 at a width of 1440) | **relevé** (measured on the render) |
| Photo-band container | ~**1044px** | **relevé** (measured on the render) |
| Product photo bands | full width, outside the container | **relevé** |
| Mobile gutter | 20px | **estimé** |

### 5.1 The step is 10, not 8

Paddings measured, by decreasing frequency:

```
60 (13×)  ·  40 (11×)  ·  10 (11×)  ·  50 (6×)  ·  30 (6×)  ·  20 (3×)  ·  80 (2×)
```

Gaps (`gap`), by frequency:

```
10 (41×)  ·  8 (13×)  ·  20 (11×)  ·  12 (6×)  ·  40 (5×)  ·  24 (3×)  ·  16 (3×)  ·  60 (2×)
```

The macro-scale is therefore a **rhythm of 10** (10/20/30/40/50/60/80) —
**relevé**. This isn't an 8pt grid. Only the micro-gaps internal to
components (4, 8, 12) fall outside this rhythm, and they do so because they
measure optical distances, not layout distances.

### 5.2 Asymmetric grid of the support cards

Measured on the render, at a width of 1440:

```
Row 1:  Community 585px  |  gap 25  |  Support 349px
Row 2:  Careers   349px  |  gap 25  |  Newsletter 585px
                                        585 + 25 + 349 = 959
```

**Relevé.** The wide/narrow then narrow/wide alternation breaks the symmetry without
breaking the alignment — it's the page's most carefully crafted layout
detail, and it's reproducible with 3 grid tracks (349 / 211 / 349) and explicit
`grid-column`s.

---

### 5.3 Anatomy of a "superpowers" card

All these values are **measured** in the `<style>` blocks.

```
wrapper    398 × 586
card       398 × 554, offset 32px down
ring       2px, outer radius 24, inner radius 22
blur       backdrop-filter: blur(8.1px)
icon       64 × 64, radius 15, 1px hairline #242424, at left: 20px
text       326px block, at top: 62px of the card, gap 10
body       opacity: .8
screenshot 438 × 230, radius 20, at top: 320px / left: 30px
```

Two decisions make the entire card, and neither is
intuitive:

1. **The icon is anchored to `top: 0` of the WRAPPER, not of the card.**
   Since the card starts 32px lower, the icon overlaps its top
   edge: it floats half outside. It's this overflow that gives
   the depth — without it, the card is a plain rectangle.
2. **The screenshot is 438px wide inside a 398px card**, placed
   30px from the left edge. It therefore spills out 70px on the right and touches
   the bottom. It's never "contained with a margin": it's
   always cropped by two edges.

And the section isn't a grid: it's a **carousel**. The
cards spill out on both sides of the viewport, a fade at the edges
extinguishes them into the page's black, and two round 40px chevrons
sit on top, centered on the cards' height.

### 5.3 bis Vertical density is a value

The source page measures **5523px tall at a width of 1440px**, for ten
sections. This is the most useful number in the entire document: two
pages with exactly the same content, the same colors and the same
type, but one at 5500px and the other at 7300, don't look alike.
They read as two different sites.

An earlier version of this recode ran to 7344px — every
value measured correctly, and a result that didn't look right. The
fix wasn't "reduce the margins" by eye: measure the
source's total height, measure your own, and tighten until
the ratio lands. **Measuring correctly isn't enough; you also have to
measure the skeleton.**

To land at 5533px: inter-section breathing room 60, tightened
bands 40, hero 130 at the top, product band 700 tall minimum.

### 5.4 Spec grids

**A skeleton mistake not to repeat**: these grids are NOT a
full-width band under the duo section. Each one is **nested inside
its column** — the hardware grid under Umbrel Home, the
software grid under umbrelOS — and is 605px wide inside a 720px
column. This is what gives the section two parallel narratives instead
of a stack, and it's invisible in the CSS: only a side-by-side
comparison of the two pages reveals it.

These aren't CSS grids but **stacked flex-rows**:

```
column   flex-flow:column; gap:20px; padding:20px 0   (mobile 40px 0 20px)
row      flex-flow:row;    gap:20px; width:100%
tile     flex:1 0 0; width:1px; aspect-ratio:1.21667
         → 189px tall on desktop, 138 on mobile
```

The `flex: 1 0 0; width: 1px` is the classic trick to make
children of different content sizes come out exactly the same width —
`flex: 1` alone isn't enough, the content's intrinsic basis otherwise
enters the calculation.

And each tile **IS** a render: its two-tone title (first
line white, second grayed) is baked into the image. Nothing should
be overlaid on it.

### 5.5 App pill

```
pill      padding:12.8px; gap:6.4px; border-radius:16px; width:min-content
icon      60 × 60, radius 12
```

The decimals (12.8 = 16 × 0.8; 6.4 = 8 × 0.8) betray a scale
factor applied to the component in the source. On screen the pill
measures roughly 0.84 × these values — the numbers above are the
CSS's, not the render's.

### 5.6 Measurement trap — the order of the responsive variants

The source writes the three responsive variants of every text
block in the HTML, and **the first one in the document isn't always
the desktop one**. A naive "I take the first occurrence" measurement
gives mobile values.

Cases verified on section titles:

| Text | Desktop | Mobile |
|---|---|---|
| "The superpowers are endless…" | **32px** | 24px |
| "There's an entire app store." | **32px** | 24px |
| Section eyebrow | **18px** | 15px |

The feature word's gradient also changes between the two:
`linear-gradient(270deg, rgba(28,26,255,0) 15.4156%, rgb(28,26,255) 70.4955%)`
on desktop, `0% / 36.7731%` on mobile — the fade therefore starts
earlier on small screens. **Relevé.**

## 6. Radii

| Value | Usage | Occurrences | status |
|---|---|---|---|
| 24px | large cards, bands | 12 | **relevé** |
| 22px | app pills | 12 | **relevé** |
| 20px | medium cards | 8 | **relevé** |
| 12px | thumbnails, app icons | 10 | **relevé** |
| 99px | buttons, fields, pills | 7 | **relevé** |

Isolated values also present: 40, 36, 32, 16, 15, 13, 11, 10, 8, 7,
6, 5px — **relevé**, but with no stable role.

---

## 7. Hairlines and shadows

| Element | Value | status |
|---|---|---|
| Card hairline | 1px, `linear-gradient(#303030 0%, #121212 100%)` in `border-box` | **relevé** |
| App icon hairline | `1px solid #242424` | **relevé** |
| Nav flag border | `1px solid rgba(255,255,255,.3)` | **relevé** |
| Drop shadow | **none on blocks** | **relevé** |

A structural point: **the page sets no shadow and no solid-color
border.** The relief comes from three things and three only — the
background's descending gradient (P1), the hairline's lighter-at-the-top
gradient (P2), and the overflow (P6). Removing shadows isn't a shortcut, it's the style.

### 7.1 Photo veils

Only one veil is measured, and it's **vertical**, starts from a
transparent gray, and never reaches full opacity:

```css
linear-gradient(#75757500 15.6907%, #000000d6 69.019%)   /* d6 = 84% */
```

Starting from gray rather than black avoids a "dirty" veil on a
colored photo; stopping at 84% keeps the material legible underneath.

A junction between two blocks also exists:

```css
linear-gradient(#0000 0%, #000 84.0354% 100%)
```

The source never cuts sharply between two sections: it fades toward
black over the last 16 percent. **Relevé.**

### 7.2 What is measured but not placed

Two radials share the `at 0 0` geometry from § 0/P3:

```css
radial-gradient(100% 147.839% at 0 0, #0657a1 0%, #051e22 36.2271%, #031d3cf7 72.4655%, #1e53a1ed 84.8958%, #355aa3 100%)
radial-gradient(100% 147.839% at 0 0, #969696 0%, #1c1c1c 36.2271%, #242424f7 72.4655%, #737373ed 84.8958%, #050505 100%)
```

They form a body + hairline pair (same technique as P2), but nothing
in the source lets them be attached to a specific block without
guessing. They're documented, not placed.

Same status for `radial-gradient(113.039% 100% at 50% 0, #181818 0%,
#191919 .01%, #080808cf 100%)`: the class `.bande--teintee` exists
in `styles.css`, commented `[relevé, non affecté]`. Verification
done on the render, every section of this page is on pure
black; placing it anywhere would create a gray band the source
doesn't have.

**Fixed trap**: the indigo wash `#2d2a89` that I initially took
for a section background isn't one. These are 1px hairlines —
see § 0/P7. The lesson holds beyond this case: in a Framer
source, a gradient isn't necessarily set on a block of the size you'd
imagine. You have to measure the **geometry** of the carrying element
(`width`, `height`, `position`) at the same time as the color.

---

## 8. Motion

### 8.1 What the source contains

| Element | Value | status |
|---|---|---|
| **The page's only CSS transition** | `color .3s cubic-bezier(.44,0,.56,1)` | **relevé** |
| 3D scene perspective | `1200px` | **relevé** |
| Tablet screen rotation | `rotateX(-12deg) rotateY(24deg)` | **relevé** |
| Phone screen rotation | `rotateX(-10deg) rotateY(-16deg)` | **relevé** |
| Product photo framing | `object-position: 70.3% 48.4%` | **relevé** |
| `@keyframes` | **none** | **relevé** |
| `:hover` rules in CSS | **none**, for 50 `:hover` references in the HTML | **relevé** |

The curve `cubic-bezier(.44, 0, .56, 1)` is nearly symmetrical: acceleration
and deceleration of the same duration. It's a *state-change* curve
(color on hover), not an entrance curve.

### 8.2 The capture trap

**27 elements** carry `data-framer-appear-id` with an initial state
`opacity: 0.001` accompanied by a transform. Three amplitudes observed:
`scale(1.1)`, `translateY(20px)`, `translateY(-20px)` — **relevé**.

These values are the state **before** the animation. A static capture freezes the
page in this state, and a naive reading of the source concludes that the design
is made of invisible blocks. You have to read the **final** state:
`opacity: 1`, `transform: none`.

Corollary for any reconstruction: condition the hidden state on the
presence of JavaScript. Without this precaution, a browser without JS displays
an empty page — which is exactly the source's defect.

### 8.2 bis What the recode puts in `motion.js`

Four behaviors, all in vanilla JS, no framework:

| Block | What it does | Why not in CSS |
|---|---|---|
| Reveals | `IntersectionObserver`, `.js` class on `<html>` | CSS alone can't condition the hidden state on the presence of JS |
| Carousel | drives the rail from the chevrons and the keyboard arrows, marks the centered card | `scroll-snap` handles the scrolling, not the control or position detection |
| Marquee | pauses on hover and focus | `animation-play-state` needs an event |
| Guard | a single, shared read of `prefers-reduced-motion` | — |

The carousel's step is **measured** (`getBoundingClientRect` + `columnGap`)
instead of being hardcoded: a constant would break on the first
change to the card format. The `scroll` handler is `passive` and
throttled by `requestAnimationFrame` — one measurement per frame,
otherwise every event forces a layout calculation.

### 8.3 Marquees

The "Superpowers" and "App Store" blocks duplicate their content **3 to 4
times** in the DOM — **relevé**. It's a horizontal infinite loop.

Two exact copies are enough: an animation toward `translateX(-50%)` then loops
seamlessly, regardless of the number of elements. The extra
copy must carry `aria-hidden="true"`.

---

## 9. Source defect not to reproduce

**The page has no `<h1>`.** The hero title is a `<span>` styled
inside a generic container. `<h2>`s exist (the product
names), but the document root has no level-1 title.

To fix in any recreation: a real `h1`, and a continuous heading
hierarchy.

---

## 10. Images

**55 distinct images**, all on `framerusercontent.com/images/`.

Trap: in a `wget -p -k` capture, they appear as **relative**
paths (`../framerusercontent.com/images/<hash>.<ext>?<query>`)
and only 4 files are actually present on disk. The reconstruction
rule is mechanical and without exception:

```
../framerusercontent.com/images/<hash>.<ext>?<query>
    →  https://framerusercontent.com/images/<hash>.<ext>?<query>
```

The query string (`?width=N&height=N`, sometimes `&lossless=1`) is the
CDN-side resizing: it's kept as-is.

**How to know what an image is for**: in this DOM, an `<img>`
always immediately precedes the label of the element it
belongs to (app pill, hero proof point), except in the carousel
cards where it follows its own card's body.

| Role | Path |
|---|---|
| Umbrel Pro product photo (landscape) | `VFzB451PEWsPYR0El5GEdv7S08.jpg?lossless=1&width=2688&height=2140` |
| Umbrel Pro product photo (portrait) | `FojPRx8QnnTvoC93ZzRdPrv9CI.jpg?lossless=1&width=2233&height=3123` |
| Umbrel Home in hand | `wzRrIPwmhVn2q20FWjgSSL94TI.png?width=1024&height=1024` |
| umbrelOS — tablet | `O7kTDJvFXu8PFwYRG27B32JjzE.png?width=1502&height=1179` |
| umbrelOS — phone | `D6VxOGLYprxETPKdvUrtgYTXWs.png?width=1290&height=1716` |
| Purple glow of the umbrelOS panel (opacity .08) | `79RI1LMHmDs5ElfCjulPfPDFvg.png?width=3099&height=3099` |
| Files banner | `ibiIGPQWO78Oy0aqZdi0AE8VV8.png?width=2100&height=900` |
| Files icon | `AnPmpdrq3EXLToZzZDPfSPsgS9A.png?width=203&height=204` |
| App Store section glow | `6OFRUG07Ah8ElVZxz3GB9jftiQ.jpg?width=1920&height=1280` |
| App Store collage | `eoh9h3TnTTdgbU6lni413C4xpuU.png?width=1268&height=808` |

**Hero proof points** — three stacks of three icons, in order:

| Group | Icons |
|---|---|
| files, photos | `AeGrrO10RXINLS14e54r9eIfNPs.png?width=174&height=173` · `anfNc8lmnhI1Hh7Ppf4xmKPmE.png?width=192&height=193` · `9NMavjn7lKc6PBpF2DCb7EDcC2w.png?width=203&height=204` |
| OpenClaw | `N7yCIuHkTxXnIffmtDt36hEfZ0.svg?width=256&height=256` · `I5yCvDTm2j3kVgcjzLpB4uDgh9A.png?width=502&height=502` · `y20pBuz1MS0Lq8djw2UmviEMQyg.png?width=255&height=255` |
| Bitcoin node | `Kw6xmUwUmOeCibFLUOOPD2c2lxs.png?width=256&height=256` · `FHxtDIM8oDtR6IqVRJVPD1besVI.svg?width=256&height=256` · `O2QarihZ4lz2Vmed8njk9um1rko.png?width=256&height=256` |

**Spec cards** — each card is a complete render
(952 × 782) that **already contains its baked-in title**: nothing should be
overlaid on it.
`acY28JOPS1FNm2kGeVFquznhZlo` · `ypbqV6AMNGeIzRnNsONOfvHPlWQ` ·
`oQ4MwsUAiZ2YF5WfWZu5dzjYS6o` · `5W5CGMEYrWkxX9QP0b1P60uepm8`
(equivalent umbrelOS set at 876 × 721: `hw0KjVu2GeNiXcsIZPuYZQ0hd4` ·
`RijUuLN6Hw8hwVDvxHzYPI8C3tk` · `tUCBLEvbOpelcKnfis1RDtqfoY` ·
`j70vviz91He3Z00NcYSUnaTp4`)

**"Superpowers" cards** — app screenshot + icon:

| Card | Screenshot | Icon |
|---|---|---|
| Plex | `Nf3SUCE5KohIpdurFteYcUbbY.png?width=2320&height=1248` | `n3cIWrnc5e1G6jA0YgpiRUIyt00.png?width=192&height=192` |
| Ollama / DeepSeek | `pvRsvBbC98us2MgvBCx6a1Tc4.png?width=1141&height=823` | `FimxhhXuuAjGAx7OZbE1YQqck.png?width=256&height=256` |
| Home Assistant | `DZtdVA1t4cCP7AeCSwwNsRzApdE.png?width=2560&height=1348` | `MkZDQ57bdWG4x9UDtjKzldt0Lg.png?width=192&height=193` |
| Nextcloud | `aAkynId6O7Jg9WcRjE2piKy2g0s.png?width=1288&height=792` | `FjZKPCThLQH17O6pluiH4TmiY4.png?width=192&height=192` |
| Pi-hole | `Vzt7yBHKceIQhPmsfuHzJHQduA4.png?width=2560&height=1348` | `bHQIVJx38uI8kJjNS5gJY9FLk.png?width=192&height=192` |
| Bitcoin node | `wwvvv6s0IFQpk794oQrHEay7sW8.png?width=1159&height=697` | `56rLLT6EF4I7lEcZzR65EcY5Iw.png?width=192&height=192` |
| OpenClaw | `daW51CZEk08PtPaVmM7vNEl22M.png?width=2418&height=1398` | `lEi6ASrmMOyvIFYENdjSmkcPYMs.png?width=504&height=502` |

These are **app screenshots**, not card
backgrounds: the card's color comes entirely from the CSS (§ 4.5).

### 10.1 What has no URL

Three families of images on the page are **not** files and
therefore have no URL to reconstruct:

1. **14 of the 19 marquee icons** — served via
   `<svg><use href="#svg…"/></svg>` on an inline SVG sprite
   (21 distinct symbols in the document). Only 5 applications
   have a file: Bitcoin Node (`elGNPTDUXJZqRmMVRmZgr1bDlgc.png?width=195&height=220`),
   Lightning Node (`wtfjZGxQ8qYhRWGrQCtDLmQGE.png?width=170&height=207`),
   Nostr Relay (`bSOgvYMTi69dF1xyLwOv82kcL8.png?width=256&height=256`),
   Plex and Nextcloud (icons reused from the cards).
2. **The Umbrel logo and the interface pictograms** — inline SVG.
3. **The country-selector flag** — local path `flags/us.svg`,
   with no CDN equivalent.
