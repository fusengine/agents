# Design reference — mainframe.app

Corpus of **techniques**. Structure, rhythm, typography, color system and
animation techniques are taken from the source.

**Texts are taken verbatim.** This isn't carelessness: the exact length of a
heading dictates its line breaks, its block height, and therefore the whole
vertical rhythm around it. A paraphrased heading breaks the layout even when
the measured typography is correct. Headings, subheadings, navigation and
button labels, tags and figures are therefore elements of **layout**, not
editorial content.

**Sources of the measurements** — page scraped locally:
`mainframe.app/index.html` (150,951 bytes) + `_next/static/chunks/3lztth2y7b3--.css`
(126,218 bytes, compiled Tailwind v4). Values come from the utility classes
set on the HTML, from inline `style` attributes, and from the CSS's `:root`
block.

---

## 1. The motion system — the key takeaway

### The structuring fact: **2 `@keyframes` shipped by the framework, 0 used on the page**

`@keyframes spin` and `@keyframes pulse` exist in the compiled stylesheet
(they're Tailwind's defaults), but the page sets **no** `animate-*` class at
all — verified: `grep -c '^animate-'` over the HTML's classes returns **0**.

Everything that moves on this page is a **transition between two states**.
Nothing is "played". That's what makes this reference interesting: a page
that looks alive without a single declared animation.

**Breakdown of the 75 occurrences** (`grep -o 'transition' index.html | wc -l`):
43 in `class` attributes, 21 in `style` attributes, 11 in the render payload
that duplicates the `class` attributes. The 43 break down into 12
`transition-opacity`, 11 `transition-[opacity,filter]`, 5
`transition-transform`, 5 `transition-colors`, 5
`transition-[color,opacity,transform]`, 2 `transition-[color,opacity]`, 2
`[transition:…]` shorthands, 1 `transition-[filter,transform]`.
The 21 inline ones: 5 × `transition-duration:1000ms`,
5 × `transition-delay:0ms;transition-duration:850ms` (2 each),
5 × `background-color:hsl(…);transition-duration:1000ms`, 1 × `transition-delay:0s`.

Also: 26 `duration-*` classes, 29 `ease-*`, 40 `will-change-*`, 0 `animate-*`.

### 1.1 Durations: 6 values, **two regimes separated by a gap**

| Duration | Occurrences | What it paces | Properties |
|---|---|---|---|
| **150 ms** | 12 | hover/focus of any textual element, primary button background, playback pill | `opacity`, `color`, `background-color`, `transform` |
| **200 ms** | 5 | primary button geometry, tab color switch | `scale`, `transform`, `color` |
| — | — | **nothing between 200 and 400** | — |
| **400 ms** | 5 | active/inactive state of the brand-rail cards (100% / 25%) | `opacity` |
| **800 ms** | 3 | halos on load, pricing card background on hover | `opacity`, `filter`, `transform` |
| **850 ms** | 6 | scroll reveal, carousel panel entrance | `opacity` + `filter` |
| **1000 ms** | 10 | color layer and play button of each panel | `opacity` + `filter` |

**The rule that emerges:** duration isn't chosen by the "importance" of the
element, it's chosen by **who triggered the movement**.

- **"Response" regime — 150 / 200 ms.** The user has acted (hover, focus,
  click). The feedback must be immediate. Only touches `opacity`, `color`,
  `background-color`, `scale`.
- **"Reveal" regime — 400 → 1000 ms.** Nothing was clicked: an element
  enters the scene (scroll, load, carousel recentering). Only touches
  `opacity`, `filter`, and sometimes 8px of `translateY`.

The gap between 200 and 400ms isn't an oversight: it separates the two
regimes. No intermediate value comes to blur the reading.

### 1.2 Curves: 3 values, never a bounce

