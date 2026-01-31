# next-intl TypeScript

## Type-Safe Messages

```typescript
// global.d.ts
import en from './messages/en.json'

type Messages = typeof en

declare global {
  interface IntlMessages extends Messages {}
}
```

## Auto-Complete for Keys

With the above declaration, you get auto-complete:

```typescript
const t = useTranslations('HomePage')
t('title')  // ✓ Auto-complete works
t('typo')   // ✗ TypeScript error
```

## Strict Mode

```typescript
// i18n/request.ts
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

## Locale Type

```typescript
// i18n/routing.ts
export const locales = ['en', 'fr', 'de'] as const
export type Locale = (typeof locales)[number]

// Usage
function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
```

## Page Props Type

```typescript
type PageProps = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params
  // locale is typed as Locale
}
```

## Messages Structure

```typescript
// types/messages.ts
export interface Messages {
  Common: {
    loading: string
    error: string
  }
  HomePage: {
    title: string
    description: string
  }
  Navigation: {
    home: string
    about: string
  }
}
```
