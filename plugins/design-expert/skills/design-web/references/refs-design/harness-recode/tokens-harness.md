# Design reference — dark rotating-tabs page

Corpus of **techniques**, measured on a very dense Webflow homepage
(344 KB of HTML, 790 KB of CSS, 211 `<img>`). **Full coverage**: the
seven sections of the source are reproduced, in order, with no cuts.
This is not a clone: structure, rhythm, typography, color system and
animation mechanics are reproduced.

**Short texts are taken verbatim from the source** — headings, navigation
labels, button labels, tab labels, column labels, figures and mentions. This is
not content, it's **layout**: the exact length of a heading dictates its line
breaks, its block height and the vertical rhythm around it. A paraphrased
heading breaks the composition even when the measured typography is exact.
Only long prose paragraphs are kept at equivalent visual length, and
testimonial quotes are rewritten (they are attributed to real people).

Four files: `index.html` · `styles.css` · `motion.js` · this document.

Sources of the `[relevé]` entries, cited throughout the CSS and JS:

- **(A)** `cdn.prod.website-files.com/6222ca42ea87e1bd1aa1d10c/css/harnessio.webflow.68751cfc31184e27debae3cb.fcb0aa6f4.opt.css` — 790 KB, unminified, indented. This is the mother lode.
- **(B)** the **53 inline `<style>` blocks** of `index.html`. Line numbers given.
- **(C)** `harnessio.webflow.shared.6154f9264.css` — the 39 `@font-face` rules.

Convention: `[relevé]` = value read verbatim · `[arbitrage]` = a decision made
on my part. Anything not marked `[relevé]` is an assumed arbitration.

---

## 0. Verification method

Reading the CSS is not enough: in 790 KB, knowing **which** rule wins requires
knowing the specificity, the order, and the classes actually carried by the
element. Five errors of this kind were made and then corrected (§8). Final
verification is therefore done on the **computed DOM of the source**:

1. The scraped source is served locally (`python3 -m http.server`).
2. Its CSS `<link>` tags carry an `integrity` attribute — since wget rewrote the
   image URLs **inside** the CSS, the SRI hash no longer matches and the
   browser **silently rejects both stylesheets**. Without noticing this, you'd
   believe you were rendering the source when you were actually rendering bare
   HTML. Worked around with a page that fetches the HTML, strips
   `integrity`/`crossorigin`, injects a `<base>` and rewrites the document.
3. A probe reads `getComputedStyle()` and `getBoundingClientRect()` on about
   fifteen elements and displays them in plain text on the page, which is
   then captured.

Values measured this way (viewport 1440×1200), used as the reference:

| Element | Measurement on the source |
|---|---|
| `h1` | `Calsans` · 64px · line-height 73.6px (115%) · `rgb(0,173,228)` · `capitalize` · 600 |
| Section `h2` | `Geist` · 64px · 73.6px · `capitalize` |
| Giant block | `Calsans` · 186px · 241.8px (1.3) · 600 |
| CTA heading | `Geist` · 65px · 71.5px (110%) · max-width 600px · `capitalize` |
| Hero paragraph | 18px · 27px (150%) · `rgb(200,202,208)` |
| Hero grid | `grid` · **660px 360px** · margin-bottom **100px** · max-width 1200 |
| Hero section | padding-top **100px** · padding-bottom **0** · `overflow: hidden` · z-index 50 |
| Hero media | **x227 y−42 w1400 h788** · `object-fit: cover` |
| Media wrapper | **0 × 0** · `position: static` |
| Hero button | 20px · padding 16px 24px · radius 32px · white background · text `rgb(7,7,7)` |
| Card (inner wrapper) | padding 16px · radius **16px** · gap 12px |
| `body` | background `rgb(7,7,7)` · `Geist` |

---

## 1. Animation engines actually present

A point to correct right away: **there is no Rive on this page.**
`grep -i rive` over the 344 KB of HTML only turns up `home-value-drivers` and
`AI-driven`. No `@rive-app`, no `.riv`, no `new rive.Rive`.

| Engine | Version | What it drives here | Reimplemented? |
|---|---|---|---|
| **GSAP** | 3.15.0 — `gsap` + `ScrollTrigger`, `ScrollSmoother`, `Flip`, `MorphSVG`, `TextPlugin`, `ScrollToPlugin` | `gsap.registerPlugin(...)` is called, but **there is no `gsap.to/from/timeline` nor any `scrollTrigger:` block in the delivered HTML**. The plugins are registered then driven from external JS. | Yes: what ScrollSmoother and TextPlugin were doing is redone in vanilla JS (parallax §3.10, counter §3.11) |
| **Lottie-web** | 5.12.2 | 16 `lottie.loadAnimation({...})`, 15 `.lottie-container`. Animated visuals of the panels, created/destroyed on the fly according to the active tab. | **No — the only irreproducible element.** A vector rendering scripted frame by frame has no reasonable CSS or vanilla equivalent. Container, dimensions and cycle kept; content replaced by an image. |
| **Vanilla JS + IntersectionObserver** | native | Scroll reveal, tab rotation, entry cascade. | Yes, identically |
| **Webflow IX2 / w-slider / w-dropdown** | `webflow.js` | Testimonial carousel and mega-menu. Only 2 `data-w-id` — IX2 barely used. | Yes, in vanilla (§3.13, §3.15) |
| **`<video>` HTML5** | native | Hero media: `loop playsinline muted autoplay`, 2 sources (mp4 + webm). | Replaced by a remote image |

Volume: only **3 `@keyframes`** in the HTML, but **37 `transition`** declarations.
Most of the motion goes through class-triggered state transitions, not
keyframes.

---

## 2. Effects table

