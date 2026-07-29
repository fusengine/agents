# Recorded procedures — app.reve.com

Source: `~/Downloads/design-refs/reve/app.reve.com/index.html` (75,794
bytes). All the page's CSS lives in **a single inline `<style>` block**; no
external stylesheet. Five `@layer`s (`reset, theme, component, utilities,
overrides`), **0 `@keyframes`**, **4 `transition` declarations**, **1
`:hover` rule**.

`[relevé]` = read textually from the source · `[arbitrage]` = a choice made
by the author of this reference.

Files: `index.html` · `styles.css` · `motion-bande.js` · `motion.js` ·
this document.

## The real fonts

The source's four `@font-face` rules are reproduced **identically** and
served from `https://app.reve.com/assets/…` (the aspired page's relative
prefix replaced with the origin domain; no binary is stored here):

| Family | File | Weights |
|---|---|---|
| ReveUI | `ReveUI.shifted-variable-DEpnxcwd.woff2` | 100–900 |
| ReveDisplay | `ReveDisplay-medium--sZBO_UH.woff2` | **500–900** |
| ReveDisplay | `ReveDisplay-regular-qfkMquGn.woff2` | **100–400** |
| ReveSansMono | `ReveSansMono-variable-hzh9PIPz.woff2` | 100–900 |

Two method notes:

- **ReveDisplay is served as two files split by weight range**, not as a
  single variable font. Titles (weight 500) pull the "medium" one,
  subtitles (400) the "regular" one — the browser only loads what it
  actually needs.
- All four share the same `unicode-range`: outside that range, the browser
  falls back to the fallback stack **without downloading the font**.

The fallback stacks were also recorded, with their exact order:
`"ReveUI", Arial, ui-sans-serif, sans-serif` — `Arial` **before**
`ui-sans-serif`, a metrically close fallback preferred over the OS
sans-serif.

Measured effect of switching to the real fonts: the hero title goes from
279 px (system stack) to 261 px, against 259 px in the source. All the
hero's line breaks and vertical positions fell into alignment.

---

## 0. Two mandate points corrected by the source

**Rive is absent from this file.** A case-insensitive `grep` returns only
one occurrence of the string "rive", inside the word "arrive" in an HTML
comment ("before the image bytes arrive"). No `.riv`, no Rive module, no
`<canvas>`. What can't be reproduced here therefore doesn't come from Rive
but from the `app.ts` bundle and the `<rv-*>` components.

**This is not an application interface, it's a product page.** The
`<title>` is "Reve Image - Model". The structure is: marketing header,
hero, seven feature sections, closing zone. What *is* application-like —
and is the interest of this reference — is the **token system** that the
page consumes: it comes from the app (`--rv-sidebar-*`,
`--rv-header-height`, the stacking scale
`drawer/dialog/dropdown/toast/tooltip/overlay`, field heights, focus ring,
scrollbar theming, `kbd`, status labels, list item rows). These rules are
**defined but not instantiated** in this document; the reference
instantiates them in its footer, which is flagged as an assembly
`[arbitrage]`.

---

## 1. Motion

### The source's 4 CSS transitions

All on `opacity` or on paint properties. **No layout property is ever
animated. None carries a curve** — they use the default `ease`, even
though the system declares seven named curves.

| Trigger | Target | Property | Start → End | Duration |
|---|---|---|---|---|
| `.is-playing` (JS) | hero card video | `opacity` | 0 → 1 | 150 ms |
| `.is-active` (JS) | template render | `opacity` | 0 → 1 | 200 ms |
| `.is-active` (JS) | template thumbnail | `opacity` | 0 → 1 | 200 ms |
| `.is-active` (JS) | reference card | `background` **and** `box-shadow` | transparent → white panel; none → `0 2px 8px` 8% black | 150 ms |

Two additional states, **with no transition**:

