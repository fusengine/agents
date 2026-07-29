# Design reference — cursor.com

Reading taken on July 27, 2026 from a local copy: `index.html` (647,707 b)
and the 4 Next.js-compiled CSS sheets.

`[relevé]` = read verbatim from the source · `[arbitrage]` = a choice made by
the author of this reference. In `styles.css`, every non-trivial value carries one of the two.

Source abbreviations:
- **M** — `15--1yty4lgos.css` (313,018 b), main sheet, carries 111 of the 152 transitions
- **B** — `0n3w.msyn~5aj.css` (68,334 b), CSS of an interactive demo, 33 transitions
- **I** — the inline `<style>` blocks of `index.html`, 8 transitions

---

## 1. What makes this source valuable

Zero animation library. No GSAP, no Framer Motion, no Lenis,
no Rive. **27 distinct `@keyframes` and 152 `transition*` declarations,
entirely in native CSS.** Motion is driven by CSS states
(`:hover`, `:focus-within`, `[aria-expanded]`) and, for the remaining cases, by a
class applied in JavaScript.

Second notable trait, the one you notice last: **buttons and
cards have no transition at all.** No `.btn*` or `.card*` rule in M declares
`transition`. Their color change on hover is instant. Time
is reserved for what **appears or disappears**, never for something that just
changes tint.

---

## 1 bis. The breakpoints — read this before anything else

**The project redefines Tailwind's tiers.** The default values (640 /
768 / 1024 / 1280) are wrong here, and using them shifts the whole layout.

| Prefix | Real value |
|---|---|
| `sm:` | **420px** |
| `md:` | **660px** |
| `lg:` | **900px** |
| `xl:` | **1140px** |

Only `--breakpoint-md:660px` is declared in plain text in M. The other three are
read by isolating each `@media` block of the compiled sheet and looking at
which prefix is written there — for example `.sm\:h-[4.5rem]` only appears inside
`@media (min-width:420px)`. The container scale confirms the series:
420 / 660 / 900 / 1140 / 1380 / 1470.

Practical consequence: the page reflows **much earlier** than an ordinary
Tailwind site. The closing headline switches to 4.5rem as early as 420px; the footer
switches to 5 columns as early as 660px.

---

## 2. The motion system

### 2.1 Three system durations, everything else derives from them

| Token | Value | Role | Source |
|---|---|---|---|
| `--duration` | **`.14s`** | every interface state (hover, menu opening, icon rotation) | M |
| `--duration-slow` | **`.25s`** | panels and nav elements that enter in cascade | M |
| `--default-transition-duration` | **`.15s`** | Tailwind default, used as fallback for utilities | M |

`--transition-fast` (file B) is not a fourth duration: it equals
`var(--duration)`, so `.14s`. It's a local alias scoped to the demo.

### 2.2 Durations actually used

Transition utilities present in the compiled CSS:
`75ms · .1s · .15s · .2s · .22s · .3s · .5s · .7s · .9s`
plus `var(--duration)` and `var(--duration-slow)`.

Animation durations present:
`80ms · .14s · .15s · .2s · .25s · .26s · .3s · .4s · .42s · .5s · 1s · 1.5s · 2s · 2.5s · 2.8s`

But the raw inventory lies about reality. **What matters is the frequency
of use in the markup.** Count on `index.html` (the document contains the same
tree twice; figures divided by two):

| Class | Occurrences | Reading |
|---|---|---|
| `transition-colors` | 36 | most frequent channel, almost always at `.15s` |
| `duration-150` | 29 | **the duration actually dominant in the markup** |
| `transition-all` | 27 | mostly on demo elements that change several properties |
| `transition-opacity` | 19 | everything that reveals itself |
| `duration-200` | 12 | second duration, for slightly longer reveals |
| `transition-transform` | 1 | virtually absent: movement goes through keyframes instead |
| `ease-out` | 1 | explicit curves are extremely rare in the markup |

**Three durations carry the whole site: `.14s` (states), `.15s`–`.2s` (reveals),
`1s` (appearance on scroll).** Values between `.3s` and `2.8s` all belong
to internal looping demos, not to the page chrome.

