# Elysian — procedures recorded

Working document: the reusable procedures of the Elysian page, for a corpus
of design procedures.

**Elysian is not a reproduction.** The other fifteen files in this corpus survey
an existing site; this one surveys a page invented from nothing — a fictional
maison, four supplied plates, no external source to check against. That
changes the markers and only the markers:

- `[mesuré]` = read in the code, or measured on the render. Every number
  below carries this weight even where the marker is not repeated.
- `[arbitrage]` = a design decision I found in the page and can explain.
  There is no third case: nothing here is *relevé*, because there is nothing
  to relieve from.

The markers stay in French. They appear verbatim in the corpus and in CSS
comments; translating them here would desynchronise the documentation from
the code.

**Method.** The page was served from `file://` and rendered in Chromium at
**1440 × 900** and **390 × 844**, then probed through the DevTools protocol:
`getComputedStyle` at forced scroll positions, `getBoundingClientRect` for
boxes, `elementFromPoint` for stacking. Every transformation was sampled at
`--p` = 0, 0.5 and 1 and screenshotted at each. Class values and formulas are
literal reads of `assets/css/00-tokens.css` … `07-static.css` and of the
inline script at the foot of `index.html`.

**What is NOT in this file.** The palette, the type scale, the 8pt grid, the
register and the absolute bans live in `design-system.md`, in the same
folder. This file documents the *how*, never the *what*.

---

## 0. The six procedures worth taking away

### P1 — One rAF loop for the whole page, one custom property per chamber

Four scroll-driven transformations, **one** `requestAnimationFrame` loop,
**one** written property (`--p`, 0 → 1). No scroll library, no
IntersectionObserver for the motion, no per-section listener. §1.

### P2 — The transformation is CSS, the progress is JS

JS writes a number. It never touches `transform`, `clip-path`, `filter` or
`opacity` — those are `calc()` expressions in the stylesheet that read `--p`.
Changing a transformation is editing CSS; the engine never learns about it.
§1.2.

### P3 — Register in `@property` only what CSS must interpolate

`--ap-s`, `--ap-t`, `--mx`, `--my` are declared `syntax: "<percentage>"` so
`@keyframes` and a radial-gradient mask can interpolate them. `--p` is
deliberately **not** registered: it is scrubbed by the scroll, and a
registered `--p` would invite a `transition` that fights the finger. §1.2.

### P4 — Reduced motion is a second layout, not a switch

`html.no-motion` ships **in the served markup** and is removed by an inline
bootstrap only when JS runs *and* motion is allowed. So the same rules serve
no-JS and reduced-motion. The document goes from 13,386 px to **7,153 px** —
each chamber renders unpinned in a chosen end state, not in its `p = 0`
state. §11.

### P5 — One crop shape for the entire system

A single token, `--arch-head: 999px`, produces every frame in the page: the
opening window, the plate II aperture, the pointer specimen, the wax gauge,
the closing arch. Over-large radius on a `round` inset is clamped to half the
box, which is exactly a semicircular head over a square base. §8.

### P6 — A 1px rule is drawn with `scaleX`, never with `width`

The masthead underline, the ledger row rule and the scroll progress bar are
all a 1px element at `scaleX(0)` with a `transform-origin`. Transform stays
on the compositor; animating `width` on a hairline relayouts and shimmers.
§9.3.

---

## 1. The scroll engine

### 1.1 One loop, one property

The whole of the page's scroll motion is this, at `index.html:379-436`:

```js
function paint() {
  queued = false;
  var vh = window.innerHeight;
  for (var i = 0; i < scenes.length; i++) {
    var r = scenes[i].getBoundingClientRect();
    var span = r.height - vh;
    var p = span > 0 ? clamp01(-r.top / span) : (r.top < mid ? 1 : 0);
    if (Math.abs(p - (s._p || 0)) > 0.0008) {
      s._p = p;
      s.style.setProperty('--p', p.toFixed(4));
    }
  }
  /* … active section, then --doc on .progress */
}
function request() { if (!queued) { queued = true; requestAnimationFrame(paint); } }
window.addEventListener('scroll', request, { passive: true });
```

`scenes` is `[data-scene]` — the four chambers, nothing else. The aperture,
the ledger and the seal are not scenes and get no `--p`.

`p = -r.top / (r.height - vh)`. A chamber is taller than the viewport; its
`.pin` child is `position: sticky; top: 0`. So `-r.top` is exactly how far the
sticky child has been held, and the ratio is the pin's progress. **No
`scrollY`, no offset arithmetic, no cached layout** — the browser's own
`getBoundingClientRect` is the source of truth, which is why a resize needs no
recomputation of anything.

### 1.2 Why the property is per chamber and not per element

`--p` is set on the `<section class="chamber">`. Every animated layer inside
it inherits the value and consumes it in a `calc()`:

```css
.chamber { --p: 0; }                                   /* the fallback */
.slat  { transform: translateY(calc(var(--dir) * var(--p) * var(--amp) * 1vh)); }
.arch  { clip-path: inset(calc(26% - var(--p) * 26%) …); }
.type__wrap { transform: scale(calc(1 + var(--p) * var(--type-zoom, 4.2))); }
```

One JS write feeds seven slats, an image, a ring, two marginalia columns and a
copy block. The engine has no knowledge of any of them: **adding a fifth
transformation is CSS only**, provided the section carries `data-scene` and is
taller than the viewport.

`.chamber { --p: 0 }` is the fallback that makes the page correct before the
first frame and with JS off — every `calc()` resolves against 0 rather than
against `<invalid>`, which would drop the whole declaration.

### 1.3 `--p` is not registered, and that is the point

`02-aperture.css` registers four properties:

```css
@property --ap-s { syntax: "<percentage>"; inherits: true; initial-value: 44%; }
@property --ap-t { syntax: "<percentage>"; inherits: true; initial-value: 34%; }
@property --mx   { syntax: "<percentage>"; inherits: true; initial-value: 50%; }
@property --my   { syntax: "<percentage>"; inherits: true; initial-value: 44%; }
```

Those four *must* be typed: `--ap-s`/`--ap-t` are interpolated by
`@keyframes aperture-open`, and `--mx`/`--my` move a radial-gradient mask
centre. An untyped custom property interpolates discretely — the aperture
would snap open instead of widening.

`--p` is **not** registered `[arbitrage]`. It is written 60 times a second
from the scroll; it must never carry a duration of its own. Register it and
the first person to add `transition: --p .3s` gets a chamber that lags the
finger by 300 ms and overshoots on flick — the single worst failure mode of
scroll-driven motion.

### 1.4 The write threshold

```js
if (Math.abs(p - (s._p || 0)) > 0.0008)
```

`0.0008` of a 1,440 px span is **1.15 px of scroll** `[mesuré]`. Below that the
style write is skipped entirely. `p.toFixed(4)` matches the threshold: four
decimals is the finest value the guard will ever let through, so no write is
ever a no-op string.

