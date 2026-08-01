---
name: pre-flight-checklist
description: "Mechanical grep/count/measure checks run as the last filter before a design is declared audit-clean (em-dash crutch threshold, eyebrow count, theme lock, motion-claimed-motion-shown, cluster #1 co-occurrence, plus the composition gate: dominant block, vertical rhythm, centred container, image floor, motion floor, small-viewport legibility, and the selection gate: reference picked by the subject's verb, named in the report)."
when-to-use: "The last mechanical filter before the output is declared audit-clean, after the audit checklist and anti-slop pass."
keywords: pre-flight, mechanical, grep, audit, checklist
priority: critical
related: audit-checklist.md, anti-ai-slop-audit.md
---

# Mechanical Pre-Flight Checklist

Load as the last mechanical filter before the output is declared audit-clean. Condensed
and adapted from the taste-skill "Final Pre-Flight Check" (github.com/Leonxlnx/taste-skill
— `SKILL.md` §14).

These are **verifiable commands**, not intentions. Run each against the generated
HTML/CSS (assume `$FILE` is the artifact). A non-empty match on a "must be 0" grep, or a
count over its cap, is a hard fail — fix, then re-run. Do not eyeball; execute.

## 1. Em-dash used as a crutch, not a single occurrence

```bash
grep -noE '—' "$FILE" | wc -l   # count em-dash occurrences specifically
```
En-dashes (`–`) used for numeric ranges (e.g. "2020–2024") are fine — don't flag those.
A single em-dash (`—`) isn't a hard fail on its own; it fails once it reads as a repeated
crutch/tic across the artifact — **2+ occurrences** flags for rewrite (vary the
punctuation, don't lean on the same mark everywhere).

## 2. Uppercase-tracking eyebrow count ≤ ceil(sections / 3)

```bash
LABELS=$(grep -oE 'uppercase[^"]*tracking' "$FILE" | wc -l)
SECTIONS=$(grep -oiE '<section' "$FILE" | wc -l)
CAP=$(( (SECTIONS + 2) / 3 ))          # ceil(sections/3)
[ "$LABELS" -le "$CAP" ]               # must be true
```
Over-labeling every section with a small uppercase eyebrow is a template tell. Hero
counts as 1.

## 3. Zero theme-flip mid-scroll — a THEME lock, not a background lock

```bash
# one theme (light | dark | auto) for the whole page — no section inverts mid-page
grep -niE 'class="[^"]*\b(bg-(black|zinc-9|slate-9|neutral-9))' "$FILE"       # Tailwind form
grep -niE '(section|band|bande|bloc)[^{]*\{[^}]*background[^}]*(#(f|e)|255, *255, *255|white|oklch\(0?\.9)' "$FILE"   # hand-written CSS, light band on a dark page
```
Exactly one page theme lock. A dark section dropped into an otherwise light page, or a
light one dropped into a dark page, is a fail. Inspect the hits — they must all belong to
the same locked theme. `auto` (a page that flips *whole* via `prefers-color-scheme` or a
`data-theme` attribute) is one theme, not two: `cursor-recode` and `reve-recode` both ship
it and both pass.

**Note the second grep.** The original check only matched Tailwind utility classes, so a
hand-written stylesheet could invert a band and sail through. Neither pattern is
exhaustive — read the hits, and read the page.

### What this check does NOT forbid — arbitration with `premium-patterns/PATTERNS.md`

This check and the flatness table in
`../../design-web/references/premium-patterns/PATTERNS.md` used to contradict each other:
that table offered "ONE inverted band" as a cure for a page where every section shares one
background, while this check failed any section that inverted. This check won by default,
because only it blocks mechanically. **Both were adjusted, on a count taken across the
corpus — re-taken at fifteen pages, and one number moved:**

- **Theme inversion at section level: 1 of 15.** It was 0 of 10, and `stripe-recode` is the
  exception: a light-locked page carrying a **dark block mid-scroll** (`section.infra`,
  `background-color: var(--d-990)`). It is not an oversight and not a licence. Its own
  `tokens-stripe.md § 8.1` records the item as *"écarté au nom de la fidélité — la source a
  un bloc sombre médian (`hds-mode--dark`), reproduit. Signalé, non corrigé"*: the source
  ships the inversion, the rebuild reproduces it, and the check is logged as failed rather
  than argued away. **That is the only shape this exception has** — a reproduction of a
  shipped page, declared as a fail in the deliverable's own report. On original work the
  check blocks, unchanged in substance.
  `cursor` remains the only light-based page among the first ten, and its sole dark surfaces
  are a phone chassis drawn in CSS, plus its whole-page dark theme.
  **A related case that is *not* an inversion:** `parley` puts a `#14181d` footer under a
  `#f4f5f7` page. Its `tokens-parley.md § 9` argues, and this check accepts, that a footer
  is the page *ending*, not a flip *mid-scroll* — and that its two other dark surfaces are a
  terminal and a phone chassis, dark because the depicted object is dark, which this check's
  own note already allows.
- **A section whose background departs from the page base, inside the same theme: 7 of 15.**
  `supercommon` gives its first band a metallic gradient rising to `#bfc6c1`; `fora` closes
  on a `#000 → #1b2228` gradient under a 190px horizon image; `harness` runs
  `#070707 → #050505` under two sections; `umbrel` dissolves one band into the next over
  160px; `xai` draws an 80px grid under an elliptical mask; `dispatch` gives its counter
  band a `--surface-band` fill, the page's only bordered band; `parley` alternates
  `--pearl` and `--pearl-tint` across nine sections. **None of these is a fail here, and
  none ever was** — they change the surface, never the theme.
  The remaining six (`mosa`, `stash`, `reve`, `linear`, `cursor`, `mainframe`) take their
  relief from full-bleed photography or drawn matter instead, which is the same answer by
  another route.

So: **relief is not inversion.** A page needs relief (`PATTERNS.md` §*Flatness is banned*)
and gets it from a tint, a gradient, a full-bleed image, a drawn pattern or a per-section
padding rhythm — all inside the locked theme. The word "inverted" was removed from
`PATTERNS.md` because the corpus does not do it.

One detail worth copying from `supercommon`: the departure is **kept unique on purpose**.
Three later bands carry a `.band--opaque` rule whose only job is to stop the metallic
gradient bleeding under them. One section departs; the CSS is written to guarantee the
others do not.

## 4. "Motion claimed, motion shown" (Fusengine design decision)

```bash
grep -qiE 'transition|@keyframes|animate|motion' "$FILE"   # must find motion
```
Fusengine operationalization — NOT a verbatim taste-skill §14 item. It couples two real
taste-skill concepts: the `MOTION_INTENSITY` dial (taste-skill §1, values 1–10) and the
§14 "Motion motivated" check. Rule: if the design read set `MOTION_INTENSITY > 4`, the
artifact must actually contain motion code. A high motion dial with no
transition/keyframe/animation present is a fail — the brief was not delivered. The `> 4`
threshold and the grep gate are ours; the dial and the "motion motivated" intent are the
repo's.

## 5. Max one marquee per page

```bash
[ "$(grep -ociE 'marquee|animate-marquee|scroll-x-loop' "$FILE")" -le 1 ]   # ≤ 1
```
Two horizontal marquees on one page is a fail.

## 6. Banned premium-consumer palette absent

```bash
# AI-default beige+brass+oxblood+espresso family — banned as a default reach
grep -niE '#(f5f1ea|f7f5f1|fbf8f1|efeae0|ece6db|faf7f1|e8dfcb|b08947|b6553a|9a2436|9c6e2a|bc7c3a|7d5621|1a1714|1a1814|1b1814)' "$FILE"
```
Must return nothing unless the brand brief explicitly names those colors. This palette
appears in nearly every AI premium-consumer output; its presence by default is a fail.

## 7. Hero ≤ 4 text elements

Count the direct text children of the hero block (eyebrow OR brand strip, headline,
subtext, CTAs). More than 4 — e.g. a tiny tagline below the CTAs or a trust micro-strip
inside the hero — is a fail. Move the logo wall UNDER the hero.

## 8. Cluster #1 signature co-occurrence, undeclared

```bash
CREAM=$(grep -qiE 'background(-color)?:\s*(oklch\([^)]*0\.9[0-8][^)]*(6[0-9]|[7-8][0-9]|9[0-9])\)|#f4f1ea|#f7f5f1)' "$FILE" && echo 1 || echo 0)
SERIF_ITALIC=$(grep -qiE 'font-family:[^;]*serif' "$FILE" && grep -qiE 'font-style:\s*italic' "$FILE" && echo 1 || echo 0)
TERRACOTTA=$(grep -qiE '#b6553a|#bc7c3a|oklch\([^)]*0\.1[0-9][^)]*(3[0-9]|4[0-9])\)' "$FILE" && echo 1 || echo 0)
SUM=$((CREAM + SERIF_ITALIC + TERRACOTTA))
[ "$SUM" -ge 2 ]   # ≥2/3 present
```
Warm-cream background ∧ serif with an italic title accent ∧ terracotta accent — the
default "editorial SaaS" look. ≥2/3 present **and** not declared as the Step 2 signature
element (`design-method`) is a **FLAG-with-justification**, not a hard block — a
deliberate, declared signature is a valid override. Fast mechanical trigger; full
compound detector at `design-review/references/anti-ai-slop-audit.md` entry 9.

## 9. Ban bounce/elastic easing

```bash
grep -niE 'cubic-bezier\([^)]*1\.[1-9]|elastic|spring[^-]*bounc|bounceOut|bounceIn' "$FILE"   # must return nothing
```
Overshoot easing (`cubic-bezier` y-control-points >1, `elastic`, or a "bouncy spring") reads
as a toy interaction, not a premium one. Hard grep — any match fails; use a standard ease
(`ease-out`, `cubic-bezier(0.16, 1, 0.3, 1)`) from `design-motion/references/motion-tokens.md` instead.

## 10. Layout-property animation is a WARNING, not a block

```bash
grep -noE '(transition|animation)[^;]*:(.*\b(width|height|top|left|margin|padding)\b)' "$FILE"
```
Animating `width`/`height`/`top`/`left`/`margin`/`padding` forces layout on every frame —
janky on lower-end devices. **WARNING, not a hard block.** Whitelisted exceptions: the
accordion pattern (`grid-template-rows: 0fr → 1fr`) and FLIP-technique reflows. Everything
else should animate `transform`/`opacity` only — see
`design-motion/references/motion-performance.md`.

## 11. Rendered-layout check — text overflow, overlap, CTA wrap, contrast

Checks 1-10 are greps: they read the SOURCE. This one loads the page in a headless
browser and measures the RENDERED result at six widths. It is the only check that can
catch a wrapping CTA label, a label sitting on top of a button, or a contrast ratio
computed on resolved colors (`oklch()`, `color-mix()`, alpha over an inherited background).

```bash
cd "$CLAUDE_PLUGIN_ROOT/scripts/layout-check"
bun run layout-check.ts "$FILE" --out /tmp/layout-check.json    # exit 0 = clean, 1 = violations
```

Any entry in `violations` is a hard fail — the values are measured, not judged: fix and
re-run. Entries in `warnings` are NOT failures: they are the cases the script cannot
decide (contrast over a gradient/image, text hidden by a scroll reveal). Each warning
must be resolved by eye on a screenshot, or by re-running with `--warmup`.

This mechanizes `design-web/references/layout-discipline.md` §6 (CTA label on one line,
button-text contrast), which had no mechanical counterpart here. Full option list and
known limits: `scripts/layout-check/README.md`.

## 12. Hierarchy — one block dominates, measured on the render

The rule already exists and is **not restated here**: `design-web/references/layout-discipline.md`
§9 *Focal-Block Floor* (lines 69-72) requires ≥ 1 dominant focal block per viewport, and
`elicitation-visual.md` §1 *Squint Test* (lines 17-22) is the lens that reads it. Neither
was ever in a blocking gate — this check makes running them mandatory here, with a
countable predicate.

```bash
# rendered area of every candidate, grouped by family (section / card / figure / media)
node -e '…' # or, in the review browser session, on the full-page capture:
#   [...document.querySelectorAll("section > *, .card, figure, img, svg, video")]
#     .map(e => ({ tag: e.tagName, cls: e.className,
#                  area: Math.round(e.getBoundingClientRect().width * e.getBoundingClientRect().height) }))
#     .sort((a, b) => b.area - a.area)
```
Run it on the same full-page capture Part 2 already produced (`design-review/SKILL.md`
Part 2), at 1440 **and** 1920 — see check 14 for why the wide viewport is not optional.

**Predicate — both halves, both blocking.** A "family" is a set of elements sharing one
repeated role: the media, the cards, the section headings.

- **(a) One block dominates.** In each family present on the page, the largest member's
  rendered area is **≥ 2× the next member of that same family**.
- **(b) No flat group survives inside a family.** Any group of **≥ 3 members of one family
  where no member reaches 2× any other member of that group** is a fail on its own, even
  when (a) passes elsewhere on the page. Without this half, a single oversized hero clears
  (a) for the whole media family while 20 identically-sized drawings sit untouched
  underneath it — which is the exact page this check exists to stop.

A page whose 20 drawings, 3 project cards or 5 `<h2>` all land within a factor of 2 of each
other has no first read and fails on (b). The 2× ratio is the Fusengine operationalization
of §9's "not tied with 2+ other blocks of near-equal area/contrast" — the rule is the
repo's, the number is ours, and (b) reuses it rather than introducing a second threshold
(see Provenance).

**Register `product` exempt**, in the words of `layout-discipline.md:72`: *"Register
`product` exempt (dashboards, panels of equal-weight density): a single dominant block is
not required — at most a soft-flag, never a Block."* On `brand`, it blocks.

## 13. Vertical rhythm — sections are not one repeated value

The detector exists at `anti-ai-slop-audit.md` entry 15, conjunct **(b) Uniform rhythm**
(line 48), where it only ever fires **in conjunction** with the canonical section order.
Here it is **unconditional and blocking on its own** — a page can pick a bespoke body
sequence and still stamp every section with one padding, which is what "no respiration"
looked like on all three test pages. Its grep, taken verbatim from entry 15(b):

```bash
grep -oE 'padding(-block(-start|-end)?|-top|-bottom)?:[^;]*' *.css   # restrict to rules selecting section/.section/the section wrapper
# then: | sort -u   → exactly 1 distinct value with zero per-section override = FAIL
```
Reference point, measured in that same entry: `fora-recode` returns **12** distinct
`padding-block` values, its section rules alone carrying 160px 0 / 180px / 180px 80px /
180px / 160px 80px / 180px / 180px / 180px 0.

Two additions the source detector does not cover, both floored by the **declared density
profile** in `design-system/references/spacing-density.md` (Enterprise Dense lines 16-28,
Standard lines 30-42, Editorial lines 44-56) — use the profile the deliverable declared, no
other:

- **Inter-section separation**, not just padding inside a section: the gap between two
  consecutive sections is ≥ that profile's **Section gap** — 16px (Enterprise Dense,
  line 25) / 24-32px (Standard, line 39) / 48-64px (Editorial, line 53).
