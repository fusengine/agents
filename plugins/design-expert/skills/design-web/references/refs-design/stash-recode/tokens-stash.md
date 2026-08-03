# Tokens — stash

Corpus of **techniques**, relevé on the source and rebuilt under a
different brand. Structure, rhythm, typography, component anatomy and motion
procedures are taken from the source. What changes: the brand name, the palette,
the photographs, and the copy.

**This is a reproduction, not a derivation.** The section order, the grid of each
section, the number of items per grid, the type scale, the spacing rhythm, the
radii, the hairlines and the animation procedures are the source's. Where a value
here differs from the source, it is marked `[arbitrage]` and the reason is given
in the same sentence — there are 25 such marks in `styles.css`, against 212
`[relevé]`.

**Texts are rewritten, not paraphrased away.** They keep the same function and
approximately the same length as the source's, because the exact length of a
heading dictates its line breaks, its block height, and therefore the vertical
rhythm around it. A heading rewritten three words longer breaks the layout even
when every measured value is correct. Headings, subheadings, nav and button
labels, pills and figures are therefore elements of **layout**, not editorial
content.

**Sources of the measurements** — page fetched locally on 2026-08-01:
`source.html` (45,483 bytes, TanStack Start SSR payload) +
`/assets/index-Bc6vz3Z7.css` (252,518 bytes, compiled Tailwind v4). Values come
from the utility classes set on the HTML, from the inline `style` attributes the
server rendered, from the 60-line inline `<style>` block in the page head, and
from the `:root` of the compiled sheet. Because grep on the served HTML hits a
single 45KB line with no trailing newline, every count below was taken with
`grep -oa … | wc -l`; the `-a` is not optional.

Marker convention, used throughout and never loosened:
`[relevé]` = read in the source · `[arbitrage]` = decided here · `[estimé]` =
computed, not read.

---

## 1. The motion system

### The structuring fact: **0 `@keyframes` in the source, 0 here**

The source declares no `@keyframes`, no `animation-timeline`, and exactly **one**
duration in readable CSS: the `150ms` of `.landing-press button`. Everything else
moves under a Framer Motion runtime that never writes a keyframe to the document.

```bash
grep -oa 'transition' src.html | wc -l     # 36
grep -oa '@keyframes' src.html | wc -l     # 0
```

So the source looks alive with zero declared animation: every movement is a
transition between two states. That property is reproduced literally — this
rebuild also ships **0 `@keyframes`**, and its `styles.css` contains 24
`transition` declarations.

### What the runtime leaves readable, and what it hides

The server-rendered HTML carries the **resting state** of every animated block as
an inline `style` attribute. Those are facts:

```bash
grep -oa 'translateY(16px)' src.html | wc -l   # 5
grep -oa 'translateY(24px)' src.html | wc -l   # 19
```

**Two distances, not one, and they are not interchangeable** `[relevé]`:

- **16px** — the five direct children of the hero: eyebrow, h1, paragraph, button
  row, trust strip. Five, exactly the count of the hero's text elements.
- **24px** — the 19 section blocks that rise on scroll.

The hero rises on *mount*, the sections on *intersection*. The source distinguishes
an entrance at load from an entrance at scroll, and gives the first a shorter
travel because the reader is already looking at it. Reproduced in
`motion.js` §3: `[data-monte]` is deliberately **not** observed, it fires on the
second animation frame after paint.

What the runtime hides, and is therefore `[arbitrage]` here: every duration except
150ms, every easing curve, every intersection threshold, every stagger step.

### Values used here

