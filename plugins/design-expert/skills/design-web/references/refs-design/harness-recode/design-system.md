# Harness — Design System

Register: **brand**. Scope: FULL (single marketing homepage).
Design Read: enterprise DevOps/AI platform homepage; vibe = near-black, corporate-technical,
cyan-lit, demonstration-driven; constraints = static HTML/CSS/JS, opens offline by
double-click, desktop + mobile, no animation library shipped.
Dials: `DESIGN_VARIANCE 4` · `VISUAL_DENSITY 9` · `MOTION_INTENSITY 6`.

Tone (one extreme): **procurement plainspeak.** Every claim is written as an operation
performed on a pipeline, not as a benefit felt by a person. The copy never jokes and never
reaches for a metaphor — the single figurative move on the whole page is the h1 itself,
"AI for / Everything After Code". All short strings are verbatim from the source [relevé].

Signature element: **the widening tab card.** In each of the four modules the tab row sits
*below* the media, the inactive cards hold a fixed width per module (130px, 220px, 180px,
30%) and the active one expands to `max-width: 40rem` over `.2s`. Width — not a fill, not a
rule, not a colour — is what marks the current thing. Behind every panel sits the second
half of the signature: a blurred cyan-to-blue halo (`--halo-haut` → `--halo-bas`) that
enters 300ms after its media.

## Macrostructure

Name: **Mega-Menu Mirror.**

Order of the body, read on `index.html`:

1. `header.nav` — six entries (Product · Customers · Open Source · Pricing · Learn ·
   Company), a search dropdown with two families of trending pills, and a "Get started"
   entry that is itself a dropdown, not a link.
2. `main.hero` — h1 in a flex wrapper, one paragraph, **one** CTA; the video is a *sibling*
   of the grid, anchored right and behind the text; the client-logo marquee lives **inside**
   the hero, not in a band of its own.
3. `section.vd` — four anchored domain modules, each = h2 + intro + scene + tab row, with 6,
   4, 3 and 2 tabs. This is the whole product argument.
4. `section.chiffre` — giant-number band: a counter to 100+, one paragraph, an integrations
   logo plate, one text link.
5. `section.temoignages` — one-slide-at-a-time customer carousel; navigation is the client
   logos themselves, the arrows are hidden.
6. `section.cta` — gradient-clipped heading over an **eight-field demo form** in a narrow
   centred column, closed by a full-width image faded to black.
7. `footer.pied` — logo image, subscribe grid, five-column link grid whose first cell is a
   gradient-bordered promo card, then the legal row.

Absent from the canonical skeleton: **no pricing section** (the nav's "Pricing" entry points
at the CTA), **no FAQ**, **no feature card grid** (features are the tab panels), **no
testimonial grid** (one carousel), **no paired CTA buttons** — the closing ask is a form,
and the hero carries a single button where the canon puts two. Present and unchanged: nav,
hero, testimonials, CTA, footer. Below 991px the nav links are simply hidden — this rebuild
ships **no burger** where the source has one [relevé, marked as an arbitrage in `styles.css`].

Principle of organisation: **the body is the mega-menu, unrolled.** The four modules are the
four columns of the Product panel, in the same order, carrying the same links as tabs — so
navigating and reading the page traverse the identical taxonomy. Order is by product domain,
never by buyer stage.

## Design Reference

Source: https://www.harness.io/ — a Webflow build, 344 KB of HTML and 790 KB of CSS.
The palette is not sampled from imagery: it is lifted whole from the source's Webflow
variable set (`--gray--100` … `--gray--20`, `--primary-5`, `--white-smoke`), so the page and
its design tokens are the same object.

### Colors

```css
--surface-page:        #070707;
--surface-nav:         #000;
--surface-bas-degrade: #050505;
--surface-active:      #ffffff12;
--surface-fantome:     #ffffff0d;
--surface-voile:       #0b0b0d9c;
--texte-primaire:   #fff;      --texte-secondaire: #c8cad0;
--texte-tertiaire:  #9195a1;   --texte-lien:       #b0b1c3;
--texte-mention:    #787887;   --texte-accent:     #00ade4;
--halo-haut: #52cbf2;  --halo-bas: #005ad0;
--or-clair:  #ffeec3;  --or-milieu: #efdcb7;  --or-sombre: #938b87;
```

