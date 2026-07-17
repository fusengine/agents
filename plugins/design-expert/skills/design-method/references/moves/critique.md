---
name: critique
description: "Design-quality review of the body — visual pass + a fixed 'SaaS-jaded skeptic' persona, no aggregate score, prioritized findings, verdict delegated to the challenger."
when-to-use: "After a body pass exists (design-web/webapp/ios/android output) and you need a design-quality read — hierarchy, emotional resonance, generic-vs-committed — not a technical audit (see audit.md)."
keywords: critique, review, persona, hierarchy, findings, challenger
priority: high
related: audit.md, bolder.md, quieter.md, distill.md, ../../design-review/references/elicitation-visual.md
---

# Critique — Design-Quality Review (Body)

### When to use
- A body pass exists (post `design-web`/`design-webapp`/`design-ios`/`design-android`) and the ask is a design-quality read: hierarchy, emotional resonance, "does this commit to something or is it the safe default" — not a mechanical check (that's `audit.md`).
- Re-run after `bolder`/`quieter`/`distill` to confirm the correction actually landed, not just changed.

### Steps
1. Resolve the target (page/component/screen) and capture it — screenshot per section plus one full-page capture, light AND dark (reuse `design-review/references/review-procedure.md` Part 2 steps 1-3's capture procedure). A critique never runs on markup alone; it runs on the rendered artifact.
2. First pass: pick 2 named techniques from `design-review/references/elicitation-visual.md` (Squint / Subtraction / Competitor Line-up / 5-Second / Persona) that fit the target and name which two were used — real independence still comes from the challenger gate (step 5), not from stacking lenses solo.
3. Second pass: apply the fixed persona — **a reviewer who has seen 500 near-identical AI-generated SaaS products this year and is bored by all of them.** This persona is fixed, not user-selectable; its only question is "does the body commit to something, or is it the same safe default I've already seen 500 times." Aim it at the CORPS (body/content region) — nav/footer chrome and register direction are out of scope here.
4. Collect findings from both passes into one prioritized list — Blocker / Should-fix / Nice-to-have. **No aggregate score, ever** — same Gate Semantics as `design-review/references/anti-ai-slop-audit.md`: each finding stands PASS/FAIL (or priority-tier) independently, never averaged or summed into a number.
5. Delegate the verdict to `fuse-ai-pilot:challenger` — fresh-context, fed the screenshots plus this move's findings as evidence, never this move's own reasoning (blind-judgment rule, same as `design-review/references/review-procedure.md` step 9). Critique produces findings; challenger renders the verdict on whether they hold.
6. If challenger returns REFUTED or UNCERTAIN on a finding, drop or downgrade it before it reaches the report — don't argue a fresh-context verdict from inside the pass that produced the original claim.

#### Report template

```markdown
## Critique — [target]

**Passes run:** [technique 1] + [technique 2] + persona (SaaS-jaded skeptic)

### Findings (priority order, no aggregate score)
| Priority | Section/element | Finding | Why it matters |
|----------|------------------|---------|-----------------|
| Blocker | ... | ... | ... |
| Should-fix | ... | ... | ... |
| Nice-to-have | ... | ... | ... |

### Persona notes (SaaS-jaded skeptic, body only)
- [1-3 lines: what reads as generic-default vs. what actually commits]

### Challenger verdict
CONFIRMED / REFUTED / UNCERTAIN per finding above — [1-line synthesis]
```