- **Table row padding**: rows resolve to ≥ that profile's **Table row height** — 36px
  (line 28) / 48px (line 42) / 56px (line 56). A 13-row table at a tighter value than its
  own declared profile is a fail, not a taste call.

```bash
# rows, measured not read:
#   [...document.querySelectorAll("tr, [role=row]")].map(r => r.getBoundingClientRect().height)
```
No number here is invented: each is quoted from `spacing-density.md` with its line. Card
padding from the same tables (16 / 24 / 32-48px, lines 24, 38, 52) is the companion floor
when the page uses cards instead of a table.

## 14. Container centred, and the nav shares its gutter

New check — nothing in this repo covered it, and it is the defect that crossed an entire
review unseen: a main container pinned to the left of a 1440px viewport with a hard empty
band on the right, and a nav that did not share the content gutter.

**This cannot be delegated to check 11.** `scripts/layout-check/layout-check.ts` runs five
predicates — `text-overflow`, `overlap`, `cta-wrap`, `contrast`, `document-overflow`
(`scripts/layout-check/README.md` §*Les cinq contrôles*). Every one of them measures a box
against another box or against the document's scroll width. **None measures where the
container sits inside the viewport**: an off-centre container overflows nothing, overlaps
nothing, wraps nothing and changes no contrast ratio, so it scores 0 violations while
looking broken. Its default widths also stop at 1440 (`README.md` §*Options*:
`360,390,768,1024,1280,1440`), and this bug was only obvious wider.

