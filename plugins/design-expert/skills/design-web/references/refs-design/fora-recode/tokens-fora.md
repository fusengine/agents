# fora.so — tokens and techniques

Design reference drawn from the Framer export of `fora.so`.

Four files: `index.html` · `styles.css` · `motion.js` · this document.
The JS is loaded via `<script src="motion.js" defer>`; it sets `.js` on
`<html>` as its very first instruction, which conditions all the starting states
of the CSS — without it the page stays complete and readable, simply frozen.

Two markers, used throughout, including in `styles.css` and `motion.js`:

- **[relevé]** — value read verbatim from the source. The provenance is indicated.
- **[arbitrage]** — a choice made by this reconstruction, because the source doesn't give
  the value or drives it in JavaScript.

> **All animations are [arbitrage].** The source contains **no
> `@keyframes`** at all and **no `animation-timeline`**. Motion there is entirely
> produced by the Framer Motion runtime (`motion.*`) plus Lenis 1.3.19 for scrolling.
> Only the **parameters** (starting state, duration, curve, delay) can be measured:
> Framer serializes them in a `<script id="__framer__appearAnimationsContent">`.
> That's where all the numeric values below come from.

---

## 0. What is carried over verbatim, and why

**Headings, subheadings, navigation and button labels, tags,
figures, and short mentions are carried over as-is from the source.** These are
not editorial content, they are **layout elements**: the exact
length of "Your community deserves its own home." dictates its two line
breaks, hence the heading block's height, hence the position of everything that follows.
A paraphrased heading collapses the composition even when the measured
typography is pixel-perfect.

Only **long paragraphs** are abridged, and at equal visual length —
same number of lines when rendered, otherwise the vertical rhythm documented here is wrong.

## 0 bis. The declared backgrounds, block by block

Counter-trap to flattening: the page doesn't have *one* background. Here are all the
`background` values actually declared in the source, with their block.

| Block | Value | Role |
|---|---|---|
| `.framer-1ed9fxm` | `radial-gradient(200% 83% at 50% 0,#1b2228 0%,#353f44 42%,#d39794 100%)` | the hero |
| `.framer-aofqy9` | `linear-gradient(180deg, …#000 0%, …#1b2228 100%)` | the CTA |
| `.framer-95w5xq` · `.framer-15kwehq` · `.framer-1t24cya` · `.framer-kj696b` | `var(--token-ef8ecd6d-…,#000912)` → **#000** | sections and footer |
| `.framer-t90imi` | `#ffffff0d` | the mockup panel |
| `.framer-9kb1aq` | `var(--token-47679c26-…,#fff0)` → transparent | the mockup rail |
| `.framer-tde7sf` | `var(--token-9a0a5818-…,#171717d9)` | inner card |
| `.framer-70az75` | `var(--token-aecd04de-…,#ffffff1a)` | 1px separator |
| `.framer-1hivre4` | `var(--token-090acfc6-…,#fae6e1)` at `opacity:.75` | 1px glowing rule |
| `.framer-16ztk4h` · `.framer-7yghsn` | `#fff` | ghost logo, avatar |

Only two gradients, and they carry the page's two strongest moments: its
opening and its closing. Everything else is black plus alpha surfaces.
Painting the intermediate sections with an "almost black" color instead
of pure black is enough to lose that contrast.

## 1. The trap in the source: `opacity:0` is not design

243 occurrences of `opacity:0` / `opacity:0.001` in the HTML, plus 10
`data-framer-appear-id` attributes. **These are PRE-animation states**, not rendered
values. Copying them delivers a page half of which is invisible.

Two families to distinguish:

| Marker in the source | Meaning | Real trigger |
|---|---|---|
| `data-framer-appear-id` + `opacity:0.001` | appearance **on load** | `DOMContentLoaded` |
| `opacity:0` + `will-change:transform`, no appear-id | appearance **on scroll** | entering the viewport |

`0.001` rather than `0`: Framer keeps the element composited (a layer at `opacity:0`
can be dropped from the compositor, which causes a jump on the first frame).
In this reconstruction we use a flat `0` and let the compositor handle it —
the nuance only matters for a JS animation engine.

**Method consequence**: never leave a starting state without a guaranteed exit. `styles.css`
unconditionally reveals under `prefers-reduced-motion`, and
`index.html` carries a safety net that reveals, 300 ms after `load`, everything
that has already entered the field but wasn't notified by the observer.

---

## 2. Colors

