---
name: routing-config
description: Stratégies de préfixes de locale (always, as-needed, never), domaines, URLs traduites
when-to-use: SEO, domaines par langue, URLs traduites, préfixes locales, production setup
keywords: localePrefix, domains, pathnames, as-needed, always, never
priority: high
requires: routing-setup.md
related: seo.md, middleware-proxy.md
---

# next-intl Routing Configuration

## When to Configure

- Multilingual project with localized URLs
- International SEO (hreflang)
- Domain-per-language (example.fr, example.de)
- Translated URLs (/about → /a-propos)

## Basic Config

```typescript
// modules/cores/i18n/src/config/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr', 'de'],
  defaultLocale: 'en'
})
```

## Locale Prefix Strategies

| Strategy | EN URL | FR URL | Recommendation |
|----------|--------|--------|----------------|
| `always` | `/en/about` | `/fr/about` | **SEO optimal** |
| `as-needed` | `/about` | `/fr/about` | Short URLs for default |
| `never` | `/about` | `/about` | SPA, cookie detection |

```typescript
// always (default) - Recommended for SEO
defineRouting({ localePrefix: 'always' })  // /en/about, /fr/about

// as-needed - Hides prefix for defaultLocale
defineRouting({ localePrefix: 'as-needed' })  // /about (en), /fr/about

// never - Locale via cookie/header only
defineRouting({ localePrefix: 'never' })  // /about (auto-detection)
```

## Domain-Based Routing

For sites with dedicated domains per language.

```typescript
defineRouting({
  locales: ['en', 'fr', 'de'],
  defaultLocale: 'en',
  domains: [
    { domain: 'example.com', defaultLocale: 'en' },
    { domain: 'example.fr', defaultLocale: 'fr' },
    { domain: 'example.de', defaultLocale: 'de' }
  ]
})
```

## Translated URLs (pathnames)

Translates slugs for better local SEO.

```typescript
defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  pathnames: {
    '/about': { en: '/about', fr: '/a-propos' },
    '/products/[slug]': { en: '/products/[slug]', fr: '/produits/[slug]' }
  }
})
```

## SEO Options

```typescript
defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localeDetection: true,  // Detect Accept-Language header
  alternateLinks: true    // Auto-add <link hreflang>
})
```

## Recommendations

| Use Case | Strategy | Why |
|----------|----------|-----|
| International e-commerce | `always` + `pathnames` | Maximum SEO |
| B2B SaaS | `as-needed` | Clean URLs |
| Internal app | `never` | Simplicity |
| Multi-domain | `domains` | Clear separation |
