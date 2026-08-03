# Tokens — dispatch

Reproduction of **the source** under an identity of its own: the brand
**Sodium**, an anthracite + sodium orange palette, four local photographs.
The product does not change: a newsletter platform driven from the command
line and through MCP, billed per send.

Every command below reads the source through `$SRC`, and the page fetched from
it through `source.html`:

```bash
SRC="…"   # the source URL is not published in this corpus
curl -sL "$SRC" -o source.html
```

Three markers are used throughout this document:

- `[relevé]` — value read on the source. The HTML it serves is
  compiled Tailwind v4: the utility classes **are** the values, so there is
  nothing to guess. Reference command:
  `perl -0777 -pe 's/></>\n</g' source.html | grep -nE '<(section|h1|h2|h3)[ >]'`
- `[arbitrage]` — decision of this rebuild, not deducible from the source.
- `[estimé]` — computed, not measured directly.

---

## 1. Motion

### 1.1 What the source actually exposes

The source renders its motion with Framer Motion. The runtime is not readable
from the delivered HTML: **no** application `@keyframes`, **no** entrance
`transition` in the sheet. What IS readable are the resting states written into
`style` attributes by the server render. Counts:

```
grep -o 'opacity:0;transform:translateY(24px)' source.html | wc -l
→ 58
grep -o 'translateY(110%)' source.html | wc -l
→ 2
grep -o 'translateY(32px)' source.html | wc -l
→ 2
```

Three amplitudes, and three only: **24px** for an ordinary block (58
occurrences), **32px** for the two large panels (the page-builder panel, the
closing block), **110 %** for the two lines of the `h1`, which live inside an
`overflow: hidden` mask. [relevé]

So there is, across the whole page, **no** resting state starting from a `scale`,
a `blur`, a rotation or a `clip-path`. It is a deliberately poor entrance
vocabulary: opacity + vertical translation, nothing else. Reproduced as is —
`styles.css` §18.

### 1.2 Durations and curves

No entrance duration is readable on the source. Every duration on this page is an
`[arbitrage]`, but none is hard-coded in `motion.js`: they live in CSS variables,
and `motion.js` only sets classes.

| Role | Value | Status |
|---|---|---|
| response (hover, tab, focus) | `--duree-court: 200ms` | [relevé] `duration-200` on the cards |
| reveal of a halo | `--duree-moyen: 300ms` | [relevé] `duration-300` on the spotlight |
| appearance of a block | `--duree-long: 700ms` | [arbitrage] |
| rise of a headline line | `900ms` | [arbitrage] |
| counter | `1400ms` | [arbitrage] |
| demo gauge | `1600ms` | [arbitrage] |
| accordion chevron | `--duree-moyen` | [relevé] `duration-300` on the source |

Two curves only. `cubic-bezier(0, 0, .2, 1)` (`--courbe-sortie`) for everything
that is a response — it is the `ease-out` curve the source defines in its
`:root` [relevé, `--ease-out:cubic-bezier(0,0,.2,1)`]. `cubic-bezier(.22, 1,
.36, 1)` (`--courbe-douce`) for entrance translations [arbitrage].
No bounce, no overshoot, no elasticity — the source contains none, and that is
not a choice one improves on.

Verification: `grep -c 'transition' styles.css` → **17**. Seventeen declarations
for seventeen blocks, each one naming its properties explicitly
(`transition: border-color …, background-color …, transform …`), never
`transition: all`.

### 1.3 The three periodic animations

`grep -c '@keyframes' styles.css` → **3**, and not one more.

1. `descente` — the SCROLL tick under the hero, 2.2s, the upper half of a
   28px rule that travels down then holds still for 40 % of the cycle. The source
   animates the same bar; its duration is not readable. [relevé for the
   procedure, arbitrage for the duration]
2. `battement` — the terminal cursor, 1.1s in `steps(1, end)`. The source
   uses `animate-pulse` (2s, `cubic-bezier(.4,0,.6,1)`), a soft pulse.
   Replaced by a hard blink: a terminal cursor does not breathe.
   [arbitrage, owned; deviation documented §12]
3. `remplir` — the gauge in the Demo section, `scaleX(0 → 1)` over 1.6s, played
   once only. Does not exist on the source, whose section is empty. [arbitrage]

All three are gated on `html.js-motion`, so absent without JS and absent under
reduced motion.

### 1.4 The resting contract

Non-negotiable rule, inherited from the corpus: **the CSS never hides anything of
its own accord.** The `opacity: 0` states are written under the selector
`html.js-motion [data-reveal]`, and the `js-motion` class is set on `<html>`
only by `motion.js`, and only if it can lift it again (JS active,
`IntersectionObserver` available, `prefers-reduced-motion` not declared). Without
the script, the page arrives fully painted.

`grep -o 'data-reveal' index.html | wc -l` → **58** observed blocks, against
**58** resting states at 24px on the source (§1.1). The two counts coincide:
entrance coverage is reproduced block for block, not approximated.

### 1.5 Disarming

Three observers are armed on load: the reveals, the counters, the demo gauge.
All three call `self.unobserve(entry.target)` inside their callback — the
**second parameter of the callback IS the observer**, which avoids capturing the
variable before it is assigned. Corpus models:
`supercommon-recode/motion.js:43`, `linear-recode/motion.js:37`.

