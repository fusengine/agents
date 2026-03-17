---
name: astro-i18n
description: Use when implementing internationalization in Astro, configuring i18n routing, setting up locale strategies, using getRelativeLocaleUrl/getAbsoluteLocaleUrl, handling Astro.currentLocale, or adding hreflang tags with sitemap.
versions:
  astro: "6"
user-invocable: true
references: references/routing-config.md, references/strategies.md, references/helper-functions.md, references/content-translation.md, references/sitemap-hreflang.md, references/fallback.md, references/templates/i18n-config.md, references/templates/locale-page.md, references/templates/language-switcher.md
related-skills: astro-6, astro-content, astro-seo, solid-astro
---

# Astro i18n

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing routing, content collections, and locale files
2. **fuse-ai-pilot:research-expert** - Verify latest Astro i18n docs via Context7/Exa
3. **mcp__context7__query-docs** - Check `astro:i18n` API and sitemap integration

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Building multilingual Astro sites with locale-prefixed URLs
- Configuring `defaultLocale` and routing strategies
- Generating locale-aware links with `getRelativeLocaleUrl()`
- Reading `Astro.currentLocale` in components and pages
- Adding `hreflang` alternate links via `@astrojs/sitemap`
- Translating content using Content Collections per locale

### Built-in i18n (Astro 3.5+)

Astro's built-in i18n system provides:
- File-based locale routing via `src/pages/[locale]/`
- Routing strategies for URL prefix behavior
- URL helper functions from `astro:i18n`
- Middleware-based routing logic
- Fallback locale configuration

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| Routing config | [routing-config.md](references/routing-config.md) | Setup and config options |
| Strategies | [strategies.md](references/strategies.md) | prefix-always vs prefix-other-locales |
| Helper functions | [helper-functions.md](references/helper-functions.md) | getRelativeLocaleUrl and all helpers |
| Content translation | [content-translation.md](references/content-translation.md) | Translating content collections |
| Sitemap hreflang | [sitemap-hreflang.md](references/sitemap-hreflang.md) | SEO alternate links |
| Fallback | [fallback.md](references/fallback.md) | Missing translation fallback |

### Templates

| Template | When to Use |
|----------|-------------|
| [i18n-config.md](references/templates/i18n-config.md) | Full i18n configuration |
| [locale-page.md](references/templates/locale-page.md) | Page component with locale awareness |
| [language-switcher.md](references/templates/language-switcher.md) | Language switcher component |

---

## Best Practices

1. **Use `getRelativeLocaleUrl()`** — never hardcode locale prefixes in links
2. **`Astro.currentLocale`** — read locale in components, not from URL manually
3. **Content Collections per locale** — organize translated content in `src/content/[type]/[locale]/`
4. **Sitemap hreflang** — always configure `@astrojs/sitemap` with `i18n` option for SEO
5. **Fallback locales** — configure `fallback` to prevent 404s for missing translations

---

## Forbidden

- Hardcoding locale strings in URL paths
- Parsing the URL manually to detect locale (use `Astro.currentLocale`)
- Skipping hreflang configuration for SEO-sensitive sites
- Using `getRelativeLocaleUrl` without configuring `site` in Astro config
