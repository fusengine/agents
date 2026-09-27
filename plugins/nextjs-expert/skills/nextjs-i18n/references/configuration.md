---
name: configuration
description: Request config, global formats, next.config plugin, env variables
when-to-use: customize behavior, date/number formats, timezone, fallbacks
keywords: getRequestConfig, formats, timeZone, onError, getMessageFallback
priority: medium
requires: installation.md
related: plugin.md, runtime-requirements.md
---

# next-intl Configuration

## Request Configuration

```typescript
// modules/cores/i18n/src/services/request.ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,

    // Timezone
    timeZone: 'Europe/Paris',

    // Reference time for relative formatting
    now: new Date(),

    // Error handling
    onError(error) {
      console.error(error)
    },

    // Fallback for missing messages
    getMessageFallback({ namespace, key }) {
      return `${namespace}.${key}`
    }
  }
})
```

## Request Configuration with next/root-params (Next.js 16.3+)

With a root layout at `app/[locale]/layout.tsx`, read the locale natively — enables static
rendering without `setRequestLocale` and better `cacheComponents` integration.
Not available in Route Handlers / Server Actions yet: pass `locale` explicitly there.

```typescript
// modules/cores/i18n/src/services/request.ts
import * as rootParams from 'next/root-params'
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '../config/routing'

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {  // explicit override from callers (e.g. Server Actions) wins
    const paramValue = await rootParams.locale()
    if (!hasLocale(routing.locales, paramValue)) notFound()
    locale = paramValue
  }
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default }
})
```

## Global Formats

```typescript
export default getRequestConfig(async () => ({
  locale,
  messages,
  formats: {
    dateTime: {
      short: { day: 'numeric', month: 'short', year: 'numeric' }
    },
    number: {
      currency: { style: 'currency', currency: 'EUR' }
    }
  }
}))
```

## Using Custom Formats

```typescript
const format = useFormatter()

// Use named format
format.dateTime(date, 'short')
format.number(price, 'currency')
```

## next.config.ts Plugin

```typescript
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin(
  './modules/cores/i18n/src/services/request.ts'
)

export default withNextIntl({
  // Plugin options
  experimental: {
    // Enable async request context
  }
})
```

## Environment Variables

```env
# Optional: Override default locale detection
NEXT_LOCALE=en
```

## Provider Configuration

```typescript
<NextIntlClientProvider
  locale={locale}
  messages={messages}
  timeZone="Europe/Paris"
  now={new Date()}
  formats={formats}
  onError={onError}
>
  {children}
</NextIntlClientProvider>
```
