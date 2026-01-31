---
name: configuration
description: Request config, formats globaux, plugin next.config, variables env
when-to-use: customiser comportement, formats dates/nombres, timezone, fallbacks
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
