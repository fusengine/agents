---
name: premium-patterns
description: "10 visual-surface layout devices extracted from real Framer/Webflow award-winning sites — illustrative craft techniques, NOT a sector→pattern lookup and NOT a substitute for macrostructure or body substance. Each pattern includes CSS specs, screenshot reference, and a copy-pasteable AI generation prompt."
when-to-use: "Generating a marketing/landing page (design-web full or page mode) and wanting a proven visual-surface technique to apply WITHIN an already-chosen macrostructure — never as the source of that macrostructure."
keywords: patterns, premium, layout, generation, prompt, substance-floor
priority: high
related: ../layout-discipline.md, ../ui-visual-design.md, ../../design-method/references/macrostructure-bank.md, ../../design-method/references/register/brand.md
---

## Premium Design Patterns — Surface Devices, Not Structure

These are **visual-surface techniques** — a numbering treatment, a hover
reveal, a grid layout for one section — decoration and craft applied INSIDE a
section, after the page's macrostructure
(`design-method/references/macrostructure-bank.md`) and register
(`register/brand.md` / `register/product.md`) have already been decided.
Read this during component generation, once the skeleton and POV are already
locked — never as a way to choose either. Applying the "expected" pattern for
a sector by default is convergence, not craft: it is the same failure mode as
reproducing a browsed template's structure (`design-web/references/design-inspiration.md`),
one level down, inside a single section instead of the whole page.

### How to use
1. Confirm the macrostructure and register are already decided (Pass 1, `design-method/SKILL.md`) — this file supplies neither.
2. Browse the "Illustrative Examples" table below for inspiration, not lookup — patterns are cross-sector techniques, not sector defaults.
3. Read 2-3 matching `description.md` files (paths: `premium-patterns/{folder}/description.md`).
4. Before using any prompt, run the section against the Body Substance Floor below — a pattern wrapped around generic copy still fails.
5. Combine prompts from 2-3 patterns if it serves the POV — optional richness, never a checklist to fill mechanically.
6. NEVER skip the Body Substance Floor — flat AND generic-but-decorated designs are both FORBIDDEN.

### Pattern Index (technique catalogue — apply where the POV calls for it)

| # | Pattern | Historically seen in | Path | Key Feature |
|---|---------|--------|------|-------------|
| 01 | Numbered Services | Agency | `01-numbered-services/description.md` | [01] numbering + image reveal hover |
| 02 | Alternating Sections | SaaS | `02-alternating-sections/description.md` | Dark/light section rhythm + BG patterns |
| 03 | Hero Badge Inline | Agency | `03-hero-badge-inline/description.md` | Massive H1 + urgency badge + icon in text |
| 04 | Bento Grid | SaaS B2B | `04-bento-grid/description.md` | Asymmetric grid, mixed content sizes |
| 05 | Full-Bleed Hero | Luxury | `05-fullbleed-hero/description.md` | 90vh image cover + watermark logo |
| 06 | Gradient Steps | Fintech | `06-gradient-steps/description.md` | Numbered "01" steps + gradient orb |
| 07 | CTA Giant Typography | Agency | `07-cta-giant-typography/description.md` | 8rem+ text + images embedded in words |
| 08 | Radical Alternation | Agency | `08-radical-alternation/description.md` | 100% black/white sections + script font |
| 09 | Tabs Image Swap | Eco/B2B | `09-tabs-image-swap/description.md` | Tab navigation swaps image + description |
| 10 | Accordion Carousel | B2B | `10-accordion-carousel/description.md` | Expandable services + horizontal case studies |

### Illustrative Examples (NOT a sector lookup — cross-pollinate deliberately)

The "Historically common" column shows what has been reached for by default
in each sector — that is precisely the convergence risk, not a
recommendation. Treat it as a first-draft reference at most; picking from
the "Consider instead" column, or a pattern outside both, is often the
better choice specifically because it isn't the sector default. State the
choice against the POV, same discipline as `macrostructure-bank.md`'s
"deliberate exception, not a default reached by omission":

| Sector | Historically common | Consider instead |
|--------|---------------------|-------------------|
| SaaS | 02, 04, 06 | 01, 07 (bold typography breaks SaaS sameness) |
| Agency/Creative | 01, 07, 08 | 04, 09 (structured grid breaks agency chaos-default) |
| Fintech | 04, 06, 09 | 05, 08 (dramatic contrast breaks fintech blue-sameness) |
| Healthcare | 02, 05, 09 | 01, 10 (numbered/expandable breaks healthcare-calm sameness) |
| E-commerce | 03, 04, 10 | 07, 08 |
| Luxury | 05, 07, 08 | 09, 10 |
| B2B | 01, 09, 10 | 04, 06 |

### Body Substance Floor (surface ≠ substance)

A page that stacks 2-3 of these visual devices but says nothing
product/brand-specific has decorated the slop, not solved it. Before shipping
any pattern, the section using it must pass:

- **The Competitor Lift Test** (`design-method/references/register/brand.md`
  §3) — could this section's copy and claim run unchanged on a competitor's
  site wearing the same pattern? If yes, the pattern is polishing filler, not
  substance.
- **A real, sourced claim** — the pattern's headline/number/step must carry
  an actual fact from the brief (a real metric, a real process step, a real
  product name), never an invented placeholder dressed up in a nice grid.
- **Domain-Specificity** (`design-method/references/register/product.md` §2,
  when register is `product`) — same test, product-register phrasing: would
  this surface look native dropped unedited into an unrelated product?

A pattern with a beautiful hover reveal and a generic "Fast. Reliable.
Scalable." headline underneath still fails.

### FORBIDDEN Flat Patterns
- Same white background on all sections (use alternation)
- H1 under 3rem (use clamp 4-10rem)
- No shadows on cards (use 3-level shadow system)
- Static service lists (use numbered, accordion, or tab patterns)
- Generic CTA at bottom (use giant typography or full-bleed)
- Any pattern combo applied to generic/unsourced copy (see Body Substance Floor)