`unobserve(target)` targets one element, `disconnect()` stops them all: all three
are `disconnect()`ed on `pagehide`, with the parallax's `requestAnimationFrame`
loop cancelled in the same place. The parallax also cancels its pending frame on
`visibilitychange` when `document.hidden` — a backgrounded tab must not keep a
frame in flight.

### 1.6 Reduced motion

`matchMedia('(prefers-reduced-motion: reduce)')` is read **at the top of the
file**, before any observer, and followed with `addEventListener('change', …)`
(`addListener()` is deprecated). If the preference flips mid-session, the handler
sets `is-in` on everything — a hidden block is never left behind.

On the CSS side, the `@media (prefers-reduced-motion: reduce)` block does not
merely overwrite the durations: it explicitly restores `opacity: 1; transform:
none` on `[data-reveal]` and `[data-ligne]`. Overwriting the duration alone would
leave the page blank.

---

## 2. Colours

### 2.1 The source

Background `#050508`, a blue-black. Accent `#7aa8ff` (terminal caret, step
numerals, slider fill), `#cfe4fa` for the heading italics, `#a8cdf0` for the
counters, `#8eafc8` for the mono eyebrows. Terminal colouring:
`#f5a97f` (peach) for tool calls, `#9cd6ae` (sea green) for successes.
macOS dots `#ff5f57` / `#febc2e` / `#28c840`. [relevé]

Every surface and every hairline is a white opacity:
`bg-white/[0.02]`, `bg-white/[0.03]`, `bg-white/[0.05]`, `bg-white/[0.06]`,
`border-white/5`, `border-white/8`, `border-white/10`, `border-white/15`. [relevé]

### 2.2 This page

The brief imposes **anthracite + sodium orange**. The opacity structure is taken
over identically; only the chromatic family changes.

```css
--fond-page:      #0b0b0e;   /* anthracite, slightly warm */
--fond-terminal:  #131216;
--fond-pilule:    #131217;
--sodium:         #ff8c2b;   /* single accent */
--sodium-clair:   #ffb066;
--ambre:          #ffcf9b;
--ambre-sourd:    #c99a6a;
--or-pale:        #f0d08a;
--terre:          #c98f5a;
```

Role-for-role correspondence with the source:

| Role | Source | Sodium |
|---|---|---|
| page background | `#050508` | `#0b0b0e` |
| terminal background | `#0b0d13` | `#131216` |
| caret `❯`, step numerals, tick | `#7aa8ff` | `#ff8c2b` |
| heading italics | `#cfe4fa` | `#ffcf9b` |
| band counters | `#a8cdf0` | `#ffb066` |
| mono eyebrows | `#8eafc8` | `#c99a6a` |
| tool call `⏺` | `#f5a97f` | `#c98f5a` |
| success `✓` | `#9cd6ae` | `#f0d08a` |
| terminal drop glow | `rgba(88,143,255,.35)` | `rgb(255 140 43 / .30)` |
| card spotlight | `rgba(122,168,255,.09)` | `rgb(255 140 43 / .12)` |

The spotlight goes from 9 % to 12 %: orange is less luminous than blue at equal
opacity on a dark background, and 9 % was not visible. [arbitrage, measured by
eye on the render]

### 2.3 The terminal dots

The source sets the three literal macOS dots. Keeping them here would have
introduced a red and a green into a page that carries neither anywhere else.
They become a **ramp rising toward the sodium**:
`#4a4a52` → `#8a6a3a` → `#ff8c2b`. The procedure — three 12px discs aligned to
the left of a title bar — is intact; the colour follows the palette.
[arbitrage, deviation documented §12]

### 2.4 Contrasts

On `#0b0b0e` (relative luminance ≈ 0.0043) [estimé]:

| Token | Ratio | Use | Verdict |
|---|---|---|---|
| `#fff` | 18.6:1 | headings, terminal body | ✅ |
| `rgb(255 255 255 / .90)` | 15.0:1 | FAQ triggers | ✅ |
| `rgb(255 255 255 / .55)` | 6.6:1 | card body, lists | ✅ |
| `rgb(255 255 255 / .50)` | 5.9:1 | mono captions, footer links | ✅ |
| `rgb(255 255 255 / .35)` | 3.5:1 | code comments | ⚠️ decorative |
| `#ff8c2b` | 8.7:1 | caret, numerals, ticks | ✅ |
| `#ffb066` | 11.9:1 | counters | ✅ |
| `#c99a6a` | 7.2:1 | eyebrows | ✅ |
| `#f0d08a` | 13.4:1 | terminal successes | ✅ |

Only one token under 4.5:1: `--texte-35`, reserved for the **comment and echo
lines** inside the code blocks (`$ claude`, `subject lines + body drafted`).
Those lines are the trace of a machine, not information to be read; the source
makes exactly the same choice with `text-white/35`. No meaning-bearing text is
written there. Every token of the source that sat at `white/40` on readable text
(footer links, captions) is **raised to 50 %** here. [deviation §12]

---

## 3. Typography

### 3.1 The families, relevées

`curl -s "$SRC/_next/static/chunks/3d9uy71yrg96g.css"` yields four
`@font-face`:

