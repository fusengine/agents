---
name: research-docs
description: "Research / docs profile — read pages, bulk-fetch, crawl, and scrape Google SERP via the fast-path only. Never open a live browser session to read."
keywords: fetch, fetch_batch, crawl, serp_batch, docs, scraping
related: webapp-testing, visual-design
---

# Profile: Research / Docs (fast-path only)

You need text, HTML, or structured data — **never a live session**. A browser launch here is a rule-1 violation.

## Tool choice

| Need | Tool | Note |
|------|------|------|
| One page's content | `browser_fetch { url }` | Markdown/text extraction, no render |
| N known URLs | `browser_fetch_batch { urls:[...] }` | One call, not a loop |
| Whole site / section | `browser_crawl { url, maxPages, maxDepth }` | Follows links, bounded |
| Google results | `browser_serp_batch { queries:[...] }` | N queries in one call |

## Concrete calls

Read one doc page:
```
browser_fetch { url: "https://example.com/docs/api" }
```

Bulk-fetch several pages at once (never loop `browser_fetch`):
```
browser_fetch_batch { urls: [
  "https://example.com/docs/install",
  "https://example.com/docs/config",
  "https://example.com/docs/api"
] }
```

Crawl a doc section with bounds:
```
browser_crawl { url: "https://example.com/docs/", maxPages: 40, maxDepth: 3 }
```

Scrape SERP for discovery (batch the queries):
```
browser_serp_batch { queries: [
  "astro 6 content layer api",
  "astro server islands defer",
  "astro csp experimentalStaticHeaders"
] }
```

## Rules

- If uncertain about an API/version, this is step ③ of the verification chain (Context7 → Exa → fuse-browser fast-path on known doc URLs). One source is never enough.
- Deterministic data from repeated cards → jump to `browser_extract_schema` with `containerSelector` (see the tool's own args), not manual snapshot parsing.
- No `browser_open` / `browser_navigate` / `browser_close` in this profile. If you typed one, you picked the wrong profile.
