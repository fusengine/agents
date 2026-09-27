# Reve — Design System

Register: **brand**. The page is marketing (`<title>` "Reve Image - Model"), but it
consumes the product app's token file whole, so the surface language is `product`
and only the layout is brand. Scope: FULL (single page, twelve blocks).
Design Read: capability page for a 4K image model; vibe = neutral, photographic,
near-chromeless, the interface stepping out of the way of the picture; constraints =
one inline `<style>` block, 0 `@keyframes`, all behaviour in two JS files.
Dials: `DESIGN_VARIANCE 5` · `VISUAL_DENSITY 2` · `MOTION_INTENSITY 3`.

Tone (one extreme): **imperative caption.** Every heading is a command the tool
obeys — "Directly edit anything", "Draw what you want to see", "Reshoot and change
your layout". The copy never argues, never explains a mechanism, never names an
internal feature. It carries no metric, no customer voice, no dated claim; the only
superlative on the page is "the best 4K image model" in the hero subtitle [measured].

Signature element: **the twin-size heading pair.** Title and subtitle share family,
weight and size; only the colour role separates them (`--text-primary` against
`--text-tertiary`). The source's own comment calls it the page's typographic
signature. It runs at `--size-4xl` in the hero, at a literal 28px in all seven
sections, and collapses to 24px under 1024px — the same device at three scales,
never a smaller subtitle. Its layout counterpart is the panel that bleeds off one
edge: every feature frame pulls `calc(-1 * var(--rail))` into the margin.

Macrostructure: **Verb Reel.** Order: fixed header + two-layer progressive veil →
sticky hero (twin heading, two actions, 13-card drifting strip) → 1 Edit (live-embed
slot, panel left) → 2 Annotate (mirror, panel right) → 3 Reference (selectable card
grid driving one preview) → 4 Templates (centred head, two-pane mock editor, prev/next)
→ 5 Effects (second embed slot, panel right) → 6 Layers (panel left) → 7 Reframe
(panel right) → Composer ("What will you make?", a working textarea) → Gallery (second
drifting strip) → Footer (3 link columns, shortcuts, bottom row).

Absent from the canonical skeleton: **no feature grid** — each capability takes a
whole screen instead of a card; **no testimonials**, **no pricing**, **no FAQ**, **no
logo wall**, **no metrics band**, and **no closing CTA band** — the page ends on an
input field, handing the tool over rather than pitching it. Of the canon only nav,
hero and footer survive; the call to action is instead repeated inline, once or twice,
inside every section.

Principle of order: one editing verb per screen, panel side alternating left/right,
with the two non-mirrored formats (card grid, template demo) inserted at positions 3
and 4 so the mirror rhythm never runs more than twice unbroken.

## Design Reference

Source: https://app.reve.com/ — page "Reve Image - Model" [measured].

The palette is not sampled from imagery. It is lifted intact from the editor's own
token file — neutral ramp, a separate alpha ramp, a blue accent — so the marketing
page and the application are one surface.

### Colors

```css
--ramp-neutral-0:    light-dark(#fff,     #000);
--ramp-neutral-50:   light-dark(#fafafa,  #1a1a1a);
--ramp-neutral-100:  light-dark(#f0f0f0,  #2e2e2e);
--ramp-neutral-500:  light-dark(#757575,  #707070);
--ramp-neutral-900:  light-dark(#1a1a1a,  #ebebeb);
--ramp-alpha-800:    light-dark(#0006,     #fff6);
--ramp-alpha-850:    light-dark(#0000008a, #ffffff8a);
--ramp-alpha-1000:   light-dark(#000,      #fff);
--text-primary:      var(--ramp-alpha-1000);
--text-secondary:    var(--ramp-alpha-850);
--text-tertiary:     var(--ramp-alpha-800);
--surface-page:      var(--ramp-neutral-50);
--surface-panel:     light-dark(var(--ramp-neutral-0), var(--ramp-neutral-50));
--blue-600:          light-dark(#2463eb, #4c9dff);
--fixed-white: #fff;  --fixed-black: #000;
```

