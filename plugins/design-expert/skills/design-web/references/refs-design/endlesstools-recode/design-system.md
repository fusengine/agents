# Endlesstools — Design System

Register: **brand** — the page *is* the demonstration. Its whole argument is the footage
it displays, and no screen of the application is ever shown as an interface. Scope: FULL
(single page, top bar to footer).
Design Read: catalogue landing page for a real-time 3D and motion template tool;
vibe = dark showreel, moving imagery everywhere, prose reduced to captions;
constraints = static HTML/CSS/JS, all media remote, 20 videos, desktop + mobile.
Dials: `DESIGN_VARIANCE 3` · `VISUAL_DENSITY 7` · `MOTION_INTENSITY 6`.

Tone (one extreme): **category statement, never a benefit promise.** "Art direction is
now software." Headlines assert what a field has become; taglines are three-word
fragments ("Fully customizable. Ready to use."). The copy never uses first person, never
quantifies outside prices and specs, never asks a question, never exclaims. The single
register break belongs to someone else and is deliberate: the fourteen review cards keep
their authors' lowercase, unedited phrasing, which is why they read as evidence and not
as marketing.

Signature element: **the veil that dissolves every edge.** Nothing on this page ends on a
visible line. `--voile-haut` (`linear-gradient(#000 14.73%, #000a0a00 100%)`) makes the
sticky bar legible with no opaque background; `--voile-bas`
(`linear-gradient(#0000 0%, #000 85.27%)`) is 340px tall at the foot of the opening
scene, a fixed-height box that cuts the mosaic mid-image; and each of the twenty tiles
carries the same gradient over its bottom half, offset one pixel *below* its edge so no
light line can appear at the radius [relevé]. Pure black is not a background choice here,
it is the terminator every crop dissolves into.

Macrostructure: **Showreel Canon** — the canonical skeleton, compressed and executed
entirely in footage. Order relevé on `index.html`:

- `.barre-haute` — sticky, gradient-masked, exactly two pills (Sign in, Start for free);
  no menu, no links, no logo image
- `.ouverture` — h1, tagline, one button, then `.scene`: fixed height (1200px, 760px above
  48rem) holding the 20-tile mosaic, two columns becoming six
- `.demonstration` — centred h2 and one video capped at 900px; the only single-object block
- `section.fonctions` — eight square tiles, two columns becoming four; image, three-word
  title, one-line caption
- `section.tarifs` — billing toggle, then two ringed cards on a rail
- `section.temoignages` — rail of fourteen cards, bottom-aligned, arrows and a 50×6 gauge
- `section.inscription` — email field, submit, consent checkbox, 310px wide
- `footer.pied` — two rows of links and one copyright line

Two readings to guard against: `.ouverture` and `.demonstration` are `<div>`, not
`<section>`; and the fourteen `<header class="carte-avis__auteur">` are card headers
inside the review rail, not page sections.

Deviations from the canon (nav → hero → features → testimonials → pricing → faq → cta →
footer): **FAQ is dropped outright**; **testimonials and pricing are swapped**, so the
price is asked before the proof is shown; a demo block is inserted between hero and
features; and the closing CTA is not a repeat of the primary action but an email capture —
the page asks for a subscription, not a signup, at its end. Also absent: logo wall, metric
row, comparison table, footer columns. Everything else is the canon, in canonical order.

Principle: the sequence alternates showing output and asking for something, and every
showing block is a **countable set of media** — 20 tiles, 1 video, 8 tiles, 2 cards, 14
cards — so rhythm is set by the count in each set, never by the length of prose.

## Design Reference

Source: https://endlesstools.io (Next.js; one external sheet,
`_next/static/chunks/7cbd7ac42dbd96bf.css`, plus the hydrated DOM — the opening mosaic is
an empty container in the served HTML). The brand is neutralised as "Render Studio", a
substitute of identical length so no line-break shifts [relevé].

The palette is sampled from nothing: it is a seven-value grey ramp declared in the source
theme, with colour rationed to three appearances.

### Colors

```css
--fond-page:        #000;
--fond-scene:       #0a0a0a;
--fond-carte:       #080808;
--fond-carte-haute: #2a2a2a;
--fond-champ:       #1e1e1e;
--fond-action:      #373737;
--texte-primaire:   #fff;
--texte-secondaire: #959595;
--texte-tertiaire:  #555;
--trait-discret:    #373737;
--trait-carte:      #505050;
--trait-jauge:      #333;
--accent-promo:     #ff3dae;
--lien-avis:        #1d9bf0;
--degrade-action:   linear-gradient(97.25deg, #b8ff45 3%, #ffcb45 22%, #ff00b8 100%);
```