The source stores them in opaque variables (`--token-<uuid>`) set on `<body>`.
They are renamed **by role** here. Each value is [relevé].

| Role | Value | Source token |
|---|---|---|
| `--surface-fond` | `#000` | `--token-ef8ecd6d` |
| `--surface-fond-profond` | `#000912` | same token, *design-time* value of the fallback |
| `--surface-carte` | `rgba(0,0,0,.85)` | `--token-259d8c78` |
| `--surface-carte-haute` | `rgba(15,15,15,.85)` | `--token-9a0a5818` |
| `--surface-encart` | `rgba(23,23,23,.85)` | `--token-feab5ab7` |
| `--surface-degrade-fin` | `#1b2228` | `--token-d22f0868` |
| `--filet` | `rgba(255,255,255,.10)` | `--token-aecd04de` (156 occurrences) |
| `--filet-fort` | `rgba(255,255,255,.25)` | `--token-e3ce13ec` |
| `--voile` | `rgba(255,255,255,.05)` | literal, 22 occurrences |
| `--texte-primaire` | `#fff3f0` | `--token-090acfc6` (153 occurrences) |
| `--texte-secondaire` | `rgba(255,255,255,.80)` | `--token-792af9ed` |
| `--texte-tertiaire` | `rgba(255,255,255,.65)` | `--token-c6de8ea4` |
| `--texte-titre-hero` | `#ebd5be` | preset `7hjh4k` only |
| `--accent-lien` | `#0099ff` | literal, 70 occurrences |

### The technique, not the list

**One background, five alpha surfaces.** The site never paints an opaque gray. The
entire depth hierarchy is made of blacks at variable opacity (`.85`) and very
faint whites (`.05` / `.10` / `.25`) laid over that same black. Useful consequence:
a card remains correct regardless of what it sits over — image, gradient, another card.

**The text is not white.** It's cream (`#fff3f0`). The lower levels, meanwhile,
are **pure alpha white** (`.80` / `.65`), not darkened cream. The page therefore has a
warm heading and a neutral body — it's this temperature contrast that sets the tone.

**Only one warm color.** `#ebd5be` on the single `<h1>` alone. The `#0099ff` accent is only
used for links within running text, never for buttons.

---

## 3. Typography

Families [relevé]: `Inter` throughout, `Inter Display` for `h3`s only.
`Inter Display` isn't distributed by Google Fonts — **[arbitrage]**: we fall back
to `Inter`. Actual deviation: Display has tighter counterforms at large sizes.
If fidelity matters, it needs to be served via `@font-face` from a local file.

The source sets the typography in `--framer-font-size` / `-weight` /
`-line-height` / `-letter-spacing` variables carried by `.framer-styles-preset-XXXXXX`
classes. **Each preset has exactly three blocks** — this is the site's breakpoint grid:

- base: `≥ 1200px`
- `@media (max-width:1199px) and (min-width:810px)`
- `@media (max-width:809px) and (min-width:0px)`

| Role | Preset | Size (≥1200 / 810-1199 / <810) | Weight | Tracking | Line-height |
|---|---|---|---|---|---|
| `h1` | `7hjh4k` | 56 / 40 / 36 | 400 | −.04em | 1.3 |
| `h2` | `fahce0` | 40 / 36 / 32 | 500 | −.04em | 1.35 |
| `h3` | `u3ga62` | 36 / 32 / 28 | 400 | −.03em | 1.35 |
| `h4` | `14zqc8e` | 28 / 24 / 22 | 400 | −.03em | 1.35 |
| `h6` | `b70r5p` | 22 / 20 / 18 | 400 | −.02em | 1.5 |
| body | `prenqk` | 16 | 400 | −.01em | 1.5 |
| ui | `1fhxhj6` | 14 | 400 | −.02em | 1.5 |
| micro | `10qv886` | 12 | 400 | −.02em | 1.5 |

### The technique

**Tracking follows size, not role**: −.04em at large headings, −.01em at body copy.
A loosened heading or an overly tight body immediately breaks the resemblance.

**Line-height switches to 1.5 as soon as you leave the headline register** (h6 included). There is no
intermediate value: 1.3 for h1, 1.35 for h2-h4, 1.5 for everything else.

**The weights are low.** 400 throughout except `h2` at 500. No 600/700 anywhere in the
headings — emphasis comes from size, never from weight.

**`text-wrap: balance` on `h2` alone** [relevé]: it's the only level where the source
requests line balancing.

