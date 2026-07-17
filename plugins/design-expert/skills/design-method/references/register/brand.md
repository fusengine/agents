---
name: register-brand
description: "Direction for register `brand` (marketing site, launch page, identity) — the POV that ties the WHOLE page, not just the hero; the 'body ≠ SaaS furniture' anti-pattern list; the per-section Competitor Lift Test; expected density/motion/expressiveness."
when-to-use: "Gate 0 declares register `brand` — read this before Pass 1 of the two-pass process, and again at design-review Part 2 to judge whether the body (not just the hero) carries the direction."
keywords: register, brand, pov, body, saas-furniture, competitor-lift-test, expressiveness
priority: critical
related: ../SKILL.md, product.md, copy.md, ../macrostructure-bank.md, ../../design-web/references/layout-discipline.md
---

# Register: Brand — Direction, Not Process

Gate 0 (`design-method/SKILL.md`) makes you pick `brand` when the deliverable is a
marketing site, launch page, or identity piece: one dominant, expressive message. This
file is what that pick actually demands. The proven failure mode is not the hero — forcing
references and a named signature element already fixes the hero surface. The failure mode
is the **body**: section after section of generic, interchangeable, institutional copy and
layout that could belong to any competitor. This file exists to close that gap.

## 1. The POV That Ties the Whole Page

Before Pass 1, write ONE sentence: the point of view this entire page argues for — not a
tagline, an actual **claim** ("fast" is not a POV; "manual QA doesn't scale past 10
engineers, so we removed the human from the loop" is). Every section from here on must
trace back to that sentence. If a section doesn't advance, complicate, prove, or pay off
that claim, it doesn't belong on the page in that form.

- This is stronger than the Step 2 Signature Element (a visual/structural device) — the
  POV is the *argument*, the signature element is often its most visible expression, but
  the POV also governs sections that carry no signature device at all (a features list, an
  FAQ, a footer CTA still owe the page's claim, not a category-default treatment).
- Write the POV down. A POV held only "in your head" is not a POV — same discipline as
  Gate 0's four artefacts: present/absent, not a feeling.

## 2. Body ≠ SaaS Furniture

These five section-types are the default reach for any generic brief and, used unchanged,
read as templated regardless of how sharp the hero is. Each is **allowed only if
justified against the POV**, or **replaced**:

| Furniture | Default (generic) form | Justify when… | Replace with… |
|---|---|---|---|
| **Ribbon 4-stats** | 4 equal-weight number+label cards in a row, no narrative | the numbers ARE the argument (e.g. a comparison the POV depends on) and are sourced, not invented | fold 1 real, load-bearing number into a section that already has a job (a proof point inside a narrative block), drop the rest |
| **Triade de cartes** | 3 equal-weight feature cards, icon+title+2 lines, no hierarchy | the three items are genuinely peers with no lead item — rare | one dominant item + supporting list (asymmetric), or sequence them as a narrative (this, therefore this, therefore this) |
| **FAQ accordéon** | generic Q/A list restating marketing copy as questions | real, recurring objections exist that the page hasn't already answered | fold the real objections into the body copy where they arise, or a short "reasons this might not be for you" block (more distinctive, still honest) |
| **Logo-cloud** | grayscale logo grid, "Trusted by" | logos are real, permissioned, and the audience recognizes them as credibility signal | a single strong case/quote with a name and a number, or drop it — a weak logo cloud subtracts more trust than it adds |
| **Méga-footer** | 5-6 link columns (Product/Company/Resources/Legal/Social), copied structure | the site genuinely has that much real navigable depth | a lean footer: primary nav + legal + one CTA — most marketing sites don't have 30 real destinations |

The bar is not "never use these" — it's **never use them as a default reached by
omission**. Each one used must be a decision made against the POV, stated as such in the
Pass 1 plan (same discipline as the Macrostructure Variety rule's "deliberate exception,
not a default reached by omission").

## 3. Per-Section Test: Competitor Lift Test

For **every section**, not just the hero, ask: *"if I lifted this section — copy, layout,
and all — onto a direct competitor's site unchanged, would it still read as native and
correct there?"* If yes, the section failed — it's carrying no POV, no brand-specific
claim, nothing that only this brand could have written. This is the section-level
enforcement of "liftable as-is to a competitor = failure":

- A section that only needed a logo swap to work elsewhere is furniture, not direction —
  send it back to §2 or rewrite its copy against the POV (see `copy.md`).
- Run this explicitly during Pass 2 (Critical Re-Read) for the plan, and again during
  `design-review` Part 2 for the shipped body — not only the hero.
- A section can keep a common shape (a pricing table is still a pricing table) and still
  pass — the test is about the *content and framing*, not novelty of layout for its own
  sake.

## 4. Density, Motion, Expressiveness — Brand Defaults

Brand register commits harder than product register on every dial that reads as "safe
default" when timid:

- **Density**: Editorial profile (`design-system/references/spacing-density.md`) —
  generous section gaps (48-64px+), large page margins. A cramped brand page reads
  uncommitted, not efficient.
- **Motion**: default posture is `MOTION_INTENSITY > 4` (`design-motion/references/motion-performance.md`) — the
  page should actually animate on scroll, not merely claim to. Product's discreet-motion
  standard does not apply here; restraint below 4 needs the same explicit justification as
  §2's furniture, not silent default.
- **Color/type**: Signature Dominance (Step 2) and the Focal-Block Floor
  (`design-web/references/layout-discipline.md` rule 9) already require one committed
  focal block per viewport in this register — this file's §1-§3 extend that commitment
  from "one striking block" to "every section owes the argument."

## 5. Non-Negotiable

A brand page that nails the hero and goes generic for the rest of the scroll is not done —
it has fixed ~70% of the problem and left the part users spend the most time in
untouched. §1-§3 above are the check for the other 30%.
