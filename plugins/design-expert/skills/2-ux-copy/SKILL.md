---
name: ux-copy
description: "Phase 2: Write microcopy guide: CTA labels, error messages, empty states, form placeholders — all aligned with identity personality and audience from Phase 0."
phase: 2
---

## Phase 2: UX COPY — Voice, tone, and microcopy

### When
After Phase 1 design system is built. Before component generation.

### Input (from Phases 0-1)
- `design-system.md` with sector and brand personality.
- Token system from Phase 1 (informs visual tone alignment).

### Steps
1. **Detect sector** from `design-system.md` identity block.
2. **Load voice profile** from `references/voice-tone-sectors.md` — match sector to NNG 4-dimension voice profile.
3. **Load sector copy examples** from `references/copy-fintech.md`, `references/copy-ecommerce.md`, or `references/copy-saas.md`.
4. **Define microcopy patterns** using `references/microcopy-patterns.md` — CTAs, form labels, validation messages, toasts.
5. **Define empty state copy** from `references/empty-states-copy.md` — first-time, no-results, error-recovery formulas.
6. **Generate `copy-guide.md`** using `references/templates/copy-guide-template.md` — project-specific voice & tone document.

### Output
- `copy-guide.md` with: voice profile, tone per context, CTA patterns, error message templates, empty state copy.
- Microcopy patterns ready for component generation in Phase 3.

### Next → Phase 3: GENERATING COMPONENTS
`3-generating-components/SKILL.md` — Generate UI components with Gemini Design MCP.

### References
| File | Purpose |
|------|---------|
| `references/voice-tone-sectors.md` | NNG voice profiles per sector |
| `references/microcopy-patterns.md` | CTA, form, validation, toast patterns |
| `references/empty-states-copy.md` | Empty state copy formulas |
| `references/copy-fintech.md` | Fintech-specific copy examples |
| `references/copy-ecommerce.md` | E-commerce copy examples |
| `references/copy-saas.md` | SaaS copy examples |
| `references/templates/copy-guide-template.md` | Copy guide template |
| `references/templates/cta-patterns.md` | CTA pattern templates |
| `references/templates/error-messages.md` | Error message templates |
| `references/templates/onboarding-copy.md` | Onboarding copy templates |