Strategy: **monochrome plus one signal.** A near-black ground, a six-step neutral grey ramp
for every text role, and exactly one hue in the system — cyan `#00ade4` — which carries the
h1, the text links and the panel halos and is never used as a fill. A warm gold ramp exists
but appears **once**, clipped into the CTA heading; it is the only warm surface on the page.
Alternation of ground is deliberate, not accidental: sections 3 and 6 declare no background
and let `#070707` show through, while 4, 5 and 7 lay a `linear-gradient(#070707, #050505 88%)`.

Contrast floors held on `--surface-page` [estimé, computed from the relevé hex]: white 20:1 ·
`--texte-secondaire` 12.3:1 · `--texte-lien` 9.5:1 · `--texte-accent` 7.8:1 (display sizes and
links) · `--texte-tertiaire` 6.7:1. The lowest text value on the page is `--texte-mention`
at ≈4.6:1, used only for the form-consent line.

### Typography

```css
--police-titre: Calsans, Verdana, sans-serif;
--police-corps: Geist, Verdana, sans-serif;
--police-serif: Newsreader, Georgia, serif;
```

Calsans (600) and Geist (300/400/500/600) are self-hosted `woff2` on the source's own Webflow
CDN — **not** Google Fonts. Newsreader is declared but its remote stylesheet was dropped, so
in practice the serif renders as Georgia, in two rules of the footer promo card only.
The scale is not a ratio: it is a measured list — 14 / 16 / 18 / 20 / 24 / 36 / 40 / 64 / 65 /
186px, each with its own line-height (115%, 120%, 110%, 137%, 150%, 1.3). One decision worth
naming: **the h1 is Calsans but the section h2s are Geist**, because `.is-new-home` overrides
the heading family — display and section headings deliberately do not match.
Never used: Inter, Roboto, Arial, Helvetica, Open Sans, Poppins.

### Spacing

Not an 8pt grid: Webflow measures, reproduced as read — 100px section padding (150px on the
tab stack, 40/60px below 767px), then 64 / 48 / 40 / 32 / 24 / 16 / 12 / 8. Frame
`--largeur-cadre 1440px`, content `--largeur-contenu 1200px`, side margin `2rem`.
Density profile: **dense** — a four-column mega-menu, fifteen tab panels, an eight-field
form and a footer column of fifteen links, all above the fold count.

### Motion

`MOTION_INTENSITY 6`. Materials are `opacity`, `transform` (translateY 12px, scale .965/.99),
`max-width` and `background-color` — nothing else animates. Curves: `cubic-bezier(.22,.61,.36,1)`
for reveals, plain `ease` for panel entries, `linear` for the marquee.
Entrances are differentiated by role, not blanket: scroll reveal is `.65s` opacity+translateY;
the panel media enters at 700ms with `scale(.965)` and a 120ms delay; its halo follows at
420ms — a deliberate 300ms gap so the light arrives after the object. The marquee runs three
identical tracks at `24s linear infinite` so no track is ever replaced by a gap. The counter
runs 1400ms easeOutCubic; the hero video parallaxes by `min(scrollY × .12, 90px)`.
Rotation dwell is 6000ms on tabs and 7000ms on the carousel, it only runs while the section
is on screen, and the **first** user interaction stops it permanently.
Reproduced as-is even where it looks unfinished: the source transitions only
`background-color` on buttons, so the button shadow and the logo opacity change abruptly.

`prefers-reduced-motion: reduce`: reveals resolve to their end state, entering animations and
the marquee stop, every UI transition is removed, the SVG scenes freeze legibly, and JS scroll
calls are forced to `'instant'` — the scroll API ignores the preference on its own.

## Absolute bans observed

No animation library in the delivery: GSAP and Lottie are both in the source, both dropped,
and the six Lottie panels are now CSS-animated inline SVG. No `backdrop-filter` outside the
navigation panels and the footer veil. Text clipped to a gradient appears exactly three times
(h1 first line, giant number, CTA heading) and nowhere else. No modal. No pricing table, no
FAQ accordion, no stat/metric band beyond the single counter. No paraphrased copy: every
heading, label and customer quote is verbatim, with its real author.
