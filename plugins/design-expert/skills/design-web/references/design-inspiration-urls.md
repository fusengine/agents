---
name: design-inspiration-urls
description: Complete verified URL catalog for fuse-browser browsing across the 9 KNOWN_DOMAINS (Framer, Webflow, Awwwards, Godly, Lapa Ninja, One Page Love, SaaSFrame, Best Website Gallery, Landingfolio) — taste-extraction sources (palette/typography/depth/craft), NOT structure templates. Includes divergent-discovery guidance beyond the fixed slug pool. See design-inspiration.md for what to extract vs never extract.
related: design-inspiration.md
---

## Read First

Every URL below is a **taste-extraction source** — a place to pull palette,
typography, and depth/craft technique from. None of them is a skeleton to
clone. The lists are grouped by sector as a starting index, not a
prescriptive "use this slug for this sector" lookup — cross-sector browsing
is encouraged specifically to avoid convergence (pulling craft technique from
an agency site for a fintech project is fine; cloning that agency site's
section flow is not, regardless of sector match). Structure comes from
`design-method/references/register/brand.md` (or `product.md`) +
`design-method/references/macrostructure-bank.md` — never from this file.

## Phase-1 Anchor — 9 KNOWN_DOMAINS (harness-required; browse at least 2 per session)

1. `{slug}-wbs.framer.website` (Webestica Framer)
2. `{slug}.webflow.io` (Webflow)
3. `awwwards.com/sites/{name}` (Awwwards)
4. `godly.website`
5. `lapa.ninja`
6. `onepagelove.com`
7. `saasframe.io`
8. `bestwebsite.gallery`
9. `landingfolio.com`

## Webestica Framer — `https://{slug}-wbs.framer.website`

All 25 verified live. The `-wbs` suffix is MANDATORY.

SaaS: `boxsi`, `botflow`, `maximux`, `ailex`, `draftr`, `cloudkit`, `worklane`
Agency: `agnos`, `bold-studio`, `ignitex`, `crevo`, `voxo`, `agenza`, `three-circles`
Portfolio: `aiden`, `showoff`, `hazel-bennet`, `myspark`, `jaxon-cruz`, `okeystudio`
B2B: `b2bizz`, `clavion`, `altrion`, `consultantt`
Fintech: `financer` | Healthcare: `dermato`, `nursing-care`, `senior-care`
E-commerce: `villabliss`, `slice-town`, `mivora`

## Webflow — `https://{slug}.webflow.io`

### SaaS / AI
`startify-template`, `setrex-saas-template`, `saa-ai`, `flowbit`, `ai-saas-company-website`
BRIX: `neuralflowtemplate`, `agentflowtemplate`, `launchhubtemplate`, `builderflowtemplate`

### Agency / Creative
`agency-portfolio-template`, `digitaltemplate`, `altero-template`, `fylla-template`
`besnik-marketing`, `kreatryx`, `aesthetica-template`
BRIX: `cinemaflowtemplate`, `gradientprotemplate`, `colorflowtemplate`

### Portfolio
`vox-studio-ttm`, `bungee-pro`, `stuxen`, `minimaltemplate-v1`
`personal-portfolio-design-template`, `agency-portfolioo`, `awakeagency`

### B2B / Law / Consulting
`lawfarm-webflow-template`, `loi-wcopilot`, `mediate-template`
`attorneyster-law-firm-website-template`, `brandt-law-firm-business-template`
`jurri-template`, `kodex-template`, `on-consult-template`, `pipely`

### Fintech / Finance
`finflow-template`, `finlab-saas`, `payora-template`, `payvio-template`
BRIX: `financetemplate-showcase`, `fintechtemplate-showcase`, `investflowtemplate`
`defichaintemplate`, `cardpaytemplate`, `creditcoretemplate`

### Healthcare / Medical
`lunira`, `mediflow-template`, `reliacare`, `healthcare-institution-128`
`sanaris-healthcare-medtech`, `heltro`

### E-commerce
`ecommerce-tnc`, `fabrid`, `skategods-template`, `padelthon`
`spacekit-template`, `forerunner-template`
BRIX: `consumertemplate`, `matchatemplate`, `cartflowtemplates`, `decortemplates`

## Awwwards — `https://awwwards.com/sites/{name}`

Browse filtered galleries, then follow "Visit Website" to real production URLs:
- `awwwards.com/websites/` → all award-winning sites
- `awwwards.com/websites/law/` → law firms
- `awwwards.com/websites/finance/` → fintech
- `awwwards.com/websites/health/` → healthcare
- `awwwards.com/websites/e-commerce/` → e-commerce

Example: `awwwards.com/sites/voidzero` → links to the real site

## Best Website Gallery — `https://bestwebsite.gallery`

Browse the curated gallery (filter by category where available) → open the
real production sites linked from each entry. Taste-extraction only, same
rule as every other source in this file.

## Landingfolio — `https://landingfolio.com`

Browse filtered by sector/category → open real production landing pages.
Taste-extraction only.

## Beyond the Fixed Pool — Divergent Discovery

The slug lists above are a fallback index (verified live at last check), not
a ceiling. Every generated page pulling from the same ~100 templates is the
root cause of the generic-body problem this file used to encode. Once
phase-1 is satisfied (2+ of the 9 KNOWN_DOMAINS browsed), prefer branching
out:

- Use `mcp__fuse-browser__browser_serp_batch` to search for **real
  production sites** in the project's actual sector/vertical (not
  marketing-template galleries) — e.g. "{sector} company site design 2026"
  — and browse 1-2 of those as additional taste donors.
- Awwwards, Godly, Best Website Gallery, and Landingfolio already link out
  to real production sites (not templates) via "Visit Website" — prefer
  following those links over the raw Framer/Webflow slugs when time allows;
  real production sites carry more idiosyncratic craft detail than
  marketing templates built to be interchangeable.
- Cite whichever sources were actually used in the `design-system.md`
  "Design Reference" block (see `design-inspiration.md`).

## Other Platforms

Astro demos: `astro.build/themes` → each theme has a "Live Demo" link
Squarespace: `squarespace.com/templates/{slug}-fluid-demo`
