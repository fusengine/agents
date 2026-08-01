# Tokens — mosa

Reproduction of https://mosa-ai.nextjsshop-preview.workers.dev under a new brand
(**Sylva AI**) and a new palette (forest green + brass). Every figure below is either
`[relevé]` — read off the source's DOM or off the rebuilt files with the command quoted —
`[arbitrage]` — decided here, with the reason — or `[estimé]` — computed, not measured.

Source snapshot used throughout: `curl -sL https://mosa-ai.nextjsshop-preview.workers.dev
-o mosa.html` → **150,777 bytes**, a Next.js server render carrying a compiled Tailwind v4
sheet. Every `[relevé]` marked "source" was greped on that file.

---

## 1. Motion

### 1.1 The three durations, and the hole between them

The source declares exactly four transition durations and nothing else. Counted on the
snapshot (`grep -oE 'duration-\[?[0-9]+m?s?\]?' mosa.html | sort | uniq -c | sort -rn`):

| value | occurrences | what it moves |
|---|---|---|
| `duration-300` | 97 | every state that settles: hover, tab, accordion, header |
| `duration-200` | 32 | the response to a click: buttons, toggles, small chips |
| `duration-700` | 6 | reveals |
| `duration-500` | 5 | reveals, second tier |

`[relevé, source]`. The rebuild keeps three of the four and drops `500ms`
`[arbitrage]`: two reveal tiers 200ms apart are not distinguishable at 700ms, and dropping
one removes a value nobody could name. So `styles.css` ships:

```css
--duree-reponse: 200ms;   /* the user acted */
--duree-etat:    300ms;   /* a state settles */
--duree-revele:  700ms;   /* nobody asked */
```

Counted on the rebuild (`grep -oE '(200|300|700)ms' styles.css | sort | uniq -c`): each
value appears **once**, in `:root`, and is referenced by variable everywhere else. There is
no literal duration anywhere below line 50 of the sheet.

### 1.2 Curves

The source ships one named easing: `ease-out`, 8 occurrences
(`grep -oE 'ease-[a-z-]+|cubic-bezier\([^)]*\)' mosa.html | sort | uniq -c` → `8 ease-out`,
zero `cubic-bezier`) `[relevé, source]`. Everything else rides Tailwind's implicit
`cubic-bezier(.4, 0, .2, 1)`.

The rebuild names two `[arbitrage]`:

```css
--courbe:        cubic-bezier(0.16, 1, 0.3, 1);   /* anything that travels */
--courbe-sortie: cubic-bezier(0, 0, 0.2, 1);      /* anything that only changes colour */
```

`cubic-bezier(.16, 1, .3, 1)` is the corpus's standard travelling curve; it is quoted from
`design-motion/references/motion-tokens.md` rather than invented. Neither curve has a
control point above 1, so the bounce grep of `pre-flight-checklist.md` §9 returns nothing:
`grep -nE 'cubic-bezier\([^)]*1\.[1-9]|elastic|bounce' styles.css motion.js | wc -l` → **0**.

### 1.3 Transition count and coverage

`grep -cE 'transition[^;]*:' styles.css` → **25** transition declarations, against a corpus
floor of 4 (`pre-flight-checklist.md` §16). `grep -c ':hover' styles.css` → **14**;
`grep -c 'focus-visible' styles.css` → **1**, a single global rule that covers every
interactive element rather than 14 duplicated ones:

```css
:focus-visible {
  outline: 2px solid var(--laiton-clair);
  outline-offset: 3px;
  border-radius: 2px;
}
```

`[arbitrage]`: one rule, not per-component. The source suppresses its focus ring entirely
on several controls; that is not reproduced — an invisible focus ring is a defect, not a
design decision.

### 1.4 Zero keyframes

`grep -c '@keyframes' styles.css` → **0**. Nothing on this page is *played*. Every visible
movement is a transition between two states, which is also true of the source: its
compiled sheet ships Tailwind's `spin` and `pulse` and applies neither `[relevé, source]`.

### 1.5 The reveal, and why it cannot leave the page blank

The reveal is a 14px rise at 700ms on `--courbe`, staggered 60ms inside a group and capped
at six steps (`Math.min(rang, 5) * 60`). It is armed on 41 elements
(`grep -c 'data-reveler' index.html` → **41**, of which 3 are `data-reveler-groupe`
containers, so **38** animated targets).

The resting state is **not** in the base sheet. It lives behind a class that JS adds:

```css
[data-reveler]            { opacity: 1; transform: none; }
.js-mouvement [data-reveler] { opacity: 0; transform: translateY(14px); }
```

