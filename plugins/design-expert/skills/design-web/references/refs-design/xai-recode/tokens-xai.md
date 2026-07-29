# Procedures recorded on x.ai

Working document: analysis notes on the x.ai homepage, for a corpus of
design procedures. This is not a site meant to be published.

**Method.** The snapshot contains the 3 CSS sheets *and* the Universal
Sans fonts, but no JS. The source page was therefore **served and
rendered locally**, then measured via the DevTools protocol. The box
sizes quoted here are measurements of that render, never estimates; the
class values are literal `grep`s in `index.html` and `34vqqpzyw0m1c.css`
(noted CSS-P).

**The text is reproduced verbatim**, and that's a design decision, not a
content one. On a page that has only 9 images, the exact length of a
title dictates its line break, hence its block's height, hence the
vertical rhythm of the entire page. "Frontier AI models / for everything
you build." fits on two lines in a 42 rem frame; any longer paraphrase
jumps to four lines and shifts everything that follows. Only the prose
paragraphs could be shortened — with the rendered line count held
constant.

Deliverable: `index.html` · `styles.css` · `motion.js` · this file.

**Measured coverage** (actually rendered DOM, at 1440 px):

| | Source | Recode | |
|---|---:|---:|---|
| Elements | 765 | 805 | 105% |
| Words of text | 423 | 449 | 106% |
| Characters of text | 2,836 | 3,052 | 108% |
| Document height | 3,904 px | 3,884 px | 99.5% |
| DOM bytes | 114,237 | 50,930 | 45% |

A word on the last line, because it's misleading: comparing *file* bytes
would give 12% — but the source's `index.html` weighs 212 KB, half of
which is the duplicated React payload, invisible at render time. And for
the same DOM, the source writes its styles as utility classes (100 to
300 characters per node) where this recode uses named classes. **Byte
weight measures the writing method, not the coverage.** The first three
rows of the table, on the other hand, measure what is actually
reproduced.

---

## 1. Skeleton — order and proportions

Measured at 1440 px, a **3,904 px** document.

| # | Block | Height | What defines it |
|---|---|---:|---|
| 1 | `<header class="group fixed … z-50 duration-200">` | 64 | `bg-background/85` scrim + `blur(12px)` |
| 2 | `<div class="home-hero-pt relative">` | 1215 | title block 319 + bento 572 |
| 3 | `<section>` — an interface | 661 | text / code window duo |
| 4 | `<section class="relative overflow-hidden">` — numbers | 432 | grid pattern + own rhythm |
| 5 | `<section>` — publications | 475 | the flow's only images |
| 6 | `<section>` — offerings | 682 | `border-t`, centered title |
| 7 | `<footer>` | 439 | `border-t`, 7 categories across 5 columns |

Two things that aren't guessable and need to be recorded:

- **The hero is not a `<section>`** but a `<div class="home-hero-pt">`,
  and it contains the bento. The bento belongs to the hero, not to a
  following section — hence the absence of `py-16` rhythm between the
  title and the cards.
- **The numbers banner has its own vertical rhythm**: `py-20 sm:py-28
  lg:py-36` (5/7/9 rem) where every other section uses `py-16 sm:py-24`
  (4/6 rem). It's the page's only rhythm departure, and it's deliberate.

---

## 2. The transition system

### 2.1 What makes the signature

**182 triggers, 2 curves, 5 duration tiers.** No animation library (no
occurrence of `rive`, `lottie`, `gsap`, `framer-motion`, `lenis` in the
HTML). The page feels alive while almost nothing actually *plays*:
everything goes through state transitions between two stable values. A
played animation imposes its own tempo; a state transition lets the user
dictate it.

### 2.2 Breakdown of the 182 triggers

| Property group | Occ. | Share |
|---|---:|---:|
| `transition-colors` (color, background-color, border-color, fill, stroke) | 133 | 73% |
| `transition-transform` | 17 | 9% |
| `transition-all` | 16 | 9% |
| `transition-opacity` | 8 | 4% |
| `transition` (default set) | 8 | 4% |

