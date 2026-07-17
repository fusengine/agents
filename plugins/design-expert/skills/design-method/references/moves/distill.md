---
name: distill
description: "Strip an overloaded body to its single job — classify every element against a 6-item complexity taxonomy, remove what doesn't serve that job."
when-to-use: "The body reads as overloaded/cluttered with unclear priority, flagged by critique.md, or when bolder/quieter alone can't fix it because the problem is scope, not intensity."
keywords: distill, complexity, taxonomy, removal, single-job
priority: high
related: critique.md, bolder.md, quieter.md, ../SKILL.md
---

# Distill — Strip to the Single Job

### When to use
- The body reads as overloaded/cluttered — too many competing elements, unclear priority — flagged by `critique.md`, or when `bolder`/`quieter` alone can't fix it because the problem is scope, not intensity.
- Ask first: **what is the single job of this interface?** If that can't be answered in one sentence, distill can't proceed — go get that answer before removing anything (same discipline as `design-method/SKILL.md` Step 2's "if you can't name it in one sentence, the brief isn't sharp enough yet").

### Steps
1. Name the single job of the interface in one sentence.
2. Classify every element against the 6-item complexity taxonomy; anything that doesn't serve the single job is a removal candidate:
   1. **Redundant messaging** — the same point stated twice (headline + subhead + bullet repeating one idea).
   2. **Default-visible edge cases** — rare/optional paths shown by default instead of behind progressive disclosure.
   3. **Decorative-only elements** — no functional or narrative job, present only to fill space.
   4. **Competing CTAs** — more than one primary action per view competing for the same decision.
   5. **Flattened hierarchy** — everything rendered at the same visual weight, forcing the reader to triage manually.
   6. **Verbose copy** — explaining what's already self-evident from the UI itself (delegate the copy-specific pass to `ux-copy` rather than rewriting prose here).
3. Remove, don't relabel — collapsing two redundant elements into one is still distillation; hiding one behind a toggle without deciding whether it's needed at all is not.
4. After removal, re-run the Subtraction Test (`design-method/SKILL.md` Step 3) on the signature element specifically — distillation must never remove the signature; if it did, that's a regression, not progress.
5. Re-run `layout-discipline.md`'s N=N rules (bento cell count, no-empty-column) — removing elements can break a grid's cell-count parity; re-shape the grid, don't leave an orphaned cell.

#### Report template

```markdown
## Distill — [target]

**Single job of the interface:** [one sentence]

| Taxonomy item | Instances found | Removed / kept (why) |
|----------------|------------------|------------------------|
| Redundant messaging | ... | ... |
| Default-visible edge cases | ... | ... |
| Decorative-only elements | ... | ... |
| Competing CTAs | ... | ... |
| Flattened hierarchy | ... | ... |
| Verbose copy | ... | ... |

Signature element still present after removal: YES/NO
Layout-discipline N=N re-check: PASS/FAIL
```
