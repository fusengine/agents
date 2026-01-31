# next-intl Client Components

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

## useTranslations (Client)

```typescript
'use client'
import { useTranslations } from 'next-intl'

export function ClientComponent() {
  const t = useTranslations('Namespace')
  return <button>{t('submit')}</button>
}
```

## useFormatter (Client)

```typescript
'use client'
import { useFormatter } from 'next-intl'

export function PriceDisplay({ price }: { price: number }) {
  const format = useFormatter()
  return <span>{format.number(price, { style: 'currency', currency: 'EUR' })}</span>
}
```

## useLocale

```typescript
'use client'
import { useLocale } from 'next-intl'

export function LocaleDisplay() {
  const locale = useLocale()
  return <span>Current: {locale}</span>
}
```

## useNow & useTimeZone

```typescript
'use client'
import { useNow, useTimeZone } from 'next-intl'

export function TimeDisplay() {
  const now = useNow({ updateInterval: 1000 })
  const timeZone = useTimeZone()

  return <span>{now.toLocaleTimeString()} ({timeZone})</span>
}
```

## Partial Messages (Optimization)

```typescript
// Only pass needed messages to client
<NextIntlClientProvider
  messages={pick(messages, ['Common', 'Navigation'])}
>
  {children}
</NextIntlClientProvider>
```

```typescript
// Helper function
function pick<T extends object>(obj: T, keys: string[]): Partial<T> {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key]
    return acc
  }, {} as any)
}
```