| Trigger | Target | Effect | Duration |
|---|---|---|---|
| `:hover` | round arrow button | `background` → `neutral-100` | instant (the sheet's only `:hover` rule) |
| `:focus-visible` | template field | `outline` 2 px, `color-mix` 24% of the text color, offset 1 px | instant |
| `:focus-visible` | everything else | `outline` 2 px on the accent, offset 0 | instant |

Key points:

- **Focus is never animated.** A ring that fades in reads as a delay; here
  it's abrupt.
- **Selection signals through a SURFACE, not through an accent border.**
  The active card turns to the panel's white and gains a very low shadow.
  This is the page's most reusable procedure for a selectable grid.

### Reduced motion — the procedure worth copying

The source doesn't neutralize **any** transition individually. It resets
the five duration tokens to `0s`:

```css
@media (prefers-reduced-motion: reduce) {
  :root { --rv-transition-x-slow: 0s; --rv-transition-slow: 0s;
          --rv-transition-medium: 0s; --rv-transition-fast: 0s;
          --rv-transition-x-fast: 0s; }
}
```

Any transition written later switches off automatically, as long as it
consumes a token. In this reference, **all** transitions do; a second
`reduce` block additionally neutralizes what has no duration (scroll snap,
WebKit reflection), and `motion.js` reads the same media query to stop any
drift.

### Durations and curves

| Token | Value | Token | Value |
|---|---|---|---|
| `x-fast` | 50 ms | `smoothstep` | `cubic-bezier(.53,.2,.04,.96)` |
| `fast` | 100 ms | `out-back` | `cubic-bezier(.43,1.91,.64,1)` |
| `medium` | **150 ms** | `ease-out-quart` | `cubic-bezier(.165,.84,.44,1)` |
| `slow` | 200 ms | `ease-in-out-quint` | `cubic-bezier(.86,0,.07,1)` |
| `x-slow` | 500 ms | `ease-out-quad` | `cubic-bezier(.25,.46,.45,.94)` |
| | | `ease-in-out-quad` | `cubic-bezier(.455,.03,.515,.955)` |

The spring is a **`linear()` sampled over 20 points**, not a
`cubic-bezier` — so it can overshoot and come back several times:

```css
--rv-ease-spring: linear(0, .005, .02 2%, .081 4.5%, .469 15.2%, .567, .65,
  .722 24.4%, .784, .835 31.1%, .878 34.9%, .914 39.1%, .942 43.8%,
  .964 49.1%, .979 55.4%, .989 62.4%, .995 71.1%, 1);
```

### What the source drives in JS — and what `motion.js` does with it

The source's HTML comments name each entry point. They're quoted here
*verbatim* because they describe the intent better than any paraphrase.

**`wireHeroMarquee`** → `bandeDerivante()`

> "a marquee carousel of curated examples. The strip drifts on its own and
> loops seamlessly (app.ts wireHeroMarquee clones the card set once);
> visitors can grab it directly at any width, and the page scrolls past it
> like any other section."

Four properties follow from this, in order of importance: the loop is
**seamless** (the set is duplicated once and its width is *subtracted*
instead of resetting to 0); the strip **can be grabbed with the mouse** —
"visitors can **grab** it directly at any width": a container in
`overflow-x: auto` scrolls via trackpad and touch but **not** by dragging
with the mouse, that gesture has to be built (pointer capture, so dragging
can continue with the cursor outside the strip, and `pointercancel` so it
never gets stuck in a grabbed state); the drift **never confiscates
control** (pointer, wheel, keyboard and focus all suspend it); it stops
entirely under reduced motion.
The drift acts on `scrollLeft`, so on the same axis as the gesture: no
conflict between the animation and native scrolling. `[arbitrage]` the
speed (px/s, `data-vitesse` attribute): the source doesn't expose it.

**`wireHeroVideoHover`** → `videoSurvol()`

> "Poster by default; hovering plays the silent 6s loop, which fades in
> only once frames are actually rendering — so a slow-loading video just
> leaves the poster in place."

The key point is "only once frames are **actually rendering**": the class
isn't set on the intent to play, but on the **proof** that a frame has
actually been painted. `requestVideoFrameCallback` gives exactly this
proof; the `playing` event serves as a fallback.

**`wireHeaderVeil`** → `voileEntete()`

> "a persistent progressive blur under the fixed header (never toggles, so
> its backdrop layers never re-rasterize), plus a light scrim tint above
> it that fades in below the fold."

The comment dictates the implementation: you never touch `.voile` itself —
its three `backdrop-filter` layers would re-rasterize on every frame — and
you only toggle the opacity of `.voile-teinte`, which is just a gradient.

