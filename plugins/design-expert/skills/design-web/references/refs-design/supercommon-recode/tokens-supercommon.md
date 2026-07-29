# Design reference — black product page, carried by typography

HTML/CSS vanilla reconstruction of a page whose source is a Framer export.
The editorial content has been replaced with generic labels: what is
reproduced is the **structure, the rhythm, the typography, and the
procedures**.

**Reading convention.** In `styles.css`, every non-trivial value carries
`[relevé]` (read textually from the source, with the original class in a
comment) or `[arbitrage]` (a documented choice). The distinction is not
cosmetic: it tells you what you can reuse as a fact and what you need to
re-arbitrate yourself.

**The four files.**

| File | Role |
|---|---|
| `index.html` | structure; ends with the `#svg-templates` block — the nine vector pictograms from the source, reproduced character for character |
| `styles.css` | tokens + layout; ends with the four pictograms that the source encodes as `data:image/svg+xml` |
| `motion.js` | all of the motion. Since the source drives 100% of its motion in JS, this file is the heart of the reference, not an accessory |
| `tokens-supercommon.md` | this document |

No asset folder, no binaries, no downloads: images and video are referenced
by remote URL, the pictograms are inline vectors.

**Verification state.** The classes and values recorded were checked one by
one by literal `grep` against the source, then the render was compared
**screen by screen against the source page itself**, opened at the same
viewport. The two checks don't catch the same things, and that's the most
useful point of this document: see §7. An exact reading does not guarantee
a faithful page.

---

## 1. What holds this page together — the six procedures

### 1.1 Emptiness is the main component

Vertical rhythm is carried **not** by `padding` nor by `margin`, but by
**empty blocks measured in `vh`** inserted between sections. The source has
fifteen of them: `6vh · 7vh · 32vh · 8vh · 5vh · 25vh · 4vh · 1vh · 6vh · 5vh ·
12vh · 40vh · 12vh · 8vh · 15vh`. Roughly **200 vh of cumulative emptiness**,
that is two full screens of black spread across the page.

Consequences, and this is what makes the procedure reusable:

- spacing **follows screen height**, not width or a fixed grid;
- the large silences (`32vh`, `40vh`) systematically precede a new
  typographic statement — emptiness serves as an **announcement**, not
  filler;
- below 1,440 px the source drops two of these `25vh`/`4vh` spacers down to
  `1vh`: long silences are **a large-screen luxury**, they become a fault
  on a phone where every pixel costs a thumb-scroll.

```css
.spacer { width: 100%; height: var(--h); flex: none; }
```

An element with no content, no semantics, no name: it is the most used
compositional unit on the entire page.

### 1.2 The scrim: how an image dissolves into the page

Every image is followed by a **gradient to black positioned absolutely at
its bottom**. No image has a visible bottom edge. The source calls these
blocks `ramp` and applies three, of three different lengths:

| Role | Height | Gradient |
|---|---|---|
| Short exit (hero, video) | `30vh` / ratio `6.2069` | `linear-gradient(#0000 0%, #000 100%)` |
| Long exit (square image) | `60vh` | `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.8) 45%, #000 95%)` |

The second one is the most interesting: the stop point at **45% / 0.8**
breaks the linearity, the image fades out fast then lingers. This is what
avoids the "grey band" effect of a pure linear gradient.

The procedure does two things at once: it removes the need to crop images,
and it **manufactures the transition between sections** without any border
or separator ever existing on the page.

### 1.3 A hierarchy that refuses to announce itself

This is the most radical procedure on the page, and the easiest to misread.

In the `capabilities` list, each entry is two lines — a headline, then a
detail prefixed with a bullet. You'd expect two typographic levels. There
are none. The two lines share:

- the **same preset** (`14gxwsv`: 30 / 36, `-.04em`);
- the **same color**, `rgb(128,128,128)`, set inline on *both* `<span>`s;
- the **same weight** — the source does wrap the headline in a `<strong>`,
  but the preset there declares `--framer-font-weight-bold: 100`, which is
  exactly `--framer-font-weight`. **The `<strong>` doesn't bold anything.**