**Almost three-quarters of the transitions move nothing.** They change a
color. This is the single most important fact in this whole survey.

### 2.3 The five tiers

72 triggers carry an explicit duration; the other 110 inherit Tailwind's
default of 150 ms.

| Tier | Occ. | What it governs |
|---:|---:|---|
| 150 ms | 15 + default | Controls: link, button, tab — the response to the finger |
| 200 ms | 3 | Page chrome: the header hairline on scroll |
| 300 ms | 25 | Labels *inside* a hovered surface |
| 500 ms | 26 | The surface itself: border, shadow, scale |
| 700 ms | 3 | Ornament passing through: a card's diagonal reflection |

**The bigger the element, the slower it is.** A label changes twice as
fast as the card that contains it, and the card twice as fast as the
reflection sweeping across it. Hovering a card triggers all three at
once — the perceived stagger comes from no `delay` at all, only from this
hierarchy.

### 2.4 The two curves

| Curve | Use |
|---|---|
| `cubic-bezier(.4, 0, .2, 1)` — default, 19 rules of the CSS-P | every color and state change |
| `cubic-bezier(0, 0, .2, 1)` — `.ease-out`, 17 uses | everything that moves or changes scale |

Nothing else: no bounce, no `linear()`, no per-component curve.

### 2.5 Trigger → outcome table

| Trigger | Property | Start → End | Duration | Curve |
|---|---|---|---:|---|
| link hover | `color` | ink 50% → 100% | 150 ms | standard |
| solid button hover | `filter` | `brightness(1)` → `.9` | 150 ms | standard |
| ghost button hover | `background-color` | transparent → ink 5% | 150 ms | standard |
| code tab hover | `color` | `--secondary` → ink 100% | 150 ms | standard |
| announcement pill hover → its text | `color` | ink 55% → 80% | 150 ms | standard |
| pill hover → its badge | `background` + `color` | ink 6%→10%, 60%→100% | 150 ms | standard |
| keyboard focus, everywhere | `outline` | none → 2 px ink 30%, offset 2 px | — | — |
| scroll > 0 | header hairline `opacity` | 0 → 1 | 200 ms | standard |
| card hover → its title | `color` | ink 70% → 100% | 300 ms | standard |
| card hover → its link | `color` | ink 50% → 80% | 300 ms | standard |
| Build card hover → its labels | `color` | white 80%→100%, 55%→90% | 300 ms | standard |
| publication hover → its date | `color` | ink 40% → 55% | 300 ms | standard |
| publication hover → its title | `color` | ink 80% → 100% | 300 ms | standard |
| **product card** hover | `border-color` | ink 6% → **20%** | 500 ms | standard |
| **publication card** hover | `border-color` | ink 6% → **15%** | 500 ms | standard |
| product card hover | `box-shadow` | none → `shadow-lg` tinted ink 3% | 500 ms | standard |
| publication card hover | `box-shadow` | none → `shadow-md` tinted ink 3% | 500 ms | standard |
| card hover → **its whole mockup** | `transform` | `scale(1)` → `scale(1.02)` | 500 ms | ease-out |
| card hover → its reflection | `transform` | `translateX(-100%)` → `translateX(100%)` | 700 ms | ease-out |
| viewport entry, title word | `opacity` + `transform` | `0` / `translateY(45%) rotateX(-40deg)` → `1` / neutral | 500 ms | ease-out |
| viewport entry, block | `opacity` + `transform` | `0` / `translateY(16px)` → `1` / neutral | 500 ms | ease-out |

Three points that aren't guessable:

**The `scale(1.02)`: 2%.** Enough to be felt, too little to be seen as
motion. That's the calibration that separates a card that feels alive
from one that jumps.

