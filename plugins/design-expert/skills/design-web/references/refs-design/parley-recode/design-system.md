# Salut — Design System

Register: `brand` — a marketing landing page for a live-chat agent that answers a site's visitors in place of a contact form.
Scope: one page, one stylesheet, one script. No framework, no build step, no network asset except two Google font families.
Design Read: reproduction of the source (captured 2026-08-01, full-page desktop 1365 × 10604). The macrostructure, the grids, the type scale, the spacing rhythm and the component inventory are the source's. Only the brand name, the palette, the photographs and the copy are ours.
Dials: `DESIGN_VARIANCE 5` · `VISUAL_DENSITY 6` · `MOTION_INTENSITY 3`
Tone (one extreme): **daylight**. This is the first light page in a corpus of ten dark ones. Every decision that would normally be resolved by a glow, a bloom or a luminous edge has to be resolved by a hairline, a shadow or a wash instead.
Signature element: **the photographic band that cuts the page**. Four times, the text column stops dead and a full-bleed landscape takes the whole viewport width. Twice something floats on top of it — a white status card, a dark terminal — and once nothing does, which is what makes the other three read as deliberate.
Macrostructure: taken from the source, in this order, nothing added and nothing removed.

1. Fixed header, translucent, hairline underneath
2. Hero: a rounded photographic card, dark type on a white wash, with a browser mock overlapping its lower edge by 144px
3. The silent drop-off: three numbered cards, closing statement
4. How it works: three icon rows on the left, a floating visitor-context card on the right
5. Clean conversations: three plain text columns, no card
6. **Photographic band** + white status card, bottom-aligned
7. Built for agents: four cards in a 2 × 2 grid, each ending on a mono chip
8. **Photographic band** + dark terminal, centred
9. On your phone: a CSS phone chassis on the left, copy and three icon rows on the right
10. Setup: four numbered steps, each opened by a hairline
11. **Photographic band**, nothing on top
12. Pricing: three plans, the middle one flagged, one long footnote
13. Questions & answers: a two-column grid of ten open pairs, no accordion
14. **Photographic band** + centred white CTA card
15. Dark footer, four columns, giant wordmark

Absent from the canonical skeleton: no logo wall, no testimonial, no metric strip, no feature comparison table, no newsletter capture, no accordion. The FAQ is fully open — ten questions and their answers, all visible, which is the source's choice and is what makes the page 10600px tall.
Principle: **the hairline carries the page, not the shadow**. On a dark page a card is separated from its background by luminance; here the background is already at 96% lightness, so a card at 100% barely exists. The separation comes from a 1px `#d5dae2` border on every surface, and shadows are reserved for the four elements that genuinely float above the page.

## Design Reference

### Colors

One locked light theme. No `prefers-color-scheme` branch, no `data-theme` attribute.

| Token | Value | Role |
|---|---|---|
| `--pearl` | `#f4f5f7` | page base, five sections |
| `--pearl-tint` | `#e9ecf1` | alternate section base, four sections |
| `--surface` | `#ffffff` | every card, every mock |
| `--surface-soft` | `#fbfbfd` | inside the browser and phone mocks only |
| `--hairline` | `#d5dae2` | the load-bearing separator |
| `--hairline-soft` | `rgba(213,218,226,.62)` | internal divisions inside a card |
| `--hairline-firm` | `#c3cad6` | hover state of a bordered surface |
| `--ink` | `#2c3a4b` | headings, primary button fill |
| `--ink-soft` | `#5a6779` | body copy — 5.2:1 on `--pearl` |
| `--ink-mute` | `#7b8798` | labels, fine print — 3.6:1, never body |
| `--slate` | `#46607f` | numerals, icons, mono chips |
| `--slate-pale` | `#93a7be` | terminal ticks, tickmark borders |
| `--signal` | `#d8342b` | status only: live dot, Open badge, Popular badge, terminal caret |
| `--night` | `#14181d` | footer surface |