```bash
# (a) the main container is centred on an explicit max-width
grep -nE '(max-width|max-inline-size)\s*:\s*[0-9]' *.css
grep -nE 'margin(-inline)?\s*:\s*[^;]*auto' *.css
#   every max-width container above must also carry margin-inline:auto (or margin:0 auto)

# (b) nav and content share ONE max-width and ONE gutter
grep -nE '(nav|header|\.nav|\.header|\.container|\.wrap|\.shell)[^{]*\{[^}]*(max-width|padding-inline|padding-left|padding-right)' *.css
#   the nav's max-width and inline padding must equal the content container's, value for value

# (c) no section overrides the container max-width
grep -nE '(section|\.section)[^{]*\{[^}]*(max-width|width)\s*:\s*(100vw|[0-9]{3,}px)' *.css
```
Then **verify on capture at 1440 AND 1920** — measured, not eyeballed: the container's
left and right offsets inside the viewport must be equal (`getBoundingClientRect().left`
vs `innerWidth - .right`), and the nav's `left` must equal the content's `left`. Re-run
check 11 at the wide viewport in the same pass:

```bash
bun run layout-check.ts "$FILE" --widths 1440,1920 --out /tmp/layout-check-wide.json
```
Any inequality is a hard fail. A deliberate asymmetric layout is not exempt by intent — it
is exempt only if the asymmetry is the declared signature element (`design-method` Gate 0
artefact 2) and the nav still shares the content gutter.

