---
name: server-components
description: Utilisation de getTranslations côté serveur, metadata SEO, Route Handlers
when-to-use: pages, layouts, metadata, route handlers, server actions, zéro JS client
keywords: getTranslations, getFormatter, getLocale, getMessages, async, metadata
priority: high
requires: installation.md, routing-setup.md
related: client-components.md, seo.md
---

# next-intl Server Components

## When to Use

- Pages and layouts (Server Components by default)
- Metadata (generateMetadata)
- Route Handlers (API routes)
- Server Actions

## Why Server Components for i18n

| Benefit | Explanation |
|---------|-------------|
| **Zero client JS** | Translations rendered server-side, no bundle |
| **SEO optimal** | Translated content in initial HTML |
| **Performance** | No hydration needed |
| **Security** | Sensitive messages never exposed to client |

## getTranslations

```typescript
// app/[locale]/page.tsx (Server Component)
import { getTranslations } from 'next-intl/server'

export default async function Page() {
  const t = await getTranslations('HomePage')
  return <h1>{t('title')}</h1>
}
```

```typescript
// Variants
const t = await getTranslations('Namespace')      // With namespace
const t = await getTranslations()                  // Without → t('Namespace.key')
const t = await getTranslations({ locale: 'fr' }) // Override locale
```

## getFormatter

```typescript
import { getFormatter } from 'next-intl/server'

export default async function Page() {
  const format = await getFormatter()
  return <p>{format.dateTime(new Date(), { dateStyle: 'full' })}</p>
}
```

## getLocale & getMessages

```typescript
import { getLocale, getMessages } from 'next-intl/server'

export default async function Page() {
  const locale = await getLocale()
  const messages = await getMessages()
  return <div>Locale: {locale}</div>
}
```

## Metadata (SEO)

```typescript
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Meta')
  return { title: t('title'), description: t('description') }
}
```

## Route Handlers

```typescript
// app/api/hello/route.ts
import { getTranslations } from 'next-intl/server'

export async function GET() {
  const t = await getTranslations('API')
  return Response.json({ message: t('hello') })
}
```

## Server Actions

```typescript
'use server'
import { getTranslations } from 'next-intl/server'

export async function submitForm(data: FormData) {
  const t = await getTranslations('Form')
  return { message: t('success') }
}
```

## Server vs Client

| Criteria | Server | Client |
|----------|--------|--------|
| Import | `next-intl/server` | `next-intl` |
| Function | `getTranslations` (async) | `useTranslations` (hook) |
| Bundle | 0 KB | Messages included |
| Interactivity | No | Yes |