**`.color-scheme-text` / `.color-scheme-image`** → `themeEntete()`

The sheet contains three rules with no CSS trigger at all:

```css
.color-scheme-text  :is(rv-marketing-header) { color-scheme: light; }
.color-scheme-image :is(rv-marketing-header) { color-scheme: dark;  }
.color-scheme-text .header-veil-tint { --color: var(--rv-color-neutral-50); }
```

These classes are therefore set in JS on an ancestor depending on the
nature of the zone the header sits above. The exact procedure: a header
that **inverts**, not a header that changes color — and a single variable
that changes the veil's tint. `[arbitrage]` each zone declares its nature
via `data-zone="image|text"`.

**`data-deferred-src`** → `imagesDifferees()`

Beyond the first three cards, the URL isn't in `src` but in
`data-deferred-src` / `-srcset`, resolved in JS: thirteen images must not
compete with the LCP candidate on first render.

**`.lazy-trigger`** → `zonePiedDifferee()`

> "0-height marker that lazy-loads the footer (rv-footer / composer /
> gallery) as it nears the viewport. The visible 'Reve is a team of
> researchers…' section was removed; this keeps the lazy-load trigger that
> app.ts observes."

**Reference cards** → `references()` · **template arrows** → `gabarits()`

For the latter, the source is explicit: "The arrows cycle all three in
lockstep (app.ts wires it)" — the render, the thumbnail, and the field
value change **as a block**, never separately.

### NOT REPRODUCIBLE

`<rv-landing-explore-frame>`: an interactive image editor (object
selection, pre-filled annotation, effect application) mounted by the
source in **two** sections. Neither its CSS nor its code appears in the
aspired page — they live in the bundle and the shadow DOM. The source
itself provides a fallback, the static image pair, below 1,160 px or if
bootstrapping fails (`.embed-fallback`): it's this fallback that is
rendered, and the component's location is **marked** in the HTML rather
than approximated.

Same situation, at a smaller scale, for `<rv-marketing-header>`,
`<rv-logged-out-composer>`, `<rv-horizontal-gallery>` and `<rv-footer>`:
empty in the HTML, rendered in JS. Their content is rebuilt using the
recorded tokens and flagged `[arbitrage]`. Only their dimensions as
declared in the inline CSS are recorded: a prompt of `58 × rhythm`
(464 px) capped at 75 vw, `z-index: 10`, gallery thumbnails at 26 svh at
rest and 30 svh on hover, page height
`100svh − image height − 108px`.

---

## 2. The header veil

A **progressive** blur obtained by stacking, where a single
`backdrop-filter` would only give a uniform blur. Three empty stacked
`<i>` elements:

| Layer | `backdrop-filter` | `mask-image` |
|---|---|---|
| 1 | `blur(3px)` | `linear-gradient(#000 55%, #0000 82%)` |
| 2 | `blur(8px)` | `linear-gradient(#000 32%, #0000 60%)` |
| 3 | `blur(18px)` | `linear-gradient(#000 12%, #0000 38%)` |

Each layer blurs harder **and** cuts off earlier: the sum grows toward the
top of the screen.

Three details make this procedure work well:

1. **The veil itself is never toggled** (cf. §1); the fade is carried by a
   second element, which is cheap to animate.
2. **A 120 px pseudo-element sits above the viewport**
   (`bottom: 100%`). It captures the offscreen area; without it, the blur
   shows a hard edge when the page is scrolled all the way up. Both
   layers have one.
3. **The tint is a 16-stop gradient**, positions computed as a fraction of
   the veil's height (`calc(100% - var(--end) * .8344)`, etc.). Sixteen
   stops instead of two remove the Mach band of a simple linear gradient.

Below 750 px, the height drops from 140 px to 128 px, and `--end` with it.

---

## 3. Surface hierarchy

**The page background is not white.** It's `neutral-50` (`#fafafa` in
light mode, `#1a1a1a` in dark). White is reserved for panels sitting on
top of it: the separation comes from there, not from a shadow.