**It isn't a decorative background that grows, it's the whole mockup.**
The `group-hover/card:scale-[1.02]` applies to the `absolute inset-0`
container holding the conversation, the terminal, or the mosaic. The
actual content breathes; only the card's footer, outside that container,
stays fixed.

**The two card families don't scale to the same tier.** The product card
goes to `hover:border-primary/20`, the publication card stops at
`group-hover/card:border-primary/15` — both starting from
`border-primary/[0.06]`. The larger frame signals itself more strongly. A
five-point alpha gap isn't guessable: it has to be recorded.

### 2.6 The little that's actually *played*

A single inline `@keyframes` in the HTML (`gridShimmerH`); the CSS-P
declares 13, most belonging to UI components absent from the homepage.
**On the homepage, only one animation plays on load**: the sweep across
the title's underline.

```
@keyframes hero-shimmer { 0% { background-position: 150% } to { background-position: -150% } }
/* played: 3000ms linear, delay 400ms, ONCE */
```

A 3 px stroke carries a rainbow gradient at `background-size: 400% 100%`,
of which only the visible window shifts. Nothing moves, no layer is
composited — it's a background position that slides. It never repeats.

### 2.7 Reduced motion

`@media (prefers-reduced-motion: reduce)` on every effect. Two traps:

1. Cutting the transitions isn't enough when the starting state is
   invisible: you have to **force the final state**, otherwise the page
   stays empty.
2. **JS scroll APIs don't apply the preference on their own.**
   `scrollBy({behavior:'smooth'})` stays smooth under `reduce` —
   unlike CSS animations. You have to read `matchMedia(...).matches`
   yourself. (`addListener()` is deprecated: listen to `change` instead.)

`animation-timeline: view()` would have been the obvious way to handle
the reveals: **dropped**, not Baseline widely available.

---

## 3. The four bento mockups

This is where the page's density plays out, and it's what you'd miss by
drawing four empty cards. The grid is `grid gap-3 sm:grid-cols-2` — four
equal cards of `h-[220px] sm:h-[280px]`, each carrying a complete
interface mockup, without a single image.

| Card | Recorded content |
|---|---|
| 1 | Five alternating conversation bubbles, `max-w-[82%] rounded-2xl px-3.5 py-2 text-[10.5px] backdrop-blur-md`, corner `rounded-br-md` or `rounded-bl-md` depending on the sender |
| 2 | A full terminal inside a `<div class="dark h-full">`: three-dot bar `size-[9px]`, truncated path, gauge, eight lines of colored output |
| 3 | A mosaic `grid-cols-3 grid-rows-2 gap-[3px]`, first cell spanning 2×2 — the bento's only images |
| 4 | A waveform — **empty container in the snapshot**, painted in JS |

Two procedures worth remembering:

**The dark-theme island.** Card 2 is black in the middle of an otherwise
light page because it contains `<div class="dark h-full">`: the theme is
remapped on a subtree. No rule is duplicated, no color is hard-coded — it's
the same set of roles, re-evaluated further down the tree. Visible
consequence: this card's labels switch to `text-white/80 → text-white`
instead of `text-primary/70 → text-primary`.

**Progressive blur at the bottom of a card.** Four stacked `<div>`s over a
**64 px** band (`h-16`, not a percentage), carrying
`backdrop-filter: blur(.5px / 1px / 2px / 4px)`, each masked by a
`mask-image` with staggered stops (0→40%, 25→60%, 50→80%, 70→95%). The
result: a gradient of **sharpness** instead of a gradient of color — the
label detaches without any veil darkening the mockup.

---

## 4. The code block

The right-hand column of the "an interface" section is one of the
densest blocks on the page, and it too contains no image.

- A block `relative p-8 sm:p-10 lg:p-12` whose background is **four
  stacked gradients** — three colored `radial-gradient`s plus a
  `linear-gradient` at 7.56° — the whole thing set to
  `transform: scale(1.2207…)` so the circles overflow the frame.