| Curve | Occurrences | Role |
|---|---|---|
| `cubic-bezier(0, 0, .2, 1)` | 14 | the `ease-out` class. Sharp deceleration, instant start. Halos, playback pill, brand rail, pricing card background. |
| `cubic-bezier(0.23, 1, 0.32, 1)` | 10 | **reserved for media layers that appear**: the color layer and play button of each panel. Much longer deceleration — the element "settles". |
| `cubic-bezier(.4, 0, .2, 1)` | the rest | the `--default-transition-timing-function` token, applied **implicitly** everywhere no `ease-*` class is set. Symmetric, discreet. |

No elastic curve, no `overshoot`, no `cubic-bezier` with a y-component > 1
**except** `0.23, 1, 0.32, 1` — whose control point at `y=1` means a flat
arrival, not a bounce.

**Trap worth knowing: the `ease` class (5 occurrences) is dead.** It's set on
the carousel's 5 panels, but the compiled stylesheet contains **no
`.ease{}` selector** — only `.ease-out` and the bracketed variant. These 5
elements therefore fall back to the default curve. A reproduction that
interpreted `ease` as the native CSS keyword (`cubic-bezier(.25,.1,.25,1)`)
would be wrong. Same case for `blur-0`, which also has no generated rule.

### 1.3 The central technique: the three-variant reveal

The resting state is written **on the element** (`style` attribute), a state
class lifts it. Three variants measured, distinguished only by their
**starting blur**:

| Variant | Measured resting state | Duration | Occurrences |
|---|---|---|---|
| fade | `opacity:0; filter:blur(8px)` | 1000 ms | 6 |
| rise | `opacity:0; filter:blur(4px); transform:translateY(8px)` | 850 ms | 4 |
| media | `opacity-0 blur-[4px]` (classes) | 850 ms, reveal curve | — |

Final state common to all three: `opacity:1; filter:blur(0px); transform:none`.

The blur is the signature. It's never a fade alone, never a move alone: it's
**opacity + blur**, and the translation, when it exists, is tiny (8px).

Trigger: `IntersectionObserver` (Baseline widely available since March 2019).
`animation-timeline: view()` isn't used — and shouldn't be: not yet widely
available.

### 1.4 The hover technique: **opacity replaces color**

5 occurrences of `hover:opacity-70`, 2 of `group-hover/…:opacity-70`. No
navigation link changes color on hover: it drops to 70% opacity. Contrast
decreases instead of increasing — that's counter-intuitive, and it's what
gives the site its restraint.

The page's 6 hover states:

| Measured selector | Effect | Duration |
|---|---|---|
| `hover:opacity-70` on the nav link (×5) | `opacity: .7` | 150 ms |
| `group-hover/prominent:opacity-70` on the primary button label (×2) | `opacity: .7` | 150 ms |
| `hover:text-label-primary` on the showcase tab (×5) | secondary text → primary | 200 ms |
| `hover:scale-105` / `active:scale-95` on the playback pill (×5) | `scale(1.05)` then `scale(0.95)` | 150 ms |
| `group-hover:[filter:saturate(1.2)]` + `group-hover:[transform:scale(1)]` on the pricing card | `saturate(.4)→1.2` and `scale(1.2)→1` | 800 ms |
| `active:scale-[0.97]` on the primary button (×2) | `scale(0.97)` | 200 ms |

**The primary button is the page's finest technique**: a single declaration,
two different cadences depending on the property —
`background-color 150ms ease-out, scale 200ms ease-out, transform 200ms ease-out`.
The background responds faster than the geometry.

**The pricing card is the only "rich" hover**: at 800ms, on the `filter` and
`transform` of a background image. It's also the only place where hover
*adds* intensity (saturation); everywhere else it removes it.

### 1.5 `will-change` declared down to the exact property

40 occurrences, and never `will-change: auto` nor `will-change: all`:
`will-change-transform` (14), `will-change-[opacity,filter]` (11),
`will-change-[opacity,transform]` (10), `will-change-[opacity]` (5).
The declaration lists **exactly** the properties that will transition.

### 1.6 The carousel panel: three layers, three cadences

This is the richest component on the page. A panel stacks **three** elements
that transition independently — and it has **no** active/inactive state:
it's an appearance, not a selection.

