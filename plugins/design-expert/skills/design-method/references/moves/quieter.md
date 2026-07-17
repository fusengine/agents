---
name: quieter
description: "Dial back an overstimulating body across 4 fixed axes — color intensity, motion, density, typographic loudness — while keeping the signature element the loudest voice."
when-to-use: "The body reads as loud/overstimulating (too many simultaneous focal points, motion everywhere, dense sections), flagged by critique.md's persona pass or the owner directly."
keywords: quieter, intensity, density, motion, restraint
priority: high
related: critique.md, bolder.md, distill.md, ../SKILL.md
---

# Quieter — Reduce Intensity on 4 Axes

### When to use
- The body reads as overstimulating/loud — too many simultaneous focal points, motion everywhere, dense sections — flagged by `critique.md`'s persona pass or the owner directly.
- Register `product` defaults toward quiet by design (`design-method/SKILL.md` Gate 0 — motion stays discreet); use this move to bring an overshooting `brand`-register body down, or to correct a `product` surface that drifted loud.

### Steps
Dial back exactly these 4 axes, one at a time, verifying after each that the signature element still reads as the loudest thing on the register-appropriate floor:

1. **Color intensity** — reduce chroma/saturation on secondary and tertiary elements first, never the signature; widen neutral relief zones (design-system 60-30-10 ratio, `design-review/references/audit-checklist.md` Colors section) before touching the primary accent.
2. **Motion** — cut simultaneous animated elements per viewport; keep only entrance/state-change motion the interaction actually needs, drop decorative loops; re-check `design-motion/references/motion-performance.md` and confirm `prefers-reduced-motion` still holds.
3. **Density** — increase whitespace/section spacing per `design-system/references/spacing-density.md`; reduce element count per section toward the layout-discipline hero/bento caps (`design-web/references/layout-discipline.md`) rather than shrinking everything uniformly.
4. **Typographic loudness** — reduce weight/size contrast and uppercase-tracking label usage (eyebrow restraint, `layout-discipline.md` rule 2) on non-signature headings; keep the signature element's typographic treatment as the one loud voice left standing.
5. Re-run Signature Dominance (`design-method/SKILL.md` Step 2, `brand` register only) after all 4 axes — quieting everything else should make the signature MORE dominant by contrast, not less; if it got weaker too, step 4 over-corrected.

#### Report template

```markdown
## Quieter — [target]

**Register:** brand / product

| Axis | Before | After | Signature still dominant? |
|------|--------|-------|------------------------------|
| Color intensity | ... | ... | ... |
| Motion | ... | ... | ... |
| Density | ... | ... | ... |
| Typographic loudness | ... | ... | ... |

Signature Dominance re-check: PASS/FAIL (brand register only)
```
