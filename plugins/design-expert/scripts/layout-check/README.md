# layout-check — deterministic layout check

Loads a page in headless Chrome, measures it at several widths, returns a **JSON of
violations** and an **exit code**. No judgment: only numbers and booleans.

It exists for one precise reason: the instructions "look at the screenshot", "the label
fits on one line" are already written in the skills, and an agent can still
declare a section verified while a label wraps. This script runs
**outside the model** — its verdict cannot be bypassed by declaring oneself compliant.

## Invocation

```bash
cd ${CLAUDE_PLUGIN_ROOT}/scripts/layout-check
bun run layout-check.ts <url-or-path> [options]
```

The target is **always the first argument** (local path → converted to `file://`, or `http(s)` URL).

| Exit code | Meaning |
|---|---|
| `0` | pass, `violations: []` |
| `1` | at least one violation |
| `2` | error (target not found, Playwright missing, page not loaded) |

The JSON goes to **stdout**, the readable summary to **stderr** — `--out report.json` also
writes the JSON to a file, `--quiet` turns the summary off.

`summary.contrastPairs` groups the contrast violations by **resolved** color pair: one
token pair produces dozens of violations, the key gives the number of truly distinct
fixes (measured: 185 violations = 5 pairs).

Warnings that are identical from one width to the next are merged, the affected widths
reported in the reason: a gradient background does not depend on the viewport
width (measured: 60 lines → 15 on a real page). An unreadable warning is an
ignored warning, and an ignored unmeasurable case is the hole we are trying to close.

### Options

| Option | Default | Effect |
|---|---|---|
| `--widths 360,768` | `360,390,768,1024,1280,1440` | measured widths |
| `--height 900` | `900` | viewport height |
| `--exclude "sel,sel"` | — | selectors excluded from every check |
| `--checks "overlap,contrast"` | all 5 | enabled families |
| `--cta "<selector>"` | buttons + `a[class*=btn/button/cta]` | what counts as a CTA |
| `--allow-overlays false` | intentional overlaps ignored | disables the intentionality heuristic |
| `--warmup` | off | scrolls through the page before measuring (JS reveals) |
| `--motion no-preference` | `reduce` emulated | restores animations |
| `--contrast`, `--contrast-large`, `--cta-factor`, `--overlap-ratio`, `--ink` | 4.5 / 3 / 1.6 / 0.1 / 2 | thresholds |
| `--config file.json` | — | partial config, overridden by the flags |

## The five checks

| `type` | Predicate | Mechanizes |
|---|---|---|
| `text-overflow` | `scrollWidth > clientWidth + tolerance` **OR** text ink outside the content box | truncated / overflowing text |
| `overlap` | intersection of the `getBoundingClientRect()` of two elements with no ancestor/descendant link | label overlapping a button |
| `cta-wrap` | height > `1.6 × line-height` **AND** ≥ 2 text line boxes | `layout-discipline.md` §6 |
| `contrast` | WCAG ratio on resolved colors, 4.5:1 / 3:1 | `layout-discipline.md` §6, `ux-wcag.md` |
| `document-overflow` | `documentElement.scrollWidth > viewport`, at every width | stray horizontal scrolling |

## Fixture pages — check that the gate is alive

```bash
bun run layout-check.ts fixtures/broken.html --widths 1280   # expected: 12 violations, 1 warning, exit 1
bun run layout-check.ts fixtures/clean.html                  # expected: 0 violations, 0 warnings, exit 0
```

`fixtures/broken.html` carries **one clear-cut case per check**: all six families must fire.
Its failing colors are written in **OKLCH and `color-mix()`**, never in hex — this is
deliberate: `getComputedStyle().color` returns `oklch(...)` as is in Chromium, so a
parser that assumes `rgb()` would report **0 violations on an entirely failing page**.
A hex fixture page would validate that broken parser.

`fixtures/clean.html` reuses the same components, fixed: it tells a detector
that works from a detector that screams at everything. Run both after any
change to the script — a check that stays silent on `broken.html` is a dead check.

## What the script cannot do (read before concluding)

1. **Contrast on a gradient or an image.** If a `background-image` is part of the
   ancestor chain, the ratio only covers the color layer: the case comes out in
   `warnings`, **never** as a violation. Same for text painted by a gradient
   (`background-clip: text`, transparent color). These cases are decided by eye, on a screenshot.
2. **Intentional vs accidental overlap.** Deemed intentional: an element
   (or one of its first 6 ancestors) in `position: absolute/fixed/sticky`, with an
   explicit non-zero `z-index`, in `pointer-events: none`, or carrying a `transform`.
   An overlap produced by a negative margin is still reported — it is the most frequent
   accidental pattern. `--allow-overlays false` removes all these excuses.
3. **Line-box bleed.** Two stacked boxes that bite into each other by
   less than half a line are ignored (descenders of a tight `line-height` heading).
4. **Why two predicates for a single check.** `scrollWidth − clientWidth` is the
   *scrollable* overflow region, not the *visible* overflow. Measured in Chromium:
   it is **13** when the ink leaves by **21px**, and **0** when it leaves by **40px toward
   the start** (negative `text-indent`, `direction: rtl`) — that side is not part of the
   scrollable region. Hence the second measurement: the union of the rectangles of the element's
   *own* text compared with its content box, on both sides (`--ink`, default 2px). It only
   looks at **direct child** text nodes — the text of a positioned descendant
   legitimately leaves its ancestor's box. On a `display: inline` box,
   `scrollWidth`/`clientWidth` are 0: only the ink decides then.
   Covered by neither: generated content `::before`/`::after`, which
   is painted but is not a DOM text node.
5. **Content revealed on scroll.** `prefers-reduced-motion: reduce` is emulated by
   default, which is enough on a page that honors it. Otherwise, everything waiting for an
   IntersectionObserver stays at opacity 0 and **is not measured**: the
   `hidden-text` check then counts these elements and reports it in `warnings`. A report with
   this warning is rerun with `--warmup`.
6. **States.** A single pass, no interaction: no `:hover`, no `:focus`, no open menu,
   no inactive tab (`display: none` is ignored, not reported).
7. **Cap.** The `overlap` check compares at most 400 elements pairwise
   (`--max-elements`); beyond that, the rest of the page is not compared.

## Prerequisites

No dependency added to the repo. The script resolves, in order: `LAYOUT_CHECK_PLAYWRIGHT`,
`playwright`, `playwright-core`, then the `playwright-core` bundled by a globally installed
`@playwright/mcp`. It launches the **system Chrome** (`channel: "chrome"`) and falls back on
Playwright's Chromium if absent — so no `playwright install` required.
