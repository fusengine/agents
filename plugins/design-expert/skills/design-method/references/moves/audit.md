---
name: audit
description: "Technical review of the body — deterministic checks (contrast, forbidden fonts, OKLCH-only, em-dash, motion transform/opacity, layout-discipline conformance in the output, dark-elevation). Severity Critical/Major/Minor, no aggregate score."
when-to-use: "After any body pass or correction move (bolder/quieter/distill/harden), before polish.md — whenever a mechanical/deterministic technical read is needed instead of a taste judgment (that's critique.md)."
keywords: audit, deterministic, contrast, oklch, fonts, motion, dark-elevation, layout-discipline
priority: critical
related: critique.md, polish.md, ../../design-review/references/anti-ai-slop-audit.md, ../../design-review/references/audit-checklist.md
---

# Audit — Technical Review (Deterministic)

### When to use
- After any body pass or correction move (`bolder`/`quieter`/`distill`/`harden`), before `polish.md`.
- Whenever the ask is mechanical/deterministic — not a taste judgment (that's `critique.md`).
- Don't fix issues here — document them with severity; fixing is the domain expert's job downstream, same split as `design-review/references/review-procedure.md` Part 1.

### Steps
1. Resolve target files (HTML/CSS or component tree).
2. **Contrast** — recompute every foreground/background pair, light AND dark, against `design-system/references/contrast-ratios.md` (4.5:1 normal text, 3:1 large text/UI components) — canonical thresholds, not restated here.
3. **Forbidden fonts** — grep `font-family` against `design-system/references/forbidden-fonts.md`'s canonical list: hard-forbidden tier (`Inter`, `Roboto`, `Arial`, `Open Sans`, `Lato`, `Poppins`) auto-fails; flag-when-undeclared tier (`Fraunces`, `Instrument Serif`, `Playfair Display`, `Geist`, `Space Grotesk`) only fails if used without a declared signature-element rationale.
4. **OKLCH-only** — grep for hex/`rgb()`/`hsl()`; every color must resolve through `oklch()` per `design-system/references/oklch-system.md`.
5. **Em-dash discipline** — grep `—`; not a hard-fail on a single occurrence, flags when it reads as a repeated crutch (2+ occurrences in the artifact) — shared gate with `ux-copy`, same rule as `design-review/references/review-procedure.md` item 4.
6. **Motion transform/opacity** — grep animated CSS properties; anything driving layout/paint properties outside `transform`/`opacity` is a Major finding per `design-motion/references/motion-performance.md`'s hardware-acceleration rule.
7. **Layout-discipline conformance in the output** — re-check `design-web/references/layout-discipline.md` rules 1-7 (hero hard numbers, eyebrow restraint, zigzag cap, bento N=N cell count, section-repetition ban, CTA discipline, content density) against the actual rendered markup, not the plan that was supposed to produce it.
8. **Dark-elevation** — verify elevated/popular/featured surfaces differ from their base sibling via a lighter `L` (OKLCH lightness) or a border/accent, per the `L`-scale mechanism at `design-system/references/edge-cases.md:31-42`; identical `L` with no border/accent is a fail.
9. Cross-check anything not already covered above against `design-review/references/anti-ai-slop-audit.md`'s 14-entry deterministic blacklist and `design-review/references/pre-flight-checklist.md` — cite those detectors, don't re-implement them here.
10. Assign severity per finding — Critical / Major / Minor, same 3-tier scale as `design-review/references/audit-checklist.md`. **No aggregate score, no letter grade** — each finding stands independently, same Gate Semantics rule as `anti-ai-slop-audit.md`.

#### Report template

```markdown
## Audit — [target]

| # | Check | Severity | Status | Details |
|---|-------|----------|--------|---------|
| 1 | Contrast | Critical | PASS/FAIL | ... |
| 2 | Forbidden fonts | Major | PASS/FAIL | ... |
| 3 | OKLCH-only | Major | PASS/FAIL | ... |
| 4 | Em-dash discipline | Minor | PASS/FAIL | ... |
| 5 | Motion transform/opacity | Major | PASS/FAIL | ... |
| 6 | Layout-discipline conformance | Major | PASS/FAIL | ... |
| 7 | Dark-elevation direction | Critical | PASS/FAIL | ... |

No aggregate score. Any Critical/Major blocks "audit passed" until fixed.
```
