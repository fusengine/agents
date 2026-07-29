# Linear — Design System

Register: **brand**. It is a marketing homepage, but its whole visual vocabulary is
borrowed from the product it sells, so every illustration is an application surface
rather than a graphic. Scope: FULL (single page, thirteen blocks).
Design Read: homepage of a product-development system sold to teams that also run
agents; vibe = technical document, cool grey, near-monochrome, dark by default;
constraints = 68 source stylesheets folded into one sheet, vanilla JS, a light theme
reachable by swapping a single attribute.
Dials: `DESIGN_VARIANCE 4` · `VISUAL_DENSITY 7` · `MOTION_INTENSITY 3`.

Tone (one extreme): **release-notes flatness — a homepage written like an internal
changelog.** Headings name an operation, never a feeling: "Make product operations
self-driving", "Review PRs and agent output", "Understand progress at scale". The
copy never addresses the reader as "you" in a heading, and never uses a number as a
hook — the single figure on the page is the customer count, and it appears in the
proof block, not in the hero [relevé].

Signature element: **the numbered section marker, set with a slashed zero.** Each
section carries `1.0` … `5.0` and lists its modules as `1.1`, `1.2`; the same
`font-feature-settings: "zero"` plus `lining-nums tabular-nums slashed-zero` runs on
issue references (`ENG-2085`), changelog dates, ruled sub-links and the customer
count. Without the numbering these are five generic marketing sections; with it the
page reads as the table of contents of a technical document. Its container counterpart
is the 22px-radius frame with `padding: 8px`, a translucent hairline and a bottom
`mask-image` — declared identically six times, once per illustration.

Macrostructure: **Numbered Surface Index.** Order: sticky header (72px, 20px blur) →
hero, which holds three things in one section — title, description and an announcement
pill, then the application window mockup, then the customer logo row → statement (one
two-tone paragraph plus three "FIG" columns with animated dot matrices) → 1.0 Intake
(issue list + Slack-style thread; sub-links 1.1–1.4) → 2.0 Plan (projects and
roadmap; 2.1–2.4) → 3.0 Build (agent command palette; 3.1–3.5) → 4.0 Diffs (PR review;
**no sub-links**) → 5.0 Monitor (two charts plus a weekly Pulse card; 5.1–5.3) →
Changelog (four entries on one horizontal rule) → Customer quotes (two brand-coloured
cards, a snap carousel below 1024px, and the "37,000 teams" line) → Pre-footer
(centred title, two buttons, `margin-block: 224px`) → Footer (6 columns, then a legal
row offset out of alignment). A double-rule separator sits between every numbered
section.

Against the canonical skeleton: this page largely **follows** it — nav, hero,
testimonials, CTA band and footer are all present and in canonical order. Two members
are missing outright: **no pricing** (it survives only as a nav link) and **no FAQ**.
Two things are non-canonical: the changelog timeline, and a hero that carries **no
button at all** — both calls to action live in the sticky header and the pre-footer,
so the hero holds nothing but the sentence and the product.

Principle of order: the five numbered sections follow the product's own workflow —
intake, plan, build, diffs, monitor — and an entry earns its number by having a
distinct application surface to show. Everything else brackets them: statement before,
proof after. The sub-link count is irregular by design (4, 4, 5, none, 3); content
sets it, not the grid.

## Design Reference

Source: https://linear.app/homepage [relevé].

The palette is drawn from the product's own theme file rather than from imagery: four
parallel ramps (background, text, border, line) of four steps each, plus one brand
indigo. A component picks one level per ramp and never a free value — which is what
makes a whole light theme possible through one attribute substitution.

### Colors

```css
--fond-primaire: #08090a;   --fond-niveau-1: #0f1011;
--fond-niveau-2: #141516;   --fond-niveau-3: #191a1b;
--bordure-primaire: #23252a;      --bordure-translucide-forte: #ffffff14;
--ligne-primaire: #37393a;        --fond-translucide: #ffffff0d;
--texte-primaire: #f7f8f8;        --texte-secondaire: #d0d6e0;
--texte-tertiaire: #8a8f98;       --texte-quaternaire: #62666d;
--marque-fond: #5e6ad2;           /* light theme: #7070ff */
--accent: #7170ff;                --accent-survol: #828fff;
--accent-bleu: #4ea7fc;  --accent-rouge: #eb5757;  --accent-vert: #27a644;
--accent-orange: #fc7840; --accent-jaune: #f0bf00; --accent-cyan: #00b8cc;
--ombre-empilee: 0px 8px 2px 0px #0000, 0px 5px 2px 0px #00000003,
  0px 3px 2px 0px #0000000a, 0px 1px 1px 0px #00000012, 0px 0px 1px 0px #00000014;
```