| Role | Value | Use |
|---|---|---|
| Page | `light-dark(#fafafa, #1a1a1a)` | document and section background |
| Panel | `light-dark(#fff, #000)` | card, selected surface, menu |
| Well | `light-dark(#f0f0f0, #2e2e2e)` | field background, image reserve |
| Canvas | `light-dark(#f0f0f0, #000)` | editor workspace |
| Panel border | `light-dark(#e6e6e6, #474747)` | container outline |
| Field border | `light-dark(#e0e0e0, #2e2e2e)` | input outline |
| Modal scrim | `light-dark(#00000080, #000000b3)` | dialog background |

### Elevations

| Role | Value | Reading |
|---|---|---|
| Control | `0 2px 8px 0 #00000029, 0 0 1px 0 #00000024` | diffuse + 1 px hairline that **replaces** the border |
| Panel | `0 8px 24px 0 #0003, 0 1px 4px 0 #0000001f` | same, but higher |
| Upward | `0 0 16px light-dark(#71717a1f, #0000003d)` | bottom toolbar |
| Resting card | `0 2px 12px #0000000f` | very low, with a border at **4% black** (`#0000000a`) |
| Selection | `0 2px 8px` at 8% black in `color-mix` | signals the active state |

The "resting card" is the most characteristic recipe: the border only
serves to **separate white from white**, the shadow gives it altitude.
Neither alone is enough. The inner thumbnail uses an even fainter border
(`#0000000d`, 5%) and a 10 px radius, outside the official scale.

### Radii

`4 · 8 · 16 · 24 px` (multiples of the rhythm), plus
`--rv-border-radius-full: calc(1px * infinity)` for the pill — more robust
than `9999px`, which degenerates on a very tall element. Three values fall
outside the scale: **2 px** on the hero images and template renders,
**10 px** on the thumbnail, **32 px** on the section frames.

### Every declared `background`, and its zone

An exhaustive reading of the `<style>` block — 21 declarations, none
flattened. Note that the template card, its arrows, and its mobile
overlay use **literal `#fff`**, outside the two-theme system: they would
stay white in dark mode, unlike everything else.

| Zone | Declared `background` |
|---|---|
| `html` | `neutral-50` |
| `:root` (1st block) | `neutral-0` — overridden further down |
| `:root` (page block) | `neutral-50` |
| `.hero-carousel-block` | `neutral-0` |
| `.hero-stage` | `neutral-0` |
| `.hero-card-img` | `neutral-100` (reserve before decoding) |
| `.header-veil::before` | `rgb(from neutral-0 r g b / .92)` |
| `.header-veil-tint` | 16-stop gradient over `--color` |
| `.header-veil-tint::before` | `neutral-50` |
| `.section-featureleft`, `.section-featureright` | `neutral-50` |
| `.section-references` | `neutral-50` |
| `.section-templates` | `neutral-50` |
| `.reference-card.is-active` | `neutral-0` |
| `.templates-card` | **`#fff`** |
| `.templates-side` (≤1024 px) | **`#fff`** |
| `.templates-arrow` | **`#fff`** |
| `.templates-arrow:hover` | `neutral-100` |
| `.templates-input` | `neutral-100` |
| `.templates-thumb` | `neutral-100` |
| `.intro-cta--primary` | `font-color-normal` (the text becomes the background) |
| `kbd:has(>kbd)>kbd` | `neutral-800` |
| `button` (reset) | `#0000` |
| `::-webkit-scrollbar-thumb` | `neutral-400` then `neutral-700` |

### Each zone's own geometry

No zone shares another's layout: each has its own formula.

| Zone | Width / height |
|---|---|
| Hero stage | `height: 100svh`, `position: sticky`; own gutter `clamp(24px, 3vw, 48px)` |
| Hero card | `grid-template-rows: minmax(0,1fr) auto`, free width based on ratio |
| Duo frame | `--panel-h: calc(48svh + 2 × 80px)`, inset `max(16px, 1.1×pad − .05×h)` |
| Text column (feature) | `max-width: 30rem`, subtitle `max-width: 52ch` |
| Reference frame | flexible base **by subtraction**: `min(50vw, 100vw − 30rem − rail − gutter/2) + rail − gutter/2` |
| Reference image | `aspect-ratio: 4/3`, `block-size: min(panel-h − 2×inset, 36vw)` |
| Reference thumbnail | `max-width: 100px`, square, radius 8 |
| Templates header | `min(--embed-frame-height, 100vw − 2×rail)` — anchored to the **render's width**, not the rail |
| Template render | `min(55svh, 100%)`, offset by `min(6vw, 96px)` |
| Template card | fixed 260 px, `left: min(16px, max(−(width+16px), 32px − (50vw − 50%)))`, scaled via `zoom` |
| Closing text zone | `max-inline-size: calc(72 × rhythm)` = 576 px |
| Prompt | `calc(58 × rhythm)` = 464 px, capped at `75vw` |
| Gallery thumbnail | `26svh` at rest → `30svh` on hover |