`motion.js` adds `.js-mouvement` on `<html>` only inside
`if (!mouvementReduit && "IntersectionObserver" in window)`. Three consequences, all
intended: a browser without `IntersectionObserver` shows everything; a user with
`prefers-reduced-motion: reduce` shows everything; a script that throws before that line
shows everything. This is the `cursor-recode` guarantee restated with a class instead of a
paused keyframe `[arbitrage]`.

### 1.6 Observers are disarmed, both of them

Two `IntersectionObserver` are created. The reveal observer unobserves each target the
moment it fires — a reveal that has played must never cost another callback:

```js
entrees[i].target.classList.add("est-visible");
observateur.unobserve(entrees[i].target);
```

The second parameter of the callback **is** the observer instance, which is why no outer
reference is needed inside the closure. The step observer keeps observing on purpose: it
tracks which of the three steps is centred, so it must fire on every crossing.

Both are pushed onto one array and disconnected together:

```js
function desarmer() {
  if (document.visibilityState !== "hidden") return;
  if (cadre) { window.cancelAnimationFrame(cadre); cadre = 0; }
  while (observateurs.length) observateurs.pop().disconnect();
  window.removeEventListener("scroll", surDefilement);
}
document.addEventListener("visibilitychange", desarmer);
```

`visibilitychange`, not `unload`: `unload` and `beforeunload` disqualify a page from the
back/forward cache. `pagehide` is kept as a second listener for the single pending
animation frame only.

### 1.7 The scroll handler is a single frame, never a queue

```js
function surDefilement() {
  if (cadre) return;
  cadre = window.requestAnimationFrame(majEntete);
}
```

`cadre` is set to `0` as the first statement of `majEntete`, so at most one frame is ever
outstanding no matter how fast the wheel turns. The listener is `{ passive: true }`.

### 1.8 What moves, materially

| element | property | duration |
|---|---|---|
| header background + border | `background-color`, `border-color`, `backdrop-filter` | 300ms |
| nav link, footer link, logo word | `color`, `background-color` | 300ms |
| button fill | `background-color`, `border-color` | 200ms |
| tab underline | `transform: scaleX(0 → 1)`, origin left | 300ms |
| accordion sign | `transform: rotate(90deg → 0)`, `opacity` on one bar | 300ms |
| pricing switch knob | `transform: translateX(18px)` | 300ms |
| card border | `border-color`, `background-color` | 300ms |
| step rail | `border-color`, `color` | 300ms |
| reveal | `opacity`, `transform: translateY(14px)` | 700ms |

No `width`, no `height`, no `top`, no `left`, no `margin`, no `padding` is animated, so
`pre-flight-checklist.md` §10 (layout-property warning) returns nothing.

---

## 2. Colours

### 2.1 What the source does, and why it cannot be copied

The source is achromatic: pure `#000` page, white at eleven opacities, one blue-grey haze
arriving only inside photographs. Counted
(`grep -oE 'border-white/[0-9]+|bg-white/\[?0?\.?[0-9]+\]?|text-white/[0-9]+' mosa.html |
sort | uniq -c | sort -rn | head -30`) `[relevé, source]`:

| token | occurrences |
|---|---|
| `border-white/15` | 71 |
| `text-white/70` | 52 |
| `border-white/10` | 51 |
| `text-white/50` | 39 |
| `border-white/30` | 38 |
| `text-white/80` | 32 |
| `bg-white/[0.04]` | 31 |
| `text-white/85` | 29 |
| `text-white/40` | 28 |
| `text-white/45` | 27 |
| `border-white/20` | 27 |
| `bg-white/[0.02]` | 27 |
| `text-white/55` | 26 |

The brief imposes forest green + brass. **The opacity ladder is reproduced; the ink it is
made of is not.** Three surface opacities (2 / 4 / 7%), three line opacities (10 / 15 /
28%), four text opacities (100 / 74 / 56 / 42%) — the same count, the same ranks, a
green-tinted white instead of white.

### 2.2 The ladder as shipped

```css
--fond-page:      #061009;
--surface-basse:  rgba(158, 224, 179, 0.030);
--surface:        rgba(158, 224, 179, 0.055);
--surface-haute:  rgba(158, 224, 179, 0.090);
--surface-champ:  rgba(158, 224, 179, 0.060);
--trait-faible:   rgba(170, 220, 186, 0.11);
--trait:          rgba(170, 220, 186, 0.17);
--trait-fort:     rgba(170, 220, 186, 0.30);
--texte:          #f1f7ef;
--texte-2:        rgba(228, 240, 226, 0.74);
--texte-3:        rgba(228, 240, 226, 0.56);
--texte-4:        rgba(228, 240, 226, 0.42);
--laiton:         #c29a33;
--laiton-clair:   #e0c36b;
--laiton-sourd:   rgba(194, 154, 51, 0.16);
--laiton-trait:   rgba(194, 154, 51, 0.44);
--vert-mousse:    #10261a;
--texte-sur-laiton: #0b1408;
```

