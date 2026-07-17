---
name: design-review
description: "The final quality gate before any design deliverable is reported done — two ISOLATED assessments (deterministic detection never in the same head as the subjective/visual read), P0-P3 findings with NO aggregate score ever, a bounded visual loop (max 2 fix cycles), and a mandatory in-loop challenger gate (fresh-context, blind PNG) before any 'done' claim."
when-to-use: "After design-motion (or directly after the mockup for design-ios/design-android) — the last step before reporting a design deliverable done. Also the target of design-method's critique.md and audit.md moves."
keywords: review, audit, critique, challenger, p0-p3, no-aggregate-score, wcag, anti-slop, contrast
priority: critical
related: design-method, design-motion, design-system, ux-copy
---

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
- The 3 elements declared in `design-web`/`design-webapp` ("Je reproduis: {el1}, {el2},
  {el3}") and any declared premium pattern(s); the signature element
  (`design-method` Step 2) instead gets a **Signature Dominance** verdict.

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
(4.5:1 text / 3:1 UI, light+dark), forbidden fonts, OKLCH-only color format, em-dash
crutch (2+ occurrences), token adherence, the anti-AI-slop audit
(`references/anti-ai-slop-audit.md`, 14 detectors — clusters 9-11 are
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
5-Second / Persona) → fix gaps. Full step-by-step: `references/review-procedure.md` Part 2.

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
- Binary verdict per declared element/pattern; Signature Dominance for the signature element.
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
| `references/anti-ai-slop-audit.md` | Deterministic AI-slop detection, 14 entries, PASS/FAIL per entry |
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