## 15. Image floor — the page carries images, and says where they came from

```bash
grep -c '<img' "$FILE"          # count real images
grep -c '<svg' "$FILE"          # drawn matter, for comparison — never a substitute here
grep -noE '<img[^>]*src="[^"]*"' "$FILE"   # read every source: client file, stock URL, or placeholder
```

**A page with zero `<img>` fails this check.** That is the floor, and it holds whatever the
SVG count is: three deliverables shipped 20 drawings and no photograph each, and every one
of them cleared checks 1-11.

**Source hierarchy — first available wins, and the page must sit at the highest rung it
could reach:**

1. **Client files**, whenever the brief supplies them. Then `grep -c '<img'` must be **≥
   the number of subjects the brief declares photographed** — the count comes from the
   brief, not from a number chosen here. A brief saying "3 projects are properly
   photographed by a professional" sets the floor at 3.
2. **Free stock, as a direct URL in `src`**, sourced via the `mcp__fuse-browser__*` tools.
   This is the normal path when the brief supplies no file — not an exception, and not a
   reason to fall back to a drawing.
3. **A marked placeholder — last resort only**, at the final visual's format and aspect
   ratio, explicitly marked as a placeholder in the markup. An empty grey box is not a
   placeholder; it is what the failing pages actually shipped. A page resting on rung 3
   states in its report why rungs 1 and 2 were unreachable.