`grep -cE '^  --[a-z-]+:' styles.css` → **28** custom properties in `:root`, colour and
non-colour combined.

### 2.3 The rule brass obeys

Brass never builds a surface. It appears in exactly seven roles, and the list is closed:

1. the eyebrow dot (5px disc, `.surtitre__point`)
2. the active tab underline
3. the active step rail and the step icons
4. the check discs in the plan feature lists
5. the featured plan's border and its `Popular` flag
6. the primary button fill, and the brand mark's lit half
7. the focus ring

Nothing else is brass. The consequence is that on a full-page capture the accent reads as
**one colour used seven times**, not as a theme.

### 2.4 Contrast

| pair | ratio | verdict |
|---|---|---|
| `--texte` on `--fond-page` | ≈ 17.6:1 `[estimé]` | AAA |
| `--texte-2` on `--fond-page` | ≈ 10.4:1 `[estimé]` | AAA |
| `--texte-3` on `--fond-page` | ≈ 6.1:1 `[estimé]` | AA |
| `--texte-4` on `--fond-page` | ≈ 3.9:1 `[estimé]` | below 4.5 |
| `--laiton` on `--fond-page` | ≈ 7.6:1 `[estimé]` | AAA |
| `--texte-sur-laiton` on `--laiton` | ≈ 7.9:1 `[estimé]` | AAA |

`--texte-4` sits below the floor and carries **only** non-informational matter: the `1/6`
rank on a testimonial, the `/month` unit next to a price it repeats, an inactive tab label
whose active twin is at full contrast, the input placeholder, the `/` separators in the
backers strip. No sentence, no heading, no link label is ever at that level `[arbitrage]`,
and this is a tighter rule than the source's, which puts body copy at `text-white/45`.

### 2.5 Text over photographs

Four places put text on an image: the hero, the two scene captions inside the fake panels,
the closing band. All four carry a gradient veil between the image and the type, and the
image itself is filtered:

```css
.scene__fond { filter: saturate(0.85) brightness(0.55); }
.bande-cloture__image { filter: saturate(0.9) brightness(0.5); }
```

The hero adds two stacked gradients, one vertical and one horizontal, so the headline sits
over ≥ 68% black regardless of what the photograph does at that point.

### 2.6 One theme, locked

`grep -niE 'background(-color)?:\s*(#(f|e)|255, *255, *255|white)' styles.css` returns
nothing. There is no light band, no inverted section, no `prefers-color-scheme` branch. The
only near-white fills on the page are `--texte` used as a chip background inside the fake
interfaces (`.jeton--clair`, `.jeton__action`, `.compositeur__envoi`) — three chips, all
inside a photograph, all reproducing the source's white pills verbatim.

### 2.7 The banned palette is absent

`grep -niE '#(f5f1ea|f7f5f1|fbf8f1|efeae0|ece6db|faf7f1|e8dfcb|b08947|b6553a|9a2436|9c6e2a|bc7c3a|7d5621|1a1714|1a1814|1b1814)' index.html styles.css | wc -l` → **0**.
Worth stating because the brief names brass and three banned hexes are brass-adjacent:
`#b08947`, `#9c6e2a`, `#bc7c3a`. The shipped brass is `#c29a33`, chosen partly to clear
that list.

---

## 3. Typography

### 3.1 Two families, and a rule about which one labels

Geist and Geist Mono, the source's own pair, kept unchanged — the brief reproduces
typography, so the families are not a variable. Loaded from one stylesheet link with two
`preconnect` hints.

The division of labour is stricter here than a glance suggests: **mono carries every
label, sans carries every sentence.** `grep -c 'var(--mono)' styles.css` → **30** rules.
Mono is: the brand word, nav links, buttons, eyebrows, card titles, step titles, plan
names, the price when it is a word rather than a number, footer column heads, the copyright,
the status line, the logo wall, the fake interface chips. Sans is: h1, h2, h3 in the
use-case block, every paragraph, every list item, every accordion answer.

### 3.2 The scale, relevé on the source

`grep -oE 'text-\[[0-9]+px\]|text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)' mosa.html |
sort | uniq -c | sort -rn` `[relevé, source]`:

| size | occurrences | role |
|---|---|---|
| 13px | 60 | body inside cards, meta |
| 11px | 47 | footer heads, micro-labels |
| 15px | 34 | body, accordion questions |
| 14px | 25 | body, list items |
| 12px | 17 | chips |
| 44px | 11 | h2 at `lg` |
| 42px | 11 | h1 at base / h2 at `md` |
| 36px | 9 | h2 at `sm` |
| 28px | 9 | h2 at base |
| 17px | 8 | overview card titles |
| 18px | 6 | step titles, plan names |
| 64 / 60 / 56 / 52 / 40 / 32 / 24 / 22 / 20px | 1 each | one breakpoint each |

Reproduced verbatim, with one exception documented in §3.4.

Headings, relevé from the source's class attributes:

```
h1        42 → 48 (sm) → 56 (md) → 64 (lg)   w400  lh 1.05  ls -0.02em
h2        28 → 36 (sm) → 42 (md) → 44 (lg)   w400  lh 1.15  ls -0.02em
h2 (CTA)  32 → 42 (sm) → 52 (md) → 60 (lg)   w400  lh 1.10  ls -0.02em
h3 usage  20 → 22 (sm) → 24 (lg)             w500  lh 1.35  ls -0.01em
h3 step   18 mono                            w600
h3 card   17 mono                            w500  ls +0.01em
h3 gain   15 mono                            w600  ls -0.01em
h3 pied   11 mono                            w600  ls +0.10em
```

**Weight 400 on every large heading.** Not 600, not 700, at any breakpoint. This is the
single most reproducible thing about the source's typography and the easiest to get wrong:
a 64px heading at weight 700 turns the page into a different product.

### 3.3 Tracking, and where it inverts

Negative on display (`-0.02em` on h1 and both h2, `-0.01em` on the use-case h3), positive
on mono labels (`+0.01em` on eyebrows and card titles, `+0.02em` on buttons, `+0.04em` on
`LOGIN`, `+0.06em` on the brand word, `+0.10em` on footer heads, `+0.14em` on the logo
wall). The page never sets `letter-spacing: normal` explicitly; the two regimes are the
whole system.

### 3.4 The one departure: a 14px floor below 640px

The source renders labels at 10, 11, 12 and 13px at **every** viewport, mobile included.
`pre-flight-checklist.md` §17 floors information-carrying text at 14px of rendered size at
360px, and the brief marks that item non-negotiable. So the rebuild inverts the usual
direction: **the base sheet is the mobile sheet, at 14px, and the source's micro-scale is
restored only above 640px.**

```css
@media (min-width: 640px) {
  .surtitre, .etiquette, .jeton, .panneau-chat__corps, … { font-size: 13px; }
  .pied__lettre-titre, .pied__colonne h3, .etiquette-remise { font-size: 11px; }
}
```

Verified by grep — every declaration under 14px that is not inside a `min-width` block:

```bash
awk '/@media \(min-width: 640px\)/{inmq=1} {print NR"\t"(inmq?"[>=640]":"[base]")"\t"$0}' styles.css \
  | grep -E 'font-size: ([0-9]|1[0-3])px' | grep '\[base\]'
```

→ one hit, `10px`, on the `::before` check glyph of `.liste-atouts li`. That is a
decorative mark drawn inside a 15px bordered disc, not text: it has no text node, carries
no information, and is reachable by no accessibility tree. Recorded, not corrected
`[arbitrage]`.

### 3.5 The two-tone heading

Every `h2` on the page is one sentence split mid-phrase into two colours: the first half at
`--texte`, the second at `--texte-3`. `[relevé, source]` — it is the source's most
repeated typographic gesture, present on all six of its `h2` and on the closing heading.
Reproduced on all seven headings here. Structurally it is one `<span>`:

```html
<h2 class="titre-section">Experience the calm of <span>a grounded assistant.</span></h2>
```

The rule that makes it read: the **softer half always finishes the sentence**. The page
never ends a claim at full contrast.

### 3.6 Measure

`max-width` in `ch` on every text block: 46ch on the hero subtitle and the closing
subtitle, 40ch on overview bodies, 38ch on step bodies, 34ch on benefit bodies and the FAQ
note, 44ch on the use-case aside, 62ch on accordion answers, 20ch on section headings,
22ch on the closing heading. The one exception is the hero h1, capped in **px** (700px)
rather than `ch`, because its break point had to be forced to two lines to match the
source's silhouette `[arbitrage]`.

---

## 4. Structure and rhythm

### 4.1 Section count

`grep -c '<section' index.html` → **10**, the same count as the source
(`grep -oE '<section[^>]*>' mosa.html | wc -l` → 10) `[relevé, both]`, in the same order.

### 4.2 The vertical rhythm is not one value

`grep -oE 'padding-block: [^;]*' styles.css | sort -u` returns **13 distinct values**:

```
8px · 8px 16px · 48px · 48px 28px · 56px · 64px · 64px 32px · 64px 88px ·
72px · 80px · 80px 96px · 96px · 96px 112px
```

Of these, the section rules alone carry six: `64` / `80` / `96` for the ordinary sections,
`48` / `56` / `72` for the logo wall, plus the asymmetric `64px 88px` → `80px 96px` →
`96px 112px` of the closing band. The source's own rhythm is
`py-16 sm:py-20 lg:py-24` with two exceptions `[relevé, source]`; the exceptions are what
keep the page from stamping one value on everything.

`pre-flight-checklist.md` §13 fails a sheet returning exactly one distinct value. Thirteen
is comfortably clear, and none of them is decorative padding: the logo wall is tighter
because it holds one row of marks, the closing band is looser because it is the last thing
before the footer.

### 4.3 Container and gutter

```css
--largeur-page: 1380px;
--gouttiere: 24px;          /* 32px from 1024 */

.cadre-page { max-width: var(--largeur-page); margin-inline: auto; }
.conteneur  { max-width: var(--largeur-page); margin-inline: auto; padding-inline: var(--gouttiere); }
```

`1380px` is the source's, verbatim (`max-w-[1380px]`, 2 occurrences) `[relevé, source]`,
as is the `px-6 lg:px-8` gutter. **The header uses `.conteneur`, the same class, so the nav
and the content share one gutter by construction** — `pre-flight-checklist.md` §14 asks for
equality of value; here there is a single value. No section overrides the container width.

### 4.4 Grids

| block | base | 640 | 768 | 1024 |
|---|---|---|---|---|
| overview cards | 1 | 1 | 2 | 3 |
| benefits | 1 | 2 | 2 | 3 |
| plans | 1 | 1 | 2 | 3 |
| use-case panel | 1 | 1 | 2 | 2 (gap 64) |
| steps | 1 | 1 | 2 | 2 (gap 64) |
| FAQ | 1 | 1 | 2 | 5fr 7fr |
| footer | 1 | 1 | 1 | 2fr 1fr 1fr 1fr 1fr |
| logo wall | 2 | 5 | 5 | 5 |

The source's own grid classes (`grep -oE 'grid-cols-[0-9]+|(sm|md|lg|xl):grid-cols-[0-9]+'
mosa.html | sort | uniq -c`) give `9 × grid-cols-1`, `2 × grid-cols-2`, `5 × lg:grid-cols-3`,
`3 × md:grid-cols-2`, `2 × sm:grid-cols-2`, `1 × sm:grid-cols-3`, `1 × sm:grid-cols-4`,
`1 × lg:grid-cols-2`, `1 × lg:grid-cols-5` `[relevé, source]`. The counts per block match;
the FAQ's `5fr 7fr` is this page's `[arbitrage]` in place of a bare 2-column split, taken
from the source's rendered proportions rather than from its class.

`grep -c '@media' styles.css` → **5** blocks: 640, 768, 1024, a second 640 block for the
type floor, and `prefers-reduced-motion`.

### 4.5 One radius, plus the pills

`grep -oE 'border-radius: [^;]*' styles.css | sort | uniq -c | sort -rn`:

```
16  border-radius: var(--rayon)        /* 4px */
 9  border-radius: 50%
 4  border-radius: 999px
 1  border-radius: var(--rayon-large)  /* 6px, closing band only */
 1  border-radius: 3px
 1  border-radius: 2px                 /* the focus ring */