### 1.5 Why one loop and not one per section

Four independent observers or four rAF loops would each schedule their own
frame; the browser would coalesce them, but the *ordering* between them is
undefined, and each would carry its own layout read. Here the single `paint()`
does everything a frame needs — four progress values, the active-section
scan, and the document progress bar — in one pass, and `queued` guarantees at
most one scheduled frame no matter how many scroll events arrive.

The loop reads `getBoundingClientRect()` and writes `--p` **interleaved**, per
chamber, rather than reading all four then writing all four. That is a textbook
read-write interleave. Measured cost of the full pass at 1440 × 900:
**median 0.6 ms, p95 0.7 ms, max 0.8 ms** `[mesuré]`, against a 16.7 ms budget.
It is fine at four chambers. It is the first thing that would need splitting at
twenty.

### 1.6 What the loop also does, and what it does not

| Does | Line |
|---|---|
| Writes `--p` on each chamber | 405 |
| Picks the active section (nearest centre, gated to `top < .75vh && bottom > .25vh`) | 409 |
| Sets `aria-current` on `[data-nav]` links | 418 |
| Writes `--doc` on `.progress` (`scaleX` of the top bar) | 427 |

It does **not** attach any listener to a chamber, does not observe
intersections for the motion, and is skipped for `--p` entirely when `STATIC`
is true — the active-section scan still runs, so navigation stays live under
reduced motion. §11.

---

## 2. The pinned chamber — the shared frame

### 2.1 Four rules, reused four times

```css
.chamber { position: relative; --p: 0; }
.pin {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
  display: grid;
}
```

The chamber is the scroll track, the pin is the stage. Everything inside the
pin is `position: absolute; inset: 0` and layered by `z-index`. There is no
per-chamber structure to learn: the four transformations differ only in what
they put inside that box.

### 2.2 `svh`, not `vh`, and `clip`, not `hidden`

`height: 100svh` on the pin: on mobile the URL bar collapse changes `vh`
mid-scroll, which would resize the pinned stage while it is pinned. `svh` is
the small viewport and never moves `[arbitrage]`.

`html, body { overflow-x: clip }`, with the reason written in
`00-tokens.css:104`: `overflow: hidden` makes `body` a scroll container, and a
scroll container breaks `position: sticky` on iOS Safari. `clip` suppresses the
overflow without creating the container. Getting this wrong unpins every
chamber on one platform only.

`html` also carries no `scroll-behavior: smooth`, with the reason stated at
`00-tokens.css:91`: the page is very tall, and an animated jump to a plate
reads as a fault. Measured height is **14.87 viewports** on desktop and
**13.39** on mobile `[mesuré]` — the code comment says "~12", which understates
it.

### 2.3 Chamber lengths are unequal on purpose

| Chamber | Desktop height | ≥720px rule | Mobile height | Scroll span (desktop) |
|---|---:|---|---:|---:|
| I — slats | 2,340 px | `260vh` | 1,688 px | 1,440 px |
| II — arch | 2,250 px | `250vh` | 1,688 px | 1,350 px |
| III — pan | 2,790 px | `310vh` | 2,026 px | 1,890 px |
| IV — type | 2,610 px | `290vh` | 1,941 px | 1,710 px |

`[mesuré]` at 1440 × 900 and 390 × 844. Below 720 px every chamber drops to
`200/200/240/230vh`.

The **span** column is what matters: it is the denominator of `--p`. Plate III
gets 1,890 px of scroll because its transformation is a horizontal pan of more
than a viewport width and needs the room; plate II gets 1,350 px because an
aperture widening is over quickly. **The chamber length is the pacing dial**,
and it is the only one — no `duration` appears anywhere in the four
transformations.

---

## 3. Transformation I — slat shear

*The still life comes apart into seven vertical slats that slide against each
other.*

### 3.1 Mechanism

Seven copies of the same image, each in a `overflow: hidden` column, each
showing a different seventh of it:

```css
.slats {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: clamp(2px, 0.45vw, 9px);
  --n: 7;                          /* must equal the number of .slat children */
  transform: scale(calc(1 - var(--p) * 0.05));
}
.slat { overflow: hidden; transform: translateY(calc(var(--dir) * var(--p) * var(--amp) * 1vh)); }
.slat img {
  position: absolute; inset-block: 0; left: 0;
  width: calc(var(--n) * 100%);    /* 7 × the slat, i.e. the full plate */
  max-width: none;
  height: 100%; object-fit: cover;
  transform: translateX(calc(var(--i) * -100% / var(--n)));
}
```

`--i` is the slat index, set inline in the markup (`style="--i:0"` … `--i:6`).
The image is sized to seven slats and slid left by `i/7` of its own width, so
each column shows the right seventh of a single continuous picture. At `p = 0`
the seven columns reassemble into one plate, broken only by the gap.

Measured at 1440 px: slat width `(1440 − 6 × 6.48) / 7 = 200.16 px`, image
width **1,401 px** = 7 × 200.16 `[mesuré]`. At 390 px: slat 54 px, image
**378 px** `[mesuré]`.

### 3.2 The seven amplitudes are hand-set, and irregular

```css
.slat:nth-child(odd)  { --dir: -1; }
.slat:nth-child(even) { --dir:  1; }
.slat:nth-child(1) { --amp: 26; }   /* → −234 px at 900 vh */
.slat:nth-child(2) { --amp: 15; }   /* → +135 px */
.slat:nth-child(3) { --amp: 34; }   /* → −306 px  [mesuré] */
.slat:nth-child(4) { --amp: 20; }   /* → +180 px */
.slat:nth-child(5) { --amp: 30; }   /* → −270 px */
.slat:nth-child(6) { --amp: 12; }   /* → +108 px  [mesuré] */
.slat:nth-child(7) { --amp: 24; }   /* → −216 px */
```

Direction alternates strictly; **amplitude does not** `[arbitrage]`. The
sequence 26/15/34/20/30/12/24 has no pattern a viewer can complete. A
regular ramp (10/20/30/40…) reads as a machine fanning cards; an irregular one
reads as something coming apart. The largest adjacent differential is slat 3
against slat 4: 486 px of separation on a 900 px viewport, 54% of the height.

The unit is `1vh` multiplied by a unitless number, not a `px` value — the shear
scales with the viewport and never needs a breakpoint.

### 3.3 The counter-scale

`.slats` shrinks from `scale(1)` to `scale(0.95)` across the same `--p`. As the
slats fly apart, the whole assembly steps back. Without it the shear reads as
the image growing; with it, as the image receding into a set of plates. Five
percent is enough to be felt and not enough to expose the pin's edges — the
slats keep overflowing the stage, which is why they can move 306 px without
revealing a seam at the top.

### 3.4 What travels, and what breaks

