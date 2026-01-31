# next-intl Core Library

## Standalone Usage (Without Next.js)

next-intl can be used outside Next.js via `use-intl` package.

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

## API

```typescript
// Translator
createTranslator({ locale, messages, namespace?, onError?, getMessageFallback? })

// Formatter
createFormatter({ locale, timeZone?, now?, formats? })
```

## When to Use Core Library

- Non-Next.js React apps
- Node.js APIs/workers
- Edge functions
- Testing utilities
- Shared packages