---

## 4. Structure and rhythm

| Token | Value | Source |
|---|---|---|
| page width | `1600px` | `max-width` of each `<section>` |
| hero width | `1920px` | the sole exception |
| content width | `1080px` / `720px` under 1200px | `.framer-1i5w2fk`, `.framer-142wp5r` |
| nav width | `1440px` | `.framer-wz7sin{gap:10px;width:1440px}` |
| edge margin | `24px` | `padding: 0 24px` on each section |
| section stack | `160px` / `120px` / `140px` | `padding:160px 0 0`, `padding:180px 0 0` (CTA) |
| gaps | `80 · 64 · 48 · 36 · 24 · 16 · 12 · 10 · 6` | all grep-able: `gap:80px` … `gap:6px` |

### Radii — no generic "pill"

The site has no single fallback value. **Each component carries its own**,
and it must be copied as-is. All verifiable via `grep`:

| Component | Radius | Literal form in the source |
|---|---|---|
| card / FAQ block / app window | `24px` (inner `23px`) | `border-radius:24px 24px 24px 24px` |
| secondary card | `16px` (inner `15px`) | `border-radius:16px 16px 16px 16px` |
| app rail and panel | `18px` | `border-radius:18px` |
| hero gallery | `72px` (inner `71px`) | `border-radius:72px 72px 72px 72px` |
| "L Primary" button | `768px` | `border-bottom-left-radius:768px` |
| chip | `215px` | `border-top-left-radius:215px` |
| "Check Light" checkmark | `880px` | `border-bottom-left-radius:880px` |
| avatar | `100px` | `border-radius:100px` |
| rail's ghost logo | `6px` | `border-radius:6px` |

It's a Framer quirk (the "radius" cursor there runs very high), but reproducing it is
the difference between a page that *resembles* and a page that *is* the same.

### Technique: the hero gradient is written out in plain values

The single most structural reading on the page, and the one most often missed when looking at
screenshots. The hero doesn't have a dark background with a photo: it has a **huge
radial gradient** set at `inset:0`, on which two images of hills anchor
**at the bottom**.

```css
/* [relevé] .framer-1ed9fxm — the "bg gradient" layer */
background: radial-gradient(200% 83% at 50% 0,
            #1b2228 0%, #353f44 42%, #d39794 100%);
```

Three things make it reusable:

1. **200% width for 83% height, anchored at `50% 0`.** The gradient's
   center sits above the frame and overflows widely on each side: you only
   see a slice of the bottom of the ellipse, hence nearly horizontal bands
   rather than a circular halo.
2. **Three stops, one of them at 42%.** The slate → light slate turning point
   is well above the middle; the entire bottom half is devoted
   to the transition toward the flesh-tone color.
3. **The three colors are page tokens** (`--token-d22f0868`,
   `--token-6a452ef3`, `--token-dedd8b7f`), not one-off values.

The images, for their part, are not section backgrounds:

| | class | ratio | anchoring |
|---|---|---|---|
| distant hills | `.framer-u991jm` | `2.71067` | `bottom:0; left:0; right:0` |
| near hills | `.framer-f7ktf5` | `2.90566` | `bottom:1px; left:0; right:0` |

The `bottom:1px` on the near layer isn't a coincidence: it prevents the two
bottom edges from overlapping pixel-for-pixel and creating a seam.

### Signature technique: the two vertical rules

Every `<section>` carries `border-left: 1px` **and** `border-right: 1px` in
`rgba(255,255,255,.10)`, with `max-width: 1600px` and `margin-inline: auto`.
Stacked, they draw **two continuous rails** running the full height of the
document and materializing the column. It's the page's only piece of "chrome."

Worth reproducing: the rule is on the **section**, not on a single wrapper. That's what
lets a section change its background (the CTA switches to a gradient) without interrupting
the rails.

Note: the 140px mobile padding is **greater** than the tablet tier's (120px).
This isn't a measurement error — the source really does this, to compensate for the disappearance
of the side columns.

### Technique: the card with an inlaid rule

The source **never** puts `border: 1px` on a card. It stacks three layers:

```
┌ outer box — border-radius:24px, overflow:hidden, background: THE RULE
│  ┌ [data-glow] layer — inset:0, opacity:0, pointer-events:none
│  ┌ inner box         — inset:1px, border-radius:23px, background: THE CARD
```

The 1px "rule" is what shows past the outer box. **The inner radius is
always the outer radius minus 1** (24→23, 16→15, 72→71) — otherwise the seam thickens
at the corners.

