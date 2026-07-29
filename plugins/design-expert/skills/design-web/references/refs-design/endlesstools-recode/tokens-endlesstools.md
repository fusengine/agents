# Design reference — dark product page, video as a layout material

Measured on `endlesstools.io` (Next.js, a single external CSS sheet:
`_next/static/chunks/7cbd7ac42dbd96bf.css`, no inline `<style>`).
`[relevé]` = value read verbatim in this sheet, in an attribute of the served HTML,
or in the hydrated DOM of the live page. `[arbitrage]` = a choice made by this reference.

**Two sources of measurement, not to be confused.** The HTML served by the server contains
only part of the page: the opening mosaic is an empty container there, mounted
client-side. Everything concerning it was measured on the **hydrated DOM** (`--dump-dom`
after execution), not on the static capture. The distinction is flagged every time
it matters, because it changes what can be asserted: several rules that the
static capture makes look unused are in fact employed after hydration.

Output: `index.html` + `styles.css` + `motion.js`. All media is remote.
The page has **20 mosaic tiles, 8 feature tiles, 14 review cards,
20 videos** (12 hover videos, 7 in cards, 1 demo).

---

## 1. The main technique: eight videos as page material

50 `<img>` for 8 `<video>`. Video is not an add-on: it occupies the opening
scene, the central demo, and half the testimonial cards. The cost
of such a page rests entirely on four decisions, all of which can be measured.

### 1.1 The attributes, identical across all eight

```html
<video preload="none" loop muted autoPlay playsInline></video>
```

| Attribute | Effect | Why it's there |
|---|---|---|
| `preload="none"` | **[relevé]** no byte requested when the document loads | eight preloaded videos would ruin the LCP; here the page loads as if they didn't exist |
| `muted` | **[relevé]** | *sine qua non* condition for autoplay across all browsers |
| `autoplay` | **[relevé]** | starts as soon as the resource is ready |
| `loop` | **[relevé]** | short loops, no visible end, no controls |
| `playsinline` | **[relevé]** | prevents forced fullscreen on iOS |
| *(no `poster`)* | **[relevé]** | the absence is a choice: the box's black background acts as the placeholder image |
| *(no `controls`)* | **[relevé]** | the video is decor, not a player |

### 1.2 The box is reserved before any loading

Each media item sits in a wrapper with an intrinsic ratio, not in a box sized
by the media itself:

```html
<div style="padding-bottom:57.324841%" class="relative overflow-hidden rounded-[7px]">
  <div class="absolute inset-0 w-full h-full"><video …></video></div>
</div>
```

The `padding-bottom` carries the **exact ratio of the file**, never a round value. Verified:

| Media | Actual dimensions | `padding-bottom` measured |
|---|---|---|
| `/videos/main.mp4` | 1400 × 1028 | `73.4285%` |
| `/tweets/01.mp4` | 628 × 360 | `57.324841%` |
| `/tweets/05.mp4` | 540 × 540 | `100%` |
| `/tweets/09.mp4` | 968 × 720 | `74.380165%` |
| `/tweets/12.mp4` | 1034 × 720 | `69.632495%` |
| `/tweets/03.jpg` | 2048 × 1152 | `56.25%` |
| `/tweets/06.jpg` | 1360 × 680 | `50%` |

Consequence: **zero layout shift**, and the page stays intact if a video never
loads — the box keeps its place, black. This is the point to reuse first.

A corollary worth noting on its own: **no `object-fit` on these
media items**. The inline style is limited to `position:absolute; width:100%; height:100%;
inset:0` **[relevé]** — since the frame's ratio is exactly that of the file, stretching
to 100% distorts nothing. `object-fit` is only useful when the ratio isn't controlled.

The `.object-cover` rule exists in the sheet and **is used elsewhere**: on the mosaic's
hover videos (§1 bis), whose ratio isn't known in advance since they
overlay a cover image. Two treatments, two needs: controlled ratio
→ no `object-fit`; imposed ratio → `cover`. That's the rule to remember, not the absence.

