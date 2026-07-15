---
name: ux-copy
description: "Microcopy guide: CTA labels, error messages, empty states, form placeholders — aligned with the tone from design-method and the sector from design-system.md. Can run at any point in the pipeline, not tied to a fixed phase."
when-to-use: "Writing or auditing any user-facing string — CTAs, errors, empty states, onboarding, form copy — for a web, webapp, iOS, or Android target."
keywords: copy, ux-writing, cta, microcopy, voice, tone
priority: high
related: design-method, design-system, design-web, design-webapp
---

## UX Copy — Voice, Tone, and Microcopy

### When
Whenever user-facing copy is being written or reviewed — typically after
`design-system.md` exists (it carries the sector and tone) and before or during
component generation in `design-web`/`design-webapp`. Not tied to a fixed pipeline
position: a copy-only request can invoke this skill directly.

### Input
- `design-system.md` identity block (sector, brand personality) if it exists.
- The tone committed to in `design-method` Step 1.

### Steps

1. **Detect sector** from `design-system.md`, or from the brief if no design system exists yet.
2. **Load voice profile** from `references/voice-tone-sectors.md` — match sector to the
   NNG 4-dimension voice profile.
3. **Load sector copy examples**: `references/copy-fintech.md`, `references/copy-ecommerce.md`,
   or `references/copy-saas.md`.
4. **Define microcopy patterns** using `references/microcopy-patterns.md` — CTAs, form
   labels, validation messages, toasts. Sector-tested CTA phrasing:
   `references/templates/cta-patterns.md`.
5. **Define empty-state copy** from `references/empty-states-copy.md` — first-time,
   no-results, error-recovery formulas. Error copy formula:
   `references/templates/error-messages.md`.
6. **Onboarding copy**, if relevant: `references/templates/onboarding-copy.md`.
7. **Generate `copy-guide.md`** using `references/templates/copy-guide-template.md`.
8. **Run the Copy Self-Audit** (below) — mandatory before any copy ships, not advice.

### Copy Self-Audit — Pre-Flight Gates
All four must pass; full catalogue in `references/copy-self-audit.md`:

1. **Em-dash — avoid as a crutch, not a hard ban.** A single em-dash doesn't block;
   flag it only when it shows up repeatedly (a recurring tic) or as a lazy substitute
   for clearer punctuation (period, comma, colon, parentheses). En-dashes for ranges
   (`2018-2026`, `€40-80k`) are fine.
2. **No AI "production tells."** Reject unless the brief explicitly demands it: hero
   version labels (`v0.6`, `BETA`), numbered section eyebrows (`00 / INDEX`), scroll cues
   (`↓ scroll`), `Quietly trusted by`, fabricated live counters.
3. **Fake-precise-number flag.** Every `92%`, `4.1×`, `48k` must trace to real data or be
   labelled mock.
4. **Final string review.** Re-read each visible string; flag anything grammatically
   broken, ambiguous, or AI-hallucination-sounding. One copy register per page.

### Output
- `copy-guide.md`: voice profile, tone per context, CTA patterns, error templates, empty-state copy.
- Copy Self-Audit passed.

### Next → back to `design-web`/`design-webapp` for component generation, or `design-review`.

### References
| File | Purpose |
|------|---------|
| `references/copy-self-audit.md` | **Pre-ship gates: em-dash crutch threshold, production-tell catalogue, fake-number flag, final review** |
| `references/voice-tone-sectors.md` | NNG voice profiles per sector |
| `references/microcopy-patterns.md` | CTA, form, validation, toast patterns |
| `references/empty-states-copy.md` | Empty-state copy formulas |
| `references/copy-fintech.md` | Fintech-specific copy examples |
| `references/copy-ecommerce.md` | E-commerce copy examples |
| `references/copy-saas.md` | SaaS copy examples |
| `references/templates/copy-guide-template.md` | Copy guide template |
| `references/templates/cta-patterns.md` | CTA pattern templates |
| `references/templates/error-messages.md` | Error message templates |
| `references/templates/onboarding-copy.md` | Onboarding copy templates |