### Graphic-tool backgrounds

The sheet's only two marks of an image editor:

```css
--rv-transparency-checkerboard: repeating-conic-gradient(
  light-dark(#e5e5e5,#2a2a2a) 0% 25%, light-dark(#f5f5f5,#1a1a1a) 0% 50%) 50% / 20px 20px;
--rv-canvas-shimmer-gradient: linear-gradient(90deg, light-dark(#e6e6e6,#4a4a4a) 0%,
  light-dark(#d9d9d9,#575757) 20%, light-dark(#e6e6e6,#4a4a4a) 40%);
```

Plus a hover scrim for gallery thumbnails, dark at the top **and** the
bottom, transparent in the middle, so metadata can sit at both ends:

```css
--rv-hover-scrim: linear-gradient(to bottom, #000000b3 0%, #000000b3 6%,
  #0000 33%, #0000 66%, #000000b3 94%, #000000b3 100%);
```

### Theme

Everything goes through **`light-dark()`**, never through
`@media (prefers-color-scheme)`. The theme is therefore driven by setting
`color-scheme` on an ancestor — which lets you invert **one zone** (the
hero, the header) without duplicating a single token. The dark ramp is
inverted in luminance: `neutral-900` is light in dark mode. A single set
of roles serves both themes.

**The alpha ramp is separate from the neutral ramp**: text is black (or
white) at a variable opacity — 100%, 54%, 40% — never an opaque grey. It
therefore stays legible over any surface, including a blurred image.

The page forces `color-scheme: light !important` on `:root`. The dark
pairs stay dormant; they're kept in the reference because it's the
*system* that is being recorded.

---

## 4. Application UI patterns

**Article row** (`.item-info` / `.item-name` / `.item-description`) — the
list building block: a truncated overflow column, name on one line with
an ellipsis, description in reduced secondary text. Two levels, never
three.

**Status label** (`.beta-tag`) — a **fixed** frame 36 × 18 px, border and
text in `neutral-500`. It never takes the accent color: it stays muted and
never competes with the name.

**Keyboard shortcut** — `kbd:has(> kbd)`. Only the outer container is
displayed inline, each inner key becomes a pill of at least 20 px on
`neutral-800`. No class needed: semantic markup is enough.

**Field** — **no border**. It signals itself through its background
(`neutral-100`) set on the white panel, full radius, 40 px tall. On
focus, the ring is **neutral** (`color-mix` 24% of the text color, offset
1 px), not the blue accent: the accent stays reserved for general keyboard
navigation.

**Focus** — a single token for the whole application, `2px solid` on the
accent, offset 0. The global rule **explicitly excludes** components that
manage their own ring:

```css
:not(:is(rv-menu-item, rv-menu-item-card, rv-button, rv-input, rv-slider,
         rv-textarea)):focus-visible { outline: var(--rv-focus-ring); … }
```

and every focus target resets to `scroll-margin-block: 8vh` — reset to
`0` further down by the page layer, in that order.

**Scrollbars** — themed globally: 4 px, no track, thumb on the neutral
ramp, plus `scrollbar-gutter: stable` on `html` to remove the 15 px jump
when a dialog locks scrolling.

**Button** — the reset makes the `<button>` inherit **everything** from
the surrounding text (`font`, `letter-spacing`, `color`, `text-align`,
`text-indent`, `text-shadow`, `word-spacing`…) before redeclaring
anything: a button is styled like a `<span>`, no per-component reset. The
primary button **inverts text and background** (background = text color,
text = panel color), so it follows the theme with no second set of
tokens; the secondary one only has a border in
`color-mix(… 28%, transparent)`, always matched to the current theme.