- **Seven 14 px squares** the color of the background placed at the
  corners (`left:0;top:0`, `right:14px;top:14px`, …): they eat into the
  block in a staircase pattern. No mask, no `clip-path` — opaque
  rectangles.
- The code window has **no `border`**: a `box-shadow: 0 0 0 1px …`
  stands in for a hairline, which keeps it out of the box's layout
  calculation, doubled with a drop shadow `0 18px 40px -24px
  rgba(15,23,42,.18)`.
- The tabs sit **below** the window (`mt-5`), not inside its bar.

---

## 5. Chromatic hierarchy

### 5.1 The procedure

Colors are stored as **function-less HSL triplets**:

```css
--color-jet: 0 0% 4%;                 /* not hsl(...) — just the 3 numbers */
color: hsl(var(--primaire) / .5);     /* alpha is composed at the point of use */
```

### 5.2 Thirteen tiers of a single ink

Count of `text-primary/*` occurrences in `index.html`:

| Alpha | Occ. | Observed role |
|---:|---:|---|
| 100% | 91 | titles, active label, hovered state |
| 85% | 3 | body of a sent bubble |
| 80% | 11 | publication title at rest; secondary hover target |
| 70% | 29 | text inside a surface; footer category title |
| 60% / 55% | 2 / 9 | local adjustment tiers |
| 50% | 74 | **resting state of every interactive element** |
| 45% | 3 | hero subtitle |
| 40% | 30 | overlines, metadata, dates |
| 30% | 7 | mini-stat labels, bullets |
| 25% | 2 | field placeholder text |
| 20% | 12 | separators; product card border hover |
| 10% | 2 | the most subtle hover background |

**The two tiers that carry the page are 50% and 100%**: 74 elements at
rest, 91 at full ink. The site's dominant gesture — 55 occurrences of
`hover:text-primary` — is the move from one to the other.

### 5.3 Roles and theme

| Role | Light | Dark |
|---|---|---|
| `--primary` | jet `0 0% 4%` | white `0 0% 100%` |
| `--foreground` | jet | **dove `222 19% 86%`** |
| `--background` | white | jet |
| `--card` | ivory `40 18% 97%` | charcoal `0 0% 10%` |
| `--border` | dove | shadow `221 12% 14%` |
| `--secondary` | mist `216 4% 51%` | unchanged |
| `--accent` | sunset `22 100% 51.6%` | **unchanged** |

Trap not to miss: **`--primary` and `--foreground` are two distinct
roles** that only coincide in light mode. Body text follows
`--foreground` (`body{color:hsl(var(--foreground))}`), so in dark mode
it's dove, not pure white. The `text-primary/*` utilities follow
`--primary`. Confusing the two gives a dark theme that's too contrasty,
and it looks right until you compare it side by side.

The accent never switches, and it almost never appears: across the whole
page it's only used for syntax highlighting, the three window dots, and
the announcement pill's badge. Color is reserved for a single use, not
spread around.

The neutrals are **tinted** (`221 12% 14%`, `222 19% 86%`: blue hue,
12-19% saturation), never pure greys. Only the extremes are desaturated.

---

## 6. Typographic hierarchy

### 6.1 Three families, three roles

| Role | Source | Here |
|---|---|---|
| Display | `universalSansDisplay`, `font-display: fallback` | Geist — *arbitrage* |
| Text | `universalSans`, `font-display: swap` | Geist — *arbitrage* |
| Mono | `GeistMono` | Geist Mono |

Universal Sans is proprietary. What's reproducible and worth carrying
over is the **metrics-corrected fallback**:

```css
@font-face { font-family: "universalSans Fallback"; src: local(Arial);
  ascent-override: 89.92%; descent-override: 22.73%; size-adjust: 105.67%; }
```

Arial is recalibrated to the real font's metrics: the substitution no
longer shifts the layout. Two separate sets (105.67% text, 97.8%
display).