### 2.3 Three curves, and only one that matters

| Token | Value | Use |
|---|---|---|
| `--ease-out-spring` | **`cubic-bezier(.25, 1, .5, 1)`** | the site's default curve. It's `easeOutQuart`: a very fast start, a long, damped arrival. No bounce, no overshoot. |
| `--ease-out` | `cubic-bezier(0, 0, .2, 1)` | a few opacity reveals |
| `--ease-in-out` | `cubic-bezier(.4, 0, .2, 1)` | Tailwind default, inherited more than chosen |

Two off-system curves appear once each:
`cubic-bezier(.22, 1, .36, 1)` (`easeOutQuint`, on `mobile-chat-enter`) and
`cubic-bezier(.4, 0, .6, 1)` (Tailwind's `pulse`). `linear` is reserved for
infinite loops (`spin`, `shimmer`).

Rule worth keeping: **a single curve for everything that enters, `linear` for
everything that loops.** Nothing else.

### 2.4 Breakdown by interaction type

| Type | Animated property | Duration | Curve | Transition? |
|---|---|---|---|---|
| Button hover | `background-color`, `border-color`, `color` | — | — | **no, instant** |
| Card hover | `background-color` | — | — | **no, instant** |
| Nav link hover | `color` (via `color-mix` toward `transparent`) | — | — | no |
| Icon reveal (chevron, external arrow) | `opacity` 0 → 1 | `.14s` / `.15s` | spring | yes |
| Chevron rotation | `transform` → `rotate(180deg)` | `.14s` | spring | yes |
| Dropdown menu opening | `opacity` + `transform` + `visibility` | `.14s` | spring | yes |
| Mobile nav panel | `opacity` alone | `.14s` | spring | yes (inline style) |
| Window controls on group hover | `opacity` 0 → 1 | `.2s` | **`cubic-bezier(.4,0,.2,1)`** — Tailwind default, no `ease-*` class accompanies `duration-200`: it's the only effect on the page that doesn't use the spring curve, by omission rather than by choice | yes |
| Appearance on scroll | `opacity` + `translateY` | `1s` | spring | no — keyframes |
| Demo loops | multiple | `2s`–`2.8s` | `ease-in-out` / `linear` | no — keyframes |

---

## 3. The animation techniques, one by one

### 3.1 A dropdown panel with no closing JavaScript — the technique worth keeping

```css
.nav__sub-nav {
  opacity: 0; visibility: hidden; transform: translateY(-.4rem);
  transition: opacity   .14s var(--ease-out-spring),
              transform .14s var(--ease-out-spring),
              visibility 0s linear .14s;      /* ← duration 0, DELAY = duration of the fade */
}
.nav__btn[aria-expanded="true"] ~ .nav__sub-nav {
  opacity: 1; visibility: visible; transform: translateY(0);
  transition-delay: 0s;                        /* ← cancels the delay on opening */
}
```
*(measured from M, selectors `.nav__sub-nav` / `.nav__btn[aria-expanded=true]~.nav__sub-nav`)*

The technical point: `visibility` is transitionable, but in steps, not
continuously. Giving it a duration of zero and a **delay equal to the duration of the fade**
means the panel stays `visible` throughout the exit, then flips to `hidden`
exactly at the end. On opening, `transition-delay: 0s` removes the delay and the
panel becomes visible immediately.

Result: a panel that leaves the accessibility tree and stops intercepting
clicks, without `setTimeout`, without `animationend`, without any React state. It's the
most reusable technique on the whole page.

### 3.2 Icon reveal with no text shift

```css
.nav__sub-nav__link__icon { opacity: 0; transition: opacity .14s var(--ease-out-spring); }
.nav__sub-nav__link:hover .nav__sub-nav__link__icon,
.nav__sub-nav__link:focus-visible .nav__sub-nav__link__icon { opacity: 1; }
```
*(measured from M)*

The "external link" arrow **always** occupies its place; only its opacity
changes. The label never moves on hover. Same pattern for the hero window's
window controls (`opacity-0 group-hover:opacity-100 transition-opacity
duration-200`, measured from `index.html`).

**The touch safeguard, not to be forgotten.** At-rest visibility doesn't depend
on screen width but on the **pointer's hover capability**:

```css
@media (hover: none)  { .icone { opacity: 1 } }   /* touch: always visible */
@media (hover: hover) { .icone { opacity: 0 } }
@media (hover: hover) { .lien:hover .icone,
                        .lien:focus-visible .icone { opacity: 1 } }
```
*(measured from M, for `.nav__sub-nav__link__icon` as for `.footer-link__icon`)*

Without these three rules, the arrow would remain forever invisible on a phone:
there's no hover to reveal it. It's the detail that separates a correct hover
effect from a hover effect broken for half the traffic.

**The menu chevron, meanwhile, has no `:hover` rule at all** — only
`:focus-visible` and an `.is-active` class applied via JavaScript. Revealing it on
hover in CSS, as this reference does, is a deliberate departure.

### 3.3 Chevron rotation

`transform: rotate(180deg)` on `.nav__btn-caret.is-active .nav__btn-caret__icon`,
transition `transform .14s var(--ease-out-spring)`. The rotated glyph isn't a
chevron but **the "↓" arrow**, rendered through a stylistic set of the house
font (`font-feature-settings: "ss09"`). *(measured from M + index.html)*

### 3.4 Appearance on scroll — the only one on the site

```css
@keyframes gallery-marquee-item-slide-up {
  0%  { opacity: 0; transform: translateY(25%); }
  to  { opacity: 1; transform: translate(0);    }
}
--animate-gallery-marquee-item-slide-up:
  gallery-marquee-item-slide-up 1s var(--ease-out-spring) both;
```
*(measured from M)*

Three decisions worth copying:
1. **The displacement is in percentage (`25%`), not pixels.** It is therefore
   proportional to the element's height: a large card travels more
   distance than a small one, and the cascade looks uniform without per-size tuning.
2. **`both`** preserves the starting frame before the trigger and the ending
   frame after. Without `both`, the element would flicker on returning to its native state.
3. **1 second**, i.e. seven times the duration of interface states. The site clearly
   distinguishes "react to a gesture" (`.14s`) from "enter the scene" (`1s`).

The source cuts the effect cleanly: `@media (prefers-reduced-motion: reduce)
{ .animate-gallery-marquee-item-slide-up { animation: none } }` *(measured from M)*.

**Trigger.** The cascade offset is set in JavaScript; it isn't
readable in the shipped CSS. In this reference it is `60ms` per rank
— `[arbitrage]`.

Compatibility constraint respected in `styles.css`: the trigger is an
`IntersectionObserver` (*Baseline widely available* since March 2019), **not**
`animation-timeline: view()` — the latter isn't *widely available*, and
a keyframe that starts at `opacity: 0` would leave elements permanently
invisible wherever it's missing.

### 3.5 The 27 keyframes, by family

| Family | Names | Shape |
|---|---|---|
| Simple fade | `fade-in`, `fadeIn`, `navItemFade`, `streaming-word-fade` | `opacity` alone; `streaming-word-fade` starts from `.4`, not `0` |
| Fade + slide | `navItemSlideIn` (`-4px`), `navItemSlideOut` (`+4px`), `fadeSlideUp` (`2px`), `fadeSlideRight` (`-2px`), `mobile-chat-enter` (`12px`), `gallery-marquee-item-slide-up` (`25%`) | tiny amplitudes except the last one: **2 to 12 px for interface elements, 25 % for the scene entrance** |
| Appearance with scale | `tilePopIn` (`scale .7 → 1`) | the only place where scale is used for an entrance |
| Sweep | `shimmer` (`background-position 200% → -200%`), `shimmer-slide` (`translateX -100% → 200%`) | `linear` loops |
| State pulsing | `pulse`, `newsletter-submit-pulse`, `mobile-interaction-pulse`, `mobile-interaction-glow`, `mobile-workspace-interaction-pulse`, `pulse-bit`, `pulse-emit` | `ease-in-out` loops, 2 s to 2.8 s |
| Waiting / activity | `mobileWorkingVerticalOpacity`, `mobileWorkingHorizontalOpacity`, `mobileWorkingCenterOpacity`, `mobileRecordingWaveform`, `barGrow`, `spin` | opacity oscillations offset from one another to simulate a sweep |
| Error | `shake` (`0 → -6 → +5 → -3 → +2 px`, `.4s ease-out`) | decreasing amplitude, not symmetric |

Amplitudes worth keeping in mind: **nothing moves more than 12 px** in the interface.
The only large displacement on the page is the scroll entrance, and it's relative.

---

## 3 bis. Four techniques measured late — and why they get missed

### Card surfaces are GRADIENTS, not colors

Reading trap: the `--color-theme-card*` tokens **without** the `-hex` suffix are
not colors but **stacked background images**. The ramp exists in
two non-interchangeable versions:

```css
--color-theme-card:    linear-gradient(var(--color-theme-card-hex) 0% 100%);
--color-theme-card-02: linear-gradient(var(--color-theme-fg-02-5) 0% 100%),
                       linear-gradient(var(--color-theme-card-hex) 0% 100%);
--color-theme-card-03: linear-gradient(var(--color-theme-fg-05) 0% 100%),
                       linear-gradient(var(--color-theme-card-hex) 0% 100%);
```
*(measured from M)* — versus `--color-theme-card-03-hex: #e6e5e0`, an opaque color.

A single-color gradient "0% 100%" isn't a quirk: it makes it possible to
**stack a scrim** (2.5 % or 5 % of the primary text color) on top of the card
background in a single property, with no extra element and no alpha applied to
the whole element. The scrim follows the theme since it derives from the primary text.
`bg-[image:var(--color-theme-card-03)]` appears **5 times** on the page.
Flattening these tokens into a solid color loses exactly the nuance that separates
a media scene from the card containing it.

### The background image is darkened in dark theme

```css
[data-theme=dark] .wallpaper-brightness-dark { filter: brightness(.9); }
```
*(measured from M)* — 10 % less, so the light chassis of the windows keeps its
contrast on top of it. The `filter:brightness()` with no argument on the light theme is
a shell left over from the source, with no effect: it isn't reproduced.

### The aspect ratio does NOT go through `aspect-ratio`

```css
.aspect-4\/3-box        { display:grid; grid-template-rows:repeat(1,minmax(0,1fr));
                          grid-template-columns:repeat(1,minmax(0,1fr)); }
.aspect-4\/3-box:after  { content:""; pointer-events:none;
                          grid-area:1/1/-1/-1; padding-top:75%; }
```
*(measured from M)* — a 1×1 grid, plus an empty `::after` that occupies the same cell
and imposes the height via `padding-top` in percentage (75 % = 4/3, 100 % = 1/1).
Content overlaps in the same cell without needing `position:absolute`.

### The side fade mask

```css
background-image: linear-gradient(90deg, transparent 0%, var(--color-theme-bg) 88%);
```
*(measured from M)* — a continuous scroll fades into the page background instead
of being cut off sharply at the edge.

---

## 4. Color

Two themes, a three-tier toggle *(measured from I)*:

```css
:root                              { /* light */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"])  { /* dark by system preference */ }
}
:root[data-theme="dark"]           { /* forced dark */ }
```
The `:not([data-theme="light"])` selector **inside** the media query is what
allows returning to light on a device set to dark. Without it, the toggle only
works one way.

### Measured values

| Role | Light | Dark |
|---|---|---|
| Page background | `#f7f7f4` | `#14120b` |
| Primary text | `#26251e` | `#edecec` |
| Softened primary text — `--color-theme-fg-02` | `#3b3a33` | `#d7d6d5` |
| Accent | `#f54e00` | `#f54e00` (identical) |
| Surface 1 — card at rest | `#f2f1ed` | `#1b1913` |
| Surface 2 — light hover | `#f0efeb` | `#1d1b15` |
| Surface 3 — hover / frame | `#ebeae5` | `#201e18` |
| Surface 4 — secondary button | `#e6e5e0` | `#26241e` |
| Surface 5 — secondary hover | `#e1e0db` | `#2b2923` |

Two techniques:

1. **The surface ramp is made of baked colors, not stacked alphas.**
   Five opaque hex values per theme. A hovered card on top of a card remains exact,
   with no buildup of translucency.
2. **All text and rule derivatives go through `color-mix(in oklab, …)`
   from the primary text**, never through an independent gray scale:
   `60%` secondary, `50%` mid, `40%` tertiary; rules at `2.5 / 5 / 10 / 20 / 60 %`.
   Changing the primary text is enough to redo the whole hierarchy.

3. **The primary button's hover isn't a computation.** It's a named
   color: `--color-theme-button-hover-bg: var(--color-theme-fg-02)`, i.e.
   `#3b3a33` / `#d7d6d5`. A `color-mix` toward the background would give a
   nearby but wrong hue — the theme has a fixed value planned for it instead.

The orange accent **is never used as a background**. Only as text color, on
tertiary links. Its hover is a `color-mix` at 75 % toward `transparent`.

**Hover mutes, it doesn't intensify.** Nav links, menu sub-links,
footer links: all inherit the primary text at rest, and their `:hover` lightens
them 75 % toward `transparent`. `.footer-link` in fact has **no**
color declaration at rest at all — only a `:hover` rule. Setting links to
secondary in order to intensify them on hover would reverse the technique.

---

## 5. Rhythm

**Two independent steps**, and this is deliberate — horizontal and vertical share
no unit. There is no "8pt grid" here.

| Source token | Value | Role |
|---|---|---|
| `--g` | `calc(10rem / 16)` = `0.625rem` | horizontal step, multiples `g1` `g1.5` `g1.75` `g2` `g3` |
| `--v` | `1rem * 1.4` = `1.4rem` | vertical step, multiples `v1` … `v8` **and twelfth fractions** `v2.5/12`, `v8/12`, `v9/12` |
| `--grid-gap` | `calc(12rem / 15)` = `0.8rem` | text gutter, distinct from the step |
| `--max-width-container` | `1300px` | container |
| `--site-header-height` | `56px`, `52px` beyond 900 px | fixed header |

Twelfth fractions (`v2.5/12` ≈ `0.29rem`) are the real fine-tuning tool:
they give tiny spacings **that remain multiples of the same step**.

A single class carries all the site's vertical rhythm:
`.section { padding: var(--spacing-v3) var(--spacing-g2) }` *(measured from M)*, with
variants `--flush-y`, `--flush-x`, `--compact`, `--headline`. No section
defines its own margins.

And a page's first section carries no particular class: the
extra breathing room comes from a **structural** selector —
`main>.section:first-child,.section--first-child{padding-block-start:var(--spacing-v5)}`
*(measured from M)*. Nothing to think about when writing the markup.

### Grid

`.grid-cursor` = **24 columns**, gutter `var(--spacing-g1)` *(measured from M)*.
It's never applied to the whole page — only inside the
large cards, to split text (columns 1→9) and media (9→25).

---

## 6. Typography

Pure system stack: `--font-sans: var(--font-system)` →
`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif`.
**No text webfont at all.** The only font files loaded are an icon
font (`CursorIcons16`, invoked via `font-feature-settings: "ss08"` / `"ss09"`)
and a mono for code.

| Step | Size | Line-height | Tracking |
|---|---|---|---|
| `xs` | `.75rem` | 1.5 | `.01em` |
| `sm` | `.875rem` | 1.5 | `.01em` |
| `base` | `1rem` | 1.5 | `.005em` |
| `md-sm` | `1.125rem` | 1.4 | — |
| `md` | `1.375rem` | 1.3 | `-.005em` |
| `md-lg` | `1.625rem` | 1.25 | `-.0125em` |
| `lg` | `2.25rem` | 1.2 | `-.02em` |
| `xl` | `3.25rem` | 1.15 | `-.025em` |
| `2xl` | `4.5rem` | 1.1 | `-.03em` |

Three techniques:

1. **Each `.type-*` class sets size, line-height, and tracking simultaneously.**
   No class sets just one of the three. Line-height tightens and
   tracking turns negative as size increases, monotonically.
2. **The `1.625rem → 2.25rem` jump is empty.** There is no size between the
   two: it's the boundary between "block heading" and "page heading".
3. **Typography is barely responsive at all.** Only one step changes with
   width on the entire home page: the closing headline, `type-xl` then
   `sm:type-2xl` — and with `sm:` meaning 420px here, the switch happens as early as
   small mobile. The `h1` stays at `1.625rem` from 320 px to 2560 px — a hero
   heading deliberately kept small, leaving the spotlight to the media.

Two markup reading traps, verified:
- the feature card's `h3` is a **bare tag** inside a `.type-base` parent;
  it inherits and never changes size. Only the `h3` of the
  large full-width card carries `type-base md:type-md`;
- the logo garden's heading is `type-sm` **with no color class**: it's
  in primary text despite its small size, not secondary.

Four named measures, never a pixel width:
`48ch` (narrow) · `65ch` (default) · `80ch` · `96ch`.

---

## 7. Four structural techniques worth copying

### 7.0 The two-layer card — the most subtle technique on the page

Each feature block is **a single rectangle on screen, but two
overlapping elements** within the same `grid grid-rows-[auto_1fr]`, both
`col-span-full row-span-full`:

```html
<div class="grid grid-rows-[auto_1fr]">
  <a class="card card--feature grid-cursor col-span-full row-span-full" href="…">
    <div class="… lg:col-start-1 lg:col-end-9">   …the TEXT…        </div>
    <div class="… lg:col-start-9 lg:col-end-25">  <!-- empty -->      </div>
  </a>
  <div class="grid-cursor p-g1.75 col-span-full row-span-full">
    <div class="… lg:col-start-1 lg:col-end-9">   <!-- empty -->      </div>
    <div class="… cursor-default lg:col-start-9 lg:col-end-25"> …the MEDIA… </div>
  </div>
</div>
```
*(measured from `index.html`)*

The media is **outside the `<a>`**. The card stays clickable through its text, but the
media — which carries `cursor-default` and contains interactive elements —
inherits neither the link cursor nor the navigation behavior. Two natures
within a single rectangle, with no `pointer-events` and no event handler.

The split across the 24-column grid **alternates from one block to the next**: blocks 1 and 3,
text columns 1→9 and media 9→25; blocks 2 and 4, text 17→25 and media 1→17,
with `lg:justify-self-end` on the text. The last block lacks the `mb-v4` that
separates the previous ones.

**And the detail without which everything collapses on small screens:
`max-lg:grid-rows-subgrid`, on BOTH layers.**

Above 900px, text and media occupy different columns: the
overlap causes no problem. Below it, they stack one under the other
— and there, each layer computes its rows based on its own content alone. The
"text" row of the media layer is empty, therefore zero height; the media rises and
**covers the other layer's text**. The heading, paragraph, and link
disappear behind the demo.

`subgrid` makes both layers borrow the rows of the **parent**: row 1 at
the height of the text, row 2 at that of the media, both layers aligned
on top of that. A single declaration, and the technique holds at every width.

It's the kind of line you measure without understanding it and that gets omitted
when rewriting — the defect only shows up when shrinking the window. It was found
here by temporarily removing the `overflow-x:hidden` safeguard and
looking at the page at 390px.

### 7.1 The floating windows — one system, five instances

All the demos place a fake application window in a scene, using the
same formula:

```
left: clamp(margin + half-width, anchor, 100% − margin − half-width)
```

The `clamp` guarantees it never sticks to the edges; the **anchor** decides where
it lands. Instances measured (`index.html`, `style` attribute of the
`#demo-window-*` elements):

| Window | Size | Anchor | z-index |
|---|---|---|---|
| `cursor-ide` | 1080×620 | 50% / 50% | 10 |
| `cursor-agent-cli` | 480×360 | **100% / 100%** (bottom-right corner) | 15 |
| `agent-react-hooks` | 920×600 | 50% / 50% | 10 |
| `slack` | 540×340 | **42% / 30%** | 10 |
| `automation-config` | 540×420 | 50% / 50% | 10 |

All share the same radius (`10px`), the same transform origin
(`center center`), and the **same three-layer shadow**:
`0 28px 70px rgba(0,0,0,.14), 0 14px 32px rgba(0,0,0,.1), 0 0 0 1px var(--…-border-02)`
— two drop shadows of very different spread, plus a 1px outline as a
third layer. It's this outline that keeps the window from "floating in a
blur" against a light background.

The window is bigger than its scene and therefore ends up **clipped**, contained
by `max-height:calc(100% - 2*var(--demo-pad))`. The clipping is intentional: it
suggests an interface that continues beyond the frame.

`--demo-pad` equals `32px`, and `16px` under 767px *(inline `<style>` block)*.

### 7.2 The rule as a pseudo-element

```css
.card { position: relative; }
.card::before {
  content: ""; position: absolute; inset: 0; z-index: 30;
  pointer-events: none;
  border: 1px solid var(--color-theme-border-01);
  border-radius: var(--radius-xs);
}
```
*(measured from M; variants `.media-border-container::after`, `.avatar-border-container::after`)*

The 1 px border is **never** placed on the element itself. Three intended
consequences: it doesn't enter into size calculations (no 1 px offset between
a bordered card and a bare one), it passes **above** an image in
`overflow: hidden` so it stays crisp in rounded corners, and
`pointer-events: none` guarantees it never intercepts a click.

