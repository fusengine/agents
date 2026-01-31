---
name: typescript
description: Types pour clés messages, locale types, page props type-safe, autocomplete
when-to-use: typage clés, erreurs compile-time, autocomplétion, interfaces messages
keywords: IntlMessages, Locale type, type-safe keys, autocomplete, isValidLocale
priority: medium
requires: installation.md, routing-setup.md
related: configuration.md
---

# next-intl TypeScript

## When to Use

- Type-safe translation keys with autocomplete
- Catch typos in translation keys at compile time
- Define locale types for params
- Strongly typed message structure

## Why Type-Safe i18n

| Without Types | With Types |
|---------------|------------|
| Runtime errors for typos | Compile-time errors |
| No autocomplete | Full autocomplete |
| Manual key checking | IDE support |

## Type-Safe Messages

```typescript
// global.d.ts
import en from './modules/cores/i18n/messages/en.json'

type Messages = typeof en

declare global {
  interface IntlMessages extends Messages {}
}
```

## Auto-Complete for Keys

With the above declaration, you get autocomplete:

```typescript
const t = useTranslations('HomePage')
t('title')  // ✓ Auto-complete works
t('typo')   // ✗ TypeScript error
```

## Locale Type

```typescript
// modules/cores/i18n/src/interfaces/i18n.interface.ts
export const locales = ['en', 'fr', 'de'] as const
export type Locale = (typeof locales)[number]

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
```

## Page Props Type

```typescript
import type { Locale } from '@/modules/cores/i18n/src/interfaces/i18n.interface'

type PageProps = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params
  // locale is typed as Locale
}
```

## Error Handling

```typescript
// modules/cores/i18n/src/services/request.ts
export default getRequestConfig(async ({ requestLocale }) => {
  return {
    locale,
    messages,
    onError(error) {
      console.error(error)
    },
    getMessageFallback({ namespace, key }) {
      return `${namespace}.${key}`
    }
  }
})
```

## Messages Interface

```typescript
// modules/cores/i18n/src/interfaces/messages.interface.ts
export interface Messages {
  Common: { loading: string; error: string }
  HomePage: { title: string; description: string }
  Navigation: { home: string; about: string }
}
```