The only exception is the opening scene: **fixed** height (`1200px`, `760px` above
`48rem`) **[relevé]** with `object-fit: cover`. Here the media is cropped, never distorted, and
the block's height depends on no file. Note that the height *increases* on small screens
(1200 > 760): the scene becomes a portrait there, and the cropping is blunt — this is deliberate, the
source does the same with `overflow-hidden` on content much wider than the viewport.

### 1.3 What the source doesn't do — and what is added here

The source starts all eight playbacks and lets them run, regardless of position in the
page, and without any `prefers-reduced-motion` anywhere in the sheet. **[arbitrage]**:

```js
const activer = (v) => {
  if (!v.src) { v.src = v.dataset.src; v.preload = 'metadata'; }
  if (!calme.matches) v.play().catch(() => {});
};
new IntersectionObserver(entrees => entrees.forEach(e => {
  if (e.isIntersecting) activer(e.target);
  else if (e.target.src && !e.target.paused) e.target.pause();
}), { rootMargin: '200px 0px', threshold: 0.1 });
```

- `src` is only set at 200px from the viewport: the source's `preload="none"` becomes a
  genuine deferred load, not just a delayed one.
- Playback stopped on leaving the screen: only one video decodes at a time in practice.
- Under `prefers-reduced-motion: reduce`, `src` is set (the first frame displays) but
  `play()` is **never** called. A page with eight autoplays without this guard is
  unusable for anyone who has set this preference.

---

## 1 bis. The opening mosaic — and the second video treatment

This is the block that gives the page its impression, and it is **invisible in the served
HTML**: twenty tiles mounted client-side in an empty container. Measured on the hydrated
DOM.

### Masonry without masonry

```html
<div class="px-[8px] pt-px">
  <div style="display:grid; align-items:start; column-gap:8px;
              grid-template-columns:repeat(6, minmax(0,1fr))">
    <div style="display:grid; row-gap:8px; grid-template-columns:minmax(0,1fr)">…</div>
```
**[relevé]** — six columns, each a grid of a **single** column. The images keep
their natural ratio, so the columns desynchronize on their own: not one pixel of
height calculation, not one absolute position. `align-items:start` prevents stretching.

The number of columns changes with width — **two** on small screens, **six** above —
and the source recalculates it in JS. The delivered output achieves the same masonry with
`columns: 2` / `columns: 6` in pure CSS: gutters and column count measured,
distribution redone. **[arbitrage de mécanisme]**

The scene containing all this has a **fixed height** with `overflow:hidden`: the mosaic
is cut mid-image, and the 340px bottom veil blends the cut into black. You never
see a row end — that's what gives the impression of an endless catalog.

### The tile

| Element | Measured value |
|---|---|
| container | `rounded-[10px] bg-secondary overflow-hidden relative` |
| hairline | `ring-0` at rest → `hover:ring-1 ring-grey-2` (`#2a2a2a`) + `transition` |
| image | `group-hover:opacity-0` |
| video | overlaid `absolute inset-0 w-full h-full object-cover`, `opacity-0 group-hover:opacity-100` |
| veil | `absolute -bottom-px z-10 h-[50%] bg-gradient-to-b from-black/0 to-black/70` |
| caption | `absolute bottom-0 z-20 inset-x-0 p-[5px] sm:p-[10px]` |
| title | `text-body-secondary font-medium mb-[5px]` |
| tags | `text-[8px] leading-[10px] p-[5px] rounded-full bg-white/50 uppercase backdrop-blur-xl` |

Three techniques worth remembering:

1. **The veil only covers the bottom half**, and it's offset by one pixel *below* the edge
   (`-bottom-px`): no sharp line can appear right at the edge. The gradient goes
   from transparent to black at only 70% — the image stays legible underneath.
2. **The tags are `bg-white/50` + `backdrop-blur-xl`**, not an opaque background. The
   background blur is what makes them legible on any image without
   darkening the tile. This is the only place on the page where `--blur-xl` (24px) is used.
3. **8px of uppercase text**: at this size, the uppercase is no longer
   typography but texture. It reads as a block, not word by word.

### The second video treatment — the opposite of the first

```html
<video preload="auto" loop playsinline
       class="w-full h-full opacity-0 group-hover:opacity-100 absolute inset-0 object-cover">
```
**[relevé]**. Compared to the eight content videos (§1):