| Family | Source variable | Role |
|---|---|---|
| **Geist** (100–900) | `--font-sans` | body, buttons, nav |
| **Geist Mono** (100–900) | `--font-mono` | code, eyebrows, numerals, captions |
| **Instrument Serif** (normal + italic, 400) | `--font-elegant` | every heading |
| Space Grotesk (300–700) | `--font-caption` | **never applied** |

Space Grotesk is loaded by the source but no rule uses it:
`grep -c 'font-caption' source.html` → 0 outside the module declaration. It is
not loaded here. [relevé]

The other three are taken over as they are from Google Fonts, with
`display=swap` and two `preconnect`. Reproducing a typography means reproducing
the fonts; substituting them would have been a rewrite, not a reproduction.

### 3.2 The scale, relevée class by class

| Element | Source | Rendered | Sodium |
|---|---|---|---|
| `h1` | `text-5xl sm:text-7xl lg:text-8xl` | 48 / 72 / 96px | identical |
| `h1` line height | `leading-[1.04]` | 1.04 | identical |
| `h1` tracking | `tracking-[-0.01em]` | −0.01em | identical |
| `h1` shadow | `0 2px 40px rgba(0,0,0,.45)` | — | identical |
| section `h2` | `text-4xl sm:text-5xl` | 36 / 48px | identical |
| section `h2` line height | `leading-tight` | 1.25 | identical |
| manifesto `h2` | `text-3xl sm:text-4xl` | 30 / 36px | identical |
| manifesto `h2`, line height | `leading-snug` | 1.375 | identical |
| closing `h2` | `text-4xl sm:text-6xl` | 36 / 60px | identical |
| card `h3` | `text-xl` | 20px | identical |
| plan `h3` | `text-2xl` | 24px | identical |
| prices, counters | `text-5xl sm:text-6xl` | 48 / 60px | identical |
| calculator verdict | `text-3xl sm:text-4xl` | 30 / 36px | identical |
| hero subtitle | `text-lg sm:text-xl` | 18 / 20px | identical |
| section body | inherited `1rem` | 16px | identical |
| card body | `text-sm` | 14px | identical |
| terminal body | `text-[13px]` | 13px | 13px → 14px < 480px |
| tabs, chips | `text-xs` | 12px | 12px → 14px < 480px |
| eyebrow | `text-[11px]` | 11px | 11px → 14px < 480px |
| SCROLL | `text-[10px]` | 10px | 11px → 14px < 480px |

Body line height is `leading-relaxed` everywhere, that is **1.625** [relevé], and
not the default 1.5. Taken over.

### 3.3 Italics as the only typographic accent

The source's central procedure, reproduced without reservation: every `h2` is cut
into two clauses, the second wrapped in an `<em>` that is **both** italic
(Instrument Serif has a genuinely drawn italic) and coloured.

```
grep -o '<em class="text-\[#cfe4fa\]">' source.html | wc -l  → 9
```

Nine headings out of twelve follow that pattern on the source. Here, eight out of
twelve — the same exceptions (the headings with a `<br />`, which are two
sentences on two lines rather than one cut sentence). The `<em>` carries
`--ambre` (`#ffcf9b`).

No weight above 400 on any serif. The page's only 600 is the primary white button
[relevé, `font-semibold`]. No `letter-spacing` outside mono.

### 3.4 Mono as the voice of the machine

Geist Mono never serves as body text. It serves: the eyebrows (.35em of
tracking), the hero chips, the tabs, the two code blocks, the terminal title
bar, the `→` bullets of the page builder, the calculator's tickmarks, the
portrait caption, the signature line, the whole footer. That is the same
distribution as the source, element for element.

Tracking by role [relevé]: eyebrow `.35em` · SCROLL and footer titles `.3em` ·
step numeral `.3em` · calculator eyebrow `.25em` · demo time marker `.2em` ·
calculator label `.025em` · everything else at 0.

---

## 4. Structure and rhythm

### 4.1 The vertical step

One single inter-section interval across the whole page:

```
grep -o 'pb-28 sm:pb-36' source.html | wc -l  → 9
grep -o 'py-28 sm:py-36' source.html | wc -l  → 3
```

Twelve sections out of twelve, **112px then 144px beyond 640px**. No section has
a step of its own. Reproduced by `--pas-section: 7rem` / `--pas-section-sm: 9rem`,
applied by `.section` and `.section--large` — `grep -c 'pas-section' styles.css`
→ 7 uses for 2 declarations.

Two exceptions relevées and taken over: the figures band at `py-24 sm:py-28`
(96/112px, tighter because it is bordered) and the footer at `py-16 sm:py-20`.

### 4.2 The widths

| Container | Source | Sodium |
|---|---|---|
| hero frame | `max-w-[1400px]` | `1400px` |
| header pill | `max-w-3xl` = 48rem | `48rem` |
| hero terminal | `max-w-3xl` = 48rem | `48rem` |
| page body | `max-w-6xl` = 72rem | `72rem` |
| section header | `max-w-2xl` = 42rem | `42rem` |
| manifesto | `max-w-2xl` centred | `42rem` centred |
| section paragraph | `max-w-xl` = 36rem | `36rem` |
| hero subtitle | `max-w-xl` = 36rem | `36rem` |
| counter caption | `max-w-[220px]` | `220px` |
| side margin | `px-6` = 24px | `24px`, mobile and desktop |

