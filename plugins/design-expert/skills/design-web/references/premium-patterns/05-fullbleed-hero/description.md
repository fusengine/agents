---
name: Watermark Over Full-Bleed Image
device: Oversized low-opacity wordmark over a hue-tinted image overlay
source: https://villabliss-wbs.framer.website
seen-in: Luxury
---

## Watermark Over Full-Bleed Image

> `source:` is provenance — where the device was measured. Not a site to browse
> for taste; `../../design-inspiration.md` owns that ban. Read the values here.

### The device

Two techniques that only work together, applied to one full-bleed image section:

1. **A hue-tinted multi-stop overlay** instead of a black scrim. Three stops of
   the same warm hue at rising alpha carry the image down into legibility while
   keeping its colour temperature. A neutral black overlay flattens the photo to
   grey and is the single most common way a full-bleed section reads as generic.
2. **An oversized wordmark watermark** at ~7% opacity sitting behind the
   readable text. It gives the section a second typographic layer and a sense of
   scale without adding a element the reader has to process.

The section can be the hero, a mid-page band, or the closing ask. Which one is a
macrostructure/body-sequence decision made elsewhere; this file only supplies
the treatment.

### CSS (measured)

```css
.bleed { position: relative; overflow: hidden; }
.bleed > img { position: absolute; inset: 0; width: 100%; height: 100%;
               object-fit: cover; object-position: center 30%; }

/* hue-tinted scrim — NOT neutral black */
.bleed::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg,
    oklch(0.18 0.02 65 / 0.20) 0%,
    oklch(0.12 0.02 65 / 0.55) 60%,
    oklch(0.10 0.02 65 / 0.70) 100%);
}

.bleed__watermark {
  position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%);
  font-size: clamp(7rem, 18vw, 16rem); font-weight: 300;
  letter-spacing: 0.08em; white-space: nowrap;
  color: oklch(0.95 0.01 80 / 0.07);
  pointer-events: none; user-select: none;
}

.bleed__content { position: relative; z-index: 2; }
.bleed h1 { text-shadow: 0 2px 16px oklch(0 0 0 / 0.20); }
```

The overlay hue (65 here) is taken from the photograph, not from the brand
palette — that is what makes it read as light rather than as a filter. Chroma
stays low (0.02); above ~0.05 it becomes a colour wash.

### Conditions of use

- The photograph must be the point. If the image is stock filler, the tinted
  overlay makes an expensive frame around nothing.
- Watermark at 5-10% opacity. Below 5% it disappears at typical brightness;
  above 10% it competes with the headline and fails contrast reading.
- The watermark string is the brand wordmark or a single word — never a
  sentence, never a `nowrap` string longer than the viewport at mobile widths
  (clip it or drop it there).
- Verify the headline's contrast against the **overlaid** image at its lightest
  region, not against the average. The `text-shadow` is a safety margin, not a
  substitute.
- `pointer-events: none` and `user-select: none` on the watermark, or it becomes
  selectable junk and a screen-reader duplicate. Mark it `aria-hidden="true"`.
- Viewport height is a hero decision (`../../layout-discipline.md` §1 owns the
  hero numbers) — this file does not set one.

### Anti-patterns

- Do not use a solid or neutral-black overlay — the tint is half the device.
- Do not raise the watermark above 10% opacity.
- Do not stack cards, badges or a CTA row over the image; the section holds the
  photograph, the watermark and one text block.
- Do not let the watermark and the headline share an optical centre — offset the
  watermark (48% here) so they read as two layers.
- Do not repeat the watermark in a second section on the same page; twice makes
  it a background pattern.

### Optional section prompt (this section only)

Build ONE full-bleed image section. Image absolutely positioned, `inset: 0`,
`object-fit: cover`, `object-position: center 30%`. Over it, a three-stop
gradient scrim in the photograph's own hue, low chroma, rising alpha —
`linear-gradient(180deg, oklch(0.18 0.02 65 / 0.20) 0%, oklch(0.12 0.02 65 /
0.55) 60%, oklch(0.10 0.02 65 / 0.70) 100%)` — never neutral black. Behind the
text, an `aria-hidden` wordmark watermark at `clamp(7rem, 18vw, 16rem)` weight
300, letter-spacing 0.08em, colour at 7% alpha, centred at `top: 48%`, with
`pointer-events: none; user-select: none`. Text block at `z-index: 2` with
`text-shadow: 0 2px 16px oklch(0 0 0 / 0.20)`. No cards, no badges, nothing
outside this section.