**Transposable.** The whole procedure is one image, `n` columns, an index
inline, and one progress variable. It works for any `n`, any image, any
container. The `--n` / child-count coupling is documented in the CSS itself,
which is the only thing keeping it honest.

**Fragile.** `--n` is a hand-maintained duplicate of the DOM child count; add
an eighth `.slat` and every column shows the wrong slice with no error
anywhere. The `width: calc(var(--n) * 100%)` also needs `max-width: none`,
because the global `img { max-width: 100% }` reset would otherwise silently
clamp it back to one slat width — the failure is a correctly-laid-out page
showing seven copies of the same seventh.

---

## 4. Transformation II — arch aperture

*A keyhole widens into the full arch.*

### 4.1 Mechanism

One `clip-path: inset()` whose four offsets and radius are all driven by `--p`:

```css
.arch {
  position: absolute; inset: 0;
  clip-path: inset(
    calc(26% - var(--p) * 26%)      /* top    26% → 0 */
    calc(38% - var(--p) * 38%)      /* right  38% → 0 */
    calc(12% - var(--p) * 12%)      /* bottom 12% → 0 */
    calc(38% - var(--p) * 38%)      /* left   38% → 0 */
    round var(--arch-head) var(--arch-head) 4px 4px
  );
}
```

Measured at 1440 × 900: `inset(26% 38% 12% round 999px 999px 4px 4px)` at
`p = 0` — a window 345.6 × 558 px — resolving to `inset(0%)` at `p = 1`
`[mesuré]`. At `p = 0.5` the computed value is `inset(12.9974% 18.9962%
5.9988%)` `[mesuré]`, i.e. the interpolation is exactly linear in `p`, because
it is arithmetic and not an animation.

Left and right are equal, top is 26% and bottom 12% — so the keyhole is
**not centred vertically**: it opens from a point slightly above centre, the
way a door in a facade sits above its threshold `[arbitrage]`.

### 4.2 The counter-scale, again, and reversed

```css
.arch img { transform: scale(calc(1.32 - var(--p) * 0.32)); }
```

`1.32 → 1` `[mesuré]`. This is the reverse of the slats' counter-scale and it
does more work than it looks. A clip-path reveals *more of the same pixels*;
without the scale, widening the window would simply uncover picture that was
already there, which reads as a curtain. Zooming the image out at the same rate
the window widens keeps the subject the same apparent size throughout, so the
frame opens *around* a stable image. **This is the difference between "a mask
grew" and "an aperture opened".**

### 4.3 The ring inherits the clip

```css
.arch::after {
  content: ""; position: absolute; inset: 0;
  clip-path: inherit;
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--marigold) 70%, transparent);
  opacity: calc(1 - var(--p) * 0.75);
}
```

`clip-path: inherit` is the whole trick: the marigold hairline is a 1px inset
shadow on a full-size box, clipped by the *same* path as the image, so it
traces the arch exactly and follows it as it opens. No second path to keep in
sync, no SVG. The same pattern appears on `.aperture__window::after`.

The ring fades from 1 to 0.25, not to 0 — the frame is never fully denied,
which matches the system's claim that the arch is the only crop.

### 4.4 The marginalia leave before the copy arrives

```css
.marginalia { opacity: clamp(0, calc(1 - var(--p) * 2.4), 1); }   /* gone at p = 0.417 */
.marginalia div:first-child { transform: translateX(calc(var(--p) * -8vw)); }
.marginalia div:last-child  { transform: translateX(calc(var(--p) *  8vw)); }
.chamber--arch .scene__copy {
  opacity: clamp(0, calc((var(--p) - 0.45) * 3.4), 1);            /* in from p = 0.45 */
  transform: translateY(calc((1 - var(--p)) * 3vh));
}
```

The italic marginal notes slide outward (±115.2 px at 1440) and are gone at
`p = 0.417`; the plate title starts at `p = 0.45`. **A 0.033 gap of pure
image, with no text on screen at all.** That gap is the point of the chamber.

The `clamp(0, …, 1)` idiom is how every fade in this page is written: no
keyframes, no JS class toggling, one expression whose in-point and slope are
both readable at a glance. `(p − a) × b` — `a` is when it starts, `1/b` is how
long it takes.

### 4.5 What travels, and what breaks

**Transposable.** Clip-path inset with a `round` radius, driven by one
variable, plus a counter-scaled image, plus `clip-path: inherit` for the frame.
Nothing here is specific to an arch — replace the radius and it is a porthole,
a lens, a letterbox.

**Fragile.** `clip-path` on a large element is a paint-time operation; four
copies of this on screen at once would be expensive. It works here because
only one chamber is ever unclipped at a time. Also, `clip-path` clips
*everything*, including any focus ring on a focusable descendant — the arch
holds an `<img>` and no interactive content, which is what makes it safe.

---

## 5. Transformation III — torn counter-pan

*The valley is cut along one hairline; the halves run in opposite directions
while colour wipes back over the lower one.*

The richest of the four, and the one built out of the most independent parts.

### 5.1 The tear is a gap, not a cut

```css
.pan { background: var(--ink-abyss); }             /* what shows through the tear */
.pan__band--top { clip-path: inset(0 0 55.9% 0); } /* visible 0 → 44.1% */
.pan__band--bot { clip-path: inset(44.5% 0 0 0); } /* visible 44.5% → 100% */
.pan__seam { top: 44.6%; height: 1px; background: marigold 55%; }
```

44.1% and 44.5% do not meet. Measured on a 900 px pin: the top band ends at
**396.9 px**, the bottom band starts at **400.5 px**, leaving **3.6 px** of
`--ink-abyss` showing between them, with the marigold hairline at **401.4 px**
`[mesuré]`.

That 0.4% gap is the tear `[arbitrage]`. Two abutting bands would read as a
split-screen; a hairline of ink between them reads as a page torn and the two
pieces slid apart. The marigold rule sits on the *lower* lip of the tear rather
than in its middle — the eye reads a lit edge with a shadow above it, which is
what a torn edge looks like.

### 5.2 The counter-pan

```css
.pan__band img { width: 190%; max-width: none; }           /* < 720px */
.pan__band--top img { transform: translateX(calc(var(--p) * -47%)); }
.pan__band--bot img { transform: translateX(calc(-34% + var(--p) * 34%)); }

@media (min-width: 720px) {
  .pan__band img { width: 170%; }
  .pan__band--top img { transform: translateX(calc(var(--p) * -41%)); }
  .pan__band--bot img { transform: translateX(calc(-28% + var(--p) * 28%)); }
}
```

| | Desktop 1440 | Mobile 390 |
|---|---|---|
| Image width | 170% = **2,448 px** | 190% = **741 px** |
| Top half travel | 0 → **−1,003.7 px** | 0 → **−348.3 px** |
| Bottom half travel | **−685.4 px** → 0 | **−251.9 px** → 0 |
| Relative displacement | **1,689 px = 1.17 viewport widths** | **600 px = 1.54 viewport widths** |

