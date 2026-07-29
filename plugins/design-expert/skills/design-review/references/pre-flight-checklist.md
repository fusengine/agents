---
name: pre-flight-checklist
description: "Mechanical grep/count checks run as the last filter before a design is declared audit-clean (em-dash crutch threshold, eyebrow count, theme lock, motion-claimed-motion-shown, cluster #1 co-occurrence)."
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
because only it blocks mechanically. **Both were adjusted, on a count taken across the ten
corpus pages:**

- **Theme inversion at section level: 0 of 10.** No page in the corpus puts a light section
  in a dark page or a dark section in a light one. `cursor` is the only light-based page
  and its sole dark surfaces are a phone chassis drawn in CSS, plus its whole-page dark
  theme. **This check is upheld, unchanged in substance.**
- **A section whose background departs from the page base, inside the same theme: 5 of 10.**
  `supercommon` gives its first band a metallic gradient rising to `#bfc6c1`; `fora` closes
  on a `#000 → #1b2228` gradient under a 190px horizon image; `harness` runs
  `#070707 → #050505` under two sections; `umbrel` dissolves one band into the next over
  160px; `xai` draws an 80px grid under an elliptical mask. **None of these is a fail here,
  and none ever was** — they change the surface, never the theme.

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

---

Any fail here blocks the "audit passed" verdict (`design-review` Part 1), except check 10
(layout-property animation), which is a WARNING — reported, not blocking. Fix and re-run
the failing command; do not proceed to the visual review (Part 2) with an open mechanical
fail (warnings excepted). Check 11 is not optional and not replaceable by looking at the
page: its exit code is the gate.

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