What separates the two lines is therefore, literally: a line break and a
`•` character. Nothing else.

You have to weigh what this implies. A list of ten capabilities normally
produces ten titles that pull the eye; here it produces a uniform, mid-grey,
centered block of text, which you either read or skip — but which never
demands attention at the expense of what surrounds it. The hierarchy is not
built *inside* the list, it is built **between the list and the section
title**, which is the only clear element on the whole screen.

This is reusable as-is whenever a block needs to be present without being an
entry point: secondary documentation, mentions, specifications. The opposite
temptation — bolding the headline, lightening the title — is exactly what
this page refuses.

*(Method note: my first reading of this section concluded there was a
chromatic hierarchy of `#eee` / `#888`, left-aligned. That was wrong on all
three counts — color, weight, alignment. The correction came from reading
the inline markup, not the presets.)*

### 1.4 The accent, and a lesson on how to count

`rgb(224, 59, 30)` appears **sixteen times** in the source:

- once as `#e03b1e`, the 1 px stroke of the 32 × 32 frame in the title
  banner;
- ten times in the dotted pictogram that lives inside that frame;
- **five times in the "25:00" pictogram** of the grid, drawn entirely in
  the accent.

So this is an accent that appears at **two places** on the page — the
banner's frame, and one cell out of nine in the grid — but each time
massively, as an entire object rather than a touch of color. It is neither
an underline, nor a state, nor a button: the page has no red button, no red
link, no red hover. The accent designates an **object**, always the same
one: the display.

> **A method lesson, and a costly one.** My first reading concluded
> "exactly two occurrences" — because I had counted the string `#e03b1e`,
> which indeed appears only once. The other fifteen are written
> `rgb(224, 59, 30)`, inside SVGs encoded as data URIs. **Counting a color in
> only one of its notations means not counting it.** On a Framer export,
> systematically search all three forms: hexadecimal, `rgb(a, b, c)` with
> spaces, and `rgb(a,b,c)` without.

This same error had made me describe the page as monochrome. It isn't: see
§1.6.

### 1.5 A single material, and it wraps two sections

The page has only one "material effect":

```css
--metal: linear-gradient(#000 19%, #1f2021 35%, #525755 50%, #bfc6c1 75%, #000 90%);
```

Five stops, a rise toward lightness in the middle, a return to black: a
polished metal reflection, in five shades of grey, without a single image.

**The point not to miss, and I missed it at first**: `.framer-17iwuz2`,
which carries this gradient, does not contain only the title. It wraps
**the title AND the hero** — roughly 1,100 px of height. The stops are
therefore distributed across the whole:

| Stop | Actual position | What's there |
|---|---|---|
| `#000` 19% | ~210 px | the title, on flat black |
| `#1f2021` 35% | ~385 px | the top of the hero |
| `#525755` 50% | ~550 px | the middle of the hero |
| `#bfc6c1` 75% | ~825 px | the bottom of the hero — **behind the image** |
| `#000` 90% | ~990 px | rejoins the black of the page |

The light tone is therefore never seen directly: it is **covered by the
hero image**, and only shows through at the edges, where the image doesn't
fill the space. It's a safety background as much as a material — if the
image is slow or fails, the area doesn't become a dead black rectangle, it
keeps depth.

Splitting this container into two sections — a title banner on one side, a
hero on the other — pushes the light tone right under the title and
completely changes the page's impression. This was the most serious gap in
my first version, and no recorded value flagged it: only the side-by-side
visual comparison brought it out.

### 1.6 Polychromy lives in the pictograms, and nowhere else

The page looks monochrome. It isn't. The nine pictograms in the grid carry
a palette that exists nowhere else in the text or the surfaces:

| Color | Pictogram |
|---|---|
| `#CD739E` pink | "post time" |
| `#71B48A` green | "extended time" |
| `#3C7BAF` blue + `#B8824C` ochre | "state indicator" |
| `rgb(224,59,30)` accent | "reminder" (the 25:00) |
| `#B2B2B2` | "hotkeys" |
| `#EEEEEE` + `#808080` | "notch modes" |
| `white` + `#333333` (stroke) | "time ring" |

