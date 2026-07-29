# Cursor — Design System

Register: **brand**. Scope: FULL (single marketing homepage).
Design Read: coding-agent product homepage; vibe = warm paper, unstyled on purpose, calm,
carried entirely by product mockups; constraints = static HTML/CSS/JS opening offline, light
**and** dark themes both first-class, breakpoints redefined at 420 / 660 / 900 / 1140px.
Dials: `DESIGN_VARIANCE 3` · `VISUAL_DENSITY 5` · `MOTION_INTENSITY 3`.

Tone (one extreme): **release-note flatness.** Sentences state what the product does and
stop; the headings are complete sentences ending in a period — "Cursor is your coding agent
for building ambitious software.", "The new way to build software.", "Try Cursor now."
The copy never stacks benefit adjectives and never addresses the reader with a promise; the
only enthusiasm on the page is quoted from someone else, inside a `<blockquote>`.

Signature element: **the floating product window.** A rounded chassis with three chrome dots
and a monospaced body, anchored by percentage over a soft two-tone plate. It carries the hero
twice (Cursor Desktop as a triptych — agent flank, browser preview, chat panel — plus Cursor
CLI bottom-right), returns in feature block 3 as a Slack window and a second CLI, and again
inside the phone chassis of the trio. Its mount is the second half of the idea: every feature
block is drawn as **two stacked layers** on the same 24-column grid — a `.carte` layer holding
text and surface, and a transparent layer holding the media — so the window overhangs the card
instead of being boxed by it.

## Macrostructure

Name: **Ramp and Newsroom.**

Order of the body, read on `index.html`:

1. `header.entete` — fixed, a three-column grid that swaps order at 900px; two flyout groups;
   a full-screen mobile panel animated on `opacity` alone.
2. Hero — one h1 sentence, three buttons (two hidden below 660px), then the scene: a
   full-bleed plate carrying the two floating windows.
3. Logo garden — eight logos under a single `t-sm` line, in **primary** ink, not muted.
4. Four feature blocks, alternating sides on the 24-column grid (text 1→9, then 17→25):
   *Agents turn ideas into code* · *Works autonomously, runs in parallel* · *In every tool, at
   every step* · *Automate repetitive work*.
5. Quote wall — six cards under "The new way to build software."; three of them appear only
   above 660px.
6. Trio — "Stay on the frontier", three cards, a single breakpoint at 1140px.
7. Changelog — a scroll-snap track of four dated cards with prev/next buttons; the fourth
   card hides between 900 and 1140px, where the grid has only three columns.
8. Team card — the same two-layer template as the feature blocks, one sentence and "Join us".
9. Recent highlights — a second scroll-snap track, identical mechanism.
10. Closing CTA — "Try Cursor now.", a title-only section.
11. `footer.pied` — five link columns and a language selector reusing the nav's menu.

Absent from the canonical skeleton: **no pricing section**, **no FAQ**, **no numbered
how-it-works steps**, **no metrics band**, **no comparison table**, and — the most telling
gap — **no form and no input anywhere on the page**: zero email capture, zero lead gate. The
canonical testimonial block survives but is reshaped into a six-card wall rather than a
carousel, and the canonical feature grid is split in two (four full-width blocks, then a
three-card trio).

Principle of organisation: **the body climbs an autonomy ramp, then hands over to dated
evidence.** The four blocks run from *you ask, it writes* to *it runs alone*, to *it lives in
your other tools*, to *it works with no ask at all*; everything after the quote wall is
recency — a changelog and a highlights feed — not argument. Nothing is ordered by buyer
segment or by benefit.

## Design Reference

Source: https://cursor.com/ — a Next.js build; the scraped export carries the whole `<body>`
twice and is mostly RSC payload, so its byte count measures nothing.
The palette is a warm off-white paper with one burnt-orange signal, mirrored into a warm dark
theme; every neutral is derived from the ink by `color-mix`, never hard-coded.

### Colors

```css
--fond-page:         #f7f7f4;
--texte-primaire:    #26251e;
--texte-primaire-02: #3b3a33;
--accent:            #f54e00;
--surface-01: #f2f1ed;  --surface-02: #f0efeb;  --surface-03: #ebeae5;
--surface-04: #e6e5e0;  --surface-05: #e1e0db;  --surface-chaude: #f3ede6;
--texte-secondaire: color-mix(in oklab, var(--texte-primaire) 60%, transparent);
--texte-median:     color-mix(in oklab, var(--texte-primaire) 50%, transparent);
--texte-tertiaire:  color-mix(in oklab, var(--texte-primaire) 40%, transparent);
--filet-discret: 2.5% · --filet-faible: 5% · --filet-moyen: 10% · --filet-marque: 20%
--diff-ajout: #1f8a65;  --diff-retrait: #cf2d56;
/* dark, same names: --fond-page #14120b · --texte-primaire #edecec
   · --surface-01…05 #1b1913 → #2b2923 */
```

