---
name: Image-Clipped Letters
device: Photograph clipped inside 1-2 display letters via background-clip
source: https://bold-studio-wbs.framer.website
seen-in: Agency
---

## Image-Clipped Letters — a photo inside the letterforms

> `source:` is provenance — where the device was measured. Not a site to browse
> for taste; `../../design-inspiration.md` owns that ban. Read the values here.

### The device

In one display-scale line, one or two letters are filled with a photograph
instead of a colour, using `background-clip: text` on an inline span. At small
sizes it is illegible noise; at display scale the image reads inside the
counters and the line gains a second material without a second element.

The device needs three things at once: extreme size, very tight leading, and a
heavy weight. Thin type has no counters to fill.

### CSS (measured)

```css
.display {
  font-size: clamp(4rem, 14vw, 12rem);
  font-weight: 900;
  line-height: 0.88;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: oklch(0.93 0 0);
}

.display .clip {
  display: inline-block;
  background-image: url("/photo.jpg");
  background-size: cover;
  background-position: center;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* fallback: no clip support, or forced-colors */
@supports not (background-clip: text) {
  .display .clip { color: oklch(0.93 0 0); background-image: none; }
}
@media (forced-colors: active) {
  .display .clip { color: CanvasText; background-image: none; }
}
```

`display: inline-block` is required — the clip does not apply to a wrapped
inline span. Keep the clipped span inside a single line so it never breaks
across lines.

### Conditions of use

- **1-2 letters, never a whole word.** The device is a contrast; applied to the
  line it becomes an image with holes in it.
- Display scale only — practically `clamp(4rem, 14vw, 12rem)`, weight 800+,
  `line-height` at or under 0.95. Below that the counters are too small to hold
  an image.
- The photograph needs high local contrast in the region the letter crops. A
  flat sky inside an "O" is an invisible effect.
- Accessibility: the text stays real text (that is the advantage over an image),
  but supply the `@supports` and `forced-colors` fallbacks above — without them
  the letters vanish where clipping is unsupported.
- Works on the closing ask, on a section title, or in a hero. Which one is a
  body-sequence decision, not this file's.

### Anti-patterns

- Do not clip more than 2 letters.
- Do not use a weight under 800 on the display line — thin condensed type has no
  counter area.
- Do not exceed `line-height: 0.95` on the clipped line; loose leading breaks the
  block into separate rows and the effect stops reading as one object.
- Do not animate the background position; it turns the letters into a video
  thumbnail.
- Do not use the device twice on one page.

### Optional section prompt (this section only)

Set ONE display line at `clamp(4rem, 14vw, 12rem)`, weight 900, line-height
0.88, letter-spacing -0.05em, uppercase. Wrap exactly one or two letters in an
`inline-block` span with `background-image: url(...); background-size: cover;
background-position: center; -webkit-background-clip: text; background-clip:
text; color: transparent`. Add an `@supports not (background-clip: text)`
fallback restoring the solid colour, and the same under `forced-colors: active`.
Emit the line and, if the section needs it, one ghost button below — nothing
else, and no surrounding sections.
