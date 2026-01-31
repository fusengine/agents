---
name: instrumentation
description: Error tracking and monitoring with Sentry, OpenTelemetry
when-to-use: error tracking, performance monitoring, observability
keywords: Sentry, OpenTelemetry, instrumentation, error tracking
priority: low
related: devtools-mcp.md, security.md
---

# Instrumentation & Monitoring

## When to Use

- Error tracking (Sentry)
- OpenTelemetry tracing
- Performance monitoring
- Server/client error capture

## Why Instrumentation

| File | Purpose |
|------|---------|
| instrumentation.ts | Server startup |
| instrumentation-client.ts | Client errors |
| Both | Full observability |

## instrumentation.ts (Server)
```typescript
// instrumentation.ts (project root)
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation
    await import('./sentry.edge.config')
  }
}
```

## instrumentation-client.ts (Client)
```typescript
// instrumentation-client.ts (project root)
export function onRequestError(err, request, context) {
  // Log client-side errors
  console.error('Client error:', err)

  // Send to error tracking
  fetch('/api/errors', {
    method: 'POST',
    body: JSON.stringify({ error: err.message, url: request.url }),
  })
}
```

## OpenTelemetry Setup
```bash
bun add @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
```

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const sdk = new NodeSDK({
      instrumentations: [getNodeAutoInstrumentations()],
    })
    sdk.start()
  }
}
```

## Sentry Integration
```bash
bun add @sentry/nextjs
bunx @sentry/wizard@latest -i nextjs
```

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
}

export const onRequestError = Sentry.captureRequestError
```

## Enable Instrumentation
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
}
```

## Error Tracking
```typescript
// instrumentation-client.ts
export function onRequestError(err, request, context) {
  Sentry.captureException(err, {
    extra: { url: request.url, context },
  })
}
```