Strategy: **neutral plus one accent, both themes mirrored.** Every grey — text ramp and
hairline ramp alike — is a `color-mix` percentage of the single ink, so swapping two variables
swaps the whole system. The accent appears **five times in the entire sheet**: link colour,
its hover mix, the terminal prompt, the install command, the added-line marker. It is never a
button fill, never a background. The theme swap is two-way by construction:
`@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` plus an explicit
`[data-theme="dark"]`, so a light choice survives a dark device.

Contrast, computed from the relevé hex [estimé]: primary on page ≈14.3:1 · `--texte-secondaire`
(the 60% mix that carries most body prose) ≈4.1:1 · `--accent` on page ≈3.3:1, used on links
only. The last two sit under 4.5:1; recorded as observed, not corrected — the page is frozen.

### Typography

```css
--police:      system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", …;
--police-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, …;
```

**No text webfont at all.** The source's single font file is an icon face, and its glyphs are
replaced here by Unicode characters — so nothing is fetched and nothing can FOUT. The mono
stack is not decoration: it is the material of every product surface (terminals, diffs, config
rows, window bodies). Scale: ten steps, `.6875 · .75 · .8125 · .875 · 1 · 1.125 · 1.375 ·
1.625 · 2.25 · 3.25 · 4.5rem`, and each type class sets size, line-height **and** tracking
together — none of them ever sets one alone. Line-heights run 1.1 → 1.5, tracking from +.01em
at small sizes down to −.03em at display. Every heading is `font-weight: 400`; there is no bold
display weight in the system. Measure is capped by named containers (`.mesure`, `.mesure--large`,
`.mesure--etroite`), never by a raw `ch` value.
Never used: Inter, Geist, any display serif, any variable webfont, any italic.

### Spacing

Two units, and everything is a fraction of them: `--pas-h: .625rem` horizontal,
`--pas-v: 1.4rem` vertical. Measures read `calc(var(--pas-v) * 8/12)`, `* 9/12`, `* 2.5/12`,
`* 2`, `* 3`, `* 5` — a twelfth-based scale, not an 8pt grid. `.section` is
`3×pas-v 2×pas-h`; the first section of `main` opens at `5×pas-v`. Container max 1300px,
header 56px (52px above 900px). The 24-column grid exists only **inside** large cards, never
on the page itself. Density profile: airy between sections, dense inside every mockup.

### Motion

`MOTION_INTENSITY 3`. One reveal keyframe carries the whole page: `opacity 0 → 1` with
`translateY(25%) → 0`, `1s`, `cubic-bezier(.25, 1, .5, 1)`, staggered by `--rang × 60ms`.
Its mechanism is the point — the animation is **always declared and paused**, and JavaScript
only lifts the pause; JS never sets `opacity: 0`. So a missing, blocked or failed script
leaves every section visible, and `@media (scripting: none)` is kept as a second belt.
Interface states run at `.14s` / `.15s` / `.2s`. **Buttons and cards declare no transition at
all** — their colour change on hover is instant, and that is a decision, not an omission: time
is spent only on what appears or disappears. Materials are `opacity`, `transform` and
`background-position` (the shimmer); `transition-transform` is virtually absent, movement goes
through keyframes instead. One curve for everything that enters, `linear` for everything that
loops. Nothing else.

`prefers-reduced-motion: reduce`: a global 1ms clamp on all durations and delays, the reveal
animation removed outright so elements return to their native visible state, ambient loops
stopped on a **legible** frame (activity bars held at `.72` opacity, the shimmer falling back
to a flat secondary colour rather than transparent text), `scroll-behavior: auto`, and JS
`scrollBy` forced to `'instant'` because the scroll API ignores the preference by itself.

## Absolute bans observed

No animation library and no third-party script of any kind. No webfont for text. No
`backdrop-filter` anywhere — zero occurrences. Text clipped to a gradient appears exactly once,
as the shimmer of a loading placeholder. No modal, no overlay, no cookie banner. No form, no
input, no email capture. No border-radius between 10px and 22px, and none above 44px except the
`999px` pill. No hero metrics, no pricing table, no FAQ accordion. No paraphrased copy: every
heading and every quote is verbatim, with its real author.