**Floating template panel** — placed absolutely inside a
`pointer-events: none` layer whose only pointer-capturing children are its
own. Its horizontal position is a three-tier expression:

```css
left: min(16px, max(calc(-1 * var(--tpl-card-w) - 16px), calc(32px - (50vw - 50%))));
```

that is: 16 px from the edge, but never further left than "card width +
16 px" offscreen, and otherwise anchored 32 px from the window's actual
edge. It's scaled via **`zoom`**, not `scale`: the internal layout
recomputes instead of being stretched, so the text stays sharp.

Below 1024 px, this panel becomes a **named grid** placed below the
render (`"namelabel prodlabel" / "input thumb" / "arrows thumb"`), and
`.templates-card` dissolves via `display: contents`.

---

## 5. Structure and rhythm

**A single spacing primitive: `--rv-rhythm: 8px`.** All spacings, control
heights, radii, panel widths and icon sizes are `calc()`s on it. No
literal pixel in the scale.

**The gutter is a `clamp()`, not a centered container:**

```css
--rail: clamp(32px, calc(.42 * 100vw - 398px), 200px);
```

Flat at 32 px up to roughly 1024 px wide, then it opens up to 200 px. The
page breathes on large screens without ever setting a max-width on the
text.

**Sections at `104svh`, not `100`.** Each section deliberately overshoots
by a fraction of a screen: the start of the next one always peeks through,
signaling there's something below the fold.

**A section's skeleton is a grid**, `place-content: safe center`. The
`safe` keyword — also found on `justify-content: safe flex-end` and
`safe center` — makes the alignment yield rather than cut off content when
space runs out. The `featureleft` / `featureright` / `references` /
`templates` variants switch back to flex.

**Typographic hierarchy through color, not size.** In the hero as in the
sections, the title and the subtitle share **the same size, the same
family, and often the same weight**; only color separates them (primary
text vs. tertiary text). This is the page's typographic signature. Section
titles are `28px` literal, outside the token scale, and drop to `24px`
below 1024 px.

**Tracking is positive and grows with size** (up to `+.018em` on the
display) — the reverse of convention, which tightens large titles. Running
text is at `.006em`, near zero.

**The action group rises** by `28px − space-l`, i.e. 8 px: it bites into
the subtitle's line-height instead of detaching from it.

**The panel bleeds out of the gutter** via a negative margin equal to the
rail (`margin-inline-start: calc(-1 * var(--rail))`): the text stays
aligned to the gutter, the image touches the edge of the screen. Each side
then reclaims the rail inside its own track's padding.

**A panel's background is its own content, blurred.** `filter:
blur(200px)`, `opacity: .48`, enlarged by 400 px and offset by −200 px so
no edge shows. Each section therefore takes on the tint of what it shows,
with no dedicated color token. Below 1000 px, this blur is simply
disabled — it costs too much.

**The shadow follows the shape, not the rectangle**:
`drop-shadow(0 14px 44px …18%)` rather than `box-shadow`. The image keeps
its sharp corners and still floats.

**Scroll snap set to `proximity`, never `mandatory`**: the strip aligns
if you stop near a point, without ever forcing it. The track's padding is
compensated by a negative margin of the same value, so the snap zone can
overflow the frame without shifting the layout. Beyond 950 px, the left
section snaps on `end` instead of `start` — the reading direction changes
with the side that bleeds.

**Three layouts reorganize via `display: contents`**: the copy for a
section with an embedded editor above 1,161 px, the reference column
below 1,000 px, the template card below 1,024 px. Each time the container
disappears and its children become elements of the parent grid, free to
reorder.

**The `<body>` is the query container** (`container-type: inline-size`),
and width utilities are written in `@container`, not `@media`.

**The hero cards' reflection is a `-webkit-box-reflect`** faded by a
gradient that only starts at 35%. Non-standard, but with no extra element
and no layout cost, and it degrades gracefully everywhere else.

---

## 6. Coverage

The seven sections of `main` are rendered in the source's order, with
their two embedded-editor slots flagged:

| # | Original `data-section` | Layout | Particularity |
|---|---|---|---|
| 1 | `directly-edit-any-object` | featureleft | embedded editor + static fallback |
| 2 | `draw-what-you-want-to-see` | featureright | static, two actions |
| 3 | `create-using-references` | references | grid of selectable cards |
| 4 | `create-at-scale-with-templates` | templates | simulated editing panel |
| 5 | `add-effects` | featureright | embedded editor + static fallback |
| 6 | `live-layers` | featureleft | static |
| 7 | `reframe` | featureright | static |

Plus the header and its veil, the hero (13 cards, two with video), the
lazy-load marker, the closing prompt, the horizontal gallery, and the
footer. No zone is omitted.

Substitutions, all flagged in the code:

| Element | Source | Here |
|---|---|---|
| Fonts | ReveDisplay / ReveUI / ReveSansMono, proprietary variable `.woff2` | system stack; sizes, weights, line-heights and tracking recorded exactly |
| Embedded editor | `<rv-landing-explore-frame>` | slot marked + source's static fallback |
| Header, prompt, gallery, footer | empty `<rv-*>` components, rendered in JS | rebuilt with the recorded tokens |
| Reference image crossfade | in-place `src` swap | two layers + `decode()`, 200 ms |

Media point to `https://app.reve.com/model-landing/…`; no binary is
stored locally.

