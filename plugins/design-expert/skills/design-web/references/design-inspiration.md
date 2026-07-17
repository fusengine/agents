---
name: design-inspiration
description: 75+ verified URLs (Framer/Webflow/Awwwards/Godly/Lapa/OnePageLove/SaaSFrame/Best Website Gallery/Landingfolio) by sector — used to extract palette/typography/depth/craft ONLY, never section structure. fuse-browser workflow (open+scroll+wait+fullPage). Browse 4 sites across ≥2 of the 9 KNOWN_DOMAINS, extract taste signals, then build structure from register + macrostructure-bank. MANDATORY before any code generation.
related: 21st-dev.md, gemini/gemini-feedback-loop.md, design-inspiration-urls.md, ../../design-method/references/macrostructure-bank.md, ../../design-method/references/register/brand.md
---

## What This Phase Is For (read before browsing)

Browsing here extracts **taste signals only**: palette, typography, visual
depth, and craft technique. It NEVER supplies the page's structure. The
body's section flow, order, and composition come from the register already
picked at Gate 0 (`design-method/references/register/brand.md` or
`product.md`) and a named macrostructure
(`design-method/references/macrostructure-bank.md`), validated per-section by
the Competitor Lift Test (`brand.md` §3). A reference site that "best matches
the project" is a taste donor, not a template — cloning its section flow,
spacing rhythm, or copy skeleton is exactly the failure mode this file exists
to prevent: generic, interchangeable marketing bodies pulled from a pool of
~100 recycled templates.

## Rules (CRITICAL)

1. **4 sources minimum** — browse 4 different sites before generating, from at least 2 of the 9 KNOWN_DOMAINS below.
2. **Extract, never reproduce** — browse 4 sites and pull palette/typography/depth/craft technique from each; mix freely across all 4. Do **NOT** pick one site to clone the quality level, spacing rhythm, or **section flow** of. Structure is decided separately — see "What This Phase Is For" above.
3. **Vary every time** — NEVER reuse the same 4 sites. Pick different slugs/URLs each session.
4. **Persist** — if a URL fails, try the next one. Get **4 successful fullPage screenshots** minimum.
5. **Never give up** — try at least 6 URLs before falling back to a different platform.
6. **Run the Lookalike Test** (below) once the page is built — not only during browsing.

## Platforms — 9 KNOWN_DOMAINS (harness phase-1 catalogue, all public, no auth, fuse-browser-ready)

| Platform | URL Pattern | Best For |
|---|---|---|
| Webestica Framer | `https://{slug}-wbs.framer.website` | All sectors — 25 verified templates |
| Webflow | `https://{slug}.webflow.io` | All sectors — 50+ verified templates |
| Awwwards | `https://awwwards.com/sites/{name}` | Award-winning real production sites |
| Godly | `https://godly.website` | Creative, experimental, cutting-edge |
| Lapa Ninja | `https://lapa.ninja` | 7300+ landing pages with sector filters |
| One Page Love | `https://onepagelove.com` | Single-page sites, all sectors |
| SaaSFrame | `https://saasframe.io` | SaaS UI patterns (pricing, onboarding) |
| Best Website Gallery | `https://bestwebsite.gallery` | Curated award-winning sites, all sectors |
| Landingfolio | `https://landingfolio.com` | Landing page inspiration, sector filters |

## Sector → 4 Sources (pick from each column, vary every time — taste donors, not skeletons)

| Sector | Framer (`-wbs`) | Webflow (`.webflow.io`) | Gallery |
|---|---|---|---|
| SaaS | `boxsi`, `draftr`, `cloudkit`, `worklane` | `startify-template`, `setrex-saas-template`, `flowbit` | SaaSFrame, Lapa `/saas` |
| Agency | `crevo`, `voxo`, `agenza`, `three-circles` | `agency-portfolio-template`, `altero-template`, `fylla-template` | Godly, Awwwards |
| Portfolio | `aiden`, `showoff`, `myspark`, `jaxon-cruz` | `bungee-pro`, `stuxen`, `minimaltemplate-v1` | One Page Love, Godly |
| B2B / Law | `b2bizz`, `clavion`, `altrion`, `consultantt` | `lawfarm-webflow-template`, `jurri-template`, `kodex-template` | Awwwards `/sites/*` |
| Fintech | `financer` | `finflow-template`, `payora-template`, `payvio-template` | Lapa `/finance` |
| Healthcare | `dermato`, `nursing-care`, `senior-care` | `lunira`, `reliacare`, `heltro` | Landingfolio |
| E-commerce | `villabliss`, `slice-town`, `mivora` | `fabrid`, `skategods-template`, `forerunner-template` | Lapa `/ecommerce` |

→ Full URL list + divergent-discovery guidance: see `design-inspiration-urls.md` — also framed there as taste extraction, not a template pool.

