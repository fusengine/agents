---
name: visual-design
description: "Visual capture profile — responsive + dark screenshots in one call, multi-URL shot batches, full-site shots, and visual regression diffs. For the full design pipeline, point to the fuse-design skills, do not duplicate them."
keywords: screenshot, viewports, colorScheme, shots_batch, site_shots, visual_diff, regression
related: research-docs, webapp-testing
---

# Profile: Visual / Design (pixels)

For capturing what a page looks like — responsive breakpoints, light/dark, and regression. Batch everything; never loop one screenshot at a time.

## Tool choice

| Need | Tool | Note |
|------|------|------|
| Responsive + dark in ONE call | `browser_screenshot { viewports:[...], colorScheme }` | Rule 3 — one call |
| N URLs shot at once | `browser_shots_batch { urls:[...] }` | Not a per-URL loop |
| Every page of one site | `browser_site_shots { url }` | Crawl + shoot |
| Regression vs baseline | `browser_visual_diff { baseline, current }` | Pixel/structural delta |

## Concrete calls

Responsive + dark in a single call (not four screenshots):
```
browser_screenshot {
  url: "http://localhost:4321",
  viewports: ["375x812", "768x1024", "1440x900"],
  colorScheme: "dark"
}
```

Shoot several routes at once:
```
browser_shots_batch { urls: [
  "http://localhost:4321/",
  "http://localhost:4321/pricing",
  "http://localhost:4321/blog"
] }
```

Catch a visual regression against a saved baseline:
```
browser_visual_diff { baseline: "home-v1.png", current: "http://localhost:4321/" }
```

## Rules

- One `browser_screenshot` with a `viewports` array + `colorScheme` beats N single shots. Same for `shots_batch` over looping.
- `browser_metrics` gives real Core Web Vitals (LCP/INP/CLS) when the visual check also needs performance evidence.

## Full design pipeline — do NOT reimplement here

This profile is raw capture only. For identity → research → generate → motion → audit, use the design plugin, which already owns that flow and the deterministic quality gate:

- `fuse-design:design-web` — marketing sites / landing pages / components (inspiration browsing, layout discipline).
- `fuse-design:design-review` — the final gate: contrast, forbidden fonts, per-section light+dark screenshot review, max 2 fix cycles.

Route design work to those skills instead of scripting screenshots by hand.
