---
name: astro-seo
description: SEO for Astro sites — meta tags, Open Graph, Twitter Cards, JSON-LD structured data, sitemap, RSS, robots.txt, canonical URLs, hreflang, Core Web Vitals. Use when optimizing search engine visibility or social sharing.
versions:
  astro: "6"
user-invocable: true
references: references/meta-tags.md, references/structured-data.md, references/sitemap-rss.md, references/canonical-hreflang.md, references/core-web-vitals.md, references/templates/seo-head.md, references/templates/json-ld.md
related-skills: astro-6, astro-content, astro-assets, astro-i18n
---

# Astro SEO

Complete SEO strategy for Astro 6 sites — zero JS by default makes Astro naturally SEO-friendly.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing layouts, head components, and metadata
2. **fuse-ai-pilot:research-expert** - Verify latest SEO best practices via Context7/Exa
3. **mcp__context7__query-docs** - Check Astro 6 sitemap/RSS integration docs

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Adding meta tags and Open Graph to any Astro page
- Generating JSON-LD structured data for rich snippets
- Setting up @astrojs/sitemap for search indexing
- Configuring RSS feeds with @astrojs/rss
- Creating robots.txt and canonical URL patterns
- Adding hreflang for multilingual SEO
- Measuring and improving Core Web Vitals

### Why Astro for SEO

| Feature | Benefit |
|---------|---------|
| Zero JS by default | Pure HTML for crawlers, instant indexing |
| Static output | Sub-second TTFB, top Core Web Vitals |
| `Astro.site` | Canonical URL construction built-in |
| Islands Architecture | Only hydrate interactive parts |

---

## Core Concepts

### Head Component Pattern

Create a reusable `<SEO />` or `<Head />` component accepting `title`, `description`, `og`, `canonical` props. Place in all layouts. Use `Astro.site` for absolute URL construction.

### Canonical URLs

Always construct canonicals with `Astro.site`:
```ts
const canonical = new URL(Astro.url.pathname, Astro.site);
```

### Structured Data

Inject JSON-LD via `<script type="application/ld+json" set:html={JSON.stringify(schema)} />`. Use `set:html` to avoid XSS — never template string interpolation.

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Meta Tags & OG** | [meta-tags.md](references/meta-tags.md) | Setting up head metadata |
| **JSON-LD** | [structured-data.md](references/structured-data.md) | Rich snippets, schema.org |
| **Sitemap & RSS** | [sitemap-rss.md](references/sitemap-rss.md) | Search indexing, feeds |
| **Canonical & hreflang** | [canonical-hreflang.md](references/canonical-hreflang.md) | Duplicate content, i18n |
| **Core Web Vitals** | [core-web-vitals.md](references/core-web-vitals.md) | LCP, CLS, FID optimization |

### Templates

| Template | When to Use |
|----------|-------------|
| [seo-head.md](references/templates/seo-head.md) | Reusable SEO head component |
| [json-ld.md](references/templates/json-ld.md) | JSON-LD BlogPosting, WebSite schemas |

---

## Best Practices

1. **One Head component** - Centralize all meta in a reusable component
2. **Absolute URLs** - Use `Astro.site` for og:image and canonicals
3. **`set:html` for JSON-LD** - Prevents XSS vulnerabilities
4. **sitemap + robots.txt** - Always configure both for crawlability
5. **hreflang on all locales** - Include x-default for language variants