| | Content videos | Hover videos |
|---|---|---|
| `preload` | `none` | **`auto`** |
| trigger | `autoplay` | hover (CSS for opacity, JS for playback) |
| `muted` | yes | **absent** |
| `object-fit` | none (controlled ratio) | `cover` (imposed ratio) |
| role | page material | pointer reveal |

The last two rows are **defects**, fixed in the delivered output: twelve
`preload="auto"` download twelve videos on load for content that no one
will see without hovering — replaced with a load on first hover; and without `muted`, a
browser refuses programmatic playback — the attribute is added. Hover is also
wired to `focusin`/`focusout`, without which the technique would only exist for the mouse.

---

## 2. Measured transitions

A single duration and a single curve carry almost everything: `--default-transition-duration: .15s`
and `--default-transition-timing-function: cubic-bezier(.4, 0, .2, 1)` **[relevé]**.
Zero `@keyframes` in the HTML, one in the sheet.

| # | Trigger | Property | Start → end | Duration | Curve |
|---|---|---|---|---|---|
| 1 | entering the viewport (JS) | `opacity`, `transform` | `0 → 1`, `translateY(5px) → 0` **[relevé, état de départ inline]** | `.5s` **[arbitrage]** | `cubic-bezier(.16,1,.3,1)` **[arbitrage]** |
| 2 | `:hover` top-bar pill | `background-color`, `color` | `secondary/80 → secondary`, `grey-4 → white` | `.15s` | `cubic-bezier(.4,0,.2,1)` |
| 3 | `:hover` solid button | `opacity` | `1 → .85` | `.15s` | same |
| 4 | `:hover` toggle option | `color` | `white/30 → white/75` | `.15s` | same |
| 5 | `:disabled` toggle option | `color` | `white/30 → white` | `.15s` | same — *the active option is the one that's disabled* |
| 6 | `:hover` white card button | `background-color` | `white → white/90` | `.15s` | same |
| 7 | `:hover` submit button | `background-color` | `white → white/85` | `.15s` | same |
| 8 | `:disabled` submit button | `background-color` | `white → white/65` | `.15s` | same |
| 9 | `:checked` consent checkbox | `background-color` | `transparent → white` | `.15s` | same |
| 10 | `:hover` rail arrow | `opacity` | `.65 → 1` | `.15s` | same |
| 11 | `:hover` footer link | `color` | `grey-4 → white` | `.15s` | same |
| 12 | **permanent**, subscription button | `background-position` | `0% → 100%` on `background-size: 200% 200%` | `1.5s` | `ease-in-out`, `infinite alternate` |

Row 12 is the only self-running animation on the page:

```css
.ui-button-upgrade-animated{
  background-image:linear-gradient(97.25deg,#b8ff45 3%,#ffcb45 22%,#ff00b8 100%);
  background-size:200% 200%; background-position:0%;
}
@keyframes move-gradient{0%{background-position:0%}to{background-position:100%}}
```
**[relevé intégralement]**. A single point of saturated color on an otherwise monochrome page, placed
on the one button meant to be seen. This is the page's most effective hierarchy technique.

Constraint upheld here: `animation-timeline: view()/scroll()` is **ruled out** (not *widely
available*), reveals go through `IntersectionObserver` (*widely available* since
March 2019). `linear()` remains available if needed (*widely* since December 2023).

**Absent from the served HTML — but check after hydration.** `.duration-300` and
`.ease-in-out` appear nowhere, neither before nor after: **all** the transitions
on the page run at the default `.15s` duration, none is slowed down, none has an
overridden curve. On the other hand, `.blur-xl` and `.object-cover`, absent from the
static capture, **are both used** in the hydrated mosaic (§1 bis) — hence the
methodological rule: on a client-rendered application, a rule believed dead
is often only dead in the served HTML. Only `.text-sm` is truly dead: the sheet
contains no rule by that name.

The only color value that appears nowhere else is
`.et-tweet-content a{color:#1d9bf0}` **[relevé]** — the blue of mentions in reviews,
the only color not controlled by the system because it comes from an external convention.

---

## 3. Color — named by role

The system fits in seven values. None is colored, except the promotional accent.