What `border` wouldn't allow, and what justifies the technique: the outer box can
receive a **gradient**, hence a gradient rule, and the `[data-glow]` layer can
be painted independently (a halo that follows the cursor). In the source this layer
ships empty, `opacity:0`, and is filled in via JS.

### Technique: the status chip

`.framer-1uiucns{height:30px;gap:12px;overflow:hidden}` plus, in inline style,
`--1x5nw16:4px 12px 4px 12px` (hero) or `--1x5nw16:4px 16px 4px 16px` (pricing) and
`border-top-left-radius:215px`. In first position, a **7px dot** in
`aspect-ratio:1` (`.framer-10cfw4u{aspect-ratio:1;width:7px}`).

The 12px gap for a 7px dot is deliberately generous: it's what keeps
the chip from reading as a list bullet. The `overflow:hidden` on the chip isn't
decorative — it exists to crop an animated fill on hover.

### Technique: the primary button is not cream

Reading trap. The page's text is cream (`#fff3f0`), but the primary button isn't
cream. Measured in the inline style of the three `<a data-framer-name="L Primary">`:

- background: `--token-792af9ed` = `rgba(255,255,255,.8)` — **white at 80 %, not a flat fill**
- rule: `--token-090acfc6` = `#fff3f0`, at 1px
- text: `--token-ef8ecd6d` = `rgb(1,16,29)`
- radius: `768px`

The translucent background matters: laid over the hero, the button lets the image show through and
takes on its temperature. An opaque `#fff` breaks that effect and looks off.

Dimensions: `.framer-efr9v5{cursor:pointer;height:48px;padding:0 36px;gap:0}`.

---

## 5. Motion

### The two curves

| Token | Value | Status |
|---|---|---|
| `--e-signature` | `cubic-bezier(.44,0,.56,1)` | **[relevé]** |
| `--e-sortie` | `cubic-bezier(.16,1,.3,1)` | **[arbitrage]** |

`cubic-bezier(.44,0,.56,1)` is **the** curve of the site. It's found in two
independent places: in the link preset (`transition: color .4s cubic-bezier(.44,0,.56,1)`)
and as the `ease` of the nav's appearance tween. It is **symmetric** — acceleration
and deceleration of equal weight, no bounce.

`--e-sortie` is a **documented [arbitrage]**. Framer serializes 18 transitions
`{"type":"spring","bounce":0,"duration":1}`. A spring with zero bounce is *critically
damped*: it never overshoots its target, it decelerates until it reaches it. Its
CSS equivalent doesn't exist as a primitive; `cubic-bezier(.16,1,.3,1)` is the
usual approximation. Perceptible gap: the spring has a longer tail, the bezier arrives more sharply.

### The durations and delays measured

| Token | Value | Source |
|---|---|---|
| `--d-lien` | `.4s` | link preset |
| `--d-apparition` | `1s` | `"duration":1`, 18 occurrences |
| `--d-courte` | `.5s` | `"duration":0.5`, hero's gradient scrim |
| cascade | `0 · .1s · .2s · .3s` | `"delay"` of the hero's four blocks |
| amplitude | `24px` | `translateY(24px)`, the site's default value |

### Table of reimplemented animations

All are **[arbitrage]** as to *means*; the *values* are [relevé].