4. **Drawn matter adds to the above, it never replaces it.** `<svg>` in place of an
   available photograph is a fail here, and `design-method/SKILL.md` §*The screen-holding
   floor* now says the same thing at the plan stage.

**Which banks, which licence, which URL form is NOT decided here** —
`design-web/references/photos-images.md` owns image sourcing and image quality (sources,
licence, URL form, resolution floors, focal point, alt text). This check only counts what
the delivered page carries and whether it matches what the page claims. One rule, one home.

The floor generalizes the only positive image rule the repo already had, local to one
optional pattern — `design-web/references/premium-patterns/01-numbered-services/description.md:61-62`:
*"Requires one real photograph per row. No photograph, no device — do not ship the reveal
with a placeholder or a duplicate image."* It also closes Gate 0 artefact 4
(`design-method/SKILL.md` §Gate 0, "What will be on screen, counted") at the exit, where
until now it was only checked at the entrance.

**Label ⇄ content coherence, same check, hard fail.** No visible label may assert a
photograph the page does not carry. A section headed "COMPLETED AND PHOTOGRAPHED" over
zero `<img>` is the page contradicting itself:

```bash
grep -niE 'photograph|photo|shot|cliché|photographi' "$FILE"   # read every hit against the <img> count
```
Each hit either resolves to a real image in that same section, or the label is rewritten.
`design-web/references/photos-images.md` stays the quality reference for the images once
present (sources, resolution floors, focal point, alt text) — it says nothing about
whether an image must exist, which is what this check adds.

## 16. Motion floor — presence, not only coherence

Check 4 above verifies **coherence**: it fires only when the design read set
`MOTION_INTENSITY > 4`, and a page that declared nothing passes it with an entirely static
artifact. That is exactly what happened twice. This check adds the **presence** floor, and
does not contradict check 4 — it runs whatever the dial says.

```bash
[ "$(grep -ocE 'transition[-a-z]*\s*:' "$FILE")" -ge 4 ]        # ≥ 4 transition declarations
grep -cE ':hover'         "$FILE"
grep -cE ':focus-visible' "$FILE"
grep -cE 'prefers-reduced-motion' "$FILE"                       # must be ≥ 1
```

- **≥ 4 transitions bound to content or state.** The floor is the corpus floor, not a
  chosen number: `reve-recode` sits at `MOTION_INTENSITY` 3 with *"0 `@keyframes`, 4
  transitions, no scroll reveal anywhere"* (`design-method/SKILL.md` §`MOTION_INTENSITY`).
  Below four, the page is under every page in the corpus.
- **A content reveal is required from `MOTION_INTENSITY` ≥ 4** — the "expressive" band
  (`design-method/SKILL.md` §Design Read, bands calm <4 / expressive 4-7 / cinematic >7).
  Below 4, transitions and states alone satisfy this check; `reve` is the proof it can be
  done well.
- **`:hover` and `:focus-visible` on every interactive element** — links, buttons, inputs,
  cards that act as links. `:focus-visible` is not optional and never suppressed: it is
  already in the *Non-negotiable floor* of `design-method/SKILL.md` (§Design guidance).
  This check is where its absence blocks.