Strategy: **two-tone cool.** No colour carries decorative meaning. The greys are not
neutral — the blue channel is always ≥ the red one, on every step of every ramp — and
the six absolute accents are reserved for system states and label dots. Hover never
changes hue, it changes brightness (`filter: brightness(115%)` on buttons, `1.3` on
links), which is why the sheet holds no hover colour tokens at all. Depth is stacked,
not deep: five shadows of 0–8px, each invisible alone, with a sixth inset layer added
in the light theme because a drop shadow stops detaching anything on white. The brand
colour itself is swapped between themes (`#5e6ad2` → `#7070ff`): it is a different
colour, more saturated, chosen to hold on white [relevé].

Contrast floors held: `--texte-primaire` ≈18.7:1 on `--fond-primaire`, secondary
≈13.6:1, tertiary ≈6.1:1. `--texte-quaternaire` is ≈3.4:1 and is confined to icons,
micro dates and priority glyphs — never body copy.

### Typography

```css
--police-texte: "Inter", "Inter Variable", "SF Pro Display", -apple-system, …
--police-mono:  ui-monospace, "SF Mono", Menlo, monospace;
```

One family for the whole page. Inter is expected from the system or a local install,
not fetched from a CDN; the source's Berkeley Mono is proprietary and falls back to a
system mono stack here [relevé]. `font-feature-settings: "cv01", "ss03"` is set on
`html, body` — it redraws the `a` and the numerals, and is most of what makes the text
recognisable without changing the face.

Weights are non-round: 300 / 400 / **510** / **590** / **680**, exploiting the variable
axis; the standard title weight is 590. Scale (rem): 1.0625 · 1.25 · 1.5 · 2 · 2.5 ·
3 · 3.5 · 4 · 4.5, not a geometric ratio — chosen steps with a constant 0.5rem jump
from title 5 up. Hero at title 9 (72px), section titles at title 7 (56px). Below
640px **every large title falls to a literal 38px**; there is no `clamp()` in the
source. Line-height falls as size rises: 1.6 on body, 1.0 at title 9. Letter-spacing
is negative throughout — −0.012em up to 1.5rem, −0.022em above, and −0.011em on body
copy, which is the counterintuitive one and the one that matters. Measure is set in
`ch`: 38ch on section descriptions, 18ch on the pre-footer title.

Never used: no serif, no second family, no display face, no webfont request.

### Spacing

A 4px-based literal scale: 4 / 6 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 40 / 48 / 96 /
128 / 160 / 224. Grid 12 → 8 → 4 columns with a **constant** 32px gutter. Two
independent page margins that deliberately do not move at the same breakpoints: outer
46 → 10 → 28 → 16px, inner 32 → 8px — the grid re-seats rather than compressing
linearly. Tap-target floor 44px. Density profile is split: dense inside the mockups
(56px palette rows, 28px logo row, 16px icons, truncation everywhere) and generous
between them (sections at `padding-block: 128px`, section header at 96px, pre-footer
at `margin-block: 224px`). Whitespace does the emphasis; nothing is emphasised by size.

### Motion

`MOTION_INTENSITY 3`. Amplitudes are deliberately tiny — `translateY(4px)` on entry,
`scale(.97)` on press, brightness on hover. Nothing moves; everything settles. Four
named speeds, one of them asymmetric on purpose: highlight-in `0s` against
highlight-out `.15s` (a highlight appears instantly and fades slowly), plus quick
`.1s`, regular `.25s`, and the literals `.16s` hover / `.18s` menu / `.4s` reveal.
Eighteen curves are declared and **not one bounces**. Edges are never cut: anything
leaving a frame dissolves through `mask-image`.

Entrances differ by role: the general reveal is a `.4s` ease-out-quart fade plus a 4px
rise, staggered 60ms through a `--rang` custom property and triggered by
`IntersectionObserver`; the bar chart instead raises its two segments from `0%` with a
40ms sweep, reading its final heights from the inline style so the rest state stays
what the HTML says. Two texts use a clipped swept gradient, both greyscale.

`prefers-reduced-motion` is met two ways, matching the source: the marquee is declared
**only** inside `@media (prefers-reduced-motion: no-preference)`, so it does not exist
otherwise, while the dot matrix and the caret get `animation: none` — safe because
those keyframes have no `100%` marker and rest in their final state. The JS reads the
same query and drops the chart animation, the smooth carousel scroll and the menu
close delay. `html.js` guards every rule whose start state is invisible, so a page
without script hides nothing.

## Absolute bans observed

No bounce or elastic curve, in eighteen declared. No hue change on hover, ever. No
multi-hue gradient text: the two clipped-text gradients sweep between two grey roles
only. No glassmorphism outside the header. No coloured border marks a state — state is
a translucent white fill. No pricing table, no FAQ accordion, no emoji. No illustration
that is not an application surface: there is no decorative art on the page.
