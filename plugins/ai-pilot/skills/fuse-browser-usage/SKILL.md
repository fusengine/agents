---
name: fuse-browser-usage
description: "Efficient fuse-browser usage: web fetch, crawl, SERP, browser session, screenshot, webapp testing, console errors. Read this BEFORE any mcp__fuse-browser__* tool call — it routes fetch/crawl/serp vs live session vs visual capture and enforces the 4 ZERO-TOLERANCE rules."
keywords:
  - web fetch
  - crawl
  - SERP
  - browser session
  - screenshot
  - webapp testing
  - console errors
  - visual diff
  - core web vitals
user-invocable: false
---

# fuse-browser — Efficient Usage

Canonical doctrine for every `mcp__fuse-browser__*` call. Read this skill FIRST, then load the one reference matching your goal. Default engine is **patchright** (stealth identity auto-generated); the Chromium binary comes from `setup.sh`.

## 4 Rules (ZERO TOLERANCE)

1. **Fast-path FIRST (no browser launch, ~10× faster)** — `browser_fetch` / `browser_fetch_batch` / `browser_crawl` / `browser_serp_batch` to read a page, bulk-fetch, crawl a site, or scrape Google SERP. Open a live session ONLY when you need interaction, JS rendering, or pixels.
2. **One session, always closed** — `browser_open` once → reuse the `sessionId` across `browser_navigate` calls → `browser_close` when done. Never leak sessions; the 2-min TTL is a safety net, not a substitute for closing.
3. **Batch over loops** — `browser_serp_batch` (N queries), `browser_fetch_batch` / `browser_shots_batch` (N URLs), `browser_screenshot { viewports:[...], colorScheme }` (responsive + dark in ONE call). Never write a per-URL loop.
4. **Deterministic extraction** — `browser_extract_schema` with `containerSelector` (card-by-card, correlated fields) over manual `browser_snapshot` parsing.

## Routing — pick the profile, load the reference

| Goal | Profile | Reference |
|------|---------|-----------|
| Read docs, bulk-fetch, crawl, scrape SERP (no pixels) | Research / docs | `references/research-docs.md` |
| Test a running webapp (console, network, interactions) | Webapp testing | `references/webapp-testing.md` |
| Screenshots, responsive + dark, visual regression | Visual / design | `references/visual-design.md` |

- **No live session for reading** — if you only need text/HTML/data, the answer is always fast-path (profile 1). Never `browser_open` to read.
- **Validation tools** (any profile): `browser_visual_diff` (regression vs baseline), `browser_metrics` (real Core Web Vitals), `browser_console` / `browser_network` / `browser_cookies` (runtime + security checks).
- **Full design pipeline** is NOT here — for identity → generate → audit, use `fuse-design:design-web` then the `fuse-design:design-review` gate. This skill only covers the raw browser tooling.
