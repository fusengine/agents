---
name: design-audit
description: "Phase 5: Verify contrast >= 4.5:1 text / 3:1 UI in both light+dark, check no Inter/Roboto/Arial/Open Sans, confirm all colors are OKLCH from design-system.md, validate hover/focus/disabled/loading states, run anti-AI-slop checklist."
phase: 5
---

## Phase 5: DESIGN AUDIT — Validate quality and accessibility

### When
After Phase 4 animations are applied. Final quality validation.

### Input (from Phase 4)
- Complete components with animations, interactive states, and visual effects.
- `design-system.md` as the audit baseline.

### Steps
1. **Load baseline** — Read `design-system.md` to establish expected tokens, fonts, colors.
2. **Run audit checklist** from `references/audit-checklist.md`:
   - Typography: fonts match design-system, no forbidden fonts, fluid scale works.
   - Colors: all OKLCH, no hard-coded hex/RGB, semantic tokens used.
   - Spacing: consistent base unit, no magic numbers.
   - Motion: timing within limits, reduced-motion supported.
3. **Check consistency** per `references/consistency-checks.md` — cross-component visual coherence (border-radius, shadows, spacing rhythm).
4. **Run anti-AI-slop audit** from `references/anti-ai-slop-audit.md` — detect generic purple gradients, Inter font, flat backgrounds, missing animations.
5. **Validate WCAG** per `references/ux-wcag.md` — contrast 4.5:1 text / 3:1 UI, focus indicators, touch targets 44x44px minimum.
6. **Apply UX heuristics** — Nielsen (`references/ux-nielsen.md`), UX laws (`references/ux-laws.md`), patterns (`references/ux-patterns.md`).
7. **Motion Audit** — if Phase 4 added any animation/transition/scroll-reveal/hover/gesture code, run `references/motion-audit.md`: measure every animation against the 10 non-negotiable standards, flag the escalation triggers on sight, and triage the fixes strictly through the remediation hierarchy (delete → reduce → fix easing → fix origin → make interruptible → move to GPU → asymmetric timing → polish → accessibility/cohesion).
8. **Mechanical Pre-Flight** — run the executable checklist in `references/pre-flight-checklist.md`: greppable checks (zero em-dash, uppercase-tracking count ≤ ceil(sections/3), single theme lock, motion-claimed-motion-shown, ≤1 marquee, banned premium palette absent, hero ≤4 elements). Any fail blocks the audit-passed verdict.
9. **Generate audit report** — categorized findings (Critical / Major / Minor) with fix recommendations.
10. **Apply fixes** — Correct all Critical and Major issues before proceeding.
11. **Re-audit loop** — Return to Step 2 and re-run the full audit on the fixed output. Max 2 fix cycles; if issues remain after cycle 2, STOP and report the remaining issues instead of looping.

### Anti-AI-slop few-shot examples
Use these as calibration for the subjective judgment call in Step 4:

**REJECT**
- A generic purple-to-blue gradient hero, set in Inter, with emoji used as bullet points — reads as templated AI output, not a designed identity.
- Identical border-radius and box-shadow applied to every card on the page with no visual hierarchy between primary and secondary content.

**ACCEPT**
- A sector-derived OKLCH palette with chroma > 0.05, paired with an approved typography combination and one deliberate accent color used sparingly for emphasis.
- An asymmetric grid with an intentional whitespace rhythm that guides the eye instead of evenly-spaced, interchangeable blocks.

### Output
- Audit report with categorized findings and applied fixes.
- All Critical/Major issues resolved. WCAG AA compliant. Anti-AI-slop passed.

### Next → Phase 6: FINAL REVIEW
`6-handoff-review/SKILL.md` — Screenshot light+dark, compare 3 elements, fix gaps, report.

### References
| File | Purpose |
|------|---------|
| `references/audit-checklist.md` | Full audit procedure |
| `references/consistency-checks.md` | Cross-component consistency |
| `references/anti-ai-slop-audit.md` | Generic AI design detection |
| `references/motion-audit.md` | 10 motion standards, escalation triggers, remediation hierarchy (adapted from Emil Kowalski's review-animations) |
| `references/pre-flight-checklist.md` | Mechanical grep/count checks (adapted from taste-skill §14) |
| `references/ux-wcag.md` | WCAG accessibility standards |
| `references/ux-nielsen.md` | Nielsen usability heuristics |
| `references/ux-laws.md` | UX laws (Fitts, Hick, Miller) |
| `references/ux-patterns.md` | Common UX patterns |
