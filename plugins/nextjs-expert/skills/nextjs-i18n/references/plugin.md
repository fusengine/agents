---
name: plugin
description: Wrapper next.config.ts pour activer features i18n, server components, client provider
when-to-use: intégrer next-intl, next.config setup, activer async context, combiner plugins
keywords: createNextIntlPlugin, next.config, request config path, Turbopack, Sentry
priority: medium
requires: installation.md
related: configuration.md, routing-setup.md
---

# next-intl Plugin

## Installation

The plugin wraps Next.js config to enable i18n features.

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

export default withNextIntl({
  // Your Next.js config
})
```

## Custom Request Config Path

```typescript
const withNextIntl = createNextIntlPlugin(
  './modules/cores/i18n/src/services/request.ts'
)
```

## Plugin Features

1. **Automatic Request Config** - Loads `i18n/request.ts` or custom path
2. **Server Components Support** - Enables async `getTranslations`
3. **Client Provider** - Passes messages to client
4. **Middleware Integration** - Works with routing middleware

## Combining with Other Plugins

```typescript
import createNextIntlPlugin from 'next-intl/plugin'
import { withSentryConfig } from '@sentry/nextjs'

const withNextIntl = createNextIntlPlugin()

const config = withNextIntl({
  // Next.js config
})

export default withSentryConfig(config)
```

## Turbopack Support

```typescript
// Turbopack is fully supported in Next.js 16
export default withNextIntl({
  // Turbopack is default in Next.js 16
})
```

## Debug Mode

```typescript
const withNextIntl = createNextIntlPlugin()

export default withNextIntl({
  logging: {
    fetches: { fullUrl: true }
  }
})
```

## TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
