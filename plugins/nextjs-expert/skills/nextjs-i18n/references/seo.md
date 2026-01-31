---
name: seo
description: Hreflang alternates, sitemaps multilingues, metadata traduites, JSON-LD
when-to-use: SEO international, hreflang, sitemaps, contenu dupliqué, rankings locaux
keywords: hreflang, alternates, sitemap, metadata, JSON-LD, canonical, international SEO
priority: medium
requires: routing-config.md, server-components.md
related: routing-config.md, translations.md
---

# next-intl SEO

## When to Use

- International SEO with hreflang tags
- Localized sitemaps for Google
- Translated metadata (title, description, OG)
- JSON-LD with language information

## Why hreflang Matters

| Without hreflang | With hreflang |
|------------------|---------------|
| Google may index wrong version | Correct version per region |
| Duplicate content penalty | No penalty |
| Poor local rankings | Better local SEO |

## Alternate Links (hreflang)

```typescript
// app/[locale]/layout.tsx
import { getLocale } from 'next-intl/server'
import { routing } from '@/modules/cores/i18n/src/config/routing'

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    alternates: {
      canonical: `https://example.com/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://example.com/${l}`])
      )
    }
  }
}
```

## Sitemap with Locales

```typescript
// app/sitemap.ts
import { routing } from '@/modules/cores/i18n/src/config/routing'

export default function sitemap() {
  const baseUrl = 'https://example.com'
  const pages = ['', '/about', '/contact']

  return pages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${baseUrl}/${l}${page}`])
        )
      }
    }))
  )
}
```

## Localized Metadata

```typescript
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('Meta')
  return {
    title: t('title'),
    description: t('description'),
    openGraph: { title: t('ogTitle'), description: t('ogDescription') }
  }
}
```

## JSON-LD with Locale

```typescript
export default async function Page() {
  const locale = await getLocale()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    inLanguage: locale
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```