---

## 7. Motion API — verified traps

Facts checked before writing `motion.js`, all Baseline widely available:

- **`scrollBy({behavior:'smooth'})` NEVER consults
  `prefers-reduced-motion` on its own.** Unlike CSS animations, the
  scrolling API ignores the preference: you have to read
  `matchMedia('(prefers-reduced-motion: reduce)').matches` yourself and
  force `behavior: 'instant'`. This reference sidesteps the problem
  entirely by **writing `scrollLeft`** rather than calling `scrollBy` —
  the direct write animates nothing, the drift is produced frame by frame
  and therefore stops dead under reduced motion.
- If `behavior` is omitted, the default `'auto'` **silently** follows the
  CSS `scroll-behavior`. You must be explicit.
- **`addListener()` is deprecated**: media queries should be listened to
  with `addEventListener('change', fn)`. That's what `motion.js` does,
  which makes the preference reactive without a reload.
- `IntersectionObserver` with a negative `rootMargin` and a `threshold`
  (default `0`) — used for the veil, the header theme, deferred images,
  and stopping the drift offscreen, rather than a per-frame `scroll`
  listener.
- `element.style.animationPlayState` allows resuming without resetting —
  not used here, since the drift is driven via
  `requestAnimationFrame`.

### Keyboard states

Every control is reachable via `Tab`: header and action links, reference
cards (`<button>`), template arrows, the template field, video card
containers and gallery thumbnails (`tabindex="0"`), the prompt's input
area and tools, footer links. The global `:focus-visible` rule gives them
the 2 px ring on the accent; only two elements are excluded because they
carry their own — the template field (neutral ring at 24%, offset 1 px)
and the prompt's input area (ring carried by the container via
`:focus-within`).

**Honest caveat**: these states were verified by reading the CSS and via
screenshots where they're forced, **not** by an actual `Tab` keypress. The
available capture tool (`chrome-headless-shell` without CDP) cannot send
keyboard events, and `autofocus` did not produce a usable capture.

---

## 8. Note on the two behavior files

A hook in the host repo caps every code file at 200 lines. The drifting
strip therefore lives in its own module, `motion-bande.js`: it's the only
behavior big enough to justify one, and the only one that **two** blocks
depend on (the hero carousel and the footer gallery). It's loaded before
`motion.js` — the `defer` order is guaranteed — and exposes itself on
`window.RevBande` rather than as an ES module, which doesn't load from a
`file://` URL.

The split follows responsibility, not just the constraint: `motion.js`
keeps the seven short behaviors, `motion-bande.js` the one long one, with
room to comment it properly.

### No element can stay invisible

The CSS's six `opacity: 0` rules each have their own trigger, and the two
that would depend on the script carry `est-active` **hard-coded in the
HTML** (the first image of the template render and its thumbnail). No
`js` class is ever set on `<html>`: nothing depends on the script to be
visible. If `motion.js` fails to run, the page stays fully readable — the
deferred images are the only thing that won't load, and they all carry
`width`/`height`.
