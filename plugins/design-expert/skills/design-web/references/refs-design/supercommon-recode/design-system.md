# Supercommon — Design System

Register: **brand**. The page sells one macOS app at one price; there is no logged-in
surface, no data to make legible, and the composition itself is the argument. Scope:
FULL (single page, one buy button).
Design Read: product page for a two-mode focus timer; vibe = black, hairline-thin,
lowercase, deadpan technical; assets = four remote media files plus nine vector
pictograms inlined in the document; constraints = static HTML/CSS/JS, opens on
`file://`, and only two viewports are ever drawn (1440 and 390).
Dials: `DESIGN_VARIANCE 7` · `VISUAL_DENSITY 2` · `MOTION_INTENSITY 4`.

Tone (one extreme): **instrument-manual flat.** Every visible string is lowercase
except `macOS`, and each one reads like a spec line rather than a claim. The copy
never uses an imperative on the reader, never states a benefit it cannot count, and
never raises its voice — no exclamation, no superlative, no question headline.

Signature element: **the solitary display line.** One centered lowercase line, 56/60,
weight 200, tracking `-.06em`, `#eee`, standing alone between two voids. It is the
only element that ever changes size, and it opens the page and then every band after
it. It reappears twice as itself split in two: `stillness.` / `motion.` set left and
right over the square image at opacity `1` against `.5`, which is the whole opacity
scale said in two words. On a page with no local asset, this line is the composition.

Macrostructure: **Void-Metered Stack** (not the canonical nav/hero/features/
testimonials/pricing/faq/cta/footer skeleton). Order, read on `index.html`, where six
consecutive sections share the same `band` class and are told apart only by content:
utility bar (contact · wordmark · manual) → title band, which holds the kicker row,
the `<h1>` **and** the hero in one metallic-gradient container → manifesto band, one
title and one 1120 px paragraph, no visual → duo, full-bleed square image with two
words laid on it → two-modes band, eyebrow, wide title, looping video → notch band,
title, three-way segmented control, contextual screenshot → capabilities band, title
and ten flat entries → grid band, title and nine pictogram cells → exit band, a single
wide button → footer (contact/manual · wordmark · terms/policy/©).
Dropped outright: testimonials, pricing table (the price is inline on one button), FAQ,
CTA band (the exit is one link, with no headline or sub above it), and any nav — the
top bar carries two utility links and a wordmark, no menu and no burger at any width.
Features appear twice and neither is a card grid: capabilities is unstyled centered
text with no icon and no rule, and the 3×3 grid has no surface, border or background.
Organizing principle: each band states exactly one thing, and the void in front of it
is sized to that thing — the two largest silences, 32vh and 40vh, announce the
manifesto and the feature grid, the two blocks the page most wants read.

## Design Reference

Rebuild of the supercommon systems product page (`resources.supercommon.systems`
serves its video `[relevé]`; the marketing host is `supercommon.systems` `[estimé]`).
The source is a Framer export. The palette is not sampled from an image: it is a black
page plus one accent lifted from the app's own display, and all remaining hierarchy is
opacity.

### Colors

```css
--surface-page:      #000;
--surface-inversee:  #fff;
--surface-controle:  rgb(24, 25, 28);
--texte-primaire:    #eee;
--texte-accentue:    #fff;
--texte-secondaire:  #888;
--texte-liste:       rgb(128, 128, 128);
--texte-sur-inverse: #000;
--trait-discret:     rgb(34, 34, 34);
--accent:            rgb(224, 59, 30);
--attenuation-moyenne: .5;
--attenuation-forte:   .25;
--metal: linear-gradient(#000 19%, #1f2021 35%, #525755 50%, #bfc6c1 75%, #000 90%);
```

Strategy: **dimming, not palette.** There are three opacity notches — `1`, `.5`, `.25`
— and nothing between them; the page has no intermediate grey between `#808080` and
`#222`, no semantic colour, no card surface and no shadow. `--accent` never marks a
state: no red link, no red button, no red hover. It designates one object, the app's
display, in exactly two places. All other colour on the page lives inside the nine
pictograms, where it is the information rather than decoration.
Contrast floors: `#eee` on `#000` ≈ 17.9:1 `[estimé]`; `#888` ≈ 5.9:1 and
`rgb(128,128,128)` ≈ 5.3:1 `[estimé]`; `#eee` at `.5` ≈ 4.7:1 `[estimé]`. The `.25`
notch, used once for the screenshot caption, lands near 1.9:1 `[estimé]` — recorded as
the source has it, not corrected.