| Role | Value | Source |
|---|---|---|
| `--fond-page` | `#000` | **[relevé]** class `bg-[#000]` on `<body>` |
| `--fond-scene` | `#0a0a0a` | **[relevé]** `--color-black` |
| `--fond-carte` | `#080808` | **[relevé]** testimonial cards |
| `--fond-champ` | `#1e1e1e` | **[relevé]** `--color-secondary` |
| `--fond-action` | `#373737` | **[relevé]** `--color-grey-1` |
| `--texte-primaire` | `#fff` | **[relevé]** |
| `--texte-secondaire` | `#959595` | **[relevé]** `--color-grey-4` |
| `--texte-tertiaire` | `#555` | **[relevé]** `--color-grey-3` |
| `--trait-discret` | `#373737` | **[relevé]** `ring-grey-1` |
| `--trait-carte` | `#505050` | **[relevé]** `ring-[#505050]` |
| `--accent-promo` | `#ff3dae` | **[relevé]** discount badge |

Three reusable observations:

1. **The page black (`#000`) is darker than the component black (`#0a0a0a`).** Surfaces
   are therefore *lighter* than the background, never the reverse. The testimonial card
   (`#080808`) is nearly indistinguishable from the background: it's the **hairline** that draws it, not
   its fill.
2. **Borders are `box-shadow`, not `border`**: `ring-1 …` **[relevé]**. The
   line never modifies the box. And the inset/outset distinction isn't
   decorative, it follows a rule:
   - `ring-1 … ring-inset` → **surfaces**: review cards, pricing cards, top-bar
     pill. The line bites inward, the card keeps its exact width in the grid.
   - `ring-1 …` **without** `ring-inset` → **media frames and fields**: the line is external and
     doesn't eat into a single pixel row of the image or video.

   When no color class accompanies `ring-1`, the color falls back to
   `currentColor` **[relevé**: `--tw-ring-color, currentColor` in the `.ring-1` rule**]** —
   this is the case for the offer token and the login pill, whose hairline lightens
   **along with their text** on hover, with no rule declaring it.
3. **Opacity states go through `color-mix(in oklab, …)`** **[relevé]** — `white/85`,
   `secondary/80`, etc. A single base color, all states derived.

Two masking gradients, never decorative:

```css
.nav-gradient       { background: linear-gradient(#000 14.73%, #000a0a00 100%); } /* [relevé] */
.ui-overlay-gradient{ background: linear-gradient(#0000 0%, #000 85.27%); }       /* [relevé] */
```
The first makes the top bar legible without an opaque background; the second (340px tall,
`pointer-events:none`) blends the bottom of the scene into the page. The non-round percentages
(`14.73%`, `85.27%`) are measured as-is.

---

## 4. Typography

Inter. Five tiers, not one more, all **[relevés]**:

| Role | Size / line-height | Weight | Tracking |
|---|---|---|---|
| caption | `12 / 14` | — | — |
| body | `14 / 18` | — | — |
| subtitle | `18 / 20` | — | — |
| secondary title | `24 / 26` | `500` | `-.03em` |
| primary title | `42 / 46` | `500` | `-.03em` |

The notable point: **there is no intermediate tier**. A title is `24px` below
`48rem`, `42px` above, and nothing in between — no `clamp()`, no
fluid scaling. The ratio `42/24 = 1.75` is the page's only jump.

The only declared weight is `500` (`--font-weight-medium`): the sheet contains no
`font-bold`/`font-semibold` class **[relevé]**, the only other `font-weight` is the
`bolder` from the reset on `b`/`strong`. The hierarchy rests on size and negative
tracking, not on boldness.

Line widths: titles and taglines are bounded by very short `max-width`
(`180px`, `215px`, `270px`, `280px`, `370px`, `460px`, `540px`, `620px`, `820px`,
`900px`) **[relevés]**, chosen to force a precise line-wrap point. This is a
composition setting, not a legibility one — and they go **in pairs** across breakpoints:
`270 → 620`, `280 → 460`, `540 → 900`. The composition is reframed at each breakpoint, it
is never left to the chance of available width.