The display loads with `font-display: fallback` and the text with
`swap` — titles accept staying in fallback rather than flashing, the body
accepts a flash rather than invisibility.

### 6.2 Scale, weight, line-heights

| Class | Value | Occ. |
|---|---|---:|
| `text-sm` | .875rem / 1.25rem | **106** |
| `text-2xl` | 1.5rem / 2rem | 8 |
| `text-3xl` | 1.875rem / 2.25rem | 6 |
| `text-4xl` | 2.25rem / 2.5rem | 5 |
| `text-5xl` | 3rem / 1 | 6 |
| `text-6xl` / `text-7xl` | 3.75rem / 4.5rem, line 1 | 4 / 3 |

**A single running-text size** — 14 px on 106 nodes. Everything else is a
title, with no soft gradation: the page jumps from 14 px to 24 px then to
48 px. The hierarchy comes not from size but from **opacity** (§5.2).

Weight: `font-medium` on **101** nodes, `font-semibold` on 2. A single
weight.

Line-height — the easiest point to miss: **`leading-relaxed` (1.625) is
set on 53 nodes**. The body's actual line-height is therefore not
`.text-sm`'s 1.25rem but 1.625. Add to that `leading-snug` (1.375,
publication titles), `leading-none` and `leading-[1.05]` (the `<h1>`).

**Two section-title sizes**, not to be conflated into one:
`text-2xl sm:text-3xl` (the majority variant) and `text-4xl sm:text-5xl`
(a single occurrence, the developers block). The latter also sets its
second line in `--secondary`: the hierarchy happens *inside* the title,
not beneath it.

Two composition details that carry the hero:

- The `<h1>` fits in **two lines** within a `max-w-2xl` (42 rem) frame.
  A longer label pushes it to four lines and breaks the whole block.
- The subtitle **deliberately overflows** that frame to stay on one
  line: `lg:w-[140%] lg:-translate-x-[14.3%]`, measured at 941 px inside
  a 672 px parent.

---

## 7. How the page holds together without images

**9 `<img>` for 212 KB of HTML**, 5 of which are 32 px thumbnails in the
collapsed mega-menu. That leaves **4 visuals in the flow**, all in the
publications, at `aspect-ratio: 1200 / 630`. The rest — hero, bento, code
block, numbers, offerings, footer — contains none. Five procedures stand
in for images:

1. **HTML/CSS interface mockups** (§3): conversation, terminal, mosaic,
   waveform.
2. **Stacked gradients** (§4) instead of a photo.
3. **A grid pattern drawn in CSS**: two crossed 1 px `linear-gradient`s,
   `background-size: 80px 80px`, clipped by
   `mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)`.
4. **Large-scale typography**: the numbers go up to `text-7xl`. At that
   size, a word *is* the image.
5. **Footer density**: 7 categories spread across 5 columns, in 2 rows.

---

## 7 bis. Four procedures recorded on the second pass

All of them were missed on a first reading, and each one changes the
render.

**Two blacks of code, not one.** The bento's terminal card is painted on
`--terminal-editor-bg` (`#151515`), the code window in the following
section on `--terminal-bg` (`#0a0a0a`). Measured: `rgb(21,21,21)` against
`rgb(10,10,10)`. Two code surfaces, two values — an editor is not a
terminal.

**The bento's terminal carries seven hues** (`--terminal-blue`, `-teal`,
`-purple`, `-green`, `-yellow`, `-dim`, `-vdim`) where the rest of the
page runs on two opacities of a single ink. It's the only place where
color is used to classify rather than decorate: the tool verb, its
argument, and its count are three decreasing values, legible without
reading the text.

**The header's composite button.** Action and chevron in a single solid
pill, separated by a hairline. The whole procedure comes down to
`align-items: stretch`: the hairline runs the full height without ever
needing to be sized. Measured at 138×36.

**The footer has nine categories across five columns.** Each column is a
`flex flex-col gap-10` containing one OR two stacked categories — hence
the two uneven rows, and the fact that "Solutions" has no neighbor below
it. Reproducing a grid of nine equal columns gives a footer twice too
wide; a grid of five columns with one category each loses four of them.