```

`--rayon: 4px` is the source's `rounded-sm`, which it uses **69 times**
(`grep -oE 'rounded-(\[[0-9]+px\]|full|none|sm|md|lg|xl|2xl|3xl)' mosa.html | sort |
uniq -c | sort -rn` → `69 rounded-sm`, `63 rounded-full`, `2 rounded-lg`)
`[relevé, source]`. A 4px radius on a 1380px page is nearly a square corner, and that
near-squareness is the page's structural signature: everything is a rectangle, and only
the round things — avatars, the send pill, the toggle, the accordion sign, the prev/next
discs — escape.

### 4.6 Page height

Full-page render at 1365px wide: **8,264px** (`browser_autoscroll` reports `height: 8264`).
The source at the same width: **8,830px** (the reference capture
`e61dba203f-desktop.png` is 1365 × 8830) `[relevé, both]`. A **6.4% deficit**, and its
cause is known: the source's testimonial cards are taller because its quotes run one line
longer, and its logo cells are 96px against 84px here. No section is missing.

### 4.7 Density

Ten sections, 3 overview cards, 4 tabs, 3 steps, 6 benefit cards, 6 testimonials, 10 logo
cells, 3 plans with 13 feature rows between them, 7 accordions, 26 footer links. Counted:
`grep -c 'class="bouton' index.html` → **13** buttons. This is a **high-density** page by
`spacing-density.md`'s profiles, and the card padding floors of the Enterprise Dense
profile (16px) are cleared everywhere: 22px on testimonials, 24px on benefits, 26px on
plans, 20px on accordion summaries.

---

## 5. Components and their states

### 5.1 The segmented nav

Four links inside one bordered box, separated by `border-left` on every child but the
first — not by a gap. Hover lifts the cell's background to `--surface-haute` and the label
to `--texte`. The box disappears entirely below 1024px and is replaced by a hamburger that
toggles a bordered panel; the two bars rotate 45° into a cross on `aria-expanded="true"`,
in CSS, driven by the attribute.

### 5.2 Buttons

Two variants and nothing else. `--plein` is a brass fill with `--texte-sur-laiton` type at
weight 600; `--contour` is `--surface` behind a `--trait-fort` border. Both are mono, both
44px minimum height, both carry a `›` chevron at 70% opacity when they sit in a hero or
closing row. Hover on `--plein` goes **lighter** (`--laiton-clair`); hover on `--contour`
raises the surface and turns the border brass.

### 5.3 The fake interfaces

Six of them, all HTML and CSS, no image, reproducing the source's own procedure:

| panel | contents |
|---|---|
| chip chain | one white pill, three bordered rows, three 14px hairlines between them |
| chat panel | avatar disc, author line, one bright line, two muted paragraphs, a 5-icon toolbar over a hairline |
| suggestion stack | three full-width rows, each with an icon, a label and a white action pill pushed right by `margin-left: auto` |
| large chat panel | the chat panel at 340px instead of 300px, one paragraph longer |
| composer | a placeholder line, 34px of deliberate emptiness, then a chip, four icons and a send pill |
| avatar monograms | two initials in mono over a brass gradient disc |

Each sits on `rgba(6, 16, 9, 0.84)` with `backdrop-filter: blur(8px)` over a darkened
photograph. `grep -c '<svg' index.html` → **0**: not one drawing stands in for a
photograph, and not one photograph stands in for an interface.

### 5.4 Tabs

`role="tablist"` / `role="tab"` / `role="tabpanel"`, `aria-selected`, roving `tabindex`,
Left/Right arrow navigation wrapping at both ends. The underline is a pseudo-element
scaled on `transform: scaleX()` from the left origin — not a moving `left`/`width`, which
is why §10 of the checklist returns nothing. All four panels ship real content; the tab
does not swap a label over one image.

### 5.5 Accordions

Native `<details>`/`<summary>`, so the page works with JS disabled and the content is
findable by in-page search. `motion.js` adds exactly one behaviour: opening one closes the
others. The `+` / `−` sign is two 1px bars, one rotated 90°, the rotated one fading to
`opacity: 0` when the volet opens.

### 5.6 The testimonial rail

`overflow-x: auto` with `scroll-snap-type: x mandatory` and
`scroll-padding-inline: var(--gouttiere)` so a snapped card lands on the content gutter,
not on the viewport edge. The two round buttons scroll by exactly one card width plus the
12px gap, read off the live DOM (`carte.getBoundingClientRect().width + 12`) rather than
assumed, and disable themselves at each end. Reduced motion swaps `behavior: "smooth"` for
`"auto"` and drops the snap.

### 5.7 The pricing switch

`role="switch"` with `aria-checked`, a 42 × 24px track and a 16px knob translated 18px.
Switching rewrites the two prices from `data-mois` / `data-an` attributes on the elements
themselves — no price table in JS, no second DOM to keep in sync.

### 5.8 Accessibility inventory

`grep -oE 'aria-[a-z]+' index.html | sort | uniq -c | sort -rn`:

```
74 aria-hidden      16 aria-label       5 aria-controls
 4 aria-selected     4 aria-labelledby  1 aria-expanded    1 aria-checked
