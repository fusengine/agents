# Measured techniques — linear.app/homepage

Design reference for `design-expert`. Source: a Next.js page scraped
locally (1 inline `<style>` block + 68 non-minified CSS files with readable
names). This document describes **reusable techniques**, not a palette.

`[relevé]` = read verbatim in the source, the file is cited.
`[arbitrage]` = my choice, flagged everywhere it appears.

---

## 1. What makes the Linear signature (to remember before the values)

1. **No color carries decorative meaning.** The site is two-tone:
   cool background + cool text, and **only one** brand color (indigo). The 5
   accents (blue/red/green/orange/yellow) only serve system states.
2. **Hover never changes hue: it changes brightness.**
   `filter: brightness(115%)` on a button, `brightness(1.3)` or `1.4` on a
   link. A single technique for the entire site, so zero hover tokens to manage.
3. **Press is a `scale(.97)`.** On every button variant and every
   action link. It's the only tactile feedback.
4. **Whitespace does the emphasis.** Pre-footer at `margin-block: 224px`, sections at
   `padding-block: 128px`, section header at `padding-bottom: 96px`.
5. **Edges don't get cut: they dissolve.** Everything that exits the
   frame fades out via `mask-image` (product panel, marquee, illustrations).
6. **Motion amplitudes are tiny**: 4px of translation,
   0.97–0.98 of scale. Nothing "moves", everything settles.

---

## 2. Color system

### 2.1 Structure — 4 parallel ramps, not a palette

| Ramp | Levels | Role |
|---|---|---|
| Background | `primary → secondary → tertiary → quaternary` + `level-0..3` | stacked surfaces |
| Text | `primary → secondary → tertiary → quaternary` | reading hierarchy |
| Border | `primary → secondary → tertiary` + 2 translucent | separation |
| Line | `primary → quaternary` + `tint` | thin rules |

Each ramp has **exactly 4 steps**. A component picks one level per
ramp, never a free value. This is what makes the light theme possible with
a single attribute substitution.

### 2.2 The grays aren't neutral [relevé `index.6-dOvMEf.css`]

Dark: `#08090a` (background) → `#0f1011` → `#141516` → `#191a1b`.
The blue channel is **always ≥** red. The secondary text `#d0d6e0` and the
tertiary `#8a8f98` are distinctly blue-tinted. A neutral gray (`#111`, `#888`)
immediately breaks the rendering.

Light: `#fff` → `#f8f8f8` → `#f4f4f4` → `#f0f0f0`, text `#282a30` / `#3c4149`
/ `#6f6e77`. The tint shifts toward **mauve** in light mode, not toward blue.

### 2.3 The brand color changes between themes

`#5e6ad2` in dark, `#7070ff` in light. It's not the same color: the
light version is more saturated to hold up on white. **Never reuse a brand
hex value from one theme in the other.**

### 2.4 Absolute accents (invariant) [relevé]

`--accent-bleu #4ea7fc` · `rouge #eb5757` · `vert #27a644` · `orange #fc7840` ·
`jaune #f0bf00` · `indigo #5e6ad2` · `cyan #00b8cc`.

Blue switches to **P3 gamut** when the screen allows it:

```css
@media (dynamic-range: high) or (color-gamut: p3) {
  :root { --accent-bleu: #5eb0ff; }
  @supports (color: color(display-p3 0 0 0)) {
    :root { --accent-bleu: color(display-p3 .431 .6816 .9988); }
  }
}
```

Deliberate double guard: the media query gives a more vivid sRGB fallback, the
`@supports` gives the true P3 color. A technique to copy verbatim.

### 2.5 Shadows — stacking rather than depth [relevé]

`--shadow-stack-low` stacks **5 shadows** from 0 to 8px, each at 1–8%
opacity (`#0000` · `#00000003` · `#0000000a` · `#00000012` · `#00000014`).
None is visible on its own; it's the sum that creates a soft edge. A single
shadow at 20% gives a "bootstrap" look, the five give Linear.

In light theme the stack gains a **6th layer, `inset` and first**:
`0px -1px 1px 0px #0000001c inset`. It carves the top edge — on a
white background, the drop shadow alone is no longer enough to lift the element.

