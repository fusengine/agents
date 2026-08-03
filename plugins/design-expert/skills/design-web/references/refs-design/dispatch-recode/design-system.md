# Sodium — Design System

Register: **brand** — a public landing page whose job is conversion (two hero
actions, three plans, a price calculator, a closing CTA). It is worth reading
because it argues almost entirely through **executable proof**: two terminal
blocks and a live calculator carry more of the page than any prose block does.
Scope: FULL (single page, header to footer).
Design Read: landing page for a newsletter platform driven from the command line
and from any MCP client; vibe = nocturnal, photographic, technical, warm;
constraints = static HTML/CSS/JS, four local `.webp`, forced dark, desktop +
mobile down to 360px.
Dials: `DESIGN_VARIANCE 7` · `VISUAL_DENSITY 7` · `MOTION_INTENSITY 7`.

Tone (one extreme): **imperative-technical.** Every heading is two sentences
welded by a full stop, the second one italic and warmer than the first — *Stop
clicking your newsletter. Pipe it.* / *Three steps. Then you just talk.* /
*Describe a page. Watch it exist.* The copy never asks a question outside the
FAQ, never quantifies a benefit it cannot print in a terminal, and every number
on the page (62, 3,104, 9s, $18) appears at least twice — once as prose, once as
machine output [relevé, procédé de la source].

Signature element: **the shell as the argument.** Two full terminal chassis —
a title bar with three dots, a mono tab strip, a monospaced body — plus a chat
overlay inside a photograph, plus a browser-chromed demo panel. Four surfaces on
one page recreate an interface in HTML/CSS rather than showing a screenshot, and
the first of them **overlaps the hero by 96px** so the proof reaches into the
photograph. Second-order signature: the sodium accent never touches a paragraph
— it lives only in code tokens, numerals, ticks and the italic serif of headings.

Macrostructure: **Claim, then Proof, repeated.** Order relevé on the source and
reproduced 1:1 on `index.html`:

- `header.entete` — 48rem pill, fixed at 16px, backdrop-blurred; burger below 640px
- `section.heros` — a 32px photographic frame, 88svh, eyebrow / h1 in two masked
  lines / subtitle / two actions / four mono chips / a SCROLL tick
- `section.zone-terminal` — the terminal, `margin-top: -6rem`, three tabs
- `section.manifeste` — 42rem centred, the only block with no component in it
- `section` ×2 — *How it works* (3 numbered cards), *The platform* (6 cards)
- `section#integrations` — the code block, four tabs, plus a mono footer link
- `section` — four application cards, icon + arrow
- `section` — page builder: text column + photograph with a chat overlay
- `section#demo` — the source's empty video frame, **filled here** with a timed
  four-step track inside a browser chassis
- `section.bandeau` — four counters, the page's only bordered band
- `section` — the maker column: image, three paragraphs, a signature
- `section#tarifs` — three plans, the middle one badged
- `section` — the calculator: one range on a log10 scale, one live verdict
- `section#faq` — sticky 0.8fr heading beside 1.2fr of accordions
- `section` — the closing photographic block
- `footer.pied` — 1.5fr + three link columns, then a bottom bar

Absent from the canonical skeleton: **testimonials in any form** — no quote, no
customer name, no logo wall of clients; comparison table; newsletter capture;
sticky sub-nav; breadcrumb; cookie banner. Present but mutated: the logo wall
exists as *integrations* (four AI clients, not customers); the "features" block
exists three times in three geometries (3 cards, 6 cards, 4 cards); the CTA band
is a photograph, not a colour field.

Principle: **every claim is followed within one section by a surface that
executes it.** The hero says *pipe it* and the terminal beneath prints the pipe;
the pricing table states a rate and the calculator below applies it. The page
never argues twice in a row without a machine speaking in between.

## Design Reference

Source: not published here (Next.js, compiled Tailwind v4 sheet, Framer Motion).

The palette is sampled from nothing on the source and from the four local
photographs here. The source is midnight blue with an electric-blue accent;
this page is anthracite with sodium orange, and the four images were generated
to that palette rather than tinted afterwards.

### Colors

```css
--fond-page:     #0b0b0e;
--fond-terminal: #131216;
--surface:       rgb(255 255 255 / .03);
--surface-forte: rgb(255 255 255 / .05);
--trait:         rgb(255 255 255 / .08);
--trait-cadre:   rgb(255 255 255 / .10);
--trait-fort:    rgb(255 255 255 / .15);
--sodium:        #ff8c2b;
--sodium-clair:  #ffb066;
--ambre:         #ffcf9b;
--ambre-sourd:   #c99a6a;
--or-pale:       #f0d08a;
--terre:         #c98f5a;
```