## fuse-browser Workflow

```
Step 0: mcp__fuse-browser__browser_open → sessionId (once, reuse for all sites)
Step 1: mcp__fuse-browser__browser_navigate → target URL (pass sessionId)
Step 2: Scroll to bottom — mcp__fuse-browser__browser_scroll with to: "end" (loads lazy content)
Step 3: mcp__fuse-browser__browser_wait_for → wait 5 seconds (lazy elements load)
Step 4: Scroll back to top — mcp__fuse-browser__browser_scroll with deltaY: -100000
Step 5: mcp__fuse-browser__browser_wait_for → wait 2 seconds
Step 6: mcp__fuse-browser__browser_screenshot with fullPage: true
Step 7: Analyze — extract ONLY: palette, typography, visual depth, craft technique. Do NOT log section order/flow/copy skeleton — that is decided by register + macrostructure-bank, independently of what these sites do.
Step 8: Repeat steps 1-7 for 3 more sites (4 total, same session)
Step 9: Feed the extracted taste signals (never structure) into Gemini XML <style_reference> block
```

## Mandatory CSS-Precise Analysis (NOT vague descriptions)

After each screenshot, extract EXACT CSS specs:
```
### Screenshot Analysis — {URL}
1. **Colors**: primary=oklch(X% X X), accent=oklch(...), bg=oklch(...), text=oklch(...)
2. **Typography**: font-family exact name, H1 clamp(Xrem,Xvw,Xrem) weight X, body Xrem weight X
3. **Depth metrics**: box-shadow values (X layers), border-radius Xpx, backdrop-blur Xpx, opacity X
4. **Craft technique inventory**: marquee/ticker present? diagonal clip-path used? tinted-background alternation used? — log these as techniques on the shelf, NOT as an order to copy. Whether/where they appear on your page is a macrostructure decision (`macrostructure-bank.md`), made independently of this inventory.
```
FLAT DESIGNS ARE FORBIDDEN. If you only see flat sections with no shadows, no layers, no effects — the site is a bad reference. Pick a different one with visual depth.

## Absolute Ban — AI-Slop Signature Combo

NEVER ship the combination of: Tailwind blue/indigo hue range (200-290°) as
the primary/accent color + Inter as the primary typeface + `rounded-2xl` as
the default corner radius. This exact triad is the single most common
AI-generated site signature (grounding: sailop ai-slop research — ~83% of
sampled AI-generated pages share this palette/font/radius fingerprint). If 2
of these 3 are already fixed by brand guidelines, the third MUST change
(different hue, different radius, or a different typeface —
`design-system/references/forbidden-fonts.md` lists reflex-reject fonts and
alternatives).

## Lookalike Test (run AFTER build, not only during browsing)

Render the finished page at a ~200px-wide silhouette (scaled screenshot,
blurred/downsampled render, or a squint-test) and compare it against
silhouettes of the sites browsed in this phase plus 2-3 direct competitors.
If the silhouette is indistinguishable — same section count, same
proportions, same rhythm of light/dark blocks in the same order — flag it as
structural slop: return to `macrostructure-bank.md` and pick a different (or
more deliberately varied) skeleton. Run this per project, not once as a
one-time habit.

## FORBIDDEN Navigation Targets

NEVER navigate to these — they are catalogues, not inspiration:
- `framer.com/templates`, `webflow.com/templates`, `themeforest.net`
- Any URL with `/templates`, `/marketplace`, `/themes` in the path

**Why:** These pages list product grids — no real design to extract.

## Reference Selection Format

After browsing 4 sites, write in `design-system.md` BEFORE coding:
```
## Design Reference
- Sources: {url1}, {url2}, {url3}, {url4}
- Extracted: {palette oklch values} / {typography} / {depth & craft technique(s)}
- Macrostructure: {named alternative from macrostructure-bank.md} — chosen independently of the sources above
- NOT reproduced: section flow/order/copy skeleton (sources are taste donors only)
```
This feeds into the Gemini XML `<style_reference>` block — taste signals
only. NEVER call Gemini without this, and never let `<style_reference>`
smuggle in a section order.

## Awwwards Deep Browsing

1. Navigate to `awwwards.com/websites/` filtered by sector
2. Screenshot the gallery → identify interesting sites
3. Navigate to `awwwards.com/sites/{name}` → find the "Visit Website" link
4. Navigate to the real production URL → fullPage screenshot

## What NOT to Do

- NEVER fewer than 4 sources | NEVER reuse same sites | NEVER give up before 6 tries
- NEVER skip analysis | ALWAYS `fullPage: true`
- NEVER treat a browsed site as a structural template — extraction is palette/typography/depth/craft only
- NEVER skip the Lookalike Test before declaring the page done