### 2.6 Text selection [relevé]

`color-mix(in lch, var(--marque-fond), black 10%)` in dark,
`… transparent 64%` in light. The selection is **derived** from the brand color, never
hardcoded.

---

## 3. Type scale

### 3.1 Non-round weights [relevé]

`400 / 510 / 590 / 680`. Not `500 / 600 / 700`. A variable font exploited to get
in-between notches. The standard title weight is **590**, not 600 or 700.

### 3.2 Letter-spacing rule — the only one to remember

| Size | Line-height | Letter-spacing |
|---|---|---|
| ≤ 1.5rem (titles 1–3) | 1.33–1.4 | **−.012em** |
| ≥ 2rem (titles 4–9) | 1.0–1.125 | **−.022em** |
| Body 0.9375rem | 1.6 | **−.011em** |
| Small 0.875rem | 21/14 | −.013em |

**Body text has negative letter-spacing.** This is counterintuitive and
it's central: without it, Inter looks loose at this size.

Second rule: **line-height goes down as size goes up** — 1.6 on the
body, 1.0 on title 9. Large titles are tight to the point of touching.

### 3.3 Title scale [relevé]

`1.0625 · 1.25 · 1.5 · 2 · 2.5 · 3 · 3.5 · 4 · 4.5 rem`.
Not a geometric ratio: chosen steps, with a constant 0.5rem jump
from title 5 onward. The hero uses title 9 (4.5rem / 72px).

Below 640px, **every large title falls back to 38px** [relevé `Hero.css`, `CTA.css`].
A single mobile value, no `clamp()` in the source.

### 3.4 Measure in `ch`, not `px` [relevé `PageSection.css`]

`max-width: 38ch` on section descriptions. The measure follows the font
size instead of being recalculated per breakpoint.

### 3.5 A detail not to forget [relevé]

```css
font-feature-settings: "cv01", "ss03";
```

Set on `html, body`. Changes the shape of the `a` and of Inter's
numerals. It's one of the rare settings that makes the text "recognizable" without
changing the typeface.

---

## 4. Animations — measured catalog

175 occurrences of `@keyframes` in the inline `<style>` block of the HTML — **100
unique names**, all generated (25 points × 4 patterns) — plus 50 occurrences for
**40 unique names** in the 68 component CSS files. Catalog below.

### 4.1 Table of effects

| Effect | Trigger | Property | Start → end | Duration | Curve | Source |
|---|---|---|---|---|---|---|
| **Marquee** | permanent | `transform: translateX` | `0` → `calc(-100% - gap)` | **30s** | `linear` | `Marquee.css` |
| Marquee (2nd track) | permanent | `translateX` | `calc(100% + gap)` → `0` | 30s | `linear` | same |
| **Dot matrix** | permanent | `opacity` | `.3` ⇄ `1` | **1600 / 2800 / 3200ms** | **`steps(1, end)`** | HTML inline |
| **Text sweep** | permanent | `background-position` | `0%` → `-300%` | **2.2s** | `linear` | `NewHeroIllustration.css` |
| **Dot reveal** | permanent | `clip-path: inset` | `0 100% 0 0` → `0` → back | **2.1s** | **`step-end`** | same |
| **Reveal** | mount | `opacity` + `translateY` | `0, 4px` → `1, 0` | **.4s** | `ease-out-quart` | same |
| Cursor (visibility) | permanent | `visibility` | visible ⇄ hidden at 50% | **1.2s** | `step-end` | `Blink.css` |
| Cursor (opacity) | permanent | `opacity` | steps 0/49/50/99% | **1.25s** | default | `SlackIssue.css` |
| Fade (CTA) | mount | `opacity` | `0` → `1` | **.5s** (delay .1s) | default | `CTA.css` |
| Menu opening | interaction | `opacity` + `scale` | `0, .98` → `1, 1` | **.18s** | default, `both` | `Header.css` |
| Context menu | interaction | `opacity` + `scale` | `0, .9` → `1, 1` | **.1s** | `ease-out-quad` | same |
| Tooltip | interaction | `opacity` + `scale` | `0, .9` → `1, 1` | .1s | `ease-out-quad` | `Tooltip.css` |
| Dialog box | interaction | `opacity` + `translate` + `scale` | `0, -49%, .95` → `1, -50%, 1` | .18s | `ease-in-out-quad` | `Dialog.css` |
| Side entry | tab change | `opacity` + `translateX` | `0, ±amount` → `1, 0` | var. | `ease-in-out-quad` | `Header.css` |
| Image loading | `data-loaded` | `opacity` + `mask` | `0, mask 150%` → `1, mask 0` | **.8s** | default, `both` | `Image.css` |
| Target highlight | `:target` | `background` + `border` | visible between 20% and 80% | **3s** | `ease-in-out-quad` | `Collapsibles.css` |
| Debug grid | mount | `opacity` | `0` → `1` | **.48s** | `ease-out-quint` | `Providers.css` |
| Theme toggle | change | `opacity` | `0` → `1` | **.18s** | default | `ThemeToggle.css` |

