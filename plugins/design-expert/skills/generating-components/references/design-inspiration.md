---
name: design-inspiration
description: 75+ verified URLs (Framer/Webflow/Awwwards) by sector. Playwright workflow (scroll+wait+fullPage). Browse 4 sites, PICK 1 best match, reproduce its quality. MANDATORY before any code generation.
related: 21st-dev.md, gemini-feedback-loop.md, design-inspiration-urls.md
---

## Rules (CRITICAL)

1. **4 sources minimum** — browse 4 different sites before generating, from at least 2 platforms
2. **PICK 1 best site** — browse 4 sites, then choose the ONE that best matches the project. Reproduce its quality level, spacing, typography, and polish. Don't mix — commit to 1 reference.
3. **Vary every time** — NEVER reuse the same 4 sites. Pick different slugs/URLs each session
4. **Persist** — if a URL fails, try the next one. Get **4 successful fullPage screenshots** minimum
4. **Never give up** — try at least 6 URLs before falling back to a different platform

## Platforms (all public, no auth, Playwright-ready)

| Platform | URL Pattern | Best For |
|---|---|---|
| Webestica Framer | `https://{slug}-wbs.framer.website` | All sectors — 25 verified templates |
| Webflow | `https://{slug}.webflow.io` | All sectors — 50+ verified templates |
| Awwwards | `https://awwwards.com/sites/{name}` | Award-winning real production sites |
| Godly | `https://godly.website` | Creative, experimental, cutting-edge |
| Lapa Ninja | `https://lapa.ninja` | 7300+ landing pages with sector filters |
| One Page Love | `https://onepagelove.com` | Single-page sites, all sectors |
| SaaSFrame | `https://saasframe.io` | SaaS UI patterns (pricing, onboarding) |

## Sector → 4 Sources (pick from each column, vary every time)

| Sector | Framer (`-wbs`) | Webflow (`.webflow.io`) | Gallery |
|---|---|---|---|
| SaaS | `boxsi`, `draftr`, `cloudkit`, `worklane` | `startify-template`, `setrex-saas-template`, `flowbit` | SaaSFrame, Lapa `/saas` |
| Agency | `crevo`, `voxo`, `agenza`, `three-circles` | `agency-portfolio-template`, `altero-template`, `fylla-template` | Godly, Awwwards |
| Portfolio | `aiden`, `showoff`, `myspark`, `jaxon-cruz` | `bungee-pro`, `stuxen`, `minimaltemplate-v1` | One Page Love, Godly |
| B2B / Law | `b2bizz`, `clavion`, `altrion`, `consultantt` | `lawfarm-webflow-template`, `jurri-template`, `kodex-template` | Awwwards `/sites/*` |
| Fintech | `financer` | `finflow-template`, `payora-template`, `payvio-template` | Lapa `/finance` |
| Healthcare | `dermato`, `nursing-care`, `senior-care` | `lunira`, `reliacare`, `heltro` | Landingfolio |
| E-commerce | `villabliss`, `slice-town`, `mivora` | `fabrid`, `skategods-template`, `forerunner-template` | Lapa `/ecommerce` |

→ Full URL list: see `design-inspiration-urls.md`

## Playwright Workflow

```
Step 1: mcp__playwright__browser_navigate → target URL
Step 2: Scroll to bottom — mcp__playwright__browser_evaluate:
        window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})
Step 3: mcp__playwright__browser_wait_for → wait 5 seconds (lazy elements load)
Step 4: Scroll back to top — mcp__playwright__browser_evaluate:
        window.scrollTo({top: 0, behavior: 'smooth'})
Step 5: mcp__playwright__browser_wait_for → wait 2 seconds
Step 6: mcp__playwright__browser_take_screenshot with fullPage: true
Step 8: Analyze — extract: palette, typography, section flow, spacing, visual techniques, separators
Step 9: Repeat steps 1-8 for 3 more sites (4 total)
Step 10: Feed ALL insights into Gemini XML <style_reference> block
```

## Chosen Reference (MANDATORY — write in design-system.md BEFORE coding)

After browsing 4 sites, write this in design-system.md:

```
## Design Reference

Inspired by: {chosen site URL}
Why chosen: {what makes it the best match for this project}

Reproducing from this site:
- Color approach: {describe their palette}
- Typography: {their font choices and sizing}
- Layout rhythm: {their section spacing and grid}
- Visual effects: {their shadows, gradients, glass, animations}
- Section structure: {their page flow}

Adapting for this project:
- Brand name and content: {project-specific}
- Color accent: {project-specific accent color}
```

This feeds into the Gemini XML `<style_reference>` block.
NEVER call Gemini without choosing a reference site first.

## Awwwards Deep Browsing

Awwwards individual sites at `https://awwwards.com/sites/{name}` link to real production URLs.
1. Navigate to `awwwards.com/websites/` filtered by sector
2. Screenshot the gallery → identify interesting sites
3. Navigate to `awwwards.com/sites/{name}` → find the "Visit Website" link
4. Navigate to the real production URL → fullPage screenshot

## What NOT to Do

- NEVER use fewer than 4 sources — 3 is not enough
- NEVER reuse the same sites as last time — VARY
- NEVER give up after 1-2 failures — try 6 URLs before falling back
- NEVER skip analysis — screenshots without analysis = wasted tokens
- ALWAYS use `fullPage: true` — viewport-only misses 80% of the design
