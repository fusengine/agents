# next-intl SEO

## Alternate Links (hreflang)

```typescript
// app/[locale]/layout.tsx
import { getLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

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
import { routing } from '@/i18n/routing'

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
  const t = await getTranslations('Metadata')
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