**A dead class, not to be copied.** The billing selector carries `text-sm` in
the HTML, but the sheet **contains no `.text-sm` rule** (the theme doesn't declare
`--text-sm`): the class produces nothing and the size falls back to the body's, `14px`.
The delivered output reproduces the size actually obtained, not the displayed class — this is flagged
in a CSS comment. `tracking-tight` on this same block, however, is well defined
and equals `-.025em` **[relevé]**, not to be confused with the `-.03em` of the titles.

---

## 5. Structure and rhythm

```
top bar (sticky, mask gradient)
├ opening ........... title + tagline + action, then fixed-height scene
│                     containing the 20-tile mosaic (2 → 6 columns)
├ demo .............. centered title + single video capped at 900px
├ features .......... 8 square tiles, 2 columns → 4 above 48rem
├ pricing ........... 2 ringed cards, sliding rail on small screens
├ testimonials ...... horizontal rail of 14 cards, free heights aligned at bottom
├ signup ............ field + button + consent, 310px wide
└ footer ............ two rows of links
```

Total height at 1440px: **5,463px for the source, 5,452px for the delivered output** —
0.2% difference, measured from the automatic cropping of both full-page captures.

**Short texts are layout elements, not content.** Titles,
subtitles, button labels, tags, numbers and captions are taken **word for
word** from the source. The reason is measurable: an early version paraphrased these
texts, and the total height difference was 33px; restoring them verbatim
brought it down to 11px. The exact length of a title dictates its line breaks, hence the height
of its block, hence the rhythm of the whole page. A translated title breaks the composition even
when every measured typographic value is correct.

Three exceptions, and their reason:

| What is changed | Why |
|---|---|
| The brand name, replaced by a brand-word of **identical length** (13 characters) | a design reference doesn't reuse a company's identity; the length is kept so nothing shifts |
| The names and handles of review authors | these are real people — their identity isn't a design element |
| The body of the reviews, rewritten to equivalent visual length | the only category the brief allows to be shortened |

Worth noting, in the same spirit: the source writes `Digital Atrifact` — a typo for
*Artifact*. It is **reproduced as-is**, because it occupies the width it
occupies. Correcting the spelling in a layout reference would be one more
error, not one less.

- Vertical spacing: `150px` between sections **[relevé]**, `100px` around internal blocks.
- Edge margins: `20px`, `40px` above `48rem` **[relevé]**.
- Breakpoints: `40rem` and `48rem` **[relevés]** (`sm` and `md`). The sheet also contains
  `480px`, `720px`, `980px`, `1240px`, unused on the blocks measured here.
- Radii: `10px` (opening button), `12px` (cards, field, submit button), `7px`
  (card buttons, media frames) **[relevés]**. Three radii for three object scales.
- The testimonial rail aligns cards **at the bottom** (`items-end` **[relevé]**), which
  deliberately leaves empty space above short cards. Media of different ratios
  are therefore never cropped to align: it's the grid that yields.
- Rail cell widths: `85%` → `45%` (sm) → `1/3` (md) **[relevées]**. The `85%`
  on small screens lets the next card poke through: the hint says there's more to come,
  with no indicator or text.

**What the capture doesn't say.** The static HTML contains neither `overflow-x-auto`, nor
`snap-*`, nor `translate-x`, nor `transition-transform` (0 occurrences each): the rails
are moved **entirely in JS**, with styles set at runtime. The mechanism is
therefore **not observable** in the scraped source. The delivered output uses native scrolling
with `scroll-snap`, flagged `[arbitrage]` in the CSS — the widths, the alignment, the
container's `overflow-hidden` and the controls (40 × 40 arrows at `opacity .65`, a
50 × 6 gauge on `#333`) are, however, measured.

---

## 6. Source defects, fixed here

| Measured defect | Fix |
|---|---|
| **4 `<h1>`** in the document | a single `<h1>` (opening), the rest as `<h2>` |
| **No `prefers-reduced-motion`** anywhere in the sheet | `reduce` block covering reveals, animated gradient, rail scrolling **and** video autoplay |
| Eight videos playing permanently, including offscreen | playback tied to `IntersectionObserver`, `pause()` on exit |
| Starting state of reveals written as inline `style` (`opacity:0`) | set in CSS; without JS the content would stay invisible in the source, here it's revealed by the same observer which, under `reduce`, reveals everything immediately |
| Email field: `outline:none` with no replacement | visible focus ring on `:focus-visible` |
| Consent checkbox: no visible focus | `outline` on `:focus-visible` |
| Placeholder in the browser's default gray, illegible on `#1e1e1e` | raised to `--texte-secondaire` |

