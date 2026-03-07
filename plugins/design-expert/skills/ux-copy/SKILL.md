---
name: ux-copy
description: Use when generating UI text, microcopy, CTA labels, error messages, empty states, or establishing voice & tone. Produces project-specific copy guide aligned with identity-system sector.
versions:
  design-expert: "2.0"
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep
references: references/microcopy-patterns.md, references/voice-tone-sectors.md, references/empty-states-copy.md, references/templates/copy-guide-template.md
related-skills: identity-system, page-layouts, generating-components
---

# UX Copy

## Agent Workflow (MANDATORY)

Before ANY copy work, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing copy patterns and UI strings
2. **fuse-ai-pilot:research-expert** - Verify sector-specific tone standards and CTA conversion data
3. **design-expert:identity-system** - Ensure design-system.md brand identity is defined

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Reference | Content |
|-----------|---------|
| [microcopy-patterns.md](references/microcopy-patterns.md) | CTA patterns, conversion words, form labels, validation, toasts |
| [voice-tone-sectors.md](references/voice-tone-sectors.md) | NNG 4-dimension voice profiles per sector with do/don't examples |
| [empty-states-copy.md](references/empty-states-copy.md) | First-time / no-results / error-recovery copy formulas |
| [copy-guide-template.md](references/templates/copy-guide-template.md) | Project copy guide template — fill per project |

---

## Workflow

1. **Detect sector** from `design-system.md` identity block
2. **Load voice profile** from `voice-tone-sectors.md` matching sector
3. **Generate copy** per component type using `microcopy-patterns.md`
4. **Produce `copy-guide.md`** using `copy-guide-template.md` for the project

---

## Critical Rules

1. **Match brand identity first** — copy must align with `design-system.md` personality
2. **Sector tone varies** — fintech is formal, creative is expressive, education is encouraging
3. **Action verbs mandatory** — never generic ("OK", "Submit") — always specific ("Create project", "Save settings")
4. **Button copy max 3 words** — if longer, reconsider the UX
5. **Accessibility required** — ARIA labels, descriptive error messages, no jargon

---

## Validation Checklist

- [ ] Copy aligns with design-system.md brand voice
- [ ] Sector tone is consistent throughout
- [ ] Action verbs used (no generic "OK", "Submit")
- [ ] Button copy max 3 words
- [ ] Descriptions max 2 lines (40 chars per line)
- [ ] ARIA labels provided for interactive elements
- [ ] Error messages are specific, not generic
- [ ] All UI strings are 100% English

---

## Cross-References

- `identity-system` — sector detection and brand voice personality
- `page-layouts/references/patterns/empty-state.md` — UI specs for empty states (this skill = text only)
- `generating-components` — component generation using copy produced here