| Effect | Trigger | Property | Start → end | Duration | Curve | Cascade |
|---|---|---|---|---|---|---|
| Scroll inertia | wheel | scroll position | target ← real, LERP .1 | continuous | — | — |
| Nav scrim | scroll > 24px | `opacity` | `0` → `1` | .4s | `--e-signature` | — |
| Intro text | scroll progress | `opacity` | `.25` → `1` | .7s | `--e-signature` | 1 paragraph at a time |
| Active tab | click / keyboard | `opacity` (card + rule) | `0` → `1` | .4s | `--e-signature` | — |
| Gallery caption | tab change | `opacity` | `1` → `0` → `1` | .35s ×2 | `--e-signature` | mid-course swap |
| Nav | load | `opacity`, `translateY` | `0, −36px` → `1, 0` | 1s | `--e-signature` | — |
| Hero scrim | load | `opacity` | `0` → `1` | .5s | `--e-sortie` | — |
| Far background | load | `opacity`, `translateY` | `0, +72px` → `1, 0` | 1s | `--e-sortie` | — |
| Near background | load | `translateY` | `+48px` → `0` (opacity unchanged) | 1s | `--e-sortie` | — |
| Chip / h1 / p / button | load | `opacity`, `translateY` | `0, +24px` → `1, 0` | 1s | `--e-sortie` | 0 / .1 / .2 / .3s |
| Section blocks | entering the field | `opacity`, `translateY` | `0, +24px` → `1, 0` | 1s | `--e-sortie` | 0 / .1 / .2s |
| Chat bubbles | entering the frame | `opacity`, `translateY` | `0, +12px` → `1, 0` | .6s | `--e-sortie` | `.12s × i` |
| Gallery (fade) | scroll progress | `opacity`, `scale` | `0, 1.06` → `1, 1` | .8s / 1.4s | `--e-signature` | — |
| Price (roll) | entering the field | `translateY` per column | `0` → `−d × 1.35em` | .7s | `--e-sortie` | `.06s × column` |
| Monthly/Yearly toggle | click | cursor `translateX` | position A → B | .55s | `--e-sortie` | — |
| FAQ accordion | click | `grid-template-rows` | `0fr` → `1fr` | .5s | `--e-signature` | — |
| Card glow | hover | `opacity` + radial position | `0` → `.6` | .4s | `--e-signature` | — |
| Hero shader | continuous | `translate3d`, `scale` | 18s loop | 18s | `linear` | — |
| Chip dot | continuous | `opacity` | `1` → `.35` → `1` | 2.4s | `--e-signature` | — |

### Technical choices and what they rule out

**`IntersectionObserver`, not `animation-timeline: view()`.** `view()` is "limited
availability," outside Baseline. A keyframe that starts at `opacity:0` leaves
the elements **permanently invisible** wherever it isn't supported — the worst possible
failure mode for a page where half the blocks start at zero.

**`threshold: 0`, not `0.12`.** A *ratio* threshold never triggers on a node of
zero or near-zero height — typically a `<span>` that only wraps a button. The
"clearly entered" check is left to `rootMargin`, which is absolute.

**`unobserve` after the first entry.** Replaying the appearance on scroll-back is
noise: the reader has already seen the block.

**Scroll inertia is reproduced, with three safeguards.** The source loads Lenis
1.3.19 (`<link href=".../lenis@1.3.19/dist/lenis.css">`). `motion.js` reimplements it in about
twenty lines: the wheel no longer scrolls the document directly, it feeds a TARGET
position toward which the real position glides on each frame, with `LERP = 0.1` —
Lenis's default value.

A badly implemented inertia is worse than no inertia at all, hence the three safeguards:

1. **cut under `prefers-reduced-motion`** — hijacking native scroll is exactly
   what this setting asks to avoid;
2. **cut on a coarse pointer** (`(hover: hover) and (pointer: fine)`): touch already
   has its own inertia, supplied by the OS and much better calibrated;
3. **keyboard, anchors, and the scrollbar are not intercepted** — a
   `scroll` listener resyncs the target as soon as a scroll doesn't come from the
   wheel, otherwise the page "snaps back" after a Page Down.

Only `wheel` is captured, and `e.ctrlKey` is let through: that's the browser's zoom.

**`prefers-reduced-motion` neutralizes the starting states, it doesn't slow them down.**
Setting durations to zero on an element at `opacity:0` would leave it invisible. The rule
therefore forces `opacity:1` and `transform:none` in addition to cutting durations.

---

## 5 bis. The text that lights up (the "Intro" section)

The page's most reusable technique — and a reading trap that runs
exactly opposite to the previous one.

Measured:

- three `<h4>`s at preset `14zqc8e`, each carrying `style="opacity:0.25"`;
- the component containing them is called **`Idle`** (`data-framer-name="Idle"`);
- they live inside `.framer-yn2rmj{…gap:36px;width:560px…}`;
- on top of them, `.framer-s35umq{-webkit-user-select:none;user-select:none;
  height:100%;…pointer-events:none;z-index:1;…position:absolute;top:0;left:0}`
  contains **four empty divs**: `#intro-1`, `#intro-2`, `#intro-3`, `#intro4`.

> **This `opacity:0.25` is a REST state, not a pre-animation state.**
> It's the OPPOSITE trap of the 243 `opacity:0`s in § 1. "Fixing" it to 1 doesn't
> repair anything: it removes the effect. The only way to tell the difference is
> to look at the variant's name — `Idle` denotes a rest state, an appear-id
> denotes an entrance.