- **`prefers-reduced-motion: reduce` neutralizes all of it** — same Non-negotiable floor.
- **The default DOM state stays visible without JS.** Copy the corpus solution rather than
  inventing one: `cursor-recode` declares its single reveal keyframe *paused* and lets JS
  only lift the pause, *"so a failed script leaves everything visible"*
  (`design-method/SKILL.md` §`MOTION_INTENSITY`). A reveal that starts at `opacity: 0` with
  no such guarantee is a fail here, and is also what makes check 11 report `hidden-text`
  warnings (`scripts/layout-check/README.md` §5).

## 17. Small-viewport legibility floor — a variant, not a scale-down

Responsive is already covered, and this check does **not** re-do any of it: the five
predicates run at six widths (`scripts/layout-check/config.ts:9`, `:18`), the mobile menu
must actually work (`review-procedure.md:89-91`), captures are taken at three viewports
(`review-procedure.md:117`), and touch targets are floored at 44×44
(`audit-checklist.md:60`). What none of them asks is whether the **content is still
readable** once it has been shrunk.

**Why check 11 cannot carry this — two reasons, the second decisive.** A shrunken drawing
overflows nothing (`document-overflow` clean), overlaps nothing (`overlap` clean), wraps no
CTA label (`cta-wrap` clean), and its contrast ratio is unchanged by scale (`contrast`
clean). The predicate that comes closest is `text-overflow`, and it still misses: it
compares `scrollWidth`/`clientWidth` and ink extent against the content box — a 4px label
sitting comfortably inside its box is not overflowing anything. **No predicate in
`checks/` reads `fontSize` at all.** And the decisive reason:
`scripts/layout-check/config.ts:11` excludes `"svg *"` from every check by default, so the
`<text>` nodes inside a drawing are not merely missed, they are **out of scope by
configuration**. Zero violations on illegible content, by construction.

```js
// Part 2 browser session, viewport 360px wide. Rendered size, not declared size:
// every scale applied by viewBox / width:100% / transform is already in the CTM.
[...document.querySelectorAll("svg")].flatMap(svg => {
  const k = svg.getScreenCTM();                     // conteneur → écran
  const s = Math.sqrt(Math.abs(k.a * k.d - k.b * k.c));   // facteur d'échelle effectif
  return [...svg.querySelectorAll("text, tspan")].map(t => ({
    text: t.textContent.trim().slice(0, 40),
    declared: parseFloat(getComputedStyle(t).fontSize),
    rendered: +(parseFloat(getComputedStyle(t).fontSize) * s).toFixed(2),
  }));
}).filter(r => r.rendered < 14)                      // ce qui passe sous le plancher
// dense table cells, same viewport:
[...document.querySelectorAll("td, th, [role=cell], [role=columnheader]")]
  .map(c => ({ text: c.textContent.trim().slice(0, 40),
               rendered: parseFloat(getComputedStyle(c).fontSize) }))
  .filter(c => c.rendered < 14)
```

**Floor: 14px of effective rendered size at 360px**, for any text carrying information —
SVG `<text>`/`<tspan>` labels, dimensions, legends, annotations, and dense table cells.
Non-empty output above is a hard fail.

**Why 360 and not 375.** The failure was observed at 375 (annotations at ~4-5px), but 360
is the width to measure at, for two reasons that stack: it is the **worse case** — the
narrower the viewport, the harder the container scales the drawing down, so a `<text>` that
clears 360 also clears 375, and the converse is false — and it is **one of the six widths
the script already runs** (`scripts/layout-check/config.ts:9`), so this floor and the rest
of the responsive gate finally talk about the same viewport.

Provenance of the number, stated plainly: **14px is the lowest named tier in the repo's own
type scale** — `design-system/references/typography.md:115`, "Caption/meta → text-sm
text-muted-foreground (14px)". Applying it as a floor on **rendered** size inside a graphic
is my extension; the file gives it as a declared step in a typographic scale, not as a
rendering floor. The reason no existing rule catches this: the **Body-Size Floor**
(`typography.md:198-199`) does require ≥ 16px at every breakpoint but **explicitly exempts
caption/small/label tokens** — and a plan annotation is a label. That exemption is exactly
the door the 4px dimensions walked through. This check closes it for graphic-embedded text
without touching the exemption for ordinary captions.

**Under the floor, a scale-down is not a fix — ship a variant.** One of:

- a **simplified SVG** for the small breakpoint: fewer annotations, thicker strokes, a
  `viewBox` recropped onto what matters;
- a **reorganized table** — column priority, stacked rows, or a disclosure;
- the information **moved out of the graphic** into real text next to it.