This is consistent with what the cell itself says — *"symbol and colour cue
that shows the active mode"*. Color is not decorative here: it **is the
very information** that these pictograms document. It therefore stays
confined to objects of 48 to 131 px, on a page that is otherwise
colorless.

The procedure is reusable as-is: allow color where it *means* something,
forbid it everywhere it would only decorate.

---

## 2. Tokens

Named **by role**. No token carries the name of its appearance: that's
what lets you swap a palette without rewriting the components.

### 2.1 Surfaces and text

| Token | Value | Provenance |
|---|---|---|
| `--surface-page` | `#000` | `[relevé]` `html body { background: rgb(0,0,0) }` |
| `--surface-inversee` | `#fff` | `[relevé]` the page's only two buttons |
| `--surface-controle` | `rgb(24,25,28)` | `[relevé]` background of the segmented control |
| `--surface-active` | `#000` | `[relevé]` active tab |
| `--texte-primaire` | `#eee` | `[relevé]` default value of 4 presets out of 6 |
| `--texte-accentue` | `#fff` | `[relevé]` inline overrides (banner, tabs) |
| `--texte-secondaire` | `#888` | `[relevé]` preset `1bm514q`, the manifesto paragraph |
| `--texte-liste` | `rgb(128,128,128)` | `[relevé]` inline, `capabilities` list |
| `--texte-sur-inverse` | `#000` | `[relevé]` button text |
| `--trait-discret` | `rgb(34,34,34)` | `[relevé]` only neutral rule color |
| `--accent` | `#e03b1e` | `[relevé]` 2 occurrences, see §1.4 |

Note what **doesn't exist**: no intermediate grey between `#808080` and
`#222`, no semantic color (success, error, warning), no "card" surface, no
shadow. Pure white `#fff` is never a section background — it's reserved for
the two buttons, which makes them impossible to miss without needing to be
large.

Also note the **two greys**, `#888` and `rgb(128,128,128)` = `#808080`,
eight units apart — a gap invisible to the eye. This isn't a mistake in the
source: they have two distinct origins (a shared preset on one side, an
inline override on the other) and never meet on the same screen. They are
kept separate here rather than merged, because merging them would amount to
deciding in the source's place.

### 2.1 bis — The dimming scale, which stands in for a palette

This is the most-used hierarchy mechanism on the page, and it is not
chromatic. All recorded values, exhaustive inventory:

| Notch | Occurrences | Where |
|---|---|---|
| `1` | 4 | active tab, "stillness.", running text |
| `.5` | 7 | inactive tabs, "motion.", both hero mentions, the nine grid descriptions |
| `.25` | 1 | the caption under the contextual screenshot |

**Three values, nothing in between.** This is why the palette can be so
sparse: the page doesn't need intermediate greys, it modulates the opacity
of a single `#eee`.

Three consequences worth carrying over:

1. **A single token carries the entire secondary hierarchy.** Changing the
   background, or switching the page to light mode, requires no color to
   be re-declined: the relationships preserve themselves.
2. **`.5` and `.25` are not interchangeable.** `.5` says "secondary, but
   read it"; `.25` says "present for reference, only read it if you're
   looking for it". The screenshot's caption is the only element on the
   whole page to drop to `.25` — and indeed it's the only piece of
   information whose absence would change nothing.
3. The pair `stillness.` / `motion.` **is** this scale applied to two words
   side by side: `opacity:1` against `opacity:.5`, one aligned left, the
   other right. Two states that alternate, spoken by two words of
   different weight. It's the product's subject expressed by opacity
   alone.

### 2.2 Typography

The source uses *Akt Variable Thin* (`wght 130`, `font-weight: 100`) and
*Akt Light* (`300`) — commercial fonts. Substitution: **Inter Tight** in
weights 200 / 300, a neo-grotesque with tight tracking, the only free
family that holds the same very-thin-stroke impression under a pronounced
negative tracking.

Only one breakpoint in the entire source: `@media (max-width: 1439.98px)`.
No tablet tier. The source literally draws two viewports, **1440 and
390**, and lets everything in between fend for itself.

