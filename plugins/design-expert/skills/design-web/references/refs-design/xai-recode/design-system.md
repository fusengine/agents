# xAI — Design System

Register: **brand**. It is a company homepage whose job is to make a model family
credible and route the reader to an API key; nothing on it is a working surface, and
the density is presentational, not operational. Scope: FULL (single page, light and
dark).
Design Read: frontier-AI homepage; vibe = light, near-monochrome, engineered, dense
without noise; assets = four thumbnails in the news row and nothing else, every other
visual drawn in HTML/CSS; constraints = static rebuild that opens on `file://`, the
source's remote visuals return 403 off-domain, and the whole page is five sections.
Dials: `DESIGN_VARIANCE 4` · `VISUAL_DENSITY 7` · `MOTION_INTENSITY 3`.

Tone (one extreme): **datasheet confidence.** Every string is either a capability or a
counted figure — `1M+ API calls per day`, `<200ms median latency`, `150K GPUs`. The
copy never promises, never uses a superlative it has not measured, never asks the
reader a question, and never speaks in the first person plural about a mission it then
fails to quantify.

Signature element: **the self-drawn interface.** The page's one recurring visual is a
working UI built entirely from markup: a five-bubble conversation, a terminal with a
three-dot bar and eight lines of coloured output, a 3×2 mosaic, an animated waveform,
and — full size, one section later — a code window. It carries the hero as four bento
cards, then returns as the right-hand column of the developer section. Everything else
on the page is type, a hairline, or a CSS-drawn grid pattern. This is what stands in
for photography, and it is why the page can hold with four images in the entire flow.

Macrostructure: **Bento Absorption** — the canonical feature grid is pulled up *into*
the hero rather than following it, which is what leaves only five sections. Order, read
on `index.html`: fixed header with a blurred veil and a hairline revealed on scroll →
hero, which is a `<div>` and not a `<section>`, holding the announcement pill, the
per-word `<h1>`, the overflowing subtitle, two buttons **and** the four-card bento →
developer section, a two-column duo of text/mini-stats against the code window →
numbers banner, three counted figures over a CSS grid pattern → news, the only images
in the flow at `1200/630` → offerings, two panels of capabilities under a centred
title → footer, a 280 px brand column, a dashed vertical rule and nine categories laid
across five columns in two uneven rows.
Absent from the canon: testimonials, pricing (the offerings panels list capabilities
and carry no figure), FAQ, logo wall, and any standalone CTA band — the two asks live
inside the offer panels and nowhere else. Added outside the canon: a numbers banner and
a news feed, neither of which the skeleton has a slot for.
Organizing principle: the page shows before it tells. Demonstration comes first and is
folded into the hero, so everything after it reads as evidence — an interface, a scale,
a record — and the only ask is the last thing on the page.

## Design Reference

Rebuild of `https://x.ai`, measured on a local render of the captured snapshot (its
three stylesheets and its Universal Sans files were present; no JS was).
The palette is not sampled from imagery — there is almost none. It is one ink at
thirteen alpha tiers, a tinted neutral ramp, and a single warm accent that never moves.

### Colors

```css
--p-jet:      0 0% 4%;             --p-charbon: 0 0% 10%;
--p-ombre:    221 12% 14%;         --p-brume:   216 4% 51%;
--p-colombe:  222 19% 86%;         --p-nimbe:   228 21.74% 95.49%;
--p-ivoire:   40 18% 97%;          --p-blanc:   0 0% 100%;
--p-couchant: 22 100% 51.6%;       --p-aube:    37 100% 76%;

--primaire:     var(--p-jet);      /* dark: --p-blanc    */
--premier-plan: var(--p-jet);      /* dark: --p-colombe  */
--fond:         var(--p-blanc);    /* dark: --p-jet      */
--carte:        var(--p-ivoire);   /* dark: --p-charbon  */
--bordure:      var(--p-colombe);  /* dark: --p-ombre    */
--accent:       var(--p-couchant); /* dark: unchanged    */
```

Strategy: **single-ink laddering.** Colours are stored as function-less HSL triplets so
alpha is composed at the point of use (`hsl(var(--primaire) / .5)`), and the whole
hierarchy is thirteen alpha tiers of one ink rather than a grey palette. Two tiers
carry the page: 50% is the resting state of every interactive element (74 nodes) and
100% is its hovered state (91 nodes) — the site's dominant gesture is the move between
them, 55 times over. The accent appears in three places only (syntax highlighting, the
three window dots, the announcement badge) and does not switch with the theme.
Neutrals are tinted blue, 12–19% saturation; only the extremes are desaturated.
`--primary` and `--foreground` are two distinct roles that coincide only in light mode,
so dark-mode body text is dove, not white.
Contrast floors: body ink on white ≈ 19:1 `[estimé]`. Below that the page runs under
the usual floor and does so deliberately — the 50% resting tier lands near 3.7:1, the
hero subtitle at 45% near 3.1:1, metadata at 40% near 2.7:1 `[estimé]`, all recovered
to full ink on hover or focus. Recorded as the source has them.