| # | Effect | Trigger | Property | Start → End | Duration | Curve | Cascade | Original engine |
|---|---|---|---|---|---|---|---|---|
| 1 | Scroll reveal | `IntersectionObserver`, `threshold: 0.2` → `.is-revealed` | `opacity`, `transform` | `0 / translateY(12px)` → `1 / none` | `.65s` | `cubic-bezier(.22,.61,.36,1)` | [arbitrage] `rootMargin -12%` | vanilla JS (B l.71-81, 3210-3241) |
| 2 | Panel media entry | tab change → `.is-media-entering` | `opacity`, `scale()` | `0 / .965` → `1 / 1` | `700ms` | `ease`, `both` | delay `.12s` | vanilla JS (B l.88-97, 109-113) |
| 3 | Blurred halo entry | same change → `.is-blur-bg-entering` | `opacity`, `scale()` | `0 / .99` → `1 / 1` | `700ms` | `ease`, `both` | delay `.42s` — **300 ms after** | vanilla JS (B l.98-107, 114-118) |
| 4 | Active card toggle | `.w--current` (here `.is-active`) | `background-color`, `transform` | transparent → `#ffffff12` | `600ms` | `ease` | — | pure CSS (B l.83-86) |
| 5 | Card widening | `.w--current` | `max-width` | → `40rem` | `.2s` | default | — | pure CSS (A) |
| 6 | Panel cross-fade | Webflow tabs | `opacity` | fade in | in `300ms` / out `0ms` | `ease-out` | — | Webflow tabs (`data-duration-in="300"`) |
| 7 | Automatic tab rotation | timer restarted after each switch | active index | — | `4000ms` (image) · `23000ms` (Lottie) | — | stops **permanently** on first interaction | vanilla JS (B l.2925-2926, 3129-3141) |
| 8 | Logo marquee | permanent | `translateX()` | `0` → `-100%` | `24s` | `linear`, `infinite` | pause on hover | pure CSS (B l.376-386) |
| 9 | Button shadow | `:hover` | `box-shadow` | `2px 2px #0000000d` → `2px 4px #0000000d` | — (not transitioned) | — | — | pure CSS (A) |
| 10 | Logo opacity | `:hover` | `opacity` | `.8` → `1` | — (not transitioned) | — | — | pure CSS (A) |
| 11 | Carousel rotation | timer + IO | active slide | — | `7000ms` [arbitrage] | — | permanent stop on interaction | Webflow `w-slider` |
| 12 | Giant block counter | IO, `threshold: 0.6` [arbitrage] | `textContent` | `0` → `100` | `1400ms` [arbitrage] | `easeOutCubic` [arbitrage] | — | GSAP TextPlugin (registered, not called in the delivered HTML) |
| 13 | Hero media parallax | passive `scroll` + rAF throttle | `translate3d` | `0` → `min(scrollY×.12, 90px)` [arbitrage] | continuous | linear | — | GSAP ScrollSmoother (registered) |
| 14 | Mega-menu opening | hover + click | `hidden`, chevron `rotate` | — | `.3s` on the chevron [arbitrage] | `ease-out curve` | — | Webflow `w-dropdown` |

Detail verified on effects 9 and 10: the source declares
`transition: background-color .3s` on the button — **the background only**.
The shadow and the logo opacity therefore change **abruptly**. Reproduced as
is: adding a transition "because it looks cleaner" would be a silent
arbitration.

**The only element flagged as irreproducible** remains the 16 **Lottie**
panel animations. The 23 s *dwell* on a Lottie panel versus 4 s on an image
panel is the direct trace of this dependency: an animated panel stays
displayed for as long as its loop takes to play.

---

## 3. Reusable techniques

### 3.1 The hero media: anchored right, overflowing, behind the text

The densest technique on the page, held by **a single declaration**:

```css
.home_hero-lottie-embed { z-index: -1; position: absolute; inset: -15% -13% 0% auto; }
```

Four decisions inside one `inset`: `top: -15%` pushes the media **above**
the top of the section · `right: -13%` makes it **stick out to the right** ·
`bottom: 0` keeps it **flush with the bottom** · `left: auto` lets its width
come from the content (1400px). `z-index: -1` places it **behind** the text
(itself at `z-index: 9`), and it's the section's `overflow: hidden` that
crops both overflows.

Numerical verification, viewport 1440×1200: section 719px tall →
`top: -15%` = −108px → media measured at **y = −42** (66 − 108) ✓ ; `right: -13%`
of 1440 = −187px → right edge at 1627, width 1400 → **x = 227** ✓.

Three things to remember: the intermediate wrapper measures **0 × 0** (a
dimensionless wrapper signals an out-of-flow child) · the percentages refer to
the **section**, whose height is set by the text, so the media follows the
text with no media query · the media is **not** in the grid — `.home-hero_layout`
is `55% 30%` (sum 85%, the rest left empty) and the media is a **sibling** of it.

Responsive: `top`/`right` are re-declared at each threshold, and `z-index`
**goes from −1 to 0** below 767px — the media stops acting as a background.

| Threshold | `top` | `right` | `z-index` |
|---|---|---|---|
| base | `-15%` | `-13%` | `-1` |
| ≤991 | `20%` | `0%` | `-1` |
| ≤767 | `40%` | `14%` | `0` |
| ≤479 | `29%` | `-22%` (+ `left: -44%`) | `0` |

### 3.2 Scroll reveal — with a safety net

```js
root.classList.add('is-revealed');
if (prefersReduced) finalize();
else {
  root.addEventListener('transitionend', finalize, { once: true });
  setTimeout(finalize, 800);   // safety net: transitionend may never fire
}
```

The `setTimeout(finalize, 800)` is **measured** (B l.3232). A sound instinct:
`transitionend` doesn't fire if the element is hidden, if the transition is
cancelled, or if a system preference suppresses it.