### 4.2 Transitions (outside keyframes)

| Target | Properties | Duration | Curve |
|---|---|---|---|
| Button | `border, background-color, color, box-shadow, opacity, filter, transform` | **.16s** | `ease-out-quad` |
| Section link / pillar | `filter, transform` | **.16s** | `ease-out-quad` |
| **Header nav item** | `color, background` | **.1s** (`--speed-quickTransition`) | `ease-out-quad` |
| Collapse chevron | `transform` | **.12s** | default |
| Permalink on hover | `opacity` | **.12s** | default |
| Stat card | `filter` | **.2s** | `ease-out` |
| Logo strip | `filter` | **.2s** | `ease-out-quad` |

**There are TWO pointer-response speeds, not one.** `.16s` for anything
with visual weight (buttons, action links); **`.1s` for the header
navigation**, which must feel instantaneous. Confusing the two makes
the nav feel sluggish. The other durations: `.18s` (panels), `.4s`/`.5s` (reveals).

### 4.2 bis — The header nav item [relevé `Header.css .TZTsQG_anchor`]

It's a **pill** (`border-radius: var(--radius-rounded)`), not a rounded
rectangle — a classic trap. `height: 32px`, `padding: 0 12px`, `font-size: 13px`,
`background: 0 0` at rest. Its hover background is **not** a level of the
background ramp but a dedicated token, `--anchor-glass-bg`: `#ffffff14` in dark,
`#00000014` in light. The exact same value as `--color-border-translucent-strong`
— nav hover has the density of a border, not a surface.

### 4.3 The 4 named speeds [relevé `index.css`]

```
--speed-highlightFadeIn:  0s     /* the highlight appears with no delay */
--speed-highlightFadeOut: .15s   /* it fades out, slowly */
--speed-quickTransition:  .1s
--speed-regularTransition:.25s
```

Deliberate asymmetry: **a highlight appears instantly and disappears
slowly.** A directly reusable technique.

### 4.4 Curves — full inventory, zero bounce

`in/out/in-out` × `quad, cubic, quart, quint, expo, circ` = 18 declared curves.
**No elastic or bounce curve exists in the source.** The three
actually used:

- `ease-out-quad` `cubic-bezier(.25,.46,.45,.94)` — everything that responds to hover
- `ease-out-quart` `cubic-bezier(.165,.84,.44,1)` — reveals
- `ease-in-out-quad` `cubic-bezier(.455,.03,.515,.955)` — panels and dialogs

### 4.5 Technique: the marquee without JS [relevé `Marquee.css`]

```
2 copies of the content → the 2nd in position:absolute, offset by +100%+gap
both translated in a 30s linear loop
64px side mask on both edges
```

Three details that make the quality:
1. The offset is `calc(-100% - var(--gap))`: **the gap is part of the
   cycle**, otherwise the loop skips a gutter on every pass.
2. The 2nd track is `visibility: hidden` by default and is revealed **only**
   under `prefers-reduced-motion: no-preference` — with no motion, no
   visible duplicate.
3. `animation-play-state: paused` on hover, under `@media (any-hover: hover)`.

