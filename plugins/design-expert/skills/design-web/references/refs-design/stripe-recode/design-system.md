# Solvo — Design System

Register: **brand** — the home page of a payments infrastructure, whose job is conversion
and demonstration at once: seven product mockups, four customer cases, eighteen figures,
two carousels, one accordion. It argues by showing the interface, never by describing it.
Scope: FULL (single page, header to footer).
Design Read: faithful reproduction of `stripe.com/fr` under an invented brand;
vibe = dense, colourful, technical, every assertion backed by a screen;
constraints = static HTML/CSS/JS, four local photographs, light theme locked
with a mid-page dark block relevé on the source, desktop + mobile.
Dials: `DESIGN_VARIANCE 6` · `VISUAL_DENSITY 9` · `MOTION_INTENSITY 6`.

Tone (one extreme): **avowed technical catalogue.** Every block is a pair — "short
assertion in black + continuation of the sentence in grey" — laid over a product screen
drawn in HTML. The page asks no question, promises nothing in the future tense, and puts
a figure on everything it can: 128+, 1,4 Bn $US, 99,999 %, 180 M+, 440 M+, 9 k+,
130 k+, 152 pays, 640 points de vente. No em dash in any visible string
[relevé on the source, reproduced].

Signature element: **the fan of seven ribbons.** The hero's gradient is neither an image
nor a canvas: seven very elongated ellipses (`border-radius: 50%`), rotated from -46° to
-99° around one shared anchor point outside the frame, blurred from 30 to 54px, and masked
by a `radial-gradient` centred top right. The rule that governs them is relevé on the
source: **the saturated part stays to the right of the text column**, only a pale tail
passes behind the headline. Second-order signature: the seven product mockups in the bento,
**entirely in HTML/CSS**, not one screenshot.

Macrostructure: **Cascading Demonstration.** Order relevé on `index.html`:

- `header.entete` — logo, five entries, two actions; **sticky**, shadow on scroll
- `section.heros` — counting numeric eyebrow, h1 in two tints, two actions;
  seven gradient ribbons behind them, masked and animated in `scale`; two vertical rules
  mark the container and run on under the logo band
- `section.logos` — a band of seven brand marks between two rules, 88px
- `section.suite` — a six-tile bento on six columns: the major tile takes
  4 × 2, billing 2 × 2, three square tiles, one full-width tile
- `section.promo` — full-width card on a striped gradient, one title, one action
- `section.pilier` — centred title, a band of four figures, a 46-ray CSS burst
- `section.tailles` — a single title/subtitle pair, breathing room before the accordion
- `section.entreprises` — title-action / paragraph duo, then an accordion of four customer
  cases, each with a photograph, two figures, the product list, a link
- `section.experts` — one title, three icon columns
- `section.startups` — duo, then a horizontal rail of seven cards scrolled by steps
- `section.promos` — two promotional cards on a solid geometric shape
- `section.plateformes` — duo, a gradient panel carrying a dashboard and four
  floating code bubbles, then three icon columns
- `section.temoignage` — centred rotating quote, four tabs with a progress bar
- `section.infra` — **dark block**, title, two actions, three sub-blocks: orchestration
  diagram, a wave plus three figures in gradient, three thumbnails
- `section.actus` — foldable blades, the open blade taking 56 % of the width
- `section.livre` — two-column panel, cover drawn in CSS
- `section.cloture` — three-column CTA
- `footer.pied` — four columns with sub-groups, bottom bar

Absent from the canonical skeleton: **no pricing grid**, no comparison table, no FAQ, no
newsletter sign-up form, no trust bar under the hero. Present but mutated: customer proof
exists four times over, in four different geometries (accordion, rail, quote, brand band),
so the page has no "testimonials" section.

Principle: the order follows the **size of the company being addressed**, not the argument:
everyone (bento), then large enterprises, then startups, then platforms, then developers
(the dark block), then the brand itself (news, book). Each rung re-arms with the same
template: title-action / paragraph duo, one visual piece, three icon columns.

## Design Reference

Source: https://stripe.com/fr (Next.js, compiled `mkt-ssr-statics` sheets, `--hds-*`
tokens).

**The palette is KEPT, unlike the four other references added at the same time**
(`mosa-recode`, `stash-recode`, `parley-recode`, `dispatch-recode`), which change theirs.
Explicit decision by the owner: the source's multi-hue gradient system is precisely what
this reference brings to the corpus, and it does not survive a substitution of hues. Every
value below is therefore relevé, not chosen.

### Colors

