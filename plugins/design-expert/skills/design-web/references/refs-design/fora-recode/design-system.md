# Fora — Design System

Register: **brand**. The page markets a product it never lets you enter: every
claim is carried by one rendered app window and by typography, so the design is
the pitch. Scope: FULL (single-page marketing site).
Design Read: white-label community platform for creators, educators and coaches;
vibe = cream on pure black, nothing opaque, Framer-exact radii; constraints =
static HTML/CSS/JS, Inter from Google Fonts, imagery served from the Framer CDN,
desktop + mobile.
Dials: `DESIGN_VARIANCE 3` · `VISUAL_DENSITY 5` · `MOTION_INTENSITY 6`.

Tone (one extreme): **second-person ownership, stated flat.** "Your community
deserves its own home." "Set up once. Run it the way you want." "A leaderboard
your members actually check." The copy hands the reader a possessive and then
stops. It never uses a superlative, never an exclamation mark, never a crowd
noun ("teams everywhere", "thousands of creators"), and never a metric as proof.

Signature element: **the 1px rule at white 10 %.** It is the only line in the
system and it is never a `border` on a card. It appears as the two vertical rails
that run down every section edge, as the outline of every card (outer box filled
with the rule colour, inner box `inset:1px` at radius minus 1), as the divider
under each pricing row and each `--filet` separator, and twice as a lit hairline
masked to nothing at both ends: over the app panel and above the active tab.

Macrostructure: **Bookended Canon.** This page follows the canonical skeleton
almost to the letter, and that is worth stating plainly rather than dressing up.
Order [relevé] on `index.html`: fixed nav pill → hero (chip, h1, deck, one CTA,
the app window flat and centred) → intro (three paragraphs that light from 0.25
to 1 as you scroll them) → features (four tabs driving one 16:9 gallery, caption
pill plus two round arrows) → what-you-get (three large stacked cards, text and
visual halves swapping side card to card) → pricing (monthly/yearly switch,
three plans) → faq (categories and a contact card left, accordions right) → blog
(three post cards) → cta (headline left, the same app window bled 272px off the
right edge, a 190px horizon strip closing the section) → footer.
Absent from the canon: **testimonials** — there is no quote, no face, no company
logo wall, and no metric band anywhere in the page. Added outside the canon: the
intro prose section, the what-you-get card stack, and a blog index placed after
the FAQ.
What keeps it from reading generic, given that order: the two vertical rules
cross every section boundary, so the page reads as one continuous sheet rather
than a stack of bands; only two gradients exist in the whole document and they
mark exactly the opening and the closing; each section carries its own vertical
padding (160 / 180 / 180 / 160 / 180 / 180 / 180) instead of one uniform rhythm;
and the same app window returns at the end cropped by the section edge, so the
last screen is the first screen seen from closer.
Organising principle: one object shown twice, and between the two showings each
section widens the same claim by one degree — the window, the sentence about it,
four views of it, three of its screens, its price, its objections, its writing.

## Design Reference

Source: https://fora.so — reconstructed from the Framer export of the homepage.

The palette is not sampled from imagery. It is read from the `--token-<uuid>`
custom properties Framer sets on `<body>` [relevé]; the only chromatic events are
the hero radial (slate to flesh) and the CTA linear (black to slate), both written
out in plain values in the source.

### Colors

```css
--surface-fond:         #000;
--surface-carte:        rgba(0,0,0,.85);
--surface-carte-haute:  rgba(15,15,15,.85);
--surface-encart:       rgba(23,23,23,.85);
--surface-active:       rgba(33,33,33,.85);
--surface-ardoise:      #1b2228;
--surface-ardoise-clair:#353f44;
--surface-chair:        #d39794;
--filet:        rgba(255,255,255,.10);
--filet-fort:   rgba(255,255,255,.25);
--voile:        rgba(255,255,255,.05);
--texte-primaire:   #fff3f0;
--texte-secondaire: rgba(255,255,255,.80);
--texte-tertiaire:  rgba(255,255,255,.65);
--texte-encre:      rgb(1,16,29);
--accent-lien:      #0099ff;
```