### 4.6 Technique: the dot matrix [relevé HTML inline]

The page's most distinctive pattern. A 5×5 grid set in
isometric perspective, where each dot blinks on its own sequence.

```css
.scene  { perspective: 1000px; }
.grille { transform: rotateX(60deg) rotateY(3deg) scale(.85) rotate(43deg); }
.point  { animation: <nom> 1600ms steps(1, end) infinite; }
```

- **`steps(1, end)` is mandatory**: the dots switch, they don't fade.
  A continuous interpolation destroys the "LED matrix" effect.
- Three patterns, three durations: `pong` 1600ms (8 steps of 12.5%),
  `upDown` 2800ms (14 steps of 7.14%), `agent` 3200ms (16 steps of 6.25%).
  **Duration = number of steps × 200ms** in all three cases.
- Opacities: `0.3` (off) and `1` (on). Two values, never a gradient.
- There's also `<nom>-empty-once` at `200ms steps(1,end) forwards`:
  the initial extinguish, played once.
- The rotation triplet `60/3/43°` is non-negotiable: it's what gives
  the isometric plane. The `rotateY(3deg)` is the detail that breaks the perfect
  symmetry and makes the render credible.

> **[arbitrage]** The source declares **one keyframe per dot and per pattern**:
> 25 dots × 4 patterns (`upDown`, `pong`, `agent`, `empty-once`) = **100
> server-generated declarations**. My reconstruction declares 5 (one per
> phase), assigned via `data-p`. Grid, durations, timing function and opacities
> are identical; only the phase distribution is reconstructed. For a
> strictly identical render, all 100 must be generated.

### 4.7 Technique: reveal via `clip-path` [relevé]

```css
@keyframes revelation-points {
  0%      { clip-path: inset(0 100% 0 0); }
  15%     { clip-path: inset(0 66.6% 0 0); }
  30%     { clip-path: inset(0 33.3% 0 0); }
  45%     { clip-path: inset(0); }
  65%, to { clip-path: inset(0 100% 0 0); }
}
/* 2.1s step-end infinite */
```

Three opening steps, an abrupt close at 65%, then a dead time
until 100%. **The dead time lets the loop breathe** — without it, the effect
is jittery. Applicable to any character-by-character reveal.

### 4.8 Technique: text sweep [relevé]

```css
background: linear-gradient(-.6turn, tertiaire 0%, quaternaire 60%,
                            tertiaire 80%, tertiaire 100%);
background-size: 300%;
background-clip: text;
color: transparent; -webkit-text-fill-color: transparent;
animation: balayage 2.2s linear infinite;  /* 0% → -300% */
```

The angle in `turn` and the `background-size: 300%` are linked: the
`-300%` translation makes exactly one cycle. The light zone is **darker**
than the base text (quaternary in the middle) — the sweep darkens,
it doesn't lighten. Counterintuitive and much more subtle.

### 4.9 Technique: loading image [relevé `Image.css`]

The image doesn't appear as an opacity fade: a **400% linear mask**
sweeps from right to left while opacity rises, over `.8s`.

Measured safeguard: the rule is prefixed `html.js` and the animation is only
armed by `[data-loaded=true]`, set in JS. **Without a script, no image is
ever invisible.** To be copied systematically.

### 4.10 Reduced motion — how the source handles it

Two strategies coexist:

1. `@media (prefers-reduced-motion: no-preference)` around the **declaration**
   (marquee) — the animation doesn't exist at all otherwise.
2. `animation: none` under `reduce` (matrix, reveals) — possible **because
   the source's keyframes have no 100% marker**: the element is
   already in its final state at rest.

> **[arbitrage]** If your elements start from `opacity: 0` in CSS (the classic
> case of a scroll reveal), `animation: none` leaves them **invisible for
> good**. You then have to explicitly restore `opacity: 1`. This is trap
> number one for this type of effect.

Off-limits here: `animation-timeline: view()` / `scroll()` — not yet Baseline
widely available; a keyframe starting at `opacity: 0` leaves elements
permanently invisible wherever the property is ignored. The correct tool for
a scroll reveal is `IntersectionObserver` (widely available 2019).

