---
name: core-library
description: use-intl pour React/Vite/non-Next.js, API Node.js, Cloudflare Workers
when-to-use: projets Vite, React classique, APIs Node, workers edge, packages partagés
keywords: use-intl, createTranslator, createFormatter, runtime agnostique
priority: high
requires:
related: installation.md
---

# next-intl Core Library

## When to Use

- Non-Next.js React apps (Vite, CRA)
- Node.js APIs or workers
- Edge functions (Cloudflare Workers)
- Shared packages used by multiple apps
- Testing utilities

## Why use-intl

| next-intl | use-intl |
|-----------|----------|
| Next.js only | Any runtime |
| Full framework | Core only |
| Server Components | React/vanilla |

## Installation

```bash
bun add use-intl
```

## React Integration

```typescript
import { IntlProvider, useTranslations, useFormatter } from 'use-intl'

const messages = {
  HomePage: { title: 'Hello' }
}

function App() {
  return (
    <IntlProvider locale="en" messages={messages}>
      <HomePage />
    </IntlProvider>
  )
}

function HomePage() {
  const t = useTranslations('HomePage')
  return <h1>{t('title')}</h1>
}
```

## Non-React Usage

```typescript
import { createTranslator, createFormatter } from 'use-intl'

const messages = { greeting: 'Hello {name}' }

const t = createTranslator({ locale: 'en', messages })
t('greeting', { name: 'John' })  // "Hello John"

const format = createFormatter({ locale: 'en' })
format.number(1234.56)  // "1,234.56"
format.dateTime(new Date())  // "1/15/2024"
```

## Server-Side (Node.js)

```typescript
import { createTranslator } from 'use-intl'

async function handler(locale: string) {
  const messages = await import(`./messages/${locale}.json`)
  const t = createTranslator({ locale, messages: messages.default })
  return { message: t('greeting') }
}
```

## API Reference

```typescript
// Translator
createTranslator({
  locale,
  messages,
  namespace?,
  onError?,
  getMessageFallback?
})

// Formatter
createFormatter({
  locale,
  timeZone?,
  now?,
  formats?
})
```
