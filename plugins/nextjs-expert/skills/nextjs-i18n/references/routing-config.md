---
name: routing-config
description: Locale prefix strategies (always, as-needed, never), domains, translated URLs
when-to-use: SEO, per-language domains, translated URLs, locale prefixes, production setup
keywords: localePrefix, domains, pathnames, as-needed, always, never
priority: high
requires: routing-setup.md
related: seo.md, middleware-proxy.md
---

# next-intl Routing Configuration

## When to Configure

- Multilingual project with localized URLs
- International SEO (hreflang)
- Domain-per-language (example.es, example.de)
- Translated URLs (/about → /acerca-de)

## Basic Config

```typescript
// modules/cores/i18n/src/config/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es', 'de'],
  defaultLocale: 'en'
})
```

## Locale Prefix Strategies

| Strategy | EN URL | ES URL | Recommendation |
|----------|--------|--------|----------------|
| `always` | `/en/about` | `/es/about` | **SEO optimal** |
| `as-needed` | `/about` | `/es/about` | Short URLs for default |
| `never` | `/about` | `/about` | SPA, cookie detection |

```typescript
// always (default) - Recommended for SEO
defineRouting({ localePrefix: 'always' })  // /en/about, /es/about

// as-needed - Hides prefix for defaultLocale
defineRouting({ localePrefix: 'as-needed' })  // /about (en), /es/about

// never - Locale via cookie/header only
defineRouting({ localePrefix: 'never' })  // /about (auto-detection)
```

## Domain-Based Routing

For sites with dedicated domains per language.

```typescript
defineRouting({
  locales: ['en', 'es', 'de'],
  defaultLocale: 'en',
  domains: [
    { domain: 'example.com', defaultLocale: 'en' },
    { domain: 'example.es', defaultLocale: 'es' },
    { domain: 'example.de', defaultLocale: 'de' }
  ]
})
```

## Translated URLs (pathnames)

Translates slugs for better local SEO.

```typescript
defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  pathnames: {
    '/about': { en: '/about', es: '/acerca-de' },
    '/products/[slug]': { en: '/products/[slug]', es: '/productos/[slug]' }
  }
})
```

## SEO Options

```typescript
defineRouting({
  locales: ['en', 'es'],
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
