# next-intl Routing Configuration

## Basic Config

```typescript
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr', 'de'],
  defaultLocale: 'en'
})
```

## Locale Prefix Strategies

```typescript
// Always show prefix (default)
defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always'  // /en/about, /fr/about
})

// Hide default locale prefix
defineRouting({
  localePrefix: 'as-needed'  // /about (en), /fr/about
})

// Never show prefix
defineRouting({
  localePrefix: 'never'  // /about (locale from cookie/header)
})
```

## Domain-Based Routing

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

## Pathnames (Localized URLs)

```typescript
defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  pathnames: {
    '/about': {
      en: '/about',
      fr: '/a-propos'
    },
    '/products/[slug]': {
      en: '/products/[slug]',
      fr: '/produits/[slug]'
    }
  }
})
```

## Locale Detection

```typescript
defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localeDetection: true  // Detect from Accept-Language header
})
```

## Alternate Links (SEO)

```typescript
defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  alternateLinks: true  // Add hreflang links to <head>
})
```