---

## 6 bis. Where the source hides its values

For anyone applying this corpus to another client-rendered application, the measurement
order that worked here:

1. **The external CSS sheet** gives the system: colors, type scale, radii,
   durations, curves, keyframes. It's the only complete source — everything is there, even what
   isn't used.
2. **The served HTML** gives the structure of the server-rendered sections, and the **starting
   state** of the animations (the `style="opacity:0"` set before hydration) — information
   found nowhere else.
3. **The hydrated DOM** (`--dump-dom` after execution) gives everything else: blocks mounted
   client-side, computed inline styles, injected media URLs. Without it, the opening
   mosaic — the page's most visible block — stays an empty `<div>`.
4. **The JS bundles** give the media paths the DOM doesn't yet expose, for
   example the video file names of the review cards (with spaces, to be encoded).

Animation durations and curves, however, are **in none of the four**: they
live in the component's code. Every reveal-timing value in this corpus is
therefore an `[arbitrage]`, never a measured value.

---

## 7. Media — URL reconstruction

wget rewrote the `src` attributes into relative paths. Reconstruction: remote prefix + query
string kept as-is. All verified over HTTP (200/206):

- images: `https://endlesstools.io/_next/image?url=%2Ffeatures%2Fnew%2F0N.png&w=1080&q=75`
- avatars: `https://endlesstools.io/_next/image?url=%2Ftweets%2FNN-avatar.jpg&w=128&q=75`
- videos: `https://endlesstools.io/videos/main.mp4`, `https://endlesstools.io/tweets/{01,05,09,12}.mp4`

- mosaic: `https://endlesstools.io/_next/image?url=<encoded API URL>&w=640&q=75`, where
  the original URL points to
  `https://api.endlesstools.io/storage/v1/object/public/templates/templates/<uuid>/cover-….jpg`
- hover videos: the same API base, file `hover-….mp4` (accessible directly)

The `<video>` elements in review cards have **no** `src` in the served HTML: the paths
are injected client-side and were found in
`_next/static/chunks/d8dcfdd1b803c345.js`. Three of them contain spaces
(`/tweets/Sang - 1986115678320099499 - 1848x1080.mp4`) and must be encoded as `%20`.

The `dpl=…` parameter of the local URLs is optional (verified: they respond without it);
it was removed to lighten the file — **[arbitrage]**.

**No media is unreproducible**: the 20 tiles, the 8 icons, the 14 avatars,
the 12 badges, the 7 card images and the 20 videos all respond over HTTP from
their original remote URL. No media is copied locally, no `assets/`.

---

## 8. Summary of deliberate deviations

Everything else in the delivered CSS carries a value read from the source. The only deviations, all
flagged at their line:

| Deviation | Reason |
|---|---|
| Rail mechanism (native scrolling + `scroll-snap`) | movement driven by JS in the source, **not observable** in the capture |
| Mosaic distribution (CSS multi-column) | distributed in JS in the source; gutters and column count are measured |
| Reveal duration and curve (`.5s`, `cubic-bezier(.16,1,.3,1)`) | animated in JS, no value in the sheet — only the **starting state** is measured |
| Brand-word instead of the image logo, and brand name neutralized at equal length | no identity reuse in a design reference |
| Names and handles of review authors | real people; their identity isn't a design element |
| `preload="none"` + load-on-hover on mosaic videos | the source preloads all twelve; a performance defect |
| `muted` added on hover videos | the source omits it, which blocks programmatic playback |
| `object-fit: cover` on card media frames | a safeguard; the source only sets it on hover videos |
| Background `#0a0a0a` on media frames | the source leaves them transparent |
| Edge inset on pricing cards via `padding` | the source uses `first-of-type:ml-[20px]`; identical value, different form |
| `--duree-lente` used on the rail gauge | `.duration-300` exists in the sheet but is used nowhere on the page |
| Focus rings, placeholder, `prefers-reduced-motion`, a single `<h1>` | defect fixes, listed in §6 |