Four triggers for three paragraphs: the fourth zone serves to finish the
sequence before the block leaves the field, otherwise the last paragraph
would light up right when you stop reading it.

Reimplementation: an `IntersectionObserver` isn't enough — it gives a
boolean, whereas what's needed is a **continuous position**. The block's progress
through the viewport is measured and `ceil(q × n)` paragraphs are lit, with `q`
compressed onto the `0.30 → 0.70` window of the crossing: the effect must play out
while you're reading, not when the block just appears at the edge. The opacity transition (0.7 s,
signature curve) is in CSS, the JS only sets a class.

## 5 ter. The tab bar of the "Features" section

What the page calls `Triggers` isn't a simple selector: it's a pill with a
72px radius containing four tabs, whose active one is distinguished by **three**
signals overlaid.

```
.framer-bxj4ii        row, gap:8px, width:100%     ← the bar
  .framer-8x98wc      width:376px; padding:8px 24px; gap:12px   ← a tab
    .framer-arwdi5-container   style="opacity:0"   ← the active-state card
       └ radius 66px, background rgba(255,255,255,.1), inner inset:1px radius 65px
         filled with rgba(33,33,33,.85)  (--token-27bd6520)
    .framer-1wvl2qz   height:2px; position:absolute; top:-1px; left:24px; right:24px
```

