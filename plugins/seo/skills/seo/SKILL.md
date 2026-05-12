---
name: seo
description: Use when running SEO, GEO, schema, Core Web Vitals, sitemap, hreflang, E-E-A-T, AI Overviews, technical SEO, or structured data tasks. Covers full-site audits, single-page analysis, schema markup, content quality, AI search optimization, local SEO, sitemap/robots, internal linking, semantic clustering, and search experience.
argument-hint: "[command] [url-or-path]"
user-invocable: true
references: 01-seo-foundations, 02-onpage-seo, 03-schema-org, 04-geo-2026, 05-technical-seo, 06-content-strategy, 08-measurement, 09-checklists, 10-local-seo
related-skills: seo-audit, seo-page, seo-technical, seo-schema, seo-content, seo-geo, seo-local, seo-sitemap, seo-hreflang, seo-cluster
---

# SEO/GEO Orchestrator

**Invocation:** `/seo $1 $2` where `$1` is the command and `$2` is the URL or local path.

Comprehensive SEO + GEO 2026 analysis across all industries (SaaS, local services, e-commerce, publishers, agencies). Orchestrates 19 sub-skills and 8 parallel sub-agents. Local-first, zero third-party APIs.

## Quick Reference

| Command | What it does | Sub-skill |
|---------|--------------|-----------|
| `/seo audit <url>` | Full audit with parallel subagent delegation | seo-audit |
| `/seo page <url\|path>` | Deep single-page analysis | seo-page |
| `/seo technical <url>` | Technical SEO (robots, CWV, crawlability) | seo-technical |
| `/seo schema <url\|path>` | Detect/validate/generate JSON-LD | seo-schema |
| `/seo content <url>` | E-E-A-T + anti-cannibalization | seo-content |
| `/seo images <url>` | Image SEO: alt text, formats, lazy loading | seo-images |
| `/seo sitemap <url\|generate>` | Analyze or generate XML sitemaps | seo-sitemap |
| `/seo hreflang <url>` | i18n/multilingual audit and generation | seo-hreflang |
| `/seo internal-linking <url>` | Pillar/cluster, anchor optimization | seo-internal-linking |
| `/seo cluster <keyword>` | SERP-based semantic clustering | seo-cluster |
| `/seo brief <topic>` | Generate detailed content brief | seo-content-brief |
| `/seo plan <type>` | Strategic planning (saas/local/ecommerce/publisher) | seo-plan |
| `/seo sxo <url>` | Search Experience Optimization | seo-sxo |
| `/seo snippets <url>` | Position 0 + AI Overviews input | seo-featured-snippets |
| `/seo local <url>` | Local SEO (GBP, NAP, citations, map pack) | seo-local |
| `/seo geo <url>` | AI Overviews/ChatGPT/Perplexity/Claude readiness | seo-geo |
| `/seo ecommerce <url>` | Product schema, faceted nav, marketplace | seo-ecommerce |
| `/seo video <url>` | VideoObject, YouTube, transcripts | seo-video |
| `/seo redirects <url>` | 301/302, migration, chains | seo-redirects |
| `/seo drift <url>` | SEO diff vs previous git HEAD | (uses diff-seo.ts) |

## Orchestration Logic — `/seo audit`

When user invokes `/seo audit <url>`:
1. Detect business type from homepage (SaaS, local, ecommerce, publisher, agency)
2. Spawn sub-agents **in parallel** (single message, multiple Agent calls):
   - `seo-technical` (robots, sitemap, CWV, hreflang)
   - `seo-schema` (JSON-LD detect/validate)
   - `seo-content` (E-E-A-T, anti-cannibalization)
   - `seo-geo` (AI Overviews readiness)
   - `seo-images` (alt, formats, optim)
   - `seo-sitemap` (sitemap.xml + robots.txt)
3. **If local business detected** → also spawn `seo-local`
4. **If content strategy signals** (blog, pillar pages) → also spawn `seo-cluster`
5. Collect results, generate unified report with **SEO Health Score (0-100)**
6. Create prioritized action plan (Critical → High → Medium → Low)

## Workflow (7 phases — for content-creation flows)