| Token | Value | Mark | Applies to |
|---|---|---|---|
| `--duree-presse` | `150ms` | `[relevé]` literal | press, hover, colour change |
| `--duree-etat` | `200ms` | `[arbitrage]` | link hover, accordion rows |
| `--duree-revele` | `620ms` | `[arbitrage]` | a block rising into view |
| `--pas-cascade` | `90ms` | `[arbitrage]` | one grid cell to the next |
| `--courbe-sortie` | `cubic-bezier(0.16, 1, 0.3, 1)` | `[arbitrage]` | reveals |
| `--courbe-etat` | `cubic-bezier(0.4, 0, 0.2, 1)` | `[relevé]` | Tailwind's implicit curve |
| `--montee-heros` | `16px` | `[relevé]` literal | hero children |
| `--montee-bloc` | `24px` | `[relevé]` literal | section blocks |

No `cubic-bezier` on this page has a y control point above 1: no bounce, no
elastic, no overshoot. Verified:

```bash
grep -nE 'cubic-bezier\([^)]*1\.[1-9]|elastic|bounce' styles.css motion.js   # 0
```

### The press gesture, copied literally

The source's inline `<style>` block gives it in full, and it is the one animation
detail that survives the runtime:

```css
.landing-press button {
  transition-property: transform, background-color, border-color, color, opacity;
  transition-duration: 150ms;
}
.landing-press button:active { transform: scale(0.96); }
```

Five properties, one duration, one scale. Reproduced verbatim on `.bouton`. Note
that `transform` is first in the list and that the resting scale is never
declared — the element simply returns to `none`.

### Hover adds, and only twice

```bash
grep -oa 'hover:' src.html | wc -l          # 40
grep -oa 'active:scale' src.html | wc -l    # 7
```

Of those 40 hovers, 38 are a colour or a background swap. Exactly **two** change
geometry, and the difference between them is deliberate `[relevé]`:

- the white button: `hover:scale-[1.03]`
- the gradient button: `hover:scale-[1.02]`

One percent apart. The gradient button is already the loudest element on the
page, so it is given the smaller gesture. Both reproduced at those exact values.

### The agent panel is a staged sequence, not a screenshot

```html
<!-- source, served HTML -->
<div class="min-h-[320px] space-y-4 p-5 sm:min-h-[380px]"></div>
```

The message area is **empty** in the SSR payload and carries a minimum height in
two steps. That is the whole tell: its contents are written by the runtime, one
message at a time, and the minimum height exists so the panel does not collapse
before they arrive. The procedure is reproduced (`[data-fil]` / `[data-message]`,
220ms apart); the interval is `[arbitrage]`.

### The no-JS contract

`opacity: 0` is armed only under `.js-motion`, and `motion.js` adds that class
only after it has confirmed it can lift it — content present, motion not reduced,
`IntersectionObserver` available. Three failure modes therefore leave the page
fully legible rather than blank. The accordion follows the same rule in the other
direction: the HTML ships all four panels **open** (`aria-expanded="true"`, no
`data-plie`), and the script closes three of them on arm.

Every observer is disarmed. `self.unobserve(e.target)` in the callback — the
second callback parameter **is** the observer, so no closure over `vigie` is
needed — and `disconnect()` plus `cancelAnimationFrame` on `visibilitychange`,
with `pagehide` as the fallback for a tab closed without passing through a hidden
state.

---

## 2. Colour

### What the source does

```css
/* source, inline <style>, .landing-dusk */
--background: #120a10;   --card: #1a0e15;      --secondary: #251621;
--foreground: #f7ede8;   --muted-foreground: #a89099;
--primary: #ff8f70;      --primary-foreground: #23100a;
--border: rgba(255,255,255,0.09);
```

A desaturated plum in four steps, one warm coral, and every surface above the
opaque steps built from white opacity:

```bash
grep -oa 'bg-white/\[0\.03\]' src.html | wc -l   # 8
```

Three border weights and nothing else: `border-white/[0.06]` on cards,
`border-white/[0.08]` on frames and the header pill, `border-white/20` on the
query pills and the phone chassis.

### What changes here

The **architecture** is kept — four opaque steps, one accent, surfaces in white
opacity, three border weights — and the field moves from plum to deep teal. The
coral barely moves: `#ff8f70` → `#ff7a5c`. That is the point of the transposition.
The page reads completely differently because the *field* changed, not the accent.

