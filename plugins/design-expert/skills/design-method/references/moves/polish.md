---
name: polish
description: "Final finishing pass — hard precondition (only polish functionally complete work), placeholder/TODO/Lorem sweep, last consistency check before shipping."
when-to-use: "Last move before shipping/reporting a body done — after harden.md, after audit.md's Critical/Major findings are resolved."
keywords: polish, finishing, placeholder, precondition, shipping
priority: high
related: audit.md, harden.md, ../../design-review/references/consistency-checks.md
---

# Polish — Final Finishing Pass

### When to use
- Last move before shipping or reporting a body done — after `harden.md`, and after `audit.md`'s Critical/Major findings are resolved.
- **Precondition (hard gate):** the target must be functionally complete. If any feature is stubbed, a flow is unfinished, or `harden.md` hasn't run yet, polish is the wrong move — finish/harden first. Polishing incomplete work produces a shiny broken surface, not a shippable one.

### Steps
1. Verify the precondition explicitly — walk the primary flow end to end; if anything is non-functional, STOP and hand back to the domain expert before polishing.
2. **Placeholder sweep** — grep for `TODO`, `FIXME`, `Lorem ipsum`, `lorem`, placeholder image paths (`placeholder.png`, `picsum.photos`, `via.placeholder`), and obviously fake copy (`Company Name`, `John Doe`, `example@example.com`) — every hit is a blocker, not a nice-to-have.
3. **Final consistency pass** — re-run `design-review/references/consistency-checks.md` (cross-component border-radius, shadow, spacing rhythm) for the last-mile inconsistencies that survive individual component work.
4. Confirm `audit.md` and `harden.md` both ran and their Critical/Major findings are resolved — polish doesn't re-run those checks, it verifies they already passed.
5. One last screenshot pass (light + dark, per `design-review/references/review-procedure.md` Part 2 capture procedure) as the shipping record.

#### Report template

```markdown
## Polish — [target]

**Precondition check:** functionally complete — YES/NO (if NO, stop here and report why)

| Check | Status | Details |
|-------|--------|---------|
| Placeholder/TODO/Lorem sweep | PASS/FAIL | ... |
| Consistency pass | PASS/FAIL | ... |
| Audit resolved | PASS/FAIL | ... |
| Harden resolved | PASS/FAIL | ... |

Shipping screenshots: [light/dark links or paths]
```