```css
--brand-600: #533afd;  /* action, releve on --hds-color-core-brand-600 */
--brand-700: #4032c8;  --brand-500: #665efd;  --brand-400: #7f7dfc;
--brand-50:  #e8e9ff;  --brand-25:  #f5f5ff;
--n-990: #061b31;      /* primary text, --hds-color-core-neutral-990 */
--n-500: #64748d;      /* muted text */
--n-50:  #e5edf5;      /* hairline */
--n-25:  #f8fafd;      /* soft background */
--d-990: #0d1738;      /* dark-block background, --hds-color-core-neutralDark-990 */
--g-indigo: #533afd; --g-violet: #7500fb; --g-magenta: #ee30fb; --g-rose: #ff39db;
--g-peche:  #ff8c6c; --g-orange: #ffa319; --g-corail:  #fd6252; --g-jaune: #ffd601;
--g-mauve:  #da4bfe; --g-bleuet: #715cff; --g-cyan:    #7fd7ff;
```

Strategy: **one single action colour, eleven gradient hues.** The interface is achromatic
(navy, grey, white) plus a single indigo; all the colour arrives in gradients, never in
body text and never in a hairline. Eleven hues are enough to compose the page's eight
gradients.

Contrast floors: primary `#061b31` on white 17.37:1 [relevé in the browser on the source];
solid button `#fff` on `#533afd` 6.19:1 [relevé]; muted `#64748d` on white 5.4:1 [estimé].
White on the hero gradient and on the promo block is verified on the capture, not by
calculation: the background is resolvable by no tool.

### Typography

One family only. The source loads `sohne-var` with `"SF Pro Display"` as fallback
[relevé, `--hds-font-family`]; sohne not being freely distributable, this page takes
**Inter** from the Google Fonts CDN [arbitrage]. Scale relevé on the `--hds-font-heading-*`
tokens, three viewport tiers: xxl 56/48/34, xl 48/34/28, lg 32/28/22, md 26/22/20,
sm 22/20/18, xs 16, xxs 14. Body 16/1.4; small 14/1.4.
Line heights 1.03 to 1.2; negative tracking from -0.01 to -0.025em on headings only.

Weights: **300 on desktop, 400 below 1024px** for every heading [relevé,
`--hds-font-heading-*-weight` and its redefinitions]; 500 for buttons, prices and strong
labels; 600 for the wordmark and acronyms alone. No weight above 600 anywhere on the page.

Never used: a second family for text, a serif outside two decorative brand marks, tracked
uppercase on a subheading, a fluid type step in `clamp()`.
The only positive `letter-spacing` is on three testimonial brand marks.

### Spacing

4px base, values relevé on `--hds-space-core-*`: 4 / 8 / 12 / 16 / 20 / 24 / 28 /
32 / 36 / 40 / 48 / 56 / 64 / 72 / 80 / 88 / 96 / 104 / 112 / 120 / 128 / 144.
Container `1264px` centred [relevé, `--hds-space-layout-content-maxWidth`], side margin
16px on mobile and 24px beyond 768px, bento gutter 16px, header 76px [relevé,
`--navigation-height`].

Density profile: **high.** Thirteen distinct `padding-block` values across the sections,
from 40px to 144px; the breathing room comes from the bare sections (`tailles`, `pilier`)
and not from uniform padding. Radii: 4 / 8 / 10 / 16 / 20 / 30px plus the pill
[relevé].

### Motion

`MOTION_INTENSITY 6` — broad coverage, low amplitude. A single curve carries most of it:
`cubic-bezier(.25, 1, .5, 1)`, relevé 36 times across the source's sheets;
`cubic-bezier(.16, 1, .3, 1)` is reserved for scroll reveals. Three durations only:
150ms when the user has acted, 300ms for state changes, 500ms for what opens. No bounce,
no overshoot.

Six `@keyframes`: three hero ribbon breaths (22 to 34s, `alternate`), the rise of the
reveals, the appearance of a testimonial, the fill of the tab bar.
Matter: `scale`, `transform`, `opacity`, `flex-basis` on the blades,
`background-color`. The hero ribbons carry their angle in the individual `rotate`
property and their breath in `scale`, so that a keyframe cannot overwrite the fan's angle.

`prefers-reduced-motion: reduce` neutralises the durations **and** the resting states: the
reveals go to `animation: none; opacity: 1`, the burst's rays stay visible, the ribbons
stop breathing without losing their angle. The revealed blocks start from a `paused`
animation that JS only resumes, so a failed script leaves everything visible.

## Absolute bans observed

No accent colour outside `#533afd`. No gradient text outside the three figures of the dark
block. No elevation drop shadow on a content surface: a 1px hairline and nothing else. No
`<svg>` on the page — the icons are CSS boxes, the product mockups are HTML. No product
screenshot as an image. No marquee. No em dash in any visible string. No tracked uppercase
on a subheading. No `!important` outside two table overrides. No ES module: two IIFEs. No
library, no runtime network beyond the typeface.
