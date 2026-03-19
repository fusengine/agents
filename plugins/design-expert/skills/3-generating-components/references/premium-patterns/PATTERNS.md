---
name: premium-patterns
description: "10 premium design patterns extracted from real Framer/Webflow award-winning sites. Each pattern includes CSS specs, screenshot reference, and a copy-pasteable Gemini context prompt."
---

## Premium Design Patterns

MANDATORY reading in Phase 3 (GENERATE). Pick 2-3 patterns that match your project sector and include their Gemini Context Prompt in the `context` parameter of create_frontend.

### How to use
1. Find your sector in the "Sector → Recommended Patterns" table below
2. Read 2-3 matching `description.md` files (paths: `premium-patterns/{folder}/description.md`)
3. Copy the "Gemini Context Prompt" section from each into your `create_frontend` context parameter
4. Combine prompts from 2-3 patterns — this creates visual richness and depth
5. NEVER skip this step — flat designs are FORBIDDEN

### Pattern Index

| # | Pattern | Sector | Path | Key Feature |
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

### Sector → Recommended Patterns

| Sector | Best Patterns | Why |
|--------|--------------|-----|
| SaaS | 02, 04, 06 | Clean alternation, structured grid, clear steps |
| Agency/Creative | 01, 07, 08 | Bold typography, service showcase, dramatic contrast |
| Fintech | 04, 06, 09 | Data-rich grids, numbered process, tab navigation |
| Healthcare | 02, 05, 09 | Calm alternation, trust imagery, organized services |
| E-commerce | 03, 04, 10 | Urgency badges, product grids, expandable details |
| Luxury | 05, 07, 08 | Full-bleed imagery, dramatic type, high contrast |
| B2B | 01, 09, 10 | Structured services, tab navigation, case studies |

### FORBIDDEN Flat Patterns
- Same white background on all sections (use alternation)
- H1 under 3rem (use clamp 4-10rem)
- No shadows on cards (use 3-level shadow system)
- Static service lists (use numbered, accordion, or tab patterns)
- Generic CTA at bottom (use giant typography or full-bleed)
