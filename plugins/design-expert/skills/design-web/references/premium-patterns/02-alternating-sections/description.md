---
name: Inverted Band
device: Hard-cut background inversion at one boundary, plus a sub-5% dot-grid watermark
source: https://boxsi-wbs.framer.website
seen-in: SaaS
---

## Inverted Band — the background cut IS the separator

> `source:` is provenance — where the device was measured. Not a site to browse
> for taste; `../../design-inspiration.md` owns that ban. Read the values here.

### The device

Two adjacent sections meet on a hard colour cut: no gradient, no divider rule,
no spacer. The inverted band carries its own text scale (light text on the dark
side, dark on the light side) and an SVG dot-grid watermark at 2.5% opacity that
gives the flat surface a texture without adding an element.

The device is **one boundary**, not a page rhythm. It buys a single strong
separation for the section that deserves it — the one section you want the
reader to register as a different register.

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

- **One inverted band per page.** Two is a rhythm; three is a zebra.
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

Invert ONE section against its neighbours: hard colour cut, no gradient and no
divider element between them. Dark surface `oklch(0.11 0 0)` with text
`oklch(0.95 0 0)` and muted `oklch(0.52 0 0)`, against light neighbours
`oklch(0.98 0 0)` / `oklch(0.13 0 0)` / `oklch(0.42 0 0)` — or the inverse.
Add a dot-grid texture on the band only:
`background-image: radial-gradient(circle, oklch(0.50 0 0) 1px, transparent 1px);
background-size: 24px 24px`, kept under 5% effective opacity. Start the band's
vertical padding at 96px desktop / 56px mobile and set the neighbouring sections'
padding to different values. Do not invert any other section, and do not emit
the sections around it.