| Layer | Measured classes | Cadence |
|---|---|---|
| panel | `transition-[opacity,filter] ease will-change-[opacity,filter] aspect-video w-[min(80vw,640px)] opacity-0 blur-[4px]` + `style="transition-delay:0ms;transition-duration:850ms"` | 850 ms, default curve (`ease` is dead) |
| color layer | `absolute inset-0 transition-[opacity,filter] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,filter] opacity-100 blur-0` + `style="background-color:hsl(…);transition-duration:1000ms"` | 1000 ms, reveal curve |
| play button | `absolute inset-0 transition-opacity ease-[cubic-bezier(0.23,1,0.32,1)] opacity-100` + `style="transition-duration:1000ms"` | 1000 ms, reveal curve |

Each panel carries, **beneath its image**, a flat fill in the thumbnail's
dominant hue. The 5 measured pairs, in DOM order:

| Image | Background hue |
|---|---|
| `landing-carousel-design-thumb` | `hsl(0 0% 14%)` |
| `landing-carousel-docs-thumb` | `hsl(28 22% 48%)` |
| `landing-carousel-features-thumb` | `hsl(220 14% 30%)` |
| `landing-carousel-marketing-thumb` | `hsl(240 60% 30%)` |
| `landing-carousel-roadmap-thumb` | `hsl(150 20% 28%)` |