---

## 8. What isn't reproducible, and why

Three elements are **empty containers** in the snapshot: their content
is mounted at runtime by JS absent from the capture.

| Element | State in the snapshot | What was done about it |
|---|---|---|
| Header word-mark | `<canvas style="width:0;height:0">` inside a container `opacity-0 transition-opacity duration-300` | **Not reproduced.** Graphic content isn't derivable, and no `rive`/`lottie`/`gsap`/`framer-motion`/`lenis` string appears in the HTML. Only its **wrapper** is kept: a deferred render revealed by a 300 ms opacity transition. |
| "Voice" mockup | `<div class="flex h-full items-center justify-center"></div>`, empty | **Rebuilt** in JS from the CSS-P's `@keyframes waveform`, which is recordable. JS creates the bars; CSS animates them. |
| Grid pattern sweep | a layer containing only the `<style>` for `@keyframes gridShimmerH` | **Rebuilt** the same way: JS creates the bar, CSS moves it (`-45cqw → 145cqw`). |

Two other departures, deliberate:

- **The numeric counters.** The source mounts a shadow-DOM Web Component
  (`<number-flow-react>`) that scrolls each digit behind a `.25em` mask.
  It's a component, not a CSS procedure: replaced by a simple countdown,
  final value already written in the HTML.
- **Remote visuals.** The original URLs are kept as-is for
  traceability, but x.ai serves them as **403** outside its own domain.
  The frames are designed to hold up without them — which is also true
  in the source's own render.

Finally, a source bug, reproduced as-is and documented: the numbers
banner's accent halo declares
`background: radial-gradient(circle, hsl(var(--color-accent)) 0%, transparent 70%)`,
yet **`--color-accent` is declared nowhere** in the CSS-P (the variable
is named `--accent`). The gradient is invalid, the halo doesn't show.
"Fixing" it would introduce an orange smudge that the original page
doesn't have.

---

## 9. Checks performed on the render

All measured, compared against the source rendered locally.

- **Document height: 3,884 px against 3,904 px for the source** at
  1440 px, a 0.5% gap; 6,490 px against 6,583 px at 390 px, a 1.4% gap.
- No horizontal overflow: `scrollWidth == clientWidth` at 320, 390, 768,
  1024, 1440 and 1920 px. At 320 px, two code `<span>`s overflow their
  box and scroll within their `<pre>`'s `overflow-x:auto` — the page
  itself doesn't move.
- Wired transitions, computed values: link `color 0.15s` · card title
  `color 0.3s` · publication date `color 0.3s` · card
  `box-shadow, border-color 0.5s` · mockup `transform 0.5s` · tab
  `color, background-color 0.15s`.
- **Real hover dispatched** on a product card: `:hover` active, border
  `rgba(10,10,10,.2)`, shadow at 3%, title at full ink, mockup at
  `scale(1.02)`, reflection at `translateX(+1216px)`.
- Keyboard focus: `:focus-visible` active, 2 px ring at ink 30%.
- Reduced motion: nothing stays invisible, final state forced, waveform
  frozen.
- Dark theme: body at `rgb(213,217,226)` (dove, matching
  `--foreground`), card border at `rgba(255,255,255,.06)`, accent
  unchanged.
- **No console errors.** 1 single `<h1>`. 38 waveform bars and 1 sweep
  bar generated by `motion.js`.

**Tooling trap, worth knowing:** Chrome in `--headless` enforces a
minimum window width of 500 px on macOS. A screenshot requested at
390 px is rendered at 500 px CSS then downscaled into a 390 px image —
which *simulates* a perfectly convincing horizontal overflow that doesn't
actually exist. Check `document.documentElement.clientWidth` before
concluding anything from a mobile capture; `chrome-headless-shell` doesn't
have this limitation.