```
PHASE 1: ANALYZE   → Extract content, detect intent
PHASE 2: RESEARCH  → SERP analysis, 2026 trends, AI platforms
PHASE 3: KEYWORDS  → Extract with anti-cannibalization
PHASE 4: STRUCTURE → Meta, OG, Twitter Cards, Hn, schema, alt
PHASE 5: CONTENT   → Write SEO+GEO optimized content
PHASE 6: VALIDATE  → SEO + GEO compliance checklists
PHASE 7: DRIFT     → Compare to git HEAD (diff-seo.ts)
```

## Reference Library (legacy 10 categories)

```
references/
├── 01-seo-foundations/   → research workflow, SEO vs GEO
├── 02-onpage-seo/        → meta tags, OG, Twitter, headers, alt
├── 03-schema-org/        → 9 schema types (templates ready)
├── 04-geo-2026/          → AI platforms, citations, zero-click
├── 05-technical-seo/     → CWV, mobile-first, crawlability
├── 06-content-strategy/  → E-E-A-T, anti-cannibalization, keywords
├── 07-sea-google-ads/    → Quality Score, landing pages (optional)
├── 08-measurement/       → GEO tracking, Share of Model
├── 09-checklists/        → pre-publication, technical audit
└── 10-local-seo/         → GBP, NAP, citations, Local Pack
```

## Scripts Available (`scripts/`)

| Script | Purpose |
|--------|---------|
| `parse-meta.ts` | Extract title/description/OG/canonical via cheerio |
| `validate-schema.ts` | Validate JSON-LD offline against schema.org dumps |
| `check-cwv.ts` | Lighthouse CLI local wrapper |
| `parse-sitemap.ts` | Validate sitemap.xml structure |
| `parse-robots.ts` | Validate robots.txt directives |
| `parse-hreflang.ts` | Validate hreflang tags |
| `diff-seo.ts` | SEO drift via `git diff` |
| `geo-score.ts` | LLM-readiness scoring (0-100) |

## Differentiation

- **Local-first**: zero Google APIs, zero DataForSEO/Moz, zero Python
- **Framework-native**: delegates implementation to `fuse-astro`, `fuse-nextjs`, `fuse-laravel`
- **GEO-first**: AI Overviews/ChatGPT/Perplexity as primary target, not afterthought
- **TS/Bun stack**: all scripts in TypeScript, executed by Bun

## Industry Detection

Detect from homepage signals:
- **SaaS**: `/pricing`, `/features`, `/integrations`, "free trial", "sign up"
- **Local**: address, phone, opening hours, GBP link, NAP
- **E-commerce**: `/products`, `/cart`, `/checkout`, product schema
- **Publisher**: `/articles`, `NewsArticle` schema, byline, dateline
- **Agency**: `/services`, `/case-studies`, `/clients`, testimonials

## Quality Gates

- **30+ location pages** → warning
- **50+ location pages** → hard stop, require manual audit
- **100+ programmatic pages** → warning
- **500+ programmatic pages** → hard stop
- **Thin content** detection per page type
- **Doorway page** prevention

## First Invocation — Activate Hook

When user invokes `/seo` for the first time on a project:

1. Check if `.fuse-seo` marker exists at project root (or any parent up to repo root)
2. If **absent**, ask the user **before any other work**:
   > "Activate the fuse-seo hook on this project? It will validate meta/schema/OG on every Write/Edit of HTML-like files (`.html`, `.astro`, `.tsx`, `.vue`, `.blade.php`) via `hooks/validate-seo.ts`."
3. If user confirms → create empty file `.fuse-seo` at project root via `touch .fuse-seo` (or Write tool with empty content)
4. If user declines → proceed without creating the marker (hook stays dormant on this project)
5. **Do not ask again** in the same session — the marker presence is the persistent answer

This is opt-in by design: never auto-create without explicit user consent.

## After Any Analysis

1. Generate markdown report in `.fuse-seo/reports/<date>-<command>.md`
2. Offer drift baseline capture: `/seo drift <url>` for future comparisons
3. Suggest framework-specific implementation via delegation:
   - Astro project → `fuse-astro:astro-seo`
   - Next.js → `fuse-nextjs:nextjs-stack`
   - Laravel → `fuse-laravel:laravel-blade`