The side margin does **not** change between 360px and 1440px on the source.
Taken over.

### 4.3 The grids

| Section | Source | Items |
|---|---|---|
| How it works | `md:grid-cols-3` | 3 |
| The platform | `sm:grid-cols-2 lg:grid-cols-3` | 6 |
| Integrations | `sm:grid-cols-2 lg:grid-cols-4` | 4 |
| Pricing | `lg:grid-cols-3`, `items-stretch` | 3 |
| Band | `sm:grid-cols-2 lg:grid-cols-4` | 4 |
| Builder, Why | `lg:grid-cols-2` | 2 |
| FAQ | `lg:grid-cols-[0.8fr_1.2fr]` | — |
| Footer | `md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]` | 4 |

All identical here, **including the item counts**: 3, 6, 4, 3, 4, 6 FAQ entries,
3 link columns in the footer. Information density is a given of the
reproduction, not a variable.

Gutter: `gap-4` = **16px** everywhere [relevé]. One single exception, the FAQ and
the duos at `gap-12 lg:gap-20` (48/80px).

### 4.4 The radii

`rounded-[32px]` for the three large photographic frames (hero, builder panel,
closing) · `rounded-[28px]` for the portrait and the calculator card ·
`rounded-3xl` = 24px for every card and both terminals ·
`rounded-2xl` = 16px for the chat overlay · `rounded-xl` = 12px for the icon
token · `rounded-full` for the header pill, the buttons, the chips, the dots,
the slider thumb. [relevé, five values and not one more]

### 4.5 The hairlines

Four opacities and nothing else: 5 % (list separators, band and footer borders),
8 % (cards, accordions, calculator separator), 10 % (photographic frames,
terminals, pill), 15 % (card hover, eyebrow pill).
[relevé]

### 4.6 The overlap

The page's only negative offset, and its compositional signature: the hero
terminal carries `-mt-24`, that is **−96px** [relevé]. It bites into the
photographic frame. Its section carries `relative z-10` to pass above it.
Reproduced identically (`margin-top: -6rem`).

---

## 5. The code block as technical proof

This is the rare procedure of this reference, together with the calculator. The
source does not say "it is simple", it **prints the session**.

### 5.1 The chassis

Identical for both blocks, relevé to the pixel:

- title bar: `px-5 py-3.5` (20/14px), `border-b border-white/[0.06]`,
  `bg-white/[0.02]`, three `size-3` discs (12px) spaced 8px apart, a 12px mono
  title at `ml-3`, and for the first block a status badge pushed right
  (`ml-auto`, 1px pill, `px-3 py-1`, 6px dot, 10px mono)
- tab strip: `px-4 py-2.5 sm:px-5`, `overflow-x-auto`, 12px mono,
  `rounded-full px-3 py-1` buttons, the active one at `bg-white/[0.06] text-white`,
  the others at `text-white/40` with hover at 70 %
- body: `px-6 py-6 sm:px-8`, 13px mono, `leading-relaxed`, floor height
  **312px** for the terminal and **264px** for the code block, so that a tab
  change never makes the page jump
- drop shadow: `shadow-[0_40px_120px_-30px_…]` — 120px of blur, 30px of
  contraction, tinted with the accent. The page's only coloured `box-shadow`.

### 5.2 The grammar of the session

Five line roles, all relevés, all reproduced:

| Role | Marker | Source colour | Sodium colour |
|---|---|---|---|
| command echo | `$ ` | `white/35` | `--texte-35` |
| human input | `❯` | `#7aa8ff` + `white/90` | `--sodium` + `--texte-90` |
| tool call | `⏺` | `#f5a97f` | `--terre` |
| tool name / note | — | `white/75` / `white/35` | `--texte-75` / `--texte-35` |
| success | `✓` | `#9cd6ae` | `--or-pale` |

The tool calls are grouped in a block with a **left rule** (`border-l
border-white/[0.08] pl-4`): it is that rule which makes the sequence read as an
execution sub-tree rather than as a list. [relevé, essential procedure]

The last line carries a cursor: a 7 × 14px rectangle offset 2px downward.
[relevé, `h-[14px] w-[7px] translate-y-[2px]`]

### 5.3 The syntax colouring

The brief forbids a generic imported theme. The seven classes in `styles.css`
are derived from the five palette values:

```css
.cd-pale { color: var(--texte-35); }   /* comment, echo */
.cd-cmd  { color: var(--sodium); }     /* the typed command */
.cd-ok   { color: var(--or-pale); }    /* success, numeric literal */
.cd-cle  { color: var(--sodium-clair);}/* object key, property */
.cd-txt  { color: var(--terre); }      /* string */
.cd-mot  { color: var(--ambre); font-style: italic; }  /* keyword */
.cd-num  { color: var(--or-pale); }
```

The keyword (`import`, `const`, `await`) is the block's only **italic** token:
it echoes the heading italics, inside the machine. [arbitrage]

### 5.4 The four tabs