Card radius: `4px`. Button radius: `rounded-full` — compiled by
lightningcss into `3.40282e38px`, the ceiling of a 32-bit `float`.

### 7.3 The carousel locked to the grid

```
w-[calc((((100vw - 2*var(--spacing-g2)) - 23*var(--spacing-g1)) / 24) * 18
        + 17*var(--spacing-g1))]
```
*(measured from `index.html`, changelog cards)*

On small screens the list scrolls horizontally with `snap-x snap-mandatory`, and
the width of a card is **not** a percentage: it's **18 of the 24 columns
of the page grid, gutters included**. The card therefore aligns
exactly with the rest of the layout, and the next one overhangs just enough
to signal that scrolling is possible.

Tiers measured, with the project's actual breakpoints:
18 columns → 16 (**≥ 420**) → 14 (**≥ 660**) → 3-column grid (**≥ 900**,
at which point the track switches from `overflow-x: auto` to `overflow: visible` and
`scroll-snap-type: none`) → 4 columns (**≥ 1140**).

Detail not to miss: the 4th card carries `lg:hidden xl:block`. It **disappears
between 900 and 1140px**, i.e. exactly over the range where the grid has only
3 columns — otherwise it would fall alone onto a second row. The grid is
always full, never lopsided. A single conditional class on one element
solves a problem most sites leave unaddressed.