---

## 4 bis. Page structure — the skeleton, above all else

This is what my first version was missing, and it's what matters most:
measuring correctly isn't enough if the skeleton isn't there.

### Exact block order

```
sticky header
hero             title · description · announcement line · illustration frame
logo strip
statement        two-tone sentence + 3 "FIG" columns
section 1.0      Intake
section 2.0      Plan
section 3.0      Build
section 4.0      Diffs
section 5.0      Monitor
changelog        timeline, 4 columns
quotes           brand-colored cards
pre-footer       centered title + 2 buttons
footer           6 columns
```

### INTERNAL order of a section [relevé]

```
1. header     title (left) | description + numbered link (right)
2. illustration  full-width frame
3. footer     sub-links 1.1 → 1.n, ruled across 2 columns
```

Below 640px the source switches the section to `flex-direction: column-reverse`:
**the illustration moves ahead of the text**, and the footer — marked `hide-mobile` —
disappears entirely. Content is removed, not folded.

### The numbering — the page's identity marker

Each section carries a number with a **slashed zero**: `1.0`, `2.0`… then lists its
modules as `1.1`, `1.2`, `1.3`. The page reads like the table of contents of a
technical document, at two levels. Without this numbering, these are five
generic marketing sections; with it, it's a table of contents.

```css
/* utils.css .Fzcv4W_slashedZero — three LINKED settings */
font-feature-settings: var(--font-settings), "zero";
font-variant-numeric: lining-nums tabular-nums slashed-zero;
```

The numbered link is composed of three pieces with **inline** margins:
number, `margin-left: 12px` + module name, `margin-left: 6px` + arrow.

The number of sub-links is **irregular**: 4 for Intake and Plan, **5** for
Build, **none** for Diffs, 3 for Monitor. Content dictates it, not
the grid.

### The frame repeated six times [relevé]

`page.css`, `Plan.css`, `Build.css`, `Monitor.css`, `SlackIssue.css` all
declare **exactly the same** pair `.MwJdiW_container` / `.MwJdiW_panel`:

```css
.container { border-radius: 22px; padding: 8px;
  border: 1px solid var(--color-border-translucent-strong);
  mask-image: linear-gradient(to bottom, black 0%, black 60%, transparent 100%); }
.panel { background: var(--color-bg-level-1);
  box-shadow: inset 0 0 0 1px var(--color-border-primary);
  border-radius: 12px 12px 0 0; }
```

The hero and the five sections use it. **It's this frame recurring six times
that gives the page its rhythm** — far more than the colors or typography. The
Diffs variant changes only two things: solid border and a -8px overflow.

### The triple mask per section [relevé]

Each illustration carries **three** mask gradients composited via
`mask-composite: intersect` — toward the bottom, toward the right, toward the left —
with **different stops per section**:

| Section | bottom | right | left | extra |
|---|---|---|---|---|
| Intake | 40% → 90% | 68% → 96% | 55% → 65% | `translateX(-120px)`, width 110% |
| Plan | 50% → 90% | 60% → 100% | 60% → 100% | — |
| Monitor | 40% → 100% | 80% → 100% | 60% → 95% | `margin-inline: -57px` |

No mockup has a sharp edge: it floats, framed by the fade. The
irregular values (-57px, -120px, 110%) are eyeballed crops on
each illustration — it's hand-tuned, not systematic.

### Header: the nav isn't centered [relevé]

`.TZTsQG_rightSideWrapper` (max-width 620px) groups **nav + rule + actions**
and hugs the right edge. The logo stays alone on the left. Between the nav and the actions,
a vertical rule of **only 16px** (`.TZTsQG_navDivider`, primary border,
8px margins) — not the full header height.

### Changelog timeline [relevé `Changelog.css`]

The page's cleverest technique:

```css
.changelogLine  { height: 1px; width: 100%; top: calc(32px / 2); }
.changelogIndicator { width: 32px; height: 32px;
  background: var(--color-bg-primary);   /* PAGE BACKGROUND color */
  transform: translateX(-12px); margin-bottom: 48px; }
```