Strategy: **one ground, five alpha veils.** No opaque grey is ever painted; the
whole depth hierarchy is blacks at `.85` and whites at `.05 / .10 / .25` laid on
the same `#000`, which is why a card stays correct over an image, a gradient or
another card. Headings are cream (`#fff3f0`), lower levels are pure alpha white —
warm title, neutral body, and that temperature split is the tone. `#0099ff` is
used for links inside running text only, never on a button.

Contrast floors held [estimé] on `#000`: cream ≈ 19:1, secondary ≈ 13:1, tertiary
≈ 8.6:1 (also the 12px micro level), link blue ≈ 7:1. `--filet` and `--filet-fort`
are hairlines and non-text only.

### Typography

```css
--police:           "Inter", system-ui, -apple-system, sans-serif;
--police-affichage: "Inter", system-ui, -apple-system, sans-serif;
```

One family for the entire page, loaded from the Google Fonts CDN at 400/500/600.
The source asks for "Inter Display" on `h3` [relevé]; that family is not
distributed by Google Fonts, so it resolves to Inter here.
The scale is not modular: 56 / 40 / 36 / 28 / 22 / 16 / 14 / 12, cut in three
breakpoint blocks (≥1200, 810-1199, <810) where display sizes drop to 40 / 36 /
32 / 24 / 20 then 36 / 32 / 28 / 22 / 18 and body sizes never move. Tracking
follows size, not role: −.04em at h1/h2 down to −.01em at body. Line-height is
1.3 for h1, 1.35 for h2-h4, 1.5 for everything below — no intermediate value.
Weights stay at 400 except `h2` at 500; emphasis comes from size, never weight.
`text-wrap: balance` is requested on `h2` alone. Measure: 52ch on the hero deck,
46ch on section prose, 420px on the mockup description.

Never used: a second family of any kind, a serif, a mono, or a weight above 600.

### Spacing

Not a clean 8pt grid. The gap ladder [relevé] is 80 / 64 / 48 / 36 / 32 / 24 /
16 / 12 / 10 / 8 / 6, and section stack is 180px, with 160px for the hero and
for pricing, collapsing to 120px then 140px at the two breakpoints. Content is
capped at 1080px inside sections capped at 1600px, prose at 560px, edge margin
24px. Density profile: airy between sections, dense inside cards — 36px card
padding, 20px pricing rows, 12px around card visuals.

### Motion

`MOTION_INTENSITY 6`. Materials are `transform` and `opacity` for every entrance,
`grid-template-rows: 0fr → 1fr` for the accordion and the mobile menu (no measured
height anywhere), `mask-image` for the two lit hairlines, and one blurred
multi-radial standing in for the source's WebGL panel. `cubic-bezier(.44,0,.56,1)`
is the site's own curve [relevé] — it appears independently in the link preset and
as the ease of the nav tween; `cubic-bezier(.16,1,.3,1)` stands in for the
`spring, bounce 0` recorded 18 times. Durations: 1s appearances, .5s, .4s on links,
.7s on the intro.

Entrances are distinguished by role, not by one blanket rule: hero elements
cascade at 0 / .1 / .2 / .3s; the mockup's three tiers stagger at .12s; the price
counter rolls one digit column at a time with a 60ms offset; gallery layers
cross-fade over 800ms while a 1.4s scale settles; the intro paragraphs are driven
by a continuous scroll position, not a boolean, and light one after another
between 0.30 and 0.70 of their own traverse. Wheel inertia (LERP 0.1) replaces
the source's Lenis, and is not installed on coarse pointers.

`prefers-reduced-motion: reduce` neutralises rather than shortens: every starting
state is forced to its end value — `[data-monte]`, the nav, the mockup tiers, the
intro paragraphs at full opacity, the shader stopped, inertia never installed.

## Absolute bans observed

No `border` on a card — every outline is the inlaid-rule procedure. No opaque
grey surface. No drop shadow at all: there is not one `box-shadow` in the
stylesheet, depth is alpha only. No gradient text. No single generic pill radius:
every component carries its own (768 button, 215 chip, 880 checkmark, 72 gallery,
66 tabs, 32 visual, 24 card, 18 panel, 16 secondary card, 6 ghost logo). No
testimonial, no logo wall, no hero metric. No modal. The accent blue never
touches a button. Note against the other references here: the em dash is *not*
banned on this page, it is used in running copy.