| Role | ≥ 1440 px | < 1440 px | Tracking |
|---|---|---|---|
| `--t-display` | 56 / 60 | 37 / 42 | `-.06em` |
| `--t-titre` | 30 / 36 | 26 / 32 | `-.04em` |
| `--t-secondes` | 32 / 40 | 28 / 34 | `-.04em` |
| `--t-chapeau` | 26 / 26 | 24 / 26 | `-.04em` |
| `--t-etiquette` | 20 / 24 | 19 / 24 | `-.01em` |
| `--t-courant` | 18 / 22 | 17 / 22 | `-.01em` |

All these values are `[relevé]`.

Two points to remember:

- **Tracking correlates with size, inversely.** The bigger the text, the
  tighter it is: `-.06em` at 56 px, `-.01em` at 18 px. This is the rule
  that gives large titles their density and keeps running text from
  choking.
- **The kicker's line-height equals its font size** (26 / 26). On a
  single-line label, a line-height of 1.0 removes all vertical play and
  lets the label sit flush against its neighbors down to the pixel.

### 2.3 Layout

| Token | Value | Provenance |
|---|---|---|
| `--largeur-max` | `1440px` | `[relevé]` top bar and footer |
| `--largeur-grille` | `800px` | `[relevé]` `max-width` of the capability grid |
| `--marge-bord` | `40px` | `[relevé]` recurring `padding: 0 40px` |

Capability grid: `repeat(3, minmax(50px, 1fr))`, gutters `80px 40px`. Below
1,440 px: **a single column**, gutters `56px 40px`, `padding: 0 40px`. No
two-column tier — the source jumps from three columns to one.

Recorded image ratios, and their pixel fallback below 1,440 px:

| Block | ≥ 1440 px | < 1440 px |
|---|---|---|
| Hero | `aspect-ratio: 1.8042` | `height: 710px` |
| Video | `aspect-ratio: 1.3211` | `height: 295px` |
| Video scrim | `aspect-ratio: 6.2069` | `height: 63px` |
| Contextual screenshot | `aspect-ratio: 1.45256` | `height: 529px` |

The switch from ratio to fixed height is a procedure in its own right: on a
narrow screen, a ratio would preserve the composition but shrink the image
to an unusable 216 px strip. The source prefers to **crop** rather than
shrink.

**Capability grid cell** — three values, all recorded, that let eight
cells of very different content align without manual tuning:

| Element | Source class | Value |
|---|---|---|
| Cell | `.framer-4dmrqa` | `column`, `align-items:flex-start`, `place-self:start`, **`gap:20px`** |
| Icon box | `.framer-1embbqn` | **`height:60px`**, `width:100%` |
| Icon | `.framer-4i87wz` | `48px` tall, `position:absolute`, `top:calc(50% - 24px)` |
| Text block | `.framer-1t6e5iq` | `column`, `align-items:center`, **`gap:10px`**, `width:100%` |
| Title / description | `.framer-12ihk1z` / `.framer-t6iy5s` | `width:100%`; description `opacity:.5` |

Three things to remember:

1. **Two spacing levels, not one**: 20 px between the icon and the text,
   10 px between the title and its description. The sub-block reads as a
   unit.
2. **The icon box (60 px) is taller than the icon (48 px)**, and the
   source's icons all have different sizes (48, 50, 64, 83, 112, 117,
   131 px wide). It's the box, at a fixed height, that aligns the eight
   titles — not the icons. Aligning on the icons would have required
   normalizing them.
3. The text block's `align-items:center` is **neutralized** by the
   `width:100%` of its two children. Reproducing one without the other
   centers the titles and leaves the descriptions left-aligned — this
   happened during this reconstruction.

---

## 3. Motion

> **No timing value is recordable.** The source contains no `@keyframes`,
> no `animation-timeline`, not even a single inline `transition`: all its
> motion is produced by the Framer Motion JS runtime, invisible from the
> shipped HTML. **Every duration and every curve below is an
> `[arbitrage]`.** What was recorded are the *triggers* and the *states* —
> `cursor: pointer`, `data-highlight`, `opacity: .5` on inactive tabs,
> `loop`/`muted`/`preload="none"` on the video — that is, proof that an
> animation exists and which property it acts on, never its actual setting.