```

The 74 `aria-hidden` are the decorative glyphs inside the fake interfaces and the `/`
separators of the backers strip — matter that is visually meaningful and verbally noise.
A skip link opens the document, every `<nav>` carries a label, every icon-only control
carries one.

---

## 6. Images

**This reference embarks its own assets.** That makes it the exception in this corpus: the
ten historic references (`cursor`, `endlesstools`, `fora`, `harness`, `linear`,
`mainframe`, `reve`, `supercommon`, `umbrel`, `xai`) load every pixel from a remote URL and
carry no local file. This one ships an `img/` folder:

| file | intrinsic size | weight | role |
|---|---|---|---|
| `img/hero.webp` | 1920 × 824 | 58 KB | the hero, full viewport |
| `img/ridge.webp` | 1920 × 1283 | 106 KB | overview cards 1 and 3, two use-case panels, the steps scene |
| `img/valley.webp` | 1920 × 1280 | 158 KB | overview card 2, two use-case panels |
| `img/portal.webp` | 1920 × 1280 | 104 KB | the closing band |

Dimensions read on disk (`magick identify -format "%wx%h" img/*.webp`), not assumed, and
written into `width`/`height` on every tag so the page reserves its boxes before the bytes
arrive.

`grep -c '<img' index.html` → **10** tags for **4** files: `ridge` appears four times and
`valley` three, always cropped differently by `object-fit: cover` inside a different aspect
ratio (4/3 for the overview cards, 5/4 for the panels and the steps scene). Reusing one
photograph across four boxes is the source's own economy `[relevé, source]`.

### 6.1 Framing, decided after looking at the four files

The four photographs were opened and read before any framing was set — a crop chosen from
a filename is a guess. Three decisions came out of that, all `[arbitrage]`, none of them
touching the layout:

**`object-position: 50% 76%` on every scene.** `ridge.webp` carries a pale grey overcast
across its top third (≈ `#b8bcbc` before filtering) and `valley.webp` an amber sky band
across its top quarter. At the default `50% 50%`, a 4/3 crop of a 1.5:1 source keeps that
sky, and `brightness(.55)` does not remove it: the card would carry the lightest band on
an otherwise dark page, directly under the fake chat panel. Cropping onto the wooded slope
removes the sky entirely, and the panels regain their contrast. This is a framing change,
not a layout one: the aspect ratios, the sizes and the positions are untouched.

**The closing veil raised to 58% at its centre.** `portal.webp` is symmetric, its monolith
dead centre, and the brightest thing on the page is the vertical brass slit down its
middle — which falls exactly under the centred heading. The source's own closing band puts
a light column behind centred text, so the composition is kept; only the veil changes,
`rgba(6, 16, 9, 0.42)` → `0.58` at the centre stop. Contrast is a blocking item, framing
is not, so the fix goes on the veil rather than on the crop.

**A dedicated value for the connector hairlines.** The 1px filets linking the chips in the
first scene sit on a photograph, not on the page background; at `--trait-fort`
(`rgba(170, 220, 186, .30)`) they vanished. They carry their own
`rgba(200, 232, 210, 0.55)` — the one place a line does not come from the trait ladder,
because the surface under it is not the page.

The hero needed nothing: its gold horizon sits at ≈ 18% of the image height and lands just
below the header veil, and because the file is 2.33:1 against a ≈ 1.5:1 hero box, `cover`
matches on height and the vertical component of `object-position` has no effect at desktop
widths at all.

Loading: `fetchpriority="high"` and no `loading` attribute on the hero — an eager hero is
the LCP element and must not be deferred — `loading="lazy" decoding="async"` on the other
nine. Alt text: descriptive on the four images a reader would want described, `alt=""` plus
`aria-hidden="true"` on the six that are pure texture behind a fake interface.

**Consequence for anyone reusing this reference**: the folder is not portable by copying
`index.html` alone. It is the price of a page whose photographs are part of its identity
rather than borrowed from a bank.

---

## 7. Deviation from the source

### 7.1 What changed

| dimension | source | here | why |
|---|---|---|---|
| brand name | Mosa Ai | **Sylva AI** | brief: own identity |
| palette | `#000` + white opacities + blue-grey haze | `#061009` forest green + `#c29a33` brass | brief: imposed palette |
| photographs | four remote atmospheric landscapes | four local WebP, same roles, green and brass | brief: own images |
| every visible string | Mosa's copy | rewritten under the new brand | brief: own texts |
| primary button fill | white | brass | follows the palette |
| logo wall | ten real company marks | ten fictional wordmarks in mono | a reference page must not display real brands |
| testimonial avatars | photographic portraits | monogram discs | no portrait was supplied, and inventing a face for a fictional quote is worse than not showing one |
| investor strip | five named real people and one real fund | five fictional organisations | same reason, stronger: the source names living people |
| step separator | em dash `—` | en dash `–` | `pre-flight-checklist.md` §1 caps em dashes at 1 |
| micro type below 640px | 10-13px | floored at 14px | §17, non-negotiable per the brief |
| focus ring | suppressed on several controls | one global brass ring | an invisible focus ring is a defect |
| `duration-500` | 5 occurrences | dropped | indistinguishable from 700ms |

### 7.2 What is reproduced, unchanged

| dimension | evidence |
|---|---|
| section count and order | 10 sections, same sequence, §4.1 |
| container width and gutter | `1380px`, `24 / 32px`, §4.3 |
| section padding rhythm | 64 / 80 / 96 with the two exceptions, §4.2 |
| radius | 4px everywhere, pills for the round things, §4.5 |
| type scale | 42→64, 28→44, 32→60, 24/18/17/15/11, §3.2 |
| heading weight | 400 at every size, §3.2 |
| tracking regime | negative on display, positive on mono, §3.3 |
| the two-tone heading | all seven headings, §3.5 |
| mono-labels / sans-sentences split | §3.1 |
| grid counts per block | §4.4 |
| aspect ratios of the scenes | 4/3 and 5/4, §6 |
| the six fake interfaces as HTML | §5.3 |
| tab, accordion, switch, rail behaviours | §5.4 – §5.7 |
| durations 200 / 300 / 700 | §1.1 |
| copy length per slot | headline 40 chars against 45, subtitle 123 against 137 |
| the hero's backers strip on the CTA baseline | §7.3 |
| word count of every card body | within ±15% of its source counterpart |

### 7.3 The one composition item deliberately failed

`pre-flight-checklist.md` §7 caps a hero at four text elements. This hero has five:
headline, subtitle, button row, and the **backers strip** — a label plus five names sitting
bottom-right on the CTA baseline. It is one of the source's defining moves: the hero is a
single 100vh photograph with content pinned to its bottom edge, left and right. Removing
the strip would leave the right half empty and change the hero's silhouette, which is the
thing the brief asks to reproduce. **Failed knowingly, reported, not hidden.**

Two further composition items are noted rather than fixed, for the same reason:

- **§12(b), flat group.** Six benefit cards of identical rendered area, six testimonial
  cards of identical width, three plans of near-equal height, ten logo cells of identical
  size. Any uniform grid fails a predicate that asks for a 2× spread inside a family; a
  reproduction of a real page cannot pass it without deforming the page. §12(a) is
  satisfied several times over — the hero image is ~9× the next media, the closing band
  ~3× a scene.
- **§2, eyebrow count.** Seven eyebrows over ten sections against a cap of four. The
  source has eight `[relevé, source]`. Note that the mechanical grep
  (`uppercase[^"]*tracking`) returns **0** here, because these eyebrows are mono mixed-case,
  not uppercase-tracked — the check passes mechanically and fails in spirit, and both facts
  are recorded.

---

## 8. What is NOT reproduced

Things the source does that this page deliberately does not:

1. **The `duration-500` tier.** Five occurrences dropped, §1.1.
2. **The suppressed focus ring.** Replaced by one visible brass ring, §1.3.
3. **The 10-13px mobile micro-scale.** Floored at 14px below 640px, §3.4.
4. **Real third-party brand marks.** Ten fictional wordmarks instead of ten real logos.
   A reference page in a design corpus has no licence to display them and no need to.
5. **Named real investors and portrait photography.** Fictional organisations and monogram
   discs. The source names five living people in its hero; reproducing that under a
   different brand would be a fabricated endorsement, not a design decision.
6. **Any client-side framework.** The source is Next.js with a compiled Tailwind sheet and
   `framer-motion`-style reveals. This is one HTML file, one stylesheet, one IIFE, no
   build step, no dependency, no network request except the font.
7. **The auto-advancing testimonial carousel**, if the source has one — the snapshot shows
   prev/next controls and a `1/6` counter, so the rail here is manual only. A carousel that
   moves without being asked is on the corpus's ban list.
8. **The `overflow-hidden` masking of a real overflow.** The source wraps its whole page in
   `overflow-hidden`, which can hide a genuine horizontal overflow. The wrapper is
   reproduced, but every block inside it was checked at 360px independently: the only
   horizontal scroller on the page is the testimonial rail, which is one by design, and
   the tab strip, which is one on narrow screens.
9. **A second theme.** No light mode, no `prefers-color-scheme` branch. One dark lock,
   §2.6.
10. **Anything that would make the page longer than what it contains.** The 6.4% height
    deficit against the source (§4.6) is not padded away.

---

## 9. Files

| file | lines | note |
|---|---|---|
| `index.html` | 627 | one document, no template, no partial |
| `styles.css` | 1,251 | one sheet, 28 custom properties, 5 media blocks |
| `motion.js` | 191 | one IIFE, 10 numbered behaviours, 2 observers, both disarmed |
| `design-system.md` | 152 | the read, the dials, the bans |
| `tokens-mosa.md` | 729 | the measurements |
| `img/*.webp` | 4 files | 432 KB on disk, local |

Em dash count on the artifact, the §1 threshold being 2:
`grep -oE '—' index.html styles.css | wc -l` → **0**.

Console on load: `browser_console` → `{"count": 0}`. No error, no warning, no failed
request.
