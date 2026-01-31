# next-intl Server Components

## Server Component Usage

```typescript
// app/[locale]/page.tsx (Server Component by default)
import { getTranslations } from 'next-intl/server'

export default async function Page() {
  const t = await getTranslations('HomePage')
  return <h1>{t('title')}</h1>
}
```

## getTranslations

```typescript
import { getTranslations } from 'next-intl/server'

// With namespace
const t = await getTranslations('Namespace')
t('key')

// Without namespace
const t = await getTranslations()
t('Namespace.key')

// With locale override
const t = await getTranslations({ locale: 'fr', namespace: 'Namespace' })
```

## getFormatter

```typescript
import { getFormatter } from 'next-intl/server'

export default async function Page() {
  const format = await getFormatter()

  return (
    <p>{format.dateTime(new Date(), { dateStyle: 'full' })}</p>
  )
}
```

## getLocale & getMessages

```typescript
import { getLocale, getMessages } from 'next-intl/server'

export default async function Page() {
  const locale = await getLocale()
  const messages = await getMessages()

  return <div>Current: {locale}</div>
}
```

## Metadata

```typescript
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata')

  return {
    title: t('title'),
    description: t('description')
  }
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
  // Use translations in server action
  return { message: t('success') }
}
```
