# Elysian — Design System

Register: **brand**. Scope: FULL (single-page experience).
Design Read: cinematic catalogue page for a fictional maison of imagined geography;
vibe = surreal, inscriptional, sun-bleached, exact; assets = four supplied riso-style
neoclassical plates; constraints = static HTML/CSS/JS, offline, desktop + mobile.
Dials: `DESIGN_VARIANCE 9` · `VISUAL_DENSITY 4` · `MOTION_INTENSITY 8`.

Tone (one extreme): **auction-house deadpan about impossible objects.** Never lyrical
marketing, never playful. The copy behaves like a catalogue entry that has quietly
accepted that the lot does not exist.

Signature element: **the arch aperture.** A Greco-Roman arch (square base, semicircular
head) is the only frame in the system. It opens the page, frames every specimen, forms
the plate windows, and closes the page as the wax seal. Nothing else is ever used to
crop an image.

The four transformations, one per chamber: **slat shear** (the still life comes apart
into seven vertical slats that slide against each other), **arch aperture** (a keyhole
widens into the full arch), **torn counter-pan** (the valley is cut along one hairline
and the two halves pan in opposite directions while colour wipes back over the lower
half), **letterform plate** (the word ELYSIAN is filled with the temple, then zooms and
defocuses until the plate itself is all that is left).

Macrostructure: **Vitrine Descent** (not the canonical nav/hero/features/testimonials/
pricing/faq/cta/footer skeleton). Order: Aperture → Ledger → four Plate chambers, each
with a different image transformation → Seal → Colophon. Dropped outright: feature grid,
testimonials, pricing, FAQ, CTA band. Navigation is the ledger itself plus a fixed
masthead of three named entries, Ledger, Plates and Seal, with a four numeral pocket
on small screens. There is no burger at any width.

## Design Reference

Inspiration: the four supplied plates, browsed and downloaded as the primary reference.

- https://code.melvynx.dev/elysian-classical-surreal-still-life.png
- https://codelynx.mlvcdn.com/uploads/2026-07-13/2026-07-13-greco-roman-scholarly-landscape.png
- https://codelynx.mlvcdn.com/uploads/2026-07-13/2026-07-13-vibrant-mountain-river-valley.png
- https://codelynx.mlvcdn.com/uploads/2026-07-13/2026-07-13-golden-temple-starry-night.png

All four share one printer's palette: a deep teal-navy ground, a saturated marigold, a
coral, and bone-white plaster, with slate-blue engraved shadow. The site palette is
sampled from the plates rather than invented, so page and image are one printed object.

### Colors

```css
--ink-abyss:  oklch(0.132 0.032 219);
--ink:        oklch(0.205 0.048 219);
--ink-2:      oklch(0.285 0.055 216);
--ink-3:      oklch(0.380 0.052 213);
--slate:      oklch(0.600 0.038 235);
--bone:       oklch(0.945 0.016 84);
--bone-dim:   oklch(0.800 0.020 84);
--bone-mute:  oklch(0.755 0.022 84);
--marigold:   oklch(0.795 0.163 71);
--marigold-2: oklch(0.665 0.155 62);
--coral:      oklch(0.755 0.135 28);
--verdigris:  oklch(0.700 0.075 178);
```

Strategy: **drenched.** The surface is the colour. `--ink` carries the page; `--marigold`
is the single committed accent and never decorates, it only marks the current thing.
`--coral` appears in the riso misregistration shadow and nowhere as a fill. Neutrals are
tinted to hue 219 (chroma 0.016 to 0.055), never pure grey, never `#000`/`#fff`.

Contrast floors held: `--bone` and `--bone-dim` on `--ink` for body; `--bone-mute` is the
lowest text value used (≈5.9:1); `--slate` is hairlines and non-text only; `--marigold`
on `--ink` is used at display size and for UI marks.

### Typography

```css
--font-display: "Bodoni Moda", ui-serif, "Times New Roman", serif;
--font-text:    "Archivo", ui-sans-serif, system-ui, sans-serif;
```

Self-hosted variable woff2, latin subset. Bodoni Moda (optical size axis) is inscriptional
and matches the plates' engraved contrast; Archivo carries a width axis used at 108% for
micro labels. Scale ratio 1.25, fluid via `clamp()`, seven steps. Display line-height
0.86 to 1.02, body 1.6, measure capped at 62ch.

Never used: Inter, Roboto, Arial, Open Sans, Lato, Poppins.

### Spacing

8pt grid: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 144. Editorial density profile.
Section padding is deliberately unequal chamber to chamber, so the descent has rhythm.

### Motion

`MOTION_INTENSITY 8`. All scroll motion is driven by one rAF loop writing a `--p`
progress custom property (0 to 1) per pinned chamber. Materials are `transform`,
`opacity`, `clip-path` and `mask-image` only. Easings are exponential
(`cubic-bezier(0.16, 1, 0.3, 1)`); no bounce, no elastic, no `ease-in` on UI.
Entrances vary by role: the wordmark rises per letter with an uneven stagger, ledger rows
wipe from the left, plate copy fades with no translation. There is no single blanket
`opacity 0 + translateY(20px)` rule anywhere.

`prefers-reduced-motion: reduce` ships in the same pass: pinning is removed, every
chamber renders in its legible end state, the lantern and the star drift stop, and the
seal opens on a single activation.

## Absolute bans observed

No side-stripe borders. No gradient text. No glassmorphism outside the navigation
chrome: the masthead bar and the small mobile pocket are the only two blurred
surfaces in the page, and nothing else uses `backdrop-filter`. No hero-metric
template. No identical card grid (there are no cards). No modal. No em dash in any
visible string.