Strategy: **one hue, five values, opacity everywhere else.** There is exactly one
chromatic family on the page — sodium, from `#c98f5a` to `#ffcf9b` — and every
surface, every rule and every muted text is a white opacity over anthracite, as
on the source [relevé: `bg-white/[0.03]`, `border-white/8`, `text-white/55`].
The accent is rationed: prompt carets, tool bullets, step numbers, ticks,
counters, the slider fill, the italic half of each heading. No paragraph, no
button label and no card body is ever coloured.

Contrast floors: primary 18.6:1, `--texte-55` ≈6.6:1, `--texte-50` ≈5.9:1
[estimé]. The source's `text-white/40` (≈4.3:1) on footer links and micro-labels
sat under the floor; those are raised to 50 % here, the one colour departure from
the source. `--sodium` on `--fond-page` ≈8.7:1, `--ambre` ≈13:1 [estimé].

### Typography

Three families, all from the source [relevé, `3d9uy71yrg96g.css`]. **Instrument
Serif** carries every heading, every price, every counter and the signature —
regular for the first clause, *italic* for the second. **Geist** carries body
copy and buttons only. **Geist Mono** carries eyebrows, chips, code, tabs,
captions, tick labels and the footer. Space Grotesk ships on the source under
`--font-caption` but is never applied; it is not loaded here.

Scale, all relevé: h1 48 → 72 → 96px at 1.04/-0.01em; h2 36 → 48px at 1.25;
manifesto h2 30 → 36px at 1.375; card titles 20px; plan names 24px; counters and
prices 48 → 60px; body 16px at 1.625; card body and list rows 14px; code 13px;
eyebrows 11px at .35em. Weights: 400 everywhere except 600 on the primary button
and 500 on nav. No `letter-spacing` outside mono.

Never used: a fourth family, a bold serif, a gradient on text, small-caps,
an underline outside `:focus-visible`.

### Spacing

A 4px grid used almost only at 8px multiples: 8 / 12 / 16 / 24 / 28 / 32 / 40 /
56 / 80. One inter-section value repeated 11 times — **112px, 144px above 640px**
[relevé, `pb-28 sm:pb-36`]. Side margin 24px, identical on mobile and desktop.
Container ceiling 72rem, prose ceiling 42rem, terminal ceiling 48rem. Grid gutter
16px everywhere, card padding 28px everywhere.

Density profile: high. Seventeen blocks over 10,622px at 1365 [relevé], against
10,718px for the source — a 0.9 % difference in total length, obtained without
copying a single measurement of copy. The page is long because it holds many
things, not because it is padded.

### Motion

`MOTION_INTENSITY 7` — total coverage, low amplitude, one exception. Every block
enters on `opacity 0 → 1` plus a 24px rise over 700ms [relevé: the source ships
those exact resting states inline]. The two h1 lines are the only elements with a
different entrance: a 110 % translate inside an `overflow: hidden` mask, 900ms,
cascaded 110ms apart. Hover is 200ms and subtracts nothing: a card lifts 2px,
gains 2 % of surface, and lights a 240px radial spot that follows the pointer
[relevé, `--spot-x` / `--spot-y`].

Three periodic animations, all gated on `.js-motion`: the SCROLL tick (2.2s), the
terminal caret (1.1s, `steps(1)`), the demo gauge (1.6s, once). Four scripted
behaviours: the hero parallax (0.18 × scrollY, capped by the 5rem overhang), the
four counters (1400ms, cubic out), the tab groups, and the calculator.

`prefers-reduced-motion: reduce` neutralises the **resting states**, not just the
durations — a resting `opacity: 0` left in place would leave the page blank — and
the resting states are only ever armed by `motion.js` writing `.js-motion` on
`<html>`, so no-JS renders the full page.

## Absolute bans observed

No second accent hue — one family, five values. No coloured paragraph. No accent
button: the primary CTA is white on anthracite. No gradient text, no gradient
background except the two image scrims and the slider fill. No elevation shadow
on a card (only the two terminal chassis and the four photographic frames carry
one). No glassmorphism outside the header pill, the hero eyebrow and the chat
overlay. No burger dropdown on desktop, no modal, no toast, no carousel. No
testimonial, no client logo wall, no comparison table, no urgency device, no
"trusted by" line. No emoji, no icon in a heading. No text under 14px at 360px.