Strategy: **monochrome with rationed colour.** The page black `#000` is darker than the
component black `#0a0a0a`, so every surface is lighter than its ground and never the
reverse; the review card at `#080808` is all but indistinguishable from the page and is
drawn by its hairline, not by its fill. Colour appears exactly three times: the discount
badge `#ff3dae`, the sliding gradient on the single PRO button, and `#1d9bf0` on mentions
inside reviews — inherited from an external convention, the one value the system does not
own. States are derived from one base with `color-mix(in oklab, …)`, never declared as
separate tokens.

Contrast floors: primary 21:1, secondary `#959595` ≈7.8:1 [estimé]. `--texte-tertiaire`
`#555` (≈2.8:1 [estimé]) is carried over from the source theme and used nowhere in the
page [relevé] — a declared token with no live use, recorded as found.

### Typography

Inter, loaded from `rsms.me/inter/inter.css` [relevé, `index.html` head]; no second family
anywhere. Five tiers and no intermediate: 12/14, 14/18, 18/20, 24/26, 42/46. A title is
24px below 48rem and 42px above, with nothing between — no `clamp()`, no fluid scale; that
1.75 jump is the page's only type event. One weight is declared, 500; the sheet contains
no `font-bold` or `font-semibold` rule at all [relevé], so hierarchy rests on size and
negative tracking (`-.03em` on titles, `-.025em` on the billing toggle), never on weight.

Measure is set by short `max-width` values that go in pairs across the breakpoint —
270→620, 280→460, 540→900, 335→820, plus 180 / 215 / 370 / 450 [relevé] — each chosen to
force a precise wrap point. The composition is re-framed at every breakpoint, never left
to whatever width is available.

Never used: bold or semibold, a second family, a display or mono face, any fluid step,
uppercase outside the 8px mosaic tags and the FREE/PRO tokens.

### Spacing

A 5px grid, not an 8pt one: 5 / 10 / 15 / 20 / 25 / 35 / 45 / 50 / 100 / 150 [relevé],
with the mosaic's 8px gutter and the 1px hairlines as the only exceptions. 150px between
sections, 100px around inner blocks, edge margin 20px becoming 40px above 48rem. Three
radii for three object scales: 10px (opening button, mosaic tile), 12px (cards, field,
submit), 7px (card buttons, media frames).

Density profile: dense inside blocks, airy between them — 8px gutters and 8px type inside
the mosaic, 150px of nothing between sections. On a page of 5,452px at 1440 [relevé], the
opening scene alone is a fixed 1200px on narrow screens and 760px above 48rem, roughly a
fifth of the scroll [estimé]. It is the block that sets the page's impression and the only
one whose height depends on no content — and it is *taller* on the narrow viewport than on
the wide one. On a page this short, that is where the length is spent: on the catalogue,
not on the pitch.

### Motion

`MOTION_INTENSITY 6` — the motion is footage, not animation. One duration and one curve
carry every interactive state: `.15s` and `cubic-bezier(.4, 0, .2, 1)` [relevé], on eleven
of the twelve measured transitions. Nothing is slowed down, no curve is overridden. The
twelfth is the page's only self-running animation: the gradient sliding on the PRO button,
`1.5s ease-in-out infinite alternate` over `background-size: 200% 200%` [relevé] — one
saturated moving point in a monochrome page, on the one button meant to be seen.

The scroll reveal is `opacity 0 → 1` with `translateY(5px) → 0`. Only the resting state is
readable in the source, written inline before hydration; the `.5s` and
`cubic-bezier(.16, 1, .3, 1)` declared in `styles.css` are flagged there as the rebuild's
own — the source animates in JS and carries no timing in its sheet.

The real animated material is video, in two opposite treatments. Eight content videos
(`preload="none" loop muted autoplay playsinline`, no poster, no controls) sit in boxes
ratio-locked by an exact `padding-bottom` taken from the file's own dimensions, never a
round value: zero layout shift, and a video that never loads leaves a black rectangle
holding its place. Twelve hover videos overlay the mosaic tiles and are swapped by
`opacity` in the same `.15s`, loaded on first hover. Every other movement on the page is a
hairline appearing (`ring-0 → ring-1`) or one opacity step.

`prefers-reduced-motion: reduce` appears nowhere in what the source ships [relevé]. Here it
covers reveals, the gradient, rail scrolling and the videos: `src` is still set so a first
frame shows, `play()` is never called.

## Absolute bans observed

No bold and no semibold. No second typeface. No fluid or intermediate type step. No colour
outside the three sanctioned appearances. No `border` property except the 18px consent dot
— every other line is a `box-shadow` ring, inset on surfaces and outset on media frames and
fields, so no line ever eats a pixel of image. No elevation shadow of any kind. No
glassmorphism outside two `backdrop-filter` values (16px on the bar pills, 24px on the
mosaic tags). No poster and no controls on any video. No FAQ, no logo wall, no metric row,
no comparison table. No visible edge anywhere: every crop ends in a gradient to black.