`[mesuré]` at both widths. Three things are worth naming:

1. **The halves are counter-phased, not just offset.** The top ends where it
   started minus 41%; the bottom *starts* at −28% and ends at 0. They meet in
   register at exactly one moment (`p = 0.406` for the top's −16.6% against
   the bottom's −16.6%) and are maximally torn at both ends.
2. **The overscan is what makes it possible.** 170% width with `max-width:
   none` means there is always picture outside the frame; the pan never
   exposes an edge.
3. **Mobile pans harder, not softer.** 1.54 viewport widths against 1.17.
   The narrower the screen, the more of the landscape has to cross it for the
   pan to read as a pan at all `[arbitrage]`.

### 5.3 The colour wipe is a mask on a duplicated layer

The bottom band holds **two** copies of the plate. The upper copy is the
duotone, and it is the one that is masked away:

```css
.pan__duo {
  mask-image: linear-gradient(90deg,
    transparent 0 calc(var(--p) * 122%),
    #000 calc(var(--p) * 122% + 15%) 100%);
}
.pan__duo img {
  filter: grayscale(1) sepia(1) hue-rotate(146deg) saturate(3.4)
          brightness(0.52) contrast(1.15);
}
```

Measured at `p = 0.5`: `transparent → 61.01%`, `#000 from 76.01%` `[mesuré]`.
The transparent stop travels 0 → 122% while the soft band stays a constant
**15% wide** — so the wipe has a fixed-width feather that never stretches. The
duotone is fully gone at `p = 0.697` (when `p × 122 + 15 = 100`), leaving the
last 30% of the chamber to the pan alone.

Masking the *duotone* rather than the colour is the choice that matters
`[arbitrage]`. The colour copy is always fully painted underneath; the wipe
only removes a treatment. Fading a colour layer *in* over a grey one goes
through a washed-out midpoint; removing a grey layer from over a colour one
does not.

The duotone recipe is worth keeping: `grayscale(1)` flattens to luminance
first, `sepia(1)` re-tints it to a single hue, then `hue-rotate` aims that hue
(146deg → teal) and `saturate(3.4)` drives it hard. **Four filters in that
order turn any image into a two-colour print** with only `hue-rotate` to change
per palette.

### 5.4 The word is an outline crossing the tear

```css
.pan__word {
  top: 44.6%; left: 50%;
  translate: -50% -50%;
  transform: translateX(calc(38vw - var(--p) * 78vw));
  color: transparent;
  -webkit-text-stroke: 1.4px color-mix(in oklab, var(--bone) 78%, transparent);
  paint-order: stroke fill;
}
```

Measured at 1440: `+547.2 px → −576 px`, a travel of 1,123 px = 0.78 viewport
widths, crossing centre at `p = 0.487` `[mesuré]`. Font size resolves to
**160 px** at 1440 and **58.9 px** at 390 `[mesuré]`.

Two independent procedures are stacked here, and both are reusable:

- **`translate` and `transform` on the same element.** `translate: -50% -50%`
  does the centring; `transform: translateX(…)` does the animation. They are
  separate properties in modern CSS and compose without either overwriting the
  other — which is what lets a centred element be animated by transform without
  recomputing the centring offset into every keyframe.
- **A stroke-only headline.** `color: transparent` plus `-webkit-text-stroke`
  gives a caption that never covers the picture it captions. The site's own
  comment says so at `04-chapters.css:323`.

### 5.5 What travels, and what breaks

**Transposable.** Every part separately: the 0.4% ink tear, the counter-phased
overscan pan, the constant-feather wipe mask, the four-filter duotone, the
outline word.

**Fragile.** The three percentages 55.9 / 44.5 / 44.6 are three
hand-synchronised values for one seam; change the composition and all three
move together or the tear misaligns with its own hairline. `-webkit-text-stroke`
is prefixed-only with no standard equivalent shipping — it degrades to
invisible text (`color: transparent`), not to visible text, so it must stay
`aria-hidden` and non-load-bearing, which it is.

---

## 6. Transformation IV — letterform plate

*ELYSIAN filled with the temple, then zoomed and defocused until only the
plate is left.*

### 6.1 The letterform is an SVG clip path, not `background-clip: text`

```html
<svg class="type__svg" viewBox="0 0 1400 420" preserveAspectRatio="xMidYMid meet">
  <defs>
    <clipPath id="elysianType">
      <text x="700" y="330" text-anchor="middle"
            textLength="1330" lengthAdjust="spacingAndGlyphs"
            font-family="'Bodoni Moda', ui-serif, serif"
            font-size="360" font-weight="700">ELYSIAN</text>
    </clipPath>
  </defs>
  <g clip-path="url(#elysianType)">
    <image href="assets/img/field-04-temple.webp"
           x="-60" y="-190" width="1520" height="852"
           preserveAspectRatio="xMidYMid slice"></image>
  </g>
</svg>
```

`background-clip: text` would have been shorter and is the reflex answer. It
was not used, and the reason is visible in the rest of the chamber
`[arbitrage]`: the clipped thing here is an `<image>` that must be positioned
independently of the text box (`x="-60" y="-190"` pushes the temple's portico
into the letter bowls), and the whole assembly has to survive
`transform: scale(6.4)` and `filter: blur(26px)` without the text re-rasterising
at every step. An SVG `clipPath` is resolution-independent under transform;
`background-clip: text` is a paint of a background box and blurs as a bitmap.

`textLength="1330"` with `lengthAdjust="spacingAndGlyphs"` is the other half:
it pins the word to an exact width inside the 1400-unit viewBox regardless of
whether Bodoni Moda has loaded. **A font swap cannot change the composition** —
only the letterform detail. That is the correct answer to "what if the webfont
is late" for type used as a mask.

### 6.2 The zoom and the defocus

```css
.type__wrap {
  transform: scale(calc(1 + var(--p) * var(--type-zoom, 4.2)));
  filter: blur(calc(var(--p) * var(--p) * 26px));
  opacity: clamp(0, calc((0.56 - var(--p)) * 5.4), 1);
}
@media (min-width: 720px) { .type__wrap { --type-zoom: 5.4; } }
```

Measured at `p = 1`: `scale(6.4)`, `blur(26px)`, `opacity 0` on desktop;
`scale(5.2)` on mobile via the 4.2 fallback `[mesuré]`.

The blur is **`p²`**, not `p` `[arbitrage]`. Measured at `p = 0.5`:
**6.5 px**, i.e. a quarter of the final 26 px `[mesuré]`. Linear blur would be
soft immediately and stay soft; squared blur keeps the letterform sharp through
the first half of the zoom and then loses it fast. The intent, stated in the
CSS comment, is that the in-between state read as an **optical dissolve** —
something going out of focus — rather than as a half-drawn shape.

The `var(--type-zoom, 4.2)` fallback is the mobile value, with the desktop
value as the override. Written this way, the narrow case needs no media query
of its own.

### 6.3 The handover, in order

| `--p` | Event | Expression |
|---:|---|---|
| 0 | Plate visible at 26% behind the letters | `opacity: clamp(0.26, …)` |
| 0.286 | Corner labels start to go | `clamp(0, (0.58 − p) × 3.4, 1)` |
| 0.375 | Letterform starts to go | `clamp(0, (0.56 − p) × 5.4, 1)` |
| **0.514** | **Plate reaches full opacity** | `clamp(0.26, (p − 0.22) × 3.4, 1)` |
| **0.560** | **Letterform gone** | — |
| 0.580 | Corner labels gone | — |
| 0.660 | Plate title starts | `clamp(0, (p − 0.66) × 4, 1)` |
| 0.910 | Plate title full | — |

The plate is at full strength (0.514) **before** the letterform disappears
(0.560). A 0.046 overlap `[mesuré]` — about 79 px of scroll — in which both are
fully present. Sequence the other way and there is a frame of empty screen.
**Overlap the handover; never butt it.**

Alongside, three continuous ramps: `type__full` brightness `0.4 → 1`, saturate
`0.5 → 1`, scale `1.14 → 1` `[mesuré]`; and `type__stars` opacity `0.55 → 0.20`
with an independent 78 s linear drift that owes nothing to `--p`.

### 6.4 What travels, and what breaks

**Transposable.** SVG `clipPath` + `textLength` for any type-as-window; the
`p²` blur; the overlap-not-butt handover table.

**Fragile.** `filter: blur()` on an element under `scale(6.4)` is the most
expensive thing on the page — the blur radius is applied in the scaled
coordinate space. It survives because the layer is `opacity: 0` well before the
blur reaches its maximum, so the browser never actually composites a 26 px blur
of a 6.4× surface. Reorder those two ramps and the chamber drops frames.

---

## 7. The four handovers, side by side

Every chamber hands the screen from image to copy on a different schedule, and
none of them use the same in-point. This is the table to steal:

| Chamber | Copy fades in from | Reaches full at | Window of image alone |
|---|---:|---:|---|
| I — slats | `p = 0.12` | `p = 0.37` | first 12% |
| II — arch | `p = 0.45` | `p = 0.744` | first 45% |
| III — pan | always visible | — | none |
| IV — type | `p = 0.66` | `p = 0.91` | first 66% |

`design-system.md` states the principle ("there is no single blanket
`opacity 0 + translateY(20px)` rule anywhere"). This is the implementation:
four different `clamp(0, (p − a) × b, 1)` expressions, and one chamber that
opts out entirely because its copy sits on a permanent scrim and the picture
moves underneath it.

---

## 8. The arch as the only crop

One token, five declaration sites, zero other shapes:

```css
--arch-head: 999px;
```

| Consumer | File:line | Use |
|---|---|---|
| `.aperture__window` | `02-aperture.css:81` | `clip-path: inset(… round --arch-head --arch-head 0 0)` |
| `.arch` (plate II) | `04-chapters.css:170` | same, with `4px 4px` feet |
| `.specimen` | `03-ledger.css:227` | `border-radius: --arch-head --arch-head 2px 2px` |
| `.seal__arch` | `05-seal.css:28` | `border-radius: --arch-head --arch-head 0 0` |
| `.seal__arch::before` | `05-seal.css:40` | the same arch, inset 8%, as a second rule |

**Why 999px works.** When a corner radius exceeds half the box, CSS reduces
all radii proportionally until they fit. On a box wider than it is tall, that
lands on exactly half the width — a semicircle. So one absurd value produces a
correct semicircular head at **every** size, with no `50%` (which would give an
ellipse that distorts with the box) and no per-element arithmetic. Measured on
`.aperture__window`: a 1,181 × 828 px window whose head is a true semicircle
`[mesuré]`.

The feet differ deliberately: `0 0` for the full-bleed windows, `4px 4px` for
the plate II arch, `2px 2px` for the pointer specimen. The head is a system
constant; the foot is a per-element detail.

The wax gauge (§14) is the fifth arch and the only one drawn as a path rather
than a radius, because it has to be strokeable:

```
M 12 180 L 12 94 A 82 82 0 0 1 176 94 L 176 180
```

Square base, semicircular head, 429.6 px long `[mesuré]`. Same shape, different
technique, because a `border-radius` cannot carry a `stroke-dashoffset`.

---

## 9. The masthead

Added after the side rail was removed. `01-shell.css:201-298`.

### 9.1 Anatomy

```css
.masthead {
  position: fixed;
  z-index: 69;
  top: 0;
  left: var(--rail);
  right: 0;
  display: flex;
  align-items: center;
  gap: var(--s5);
  padding: var(--s3) var(--gutter);
  border-bottom: 1px solid var(--rule);
  background: color-mix(in oklab, var(--ink-abyss) 62%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
```

| Measured | 1440 × 900 | 390 × 844 |
|---|---:|---:|
| Height | 50.6 px | 50.6 px |
| Horizontal padding | 72 px (`5vw`) | 16 px (`--s4` override) |
| Nav gap | 43.2 px (`clamp(16px, 3vw, 48px)`) | 16 px |
| Folio `No. 001` | visible | `display: none` |

`[mesuré]`. The height is identical at both widths and is **not** compensated
anywhere: `.aperture` is `100svh` starting at `y = 0`, so the bar overlays the
top of the opening plate rather than pushing it down. That is deliberate — the
bar is a mark on the plate, not a shelf above it `[arbitrage]`.

Three entries, named from the page's own vocabulary — **Ledger / Plates /
Seal**, not Home / About / Contact. The CSS comment states the reason at
`01-shell.css:205`: a generic menu would read as a template dropped onto a
fiction.

### 9.2 The rule is drawn from the centre out

```css
.masthead__nav a::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: -2px;
  height: 1px;
  background: var(--marigold);
  transform: scaleX(0);
  transform-origin: 50% 50%;
  transition: transform 0.34s var(--ease-out);
}
.masthead__nav a:hover::after { transform: scaleX(1); }
```

Measured: `height: 1px`, `transform: matrix(0,0,0,1,0,0)`, `transform-origin:
32.73px 0.5px` (the element's centre), `transition: transform 0.34s`
`[mesuré]`.

The full-width element already exists and is already positioned; only its
scale changes. Origin at 50% means the stroke grows in both directions at once
— a rule being laid down under the word, not a block sliding in from one side.

### 9.3 Why `scaleX` on a 1px line and not an animation of `width`

Three reasons, in order of how much they cost:

1. **`width` is a layout property.** Every frame relayouts the pseudo-element
   and everything its box could affect. `transform` is composited: no layout,
   no paint, handed to the GPU.
2. **A 1px line is where subpixel rendering shows.** Animating `width` walks
   the box through fractional pixel widths and the browser re-rasterises the
   hairline at each one, so the rule visibly shimmers as it grows. A scaled
   layer is rasterised once and stretched.
3. **`width` cannot grow from the centre.** It grows from whichever edge the
   box is anchored to. Centre growth would need `width` *and* `left` animated
   in lockstep — two layout properties instead of zero.

The same procedure runs the ledger rows (`.row::before`, `transform-origin:
0 50%` — from the left, because a ledger reads left to right) and the scroll
progress bar (`.progress { transform: scaleX(var(--doc, 0)) }`). **One
technique, three origins.**

### 9.4 No burger at any width

Three entries and a wordmark fit at 390 px `[mesuré]` — verified on the render,
with the folio dropped below 640 px and the wordmark's tracking reduced from
`0.34em` to `0.2em` to buy the space:

```css
@media (max-width: 640px) {
  .masthead { padding-inline: var(--s4); gap: var(--s4); }
  .masthead__folio { display: none; }
  .masthead__mark { letter-spacing: 0.2em; }
  .masthead__nav { gap: var(--s4); }
}
```

Four adjustments and the menu never needs to collapse. **A burger is a
consequence of item count, not of screen width** — the design decision that
avoids it was taken upstream, at "three sections", not here.

### 9.5 A defect worth recording: `aria-current` never fires on the masthead

The scroll engine sets `aria-current` by matching `[data-nav]` against the id
of the active `[data-scene]`. The scenes are `field-i` … `field-iv`. The
masthead's values are `ledger`, `plates`, `seal` — **none of which is a scene
id**.

Walked the entire document at 450 px intervals: the masthead links carry
`aria-current` at **no** scroll position; only the mobile pocket's four
`field-*` links ever do `[mesuré]`.

So the masthead's marigold underline is a hover/focus affordance only, never a
"you are here" marker, and `.masthead__nav a[aria-current="true"]` is dead CSS.
The root cause is upstream of the naming: `.aperture`, `.ledger` and `.seal`
carry no `data-scene`, so they are not in the engine's `scenes` list and can
never *be* the active id. (`.masthead__mark` carries no `data-nav` at all and
is outside the mechanism entirely — that one is deliberate; a wordmark is not a
section marker.)

Not fixed here — this file documents, it does not refactor. Recorded because
the *procedure* (one loop, one id match, one attribute) is sound and worth
copying, and its one failure mode is exactly this: **the nav's `data-nav`
values and the sections' ids are a hand-maintained contract with nothing
checking it.**

---

## 10. `--rail` — a token deliberately held at zero

```css
:root { --rail: 0px; }
```

Measured `0px` at 1440 and at 390 `[mesuré]`, with no media query anywhere
raising it. The side spine it used to drive was removed in favour of the
masthead; the token stayed.

Four consumers, all still wired:

| Consumer | File:line | Property |
|---|---|---|
| `.progress` | `01-shell.css:79` | `left: var(--rail)` |
| `main` | `01-shell.css:89` | `padding-left: var(--rail)` |
| `.colophon` | `01-shell.css:135` | `margin-left: var(--rail)` |
| `.masthead` | `01-shell.css:212` | `left: var(--rail)` |

Measured computed values: `main` padding-left `0px`, `.progress` left `0px`,
`.masthead` left `0px` `[mesuré]`.

**The procedure.** Removing a layout feature by deleting its rules scatters the
knowledge of where it used to attach across five files; the next person
reinstating it has to rediscover all five. Removing it by **setting its token
to zero and leaving every consumer wired** means the reinstatement is one
value. The comment at `00-tokens.css:80-83` says exactly this, and it is the
reason the token is not dead code.

Two accuracies worth noting:

- That comment names three consumers (`main`, `.progress`, `.masthead`).
  `.colophon` is a fourth `[mesuré]`, and it uses `margin-left` rather than
  `padding-left` — correct, since the colophon has its own background and a
  padding-based offset would tint the gutter.
- The `.masthead` z-index comment reads `under .progress (71) and the rail
  (70)`. There is no rail; `z-index: 70` is now `.pocket`
  (`01-shell.css:41`), which only exists below 1024 px. The stacking is still
  correct — the two never share a region of the screen — but the comment names
  something that no longer exists.

---

## 11. `prefers-reduced-motion` handled as a second layout

This is the part of the page most worth copying wholesale, and it is not a
checkbox.

### 11.1 The static state ships in the markup

```html
<html lang="en" class="no-motion">
```

```html
<script>
(function () {
  var d = document.documentElement;
  var m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!m || !m.matches) { d.classList.remove('no-motion'); }
})();
</script>
```

The class is **removed**, never added `[arbitrage]`. Consequences:

- No-JS and reduced-motion resolve to the same stylesheet, written once
  (`07-static.css`).
- There is no flash: the page is never briefly animated before the preference
  is read, because the animated state is the one that has to be opted into.
- The check is inline in `<head>`, before any body content parses.

The listener at `index.html:372` re-toggles the class if the preference changes
mid-session, and flips the `STATIC` flag the scroll engine reads.

### 11.2 Each chamber gets a chosen end state, not `p = 0`

This is the substance. `06-reduced.css` only strips durations
(`animation-duration: 0.01ms !important` and friends). The layout is
`07-static.css`, and it picks a *different* frozen `--p` per chamber:

```css
.no-motion .pin { position: static; height: auto; min-height: 100svh; }
.no-motion .chamber--slats, .no-motion .chamber--arch,
.no-motion .chamber--pan,   .no-motion .chamber--type { height: auto; }

.no-motion .chamber--slats { --p: 0;   }   /* still life assembled */
.no-motion .chamber--arch  { --p: 1;   }   /* arch fully open */
.no-motion .chamber--pan   { --p: 0.5; }   /* mid-pan, colour already revealed */
.no-motion .chamber--type  { --p: 0;   }   /* plate held inside the letterforms */
```

Verified in the render: computed `--p` of `0`, `1`, `0.5`, `0` respectively
`[mesuré]`. **Each value is the most legible frame of that transformation, and
they are not the same frame.** Freezing all four at 0 would give an assembled
still life (good), a keyhole (useless), an untorn valley (dull) and a
letterform (good). Freezing all four at 1 would give exploded slats, an open
arch, a fully panned valley and a blank screen.

Alongside, per-chamber layout fixes that only the static case needs — because
with `.pin` no longer positioned, absolutely-placed layers resolve against
`.chamber` instead:

```css
.no-motion .chamber { overflow: clip; }               /* the clip moves up with them */
.no-motion .chamber--slats .scene__copy { opacity: 1; inset: auto 0 0 0; … }
.no-motion .marginalia { display: none; }
.no-motion .pan__duo { display: none; }               /* the wipe has no meaning frozen */
.no-motion .type__wrap { position: relative; opacity: 1; transform: none; padding-block: …; }
.no-motion .chamber--type .pin { display: block; padding-bottom: var(--s8); }
```

### 11.3 What it costs and what it yields

| | Animated | Reduced |
|---|---:|---:|
| Document height (1440 × 900) | 13,386 px | **7,153 px** |
| In viewports | 14.87 | **7.95** |
| Chamber I / II / III | 2,340 / 2,250 / 2,790 px | 900 / 900 / 900 px |
| Chamber IV | 2,610 px | 1,057 px |

`[mesuré]`. **The page is 47% shorter.** That is the real payoff and the reason
this is a layout and not a switch: someone who has asked for less motion is not
asked to scroll 15 viewports of pinned sections that no longer do anything.

The scroll engine still runs — only the `--p` write is skipped
(`if (!STATIC)`), so `aria-current`, the progress bar and the ledger all keep
working. And the seal (§14) short-circuits: `if (STATIC) { breakSeal(); }`
opens it on a single press instead of a 900 ms hold.

---

## 12. The skip link, and the one line that saves it

```css
.skip {
  position: fixed;
  z-index: 90;
  top: var(--s4); left: var(--s4);
  padding: var(--s3) var(--s5);
  background: var(--marigold);
  color: var(--ink-abyss);
  transform: translateY(-200%);
  transition: transform 0.24s var(--ease-out);
}
.skip:focus-visible { transform: none; }
```

Measured: hidden at `translateY(-89.59px)` on a 44.8 px box — exactly −200%.
On `Tab`, `transform: none`, box at **top 16, left 16, 225.1 × 44.8 px**
`[mesuré]`.

`translateY(-200%)` rather than `display: none`, `visibility: hidden` or
`left: -9999px`: the element stays in the accessibility tree and in the focus
order, stays hit-testable, and the reveal is a compositor transform with a
duration.

**`z-index: 90` is the line that makes it work.** The masthead is `z-index: 69`
and occupies `top: 0` to `top: 50.6px` across the full width. The revealed skip
link sits at `top: 16px`, height 44.8 — **entirely inside that band**. Confirmed
by hit-test: `elementFromPoint` at the link's centre returns `.skip`
`[mesuré]`. At any z-index below 69 it would be focused, announced, and
completely invisible behind a blurred bar — the worst class of accessibility
bug, because every automated check passes.

Full stacking order, for reference:

| z | Element |
|---:|---|
| 90 | `.skip` |
| 71 | `.progress` |
| 70 | `.pocket` (mobile only) |
| 69 | `.masthead` |
| 65 | `.specimen` |
| 60 | `.grain` |
| 55 | `.vignette` |

Note that `.grain` (60) and `.vignette` (55) sit **below** all the navigation
chrome and above all the content — the print texture lies on the plates, not on
the interface `[arbitrage]`.

---

## 13. Pointer procedures

Three, all built the same way: a pointer event writes a custom property inside
a `requestAnimationFrame` guard, and CSS does the rest.

### 13.1 The lantern

```css
.aperture__lamp {
  background-image: url("../img/field-01-stilllife.webp");
  filter: invert(1) hue-rotate(184deg) saturate(1.9) contrast(1.08);
  opacity: 0;
  transition: opacity 0.65s var(--ease-out);
  mask-image: radial-gradient(circle var(--lamp-r, 210px) at var(--mx) var(--my),
    #000 0 30%, rgba(0,0,0,0.4) 56%, transparent 74%);
}
.aperture[data-lit="true"] .aperture__lamp { opacity: 0.9; }
```

The lamp is the *same plate*, inverted, revealed through a radial mask whose
centre is `--mx`/`--my`. Not a light overlay — a second exposure of the same
negative. This is why the four `@property` registrations exist: without a typed
`<percentage>`, the mask centre would jump between values instead of tracking.

Measured at rest: `opacity: 0` `[mesuré]`, mask centre at `150% 50%` — off
canvas. `.aperture` sets `--mx: 150%` as its own initial value, overriding the
registered 50%, so the lamp is parked outside the frame *and* transparent until
a pointer arrives. Two independent guards for one effect `[arbitrage]`; the
CSS comment says it plainly: "the lamp only exists once a pointer has actually
picked it up".

On touch (`@media (hover: none)`) the lamp is given `opacity: 0.9` and a 19 s
`lamp-drift` keyframe animating `--mx`/`--my` through four positions, with a
smaller radius (150 px vs 210 px). **The behaviour is not removed on touch, it
is re-authored as an ambient loop.**

### 13.2 The pointer specimen

A 200 × 250 arch-cropped thumbnail that follows the cursor across the ledger:

```js
sx = Math.min(e.clientX + 26, window.innerWidth - 216);
sy = Math.min(Math.max(e.clientY - 126, 12), window.innerHeight - 262);
```

Clamped on both axes so it can never leave the viewport — `−216` and `−262` are
the element's own size plus a 16 px margin, hardcoded. `pointer-events: none`,
`transform: translate3d(var(--sx), var(--sy), 0)` and an opacity/scale pair on
`[data-on]`. Hidden entirely under `@media (hover: none), (max-width: 899px)`.

### 13.3 The ledger bleeds, and the touch fallback

Hovering a row lights the matching full-bleed image behind the ledger. On touch
there is no pointer to follow, so the same state is driven by position:

```js
if (rows.length && window.IntersectionObserver && !matchMedia('(hover: hover)').matches) {
  var io = new IntersectionObserver(…, { rootMargin: '-46% 0px -46% 0px', threshold: 0 });
}
```

`rootMargin: '-46% 0px -46%'` collapses the root to an 8%-tall band across the
middle of the screen. A row is "hovered" when it crosses that band. **This is
the general procedure for porting any hover affordance to touch**: not "disable
it", but "replace the pointer with the viewport centre".

---

## 14. The wax gauge

The only press-and-hold control in the page, at `05-seal.css:87-111` and
`index.html:528-596`.

### 14.1 The gauge

```html
<path class="wax__fill" pathLength="1" d="M 12 180 L 12 94 A 82 82 0 0 1 176 94 L 176 180"/>
```

```css
.wax__fill {
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--fill, 0));
  transition: stroke-dashoffset 0.12s linear;
  vector-effect: non-scaling-stroke;
}
```

`pathLength="1"` is the whole procedure. The path's real length is
**429.6 px** `[mesuré]`; declaring `pathLength="1"` tells SVG to treat it as
1 unit long for all dash arithmetic, so `stroke-dasharray: 1` /
`stroke-dashoffset: 1 − fill` works with `fill` as a plain 0 → 1 progress. **No
`getTotalLength()` call, no JS-computed dash values, and the path can be
reshaped without touching a line of script.**

`vector-effect: non-scaling-stroke` keeps the 1.5 stroke at 1.5 px regardless of
the viewBox scale.

### 14.2 The hold

```js
var HOLD = 900;
function step() {
  var v = Math.min(1, (performance.now() - started) / HOLD);
  setFill(v);
  if (v >= 1) { breakSeal(); return; }
  hraf = requestAnimationFrame(step);
}
```

Measured: pressed and held for 480 ms, `--fill` read **0.536** `[mesuré]` —
linear in wall-clock time, as `performance.now()` deltas rather than a frame
count, so the gauge is honest on a throttled tab.

`pointerdown` / `pointerup` / `pointercancel` / `pointerleave` all bound, plus
`keydown`/`keyup` on Enter and Space with `e.repeat` guarded — so the control
is holdable from the keyboard, which press-and-hold widgets routinely are not.

### 14.3 Three escape hatches

1. **`if (STATIC) { breakSeal(); return; }`** — under reduced motion a single
   press opens it, no hold.
2. **Two failed attempts open it anyway.** `taps >= 2` calls `breakSeal()`
   regardless of hold length, with the comment "never trap anyone".
3. **`<noscript>` removes the seal entirely** and reveals what it guards:
   `.wax { display: none }`, `.reveal { opacity: 1; visibility: visible }`.

After opening: `aria-expanded="true"`, and focus moves to the email field after
780 ms (60 ms when static) `[mesuré]` — the delay is tuned to the reveal's own
0.28 s + 0.7 s transition, so focus lands on something already visible.

The wax and the reveal share one grid cell (`.seal__stage > * { grid-area: 1/1 }`)
with a `min-height: 236px`, so breaking the seal causes **no layout shift**.

---

## 15. The print surface

Two fixed full-screen layers make the page read as a printed object rather than
a screen. Both are pure CSS and both are worth lifting.

### 15.1 Grain

```css
.grain {
  position: fixed;
  inset: -50%;                       /* oversized so the drift never exposes an edge */
  z-index: 60;
  pointer-events: none;
  opacity: 0.24;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,…feTurbulence baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'…");
  animation: grain-drift 5.4s steps(6) infinite;
}
```

Three decisions to keep:

- **`feTurbulence` as a data URI**, not a PNG. Zero network cost, resolution
  independent, and `baseFrequency` is a dial rather than a re-export.
- **`steps(6)`**, not a smooth easing. Film grain jumps between frames; a
  smoothly drifting noise field reads as a moving texture, which is wrong.
- **`inset: -50%`** so the ±3% drift never brings an edge into view.

Under `no-motion`: `animation: none; opacity: 0.18` — the texture stays, the
movement goes, and the opacity drops because a static grain at 0.24 reads
heavier than a moving one.

### 15.2 Riso misregistration

```css
.u-riso {
  text-shadow:
     0.02em  0.014em 0 color-mix(in oklab, var(--coral) 42%, transparent),
    -0.018em -0.012em 0 color-mix(in oklab, var(--verdigris) 30%, transparent);
}
```

Two offset shadows in **opposite directions**, in two different hues, at
sub-pixel `em` offsets. That is exactly what a two-plate misregistration looks
like: one ink pushed one way, another pushed the other. Offsets in `em` mean it
scales with the type and never needs a size-specific override.

The wordmark extends the same idea to four shadows, the last two being ink
rather than colour — `0 0.03em 0.14em` and `0 0 0.42em` of `--ink-abyss` — so
the letterforms survive the brightest part of the plate underneath. Stated in
the CSS at `02-aperture.css:263`: "enough ink under the letterforms to survive
the brightest part of the plate".

---

## 16. The scroll budget

What the four transformations actually cost the reader.

| | Desktop 1440 × 900 | Mobile 390 × 844 | Reduced 1440 × 900 |
|---|---:|---:|---:|
| Document height | 13,386 px | 11,301 px | 7,153 px |
| In viewports | **14.87** | **13.39** | **7.95** |
| Chambers, total | 9,990 px | 7,343 px | 3,757 px |
| Chambers, share | **74.6%** | **65.0%** | 52.5% |
| Aperture | 900 px | 844 px | 900 px |
| Ledger + seal + colophon | 2,496 px | 3,114 px | 2,496 px |

`[mesuré]`. Three-quarters of the desktop page is pinned chambers. Mobile
shortens the chambers (200/200/240/230vh against 260/250/310/290) while the
ledger and colophon grow taller as their columns stack — so the *share* drops
ten points without anything being removed.

---

## 17. What would break this elsewhere

Ordered by how quietly it fails.

1. **`--n` and the `.slat` count.** A hand-maintained duplicate with nothing
   checking it. Adding a slat produces a plausible-looking wrong image.
2. **`[data-nav]` values against `[data-scene]` ids.** Already broken for the
   masthead (§9.5) with no visible error and no console warning.
3. **The three pan seam percentages.** 55.9 / 44.5 / 44.6 encode one seam in
   three places.
4. **`max-width: none` on the overscanned images.** The global `img
   { max-width: 100% }` reset silently defeats both the slat shear and the pan
   without it.
5. **`overflow: clip` vs `hidden` on `body`.** Fails on iOS Safari only, and
   fails by unpinning every chamber — invisible in desktop testing.
6. **`filter: blur()` under a large `scale()`.** Survivable here only because
   the layer reaches `opacity: 0` before the blur peaks (§6.4).
7. **A `transition` added to `--p`.** Would require registering it first, which
   is why it is not registered — but a future `@property --p` declaration
   anywhere in the sheets re-opens the door.
8. **Chamber count against the read-write interleave.** 0.8 ms at four
   chambers `[mesuré]`; the pattern does not scale linearly and would need
   splitting into a read pass and a write pass well before twenty.

---

## 18. What this file does not establish

- **Frame rate under real scrolling.** The 0.6 / 0.7 / 0.8 ms figures in §1.5
  are the cost of the `paint()` body — four `getBoundingClientRect` calls and
  four style writes — measured in isolation in a synthetic loop. They are not
  the cost of the frame: the paint and composite of a 6.4× scaled 26 px blur, or
  of two full-viewport `clip-path` layers, are not included and were not
  profiled.
- **Behaviour on Safari and Firefox.** Everything above was measured in
  Chromium. `backdrop-filter`, `mask-image`, `-webkit-text-stroke` and
  `@property` all have per-engine histories; the prefixed pairs in the sheets
  suggest the author expected this, but I did not verify it.
- **The lamp under a real pointer.** Measured only at rest (`opacity: 0`, mask
  centre parked at 150%) and from the CSS. The synthetic pointer path was not
  driven, so the `0.65s` reveal and the drift-vs-track handover on touch are
  read from the code, not from a render.
- **The four plates' provenance.** `design-system.md` lists four source URLs
  for the images. They were not fetched or compared; the palette's claim to be
  sampled from them is taken on the design system's word.