**Horizontal scroll is a legitimate answer for a table** — `design-webapp/references/layouts/patterns/data-table.md:17-18`
("Horizontal scroll on mobile" on header and body) keeps its full validity, and so does the
"Scale down on mobile" of the illustrations in `layouts/pages/error-pages.md` and
`empty-state.md`. **It is not a legitimate answer for a drawing whose annotations carry the
information.** A table that scrolls keeps every cell at a readable size; a drawing that
scrolls at 4px is unreadable in every position it can be scrolled to. Those rules say what
to do when the content survives shrinking; this check decides **when it no longer does**,
and hands the case to a variant.

Row height and cell padding at small viewport stay governed by check 13 and the density
profile it quotes — this check only floors the **text size** inside the cell.

**Known gap, named on purpose.** Text baked into a bitmap — a plan exported to PNG with its
dimensions burned in — is neither a `<text>` node nor a table cell, so **both snippets miss
it entirely** and no floor applies. There is no mechanism here for that case: it stays on
the visual review (Part 2), by eye, on the small-viewport capture.

## 18. Reference picked by verb, not by tone — named in the report

New check. The criterion it enforces already existed and was **inoperative**: it lived at
`../../design-web/references/refs-design/README.md` §*Reading this index the other way*,
**below** the technique index, so a reference had already been chosen by the time anyone
read it, and nothing anywhere verified the choice. The paragraph has been moved above the
index; this check is what makes it bind.

The rule, unchanged: name what the subject physically **is** and what it **does** — a
**verb** — then scan the index for that verb. Never pick by resemblance of tone.

**This one is read, not grepped**, like checks 7 and 12. Read the deliverable's report and
find both halves. Either missing is a fail.

- **(a) The subject's verb, stated as a verb.** One line: what the thing being designed
  does — it tears, it stacks, it advances, it executes, it closes, it gives back. A noun
  phrase ("a premium artisan brand", "a modern SaaS") is not a verb and does not clear this;
  neither does a mood ("clean", "editorial", "high-end").
- **(b) The reference retained and the procedure borrowed from it**, cited to a folder and a
  section — `stash § 6`, `stripe § 2.3`, `harness § 3`. "Inspired by the corpus" is not a
  citation.

**"None of them" is a passing answer to (b), and the only other one.** If no listed
mechanism performs the verb, say so explicitly and point at the procedure you invented
instead — `README.md` §*The other side of that rule* licenses exactly that, and requires the
invented procedure to be derived from the subject and documented like any other. What fails
here is silence: a report that names no verb, or names a reference without saying which
procedure came from it.

```bash
# not a gate, an aid: confirm the cited section actually exists before accepting the report
grep -n '^#\{2,3\} .*<cited section>' \
  "$CORPUS/<reference>-recode/tokens-<reference>.md"
```

**Two worked examples exist on purpose** (`README.md`, same section): `mainframe` — verb
*"it closes"*, which set an order by decreasing display surface — and `dispatch` — verb
*"it executes"*, which set an order where every claim is followed within its own section by
a surface that runs it. Two, not one, because a single worked example becomes the model
everyone reaches for, which recreates the bias this check exists to break.

---

Any fail here blocks the "audit passed" verdict (`design-review` Part 1), except check 10
(layout-property animation), which is a WARNING — reported, not blocking. Fix and re-run
the failing command; do not proceed to the visual review (Part 2) with an open mechanical
fail (warnings excepted). Check 11 is not optional and not replaceable by looking at the
page: its exit code is the gate.

Checks 12-17 are **composition** checks and block on the same terms. Three of them (12, 14,
17) are measured on the rendered page rather than on the source, so they run **after**
Part 2 has produced its captures, or on a capture taken here — a source grep alone does not
clear them. Check 12 is `brand`-only (`product` exempt, per `layout-discipline.md:72`);
13, 14, 15, 16 and 17 apply to both registers. Check 17 is measured at **360px** — a width
the script does run (`config.ts:9`), but on nodes it excludes by default (`config.ts:11`,
`"svg *"`), which is why the width being shared does not make the check redundant.

**Check 18 is the odd one and runs first, not last.** It reads the *report*, not the
artifact, and what it verifies was decided before a line of HTML existed — so a fail here
cannot be patched by editing the page. It is listed at the end because that is where the
verdict is signed; run it at the top of the pass, so a page picked by tone is caught before
seventeen mechanical checks are spent on it.

## Provenance

Each check was verified against the raw `taste-skill/SKILL.md`
(github.com/Leonxlnx/taste-skill) via direct fetch, not via any second-hand summary.