A rule runs across the entire row; each dot is a **square opaque in the
background color**, which punches a hole in it. The visible point is a `::after`
of 6px surrounded by a `::before` halo of 20px at 20% opacity. **Only one
entry is colored** (red, halo at 10%): the "most recent" marker.

Grid 4 → 3 → 2 columns with a **64px** gap. And above all: the last
entry is `display:none` below 1280px, the second-to-last below 1024px — the grid
always stays full, content is removed rather than accepting an orphan
column.

### Quote cards: the veiled brand color [relevé]

Client cards are **the only colored spot on the entire page**. They
carry the quoted client's color, as an inline style. Three measured values:

```css
/* a FLAT WHITE VEIL at 40% stacked ON TOP of the brand gradient */
background:
  linear-gradient(0deg, rgba(255,255,255,.4) 0%, rgba(255,255,255,.4) 100%),
  linear-gradient(180deg, #b2d5ff 0%, #dfd1ff 100%);
background: #e4f222;   /* yellow-green */
background: #1C85E8;   /* blue */
```

The white veil is the technique to remember: it desaturates any
client color and brings it back into the same tonal range. This is what allows
very different brands to be displayed side by side without the page falling apart.

The text there switches to `--color-bg-primary`: a local theme inversion.

### "FIG" columns of the statement [relevé `Benefits.css`]

After the logos, a **two-tone** sentence in a single paragraph (first
sentence in primary text, the rest in tertiary — no other markup), then
three columns at a **fixed** height of 468px, content anchored at the bottom, separated by
a vertical rule, labeled `FIG 0.2` / `FIG 0.3` / `FIG 0.4` at the top
left at `opacity: .4`.

The first column loses its left padding, the last its rule: the
block sits **flush** with the grid instead of floating in it.

---

## 5. Layout techniques

### 5.1 Two independent margins [relevé]

```
--homepage-outer-padding : 46px → 10px (≤1280) → 28px (≤1024) → 16px (≤640)
--homepage-padding-inset : 32px → 8px (≤1024)
```

The **outer** margin (window edge) and the **inner** margin (grid
edge) are two distinct variables that don't change at the same breakpoints.
The outer margin **shrinks then grows back** between 1280 and 1024: the grid
resets, it doesn't compress linearly.

### 5.2 Grid 12 → 8 → 4 [relevé `Grid.css`]

Gutter **constant at 32px** at every size; only the number of
columns changes (12 / 8 / 4 at breakpoints 1024 / 768 / 640). The zones are
driven by `grid-template-areas` supplied as variables
(`--grid-areas-default / -laptop / -tablet / -mobile`): the structure changes
without touching the component's CSS.

### 5.3 Section header at 1fr / 1fr [relevé `PageSection.css`]

Title on the left, description on the right, **never a centered title**. Centering
is reserved for the pre-footer. `padding-bottom: 96px` below the header.

### 5.4 Fixed-height columns [relevé `Benefits.css`]

`height: 468px` (360px ≤1280), content anchored at the bottom via
`justify-content: flex-end`. The first column loses its left padding,
the last its right rule: the block sits **flush** with the grid instead of
floating in it. A detail that distinguishes a disciplined grid from a sloppy one.

### 5.5 Workshop labels [relevé]

`FIG 0.1`, `FIG 0.2` in monospace, `opacity: .4`, anchored at the top left of
each illustration. A technical-plate marker, never a title. A cheap
technique that establishes an "engineering document" register.

### 5.6 Ruled list [relevé `Pillar.css`]

Each entry carries a vertical rule of **28px** in `::before`, anchored at the
bottom. The `+` is permanently present at `opacity: 0; transform: scale(0)` and
unfolds on hover — **no node insertion**, hence no reflow.

### 5.7 Doublet separator [relevé `HomepageSeparator.css`]

1px of translucent border **plus** 1px black underneath. Two elements, not one.
Result: an edge, not a line. A single `border-top` doesn't have this relief.

### 5.8 Internal border instead of `border` [relevé `page.css`]

```css
box-shadow: inset 0 0 0 1px var(--bordure-primaire);
```