| Role | Source | Here | Mark |
|---|---|---|---|
| page background | `#120a10` | `#05171a` | `[arbitrage]` |
| panel | `#160b12` | `#082024` | `[arbitrage]` |
| card / chassis | `#1a0e15` | `#0a262a` | `[arbitrage]` |
| raised | `#251621` | `#0e3034` | `[arbitrage]` |
| primary text | `#f7ede8` | `#eaf6f3` | `[arbitrage]` |
| secondary text | `#a89099` | `#93b3b0` | `[arbitrage]` |
| text on image | `#f3dfd6` | `#dcefea` | `[arbitrage]` |
| light accent | `#ffd9c2` | `#ffd2c2` | `[arbitrage]` |
| plan label | `#c9a99b` | `#a4c4bd` | `[arbitrage]` |
| placeholder | `#8a7078` | `#86aaa6` | `[arbitrage]` |
| accent | `#ff8f70` | `#ff7a5c` | `[arbitrage]` |
| hairlines | `.06 / .08 / .20` white | identical | `[relevé]` |

### The two gradients

The source's heading gradient, given literally in its inline `<style>`:

```css
.landing-gradient-text {
  background: linear-gradient(100deg,#ffd9a0 0%,#ff8f70 40%,#f0648e 70%,#c9a3e8 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
```

Four stops, 100deg, applied five times on the page:

```bash
grep -oa 'landing-gradient-text' src.html | wc -l   # 5
```

Reproduced: same angle, same four-stop structure, same clip mechanism, different
hues — `#ffd2bd 0% · #ff7a5c 38% · #ffa981 62% · #58d3c2 100%`. It runs warm to
cold instead of warm to violet, which is what ties it to the teal field.

One addition that is `[arbitrage]`: `padding-bottom: 0.06em` on `.degrade`. Blink
clips the descenders of an italic serif at the background-clip box; without it the
tail of *&answers.* is cut.

The button gradient — `from-[#ff8f50] to-[#f0648e]` in the source — becomes
`#ff7a5c → #ffb27f`.

### The one colour decision that is not a transposition

The source sets `text-white` on both gradient surfaces (the "Most popular" badge
and the "Go Pro" button). Measured against its darkest stop that is **≈3.0:1**,
under the 4.5:1 floor for body-size text. Here the ink is `--sur-accent: #10231f`,
a near-black teal:

- against `#ff7a5c` (darkest stop): **6.35:1** `[estimé]`
- against `#ffb27f` (lightest stop): **9.30:1** `[estimé]`

Geometry, radius, weight, padding and the gradient itself are unchanged. Only the
ink is. Marked `[arbitrage]` in `styles.css` with the ratio written next to it.

### Measured contrast on the rendered page

`layout-check.ts`, six viewports, after two corrections:

| Pair | Before | After |
|---|---|---|
| agent placeholder on panel | 4.43:1 ✗ | 6.3:1 ✓ |
| inactive tab label on phone screen | 2.87:1 ✗ | 6.1:1 ✓ |

Both were caught by measurement, not by eye, and both are recorded in the CSS
with the rejected value beside the kept one.

The four gradient-text runs and the three gradient surfaces come back as
*warnings* rather than violations — the script cannot resolve a `background-image`
into a single colour. Computed by hand against `--fond-page`: the darkest stop of
the heading gradient gives **7.17:1**, the lightest **10.1:1**. Both clear the
3:1 large-text floor with room.

---

## 3. Typography

### Two families, and the split is absolute

```bash
grep -oa 'font-family:[^;]*' index-Bc6vz3Z7.css | sort -u
#   --font-sans: "Geist Variable", sans-serif
#   "Instrument Serif", Georgia, serif      (inline <style>, .landing-display)
```