The signal red is deliberately starved. It appears five times on a 10000px page and never on a button, never on a link, never on a heading. It replaces the source's tender green in exactly the roles the source gave the green (status and attention) and nowhere else. It is not used on the pricing tickmarks: a red check reads as a failure, so those took `--slate-pale` instead.

Measured contrast, on the surface each colour actually sits on:

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on `--pearl` | 10.9:1 | AAA |
| `--ink-soft` on `--pearl` | 5.2:1 | AA body |
| `--ink-soft` on `--surface` | 5.6:1 | AA body |
| `--ink-mute` on `--pearl` | 3.6:1 | large text and non-essential labels only |
| `--slate` on `--surface` | 6.5:1 | AA |
| `--signal-deep` on `--signal-wash` over white | 6.1:1 | AA |
| `--pearl` on `--ink` (primary button) | 10.6:1 | AAA |
| `--night-mute` on `--night` | 6.0:1 | AA |

Three surfaces stack alpha over a photograph, and each was chosen so the composite never drops below the ratio above: the hero wash resolves to `#f6f7f9` at the headline's y-position, the status and CTA cards sit at 94-95% white, the terminal at a fully opaque `#161c24`.

### Typography

Two families, both from the source, both kept.

- **Public Sans** — the grotesque. Everything that is not a heading: body at 15px/1.62, lede at 18px/1.62, labels at 14px, buttons at 15px/500.
- **Instrument Serif** — the display serif, regular weight only, italic used as an accent on the second line of a title. Carries the h1, every h2, the numerals `01`–`04`, the price amounts and the footer wordmark.
- **JetBrains Mono** — code chips and the terminal, 14px.

| Step | Size | Line height | Tracking | Family |
|---|---|---|---|---|
| h1 | `clamp(2.75rem, 1.6rem + 5vw, 4.5rem)` | 1.02 | −0.025em | serif |
| h2 | `clamp(2.125rem, 1.55rem + 2.4vw, 3rem)` | 1.08 | −0.015em | serif |
| price | 3rem | 1 | — | serif |
| numeral | 1.875rem / 1.5rem | 1 | — | serif |
| h3 | 1.125rem / 1rem | 1.35 | −0.006em | sans 600 |
| lede | 1.125rem | 1.62 | — | sans 400 |
| body | 0.9375rem | 1.62 | — | sans 400 |
| label / eyebrow | 0.875rem | 1.5 | 0.18em on the eyebrow | sans 500 |

Nothing renders below 14px, at any viewport. The source drops to 11px on its context labels and badges; that floor is the one deviation this page takes on purpose.

The italic is an accent, never a mode. It fires exactly twice: on the second line of the h1, and on the two words that close the FAQ title. Both times it is the same gesture, a serif regular giving way to a serif italic mid-phrase, and both times the roman half of the phrase is longer than the italic half. A third occurrence would turn the device into a style.

The weight range in use is narrow on purpose: the serif ships at 400 only, the grotesque at 400, 500 and 600, and nothing else. On a light page a 700 heading in a grotesque reads as heavier than it measures, because there is no luminance headroom above it to absorb the extra ink; the serif carries the display weight instead.

### Spacing

Standard density profile. Container `72rem`, widened to `80rem` on the two sections whose grid needs it (How it works, Pricing). Gutter `24px`, shared by the header and every section, no exception.

Section padding is `80px` block, `112px` from 1024px up. Four values break that rhythm, and they are what stops the page reading as one repeated stamp: the hero opens at `96px / 112px` top and `0` bottom, the Clean-conversations section closes at `40px / 56px`, the footer runs `80px / 32px`, and the four photographic bands are sized by height rather than padding — `320/420/520`, `380/440/480`, `240/300/360`, `520/560/620`.

Card padding: `28px` on the content cards, `32px` on the pricing plans, `20px` on the floating context card. Grid gap `24px` everywhere, `36px 56px` on the FAQ pairs. Radii climb with the size of the surface: `8px` chips, `12px` icon squares, `16px` cards and mocks, `24px` the CTA card, `32px` the hero card, `36px` the phone chassis, `999px` every button and badge.

The four bands, at their three breakpoints:

| Band | 360 | 640 | 1024 | Carries |
|---|---|---|---|---|
| after Clean conversations | 320 | 420 | 520 | white status card, bottom-aligned at 12% |
| after Built for agents | auto | 440 | 480 | dark terminal, centred |
| after Setup | 240 | 300 | 360 | nothing |
| CTA | auto | 560 | 620 | white CTA card, centred |

Two of them go to `height: auto` below 640px: the terminal and the CTA card are both taller than their band at that width, and a fixed height with `overflow: hidden` would have clipped them. The photograph is pinned behind the grown band instead.

The one deliberately empty band is the third. It is also the shortest, and it sits between the densest pair of sections on the page (four setup steps, then three pricing plans). Its whole job is to be a breath, and it only reads as one because the two bands before it were busy.

### Motion

`MOTION_INTENSITY 3` — calm band, and the source is calmer still.

- **Image fade-in, 700ms ease-out.** Reproduced exactly: it is the only motion the source actually ships. Bound to `load`, and to `error` as well so a missing file never leaves a hole.
- **Section reveal, 620ms `cubic-bezier(.16,1,.3,1)`, 14px rise.** Ours, not the source's. Each element disarms itself with `observer.unobserve(entry.target)`.
- **Terminal stagger, 90ms per line.** Ours. Four lines, one observer, disconnected after firing.
- **Header surface at 24px of scroll**, rAF-throttled, frame cancelled on `visibilitychange`.
- Hover and focus transitions at 160ms, hover elevation at 260ms.

Nothing scrubs, nothing parallaxes, nothing pins. The page is 10000px tall and the reader's job is to get down it; a scroll-driven effect on a page this long is a tax paid on every screen.

Counted in the delivered files: `14` lines carrying a `transition` declaration, `1` `@keyframes` block (the live dot, a two-stop opacity pulse at 2.4s), `8` `:hover` rules, `5` `:focus-visible` rules, `2` `prefers-reduced-motion` blocks (one in the stylesheet, one as the script's first branch). Zero animation of a layout property.

The default DOM state is the finished state. `.js` is stamped on `<html>` by the script, and every hiding rule is scoped under it, so a blocked or failed script leaves the page complete rather than blank. Under `prefers-reduced-motion: reduce` the script returns before stamping anything.

### Components

Four interface mocks, all built in HTML and CSS, none of them an image: a browser window with a chat widget riding its lower-right corner, a terminal, a phone chassis, and two floating white cards. The browser mock rises 144px into the hero card's bottom padding, which is why that padding is 176px and not a round number.

Three card families, and they are not interchangeable. The content card is white with a hairline and 28px of padding. The pricing plan is the same card at 32px, with the middle one given a `--slate-pale` border and a resting shadow. The floating card (visitor context, status, CTA) always carries a shadow, because it is the only family that is genuinely above the page rather than on it.

## Absolute bans observed

- No bounce, no elastic, no overshoot: every curve is `ease-out` or `cubic-bezier(.16,1,.3,1)`.
- No theme flip inside the reading flow. The only dark surfaces are the footer, which terminates the page, and two objects that are dark because the thing they depict is dark — a terminal and a phone chassis.
- No animation of `width`, `height`, `top`, `left`, `margin` or `padding`. Only `opacity` and `transform`.
- No text below 14px rendered, at any viewport, including labels and captions.
- No text laid directly on a photograph without a wash or a card underneath it.
- No gradient used as decoration. The three that exist are functional: the hero wash, the band-to-page fade, and the wordmark's clipped fill.
- No `:focus` suppressed. Every interactive element carries a visible `:focus-visible` ring.
- No em-dash used as a rhythm crutch: the page carries one.
- No pure black and no pure white as a text colour. The darkest ink is `#2c3a4b`, the lightest surface is `#ffffff` but never carries type directly.
- No accent colour on a call to action. Every button is ink or bordered white, exactly as in the source, and the red is never clickable.
- No second marquee, no first one either.
- No icon larger than 20px in a body row, and no icon at all in a heading.
- No `overflow-x` on the document at any of the six review widths.