The source exposes: *Automatic setup*, *MCP*, *Skill + CLI*, *TypeScript SDK*.
Taken over identically in role and in number, with real Sodium content: the
`pnpm dlx sodium setup` session, an `.mcp.json`, three CLI commands, and seven
lines of TypeScript SDK. All four panels are **written out in full** — the source
too ships all four of them in its HTML.

### 5.5 The legibility floor

The body is at 13px on the source. At 360px, 13px of mono falls below the gate's
floor. `--t-mono` is therefore 13px by default and **14px below 480px** — a single
media query, seven variables, no duplicated rule. Verified on the capture: the
terminal's longest line (`✓ Sent to 3,104 subscribers · est. open rate
46.8%`) wraps onto two lines at 360px without overflowing, because each line is a
`flex` container with `flex-wrap`. The code block's `<pre>`, on the other hand,
does not wrap: it carries `overflow-x: auto` and scrolls **inside its frame**,
never inside the page.

---

## 6. The interactive calculator

### 6.1 The scale, demonstrated rather than assumed

The source sets:

```html
<input type="range" min="3" max="6" step="0.01" value="4.698970004336019">
```

`4.698970004336019` is exactly `log10(50000)`. And the four tickmarks under the
track sit at `0 %`, `15.904041823988754 %`, `66.66666666666666 %`,
`100 %` for `1K`, `3K`, `100K`, `1M`. Check:

- `(log10(3000) − 3) / 3 = (3.47712 − 3) / 3 = 15.904 %` ✓
- `(log10(100000) − 3) / 3 = (5 − 3) / 3 = 66.667 %` ✓

The scale is therefore **log10 from 1,000 to 1,000,000**, with no ambiguity
possible. [relevé, demonstrated]

Reproduced as is: `min="3" max="6" step="0.01" value="4.7"`, same tickmarks at
the same percentages, written inline as `style="left:…"` just as on the source.

### 6.2 The rounding

The source displays `50,000` for a slider value of `4.69897`, that is exactly
50,000. So it rounds to a readable step. The rule is not readable in the HTML;
Sodium's is explicit in `motion.js`:

```js
var pas = v < 10000 ? 100 : v < 100000 ? 1000 : 10000;
return Math.max(1000, Math.round(v / pas) * pas);
```

Three steps, floor at 1,000. [arbitrage]

### 6.3 The pricing tiers

Sodium's figures, not the source's:

| Plan | Base | Included | Beyond |
|---|---|---|---|
| Free | $0 | 3,000 | — (unavailable) |
| Standard | $18 | 25,000 | $0.60 / 1,000 |
| Scale | $180 | 500,000 | $0.40 / 1,000 |

`cost(p, v) = v ≤ included ? base : base + ceil((v − included) / 1000) × thousand`,
and `Free` returns `Infinity` beyond 3,000 since it bills no overage. The verdict
is the **minimum** of the three, exactly as the source announces "the
lowest-cost plan".

Standard / Scale crossover: Standard reaches $180 at
`25000 + (162 / 0.60) × 1000 = 295,000` sends; beyond that, Scale wins. The
calculator therefore switches over by itself around 300,000, which makes the
pricing readable without a single sentence explaining it. [estimé, verified on
the render]

Three values checked on the rendered page:

| Slider | Volume displayed | Verdict |
|---|---|---|
| `3.30` | 2,000 | `Free — $0/month` |
| `4.70` (default) | 50,000 | `Standard — $33/month` |
| `5.90` | 790,000 | `Scale — $296/month` |

`180 + ceil((790000 − 500000) / 1000) × 0.40 = 180 + 290 × 0.40 = 296` ✓

### 6.4 Styling the `<input type=range>`

No unified standard selector has ever replaced the prefixed pseudo-elements:
styling a track and a thumb requires **both families**.
`styles.css` §14 therefore declares `::-webkit-slider-runnable-track` +
`::-webkit-slider-thumb` **and** `::-moz-range-track` + `::-moz-range-progress` +
`::-moz-range-thumb`. [verified on MDN for this project]

The fill is handled differently per engine, because Gecko has a dedicated pseudo
and Blink does not:

- Gecko: `::-moz-range-progress` paints the travelled segment, nothing to compute.
- Blink: the track carries a `linear-gradient` whose break point is
  `var(--remplissage)`, a variable `motion.js` rewrites on every `input`.

The thumb is 18px rather than the source's 12px: at 12px the touch target fell
far below the field's 24px, and the focus halo was not legible. [arbitrage]

Focus state: `outline: 2px solid var(--sodium-clair)` with `outline-offset:
6px`, plus a 6px ring on the thumb on hover **and** on keyboard focus — the
source sets its ring on focus only.

### 6.5 Accessibility

A real `<label for="volume">`, `<output for="volume">` for the value,
`aria-describedby` pointing at the verdict block, and `aria-live="polite"` on
that block — the screen reader announces the new plan without interrupting. That
is the source's arrangement [relevé, `aria-live="polite"` on the verdict
container], completed with the `label`/`output` the source replaces with an
`aria-label`.

---

## 7. Images

**Unlike the ten historical references in the corpus, this page's media are
local.** Four `.webp` in `img/`, generated for the anthracite + sodium palette.

| File | Dimensions | Weight | Role | Loading |
|---|---|---|---|---|
| `img/hero.webp` | 1920 × 640 | 37 KB | hero background | `fetchpriority="high"` |
| `img/trails.webp` | 1920 × 1280 | 125 KB | builder panel | `loading="lazy"` |
| `img/nebula.webp` | 1920 × 2880 | 321 KB | "why" column | `loading="lazy"` |
| `img/glow.webp` | 1920 × 1280 | 29 KB | closing block | `loading="lazy"` |

All four carry real `width` / `height`, so no layout shift on load. All four
carry an `alt` describing the **content**, never the role.

Correspondence with the source: it uses `aether-falls.jpg` (hero),
`aether-ember.jpg` (builder), `aether-beam.jpg` (closing) and `me.png`
(portrait). Three skies and one person. Here: four skies.

Treatment, identical to the source in procedure:

- **hero** — the image layer overflows by 5rem top and bottom (`-inset-y-20`
  on the source), which gives the parallax its margin; over it, a flat veil
  (`bg-[#050508]/25` → `rgb(11 11 14 / .3)`) then a gradient rising over the
  bottom third (`from-[#050508]/80` → `.8`, the source's value) to seat the text.
  **Framing.** The photograph is 1920 × 640, that is **3:1**, for a slot taller
  than it is wide (≈ 1400 × 960 on desktop, parallax margin included).
  `object-fit: cover` therefore locks it on **height** and crops only the sides:
  the whole height is visible, from the anthracite star field at the top down to
  the low sodium glow. Its composition being horizontally homogeneous,
  `object-position: 50% 50%` is enough and loses no focal point. [relevé on the
  image, arbitrage on the framing]
  **Consequence on two pieces of text.** The glow occupies the lower third of the
  frame, exactly where the chip row and the word SCROLL fall. At the source's
  opacities (`text-white/60` and `text-white/40`) they fell below the contrast
  floor **on this photograph**: both were raised to 75 % and receive a
  `text-shadow: 0 1px 12px rgb(0 0 0 / .55)`, of the same order as the one the
  source already sets on its `h1` and subtitle. The `h1` itself falls on the
  starred anthracite at the top: its original `0 2px 40px rgb(0 0 0 / .45)`
  shadow is enough, and it was not touched. [deviation §12, reason: legibility on
  image]
- **builder panel** — a single gradient, more contrasted, bottom to top, because
  it has to carry the chat overlay
- **closing** — a single flat veil at 55 % (the source: 50 %)
- **"why" column** — 12 % flat veil + bottom gradient, as on the source

Ratios: `aspect-[4/3]` for the builder panel, `aspect-[3/4]` for the vertical
column, `min-h-[88svh]` for the hero. [relevé]

The interfaces are **never** images: the two terminals, the chat overlay, the
demo's browser chassis and the four application cards are HTML/CSS. That is the
source's procedure and it is reproduced without exception.

---

## 8. Components and their states

### 8.1 Buttons

Three variants, all `rounded-full`, all **52px** tall
(`h-13`) [relevé]:

- **white** — `#fff` on `#0b0b0e`, `font-semibold`, `px-8`, black drop shadow.
  Hover: white at 88 %. Active: `scale(.96)` [relevé].
- **ghost** — white border at 30 %, black background at 20 %, `backdrop-blur`.
  The hero's second button.
- **muted** — 15 % border, 6 % white background. The actions of the two
  non-featured plans; the middle plan takes the white button.

A fourth, compact form for the header: 36px tall, `text-[0.8rem]`.

### 8.2 Cards

One single component for all four grids. `border-white/8`, `bg-white/[0.03]`,
`p-7` (28px), `rounded-3xl`. Hover: `translateY(-2px)`, border at 15 %,
background at 5 %, **and** a 240px radial spotlight that follows the pointer.
200ms transition, named properties. The spotlight is disarmed under
`(hover: hover)` — no point attaching a `pointermove` on a touch screen.

`grep -o 'class="carte' index.html | wc -l` → **85** occurrences for 17 cards,
that is five classes per card on average (`carte`, `carte__halo`, `carte__corps`,
`carte__titre`, `carte__texte`).

### 8.3 Accordions

The source uses Base UI. Here, native `<details>`/`<summary>`, therefore
functional without JS. Two traps handled:

1. Hiding the marker requires **`list-style: none` on the `summary`** AND
   `summary::-webkit-details-marker { display: none }`. `::marker` alone is not
   enough. [verified for this project]
2. The chevron is drawn with two pseudo-elements rather than an SVG, so that it
   rotates 180° on `[open]` without duplicating an icon — the source ships three
   `<svg>` per trigger and hides two of them.

Target: `min-height: 2.75rem` (44px) on the `summary` [relevé, `min-h-11`].

### 8.4 Tabs

`role="tablist"` / `role="tab"` / `role="tabpanel"`, `aria-selected`,
`aria-controls`, a single `tabIndex = 0` at a time, left/right arrows moving the
selection **and** the focus. One single handler in `motion.js` serves both
groups (3 tabs and 4 tabs): it iterates over every `[role="tablist"]` on the
page.

### 8.5 Focus

`grep -c 'focus-visible' styles.css` → **4**, including one global
`:focus-visible`: `outline: 2px solid var(--sodium-clair); outline-offset: 2px`.
It is visible on a dark background, unlike the source's (`ring-white/40`, which
disappears on the light photographic areas). [deviation §12]

---

## 9. What is NOT reproduced

1. **The empty video frame.** The source's *Up and running in under a minute*
   section contains an `aspect-video` of `bg-[#0b0d13]` with a single play button
   at its centre, and nothing inside: the video does not load. That is a defect of
   the source, not a procedure. It is **replaced** here with a browser chassis
   containing a timed four-step track (0:00 / 0:11 / 0:29 / 0:52), a gauge and a
   caption — in HTML/CSS, in the same geometry and the same 32px radius. The play
   button is removed: there is nothing to play.
2. **The founder's portrait.** The source shows a real photograph of its author
   and a scanned handwritten signature. Handled in §11.
3. **Space Grotesk.** Loaded by the source, applied nowhere. Not loaded here:
   reproducing a dead load is not reproducing a design.
4. **The source's textual "Most popular" badge** is taken over in role but not in
   wording ("Most picked") — the text changes with the brand.
5. **Real links.** Every destination points to an anchor on the page. This is a
   design reference, not a deployed site.
6. **Analytics tracking** (`/stats/script.js` on the source) and the
   `theme-color` tag. Out of scope for a reference.
7. **The four applications' brand logos.** The source sets generic Lucide icons,
   not the official logos; that is also what is done here — four hand-drawn line
   icons in the HTML, no third-party brand reproduced.

---

## 10. Render checkpoints

Measurements taken on the produced page, at capture time:

| Check | Result |
|---|---|
| total height at 1365px | **10,622px** (source: 10,718px, 0.9 % difference) |
| console errors | **0** |
| horizontal overflow at 360px | none |
| smallest text rendered at 360px | **14px** |
| images loaded | 4 / 4 |
| counters reaching their target | 9s · 3,000 · 0 · 62 |
| calculator | three values verified, §6.3 |
| tabs | 3 + 4, keyboard included |
| `@keyframes` | 3 |
| `@media` | 44 |
| `transition` declarations | 17, none `all` |
| CSS variables declared | 58 |
| `motion.js` lines | 200 |

---

## 11. The portrait section — an owned deviation

The source devotes a whole section to its founder: a vertical photograph of him
in `aspect-[3/4]`, three paragraphs in the first person singular, a scanned
handwritten signature (`sign.png`, 130 × 44,
`brightness-0 invert opacity-60`), then his first name and title in mono.

This page has no founder and will not manufacture one. The brief is explicit and
the rule is right: one does not produce a person who does not exist.

What **is reproduced**: the exact geometry. Two `lg:grid-cols-2` columns
with `gap-12 lg:gap-20`, image column on the left in `aspect-[3/4]`, `max-w-lg`,
`rounded-[28px]`, drop shadow; text column on the right with an eyebrow, an `h2`
with coloured italics, three paragraphs in `flex-col gap-5`, then a signature
block at `mt-9` composed of a 130px-wide graphic mark, a name and a role in 12px
mono.

What **changes**:

- the image is `img/nebula.webp`, a sky — not a face. Its `alt` describes a star
  field, it claims nothing else.
- a caption is placed at the bottom of the image, in mono, legible:
  **"Sodium has no founder photograph on this page."** It states the absence
  instead of disguising it.
- the three paragraphs move to the **first person plural**.
- the handwritten signature is replaced by a 130px gradient rule — the same
  footprint as `sign.png` — above `the Sodium team` in serif italics, then the
  line **"Written collectively — Sodium is a team, not a person."**

No proper name is invented, no face is produced, and the source's layout is kept
in full.

---

## 12. Deviation from the source

| Element | Source | Sodium | Nature |
|---|---|---|---|
| brand | Lumail | **Sodium** | imposed |
| chromatic family | midnight blue + electric blue | **anthracite + sodium orange** | imposed |
| page background | `#050508` | `#0b0b0e` | imposed |
| photographs | 3 skies + 1 portrait, remote | 4 skies, **local** | imposed |
| copy | English, Lumail brand | English rewritten, equivalent length | imposed |
| — | — | — | — |
| section sequence | 17 blocks | **17 blocks, same order** | reproduced |
| vertical step | 112 / 144px | 112 / 144px | reproduced |
| type scale | 48→72→96 / 36→48 / 20 / 14 / 13 / 11 | identical | reproduced |
| families | Instrument Serif · Geist · Geist Mono | identical | reproduced |
| coloured heading italics | 9 headings | 8 headings | reproduced |
| terminal overlap | −96px | −96px | reproduced |
| containers | 1400 / 72rem / 48rem / 42rem / 36rem | identical | reproduced |
| grids and item counts | 3 · 6 · 4 · 3 · 4 · 6 | identical | reproduced |
| radii | 32 / 28 / 24 / 16 / 12 / full | identical | reproduced |
| hairlines | 5 / 8 / 10 / 15 % | identical | reproduced |
| entrance amplitudes | 24 / 32 / 110 % | 24 / 110 % | reproduced |
| card spotlight | 240px, follows the pointer | same, 12 % instead of 9 % | reproduced |
| slider scale | log10, 1K → 1M | identical | reproduced |
| — | — | — | — |
| Demo section | **empty frame** | timed track in HTML/CSS | defect corrected |
| text < 14px at 360px | 10 / 11 / 12 / 13px | all raised to 14px | gate floor |
| `text-white/40` on readable text | ≈4.3:1 | raised to 50 %, ≈5.9:1 | contrast |
| hero chips and SCROLL | 60 % / 40 %, no shadow | 75 % + `text-shadow` | legibility on the glow |
| focus ring | `ring-white/40` | `2px solid #ffb066` | visibility |
| terminal dots | macOS red / yellow / green | ramp toward the sodium | coherence |
| terminal cursor | `animate-pulse` 2s | `steps(1)` 1.1s | directness |
| slider thumb | 12px | 18px | touch target |
| accordions | Base UI (JS) | native `<details>` | degradation |
| Space Grotesk | loaded, unused | not loaded | cleanup |
| founder portrait | real photo + signature | sky + rule + statement | honesty (§11) |

---

## 13. The mechanical gate — passes and arbitrations

`design-review/references/pre-flight-checklist.md`, 17 items, run against the
produced files.

**Passed without reservation:**

| # | Item | Measure |
|---|---|---|
| 1 | em dash | **15** in visible copy, against **14** on the source. Density aligned: each one occupies a position the source occupies too (heading, hero CTA, terminal title, success line, manifesto signature, card body, chat, footer). Six em dashes not backed by the source were removed from the FAQ and the prose. |
| 3 | theme lock | empty grep. One single band departs from the base (`--surface-band`, white 2 %), inside the dark theme: relief, not inversion. |
| 4 | motion claimed, motion present | `MOTION_INTENSITY 7` and 17 `transition` + 3 `@keyframes`. |
| 5 | marquee | 0. |
| 6 | banned premium-consumer palette | empty grep. |
| 7 | hero ≤ 4 text elements | 4: eyebrow, `h1`, subtitle, actions. The chips and the SCROLL are **outside** the text block, in the same position as on the source. |
| 8 | cluster #1 co-occurrence | 1/3 (serif italic alone; no cream, no banned terracotta). Below the threshold of 2. |
| 9 | bounce / elastic | empty grep. Two curves, neither with a control point > 1. |
| 10 | layout-property animation | empty grep. `transform` / `opacity` / colours only. |
| 11 | render: overflow, overlap, CTA wrapping | 0 horizontal overflow at 360px; no wrapped button label; 0 console error. |
| 15 | image floor | 4 real `<img>`, local sources, descriptive `alt`, real `width`/`height`. No interface as an image. |
| 16 | motion floor | 17 `transition`, 16 `:hover`, 4 `:focus-visible`, 3 `prefers-reduced-motion`, default DOM state visible without JS. |
| 17 | legibility at 360px | smallest text rendered: **14px**. No SVG `<text>` on the page. |

**Set aside in the name of fidelity — reported, not corrected:**

- **Item 2 — uppercase eyebrows ≤ ⌈sections/3⌉.** 15 sections, cap 5.
  The page carries **12**, exactly as the source does, which carries 12 for 15
  sections. The mono eyebrow is not a template tic here: it is the element that
  names each block and the only navigational landmark on a 10,600px page with no
  table of contents. Removing them would have been remaking the page, not
  reproducing it.
- **Item 12(b) — no flat group of ≥ 3 members.** The grids of 3, 6 and 4 cards
  are identical in size by construction: no member reaches 2 × another. Half (a)
  passes comfortably (hero frame ≈ 1400 × 800 against 768 × 460 for the terminal,
  that is 3.2 ×), half (b) fails. Breaking the cards' equality would have
  destroyed the source's rhythm.
- **Item 13 — vertical rhythm at more than one value.** The whole page runs on a
  single step, 112 / 144px. That is measured on the source: `pb-28 sm:pb-36` nine
  times, `py-28 sm:py-36` three times, twelve sections out of twelve. It is an
  identifiable stance, not an absence of breathing room — and §4.1 gives the
  proof.
- **Item 14(b) — the nav shares the content gutter.** The header is a floating
  pill at `inset-inline: 1rem` and `max-width: 48rem`; the content is at
  `padding-inline: 1.5rem` and `max-width: 72rem`. The two do not coincide,
  deliberately: it is the exact geometry of the source, and a floating pill
  aligned on the content gutter would stop being a floating pill. **14(a) and
  14(c) pass** — every `max-width` container carries `margin-inline: auto`, and no
  section overrides the ceiling.

None of these four deviations is a matter of execution quality; all four bear on
composition, and the composition is that of a production page traced line for
line. They are reported, not worked around.

## 14. What to borrow from this reference

The **terminal block under the hero**, with its negative overlap, its left rule
marking the call tree and its floor height — when a product is used from the
command line, that is the only proof worth a screenshot.

The **slider calculator on a logarithmic scale** — three decades on one track,
four non-equidistant tickmarks, a verdict in `aria-live`, and a pricing model
that becomes readable because you handle it.

The **coloured serif italic as the second clause of a heading** — a chromatic
accent that costs neither a background colour, nor a button, nor a badge.

The **radial spotlight following the pointer**, written in two CSS variables and
read by a single `radial-gradient` — four lines of JS for a hover state that does
not copy across to `background-position`.

And the rule that holds the whole page together: **an assertion, then a surface
that executes it**, never two assertions in a row.