Inside the button, a round pill of 48px: `bg-background/70`, `shadow-sm`
(which the project redefines as `0px 2px 4px 0px #00000005`, not the
framework's default shadow), `backdrop-blur` (= `blur(8px)`),
`transition-transform duration-150 ease-out`, `hover:scale-105 active:scale-95`.
It's the only element on the site that **grows** on hover.

### 1.6 bis The only active/inactive system: the brand rail

Contrary to what you might assume, the carousel at the top of the page
selects nothing. The only active/inactive state is in the "brand" card rail:
`transition-opacity duration-[400ms] ease-out`, the centered card at
`opacity-100`, the other four at `opacity-25`, width
`min(calc(100vw - 144px), 400px)`. Its container is itself a reveal:
`duration-[850ms] ease-out`, resting state `opacity-0 blur-sm` (i.e.
`blur(8px)`).

### 1.7 Reduced motion

`@media (prefers-reduced-motion: reduce)` is mandatory on every effect.
Watch out for a trap specific to this system: neutralizing the duration
isn't enough. The resting states sit at `opacity: 0`, so the **resting
state itself must be neutralized**, or the content stays invisible.

---

## 2. Color

**Forced dark** theme: `<main class="dark … bg-black" style="color-scheme:dark">`.
The page background is **pure black `#000`**, not the theme's `--background: #0a0a0a`.

Four-level label system (Apple-style convention), all in translucent white:

| Role | Measured value (dark) | Measured value (light) |
|---|---|---|
| primary text | `#fff` | `#000c` (80%) |
| secondary text | `#ffffffa3` (64%) | `#000000a3` |
| tertiary text | `#fff6` (40%) | `#0006` |
| quaternary text | `#737373` | `#0000003d` |
| border | `#ffffff1a` (10%) — but the page sets **12%** everywhere | `#0000001a` |
| separator | `#ffffff0a` (4%) | `#0000000a` |
| field background | `#ffffff1a` | `#0000000a` |
| surface | `bg-white/[0.08]` | `#f8f8f8` |
| selection | `#1886ff33` | same |

**No accent color at all.** Not a single blue, green, or orange in the
interface: the palette is strictly achromatic. All the color on the page
comes from the **images** (halo, card backgrounds, discs). It's a strong
choice, and an easy one to miss when reproducing.

Three white opacities structure everything: **8%** (surfaces and internal
rims), **12%** (borders and separators), **20%** (internal rim of the
featured element).

A single radius: `--radius: .625rem` = **10px**, everywhere, except the
primary button which is a pill.

---

## 3. Typography

**Inter**, served by the source from `rsms.me/inter/inter.css`, full stack:
`"InterVariable", "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
"Segoe UI", sans-serif`. `antialiased` on the `body`.

**Custom** scale — not the framework's own. The base is **15px**, not 16:

| Role | Size | Line-height | Usage |
|---|---|---|---|
| small | 0.8125rem (13px) | 1rem | — |
| **body** | **0.9375rem (15px)** | 1.25rem | all running text, navigation, buttons, footer |
| card title | 1.0625rem (17px) | 1.25rem | card `h2`, tabs, plan name |
| accent | 1.5rem (24px) | 1.75rem | price, closing heading |
| main heading | 1.75rem (28px) | 2rem | the `h1`, **with no responsive variant** |

Notable points:

- **The `h1` is 28px from mobile to desktop.** No `sm:text-*` class on the
  heading. It's the most counter-current typographic choice on the page.
- **The closing heading (24px) is smaller than the main heading (28px).**
  The page never re-amplifies.
- **Zero `letter-spacing`.** No `tracking-*` class anywhere on the page.
- Weights: 700 reserved for the two large headings only, 600 for the 16
  card titles, 500 for navigation / buttons / prices, 400 for the rest.
- `text-wrap: balance` on the hero heading and subheading.
- One tight line-height is added by hand: card paragraphs switch to a fixed
  `1.25rem` instead of the inherited line-height.

---

## 4. Structure and rhythm

### 4.0 Backgrounds — there are none at the section level

A counter-intuitive point, verified exhaustively: **no section carries a
background.** The only background declarations on the entire page are:

| Declaration | Occurrences | Carrying element |
|---|---|---|
| `bg-black` | 2 | the main container and the bottom area |
| `bg-background` | 1 | the `<body>` |
| `bg-white/[0.08]` | 11 | the 10 media frames + the flagship pricing card |
| `bg-button-secondary-bg` | 5 | the 5 carousel panels |
| `bg-background/70` | 5 | the 5 playback pills |
| `bg-white` | 2 | the 2 primary buttons |
| 2 background images | 2 | the "voice" card and the flagship pricing card |

Everything else is **transparent over black**. The value variations you
think you see between sections come solely from the two halos and the
images. Flattening this by adding a background per section would destroy the
page's depth.

### 4.1 Each section's own geometry

Sections don't share a single template: each has its own geometry.

| Section | Container classes (literal reading) |
|---|---|
| hero | `flex w-full flex-col items-center text-center pb-16 pt-8 sm:pb-32` — full width, no ceiling |
| content | `mx-auto flex w-full max-w-4xl flex-col px-6 pb-28` — **without** a gutter |
| pricing | `mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pb-28` — **with** `gap-8` |
| closing | `px-6 py-28` — the 56rem ceiling is on the inner block, not the section |
| footer | `border-t border-white/12 px-6 py-8` — the only section carrying a rule |

### 4.2 Common measurements

| Measure | Measured value |
|---|---|
| content width | 56rem (896px) |
| text block / pricing grid width | 36rem (576px) |
| side margin | 24px, **identical on mobile and desktop** |
| header height | 72px |
| section bottom inset | 112px |
| gap between blocks within a section | **128px**, a single value |
| internal gutters | 12 / 16 / 24 / 32 / 48 / 64 px |
| breakpoints | 640px and 768px, nothing else |

Section order **from the source**: header → hero → full-width carousel →
card trio → showcase → attribute cards → "brand" card → pricing → closing →
footer. The recode ships the 5 sections in bold; the other three are detailed
in §5.
**header** · **hero + carousel** · "brand" card + rail · **pricing** ·
**closing + footer**.

Notable structural techniques:

- **Two halos, one single image.** The same file is used at the top (140vh,
  1100px floor) and at the bottom (900px), each cropped by a vertical alpha
  mask facing opposite directions. 2000px centered frame, deliberately
  overflowing the viewport.
- **Single border + separators that switch axis.** The card trio has a
  single outer border; the separators are horizontal on mobile, vertical
  past 768px.
- **Systematic inner rim** on every media element:
  `shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]`, as a non-clickable div at
  `rounded-[inherit]`. It replaces the border, which would eat a pixel of
  the image.
- **Deliberate overflow.** The carousel spans the entire window width; the
  showcase images are 52rem inside a narrower column; the discs of the
  first attribute card poke out at the top (`overflow-visible`) while the
  neighboring card crops (`overflow-hidden`).
- **Order reversal on mobile** on pricing: the paid plan moves to the top
  below 640px, and back to second above it.
- **Gradient masks wherever something is cut off**: both halos, and the
  brand strip (`transparent 0% → black 30% → black 70% → transparent 100%`).
  Never a hard cut.
- **Focus ring** of 2px on 15 interactive elements. Watch out: the source
  displays it at `rgb(115 115 115 / 0.2)`, nearly invisible on black. The
  recode raises the contrast and flags it — it's one of the rare points not
  to copy as is.

---

## 5. Section-by-section detail

**All the sections of the source are shipped**, in order. This part gives
the measured values section by section, including for those whose render
involves a flagged arbitration.

### 5.1 Bordered card trio

- `grid overflow-hidden rounded-lg border border-black/[0.06] divide-y divide-black/[0.06] dark:border-white/[0.12] dark:divide-white/[0.12] md:grid-cols-3 md:divide-x md:divide-y-0`
- a single outer border; internal separators switch axis at 768px;
- **watch the mechanics**: the framework's divide utility targets
  `> :not(:last-child)` and sets a **bottom** border, not `* + *` with a top
  border. Identical render, different selector;
- card: `flex min-h-44 flex-col gap-4 p-6` (176px height floor, 16px gutter,
  24px inner margin);
- icon `size-6 text-label-tertiary`, title `text-lg font-semibold`,
  text `text-base leading-5 text-label-secondary`.

### 5.2 "Discs" + "waveform" row

No animatable technique measured: both cards are static in the source.

- card: `relative flex h-64 flex-col justify-end rounded-lg border border-black/[0.06] p-6 dark:border-white/[0.12]`;
- **overflow differs between the two cards in the row**: `overflow-visible`
  for the discs one (they poke out at the top), `overflow-hidden` for the
  other;
- disc container: `absolute bottom-[76px] left-1/2 h-[260px] w-[366px] -translate-x-1/2`;
- discs: `absolute rounded-full will-change-transform` at
  `bottom-0 left-[106px] size-[196px]`, `bottom-16 left-0 size-[92px]`,
  `bottom-[124px] left-[302px] size-16`. Each nests 4 levels including a
  `[clip-path:circle(50%)]` and a `tabindex="0"` node with `style="touch-action:none"`
  (they're draggable with the mouse);
- **the content of these discs is shipped EMPTY in the HTML**: it's a client
  component rendered after hydration. The source carries no color, no
  transition, no `mix-blend-mode` on them. On screen, it displays round
  **photographic portraits** there — irreproducible from static HTML, no URL
  appears anywhere for them. The recode therefore places dark flat fills and
  flags it `[arbitrage]` in `motion.js`;
- waveform background: `absolute inset-0 bg-[url('/landing-voice-waveform.jpeg')] bg-cover opacity-15 [background-position:calc(50%_-_100px)_center]`
  with `[mask-image:linear-gradient(to_bottom,transparent_-16px,black_104px,transparent_224px)]`;
- on top, a masked SVG carries `style="filter:saturate(1.35)"` and a
  rectangle with `style="mix-blend-mode:overlay"` — these two values belong
  to the waveform SVG, **not** to the discs.

### 5.3 Showcase with a sticky table of contents

This is the tallest section on the page — on its own, roughly 40% of the
scroll. It's also where the `style="opacity:1;transform:translateX(0px)"`
(×6) and `style="opacity:0.4;transform:translateX(0px)"` (×4) are found — on
the media frames `bg-white/[0.08] will-change-[opacity,transform] aspect-video h-auto w-full`.
These values have nothing to do with the carousel at the top of the page.

**The table of contents is an accordion**, not a plain list: the active
entry unfolds its paragraph inside an `overflow-hidden` container, and it's
the only place on the site to declare `transition-property: height, opacity`
— with no explicit duration, hence at the framework's default duration
(150ms) and default curve. The `border-b border-white/12` rule is carried by
the ACTIVE entry only: it follows the selection instead of separating all
entries.

The rest of the values:

- two complete HTML trees served in parallel, one hidden by media query — no
  CSS rearrangement, two distinct layouts;
- grid `minmax(0, 0.72fr) minmax(0, 1fr)`, top-aligned, 48px gutter;
- left column `position: sticky`, `top: 8rem`, `height: 22rem`, 24px left
  indent;
- tabs: 17px / weight 600, inactive in secondary text, active and hovered in
  primary, `transition: color 200ms`, 12% rule between each;
- right column: 16/9 frames at **52rem**, overflowing their column, 24px
  gutter, each with the 8% inner rim;
- narrow variant: vertical stack, 48px gutter, full-width image, 12px
  caption below the title.

---

## 6. Images

All images are called as remote URLs on `https://mainframe.app/…`. The
carousel thumbnails go through the framework's optimizer:
`_next/image?url=%2Flanding-carousel-<name>-thumb.jpg&w=1920&q=75` — the
query string is kept as is. No binary is copied into the recode.

---

## 7. What remains irreproducible

Four points can't be measured from the static HTML, and are flagged
`[arbitrage]` wherever they appear:

1. **The discs' content.** Client component shipped empty; the source loads
   portraits there whose URLs appear nowhere in the HTML. Rendered as dark
   flat fills.
2. **The waveform.** Masked SVG generated at runtime (`<image>` + `<rect>`
   with `filter:saturate(1.35)` and `mix-blend-mode:overlay`, both measured).
   Rendered with fixed-height bars reproducing the profile and gradient
   observed on screen.
3. **The carousels' positioning.** The source uses a library that computes
   offsets in JS; the recode centers via CSS margins and a starting position.
4. **The logo.** Proprietary mark, replaced by a neutral shape of the same
   proportions.

A fifth point is an accepted departure: the focus ring. The source sets it
at `rgb(115 115 115 / 0.2)`, invisible on black. The recode keeps the
geometry (2px) and raises the contrast.

---

## 8. File organization

| File | Role |
|---|---|
| `index.html` | structure, in the exact section order of the source |
| `styles.css` | tokens + all cadences and curves |
| `motion.js` | behaviors: reveals, accordion, carousels. **Paces nothing** |
| `tokens-mainframe.md` | this document |

The separation is deliberately strict: `motion.js` only ever toggles a class
or writes a height in pixels. No duration, no curve is declared there. That's
the condition for the transition system to stay legible and editable from
CSS alone — and it's exactly what the source does.

**A `motion.js` trap that applies to any reproduction**: the DOM scroll API
(`scrollIntoView`, `scrollBy`, `scrollTo`) **does not consult
`prefers-reduced-motion`**, unlike CSS animations. The preference must be
read by hand via `matchMedia`. And `behavior: 'instant'` must be written
explicitly: the default `'auto'` silently follows the `scroll-behavior`
declared in CSS.

---

## 9. Coverage check

| Measure | Source | Recode |
|---|---|---|
| page height at 1440 | ~5,700px | **5,752px** (+1%) |
| structural tags | 377 | **298** (79%) |
| horizontal overflow | — | none, at 1440 and at 390 |

The HTML byte-count ratio (24,526 / 150,951 ≈ 16%) is **not** a valid
coverage measure here: the source file contains ~37,700 bytes of render
payload that duplicates all the content as JSON, and every node there
carries 200 to 500 characters of utility classes. The ratio in **structural
tags** is the comparable measure. The 79-tag gap comes from the framework's
wrapper elements and the discs' four nesting levels, with no visual
counterpart.
