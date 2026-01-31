# next-intl Client Components

## Quand utiliser

- Composants avec `'use client'` directive
- Interactivité (boutons, formulaires, modals)
- Hooks React (useState, useEffect)
- Affichage temps réel (horloge, compteurs)

## Pourquoi NextIntlClientProvider

- **Hydratation**: Synchronise serveur/client pour éviter les mismatches
- **Performance**: Ne charge que les messages nécessaires côté client
- **Contexte React**: Permet aux hooks `useTranslations` de fonctionner

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

## Optimisation: Messages partiels

Réduit le bundle client en ne passant que les namespaces nécessaires.

```typescript
// Passe uniquement Common et Nav au client (pas tout messages)
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

| Contexte | Hook | Import |
|----------|------|--------|
| Server Component | `getTranslations` | `next-intl/server` |
| Client Component | `useTranslations` | `next-intl` |
