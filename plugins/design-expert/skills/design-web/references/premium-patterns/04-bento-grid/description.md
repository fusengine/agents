---
name: Bento Grid
device: Asymmetric bento cell mix (2x2 / 2x1 / 1x1) inside one section
source: https://startify-template.webflow.io
seen-in: SaaS
---

## Bento Grid — one section, mixed cell sizes

> `source:` is provenance — where the device was measured. Not a site to browse
> for taste; `../../design-inspiration.md` owns that ban. Read the values here.

### The device

One section whose content sits in a 4-column grid with cells of deliberately
different spans: a 2x2 carrying a photograph, 2x1 cells carrying a feature, 1x1
cells carrying a single stat or headshot. The asymmetry is the device — it lets
one section hold photos, numbers and short text at once without splitting into
three stacked bands.

### Caution — the shipped lesson, and where else it applies

The measured source combines two traits — a serif-italic accent on one headline
word, and a low-chroma "cream" neutral (`oklch(0.95 0.015 80)`, chroma ~0.015,
functionally near-grayscale). A shipped design reached for exactly this
combination as an unprompted, undeclared default and **read as generic "AI
premium"**, not a real brand signature. Both stay documented here for accuracy;
neither is a default to copy:

- **Serif-italic-on-one-word** — only if the committed type pairing in
  `design-system.md` explicitly calls for a serif display face. Never as a
  headline-accent reflex. The same gate applies to pattern 08, whose whole
  device is that accent; it carries a pointer back here.
- **Cream/warm-neutral background** — fine as one gated option among several
  card-bg variants, not a mandatory "premium" cue.

Generalised: any trait a generator reaches for *without being asked* is a tell
by that fact alone, whatever it looks like. That is the test to run on every
device in this folder, not only this one.

### CSS (measured)

```css
.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: 14px;
}
.bento__cell {
  border-radius: 14px; padding: 28px;
  background: oklch(0.97 0.005 80);
  border: 1px solid oklch(0.91 0.005 80);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.bento__cell:hover { transform: translateY(-3px);
  box-shadow: 0 6px 20px oklch(0 0 0 / 0.05); }

.bento__cell--dark  { background: oklch(0.14 0 0); color: oklch(0.96 0 0); border: none; }
.bento__cell--cream { background: oklch(0.95 0.015 80); } /* gated — see Caution */
.bento__cell--photo { padding: 0; }
.bento__cell--photo img { width: 100%; height: 100%; object-fit: cover; }

.stat__num   { font-size: clamp(2.5rem, 4.5vw, 3.75rem); font-weight: 700;
               letter-spacing: -0.03em; }
.stat__label { margin-top: 8px; font-size: 0.8125rem; color: oklch(0.48 0 0); }
```

Spans: `grid-column: span 2; grid-row: span 2` for the photo cell, `span 2` for
features, default for stats. Responsive: 2 columns at 768px, 1 at 480px, all
spans reset to 1.

### Conditions of use

- **N content items = N cells, exactly.** `../../layout-discipline.md` §4 owns
  this and the no-empty-column rule; a filler tile means the grid was planned
  wrong.
- At least 2-3 cells carry a real image, tint, or pattern. An all-typography
  bento is a table with rounded corners.
- Never more than 4 columns on desktop.
- 1x1 cells hold a stat, an icon, or a headshot — never a paragraph.
- Maximum 3 card background variants. Beyond that the grid reads as a palette
  test.
- If the bento is the hero, that is a macrostructure choice (entry 5,
  `../../../../design-method/references/macrostructure-bank.md`), decided before
  this file is opened.

### Anti-patterns

- Do not make all cells the same size — the asymmetry is the device.
- Do not exceed 4 columns on desktop.
- Do not add heavy shadows; 20px blur at 5% on hover is the ceiling.
- Do not introduce a serif-italic accent word with the cream background — see
  the Caution.
- Do not reuse the bento for a second section on the same page
  (`../../layout-discipline.md` §5).

### Optional section prompt (this section only)

Build ONE section as a bento grid: `repeat(4, 1fr)`, `grid-auto-rows:
minmax(180px, auto)`, `gap: 14px`. Cells: 14px radius, 28px padding, a light
surface background with a 1px border one step darker. Mix spans — one 2x2 photo
cell (`padding: 0`, `object-fit: cover`), 2x1 feature cells, 1x1 stat cells with
the number at `clamp(2.5rem, 4.5vw, 3.75rem)` weight 700 tracking -0.03em and a
0.8125rem muted label 8px below. One dark cell `oklch(0.14 0 0)` with light
text. Hover: `translateY(-3px)` and `box-shadow: 0 6px 20px oklch(0 0 0 / 0.05)`.
Emit exactly as many cells as there are real content items. No serif-italic
accent word unless the design system already commits a serif display face.
Nothing outside this section.