### Typography

```css
--police: Inter, "Helvetica Neue", Arial, sans-serif;
--graisse-fine:  200;
--graisse-texte: 300;
```

One family, loaded from the Google Fonts CDN at weights 100/200/300/400, substituting
the source's commercial Akt Variable Thin and Akt Light. Six steps, all `[relevé]`,
switched at one breakpoint (`max-width: 1439.98px`), never fluid: display 56/60 → 37/42,
title 30/36 → 26/32, lede 32/40 → 28/34, kicker 26/26 → 24/26, label 20/24 → 19/24,
body 18/22 → 17/22. Tracking is inversely correlated to size, `-.06em` at 56 px down to
`-.01em` at 18 px. The kicker's line-height equals its font size, which lets a
one-line label sit flush against its neighbours. Measure: the lede is capped at
1120 px, wide for 32 px text and recorded as such; the feature grid at 800 px.
Because the page carries no local asset, **title length is a layout value**: the source
ships the "two modes" headline twice, hard-broken into three lines above 1440 px and as
one self-wrapping string below, and the recode keeps the source's `stilness` typo
because changing it would change the line break. Paraphrasing any headline here moves
the whole page.
Never used: any second family, serif, monospace, italic, small caps or uppercase.
Weights above 400 are never loaded, and `strong { font-weight: inherit }` deliberately
neutralises bold — the source's own preset sets bold to the same value as normal.

### Spacing

There is no 8pt grid on the vertical axis. All rhythm comes from sixteen empty blocks
measured in `vh`, `[relevé]`: 6 · 7 · 32 · 8 · 5 · 25/1 · 4/1 · 1 · 6 · 5 · 15 · 12 ·
15/12 · 40 · 15/8 · 15 — roughly 200 vh of black, two full screens of it, and the
second figure in each pair is the value below 1440 px, where the long silences are cut
because they cost thumb-scrolls. Horizontal is fixed: 40 px edge margin (20 px below
1440), grid gutters `80px 40px` collapsing to a single column, 80 px between the grid
and what follows, 20 px between a cell's icon box and its text and 10 px between the
title and its description. One pixel padding exists in the whole page: 64 px under the
notch band. Density profile: extremely sparse vertically, tight typographically.

### Motion

`MOTION_INTENSITY 4`. The source ships no `@keyframes`, no `transition` and no
`animation-timeline` — all of its motion runs in the Framer runtime — so every duration
and curve here is a reconstruction: three durations (180 / 420 / 900 ms), two curves
(`cubic-bezier(.2,.8,.25,1)` for what enters, `cubic-bezier(.4,0,.2,1)` for what
toggles), one 60 ms cascade step, and no one-off time value anywhere else. Materials
are `opacity` and `transform` only; the segmented thumb moves by `transform`, never by
`left` or `width` alone. Entrances are not one blanket rule: a simple block animates
itself, while a `[data-stagger]` container never animates — its children do, each
delayed by its own `--i`. Beyond entrances the page animates a video play/pause on
intersection, a 1 s `steps(1, end)` opacity pulse on the `00:25:00` pictogram, and a
1 px accent reading gauge driven by a rAF-throttled passive scroll listener.
`prefers-reduced-motion: reduce` is honoured without exception and at two levels: CSS
drops durations to 1 ms and forces final states, and JS installs no observer at all.
The contract that makes this safe is that the `opacity: 0` resting state is only armed
by the `.js-motion` class JS adds — without JS, without `IntersectionObserver`, or
under `reduce`, the CSS hides nothing. The preference is also listened to live, so a
mid-session change reveals every still-hidden block behind the reader.

## Absolute bans observed

No border on any content block. No card, no shadow, no separator or rule between
sections — transitions between them are manufactured by gradients to black, and no
image on the page has a visible bottom edge. No `backdrop-filter` anywhere, so no
glassmorphism at all. No bold, no uppercase, no italic. No icon and no bullet-rule in
the capabilities list, whose two lines share preset, weight and colour so that the
list can be present without becoming an entry point. No semantic colour, no coloured
state, no red interactive element. No gradient text. No modal. No burger menu. No hero
metric row. No tablet tier — the page jumps from three columns to one.