---

## 8. Coverage, deviations, and what remains irreproducible

### Coverage — complete

The thirteen sections of the source page are present, **in the same order**:

1. fixed header + navigation with two dropdown menus (one of them over 2 columns)
2. full-screen mobile navigation panel, with cascading entrance
3. hero — h1 `type-md-lg`, two buttons, scene with **two** floating windows
4. logo garden (4×2 → 8×1)
5. feature block 1 — text on the left, task-tracking demo
6. block 2 — **reversed**, two terminal windows
7. block 3 — text on the left, messaging + terminal over photography
8. block 4 — **reversed**, configuration panel over photography
9. six testimonials (only three under 660px)
10. trio of features, with phone chassis
11. changelog carousel
12. team card (same two-layer template as the blocks)
13. publications carousel, call to action, 5-column footer + language
    selector opening upward

Light and dark theme throughout.

### What remains irreproducible, and why

- **The product screenshots.** The source's media are real
  views of the application. Here, the panels are **redrawn** with the
  measured tokens — chassis, bars, surface ramps, diff colors, "product" scale
  sizes. The chassis and proportions are exact; the content
  displayed inside is an [arbitrage]. It's the most visible limit
  when comparing the two pages side by side: my demos are paler,
  because they lack the seven-tone syntax highlighting.