**Trap in the source, not to reproduce:** the 4 sections
`<section class="container is-home-vd" style="opacity:0">` carry their
initial state **as an inline `style` attribute**, and nothing in the
delivered HTML ever resets them to 1 — no CSS rule, no IX2, no page script.
If the external JS fails, four entire sections stay invisible forever. Here:
initial state moved into CSS, plus a `<noscript>` that neutralizes it.

### 3.3 Two-stage cascade on the media

Two animations, two delays, **300 ms apart** — and two different amplitudes:
the media starts from `scale(.965)`, the halo from `scale(.99)`. The halo is
a blurred background; if it moved by as much, the blur would smear.

`both` is essential: the element **keeps its final state**. Replaying the
animation on tab change requires a **forced reflow**:

```js
[...media, ...halo].forEach(el => { void el.offsetWidth; });  // measured, B l.3117
media.forEach(el => el.classList.add('is-media-entering'));
```

Removing then re-adding the class within the same frame replays nothing: the
browser batches the two mutations. Reading `offsetWidth` forces the recalc.

### 3.4 Blurred halo behind the media

```css
.pane__halo {
  position: absolute; inset: 0; z-index: 0;
  filter: blur(50px);
  background-image: linear-gradient(#52cbf2, #005ad0);
  border-radius: 1.5rem;
  max-height: 39.5rem;
}
```

A solid gradient, blurred at 50px, placed **behind** the media and slightly
larger: the light spills out past the visual. More economical than a colored
`box-shadow`, and the gradient gives a directional glow that a shadow can't
produce. The `max-height` prevents it from following a very tall media.

### 3.5 The tab card with conditional content

```css
.carte__desc, .carte__lien    { display: none; }
.carte.is-active .carte__desc { display: block; }
```

The description and the link exist **only** on the active card. The layout
jump is absorbed by a fixed `min-height` (`13.7rem` desktop / `6rem` ≤991px):
the row keeps its height, only the fill changes. That's what makes automatic
rotation tolerable.

**Two boxes, two radii.** The outer link carries `border-radius: 8px` and
`padding: 0` ; the inner wrapper carries `border-radius: 16px`, `padding: 16px`,
`gap: 12px` and `overflow: hidden`. The highlight box and the content box are
not the same one, and only the second one crops.

Card row: `display: flex` + `overflow: auto`. The
`grid-template-columns: 1fr 1fr 1fr` declared right next to it is **dead** —
`display: flex` wins. Below 767px the row switches to `flex-flow: column`.

**Reconstruction trap:** in column mode, a `flex: 1 1 0` set on the cards now
applies to the **height** (the main axis has rotated), squashes them to
`flex-basis: 0`, and `overflow: hidden` truncates the description. `flex: none`
must be re-applied at the threshold where the axis changes.

### 3.6 Automatic rotation that actually stops for good

Three measured rules: the timer only runs **while** the section is visible ·
the first interaction (`pointerdown`) sets a **permanent** flag — a user who
picked a tab doesn't get it snatched away · the delay depends on the panel's
**type** (4 s image, 23 s Lottie).

### 3.7 Infinite marquee

```css
.marquee        { width: 100vw; height: 5rem; overflow: hidden; }
.marquee__piste { display: flex; flex: none; animation: defilement 24s linear infinite; }
.marquee:hover .marquee__piste { animation-play-state: paused; }
@keyframes defilement { from { transform: translateX(0); } to { transform: translateX(-100%); } }
```

`-100%` = the width of **the track**, not of the container. Seamless loop as
long as the track is duplicated identically (the clone carries
`aria-hidden="true"`). `linear` is mandatory: any other curve produces a jolt
at every cycle. **The source has no `prefers-reduced-motion` guard on this
effect.** Fixed here.

### 3.8 Giant typography cut out with a gradient

```css
font-size: 186px;                /* 118 / 86 / 50 at the 3 thresholds */
background-image:
  linear-gradient(to bottom, #b5bcc8bf, #b5bcc8bf),
  radial-gradient(circle farthest-corner at 100% 100%,
    #fff 36%, #da7731 46%, #fff 54%, #85f9ff 64%, #3174da 73%, #fff 78%);
-webkit-background-clip: text; -webkit-text-fill-color: transparent;
```

**Two layers, and the first one does all the work.** The semi-opaque
gray-blue flat (`#b5bcc8bf`, alpha ≈ 75%) sits **on top of** the radial
rainbow and desaturates it. Without it the gradient would be garish; with it,
only a shimmer remains. The radial is anchored `at 100% 100%`.

Second technique in the same block: the two lines **overlap** through a
negative margin — `-90px` at 186px, roughly half the line-height, scaled down
proportionally at each threshold (`-60 / -40 / -20`).

### 3.9 The same mechanism, in gold, for the call to action

```css
.heading_medium.is-new-home-cta {
  font-size: 65px; line-height: 110%; max-width: 600px; text-align: center;
  background-image: radial-gradient(circle, #ffeec3, #efdcb7 51%, #938b87);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
```

Same cutout, two differences that make all the difference: the radial is
**simple** — no desaturation layer — and the palette is **warm** on an
otherwise entirely cool page. It's the only golden element. Isolating the
call to action by **temperature** rather than by size is directly
transposable. The `max-width: 600px` forces the heading onto two lines, with
no `<br>` in the markup.

### 3.10 Parallax: three rules to keep it tolerable

`{ passive: true }` on the scroll listener — otherwise the browser waits for
the handler before scrolling · throttling via `requestAnimationFrame` with a
`ticking` flag, at most one calculation per frame · **small and bounded**
amplitude (12% of the travel, 90px ceiling) to stay within the
`overflow: hidden` crop. A parallax you notice is a failed parallax.

