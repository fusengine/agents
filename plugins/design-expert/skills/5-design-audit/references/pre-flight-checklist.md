# Mechanical Pre-Flight Checklist

Load when Phase 5 Step "Pre-Flight" runs — the last mechanical filter before the output
is declared audit-clean. Condensed and adapted from the taste-skill "Final Pre-Flight
Check" (github.com/Leonxlnx/taste-skill — `SKILL.md` §14).

These are **verifiable commands**, not intentions. Run each against the generated
HTML/CSS (assume `$FILE` is the artifact). A non-empty match on a "must be 0" grep, or a
count over its cap, is a hard fail — fix, then re-run. Do not eyeball; execute.

## 1. Zero em-dashes anywhere visible

```bash
grep -nE '—|–' "$FILE"        # must return NOTHING (exit 1)
```
Headlines, eyebrows, pills, body, quotes, captions, buttons, alt text — zero `—`/`–`.
Any hit fails the check and the string must be rewritten.

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

---

Any fail here blocks the Phase 5 "audit passed" verdict. Fix and re-run the failing
command; do not proceed to Phase 6 with an open mechanical fail.

## Provenance

Each check was verified against the raw `taste-skill/SKILL.md`
(github.com/Leonxlnx/taste-skill) via direct fetch, not via any second-hand summary.

- **Verified verbatim in taste-skill §14** — checks 1 (em-dash), 2 (eyebrow count
  ≤ ceil(sections/3)), 3 (theme lock / no mid-page flip), 5 (max one marquee),
  6 (premium-consumer palette; hex families from §4.2), 7 (hero ≤ 4 elements).
- **Fusengine design decision** — check 4 ("motion claimed, motion shown"): a mechanical
  grep gate we defined on top of the repo's real `MOTION_INTENSITY` dial (§1) and its
  §14 "Motion motivated" check. The `> 4` threshold is ours.