- **The house icon font** (`CursorIcons16`) and its stylistic sets
  `ss08` / `ss09`, which render the arrows and chevrons. Not redistributable:
  replaced with ordinary Unicode characters.
- **The logos** of the companies cited: replaced with neutral words.
- **The editorial content**, rewritten as generic labels of equivalent visual
  length — that's an instruction, not a limitation.

**Corrected relative to the source**: the original page contains **two `<h1>`s**.
This reference has only one; the block headings are `<h2>`s.

**Deliberate departures**, all marked `[arbitrage]` in the CSS:
- dropdown menus and chevrons opened in pure CSS (`:hover` / `:focus-within`)
  where the source drives `aria-expanded` and `.is-active` via JavaScript. The
  source has **no** `:hover` rule at all on the chevron;
- reveal cascade offset fixed at `60ms` (set in JS in the source,
  therefore unreadable in the shipped CSS);
- the hero window's half-width derived from its actual width instead of the
  source's hardcoded `540px`, whose `clamp` shifts the window under 1144 px;
- the window's flank hidden under 660px (its measured `min-w-[220px]` overflows at
  this width; the source, meanwhile, lets it overflow under `overflow:hidden`);
- the reveal elements' hidden state is set **by the script**, at the very moment it
  puts the element under observation, rather than by the stylesheet. A
  `[data-revele]{opacity:0}` written up front would make the whole page invisible if
  the observer fails to start — a case reproduced in testing;