### 3.1 The system

Three durations, two curves, one offset. Reused everywhere; **no one-off
time value appears anywhere else in the CSS**. This is the constraint that
makes a set of animations coherent rather than a collection of effects.

| Token | Value | Use |
|---|---|---|
| `--duree-court` | `180ms` | pointer reactions — hover, press |
| `--duree-moyen` | `420ms` | state changes — tab, ring |
| `--duree-long` | `900ms` | scroll-triggered reveals |
| `--courbe-sortie` | `cubic-bezier(.2,.8,.25,1)` | sharp deceleration: what **enters** |
| `--courbe-standard` | `cubic-bezier(.4,0,.2,1)` | symmetric: what is **reversible** |
| `--decalage-cascade` | `60ms` | grid cascade step |

Reasoning behind the 180 / 420 / 900 ratio: a hover should feel instant
and reversible; a state change should be *seen* to change, so it must
exceed the perception threshold (~300 ms) without becoming a wait; a
900 ms reveal is never expected by the user — it accompanies a scroll they
already control, and a long duration reads there as smoothness, not
slowness.

The choice of curves is a rule, not a taste: **what enters decelerates**
(the object arrives and settles), **what toggles is symmetric** (the
forward and back motion must be indistinguishable, otherwise the active
state "weighs" more than the inactive one). No bounce anywhere: there is
no mass on this page.

### 3.2 The effects, one by one

Everything is in `motion.js`, commented block by block.

| # | Effect | Trigger | Animated property | Start → end | Duration | Curve |
|---|---|---|---|---|---|---|
| 1 | Block reveal | `IntersectionObserver` — threshold `0.15`, `rootMargin` `-12%` at bottom | `opacity`, `transform` | `0 / translateY(12px)` → `1 / none` | `--duree-long` | `--courbe-sortie` |
| 1b | Cascade | `--i` variable set on the children of a `[data-stagger]` | `transition-delay` | `0` → `n × 60 ms` | — | — |
| 2 | Segmented control thumb | click, arrows, Home/End | `transform`, `width` | previous tab → new tab | `--duree-moyen` | `--courbe-sortie` |
| 3 | Tab opacity | same | `opacity` | `.5` → `1` — **both states are `[relevé]`** | `--duree-moyen` | `--courbe-standard` |
| 4 | `focus.` / `flow.` pair | `:hover`, `:focus-visible` | `opacity` | `.5` → `1` — **resting state `[relevé]`** | `--duree-court` | `--courbe-standard` |
| 5 | Button hover | `:hover` | `background-color`, `color` | `#fff/#000` → accent/`#fff` | `--duree-court` | `--courbe-standard` |
| 6 | Link, logotype hover | `:hover` | `opacity` | `1` → `.6` / `.7` | `--duree-court` | `--courbe-standard` |
| 7 | Looping video | `IntersectionObserver`, threshold `0.25` | play / pause | — | — | — |
| 8 | "25:00" pictogram pulse | `IntersectionObserver`, threshold `0.4` | `opacity` | `1` ⇄ `.55` | `1 s`, `steps(1, end)` | — |
| 9 | Playback progress | `scroll` `{passive:true}`, throttled by rAF | `transform: scaleX()` | `0` → `1` | follows the finger | — |
| 10 | Scroll to anchor | click on `a[href^="#"]` | `scrollIntoView` | — | native | `smooth` / `instant` |

Three points worth pausing on.

**#4 is not an invented hover.** `opacity:.5` on "motion." is *in* the
source, along with `cursor:pointer`, `data-highlight` and `tabindex="0"`.
The resting state and the interactivity are therefore facts; only the
toggle to `1` is an arbitrage. That's the difference between reproducing a
procedure and inventing one.

