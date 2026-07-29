---
name: Departed Band
device: Hard-cut background change at one boundary, inside the page's locked theme (never a light/dark flip), plus a sub-5% dot-grid watermark
source: https://boxsi-wbs.framer.website
seen-in: SaaS
---

## Departed Band — the background cut IS the separator

> `source:` is provenance — where the device was measured. Not a site to browse
> for taste; `../../design-inspiration.md` owns that ban. Read the values here.

### The device

Two adjacent sections meet on a hard colour cut: no gradient, no divider rule,
no spacer. The departed band carries its own text values (the base surface's muted
grey rarely holds contrast on it) and an SVG dot-grid watermark at 2.5% opacity
that gives the flat surface a texture without adding an element.

The device is **one boundary**, not a page rhythm. It buys a single strong
separation for the section that deserves it — the one section you want the
reader to register differently.

The measured source flipped light↔dark. Do not: the flip fails pre-flight check 3
and no page in the corpus performs it. Keep the hard cut, change the surface, stay
in the theme — second correction below.

### Correction — this file used to prescribe a page

The measured source alternates dark/light across eleven sections and ran three
consecutive `1fr 1fr` image+text splits with the sides flipping. Both were
written here as prescriptions. Both are wrong:

- **Three consecutive splits is a pre-flight fail.** `../../layout-discipline.md`
  §3 caps consecutive image+text split sections at two. That file owns the limit;
  it is not restated or softened here.
- **Strict light/dark alternation on every boundary is itself a tell.** Applied
  to every section it produces the zebra rhythm that reads as generated. The
  relief it provides is real; the recipe applied everywhere is the problem. See
  `../PATTERNS.md` "Flatness is banned — and so is one mandatory recipe for
  relief" for the other ways out.
- **Uniform section padding was prescribed here** (`96px 72px` on every
  section). `../../../SKILL.md` lists identical padding on every section as a
  mechanical anti-slop flag; `../../../../design-method/references/body-sequence-bank.md`
  rule 2 shows the alternative on shipped evidence — `fora` sets vertical padding
  section by section (160/180/180/160/180/180/180). Treat any number below as a
  starting point to vary, never a page-wide constant.

### Second correction (2026-07) — the cut is a SURFACE change, not a theme flip

The CSS below still reads `.band--dark` / `.band--light` because those are the
values measured on the source. **Applied literally as a light/dark flip it fails
`../../../../design-review/references/pre-flight-checklist.md` check 3**, which
locks one theme for the whole page — and check 3 blocks mechanically, so a page
built on the literal reading gets sent back.

The count that settled it: across the ten pages of `../../refs-design/`,
**0 of 10** carry a theme inversion at section level; **5 of 10** give one section
a background that departs from the base *within* the theme. The device is real;
the flip is not what makes it work. The hard cut is.

**So read the two surfaces below as `base` and `departed`, not as `light` and
`dark`.** On a dark-locked page the departed surface is a lighter tint, a
gradient, or a drawn texture of the same family — `supercommon`'s first band
rises to `#bfc6c1` on a pure-black page and stays unmistakably the same page.
Keep the hard cut, keep the single occurrence, drop the inversion. Full
arbitration in `../PATTERNS.md` §*Relief is not inversion*.

### CSS (measured)

```css
/* the two surfaces — hard cut, no transition element between them */
.band--dark  { background: oklch(0.11 0 0); color: oklch(0.95 0 0); }
.band--light { background: oklch(0.98 0 0); color: oklch(0.13 0 0); }

/* muted body text per surface */
.band--dark  .body { color: oklch(0.52 0 0); }
.band--light .body { color: oklch(0.42 0 0); }

/* dot-grid watermark — texture, never a visible pattern */
.band--dark {
  background-image: radial-gradient(circle, oklch(0.50 0 0) 1px, transparent 1px);
  background-size: 24px 24px;
  /* dots drawn at 2.5% effective opacity — keep under 5% */
}
```

Starting vertical padding on the band: `96px` desktop / `56px` mobile, horizontal
`72px` / `20px` — then vary it against its neighbours rather than repeating it.
If the band carries an accent, keep one (`oklch(0.62 0.22 25)` in the source) and
use it for the CTA only.

### Conditions of use

- **One departed band per page.** Two is a rhythm; three is a zebra. And write the
  CSS so it stays unique — `supercommon` gives three later bands an explicit
  opaque-background rule whose only job is to stop its one gradient band bleeding
  under them.
- **Never a light↔dark flip.** Stay inside the locked theme; see the second
  correction above and pre-flight check 3.
- Give the band the section that earns the register change — the closing ask, a
  proof band, a single feature that carries the POV. Not "the third section".
- The inverted surface needs its own muted-text value; reusing the light
  surface's muted grey on a dark band fails contrast.
- If the band contains an image+text split, count it against
  `../../layout-discipline.md` §3 like any other split.

### Anti-patterns

- Do not gradient between the two surfaces — the hard cut is the device.
- Do not add a divider rule on top of the colour cut; that is the same
  separation stated twice.
- Do not raise the dot-grid above 5% opacity — it becomes a pattern and reads as
  a hero background.
- Do not use more than one accent inside the band.
- Do not alternate every section. See the Correction above.

### Optional section prompt (this section only)

Set ONE section's background apart from its neighbours **without leaving the
page's locked theme**: hard colour cut, no gradient and no divider element
between them. On a light-locked page, `oklch(0.98 0 0)` neighbours against a
departed band at `oklch(0.92 0 0)`–`oklch(0.88 0 0)` with text `oklch(0.13 0 0)`
and muted `oklch(0.42 0 0)`; on a dark-locked page, `oklch(0.11 0 0)` neighbours
against a departed band at `oklch(0.17 0 0)`–`oklch(0.22 0 0)` with text
`oklch(0.95 0 0)` and muted `oklch(0.52 0 0)`. Do **not** flip light↔dark: that
fails pre-flight check 3 and appears in none of the ten corpus pages.
Add a dot-grid texture on the band only:
`background-image: radial-gradient(circle, oklch(0.50 0 0) 1px, transparent 1px);
background-size: 24px 24px`, kept under 5% effective opacity. Start the band's
vertical padding at 96px desktop / 56px mobile and set the neighbouring sections'
padding to different values. Do not invert any other section, and do not emit
the sections around it.