The third signal is the most distinctive. This 2px rule sits **above**
the tab (`top:-1px`, so it straddles the pill's edge) and carries:

```css
mask: linear-gradient(90deg, rgba(0,0,0,0) 0%,
      rgb(0, 0, 0) 50.49169398299905%, rgba(0, 0, 0, 0) 100%) add;
```

A mask gradient that fades it out at both ends: the rule doesn't just stop,
it **fades out**. The 14 decimal digits betray a value computed by the editor,
not chosen — copying it as-is is more honest than rounding it to 50%.

Worth noting: `left:24px; right:24px` exactly matches the tab's horizontal
padding, so the rule aligns with the text and not with the box.

## 5 quater. The narrative cards ("What you get")

Structural trap: `.framer-uc3xgg{flex-flow:column;…gap:48px…}`. These are
**three large stacked cards**, not a three-column grid. Each is
split into two halves — text and visual — whose order **reverses from one card
to the next**, and ends with a footer line separated by a rule.

The text block sits in `.framer-y97w5y{flex-direction:column;flex:none;
order:1;height:min-content;padding:12px}`: notice the `padding:12px`, far
lower than the 36px of the pricing cards. Two card families, two
breathing rooms — don't unify them.

## 5 quinquies. The nav bar's scrim

The nav has **no** `backdrop-filter` at all in the source. It has a sibling layer,
`.framer-6fjk0p-container`, shipped at `style="opacity:0"` and filled with a
`linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, …)` that the runtime reveals on
scroll.

The difference isn't cosmetic: a `backdrop-filter` permanently blurs
whatever's behind it, whereas a revealed gradient leaves the nav **bare** at the
top of the page — sitting directly on the hero, with no frame — then gives it a
background as soon as light content scrolls up under it. That's what makes you not "see"
the bar on the first screen.

## 6. The two pieces worth reusing

### The price roll ("Animated Price Switch")

Starting observation, [relevé]: server rendering shows **`$0`** in the pricing card,
with `h3` typography (36px, `Inter Display`, `letter-spacing: -.02em`). A price rendered
as zero server-side proves the number is **animated on arrival**; the real value only
exists at runtime.

Reconstructed mechanics — each digit is a **column**:

```
<span class="rouleau__col">        height: 1.35em; overflow: hidden
  <div style="--d:9; --c:1">       transform: translateY(calc(var(--d) * -1.35em))
    <span>0</span> … <span>9</span>   ten children of 1.35em each
```

Three points make the effect work:

1. Column height **equals the line-height** (`1.35em`, [relevé]) — not an
   arbitrary height. This is what aligns the roll with the rest of the baseline.
2. `font-variant-numeric: tabular-nums` on the digits, otherwise column width
   would shift during the scroll and the number would tremble.
3. The **offset between columns** (`.06s × index`): without it the digits would move
   as a block and the effect would read as a translation, not as a counter.

DOM reconstruction when the **number of columns** changes (`0` → `19`), with a
`requestAnimationFrame` before setting the `--d`s: on columns just created,
setting the value immediately produces no transition, for lack of an observed starting state.

The Monthly / Yearly toggle is an **[arbitrage]**: the source names the section "Animated
Price Switch" but contains no period selector at all in the DOM. The cursor is an
absolute block whose `translateX` is animated, measured from the active button's
`offsetLeft` / `offsetWidth` — never a hardcoded width, otherwise translating the
label would break the alignment.

### The "Chat UI" mockup

> **Reading warning.** The component is called `Chat UI` in
> `data-framer-name` but **it isn't a chat thread**. No bubbles, no
> timestamps, no input field. It's a navigation rail plus a panel that
> displays **a centered community card**. The component's name is a false friend: never
> design from the name without opening up the structure.

Frame — `.framer-wk89vv`:

- `aspect-ratio: 1.42105`, `max-width: 960px`, `padding: 6px`, `gap: 6px`, 1px rule
- `border-radius: 24px 24px 0 0` — **top radius only**
- in the CTA section: `position:absolute; top:46%; left:0; right:-272px;
  transform: translateY(-50%)`

Rail — `.framer-9kb1aq` / `.framer-5hugpv`, identical:
`width:220px; padding:16px; gap:24px; border-radius:18px;
background-color:var(--token-47679c26,#fff0)` — **transparent**. It contains, in order:

1. `.framer-1vz20jn` at `place-content:center space-between` — a **ghost logo**
   (`.framer-16ztk4h{width:61px;height:16px;border-radius:6px;background-color:#fff}` at
   `opacity:.1`) and an 18px icon at `opacity:.5`;
2. `.framer-11olcql{gap:12px}` — the list of entries, each a `viewBox="0 0 24 24"` icon
   at `opacity:.8` followed by a label at the 14px preset.

Panel — two variants of the same block, and this is where the difference lies:

| | Hero | CTA |
|---|---|---|
| class | `.framer-si004q` | `.framer-t90imi` |
| background | none — a shader `<canvas>` fills it | `background-color:#ffffff0d` |
| radius | `18px` inline | `border-radius:18px` |
| flex | `flex:1 0 0; height:100%` | `flex:1 0 0; height:100%` |

Card — `.framer-izj4da` (hero: `.framer-1jelie2`), `z-index:2; gap:24px`, centered:

```
.framer-1gckil            gap:6px, centered
  .framer-7yghsn          avatar 38px, radius 100px, background #fff,
                          rule 1px #fff3, backdrop-filter: blur(10px)
                          → a LETTER in Inter SemiBold 600
  .framer-1iai6xj         name — 16px preset in <strong>, centered,
                          max-width:620px, text-wrap:balance
  .framer-fr7db8          gap:6px, centered
    .framer-1s1ds1c       avatar stack: width:40px; height:20px
      .framer-492t36      a 20px circle, radius 100px, position:absolute
    .framer-1c3h0cv       "847 members" — 14px preset, centered
a « L Primary »           the button
.framer-1e9i6o            description — 12px preset, max-width:420px,
                          --framer-text-alignment:left
```

**Three techniques worth keeping**

1. **The avatar overlap isn't a negative margin.** Three 20px circles are
   placed `position:absolute` inside a deliberately too-narrow container
   (`width:40px` for 60px of content). The overlap is an arithmetic
   consequence of the constraint, not a manually tuned offset: changing the number
   of avatars requires no recalculation.
2. **The alignment break.** The whole block is centered — avatar, name, counter,
   button — then the description switches back to `text-align:left`. It's this contrast
   that gives the card its footing; centering everything would make it float.
3. **`backdrop-filter: blur(10px)` on an already opaque avatar** (`background:#fff`). With
   no visible effect here, it's a leftover from a shared component — a detail NOT to
   reproduce out of mimicry.

**Bleed.** The mockup overflows its column by 272px and gets cut by the
section's edge. Combined with the top-only radius, it reads as a window of which you only see
a corner. Two conditions: it must be inside a container that is a **sibling** of the
text block (inside it, it would cover it), and it must switch back to `position:static` under 1200px.

**What isn't reproduced — flagged, not approximated:**

- The WebGL `<canvas>` (`data-framer-component-type="Shader"`, 2 occurrences). Replaced
  by three blurred `radial-gradient`s drifting. The **hues** are measured
  (`--token-666d339b` `#177275`, `--token-dedd8b7f` `#d39794`, the `#0099ff` accent); their
  composition and motion are an `[arbitrage]`. The shader's procedural texture
  isn't rendered and can't be, in CSS.
- The inline icon sprite (`<symbol>` / `<use href="#…">`). Replaced by 24px square
  dots at `opacity:.8` — the geometry and opacity are measured, the paths are not.

---

## 7. Images

All images are referenced by **remote URL**. No binary file is
stored in this directory.

Reconstruction from the crawled source: replace the relative prefix
`../framerusercontent.com/` with `https://framerusercontent.com/`, and **keep the query
string** — that's the CDN-side resizing.

| Use | Variant served |
|---|---|
| hero backgrounds (2464px source) | `?scale-down-to=2048&width=…&height=…` |
| gallery and thumbnails (3200 / 2400px) | `?scale-down-to=1024&…` |
| avatars (1024px, displayed at 28px) | `?scale-down-to=512&…` |

The variants available aren't the same across all files: the 2464px and
3200px images expose `512 / 1024 / 2048`, while the avatars expose **only `512`**
and full size. Check the source's `srcset` before composing a URL — a nonexistent
variant returns an error, not a fallback.

---

## 8. What this file doesn't measure

Points on which the source gave nothing and where the reconstruction decided on its own.
None of these is marked `[relevé]` in `styles.css`.

- **Inner padding of the pricing cards.** Not measurable: Framer emits **no**
  rule at all for `.framer-9ycufv`, `.framer-1grz4q3`, `.framer-o494v` — these classes are
  absent from all three `<style>` blocks. Value retained: `36px`, **borrowed** from
  the FAQ block's `.framer-gqetwg{padding:36px}`, of the same 24px radius. A nearby,
  verifiable value, not an invented figure.
- **Height of the navigation bar.** The source says `height:min-content` and
  `--1gxu5kl:0px 40px 0px 40px` — so **zero vertical padding**. In `position:fixed`
  this glues the button to the top edge of the viewport; `12px` of vertical padding was added.
- **Navigation bar background**: dark scrim + `backdrop-filter`, added. Without it
  the nav becomes unreadable as soon as it passes over a light area of the hero.
- **Height of the "M" button**: the variant shares the `.framer-efr9v5` class (48px) and
  its own height isn't emitted. `40px` retained.
- **Hover states**: the source exposes the duration (`.4s`) and the curve, not the set of
  animated properties.
- **Distribution of the stacked avatars**: the source sets `left:0` on the first one and
  lets the runtime place the other two. No 10px derived from `(40−20)/2`.
- **The four tab captions**: the source only serializes one, that of the
  active tab in server-side rendering ("Post, discuss, react — the feed your members
  live in."). The other three are written at the same register.
- **The FAQ categories don't filter anything in the export**: the three labels
  (`General`, `Community & Features`, `Privacy & Access`) are measured, but the
  distribution of questions among them is a choice — the static export carries
  no group data at all.
- **Chip dot pulsing**: added. The file's only piece of motion with no
  equivalent at all in the source.
- **Marker banner framed by rules**: the source lines up three `h4`s with no separator.
- **Fallback under 810px of the app mockup**: the 220px rail and the `1.42105` ratio are
  measured for desktop; the source switches to other variants that the static export
  doesn't detail. The switch to a column layout is a deliberate fallback.

### Two stacking traps, found from screenshots

Neither of these comes from the source: they are consequences of the inlaid-rule
card technique and of the hero's layering. They're worth knowing
because they fail **silently**.

1. **`.contenu` must be `position:relative`.** The hero's backgrounds are
   absolute children at `z-index:0`. A non-positioned sibling paints **beneath**
   them, even if declared later in the DOM. Without this line, the gradient
   covers the entire hero text — the heading simply disappears.
2. **Any card content outside `.corps` must carry `z-index:2`.** The inner
   box `.fond` is semi-opaque (`rgba(15,15,15,.85)`): content placed
   underneath it isn't hidden, it's **dimmed**. The defect then
   resembles a too-weak color choice, which makes it much harder to
   diagnose than an outright disappearance. This is what happened to the
   FAQ question labels.

### First-pass errors, corrected

Logged because they are the natural traps of this export:

1. The primary button read as cream `#fff3f0` (that's the **rule**'s color) instead of
   `rgba(255,255,255,.8)` (the **background**).
2. The "Chat UI" drawn as a chat thread based on its name alone.
3. Rail and panel swapped: in the source the **rail** is transparent and the
   **panel** carries the `#ffffff0d`.
4. A generic `--rayon-pill: 999px` where the source has four distinct values
   (768 / 215 / 880 / 100).
