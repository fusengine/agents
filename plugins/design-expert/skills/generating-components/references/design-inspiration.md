---
name: design-inspiration
description: Curated design sites catalog with Playwright browsing workflow for visual research
related: 21st-dev.md, gemini-feedback-loop.md
---

## When to Browse

Browse real sites when:
- Full redesign or visual refresh requested
- New project with no existing `design-system.md`
- User says "inspiration", "repenser", "new look", "fresh design"

Skip browsing for: minor component additions to an existing design system.

## Tier 1 Sites — Direct Playwright Access (no auth)

| Site | URL | Specialty |
|---|---|---|
| webestica Framer | `https://{slug}-wbs.framer.website` | SaaS, agency, portfolio, fintech, healthcare |
| Godly | `https://godly.website` | Creative, experimental, cutting-edge |
| Landbook | `https://land-book.com` | Landing pages, daily curated |
| Awwwards | `https://awwwards.com/websites/` | Award-winning, innovation |

## webestica Template Catalog

URL formula: `https://{slug}-wbs.framer.website`

| Category | Slug Examples |
|---|---|
| SaaS / AI | `boxsi`, `botflow`, `maximux`, `ailex`, `draftr`, `cloudkit` |
| Agency / Creative | `agnos`, `bold-studio`, `ignitex`, `crevo`, `voxo`, `agenza` |
| Portfolio | `aiden`, `showoff`, `hazel-bennet`, `myspark` |
| Consulting / B2B | `b2b-consulting`, `clavion`, `altrion` |
| Finance | `financer` |
| Healthcare | `dermato`, `nursing-care`, `senior-care` |
| E-commerce | `villa-bliss`, `slice-town` |

## Playwright Browsing Workflow

```
Step 1: Navigate
  mcp__playwright__browser_navigate → target URL

Step 2: Full-Page Screenshot (CRITICAL — not just viewport)
  mcp__playwright__browser_take_screenshot with fullPage: true → captures ENTIRE scrollable page

Step 3: Analyze screenshot — extract:
  - Color palette (dominant, accent, neutral tones)
  - Typography pairs (heading weight/size vs body)
  - Section structure (hero → features → social proof → CTA → footer)
  - Spacing rhythm (tight/dense vs airy/spacious)
  - Visual techniques (glass, gradients, illustrations, photos)
  - Animation style (subtle micro vs bold scroll)

Step 4: Feed insights into Gemini Design XML prompt
  <style_reference>
    Inspired by {site}: {specific observations}
    Color approach: {extracted palette description}
    Typography feel: {heading/body contrast}
    Layout rhythm: {spacing observations}
  </style_reference>
```

## Tool Complement Matrix

| Tool | Level | Use For |
|---|---|---|
| 21st.dev (`mcp__magic__21st_magic_component_inspiration`) | Component | Buttons, cards, navbars |
| Playwright browsing | Page | Full layouts, visual identity, section flow |
| Gemini Design | Generation | Create from combined insights |
| shadcn registry | Implementation | Correct component installation |

## What NOT to Do

- NEVER copy a design verbatim — extract principles, not pixels
- NEVER browse more than 3 sites per request (diminishing returns)
- NEVER skip the analysis step — screenshots without analysis = wasted tokens
- ALWAYS feed extracted insights into the Gemini XML prompt `<style_reference>` block