Strategy: **achromatic.** Two ramps carry the whole page — one opaque for surfaces,
one alpha for text, so type sits on any surface without a matching grey. Blue is
declared across eleven steps and instantiated exactly once, in the focus ring; the
page has no accent. The page ground is `neutral-50`, never white: white is reserved
for panels laid on top, and that is where separation comes from, not from a shadow.
Two colours escape the bi-theme system entirely (`--fixed-white`, `--fixed-black`) and
keep the template card white in dark mode [measured].

Contrast floors held: primary text is full black or white (≈20:1 on the page ground);
`--text-secondary` at 54% alpha lands ≈4.5:1. `--text-tertiary` is `#0006` — on
`neutral-50` that is ≈2.8:1, below the 3:1 large-text floor; it is only ever applied at
28px or larger. Recorded as-is [measured], not corrected.

### Typography

```css
--font-text:  "ReveUI", Arial, ui-sans-serif, sans-serif, var(--font-emoji);
--font-title: "ReveDisplay", system-ui, var(--font-emoji);
--font-mono:  "ReveSansMono", ui-monospace, monospace, var(--font-emoji);
```

Four `@font-face` rules, woff2 served remotely from `app.reve.com/assets`, each with
the same `unicode-range` so an out-of-range glyph never triggers a download.
ReveDisplay ships as **two files split by weight** (500–900 and 100–400), not one
variable file: a 500 title and a 400 subtitle pull different binaries [measured]. Note
the fallback order — `Arial` before `ui-sans-serif`, a metrically close substitute
preferred over the OS face.

Scale: 12 / 14 / 16 / 18 / 20 / 24 / 32 / 40px, with section headings at a literal
28px outside it. Weights 400 / 500 / 700, where "semibold" is 500. Line-heights
1.2 / 1.4 / 1.5 / 2. Letter-spacing is **positive and grows with size** (+0.01em to
+0.018em on display, ~0 on body) — the inverse of the usual convention. Measure: 34ch
on the hero subtitle, 52ch on section subtitles; body text is otherwise unbounded.

Never used: the serif token is declared and never instantiated. No Inter, no Roboto,
no system-first stack.

### Spacing

One primitive: `--rhythm: 8px`. Every space, control height, radius, panel width and
icon size is a `calc()` on it — 2 / 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48. No
literal px in the scale, so changing one value rescales the page. The gutter is not a
centred container but a slope: `clamp(32px, calc(.42 * 100vw - 398px), 200px)`, flat
to ~1024px then opening to 200px; text width is never capped by a wrapper. Density
profile: very low — one capability per `104svh`, the extra 4% chosen so the next
section always shows above the fold.

### Motion

`MOTION_INTENSITY 3`. The source declares **0 `@keyframes`**, 4 transitions and 1
`:hover` rule; no layout property is ever animated, and none of the four transitions
carries a curve despite seven named curves being declared (including a 20-point
`linear()` spring). There is **no scroll reveal anywhere** — nothing fades in as you
descend. Motion is state-driven only: the hero video fades up over 150ms when frames
are proven to be rendering (not when play is requested), the reference swap crossfades
two stacked layers after `decode()` at 200ms, the template arrows cycle three visuals
in lockstep, and both strips drift continuously and are grabbable. The header veil
never toggles its blur — three stacked layers stay mounted so their backdrops never
re-rasterize; only the much cheaper tint fades in past the fold.

`prefers-reduced-motion: reduce` is handled at the **token** level: the five duration
tokens are set to `0s`, so every transition that consumes one dies at once, including
rules written later. The JS reads the same query and stops the drift, no-ops the video
hover, and drops the crossfade delay to zero.

## Absolute bans observed

No scroll-reveal and no `@keyframes`. No accent colour: nothing on the page is
coloured to attract. No border marks selection — the active reference card is signalled
by surface plus a low shadow only. No card grid of features. No glassmorphism outside
the header veil. No status label takes the accent; the `Beta` tag stays on `neutral-500`.
No modal. No metric, no logo wall, no closing CTA band.