Doesn't eat into the box, doesn't shift the content, follows the `border-radius`.
Used everywhere a frame must be added without changing the metrics.

### 5.9 Fixed row height + truncation [relevé]

Rows at `44px`, labels in `white-space: nowrap; text-overflow: ellipsis`.
The row **cannot** grow. This is the condition for a dense list to
stay readable at a glance.

### 5.10 Guaranteed tap target [relevé `Layout.css`]

`min-height: 28px` on footer links, `--min-tap-size: 44px` declared as a
token. The clickable target is sized independently of the text.

---

## 6. Masking and light techniques

### 6.1 Dissolve toward the bottom [relevé `page.css`]

```css
mask-image: linear-gradient(to bottom, black 0%, black 60%, transparent 100%);
```

The product panel doesn't end: it dissolves into the background starting at
60% of its height. **No sharp cut exists on this page.**

### 6.2 Set of named masks [relevé `index.css`]

```
--mask-visible / --mask-on   : black
--mask-ease                  : #0003
--mask-invisible / --mask-off: transparent
```

Mask gradients are never written with literal colors. A
single set of tokens serves the panel, the marquee and the illustrations.

### 6.3 Hairline that follows the pointer [relevé `page.css`]

A solid 1px border, **masked** by a radial gradient centered on the
cursor: only the segment near the pointer is visible.

```css
border: 1px solid #383b3f;
mask-image: radial-gradient(ellipse 200px 200px at var(--x) var(--y),
  #000 0%, #0009 30%, #0003 50%, #0000 70%);
```

The JS only writes `--x` and `--y`. **No layout property is touched.**

### 6.4 Background halo as SVG data-URI [relevé `page.css`]

The large halo is **not** a `filter: blur()`: it's an inline SVG as a
data-URI containing a rectangle rotated 45° passed through
`feGaussianBlur stdDeviation="64"`, served as `background-image`. The blur is
computed once at rasterization; zero cost during scrolling.

> **[arbitrage]** This SVG's color is hardcoded (`#1C1D1E`). It therefore only
> exists **for the dark theme** — in light it repaints the panel black.
> It must be explicitly neutralized (`background-image: none`). General
> trap with data-URIs: they escape the token system.

### 6.5 Grain [relevé `Grain.css`]

256×256 tile, `opacity: .9` (or `.6` in the subtle version),
`mix-blend-mode: overlay`, plus a `#ffffff0f` sheet in `::after` — canceled
under WebKit via `@supports (-webkit-hyphens: none)`. The page's only
non-vector layer.

> **[arbitrage]** `Grain.css` declares **no `background-image`**: the
> texture comes from an external binary. The layer's mechanics are measured; the
> pattern I substitute (`feTurbulence`) is invented.

### 6.6 Header [relevé `Header.css`]

```css
background: linear-gradient(to bottom, var(--fond-entete) 0%,
            color-mix(in oklab, var(--fond-entete) 100%, transparent 5%) 100%);
backdrop-filter: blur(20px);
```

The background is already translucent **and** graded from 100% to
95% opacity, over a 20px blur. The blur is a token (`--header-blur`), not a
hardcoded value.

---

## 7. Buttons — architecture [relevé `Button.css`]

**A single class carries all the geometry; size and variant only
reassign variables.**

| Size | Height | Body | Padding | Icon |
|---|---|---|---|---|
| mini | 24px | 12px | `0 10px` | 12px |
| small | 32px | 13px | `0 12px` | 16px |
| medium | 40px | 13px | `0 14px` | 16px |
| default | 40px | 15px | `0 16px` | 18px |
| large | 44px | 16px | `0 20px` | 18px |

The variants (`primary`, `secondary`, `tertiary`, `invert`, `ghost`) only
redefine colors and shadows — never a metric.

Three details:
- `line-height` = button height: the text is centered without a fallback `flex`.
- The secondary variant has **no `border`**: 4 `box-shadow` (2 internal
  for the top hairline, 2 external) + `backdrop-filter: blur(4px)`.
- The built-in `<kbd>` keyboard shortcut disappears under `@media not (any-hover: hover)`.