`[relevé]`. The source serves both as local woff2 (`instrument-serif-regular.woff2`
and `instrument-serif-italic.woff2`, two `@font-face` rules, `font-display: swap`).
This rebuild pulls the same two families from the Google Fonts CDN — the same
choice `mainframe-recode` made for Inter.

```bash
grep -oa 'landing-display' src.html | wc -l   # 22
```

Twenty-two uses of the serif on the whole page, and **not one of them is a
sentence**. The serif's complete territory `[relevé]`:

1. the wordmark, in the header and the footer
2. the italic half of each heading (7 headings)
3. the three constat card titles
4. the three step numbers, `01 02 03`
5. the three number-card figures, `0 folders / Under 1 sec / $5/mo`
6. the two prices, `$0` and `$5`

Everything else — every paragraph, every label, every button, every list item, the
whole FAQ — is Geist. There is no third family and no mono face.

### The scale

All values below are the resolution of the source's utility classes by the
Tailwind v4 default table, except the two arbitraries it writes itself
(`text-[13px]`, `text-[15px]`).

| Token | px | Source class | Used by |
|---|---|---|---|
| `--t-micro` | 14 | `text-[13px]` → see note | eyebrows, pills, trust strip, nav |
| `--t-s` | 14 | `text-sm` | body of every card, list items, footer |
| `--t-15` | 15 | `text-[15px]` | accordion triggers only |
| `--t-base` | 16 | `text-base` | the five lead paragraphs |
| `--t-lg` | 18 | `text-lg` | wordmark, step numbers |
| `--t-xl` | 20 | `text-xl` | step titles |
| `--t-2xl` | 24 | `text-2xl` | constat card titles |
| `--t-4xl` | 36 | `text-4xl` | every h2, below 640px |
| `--t-5xl` | 48 | `text-5xl` | h1 below 640px, prices, pricing h2 ≥640 |
| `--t-6xl` | 60 | `text-6xl` | every h2 ≥640px, h1 at 640–1024 |
| `--t-7xl` | 72 | `text-7xl` | h1 ≥1024px only |

```bash
grep -oa 'text-\[13px\]' src.html | wc -l    # 19
```

**Note on the 13px → 14px shift.** Nineteen occurrences of `text-[13px]` in the
source carry eyebrows, query pills, the trust strip, nav links and the agent's
status pill; the phone UI goes further down, to 11px for the domain line, 10px
for "Online" and 9px for the tab labels. Pre-flight check 17 floors any
information-bearing text at **14px of rendered size at 360px**, labels and
captions explicitly included. Every one of those tokens is therefore set to 14px
here. It is the only typographic deviation from the source and it is
`[arbitrage]`, marked at each of the five sites where it applies.

### Weights, tracking, and what is never used

Weights: **600** on the two opaque buttons, the badge and the phone screen title;
**500** on nav, labels, step titles, list items and plan names; **400** on
everything else. There is no 700 anywhere on the page `[relevé]` — a display page
with no bold heading.

Tracking: `-0.025em` (`tracking-tight`) on every heading and every price;
`0.2em` (`tracking-[0.2em]`) on the seven section eyebrows; `0.025em`
(`tracking-wide`) on the hero eyebrow, and on nothing else.

```bash
grep -oa 'uppercase tracking-\[0\.2em\]' src.html | wc -l   # 7
```

Never used: a third family, a mono face, any weight above 600, small caps, an
underline on any link, a type step between 640px and 1024px.

### Leading — the one place this rebuild had to depart, with the number

The source writes `leading-[1.05]` on every h2 and leaves `text-5xl` at its
default `1`. Reproducing those values verbatim fails pre-flight check 11: the
rendered-layout script reports a **vertical ink overflow** on every heading, at
all six viewports, because a grotesque's font content area is ≈1.28em and a 1.05
line box cannot hold it — the ink of one line reaches into the next.

Measured, then bisected against the gate:

| leading | violations (6 widths) |
|---|---|
| 1.05 (source) | 12 |
| 1.15 | 12 (reported delta 3px) |
| 1.18 | 12 (reported delta 2px, still over tolerance) |
| **1.20** | **0** |

`--t-4xl-h: 1.20` and `.hero__titre { line-height: 1.2 }` are therefore
`[arbitrage]`, and they are the largest single deviation in this rebuild. An
intermediate attempt — giving the serif `<em>` its own tighter line-height to stop
it inflating the line box — changed nothing (19 violations before and after),
which proved the overflow comes from the grotesque's own metrics and not from the
serif. That negative result is recorded because it is the useful half.

---

## 4. Structure and rhythm

### One gutter, one ceiling, one grid gap

```bash
grep -oa 'max-w-6xl' src.html | wc -l   # 10
```

`[relevé]` and worth stating plainly: the page has **one** container ceiling
(`max-w-6xl` = 72rem) used ten times, **one** gutter (`px-6` = 1.5rem) that never
changes between 360px and 1920px, and **one** grid gap (`gap-4` = 1rem) for every
card grid. Two blocks descend to `max-w-5xl`: the FAQ and the footer.

### Section rhythm is not a single value

```bash
grep -oa 'py-24' src.html | wc -l      # 3
grep -oa 'pb-24' src.html | wc -l      # 6
grep -oa 'sm:py-32' src.html | wc -l   # 3
grep -oa 'sm:pb-32' src.html | wc -l   # 6
```

Nine sections, and only two of them use `py`: the problem and the agent sections
are the only ones with a top band, because every other section is a photographic
card whose own interior padding does the work. The rest carry `pb` alone, so a
card sits directly under the one above it with no dead band between them.

Interior padding of the four photographic cards, all distinct `[relevé]`:

| Card | mobile | ≥640px |
|---|---|---|
| hero | `pt-16 px-6 pb-20` | `pt-24 px-12 pb-28`, `px-16` ≥1024 |
| promise | `px-8 py-20` | `px-14 py-28` |
| iOS | `px-8 py-16` | `px-14 py-20` |
| closing | `px-8 py-24` | `py-32` |

The rebuilt sheet returns **44 distinct padding values**
(`grep -oE 'padding[a-z-]*:[^;]*' styles.css | sort -u | wc -l`), against the
single repeated value that pre-flight check 13 fails on.

One rhythm detail worth copying: the three number cards under the promise card are
pulled to `mt-4` (1rem) where every other grid in the page sits at `mt-14`
(3.5rem). They read as the *receipt* of the card above, not as a new block.

### Radii are stacked, not unified

```bash
grep -oa 'rounded-full' src.html | wc -l        # 23
grep -oa 'rounded-3xl' src.html | wc -l         # 10
grep -oa 'rounded-\[2\.5rem\]' src.html | wc -l # 4
```

Five distinct radii plus the pill, each marking a scale of object `[relevé]`:

| Radius | px | Objects |
|---|---|---|
| `2rem` | 32 | the hero card, and nothing else |
| `2.5rem` | 40 | the four other photographic cards |
| `1.5rem` | 24 | constat cards, plans, the agent window, the small vignette |
| `1rem` | 16 | the two fiches inside the phone |
| `0.75rem` | 12 | the agent's input field and its message bubbles |
| pill | — | 23 buttons, pills, badges and dots |

Plus the phone: `3rem` chassis, `2.4rem` screen. The 0.6rem difference is exactly
the chassis's `p-2.5` padding, so the screen's curve is concentric with the
chassis's `[relevé]`.

### Two breakpoints, and they do a lot each

Four `@media` blocks in the rebuilt sheet, three of which matter:

- **40rem (640px)** — every grid goes from 1 column to 3 (or 2 for pricing) in one
  move; every band padding steps from 6rem to 8rem; the hero image grows from
  420 to 520px; the phone from 280 to 300px; the agent thread floor from 320 to
  380px; and **the iOS veil changes direction**, from `to bottom` to `to right`.
  That last one is the source's own `sm:bg-gradient-to-r` `[relevé]` — a
  responsive change of *direction*, not of opacity.