### Typography

```css
--f-texte:   "Geist", "Repli texte", system-ui, sans-serif;
--f-display: "Geist", "Repli display", system-ui, sans-serif;
--f-mono:    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

Geist and Geist Mono from the Google Fonts CDN; the source's display and text faces are
Universal Sans, proprietary. What survives the substitution intact is the source's
**metrics-corrected fallback** — `local(Arial)` re-declared with `ascent-override`
89.92%, `descent-override` 22.73% and `size-adjust` 105.67% for text, 97.8% for
display — so a fallback never shifts the layout. Scale, `[relevé]` as used: one single
running-text size, `.875rem` on 106 nodes, then a jump straight to `1.5rem`, `1.875rem`,
`2.25rem`, `3rem`, `3.75rem`. Nothing gradual in between; the fine hierarchy is opacity,
not size. One weight, `font-medium`, on 101 nodes against two at semibold. Line-heights
are the point most easily missed: the body's real line-height is `leading-relaxed`
1.625, set on 53 nodes, not the 1.25rem that ships with `.text-sm`; titles run at 1.05
and publication titles at 1.375. Measure: the `<h1>` sits in a 42 rem frame and fits in
exactly two lines — a longer label pushes it to four and moves the whole page — while
the subtitle deliberately overflows that frame, 941 px inside a 672 px parent, to stay
on one line. Section titles come in two sizes that must not be merged, the majority
`1.5rem/1.875rem` and one single `2.25rem/3rem` whose second line drops to `--secondary`
so that the hierarchy happens inside the title rather than beneath it.
Never used: serif, italic, uppercase, and any second weight for emphasis.

### Spacing

A rem grid throughout: sections at `4rem` block padding rising to `6rem` above 640 px,
container `1rem` inline padding → `1.5rem` at 1024 px → capped at `80rem` at 1280 px.
The bento is `.75rem` gutters, the developer duo `3rem` rising to `6rem`, the offerings
list and footer columns on the same scale. Radius is a two-value system: `.5rem` as the
token, `1rem` on every card, `9999px` on every button, pill and badge. One block breaks
the rhythm on purpose — the numbers banner runs `5rem / 7rem / 9rem` where every other
section runs `4rem / 6rem`, and it is the page's only rhythm departure. Density profile:
dense, but the density is inside the mockups; the page frame itself stays airy.

### Motion

`MOTION_INTENSITY 3`. 182 transition triggers, and 73% of them move nothing — they
change a colour. The page feels alive while almost nothing plays, because everything is
a state transition between two stable values rather than a played animation, which
leaves the tempo to the reader. Five duration tiers, and the rule behind them is that
**the bigger the element, the slower it is**: 150 ms for controls, 200 ms for the header
hairline, 300 ms for labels inside a hovered surface, 500 ms for the surface itself
(border, shadow, the `scale(1.02)` on the whole mockup), 700 ms for the reflection
sweeping across a card. Hovering one card fires all three at once and the perceived
stagger comes from that hierarchy alone — there is no `delay` anywhere. Two curves for
the entire page: `cubic-bezier(.4,0,.2,1)` for colour and state, `cubic-bezier(0,0,.2,1)`
for anything that moves or scales. Exactly one animation plays on load: a 3 s linear
sweep, once, across the 3 px rainbow underline of the hero's last word.
Entrances are differentiated: hero words rise from `translateY(45%) rotateX(-40deg)`
at a 55 ms step, secondary blocks from a flat `translateY(16px)` at 80 ms, and nothing
else enters at all. `prefers-reduced-motion: reduce` forces final states rather than
merely cutting durations — words, blocks and the underline are pinned visible, the
waveform is drawn frozen and legible, the grid sweep is never created, and JS reads
`matchMedia` itself for scroll behaviour because the scroll APIs ignore the preference.
`animation-timeline: view()` was available and dropped: not Baseline, and a keyframe
starting at `opacity: 0` fails into a permanently blank page.

## Absolute bans observed

No animation library of any kind. No bounce, no elastic, no `linear()`, no
per-component curve. No image in the hero, the bento, the code block, the numbers
banner, the offerings or the footer — the four in the news row are the entire
photographic budget. No border on the code window: a `box-shadow` spread stands in for
the hairline so it stays out of the box calculation. No gradient text. No glassmorphism
as a style — `backdrop-filter` appears in four bounded places (the header veil, the
announcement pill, the chat bubbles, and the four-layer progressive blur that detaches
a card's footer) and nowhere as decoration. No accent used to decorate: colour
classifies only inside the terminal, where seven hues rank log lines. No second
running-text size, no bold as emphasis, no modal, no carousel, no counter that keeps
counting.