**#8 breathes, it doesn't count.** The source's `00:25:00` pictogram is a
frozen SVG — Framer doesn't animate it. Making it tick off seconds would
have been inventing a behavior; making it pulse at the pace of a
display's colon stays within what the object already conveys. It uses
`animationPlayState` rather than adding/removing a class: the pulse
resumes exactly where it stopped, with no jump when it comes back onscreen.

**#9 doesn't exist in the source, and that's a deliberate choice.** A page
that runs on ~200 vh of emptiness gives no progress marker. A 1 px rule in
the accent color provides one without competing with anything. Remove it
if you want the bare source.

### 3.3 What was dropped, and why

- **`animation-timeline: view()`** — dropped. Limited availability, not
  Baseline. A keyframe that starts at `opacity: 0` leaves elements
  **permanently invisible** wherever it isn't supported. A scroll reveal
  must never be able to fail into "nothing shows". `IntersectionObserver`
  (Baseline since March 2019, works over `file://`) has no such failure
  mode, and the fallback is explicit: without it, everything is set to its
  final state.
- **Any animation of `width`, `height`, `top` or `left`** — dropped. Only
  `opacity` and `transform` are animated: they trigger no layout
  recalculation. The segmented control's thumb moves via `transform`, not
  `left`, for exactly this reason.
- **The bounce** — dropped. See §3.1.
- **Hard-coded `behavior:'smooth'`** — dropped, and this is the most
  common trap in any `motion.js`: **JS scrolling APIs never consult
  `prefers-reduced-motion`**. Unlike CSS transitions, `scrollTo`,
  `scrollBy` and `scrollIntoView` ignore the system preference. A
  hard-coded `'smooth'` therefore forces motion on exactly the audience
  the preference is meant to protect. A second, subtler trap: *omitting*
  `behavior` does not mean "instant" — the default `'auto'` silently
  follows the page's CSS `scroll-behavior`. You must be explicit in
  **both** branches: `behavior: calme ? 'instant' : 'smooth'`.
- **`addListener()`** — dropped in favor of `addEventListener('change', …)`
  on the `MediaQueryList`: the former form is deprecated.

### 3.4 Reduced motion

`prefers-reduced-motion: reduce` is honored **without exception**, at two
levels:

1. in CSS, all durations drop to `1ms` and `[data-reveal]` blocks are set
   to their final state;
2. in JS, no reveal observer is installed, the `.js-motion` class is never
   set, the video does not start, the pictogram does not pulse, and
   scrolling to an anchor switches to `behavior:'instant'`.

The safety contract holds in one sentence: **the `opacity:0` resting state
is only armed by JS**, via the `.js-motion` class on `<html>`. Without
JavaScript, without `IntersectionObserver`, or under reduced motion, the
CSS never hides anything. This is what distinguishes a scroll reveal from
a blank page.

The preference is also **listened to live**: if it toggles mid-session,
all still-hidden blocks are immediately revealed. A user who enables
reduced motion partway through a page must not end up with invisible
blocks behind them.

Finally, reducing motion must never reduce **information**: the `00:25:00`
pictogram stops pulsing but stays at full opacity, perfectly readable.

---

## 4. Two traps encountered while rebuilding

They are not in the source — they showed up while reimplementing it, and
they will reappear for anyone who reuses these procedures.

### 4.1 Never put a reveal class on an element centered via `transform`

```html
<!-- breaks the centering: .reveal overwrites translate(-50%,-50%) -->
<div class="hero__offer reveal">…</div>

<!-- correct: one box POSITIONS, another ANIMATES -->
<div class="hero__offer"><div class="hero__offer-in reveal">…</div></div>
```

`transform` is a single property. A utility class that animates it
silently destroys any centering that already uses it — the element starts
half a screen off to the side, with no error or warning.

### 4.2 An aspect ratio does not replace a height on a narrow screen

The hero at `aspect-ratio: 1.8042` is 798 px tall at 1,440 px wide… and
**216 px** at 390 px. The overlaid content gets crushed there. The source
solves the problem by dropping the ratio below 1,440 px in favor of a
fixed height (`710px`). This is the correct answer, and it holds for any
block carrying overlaid content.

---

## 5. Deliberate departures from the source

