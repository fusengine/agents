# Trove.link — Design System

Register: **brand** — a public landing page whose job is conversion (four sign-up
buttons, two plans, no application chrome). It is worth reading because it is the
only page in the corpus that argues **entirely through photographs**: six of its
nine sections are a rounded photographic card, and the type is laid directly on
the image in five of them. Scope: FULL (single page, header to footer).
Design Read: landing page for a tool that keeps links and gives them back on
request; vibe = nocturnal, atmospheric, warm accent inside a cold field, every
claim shown as a surface rather than argued; constraints = static HTML/CSS/JS,
six local photographs (one per photographic surface, none reused), forced dark.
Dials: `DESIGN_VARIANCE 6` · `VISUAL_DENSITY 6` · `MOTION_INTENSITY 6`.

Tone (one extreme): **second-person imperative, always short.** Every heading is
one sentence cut in two by an italic serif, and the second half is the turn:
*Keeping was never the hard part. / Finding it again is.* The copy addresses one
reader, never a market; it names an object ("a folder named read-soon-3", "that
teal pricing page") rather than a benefit. No exclamation, no urgency, no
superlative, no em dash in any visible string [relevé].

Signature element: **the two-voice heading.** Every h2 on the page is a grotesque
sentence interrupted by an `<em>` set in Instrument Serif italic, and that italic
fragment carries either a four-stop gradient (on the page background) or plain
white (on a photograph). Nothing else on the page changes typeface. Second-order
signature: **the rounded photographic card** — a `2.5rem` frame, a hairline at 8%
white, a full-bleed image, a directional veil and a grain layer, repeated four
times with the veil direction changing each time (vertical, top-only, horizontal,
top-only).

Macrostructure: **Surface, then Proof.** Order relevé on the source's served DOM:

- `header.entete` — a floating pill, fixed, `max-w-6xl`, three links that simply
  vanish below 768px; **no burger, no dropdown, ever** [relevé]
- `section.hero` — photographic card at radius `2rem` (the only one), eyebrow,
  two-line h1, one paragraph, two buttons, a four-item trust strip
- `section.probleme` — the only section with no image at all: eyebrow, two-voice
  h2, paragraph, then three identical bordered cards
- `section.remede` — photographic card whose heading sits at its bottom edge,
  then three step cells separated by a single `1px` grid gap
- `section.agent` — two columns: copy plus a small photographic card on the left,
  an agent window drawn entirely in HTML/CSS on the right
- `section.promesse` — photographic card with a horizontal veil, five query
  pills in frosted glass, then three number cards pulled tight against it (`1rem`)
- `section.ios` — photographic card, copy left, a phone chassis drawn in CSS right
- `section.tarifs` — the only centred heading, and the only one that stops one
  step short of the display size; two plans, the featured one bordered in accent
- `section.faq` — a narrow title column beside a four-entry accordion
- `section.cloture` — photographic card, centred, repeating the hero's two buttons
- `footer.pied` — one brand column plus four link columns, then a legal bar

Absent from the canonical skeleton: **testimonials in any form** — no quote, no
logo wall, no customer name; **comparison table**; newsletter; burger menu;
sticky sub-nav; breadcrumb; any dark/light toggle. Present but mutated: the
"features" argument exists three times over, in three different geometries (three
constat cards, three step cells, three number cards), so the page has no single
features block; social proof is replaced by five imagined search queries.

Principle: the order alternates **a surface and its proof** — a photographic card
always precedes or contains the claim, and the small bordered cards that follow
are the receipt. No two consecutive sections share a geometry.

## Design Reference

Source: not published here (TanStack Start SSR, compiled Tailwind v4 sheet at
`/assets/index-Bc6vz3Z7.css`, plus a 60-line inline `<style>` block that carries
the two `@font-face` rules, the gradient-text class, the grain and the theme).

The palette is not sampled from the photographs; the photographs were shot to
match it. The source runs a desaturated plum against a single warm coral. This
rebuild keeps the architecture — one cold four-step field, one warm accent — and
moves the field from plum to deep teal.

### Colors

```css
--fond-page:    #05171a;
--fond-panneau: #082024;
--fond-carte:   #0a262a;
--fond-eleve:   #0e3034;
--texte:        #eaf6f3;
--texte-doux:   #93b3b0;
--texte-image:  #dcefea;
--texte-clair:  #ffd2c2;
--texte-faible: #86aaa6;
--accent:       #ff7a5c;
--sur-accent:   #10231f;
--trait:        rgb(255 255 255 / 0.08);
--trait-doux:   rgb(255 255 255 / 0.06);
--trait-fort:   rgb(255 255 255 / 0.20);
```

Strategy: **one cold field, one warm accent, surfaces built in opacity.** Four
background steps carry every opaque surface; every non-opaque surface is white at
3%, 6%, 10% or 20% over them, so the page has exactly three border weights and no
grey scale. The accent appears in five places only: eyebrows, step numbers,
checkmarks, the featured plan's border, and the two gradients.

Contrast floors, measured on the rendered page (`layout-check`, six widths,
0 violations): primary 15.9:1, secondary 7.1:1, the agent placeholder 6.3:1 after
correction. The two gradients carry a dark teal ink rather than the source's
white: 6.35:1 at the darkest stop against 3.0:1 in the source.

### Typography

Two families, and the split is absolute. **Geist** (grotesque) carries every
sentence, label and button. **Instrument Serif** appears only as the wordmark, the
italic half of each heading, the three constat card titles, the three step
numbers, the three number-card figures and the two prices — never a sentence.

Scale, relevé from the source's utility classes: 14 / 15 / 16 / 18 / 20 / 24 / 36 /
48 / 60 / 72px. Weights: 600 on the two opaque buttons and the badge, 500 on nav,
labels, step titles and list items, 400 on everything else — no 700 anywhere.
Tracking: `-0.025em` on every heading, `0.2em` on the seven eyebrows, `0.025em` on
the hero eyebrow alone. Two responsive steps (640px, 1024px), and the pricing
heading deliberately stops one step below the others. Never used: a third family,
a mono face, any weight above 600, small caps, a step between 640 and 1024px.

### Spacing

One gutter (`1.5rem`) from 360px to 1920px, one container ceiling (`72rem`) with
`64rem` for the FAQ and footer, one grid gap (`1rem`) everywhere [relevé].

Section rhythm is **not one repeated value**: `6rem`/`8rem` bands, but each
photographic card carries its own interior padding (`5rem`/`7rem` on the promise,
`4rem`/`5rem` on iOS, `6rem`/`8rem` on the closing), and the number cards are
pulled to `1rem` from the card above where every other grid sits at `3.5rem`. 44
distinct padding values across the sheet. Density profile: Editorial. Radii are
stacked rather than unified — 32 / 40 / 24 / 16 / 12px plus the pill, five values
that each mark a scale of object.

### Motion

`MOTION_INTENSITY 6` — total coverage, minimal amplitude, zero `@keyframes`.
Every movement on the page is a transition between two states, which is also true
of the source (its motion is a Framer Motion runtime, so no keyframe is ever
declared).

Two reveal distances, and they are not interchangeable: the hero's five children
rise **16px** on mount, in a 90ms cascade; every section block rises **24px** when
it crosses into view. Both values are literal in the source's served HTML.
Durations: 150ms for anything the user pressed (relevé, the only written duration
in the source), 200ms for hover and accordion, 620ms for a reveal. Two curves:
`cubic-bezier(0.16, 1, 0.3, 1)` for reveals, the implicit `cubic-bezier(.4,0,.2,1)`
for states. No bounce, no elastic, no overshoot.

Press is the source's own gesture, copied literally: `scale(0.96)` over 150ms
across transform, background-color, border-color, color and opacity. Hover adds
rather than subtracts, and only on the two opaque buttons: `scale(1.03)` on the
white one, `scale(1.02)` on the gradient one — a deliberate 1% difference.

`prefers-reduced-motion: reduce` neutralises the **resting states**, not only the
durations. `motion.js` arms `opacity: 0` only after confirming it can lift it: no
JS, no IntersectionObserver or reduced motion, and the CSS hides nothing. The
accordion ships **open** in the HTML for the same reason.

## Absolute bans observed

No `@keyframes`. No burger menu, no dropdown, no modal, no toast. No box-shadow
used as elevation on a content surface (the only two shadows sit under the agent
window and the phone chassis, both representing objects that float). No
glassmorphism outside the header pill and the five query pills. No icon in any
heading. No underline on any link. No testimonial, no logo wall, no comparison
table, no newsletter. No theme toggle. No `<svg>` standing in for a photograph,
and no photograph used twice. No text below 14px anywhere, at any viewport.
