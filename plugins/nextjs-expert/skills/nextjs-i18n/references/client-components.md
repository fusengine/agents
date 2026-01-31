---
name: client-components
description: Provider setup, useTranslations, useFormatter, optimisation messages
when-to-use: composants interactifs, hooks, formulaires, hydration, composants animés
keywords: NextIntlClientProvider, useTranslations, useFormatter, use client
priority: high
requires: installation.md, server-components.md
related: server-components.md, formatting.md
---

# next-intl Client Components

## When to Use

- Components with `'use client'` directive
- Interactive UI (buttons, forms, modals)
- React hooks (useState, useEffect)
- Real-time display (clock, counters)

## Why NextIntlClientProvider

| Benefit | Explanation |
|---------|-------------|
| **Hydration** | Syncs server/client to avoid mismatches |
| **Performance** | Only loads needed messages client-side |
| **React Context** | Enables `useTranslations` hooks |

## Provider Setup

```typescript
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
```

## useTranslations

```typescript
'use client'
import { useTranslations } from 'next-intl'

export function ClientButton() {
  const t = useTranslations('Actions')
  return <button>{t('submit')}</button>
}
```

## useFormatter

```typescript
'use client'
import { useFormatter } from 'next-intl'

export function Price({ value }: { value: number }) {
  const format = useFormatter()
  return <span>{format.number(value, { style: 'currency', currency: 'EUR' })}</span>
}
```

## useLocale / useNow / useTimeZone

```typescript
'use client'
import { useLocale, useNow, useTimeZone } from 'next-intl'

export function Clock() {
  const locale = useLocale()
  const now = useNow({ updateInterval: 1000 })
  const tz = useTimeZone()
  return <span>{now.toLocaleTimeString(locale)} ({tz})</span>
}
```

## Optimization: Partial Messages

Reduces client bundle by passing only needed namespaces.

```typescript
<NextIntlClientProvider messages={pick(messages, ['Common', 'Nav'])}>
  {children}
</NextIntlClientProvider>
```

```typescript
function pick<T extends object>(obj: T, keys: string[]): Partial<T> {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key]
    return acc
  }, {} as any)
}
```

## Server vs Client

| Context | Hook | Import |
|---------|------|--------|
| Server Component | `getTranslations` | `next-intl/server` |
| Client Component | `useTranslations` | `next-intl` |
