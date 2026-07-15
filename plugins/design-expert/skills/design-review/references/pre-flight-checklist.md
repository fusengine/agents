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

## 3. Zero theme-flip mid-scroll

```bash
# one theme (light | dark | auto) for the whole page — no section inverts mid-page
grep -niE 'class="[^"]*\b(bg-(black|zinc-9|slate-9|neutral-9))' "$FILE"   # inspect: all sections share ONE base
```
Exactly one page theme lock. A dark section dropped into an otherwise light page (or the
reverse) is a fail. Inspect the hits — they must all belong to the same locked theme.

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

---

Any fail here blocks the "audit passed" verdict (`design-review` Part 1). Fix and re-run
the failing command; do not proceed to the visual review (Part 2) with an open mechanical fail.

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
  entry 9.