- **48rem (768px)** — the three nav links reappear. There is no burger at any
  width: below 768px they simply do not exist `[relevé]`.
- **64rem (1024px)** — the header pill stops being inset and centres itself; the
  two duo layouts split into columns; the h1 takes its last step to 72px.

No intermediate step. Nothing is tuned at 900px or 1200px.

### Container centring (pre-flight 14)

Both the nav and the content resolve to `max-width: 72rem; margin-inline: auto`.
At 1440 the content box starts at x=144 and so does the pill; at 1920, x=384 for
both. The pill's *interior* padding (1.25rem, 1.5rem ≥640) differs from the
content gutter (1.5rem) because it is a floating object with its own border, not a
column — that is the source's design and it is `[relevé]`, not drift.

---

## 5. Section-by-section

| # | Section | Grid | Items | Media |
|---|---|---|---|---|
| — | header | flex, 3 zones | 1 mark, 3 links, 1 button | none |
| 1 | hero | centred column | 5 text elements | 1 photo, full bleed |
| 2 | problem | 1 → 3 | 3 cards | none |
| 3 | fix | card + 1 → 3 | 3 step cells | 1 photo, 420/520px |
| 4 | agentic | 1 → 2 | 1 vignette, 1 window | 1 photo, 224/256px |
| 5 | promise | card, then 1 → 3 | 5 pills, 3 numbers | 1 photo, full bleed |
| 6 | iOS | 1 → 2 inside a card | 1 phone, 2 fiches | 1 photo, full bleed |
| 7 | pricing | 1 → 2 | 2 plans, 4 lines each | none |
| 8 | FAQ | column → row | 4 entries | none |
| 9 | closing | centred column | 3 text elements | 1 photo, full bleed |
| — | footer | 1 → `1fr 2fr` | 4 link columns | none |

Item counts are the source's, one for one: 3 constat cards, 3 steps, 5 query
pills, 3 numbers, 2 plans with 4 features each, 4 FAQ entries, 4 footer columns.

### The three procedures worth lifting out of this page

**The 1px grid gap as a separator.** The three step cells under the fix card sit in
a grid whose `gap` is `1px` and whose *background* is the hairline colour; the
cells carry an opaque background. Two separators are drawn by one declaration, and
they cannot go out of sync with the cell padding `[relevé] gap-px bg-white/[0.06]`.

**The veil that changes direction per section.** Four photographic cards, four
different gradients: vertical three-stop on the hero (plus a second 10rem band
that fades into the page background), `to top` only on the fix card so the heading
sits in the dark half, `to right` on the promise so the copy occupies the left
third, `to top` again on the closing. The direction is what positions the text —
no card needs a different layout.

**The interface drawn in CSS.** Both the agent window and the phone are markup,
not screenshots: window dots, a status pill, message bubbles, an input field; a
notch, a header, two fiches with 16/9 previews, a two-entry tab bar. The source
does the same for its window, and only its *fiche thumbnails* are real images
(remote CDN screenshots). Here those two thumbnails are drawn as radial gradients,
because no screenshot was supplied — see §7.

---

## 6. Images

Unlike the ten historical references in this corpus, whose images are remote URLs,
**this reference carries its assets locally** in `img/`. Six files, all WebP,
all 1920px wide, one per photographic surface — **none is used twice**.

```bash
grep -oa '<img' src.html | wc -l   # 10 in the source
```

Of the source's ten, **six are landscape photographs** (`home`, `portal-rocks`,
`observatory`, `portal-ridge`, `portal-arch`, `lake`), two are bookmark
screenshots and two are favicons. Six files here for those six surfaces, so the
count matches the source exactly:

| File | px | Subject | Section | Source counterpart |
|---|---|---|---|---|
| `hero.webp` | 1920×1054 | desert rock formations at sunset | 1 | `home.webp` |
| `portal.webp` | 1920×1280 | a lit monolith standing on rocks | 3 | `portal-rocks.webp` |
| `hills.webp` | 1920×1093 | rolling hills under morning mist | 4 | `observatory.webp` |
| `forest.webp` | 1920×1280 | conifer canopy at dusk, from above | 5 | `portal-ridge.webp` |
| `arch.webp` | 1920×1280 | a rock arch opening on a coral horizon | 6 | `portal-arch.webp` |
| `lake.webp` | 1920×1281 | a still lake mirroring a coral band | 9 | `lake.webp` |

Four of the six match their counterpart's **subject**, not only its slot: the
monolith answers the portal on rocks, the arch answers the glowing arch, the lake
answers the lake, and a wide landscape in a small frame answers the observatory.
Only §5 departs — the source puts a second portal there and there is no second
portal here, so the forest canopy takes it. That turns out to suit the section
better than a portal would: it is the one image with **no focal point**, and §5 is
the one card that lays a paragraph and five pills across two thirds of its width.

**Cropping: the axis matters, and getting it wrong fails silently.** All six
surfaces are wider than they are tall, so `object-fit: cover` on a 3:2 source crops
in **height only** — a shift along X has no effect whatever. A first pass set
`65% center` on the promise card, which did nothing at all. The six values that do:

| Site | `object-position` | What it frames |
|---|---|---|
| hero | `center 30%` | `[relevé]`, the source's own `object-[center_30%]` |
| fix | `center 45%` | the whole monolith, rocky base under the caption |
| agent vignette | `center 36%` | the coral break, at 36% of `hills.webp`'s height |
| promise | `center 50%` | no focal point to find; any window of it serves |
| iOS | `center 55%` | the arch opening centred, behind the phone |
| closing | `center 50%` | the waterline at 52%; the symmetry **is** the subject |

`lake.webp` is the most crop-sensitive of the six: mirrored top to bottom, it loses
its whole subject at `30%` (sky only) or `70%` (reflection only).

Every image carries its intrinsic `width`/`height` so nothing shifts on load, a
descriptive `alt`, and `loading="lazy"` on all but the hero, which takes
`fetchpriority="high"` instead — the source's own arrangement `[relevé]`.

No `<svg>` stands in for a photograph. The 18 `<svg>` in the page are a single
icon sprite defined once and referenced by `<use>` (arrow, check, chevron,
sparkle, search, bookmark, settings), plus the grain, which is an inline data URI:

```css
/* [relevé] literal, .landing-noise */
opacity: .06;
background-image: url("data:image/svg+xml,…feTurbulence
  type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'…");
background-size: 250px;
```

```bash
grep -oa 'landing-noise' src.html | wc -l   # 5
```

Five grain layers in the source, over the hero and the three veiled cards. Copied
at those exact values: 6% opacity, `.65` base frequency, 3 octaves, 250px tile.
It is what stops the large flat gradients from banding on an 8-bit display, and
removing it is immediately visible on the promise card.

---

## 7. What is NOT reproduced

Stated as a list so nothing is claimed by omission.

1. **The two bookmark thumbnails inside the phone.** The source loads real
   screenshots from its CDN. No screenshot was supplied here, so the two previews
   are drawn as radial gradients at the same 16/9 ratio. They are decoration
   (`aria-hidden`), not a photograph passed off as one.
2. **The two favicons** beside each domain line, real 16px images in the source.
   Here, a 14px rounded square filled with the accent gradient.
3. **The analytics consent banner.** The source renders a fixed bottom sheet
   ("We use optional analytics…", Decline / Accept). It is a compliance widget,
   not part of the page design, and it is absent here.
4. **The feedback bubble** floating at mid-right of the source page. Same reason.
5. **The Framer Motion runtime itself.** Only its readable resting states are
   reproduced; its interpolation, its spring configuration and its layout
   animations are not recoverable from the served document and were not guessed.
