---
name: harden
description: "Resilience pass — text/data extremes, 4xx/5xx/offline error states, i18n expansion (+30% German-class), touch targets. Anti-bug, secondary to the taste moves."
when-to-use: "Before shipping any body that will receive real user data or run in production. Always run once per surface before polish.md — polish assumes hardening already happened."
keywords: harden, resilience, extremes, i18n, error-states, touch-targets
priority: high
related: audit.md, polish.md, ../../design-review/references/ux-wcag.md
---

# Harden — Resilience Pass

### When to use
- Before shipping any body that will receive real user data or run in production — an anti-bug pass, secondary to `critique`/`bolder`/`quieter`/`distill`.
- Always run once per surface before `polish.md`; `polish` assumes hardening already happened and doesn't re-run these checks.

### Steps
1. **Text-length extremes** — re-render every dynamic text field/label at 1, 20, 60, and 200 characters (names, titles, list items); flag truncation without ellipsis/wrap handling, layout breakage, or overflow past a fixed container.
2. **Data extremes** — empty state (0 items), single item, and a large/pagination-triggering count; each needs a defined presentation, not just the happy-path middle case.
3. **Error states** — 4xx (validation/not-found/forbidden) and 5xx (server error) each need a distinct, on-brand state — never a raw browser error or blank screen; verify against `design-system/references/edge-cases.md` if it covers error states, otherwise document the gap.
4. **Offline** — verify a no-network state is handled (cached content, explicit offline message, or graceful degradation), not a silently infinite spinner.
5. **i18n expansion** — re-render key strings (labels, buttons, headings) at +30% length (German-class expansion); flag any fixed-width container that clips or wraps unacceptably.
6. **Touch targets** — every interactive element ≥ 44×44px (WCAG 2.5.5), per `design-review/references/ux-wcag.md` — canonical there, not restated here.

#### Report template

```markdown
## Harden — [target]

| Check | Extreme tested | Result | Fix needed? |
|-------|------------------|--------|--------------|
| Text length | 1 / 20 / 60 / 200 char | ... | ... |
| Data volume | 0 / 1 / N (pagination) | ... | ... |
| Errors | 4xx / 5xx | ... | ... |
| Offline | no-network | ... | ... |
| i18n expansion | +30% (German-class) | ... | ... |
| Touch targets | ≥44×44px | ... | ... |
```
