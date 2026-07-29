---
name: Ghost Numeral
device: Oversized faded numeral as a step card's background texture
source: https://financer-wbs.framer.website
seen-in: Fintech
---

## Ghost Numeral — the step number as texture, not as content

> `source:` is provenance — where the device was measured. Not a site to browse
> for taste; `../../design-inspiration.md` owns that ban. Read the values here.

### The device

Inside a step or process card, the ordinal is set very large and dropped to ~10%
opacity so it sits behind the real content as texture. The reader gets the
sequence at a glance from the shape of the numeral without the number competing
with the step's title.

The card itself carries no border and no shadow — it is a flat tinted plate on a
slightly different surface. That flatness is what lets the ghost numeral read;
add a border and the numeral becomes a watermark inside a box.

Note: the old index entry for this pattern advertised a "gradient orb". No such
element exists in the measured source. The device is the numeral.

### CSS (measured)

```css
.step {
  position: relative;
  background: oklch(0.97 0.005 90);
  border-radius: 20px;
  padding: 36px 28px;
  border: none;          /* deliberate */
  box-shadow: none;      /* deliberate */
  overflow: hidden;
}
.step__num {
  font-size: 3.5rem; font-weight: 800;
  color: oklch(0.13 0 0); opacity: 0.1;
  line-height: 1;
}
.step__title { margin-top: 20px; font-size: 1.25rem; font-weight: 600;
               color: oklch(0.13 0 0); }
.step__desc  { margin-top: 8px; font-size: 0.9375rem; line-height: 1.65;
               color: oklch(0.45 0 0); }
```

The card surface (`0.97`) sits one step off the page surface (`0.98`). That
single-step separation is the whole elevation budget — the plate is legible
because the numeral is not, not because the card is raised.

The numeral can also be absolutely positioned oversized and clipped by
`overflow: hidden` (e.g. `font-size: 8rem; position: absolute; right: -8px;
bottom: -16px`). Same 10% ceiling.

### Conditions of use

- 3 to 5 steps. Two is not a sequence; six is a list and wants 01 or 10.
- The steps must be a real ordered process from the brief. Numbering three
  unordered benefits is the exact "decorated slop" the Body Substance Floor in
  `../PATTERNS.md` rejects.
- Opacity ceiling 0.1 (0.15 on a dark surface where the same alpha reads
  fainter). Past that the numeral becomes content and fights the title.
- The numeral is decorative: it must not be the only place the order is stated
  for assistive tech. Use an ordered list, or `aria-hidden` the numeral and
  carry the order in the markup.
- Do not pair with 01's bracketed index on the same page — two numbering
  treatments is one too many.

### Anti-patterns

- Do not raise the numeral past 10% — it is texture, not content.
- Do not add a border or a shadow to the step card; flat on a near-surface tint
  is the device.
- Do not centre the numeral behind the title; offset it (top-left, or clipped at
  a corner) so it reads as a layer.
- Do not restate the number in the title ("01 — Discovery" next to a ghost 01).

### Optional section prompt (this section only)

Build ONE process section: a grid of 3-5 step cards, `gap: 24px`. Each card:
`border-radius: 20px; padding: 36px 28px`, background one step off the page
surface (e.g. `oklch(0.97 0.005 90)` on `oklch(0.98 0.005 90)`), no border, no
shadow, `overflow: hidden`. Inside, the ordinal at 3.5rem weight 800 in the
foreground colour at `opacity: 0.1`, `aria-hidden`; then the step title at
1.25rem weight 600 20px below; then a 0.9375rem/1.65 muted description 8px
below. Emit exactly as many cards as there are real steps. Nothing outside this
section.