6. **The exact durations of the agent's message sequence.** The source's thread is
   empty in SSR; the cadence is invented here at 220ms.
7. **`text-[13px]` and the phone UI's 11/10/9px.** Raised to 14px, see §3.
8. **`leading-[1.05]` and `text-5xl`'s leading of 1.** Raised to 1.20, see §3.
9. **Live routes.** Every `href` is `#` or an in-page anchor.
10. **The source's copy.** Rewritten under a different brand, at matched function
    and length. Not one visible string is taken verbatim.

---

## 8. Deviation from the source

The complete accounting, in two columns.

### Changed

| What | Source | Here |
|---|---|---|
| brand | SaveIt.now | **Trove.link** |
| colour field | plum `#120a10` family | deep teal `#05171a` family |
| accent | coral `#ff8f70` | coral `#ff7a5c` |
| heading gradient | warm → pink → violet | warm → coral → teal |
| ink on gradient surfaces | white, ≈3.0:1 | `#10231f`, 6.35:1 |
| photographs | 6 remote, warm/violet | 6 local, teal + coral |
| copy | as written | rewritten, same function and length |
| smallest type | 9px | 14px |
| heading leading | 1.05 | 1.20 |
| footer column gutter | 2rem | 1rem (a one-word label overflowed at 768px) |
| collapsed FAQ panel | clipped only | clipped **and** `visibility: hidden` |

### Reproduced identically

Section order and count (9) · the grid of every section · items per grid (3, 3, 5,
3, 2×4, 4, 4) · one container ceiling, one gutter, one grid gap · the six
photographic surfaces, one image each · the four large photographic cards and
their radii · the 1px grid-gap separator · the four veil
directions, including the one that flips at 640px · the grain, at its exact five
parameters · both type families and the serif's complete territory (22 uses, never
a sentence) · the whole type scale · the weight distribution, with no 700 · the
three tracking values · the seven eyebrows · the two-voice heading · the pricing
heading stopping one step short · the five radii plus the pill · the concentric
phone chassis · the agent window and the phone drawn in CSS · the two reveal
distances, 16px and 24px · the 150ms press at `scale(0.96)` on five properties ·
the two hover scales, 1.03 and 1.02 · zero `@keyframes` · the absence of a burger
menu · the footer's `1fr 2fr` split and four link columns.

---

## 9. Coverage check

| File | Lines | Corpus range |
|---|---|---|
| `index.html` | 441 | 374–1313 ✓ |
| `styles.css` | 1466 | 765–2239 ✓ |
| `motion.js` | 185 | ~200 (median 196) ✓ |
| `design-system.md` | 164 | 149–164 ✓ |
| `tokens-stash.md` | 684 | 400+ ✓ |

Marker counts: 212 `[relevé]`, 25 `[arbitrage]`, 4 `[estimé]` in `styles.css`;
13 `[relevé]` in `index.html`.

Gate status, run rather than asserted:

- **check 11 / 14 — rendered layout, six widths (360, 390, 768, 1024, 1440, 1920):
  0 violations, exit 0.** Eight warnings remain, all of them the script failing to
  resolve a `background-image` into a colour; each was computed by hand in §2.
- **check 1** — 1 em dash in a visible string (the `<title>`), under the 2+ crutch
  threshold. The 11 others are in French source comments.
- **checks 3, 5, 6, 9, 10** — 0 hits each.
- **checks 13, 15, 16, 17** — 44 distinct padding values; 6 `<img>`; 24
  transitions, 11 `:hover`, `:focus-visible` on every interactive element through
  one `:where()` rule, `prefers-reduced-motion` in both files; no text below 14px
  at any viewport.
- **checks 2, 7, 12 — not satisfied, deliberately.** Seven eyebrows against a cap
  of three; five hero text elements against a cap of four; three families of
  equal-area cards. All three are the source's composition, reproduced on purpose.
  See the report accompanying this reference.
