---
name: bolder
description: "Amplify a body that reads as safe/generic — commit harder to what's already declared (palette, signature element, type pair). Never adds new elements."
when-to-use: "critique.md's persona pass (or the design-method Step 3 Pass-2 self-check) flagged the body as generic/timid/safe-default."
keywords: bolder, amplify, commitment, signature-dominance
priority: high
related: critique.md, quieter.md, distill.md, audit.md, ../SKILL.md
---

# Bolder — Amplify, Don't Add

### When to use
- The body reads as safe/generic/timid — `critique.md`'s persona pass flagged "same as 500 others," or the Pass-2 self-check in `design-method/SKILL.md` Step 3 called the plan generic.
- Never use to fix a technical failure (that's `audit.md` + a fix) and never to add net-new elements — bolder amplifies what's already declared, it doesn't expand scope. If 3 colors are declared, commit harder to those 3; never reach for a 4th.

### Steps
1. Re-read the Step 2 signature element and the declared palette/type pair (`design-method/SKILL.md`) — bolder's only job is pushing what's ALREADY committed further.
2. Amplify commitment, not surface area: increase the confidence/coverage of the existing palette (larger color blocks, higher chroma within the declared OKLCH palette, fewer neutral/gray relief zones) — never add a color to "balance" it out.
3. Push the Signature Dominance floor (`design-method/SKILL.md` Step 2, `brand` register only) — the signature element must win by area or contrast. If it's currently tied or losing, scale it up or increase its contrast; don't add a second competing element to compensate.
4. Increase scale contrast between the largest and smallest sizes already in the declared type pair (`design-system/references/typography-pairs.md`) rather than introducing a new weight or family.
5. Re-run the Subtraction Test (`design-method/SKILL.md` Step 3) — if the design still reads as distinctive with the amplified element removed, that element wasn't the signature; go amplify the true signature instead.
6. Hand off to `audit.md` — amplifying color/scale can push contrast or dark-elevation past thresholds; re-verify, never assume amplification stayed compliant.

#### Report template

```markdown
## Bolder — [target]

**Register:** brand / product
**Elements amplified (no new elements added):** [list]

| Axis | Before | After | Still within audit floors? |
|------|--------|-------|------------------------------|
| Palette commitment | ... | ... | contrast/oklch: PASS/FAIL |
| Signature dominance | ... | ... | area/contrast: PASS/FAIL |
| Type-scale contrast | ... | ... | type-scale floor: PASS/FAIL |

Subtraction Test result: distinctive / not distinctive without the amplified element
```