| Point | Source | Here | Reason |
|---|---|---|---|
| `<h1>` | **none** on the entire page | placed on the hero title | fixed a source defect |
| Font | Akt Variable Thin / Akt Light | Inter Tight 200 / 300 | licensing — the only remaining substantive gap |
| 253 × 23 logotype | 3 variants as data URI | the header variant, recorded | the other 2 serve the narrow viewport and the footer |
| The 9 pictograms | inline SVG + data URI | **recorded character for character** | they're in the source, nothing to download |
| Hero | `min-width: 1280px` | removed | caused horizontal overflow at 390 px |
| Contextual screenshot | `min-width: 768px` | removed | same reason |
| Accent | 16 uses, 2 places | + focus, button hover, ring stroke | 3 uses added, all marked `[arbitrage]` |
| Playback progress | absent | 1 px rule at top | §3.2 #10 — remove for the bare source |
| 25:00 pictogram pulse | frozen | 1 s opacity pulse | §3.2 #8 — a deliberate, bounded addition |
| Between 390 and 1440 px | not handled, overflows | guardrails added | a reference must not scroll horizontally |

**Note on the labels.** The text on this page was restored to the
source's after the fact. Some sections therefore carry the original labels
("interval", "for macOS", "time as an instrument", the license mentions)
and others carry generic labels ("focus versus flow.", "one value, held in
place"). This inconsistency is known and affects neither the structure,
nor the tokens, nor the procedures — but it requires a pass to make it
uniform if the file is to circulate as-is.

---

## 6. Media

Referenced via **remote URL**, no binary file in this folder.

| Use | URL |
|---|---|
| Hero | `https://framerusercontent.com/images/k2hTUMRvuxIEcleQsvFCANDKZk.jpg?lossless=1&width=3437&height=1905` |
| Square image | `https://framerusercontent.com/images/WgcM5KR0yzwqpA4X8i2Pf5AfvCg.jpg?scale-down-to=1024&lossless=1&width=2048&height=2048` |
| Contextual screenshot | `https://framerusercontent.com/images/0KpwrRrlKBLGFd2UxFwGy8BBxA.jpg?scale-down-to=2048&lossless=1&width=3200&height=2203` |
| Video poster | `https://framerusercontent.com/images/lyNgdVtkmxMMCSenyE8ICOMyw.jpg?scale-down-to=1024&lossless=1&width=3200&height=2400` |
| Video | `https://resources.supercommon.systems/downloads/output.webm` |

The query string (`?scale-down-to=…&width=…`) is the CDN-side resizing —
removing it serves the original file at full resolution.

**Caveat worth knowing:** the video is not hosted on the image CDN but on a
resource domain of the origin site. It's the only media whose long-term
availability is not guaranteed; the poster, by contrast, does come from the
CDN and will keep showing if the video fails to load.

---

## 7. Traceability audit — what verification corrected

A first draft of this file carried **eight false values**, all marked
`[relevé]`. They were found by re-checking every marker via literal `grep`
against the source. They are listed here because they share three causes
that will recur for anyone stripping down a Framer export.

| Value | First draft | Source | Cause |
|---|---|---|---|
| Tab padding | `10px 22px` | `4px 8px 6px` | A |
| Manifesto paragraph width | `800px` | `1120px` | A |
| Grid cell icon box | `48px` | `60px` | A + icon/box confusion |
| Spacing inside the cell | `20px`/`8px` margins | `gap:20px` + `gap:10px` | A |
| `capabilities` list color | `#eee` / `#888`, left-aligned | `rgb(128,128,128)` for both, centered | A |
| Spacer before `capabilities` | `20vh` "arbitrage" | `15vh` | A |
| Spacers before the grid / the button | `12vh` and `8vh` at base | `15vh` at base, `12vh` and `8vh` below 1440 | B |
| Contextual screenshot below 1440 | `529px` | *(no override)* | C |

### Cause A — the extractor only saw a fraction of the rules

The first pass searched for `.framer-XXXX{`. But Framer prefixes most of
its rules with the component's class, and groups them:

```css
.framer-OfKhL .framer-1embbqn{…}                    /* prefixed */
.framer-c9gaO .framer-128e0f1,.framer-c9gaO …{…}    /* grouped  */
```

A pattern anchored on `.classe{` misses both forms and **returns nothing**
— which looks exactly like "the source doesn't provide this value". Several
`[arbitrage]` entries were in fact values that were present, just never
read.

> **Rule.** On a Framer export, never conclude "absent from the source"
> from a grep that returns zero. First isolate the rules (`tr '}' '\n'`,
> keep lines containing `{` and no `<`), then search for the class
> **anywhere** in the selector.

### Cause B — confusing a base value with an override

Four spacers share a base declaration of `15vh`; two of them are then
brought down to `12vh` and `8vh` **inside the
`@media (max-width:1439.98px)` block**. Read in isolation, these `12vh`
and `8vh` pass for the base values — and the wide viewport suddenly loses
10 vh of silence, which is precisely what makes it breathe (§1.1).

> **Rule.** Record the *position* of a declaration before its value: bound
> the media block, then classify each declaration by whether it falls
> inside or outside it.

### Cause C — dead CSS that looks like a breakpoint

`529px` does exist in the source. But on
`.framer-c9gaO.framer-v-13msgs6` — a **component variant** that this
page's DOM never renders (it only serves `framer-v-1ijn0lg`). Turning it
into a breakpoint would have manufactured a rule that exists nowhere.

> **Rule.** A `framer-v-XXXXX` class designates a variant, not a
> breakpoint: check its presence in the DOM before recording it. Variants
> actually served depending on size are marked differently — two copies of
> the same block inside `<div class="ssr-variant hidden-…">`, arbitrated
> by the `.hidden-bc5zgi` / `.hidden-1p5b6zv` rules of the
> `<style data-framer-breakpoint-css>`. Watch the direction: `hidden-bc5zgi`
> is hidden **above** 1440 px, so it's the *mobile* variant.

### Cause D — counting a color in only one of its notations

`#e03b1e` appears only once in the source. `rgb(224, 59, 30)` appears
fifteen times. I had counted the former and concluded "an accent used
twice", then built a whole line of reasoning on it. The same mistake had
made me describe the page as monochrome when its pictograms actually carry
pink, green, blue and ochre (§1.6).

> **Rule.** Search for any color in its three notations: `#rrggbb`,
> `rgb(a, b, c)` with spaces, `rgb(a,b,c)` without. On a Framer export,
> data-URI-encoded SVGs systematically use the spaced `rgb()` form, and
> they slip past a hexadecimal grep.

### Cause E — an exact reading is not a faithful page

This is the most important one, and no grep finds it.

After verification, 100% of the recorded values were exact. The page was
nonetheless clearly unfaithful, for three reasons that no value could
signal:

1. **Nesting.** The metallic gradient wraps the title *and* the hero. I
   had them in two separate sections. All the values were right; the
   structure put them in the wrong place (§1.5).
2. **Coverage.** The grid has **nine** cells, not eight. One was missing
   — "notch modes", the first one.
3. **Pictogram rendering.** I had replaced nine drawn SVGs with generic
   CSS primitives, believing the assets weren't redistributable. They are
   in the source, as inline vectors: nine `<svg>` in a `#svg-templates`
   block, and four `background-image:url('data:image/svg+xml,…')`.
   Nothing to download, nothing binary — it just needed to be recorded.

> **Rule.** Do both checks, in this order: grep validates the *values*,
> the side-by-side visual comparison validates the *structure*, the
> *coverage*, and the *assets*. The second finds what the first cannot
> see. Open the source and its recode at the same viewport, screen by
> screen, and correct until the comparison holds — it's the only check
> that bears on the result rather than on the intention.

### What the audit confirmed

Colors, gradients, the full type scale, ratios, positions, layout,
gutters, opacity states: verified literally, along with the classes cited
as provenance. The three gradients, the file's most discriminating
strings, match character for character. After correcting the structure,
the vertical rhythm of the recoded page and that of the source agree
within about twenty pixels over nine screens of scrolling — a drift due
solely to text wrapping, since the labels are not exactly the same length.
