# next-intl Server Components

## Quand utiliser

- Pages et layouts (Server Components par défaut)
- Metadata (generateMetadata)
- Route Handlers (API routes)
- Server Actions

## Pourquoi Server Components pour i18n

| Avantage | Explication |
|----------|-------------|
| **Zero JS client** | Traductions rendues côté serveur, pas de bundle |
| **SEO optimal** | Contenu traduit dans le HTML initial |
| **Performance** | Pas d'hydratation nécessaire |
| **Sécurité** | Messages sensibles jamais exposés au client |

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
// Variantes
const t = await getTranslations('Namespace')      // Avec namespace
const t = await getTranslations()                  // Sans namespace → t('Namespace.key')
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

| Critère | Server | Client |
|---------|--------|--------|
| Import | `next-intl/server` | `next-intl` |
| Fonction | `getTranslations` (async) | `useTranslations` (hook) |
| Bundle | 0 KB | Messages inclus |
| Interactivité | Non | Oui |
