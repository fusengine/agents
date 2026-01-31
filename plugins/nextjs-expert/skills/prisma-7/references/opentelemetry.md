---
name: opentelemetry
description: OpenTelemetry tracing integration with Prisma 7
when-to-use: Adding observability and distributed tracing to Prisma queries
keywords: OpenTelemetry, tracing, observability, spans, monitoring
priority: medium
requires: client.md
related: datadog.md, logging.md
---

# OpenTelemetry Tracing with Prisma

Integrate OpenTelemetry for distributed tracing of Prisma queries.

## Installation

```bash
npm install @opentelemetry/api @opentelemetry/sdk-node \
  @opentelemetry/auto @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/resources @opentelemetry/semantic-conventions \
  @opentelemetry/instrumentation-prisma
```

---

## Initialize Tracing

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'my-app',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  })
)

const sdk = new NodeSDK({
  resource,
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
})

sdk.start()

console.log('Tracing initialized')

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((log) => console.log('Error terminating tracing', log))
    .finally(() => process.exit(0))
})
```

---

## Prisma Extension with Tracing

```typescript
// modules/observability/src/interfaces/tracing.interface.ts
/**
 * Trace span context
 */
export interface TraceSpan {
  startSpan(name: string): Span
}

/**
 * Span operations
 */
export interface Span {
  addEvent(name: string): void
  recordException(error: Error): void
  end(): void
}

/**
 * Prisma query operation event
 */
export interface PrismaQueryEvent {
  operation: string
  model: string
  args: any
  query: (args: any) => Promise<any>
}
```

```typescript
// modules/observability/src/services/prisma-tracing.service.ts
import type { Span, PrismaQueryEvent, TraceSpan } from '../interfaces/tracing.interface'
import { trace } from '@opentelemetry/api'

/**
 * Create tracer for Prisma operations
 */
function getTracer(): TraceSpan {
  return trace.getTracer('prisma')
}

/**
 * Create and manage span for Prisma operation
 */
export async function executeWithTracing<T>(
  event: PrismaQueryEvent
): Promise<T> {
  const tracer = getTracer()
  const span = tracer.startSpan(`prisma.${event.model}.${event.operation}`)

  try {
    const result = await event.query(event.args)
    span.addEvent('success')
    return result
  } catch (error) {
    span.recordException(error as Error)
    throw error
  } finally {
    span.end()
  }
}
```

```typescript
// modules/cores/db/prisma-with-tracing.ts
import { PrismaClient } from '@prisma/client'
import { executeWithTracing } from '@/modules/observability/src/services/prisma-tracing.service'
import type { PrismaQueryEvent } from '@/modules/observability/src/interfaces/tracing.interface'

/**
 * Prisma client with OpenTelemetry tracing extension
 */
export const prisma = new PrismaClient().$extends({
  query: {
    async $allOperations({ operation, model, args, query }) {
      const event: PrismaQueryEvent = {
        operation,
        model,
        args,
        query,
      }

      return executeWithTracing(event)
    },
  },
})
```

---

## Manual Span Creation

```typescript
// modules/users/src/interfaces/user-tracing.interface.ts
/**
 * User list response
 */
export interface UserListResponse {
  id: string
  name: string | null
  email: string | null
}
```

```typescript
// modules/users/src/services/user-list.service.ts
import { prisma } from '@/modules/cores/db/prisma-with-tracing'
import type { UserListResponse } from '../interfaces/user-tracing.interface'

/**
 * Get list of users
 */
export async function listUsers(): Promise<UserListResponse[]> {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
  })
}
```

```typescript
// app/api/users/route.ts
import { trace } from '@opentelemetry/api'
import { listUsers } from '@/modules/users/src/services/user-list.service'

const tracer = trace.getTracer('api')

/**
 * GET handler to fetch users
 */
export async function GET() {
  const span = tracer.startSpan('get-users')

  try {
    const users = await listUsers()
    span.setAttribute('user.count', users.length)
    return Response.json(users)
  } finally {
    span.end()
  }
}
```

---

## With Server Actions

```typescript
// modules/posts/src/interfaces/post-tracing.interface.ts
/**
 * Create post request
 */
export interface CreatePostRequest {
  title: string
  content: string
  userId: string
}

/**
 * Create post response
 */
export interface CreatePostResponse {
  id: string
  title: string
  content: string
  userId: string
  createdAt: Date
}
```

```typescript
// modules/posts/src/services/post-traced.service.ts
import { prisma } from '@/modules/cores/db/prisma-with-tracing'
import type { CreatePostRequest, CreatePostResponse } from '../interfaces/post-tracing.interface'

/**
 * Create new post
 */
export async function createPostService(
  request: CreatePostRequest
): Promise<CreatePostResponse> {
  return prisma.post.create({
    data: request,
  })
}
```

```typescript
// app/actions.ts
'use server'

import { trace } from '@opentelemetry/api'
import { createPostService } from '@/modules/posts/src/services/post-traced.service'
import type { CreatePostRequest } from '@/modules/posts/src/interfaces/post-tracing.interface'
import { revalidatePath } from 'next/cache'

const tracer = trace.getTracer('actions')

/**
 * Server action to create post with tracing
 */
export async function createPostAction(title: string, content: string, userId: string) {
  const span = tracer.startSpan('create-post')

  try {
    const request: CreatePostRequest = { title, content, userId }
    const post = await createPostService(request)

    span.setAttribute('post.id', post.id)
    revalidatePath('/posts')
    return post
  } finally {
    span.end()
  }
}
```

---

## Jaeger UI Integration

```typescript
// next.config.js
module.exports = {
  env: {
    OTEL_EXPORTER_OTLP_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318',
  },
}
```

---

## Best Practices

1. **Use extensions** - Automatically trace all Prisma operations
2. **Set attributes** - Add contextual data to spans
3. **Record exceptions** - Log errors in spans for debugging
4. **Use consistent tracer** - Create tracer once per module
5. **Configure sampling** - Sample high-volume operations to reduce overhead
