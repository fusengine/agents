---
name: Hero Badge Inline
device: Pill badge and icon set inline in the H1 text flow
source: https://agenza-wbs.framer.website
seen-in: Agency
---

## Hero Badge Inline — the badge sits inside the headline

> `source:` is provenance — where the device was measured. Not a site to browse
> for taste; `../../design-inspiration.md` owns that ban. Read the values here.

### The device

A small pill badge, and optionally one icon, set **inside** the H1's text flow
rather than stacked above it as an eyebrow. The headline wraps around them, so
the scarcity or status signal is read as part of the sentence instead of as a
label bolted on top.

Two things follow from that placement: the badge does not consume a line of
vertical space, and it does not count as an eyebrow — which is precisely why it
is useful on a page already at its eyebrow cap.

### CSS (measured)

```css
.h1 {
  font-size: clamp(2.75rem, 6.5vw, 5rem);
  font-weight: 600; letter-spacing: -0.04em; line-height: 1.08;
  color: oklch(0.13 0 0); max-width: 960px;
}

.h1 .badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 16px; border-radius: 999px;
  background: oklch(0.72 0.16 150); color: oklch(0.13 0 0);
  font-size: 0.8125rem; font-weight: 500;
  vertical-align: baseline; transform: translateY(-4px);
}
.h1 .badge::before {
  content: ""; width: 6px; height: 6px; border-radius: 50%;
  background: oklch(0.35 0.12 150);
  animation: pulse 2s ease infinite;
}
@media (prefers-reduced-motion: reduce) { .h1 .badge::before { animation: none; } }

.h1 .inline-icon { width: 44px; vertical-align: middle; margin: 0 6px; }
```

The `translateY(-4px)` is what makes an inline-flex pill sit on the display
type's optical baseline instead of its metric one. Retune it per font — it is a
correction, not a constant.

### Conditions of use

- The badge must state something true and perishable — real remaining slots, a
  real date, a real status. A permanent "New" pill is furniture.
- **One badge per page.** Scarcity stated twice is not scarcity.
- The badge's colour is a signal colour, not the brand accent reused; if the
  design system has no signal colour, the device does not apply.
- The inline icon must not exceed the H1 cap-height, or the headline's baseline
  grid visibly breaks.
- Below ~640px the badge wraps to its own line. Check that the wrap does not
  orphan a single word of the headline.
- The pulsing dot needs a `prefers-reduced-motion` escape — non-negotiable.

### Anti-patterns

- Do not lift the badge out of the H1 and place it above — that is an eyebrow,
  and it lands against the `../../layout-discipline.md` §2 cap.
- Do not use more than one badge, and do not use one badge plus one eyebrow.
- Do not make the inline icon larger than the H1 cap-height.
- Do not animate the badge's entrance; only the dot moves, and only if motion is
  allowed.

### Optional section prompt (this section only)

Set an inline pill badge inside the H1's text flow. H1:
`clamp(2.75rem, 6.5vw, 5rem)` weight 600, tracking -0.04em, line-height 1.08,
max-width 960px. Badge: `display:inline-flex; gap:6px; padding:6px 16px;
border-radius:999px`, a signal colour background, 0.8125rem weight 500,
`vertical-align:baseline; transform:translateY(-4px)`, with a 6px round dot that
pulses over 2s and stops under `prefers-reduced-motion`. Optionally one inline
SVG icon at 44px, `vertical-align:middle; margin:0 6px`, never taller than the
H1 cap-height. Emit the headline only — no subtext block, no CTA row, no
surrounding sections.