- `9999px` instead of `3.40282e38px` for full radii;
- icon glyphs in ordinary Unicode characters, since the house font and its
  stylistic sets `ss08` / `ss09` aren't redistributable;
- scroll buttons added to the carousels: the source relies solely on
  touch gesture; they make scrolling controllable by keyboard and mouse;
- window flank and third panel hidden under 660 / 900px, their measured minimum widths
  overflowing at these sizes;
- dark theme has no toggle button: it's triggered by system preference
  or by `data-theme="dark"` on `<html>` — the technique as measured.

---

## 9. `motion.js` — what the JavaScript does, and what it doesn't do

The source ships with **no** animation library at all: its JS sets
classes and attributes, the CSS animates. `motion.js` follows the same rule — it
computes no position, interpolates no value, touches no motion style.
Four blocks:

1. **Mobile navigation** — toggling `data-ouvert`, locking background
   scroll, `Escape`, focus return, and setting `--rang` for the cascade.
2. **Scroll reveal** — `IntersectionObserver`, `unobserve` after the
   first pass.
3. **Carousels** — two scroll buttons, `scrollBy` with explicit
   `behavior`, button state recalculated on `scroll` (batched via
   `requestAnimationFrame`, `passive` listener).
4. **Ambient loops** — paused off-screen via `animationPlayState`,
   resuming without resetting to zero.

### The trap worth knowing

`scrollBy({behavior:'smooth'})` **never checks `prefers-reduced-motion`
on its own.** Unlike CSS animations, the JS scroll API ignores the
preference. You have to read it yourself:

```js
var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
var reduit = mq.matches;
mq.addEventListener('change', function (e) { reduit = e.matches; });  // addListener is deprecated
// … then, on every call:
piste.scrollBy({ left: dx, behavior: reduit ? 'instant' : 'smooth' });
```

Corollary: `behavior` must **always** be explicit. Left out, it defaults to `'auto'`
and silently follows the CSS `scroll-behavior` — thus bypassing this check.

Second trap: `scroll-snap-type: x mandatory` combined with a smooth `scrollBy`
can be interrupted and re-anchored by the browser mid-animation. That's
expected; it isn't countered — button state is simply recalculated afterward.

---

## 10. Traceability check

102 assertions extracted from the `[relevé]` markers were searched
literally in the concatenated source (`index.html` + the 4 CSS files, 1,059,805 b):
22 tokens, 23 component and animation rules, 57 markup and
geometry readings (windows, columns, layered backgrounds, keyframes). **No misses.**
The verification commands are `grep -F` on the exact string,
reproducible as-is.