---

## 8. What the reference doesn't reproduce

- **Rive: absent from the source.** Verified — no `.riv` file, no
  `@rive-app`, no `RiveComponent` in the HTML or in the 26 JS chunks. The
  only occurrences of the string "rive" are in `getDerivedState` and
  `onseArrived`. **All vector animations on this page are pure
  CSS** (dot matrix, sweep, reveal) **and inline SVG**. There is
  therefore nothing unreproducible on that front.
- **The 100 generated matrix keyframes** — reconstructed as 5 phases
  (§ 4.6).
- **Berkeley Mono** (proprietary typeface) — fallback `ui-monospace`.
- **The source's cursor tracking via `requestAnimationFrame`** — here a
  simple `pointermove`, sufficient for a reference.
- **The grain texture** (external binary) — § 6.5.
- **The 2-node separator** — merged into a stepped gradient on a single
  element. Same rendering, simplified technique, flagged in the CSS.
- The sections' SVG illustrations, replaced by the dot matrix.
- **The product panel's content** — see § 9.

## 9. Coverage

**All the source's sections are present, in its order** (§ 4 bis).
None is cut: the size cap that had made me remove blocks
has been lifted.

The JS lives in `motion.js` (196 lines, vanilla, no framework) and covers
7 behaviors: scroll reveal, halo and hairline following the pointer,
image-load fade, mobile menu, theme toggle, keyboard quote
carousel, chart bar rise. Each block carries the same
`[relevé]` / `[arbitrage]` markup as the CSS for its timing values.

## 10. Traceability check

Values marked `[relevé]` were checked via `grep -rF` on
`static.linear.app/web/_next/static/css/` + `linear.app/homepage.html`.
**74 values checked, 74 / 74 present.** Second batch (structure):
`linear-gradient(0deg, rgba(255, 255, 255, 0.4)`, `#e4f222`, `#1C85E8`,
`--changelog-indicator-size:32px`, `gap:64px`, `translate(-12px)`,
`mask-composite:intersect`, `TZTsQG_navDivider`, `height:16px;margin-inline:8px`,
`slashed-zero`, `height:468px`, `FIG 0.2`, `padding-inline:31px 24px`,
`grid-template-columns:1fr 320px`, `height:44px`, `width:432px`,
`height:480px`, `padding:12px 12px 0`, `text-indent:-.4em`, `scale(2.5)`,
`padding:20px 60px 28px 28px`, `brightness(1.25)`, `brightness(1.03)`,
`opacity:.2`.

First batch of 50 — colors (`#0b0b0bcc`, `#ffffff14`,
`#00000005`, `#0000001c`, `#00000017`, `#0000000f`, `#383b3f`, `#ffffff0f`),
shadows (`0px 8px 2px 0px #0000`, `inset 0 0 0 1px #ffffff08`), filters
(`brightness(115%)`, `brightness(98%)`, `brightness(1.4)`, `brightness(125%)`),
transforms (`scale(.97)`, `scale(.98)`, `rotateX(60deg)rotateY(3deg)`,
`perspective:1000px`), durations (`2800ms`, `1600ms`, `3200ms`, `2.1s step-end`,
`2.2s linear`, `.8s both`, `1.25s infinite`, `30s`), metrics (`height:468px`,
`height:184px`, `margin-block:224px`, `padding-block:96px 160px`,
`padding:24px 24px 16px`, `38ch`, `font-size:38px`, `--header-blur:20px`).

**Limit of the verification, to state clearly:** the source page cannot
be rendered from the local mirror — its Next.js bootstrap wipes out the
server markup offline, and a `sandbox` iframe render blocks CSS
loading. I worked around this by producing a copy with no `<script>` tags and with
CSS `href`s rewritten to absolute: this gives a full SSR render, which was used for
the side-by-side comparison. This render includes neither the JS-driven
illustrations nor the remote images — the comparison therefore covers the **skeleton, the
vertical rhythm, the hierarchy and the colors**, not the visuals.

Colors are written in the source's notation (hex with alpha) and not
converted to `rgba()`: the conversion introduces rounding and makes
verification impossible.