- **Verified verbatim in taste-skill §14** — checks 2 (eyebrow count
  ≤ ceil(sections/3)), 3 (theme lock / no mid-page flip), 5 (max one marquee),
  6 (premium-consumer palette; hex families from §4.2), 7 (hero ≤ 4 elements). Check 1
  (em-dash) originates in §14 but we operationalize it as a crutch/repetition threshold
  (2+ occurrences) rather than a binary zero-tolerance rule — see below.
- **Fusengine design decision** — check 4 ("motion claimed, motion shown"): a mechanical
  grep gate we defined on top of the repo's real `MOTION_INTENSITY` dial (§1) and its
  §14 "Motion motivated" check. The `> 4` threshold is ours. Check 8 (cluster #1
  co-occurrence) is also ours, mirroring `design-review/references/anti-ai-slop-audit.md`
  entry 9. Checks 9-10 (bounce/elastic easing ban, layout-property animation warning) are
  also ours — not in the source taste-skill — deterministic guardrails mirroring
  `design-motion/references/motion-performance.md` (transform/opacity-only) and the
  `animation-decision-framework.md` gate; canonical-once, not restated there. Check 11
  (rendered-layout script) is ours too: it mechanizes `layout-discipline.md` §6, already
  written in this repo but never machine-verified. Its thresholds (1.6 × line-height,
  10% intersection area, WCAG 4.5:1 / 3:1) and its false-positive filters were calibrated
  against real pages, not chosen in the abstract — see `scripts/layout-check/README.md`.
- **Fusengine, small-viewport legibility (check 17)** — not in the source taste-skill, and
  not previously anywhere in this repo. Added after a delivered page rendered its plan
  annotations (LIMITE PARCELLE, EXISTANT, cotes 17.40 / 22.00) at ~4-5px at 375px: the SVG
  had been shrunk, not rethought. The 14px floor is quoted from `typography.md:115`
  (lowest named tier of the repo's own scale); **applying it to rendered size inside a
  graphic is ours**, as is the choice of the measurement width: the failure was seen at
  375px, the floor is measured at **360px** — the worse of the two, and one the script
  already runs. The gap it closes
  is structural, not an oversight: the Body-Size Floor (`typography.md:198-199`) exempts
  caption/small/label tokens, and `scripts/layout-check/config.ts:11` excludes `"svg *"`
  from every predicate — so graphic-embedded text had no floor at all, at any width. This
  check does not modify either: it adds the missing floor beside them.
- **Fusengine, selection gate (check 18)** — not in the source taste-skill. The criterion is
  the repo's own (`refs-design/README.md`, §*Read this before the table*); **making it
  blocking, and requiring both halves to be named in the report, is ours.** It was added
  after three measured defects in the same paragraph: it sat *below* the technique index so
  it was read after the choice was made; nothing verified it; and it offered `mainframe` as
  the single "worked example", which turned one reference into the default pick. The
  paragraph was moved above the index and given a second example (`dispatch`); this check
  supplies the enforcement it never had. No threshold is invented here — the check is
  read-and-verify, like checks 7 and 12(b).
- **Fusengine, composition gate (checks 12-16)** — none is in the source taste-skill. All
  five were added after three real deliverables passed checks 1-11 and were judged
  unshippable (flat hierarchy, no vertical rhythm, an off-centre container, zero `<img>`
  on a brief that supplied photography, no motion at all). **Four of the five gate a rule
  that already existed elsewhere and had no blocking counterpart**, and they point at it
  rather than restating it: check 12 → `design-web/references/layout-discipline.md` §9 +
  `elicitation-visual.md` §1; check 13 → `anti-ai-slop-audit.md` entry 15(b) (lifted out of
  its conjunction) + the three density profiles of
  `design-system/references/spacing-density.md`; check 15 → the per-row photograph rule of
  `premium-patterns/01-numbered-services/description.md` + Gate 0 artefact 4, with all
  sourcing questions (banks, licence, URL form, quality) delegated to
  `design-web/references/photos-images.md` — this check counts what the page carries, it
  never decides where an image comes from; check 16 →
  the `MOTION_INTENSITY` corpus anchors and the *Non-negotiable floor* of
  `design-method/SKILL.md`. **Check 14 (container centring / shared gutter) is genuinely
  new** — no file in the repo carried it, and check 11 cannot: none of its five predicates
  measures the container's offset inside the viewport. Every numeric threshold in 13, 15
  and 16 is quoted from an existing file with its line; the only number chosen here is
  check 12's **2× area ratio**, which operationalizes §9's "not tied with 2+ other blocks
  of near-equal area/contrast" and is ours, on the same footing as check 4's `> 4` dial
  threshold.
