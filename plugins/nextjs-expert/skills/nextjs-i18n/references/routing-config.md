# next-intl Routing Configuration

## Quand configurer le routing

- Projet multilingue avec URLs localisées
- SEO international (hreflang)
- Domaines par langue (example.fr, example.de)
- URLs traduites (/about → /a-propos)

## Config de base

```typescript
// modules/cores/i18n/src/config/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr', 'de'],
  defaultLocale: 'en'
})
```

## Stratégies de préfixe locale

| Stratégie | URL EN | URL FR | Recommandation |
|-----------|--------|--------|----------------|
| `always` | `/en/about` | `/fr/about` | **SEO optimal** |
| `as-needed` | `/about` | `/fr/about` | URLs courtes pour défaut |
| `never` | `/about` | `/about` | SPA, détection cookie |

```typescript
// always (défaut) - Recommandé pour SEO
defineRouting({ localePrefix: 'always' })  // /en/about, /fr/about

// as-needed - Cache le préfixe pour defaultLocale
defineRouting({ localePrefix: 'as-needed' })  // /about (en), /fr/about

// never - Locale via cookie/header uniquement
defineRouting({ localePrefix: 'never' })  // /about (détection auto)
```

## Routing par domaine

Pour sites avec domaines dédiés par langue.

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

## URLs traduites (pathnames)

Traduit les slugs pour meilleur SEO local.

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

## Options SEO

```typescript
defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localeDetection: true,  // Détecte Accept-Language header
  alternateLinks: true    // Ajoute <link hreflang> automatiquement
})
```

## Recommandations

| Cas d'usage | Stratégie | Pourquoi |
|-------------|-----------|----------|
| E-commerce international | `always` + `pathnames` | SEO maximal |
| SaaS B2B | `as-needed` | URLs propres |
| App interne | `never` | Simplicité |
| Multi-domaines | `domains` | Séparation claire |
