---
name: design-review
description: "Use when a design deliverable is about to be reported done — the final quality gate after design-motion or a mobile mockup."
when-to-use: "After design-motion (or directly after the mockup for design-ios/design-android) — the last step before reporting a design deliverable done. Also the target of design-method's critique.md and audit.md moves."
keywords: review, audit, critique, challenger, p0-p3, no-aggregate-score, wcag, anti-slop, contrast, lookalike-test, body-sequence, je-reproduis
priority: critical
related: design-method, design-motion, design-system, ux-copy
---

<objective>
The final quality gate before any design deliverable is reported done. Runs two assessments that must stay ISOLATED from each other — deterministic detection (grep/count/compute checks) is never performed in the same head as the subjective/visual read, because collapsing them into one pass is exactly how prior AI-slop clusters shipped through this audit undetected.

Findings are tagged P0-P3 (Blocking / Major / Minor / Polish) and reported individually — there is NO aggregate score, health score, or letter grade, ever; an aggregated number invites self-grading theater.

The visual review is a bounded loop, maximum 2 fix cycles: the loop exits PASS only once the register-applicable positive floors are actually met, and a plateau (cycle 2 repeating cycle 1's finding) stops immediately even at cycle 1 of 2.

Before any "done" claim, a mandatory in-loop challenger gate judges the deliverable blind — fresh-context, off a rendered PNG only, never fed this procedure's own reasoning. A Block from the challenger must be resolved or owner-accepted before "done" is reported.
</objective>

## Design Review — Final Quality Gate

### When
After `design-motion` (web/webapp) or directly after the mockup (`design-ios`/
`design-android`). The last step before reporting any design deliverable done — never
skipped, never reported as passed if it wasn't actually run
(`references/review-procedure.md` Failure Handling).

### Input
- The complete rendered artifact: components/mockup with animations (if any) and
  interactive states.
- `design-system.md` as the audit baseline (tokens, forbidden fonts, contrast floors).
- The `Je reproduis` line written by `design-web`/`design-webapp` — three declared
  elements, **two tagged `[corpus: {reference}/{tokens section}]`** (measured procedure,
  the craft) and **one tagged `[sector: {url} — register]`** (register signal only;
  `[sector: none — register from brief]` is valid, an empty slot is not). A missing or
  untagged line is a blocking Part 1 finding — the binary verdict has no input without it.
- **The corpus pages opened** (Gate 0 artefact 3): at least two
  `{reference}-recode/index.html`, named. The `[corpus: …]` tags prove the corpus was read,
  never that it was seen — and a page sourced from markdown alone clears every mechanical
  check and reads dead. Absent ⇒ blocking Part 1 finding.
- **The on-screen inventory** (Gate 0 artefact 4): what each section physically carries,
  plus the screen-holding-floor verdict. Blocking when `VISUAL_DENSITY` ≤ 3 or
  `DESIGN_VARIANCE` ≥ 6; reported otherwise.
- Any declared premium pattern(s); the signature element (`design-method` Step 2) instead
  gets a **Signature Dominance** verdict.
- The plan's two structural picks — hero treatment
  (`design-method/references/macrostructure-bank.md`) **and** body sequence
  (`design-method/references/body-sequence-bank.md`). A plan naming neither is itself a
  detector signal (anti-slop entry 15). `brand` register; a `product` deliverable carries
  neither.
- **The register** (`brand`/`product`, from `design-method` Gate 0) — an input, never
  inferred mid-review: check 14's floors, Part 2 item 8's floors and the Lookalike Test
  (item 8b) all branch on it.

### The two assessments — ISOLATED, never in the same head
This is the structural rule the whole procedure hangs on: the mechanical read and the
subjective read must not anchor on each other.

1. **Deterministic detection** (`references/anti-ai-slop-audit.md` +
   `references/pre-flight-checklist.md`) — grep/count/compute, zero taste involved. Run
   by `design-expert` itself; there is nothing to isolate here because there is no
   judgment call to bias.
2. **Subjective visual review** — screenshots, named elicitation techniques
   (`references/elicitation-visual.md`), Nielsen heuristics
   (`references/ux-nielsen.md`), UX laws (`references/ux-laws.md`). This pass is run by
   `design-expert`, so it is **not yet independent** — independence is delivered by the
   mandatory challenger gate below, which judges blind, fresh-context, off the rendered
   PNG only, never this procedure's own reasoning. Do not treat the elicitation-technique
   pass alone as "isolated" — it isn't; the challenger is the isolation.

Never collapse these into one pass "to save a round" — that is exactly how the
cream/serif/terracotta cluster shipped through this audit once already (documented in
`anti-ai-slop-audit.md` Gate Semantics).

### Part 1 — Deterministic Checks (mechanical, run first)
Full 15-item list is canonical in `references/review-procedure.md` Part 1 — contrast
(4.5:1 text / 3:1 UI, light+dark), forbidden fonts, OKLCH-only color format **in the
produced code** (corpus values arrive as hex/rgb — convert them, never drop them), em-dash
crutch (2+ occurrences), token adherence, the anti-AI-slop audit
(`references/anti-ai-slop-audit.md`, 15 detectors — including entry 15, the generic **body**
sequence: canonical order verbatim AND uniform vertical rhythm, a conjunction because the
canon *treated* is legitimate; clusters 9-11 are
FLAG-with-justification, not a block, if declared per `design-method` Step 2), the
mechanical pre-flight (`references/pre-flight-checklist.md`), WCAG beyond contrast
(`references/ux-wcag.md`), cross-component consistency (`references/consistency-checks.md`),
mobile nav functionality, doc↔code animation diff, integrity (no fabricated numbers/false
urgency), no-JS baseline, Type-Scale/Body-Size/Measure/Focal-Block floors, and
Dark-Elevation Direction. Any Critical/Major finding here is fixed before Part 2 runs.

### Part 2 — Bounded Visual Review
Serve → screenshot per section + one full-page capture, light AND dark via
`colorScheme` → cross-viewport (mobile/tablet/desktop) → compare declared elements
(binary present/absent, no partial credit; signature element gets Signature Dominance) →
localized critique only (name the exact section/element, never "improve the style") →
motion verdict if any animation exists (`references/motion-verdict.md`, Before/After/Why
table + tiered impact + explicit Block/Approve) → cite at least **two** named techniques
from `references/elicitation-visual.md` (Squint / Subtraction / Competitor Line-up /
5-Second / Persona) → fix gaps → **Lookalike Test, `brand` only / `product` exempt** (item
8b — this procedure is the only executant of the test `design-web` declares; definition
canonical in `design-web/references/design-inspiration.md`, never restated here; binary
`[distinguishable]`/`[indistinguishable]`, and an `[indistinguishable]` sends the page back
to the **body sequence** pick, never to a cosmetic tweak. On `product` it does not apply —
an app screen is supposed to share a silhouette with other app screens, Jakob's Law — and
the **Domain-Specificity Floor** (`design-method/references/register/product.md` §2) runs
in its slot instead, per `design-webapp/SKILL.md`). Full step-by-step:
`references/review-procedure.md` Part 2.

**Bounded loop — maximum 2 fix cycles.** The loop exits PASS only once the
register-applicable positive floors are actually **met** (not merely "0 flags"). Issues
(or an unmet floor) remaining after cycle 2 **stop the loop** and get reported, not
chased further. A plateau — cycle 2 repeating cycle 1's finding — stops immediately, even
at cycle 1 of 2. This is a hard cap, not a target to exceed when "almost there."

### Findings — P0-P3, NO aggregate score, ever
Tag every finding with severity, never sum or average them into a total:

| Tier | Meaning |
|---|---|
| **P0 Blocking** | Prevents task completion / hard WCAG-A failure — fix immediately |
| **P1 Major** | Significant difficulty or WCAG AA violation — fix before release |
| **P2 Minor** | Annoyance, workaround exists — fix in next pass |
| **P3 Polish** | Nice-to-fix, no real user impact — fix if time permits |

This maps onto `references/audit-checklist.md`'s Critical/Major/Minor column
(Critical→P0, Major→P1, Minor→P2/P3 by impact) — but its "Scoring" section (letter grades
A-D) is **not used here**: it is superseded by this rule. **No aggregate score, no health
score out of N, no letter grade — ever.** Same Gate Semantics already enforced in
`references/anti-ai-slop-audit.md` and in `design-method`'s `critique.md`/`audit.md`
moves: each finding stands PASS/FAIL or tier-tagged independently. An aggregated number
invites self-grading theater and has already failed once in this exact pipeline — don't
reintroduce it in the report format.

### Challenger gate — mandatory, in-loop, not a trailing consultation
Before any "done" claim, `design-expert` invokes `fuse-ai-pilot:challenger` (it holds the
`Task` tool) to judge **blind**: PNG + a short brief, named elicitation lenses,
fresh-context — never this procedure's own reasoning fed in as the frame. A Block must be
resolved or owner-accepted before "done" (consultative verdict, not a veto — challenger
never overrides the owner). **Fallback**: only if `Task`/`Agent` is unavailable (agent at
max nesting depth 5) → report "not judged" / escalate to the owner, never a silent "done".
Full mechanics: `references/review-procedure.md` item 9.

### Failure Handling
- All server ports 8899-8905 busy → stop, report the deliverable unreviewed, say so
  explicitly — never report a validation that wasn't executed.
- Screenshot tool fails → retry once; on a second failure, stop and report the gap rather
  than declaring the visual review passed.

### Output
- Part 1 deterministic results, all Critical/Major resolved.
- Light/dark + 3-viewport screenshots (Part 2).
- Binary verdict per declared element/pattern, each cited with its `[corpus: …]`/`[sector: …]`
  tag; Signature Dominance for the signature element.
- Lookalike Test verdict (`brand`), with the hero treatment and body sequence named — or
  `[n/a — product register; Domain-Specificity Floor run instead: {verdict}]`. Never blank,
  never "passed" by default.
- Motion Block/Approve verdict if applicable.
- Findings list, P0-P3, no aggregate score.
- Challenger verdict: resolved/owner-accepted, or "not judged" on tool-unavailable fallback.
- Any remaining Minor/P2-P3 issues after the 2-cycle cap, reported, not hidden.

### Next → report to the owner. A P0/P1 unresolved or challenger-Blocked finding means
the deliverable is not "done" — say so plainly, don't soften it into "mostly ready."

### References
| File | Purpose |
|------|---------|
| `references/review-procedure.md` | **Canonical full procedure — Part 1/Part 2/challenger gate, step-by-step** |
| `references/anti-ai-slop-audit.md` | Deterministic AI-slop detection, 15 entries, PASS/FAIL per entry (15 = generic body sequence) |
| `references/pre-flight-checklist.md` | **Mechanical grep/count checks — last filter before audit-clean** |
| `references/elicitation-visual.md` | Named visual techniques (Squint/Subtraction/Competitor/5-Second/Persona) |
| `references/audit-checklist.md` | Typography/color/spacing/motion/a11y checklist tables (ignore its Scoring section — superseded above) |
| `references/consistency-checks.md` | Cross-component border-radius/shadow/spacing coherence |
| `references/ux-wcag.md` | WCAG 2.2 AA beyond contrast (focus, touch targets, keyboard nav) |
| `references/ux-nielsen.md` | Nielsen's 10 usability heuristics |
| `references/ux-laws.md` | Laws of UX (Fitts, Hick, Miller) |
| `references/ux-patterns.md` | Form/validation/mobile UX implementation patterns |
| `references/motion-audit.md` | 10 motion standards + delete-first remediation hierarchy |
| `references/motion-verdict.md` | Block/Approve verdict format for reviewed motion |