### 3.11 Counter: the easing and the final value

Two points of method. The easing is an `easeOutCubic` — a linear counter
looks mechanical, a decelerating counter looks like it's "arriving". And the
final value is written **explicitly** at the end, never left to the luck of
the last tick: a counter that stops at 99 is a visible bug. Same requirement
as the `both` on the CSS keyframes.

### 3.12 Gradient border, without `border-image`

```css
.stateofdev-promo-section--border {
  background-image: linear-gradient(165deg, #ebf222 14%, #5dffff73 23%,
                                    #242424 36% 72%, #80f77759 79%, #5dffff 90%);
  background-clip: padding-box; border-radius: 24px; padding: 1px;
}
.stateofdev-promo-section--bg { background-color: var(--dark-mode-bg);
                                border-radius: 24px; padding: 60px; }
```

The parent carries the gradient, a `padding: 1px`, and a radius. The child is
**opaque and rounded too**: it covers everything except the 1px rim left by
the padding. **That rim IS the border.** No `border-image`, no
pseudo-element.

Two variants in the source, and the comparison is instructive: outside the
footer, a multicolor gradient whose **long dark stretches** (36%→72%) make
the ends look luminous like reflections; in the footer (our case),
`linear-gradient(#6cccff99, #6cccff99)` — a **flat** translucent blue. Same
mechanism, two intentions.

### 3.13 Gradient readability veil over an image

```css
._0630-slider_bg-overlay {
  background-image: linear-gradient(0deg, #000, #000000e0 22%, #0000);
  height: 102%; inset: -1% 0% 0%;
}
```

Solid black at the bottom, near-opaque up to 22%, then vanishing: the text
placed at the bottom stays legible **without darkening the whole image**.
The `height: 102%` and the `inset: -1% 0 0` avoid the anti-aliasing rim at
the edge — a detail you only notice when it's missing.

The image below carries `object-position: 50% 100%`: anchored to the bottom,
it keeps its subject visible when the box shortens.

**Reconstruction trap:** the background image is at `z-index: -1`, which
makes it slip **behind the section's background** if no local stacking
context exists. In the source, Webflow's `w-slide` incidentally creates one.
Without `isolation: isolate` on the slide, the image disappears entirely —
observed at render time, not deduced.

### 3.14 Carousel navigation: tabs, not dots

`._0630-slider_arrow { display: none }` hides the Webflow arrows. Navigation
goes through `._0630-slider_custom-slide-dot-wrapper`: a block **7.5rem
tall**, underlined by a 2px line at **opacity .4**, the active one taking the
accent color. Each entry's label is visible: you know where you're going
before clicking. A carousel with named landmarks is browsed, a dotted
carousel is endured.

### 3.15 Mega-menu: a 100vw panel detached from its trigger

```css
.nav_dropdown                        { position: static; padding: 1rem 0; }
.nav-dropdown_list-wrapper.w--open   { width: 100vw; max-width: 1440px; display: flex;
                                       justify-content: center; background-color: #0000; }
```

It's the parent's `position: static` that does everything: it prevents the
absolute panel from anchoring to the trigger, and lets it refer to the bar
instead. The panel then occupies the full width of the window regardless of
where you clicked. The transparent background is deliberate — it's a child
that carries the surface.

### 3.15 bis Section backgrounds, measured one by one

The page **alternates**; it isn't a uniform black, and this alternation is
what separates the blocks without needing a divider:

| Section | `background` actually declared |
|---|---|
| `.module-hero_section` | **none** — lets the `body` (#070707) show through |
| `.section.home-value-drivers` | **none** — same, on all four modules |
| `.new-home-center_section` | `#070707` **+** `linear-gradient(#070707, #050505 88%)` |
| `.testimonial-trusted_section` | the same pair |
| `.home-footer_cta-animation-group` | **none** |
| `.footer-section.footer_bg--color` | no background of its own, but an absolute child that **blurs** (§3.16) |

Two luminance points over 88% of the height, laid down **only twice** across
the whole page. Flattening everything to `#070707` removes the only
separation cue.

### 3.16 The footer doesn't lay a background: it blurs

```css
.footer_home-special-bg {
  position: absolute; inset: 0; z-index: -1;
  backdrop-filter: blur(20px); background-color: #0b0b0d9c;
}
```

Combined with the CTA image overflowing from above, this produces a glassy
join rather than a sharp cut. Worth knowing: on a solid black background the
effect is invisible — it only pays off when something passes underneath it.

### 3.17 White text obtained by background-clip trickery

`.home-loop_gradient { background-color: #fff; -webkit-background-clip: text;
-webkit-text-fill-color: transparent }` — a plain white obtained through the
clipped-gradient mechanism. No visual interest on its own: it's a slot left
in place so an animated gradient can be wired in later without touching the
markup. The probe confirms `color: rgb(0,173,228)` but
`-webkit-text-fill-color: rgba(0,0,0,0)`.

### 3.18 Offset anchor without `scroll-margin-top`

`.vd__ancre { margin-top: -100px; padding-top: 100px }` — negative margin
cancelled by an equal padding: the box doesn't move, but its **top edge**,
the one an `#id` anchor targets, moves up by 100px. Identical effect to
`scroll-margin-top`, with full compatibility.

---

## 4. Tokens, by role

### Surfaces
| Token | Value | Origin |
|---|---|---|
| `--surface-page` | `#070707` | `[relevé]` A, `--dark-mode-bg` — confirmed by probe |
| `--surface-nav` | `#000` | `[relevé]` A, `.nav_section` |
| `--surface-bottom-gradient` | `#050505` | `[relevé]` A |
| `--surface-active` | `#ffffff12` | `[relevé]` A, active card |
| `--surface-ghost` | `#ffffff0d` | `[relevé]` A, secondary button |
| `--surface-veil` | `#0b0b0d9c` | `[relevé]` A, footer's blurred veil |

The lower sections aren't a flat black:
`linear-gradient(#070707, #050505 88%)`. Two luminance points over 88% of the
height — just enough for the bottom to look deeper without it being obvious why.

### Text
| Token | Value | Origin |
|---|---|---|
| `--text-primary` | `#fff` | `[relevé]` A, `--gray--100` |
| `--text-secondary` | `#c8cad0` | `[relevé]` A, `--gray--80` — confirmed by probe |
| `--text-tertiary` | `#9195a1` | `[relevé]` A, `--gray--60` |
| `--text-link` | `#b0b1c3` | `[relevé]` A, `--gray--300`, color of `.body-small` |
| `--text-light` | `#e4e5e8` | `[relevé]` A, `--gray--90` |
| `--text-nav` | `#efeff1` | `[relevé]` A, `--white--94`, nav button |
| `--text-name` | `#d9dae5` | `[relevé]` A, `--gray--scale-200`, name below a testimonial |
| `--text-accent` | `#00ade4` | `[relevé]` A, `--primary-5` — confirmed (`rgb(0,173,228)`) |

### Action
| Token | Value | Origin |
|---|---|---|
| `--action-bg` | white | `[relevé]` A, `btn-cta_bg` = `--gray--100` in dark theme |
| `--action-text` | `#070707` | `[relevé]` A, `btn-cta_text` = `--dark-mode-bg` |
| `--border-nav` | `#303036` | `[relevé]` A, `--gray--20` |
| `--border-footer` | `#484851` | `[relevé]` A, `--gray--30` |

The page's main button is **solid white on black**; the navigation bar's
button is **light on a black bar** with dark text. The cyan accent is
**never** used on buttons, only on the `h1` and on the carousel's active tab.
That's what keeps it legible: it only appears once or twice per screen.

### Halo, gold, border
`--halo-top: #52cbf2` · `--halo-bottom: #005ad0` · `--gold-light: #ffeec3` ·
`--gold-mid: #efdcb7` · `--gold-dark: #938b87` · `--border-promo: #6cccff99` —
all `[relevé]` A.

---

## 5. Typography — two self-hosted families

The fonts do **not** come from Google Fonts. `WebFont.load()` only loads
`Geist Mono`, `Instrument Sans`, `Instrument Serif` and `Newsreader` — none of
which are used. Geist and Calsans are served by 39 `@font-face` rules
(source C) from the Webflow CDN, as `.woff2`, `font-display: swap`.

**Calsans only exists in SemiBold.** A single-weight family can only serve
headings, which the cascade confirms:

- `h1`, `h2` and `h3` declare `font-family: Calsans` at the base level;
- `.heading_large.is-new-home` — the class for section `h2`s — **overrides
  back to Geist**;
- the `h1` itself has no override: it **stays in Calsans**.

Result: **only two elements in Calsans** on the entire page — the `h1` and
the giant typographic block (a `<div>` inside an `h2` that `.is-new-home`
doesn't reach). Everything else is in Geist. A display font reserved for two
elements is a choice, not an oversight.

**`text-transform: capitalize` is set on `h1`, `h2` and `h3`** at the base
level and is never cancelled. All headings are capitalized by CSS, not in the
content. Reproduced as is: it's visible in the rendered page, and removing it
would change the silhouette of the page.

| Role | Desktop | ≤991 | ≤767 | ≤479 | Line-height | Weight |
|---|---|---|---|---|---|---|
| `h1` / `h2` | `4rem` | — | `2rem` | `2rem` + margin 1rem | `115%` | 600 |
| CTA heading | `65px` | `50px` | — | `40px` | `110%` | 600 |
| Giant block | `186px` | `118px` | `86px` | `50px` | `1.3` | 600 |
| Footer heading | `4rem` | — | `2rem` [arb.] | — | `1.3` | 600 |
| Slide `h3` | `40px` | — | `24px` | — | `120%` | 600 |
| Card title | `14px` | — | — | — | — | 600 |
| Quote | `20px` | — | — | — | — | 300 |
| Large body | `18px` | — | — | — | `150%` | 400 |
| Body | `16px` | — | — | — | `137%` | 400 |
| Small body | `14px` | — | — | — | — | 400 |
| Integrations paragraph | `24px` | — | — | — | `137%` | 300 |

Two observations: **`h1` and `h2` share the same class** — same size, same
weight; the hierarchy comes from position and centering, not from the type
size. And line-heights go down as the size goes up: `137%` at 16px, `115%` at
64px, `110%` at 65px for the CTA.

One last typographic technique: `.stateofdev_hero-tagline` carries
`letter-spacing: 9px` + `uppercase` at 36px — a huge letter-spacing that
turns a line of text into a **graphic rule**. The `.is-footer` variant brings
it back to `.75px`: the same element changes function depending on context.

---

## 6. Rhythm and grid

| Measure | Value | Origin |
|---|---|---|
| Section frame | `max-width: 1440px` | `[relevé]` A |
| Content container | `max-width: 1200px` | `[relevé]` A |
| Hero media container | `max-width: 1400px` | `[relevé]` B |
| Promo banner | `max-width: 1350px` | `[relevé]` A |
| Side margin | `2rem` | `[relevé]` A |
| Hero padding | `100px … 0` | `[relevé]` A (`.new-home_hero` overrides the base `60px 2rem`) |
| Bottom of hero grid | `100px` | `[relevé]` A (`.bmargin` overrides the base `60px`) |
| Module top padding | `150px` (→ `40px` ≤767) | `[relevé]` A |
| Lower sections padding | `100px 2rem` | `[relevé]` A |
| Testimonial header bottom | `64px` | `[relevé]` A |
| Carousel bottom | `96px` | `[relevé]` A |
| Heading group bottom | `2.5rem` (→ `1.5rem` ≤479) | `[relevé]` A |
| Tab row bottom | `40px` | `[relevé]` A |
| Card gap | `16px` / `8px` | `[relevé]` A |
| Marquee gap | `36px` | `[relevé]` A |
| Footer columns gap | `32px` / `64px` | `[relevé]` A |
| Subscription block gap | `80px` | `[relevé]` A |
| Promo banner padding | `60px` | `[relevé]` A |

**Three widths, not one.** 1440 for the frame, 1200 for the text, 1400 for
the media: this offset is what makes the page breathe.

Radii: `40px` (nav button) · `32px` (pill) · `1.5rem` (halo, banner) ·
`1.25rem` (carousel mask) · `16px` (card content) · `10px` (media, `6px`
≤991, `8px` ≤479) · `8px` (card highlight, banner background).

Responsive thresholds: **991 / 767 / 479** — Webflow's default breakpoints.

---

## 7. Coverage

The **seven sections** of the source are present, in order:

1. **Navigation bar** — 100×24 logo, 6 entries, two mega-menus at 100vw
   (one with a thumbnail column), search, two buttons one of which is light.
2. **Hero** — 55/30 grid, absolute overflowing media at `z-index:-1`, marquee.
3. **Four rotating-tab modules** — **6, 4, 3 and 2 tabs**, with their
   original icons and labels. The source HTML's lists additionally contain a
   **hidden template** inside a `<div class="hide">` (always the same
   "Continuous Delivery & GitOps"): counting it would give 6/5/4/3 and
   distort the density of each row. The decreasing 6→4→3→2 progression is a
   rhythm technique, not a content accident.
4. **Giant typographic block** — two overlapping lines, animated counter.
5. **Testimonial carousel** — 1.75fr/1fr header aligned at the bottom, 4
   slides with background image + gradient veil, navigation via 7.5rem
   underlined tabs.
6. **Call-to-action band** — 65px golden heading, faded footer-bottom image.
7. **Footer** — logo, 1fr/1fr subscription block, five columns of links,
   gradient-bordered promo banner, sub-footer.

What remains **not reproduced**, and why:

| Not reproduced | Reason |
|---|---|
| **16 Lottie animations** | Irreproducible without `lottie-web` (§1). Container, dimensions and cycle kept; content replaced by an image. The only case of this kind. |
| **Marketo form** | Third-party integration; replaced by an inert field. Worth noting: its script is loaded via `IntersectionObserver` with `rootMargin: '300px'` — a good technique, off-topic here. |
| **Coveo search** | Third-party integration; the icon is present, not the engine. |
| **Original text and brands** | Replaced with generic labels — that's the mandate of a design reference. |

All images are served as **remote URLs** on the original CDN, including the
fifteen module icons and the four slide visuals. No local file, no `assets/`
folder.

---

## 8. Arbitrations, and corrected mistakes

### Measurement mistakes found and corrected

Six values had been marked `[relevé]` while being wrong. The **type of
error** recurs, hence the list:

| What was written | What the source actually says | Cause |
|---|---|---|
| `.hero { padding: 60px 2rem }` | `100px … 0` | Base class read, modifier class `.new-home_hero` ignored |
| hero grid `margin-bottom: 60px` | `100px` | Same cause: `.bmargin` is the element's 2nd class |
| hero media "full width below the grid" | absolute, `inset:-15% -13% 0 auto`, `z-index:-1` | Deduced from the HTML structure without looking up the container's rule |
| `.vd__intro { max-width: 1000px }` | **no rule at all** | `max-width-1000` is in the HTML but only exists in the stylesheet in combination: the class is **dead** |
| `.heading_large` → `2rem` **at 991px** | at **767px** | Position of the rule in the file not checked |
| CTA gradient placed **above** the image | placed as the wrapper's `background`, hence **below** it | Effect assumed without checking the stacking order |
| `.footer { padding: 100px 2rem }` | `1.5rem` top and bottom (`40px` at ≤991) | **Third time, same cause**: `.footer-section` read, `.footer_bg--color` — which overrides the padding, sets `backdrop-filter:none` and changes the text color — ignored |
| 4 modules with **6/5/4/3** tabs | **6/4/3/2** | The hidden template inside `<div class="hide">` counted as a visible tab |

**The pattern repeats three times: reading the base class and ignoring the
modifier class carried by the same element.** On generated CSS, an element
commonly carries three or four classes; the one declared last wins. The
instinct to build: list ALL of the element's classes in the HTML before
looking up the rule, and grep every combination.

Two techniques had been **missed** and were then added: the golden gradient
CTA heading (§3.9) and the self-hosted fonts with Calsans reserved for the
`h1` (§5). And several values marked `[arbitrage]` were actually in the
source (`padding: 16px` and `border-radius: 16px` of the card, `gap: .75rem`,
`padding-top: 2rem`): reclassified as `[relevé]`.

### Two bugs found at render time, not deduced

- **Invisible slide image.** The measured `z-index: -1` makes the image slip
  behind the section's background for lack of a local stacking context — the
  source incidentally gets one via `w-slide`. Fixed with `isolation: isolate`
  (§3.13).
- **No active card at load** under `prefers-reduced-motion`: rotation
  doesn't start, and card 1's description stayed invisible. Fixed by setting
  `is-active` in the markup.

### Assumed arbitrations

- **`filter: brightness(.45)` on the hero media.** The source places a
  **dark video** there that passes under the text without hindering it; the
  replacement image is light, and without darkening, the text becomes
  illegible. A substitution compensation, not a technique.
- **CTA gradient placed on top of the image** (§8, table) — measured value,
  arbitrated position, without which it would have no effect on an opaque
  image.
- **Marquee with text labels** instead of logo SVGs — same box constraints
  (`height: 40px`, `opacity: .8`), no third-party brand in a design
  reference.
- **`prefers-reduced-motion` extended** to the marquee, automatic rotations,
  the counter and the parallax; the source only covers the reveal and the
  two entries, and leaves its timers running.
- **`<noscript>`** neutralizing the hidden state — absent from the source.
- **`flex: none` on cards at ≤767** — see §3.5.
- **`rootMargin: -12%`** on the generic reveal, **threshold 0.6** on the
  counter, **7000 ms** on the carousel, **12% / 90px** on the parallax.
- **Visible focus `outline`** — the source has none on these components.
- **Background, shadow and border of the mega-menu panel**: the source sets
  a transparent background and lets a child carry the surface; simplified
  here.

### Conflict in the source, arbitrated

The card's active state is declared **twice**: `rgba(255,255,255,0.06)` in
the inline block (B l.84) and `#ffffff12` (≈ 7%) in the Webflow CSS (A). The
second one wins on specificity; that's the one kept.

### Two APIs deliberately set aside

- `animation-timeline: view()` / `scroll()` — not *widely available* (Firefox
  only since v155). A keyframe starting at `opacity:0` would leave the
  elements invisible for good wherever it isn't supported.
  `IntersectionObserver` (*widely available* since March 2019) does the same
  job.
- View Transitions — *newly available* (Oct. 2025), not *widely*.

---

## 9. Render verification

Headless Chrome render, screenshots reviewed, compared against the **source
rendered with its own CSS** (procedure from §0):

- **1440×900 and full-page 1440** — the seven sections in order, hero media
  anchored right and overflowing, four tab modules, carousel with image and
  veil, complete footer with gradient-bordered banner. No horizontal
  overflow.
- **real 390×844**, via a 390px iframe: headless Chrome **caps the window at
  500px wide**. A `--window-size=390` produces a misleading crop of a page
  laid out at 500px — the `≤479` media queries don't apply and you believe
  you see an overflow that doesn't exist.
- **`--force-prefers-reduced-motion`** — the pass that revealed the inactive
  card.

Checked visually: nothing invisible · no horizontal overflow at either size ·
every animation ends in a visible state (`both` on the keyframes, persistent
`.is-revealed`, 800 ms safety net, `<noscript>`, final counter value written
explicitly) · the active card's descriptions are fully legible at both sizes.

---

## 10. Offline autonomy — Lottie removed, six SVG scenes instead

### 10.1 What the source does

The source hands **six of the fifteen** tab media over to **Lottie-web
5.12.2**. The mechanism there runs in two tiers:

| Tier | Origin | File |
|---|---|---|
| The library | `cdnjs.cloudflare.com` | `lottie-web/5.12.2/lottie.min.js` |
| The data | `cdn.prod.website-files.com` | `CD_test.json`, `CI_LP hero animation.json`, `AI test automation_final_resized.json`, `FME.json`, `SAST.json`, `CCM_final_resized.json` |

The other nine tab media are images (`.png`, `.avif`, `.webp`).

### 10.2 Why it's removed, and why the images aren't

The corpus's rule is simple: **no local binaries, media by remote URL.** A
remote image respects that and, above all, it **fails gracefully** — the
`alt` attribute remains, the `.pane__cadre` frame keeps its height, the panel
still tells you something.

Lottie doesn't behave that way. It's not a media, it's a **library**:
without it, `window.lottie` is undefined, no instance is ever created, and
**six panels out of fifteen become empty boxes**. The `min-height: 22rem`
safety net set on `.pane__media` prevented the layout from collapsing, but
an empty 22rem frame is still an empty frame. And even with the library
loaded, six JSON requests would still need to succeed.

Hence the arbitration: **the remote images stay, Lottie goes.** The dividing
line isn't "local versus remote", it's **"what degrades gracefully versus
what leaves a hole"**.

### 10.3 What was put in its place

Six **inline SVGs animated with CSS**, one per panel, written into
`index.html` and styled in `styles.css` §14. No file added to the
deliverable, no binary, no `assets/`. Each scene reuses the visual register
of its nine neighbors — they are dark product screenshots — hence:
background `#0b0e14`, panel `#121722`, three-dot chrome, `#ffffff14` rule,
accent `#00ade4`, green `#4ec26a`.

| # | Panel | Subject of the replaced `.json` | Technique |
|---|---|---|---|
| 1 | `p1-1` Continuous Delivery & GitOps | `CD_test.json` | 5-step pipeline rail. The rail **traces itself** (`stroke-dashoffset`, `pathLength="1"`), then each step **blooms** green (`scale` + `opacity`, 260ms offset); below, five log lines climb one by one. |
| 2 | `p1-2` Continuous Integration | `CI_LP hero animation.json` | Four build targets in parallel: the bars **grow** (`scaleX`, `transform-origin: left`) at staggered speeds, then the Harness CI / Legacy CI comparison at the bottom makes visible the duration gap claimed by the tab. |
| 3 | `p2-1` AI Test Automation | `AI test automation_final_resized.json` | e2e test suite. A **sweep** moves down the list, and the 4th line **heals itself**: two stacked groups in a cross-fade, the "selector not found" state (red) gives way to the healed state (green + "AI healed" badge). It's the only narrative technique among the six. |
| 4 | `p2-3` Feature Management & Experimentation | `FME.json` | A toggle whose **knob slides** into the active position, an exposure bar that **grows** up to 50%, then two variants whose conversion bars grow in a staggered way. |
| 5 | `p3-1` Application Security Testing | `SAST.json` | Code panel (lines as rectangles, two highlighted in red) swept top to bottom by a **vertical gradient sweep**; on the right, four results **climb up** one by one, ranked by severity. |
| 6 | `p4-1` Cloud & AI Cost Management | `CCM_final_resized.json` | A spend curve that **traces itself**, diverging from a dashed forecast; the savings area then appears in a fade, and three quantified recommendations climb up on the right. |

### 10.4 The authoring rule that makes it all safe

**Each scene's resting state is its final state.** The `@keyframes` start
from an altered state (`opacity: 0`, `scaleX(0)`, `stroke-dashoffset: 1`) and
**return to the natural value** of the property.

Direct consequence: cutting the animations — reduced motion, inactive panel,
partially applied CSS — leaves the scene **complete**, never frozen
mid-course. That's why the `prefers-reduced-motion` block in §14.4 gets away
with a plain `animation: none`: it has no final state to restore by hand.
Same discipline as the `both` on the existing keyframes (§9), applied to an
entire piece of content rather than to a single transition.

Only two elements have **invisibility** as their resting state: the SAST
panel's sweep and the "before healing" line of the e2e suite. These are
**gestures**, not content — making them disappear removes no information
from the scene.

### 10.5 Lottie's loop, replaced by a selector

The scenes only animate under `.pane.is-active`. Since `motion.js` already
sets and removes this class on every tab switch, **switching panels replays
the scene**, and returning to it replays it again.

What this removes, outright: no more instance to create, no more `play()` /
`pause()`, no more question — settled in §3.6 — of destroying or pausing the
animations of inactive tabs. The source destroyed inactive instances (B
l.2956-2975); this recode used to pause them to avoid an emptied panel never
recreating itself. The problem no longer exists: there's no instance left.

### 10.6 The dwell, recalculated

The source does **not** have a single delay: it picks based on the active
panel's **type** — `IMAGE_DWELL_MS 4000` versus `LOTTIE_DWELL_MS 23000` (B
l.2925-2926). The 23 seconds were only there to let a Lottie loop play out
in full.

Without Lottie, that case no longer exists, **and neither does the
distinction**: the fifteen panels are now all of the same nature — a still
image or an SVG scene. Hence a single value, `DWELL_MS = 6000`.

**6000 and not 4000**: the longest scene entry finishes at ~3.1s (§14.3,
SAST sweep: 0.3s delay + 2.8s duration). At 4000ms there would be 0.9s of
viewing time left before the switch — you'd see the scene assemble and then
vanish, which is worse than no animation at all. 6000 leaves ~2.9s of still,
legible panel, while staying well clear of the original 23s.

The rotation factory's `dwell` parameter therefore goes back to being a
**number**. The `typeof dwell === 'function'` branch, which only existed to
arbitrate between the two constants, is removed: nothing called it anymore.

### 10.7 The two JS files — why they stay two

Merging `motion-nav.js` into `motion.js` was tried and then **abandoned**.
The merged file comes to **264 lines**, beyond the per-file ceiling applied
on this workstation (blocked at ~190-200). Fitting within it would have
required removing **~65 lines of comments** — nearly the entire `[relevé]` /
`[arbitrage]` layer of a file the owner has already approved.

The motive for the merge was aligning with a "four files" format. But this
format **isn't the corpus's own**; measured across the ten folders:

| Folder | JS files | Largest `motion.js` |
|---|---|---|
| `cursor-recode` | **3** (`motion.js`, `motion-nav.js`, `motion-scroll.js`) | 95 l. |
| `reve-recode` | **2** (`motion.js`, `motion-bande.js`) | 157 l. |
| `harness-recode` | **2** | 195 l. |
| the other 7 | 1 | `fora-recode`: **482 l.** |

Two pages out of ten already ship more than one behavior file, and
`fora-recode` ships one of 482 lines. Neither the number of files nor their
size is therefore a corpus rule. This page has exactly the shape of
`reve-recode`.

**Arbitration kept:** keeping two files and the full set of annotations,
rather than one file and an amputated documentation. The split remains what
it always was — a ceiling constraint, noted as such at the top of
`motion-nav.js` — and not an architectural choice.

**Accepted cost:** the two files each declare their own `matchMedia`, their
own `reduced` flag and their own subscriber list. Two `change` listeners for
a single system preference, hence two possible states instead of one. In
practice both read the same media query and update on the same event: they
cannot diverge. It's a redundancy, not a bug — but it's the price of the
split, and it's written down here rather than left unsaid.

### 10.8 The Google Fonts stylesheet, removed

`<link rel="stylesheet" href="https://fonts.googleapis.com/…Newsreader…">` is
removed, along with the two `preconnect` tags that served it. A remote
stylesheet is not a media asset: it **blocks rendering** until it has
failed. Its only use was `--police-serif`, two rules for the footer's light
thumbnail, which fall back to **Georgia** — already declared second in the
token, so with no effect beyond a serif variation on a secondary element.

The `@font-face` rules for **Calsans and Geist stay remote** (`.woff2` on the
source's CDN). These are **media assets**, on the same footing as the page's
images; they degrade on their own to Verdana, declared second. Removing them
would have changed the typography of the entire page — out of scope, which
is to remove the *blocking* dependency, not to redesign the render.

### 10.9 State of network dependencies, afterward

| Kind | Remains? |
|---|---|
| `<script src="http…">` | **None** — `motion.js` is the only script, local. |
| `<link rel="stylesheet" href="http…">` | **None** — `styles.css` is the only stylesheet, local. |
| Remote `@font-face` | Yes — Calsans, Geist (media assets, Verdana fallback). |
| Images, video, `poster` | Yes — corpus rule, graceful fallback. |

None of these remaining dependencies is **executable**, and none leaves a
functional hole when it fails.
