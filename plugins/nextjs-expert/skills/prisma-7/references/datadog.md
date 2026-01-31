---
name: datadog
description: Datadog monitoring integration with Prisma 7
when-to-use: Monitoring Prisma performance and application metrics with Datadog
keywords: Datadog, monitoring, APM, performance metrics, observability
priority: medium
requires: client.md, opentelemetry.md
related: logging.md
---

# Datadog Monitoring with Prisma

Integrate Datadog APM for monitoring Prisma performance.

## Installation

```bash
npm install dd-trace @datadog/browser-rum @datadog/browser-logs
```

---

## Server-Side Configuration

```typescript
// server-instrumentation.ts
import tracer from 'dd-trace'

tracer.init({
  service: 'my-nextjs-app',
  env: process.env.NODE_ENV,
  version: '1.0.0',
  hostname: process.env.DD_AGENT_HOST || 'localhost',
  port: parseInt(process.env.DD_TRACE_AGENT_PORT || '8126'),
  analytics: true,
})

tracer.use('prisma', {
  enabled: true,
})

export default tracer
```

---

## Prisma Client with Datadog

```typescript
// modules/observability/src/interfaces/datadog.interface.ts
/**
 * Datadog span tags
 */
export interface SpanTags {
  'db.operation'?: string
  'db.system'?: string
  'db.status'?: string
  error?: boolean
}

/**
 * Datadog span interface
 */
export interface DatadogSpan {
  setTag(key: string, value: any): void
  finish(): void
}

/**
 * Prisma operation event for Datadog
 */
export interface DatadogPrismaEvent {
  operation: string
  model: string
  args: any
  query: (args: any) => Promise<any>
}
```

```typescript
// modules/observability/src/services/datadog-tracing.service.ts
import type { DatadogPrismaEvent, SpanTags } from '../interfaces/datadog.interface'
import tracer from 'dd-trace'

/**
 * Execute Prisma operation with Datadog tracing
 */
export async function executePrismaWithDatadog<T>(
  event: DatadogPrismaEvent
): Promise<T> {
  const tags: SpanTags = {
    'db.operation': event.operation,
    'db.system': 'prisma',
  }

  const span = tracer.startSpan(`prisma.${event.model}`, { tags })

  try {
    const result = await event.query(event.args)
    span.setTag('db.status', 'success')
    return result
  } catch (error) {
    span.setTag('db.status', 'error')
    span.setTag('error', true)
    throw error
  } finally {
    span.finish()
  }
}
```

```typescript
// modules/cores/db/prisma-with-datadog.ts
import 'dd-trace/init'
import { PrismaClient } from '@prisma/client'
import { executePrismaWithDatadog } from '@/modules/observability/src/services/datadog-tracing.service'
import type { DatadogPrismaEvent } from '@/modules/observability/src/interfaces/datadog.interface'

/**
 * Prisma client with Datadog APM extension
 */
export const prisma = new PrismaClient().$extends({
  query: {
    async $allOperations({ operation, model, args, query }) {
      const event: DatadogPrismaEvent = {
        operation,
        model,
        args,
        query,
      }

      return executePrismaWithDatadog(event)
    },
  },
})
```

---

## API Routes with Custom Metrics

```typescript
// modules/users/src/interfaces/users-api.interface.ts
/**
 * User list API response
 */
export interface UserListAPIResponse {
  id: string
  name: string | null
  email: string | null
}

/**
 * API metrics
 */
export interface APIMetrics {
  duration: number
  userCount: number
  statusCode: number
}
```

```typescript
// modules/users/src/services/user-api.service.ts
import type { UserListAPIResponse, APIMetrics } from '../interfaces/users-api.interface'
import { prisma } from '@/modules/cores/db/prisma-with-datadog'
import tracer from 'dd-trace'

/**
 * Get users with metrics tracking
 */
export async function getUsersWithMetrics(): Promise<{
  users: UserListAPIResponse[]
  metrics: APIMetrics
}> {
  const startTime = Date.now()

  const users = await prisma.user.findMany({
    take: 10,
    select: { id: true, name: true, email: true },
  })

  const duration = Date.now() - startTime

  const metrics: APIMetrics = {
    duration,
    userCount: users.length,
    statusCode: 200,
  }

  // Send custom metrics to Datadog
  tracer.reportMetric('users.fetch.duration', duration)
  tracer.reportMetric('users.count', users.length)

  return { users, metrics }
}
```

```typescript
// app/api/users/route.ts
import tracer from 'dd-trace'
import { getUsersWithMetrics } from '@/modules/users/src/services/user-api.service'

/**
 * GET handler for users endpoint with Datadog tracing
 */
export async function GET() {
  const span = tracer.startSpan('get-users-endpoint')

  try {
    const { users, metrics } = await getUsersWithMetrics()

    span.setTag('user.count', metrics.userCount)
    span.setTag('http.status_code', metrics.statusCode)

    return Response.json(users)
  } catch (error) {
    span.setTag('error', true)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  } finally {
    span.finish()
  }
}
```

---

## Server Actions Tracking

```typescript
// modules/users/src/interfaces/user-actions.interface.ts
/**
 * Create user request
 */
export interface CreateUserRequest {
  name: string
  email: string
}

/**
 * Create user response
 */
export interface CreateUserResponse {
  id: string
  name: string
  email: string
  createdAt: Date
}
```

```typescript
// modules/users/src/services/user-actions.service.ts
import type { CreateUserRequest, CreateUserResponse } from '../interfaces/user-actions.interface'
import { prisma } from '@/modules/cores/db/prisma-with-datadog'

/**
 * Create new user
 */
export async function createUserService(
  request: CreateUserRequest
): Promise<CreateUserResponse> {
  return prisma.user.create({
    data: request,
  })
}
```

```typescript
// app/actions.ts
'use server'

import tracer from 'dd-trace'
import { revalidatePath } from 'next/cache'
import { createUserService } from '@/modules/users/src/services/user-actions.service'
import type { CreateUserRequest } from '@/modules/users/src/interfaces/user-actions.interface'

/**
 * Server action to create user with Datadog tracking
 */
export async function createUserAction(name: string, email: string) {
  const span = tracer.startSpan('create-user-action')

  try {
    const request: CreateUserRequest = { name, email }
    const user = await createUserService(request)

    span.setTag('user.id', user.id)
    span.setTag('action', 'create')

    revalidatePath('/users')
    return user
  } catch (error) {
    span.setTag('error', true)
    throw error
  } finally {
    span.finish()
  }
}
```

---

## Datadog Dashboard Configuration

```typescript
// modules/observability/src/interfaces/datadog-metrics.interface.ts
/**
 * Datadog metric tags
 */
export interface MetricTags {
  [key: string]: string
}

/**
 * Custom metric report
 */
export interface CustomMetricReport {
  metricName: string
  value: number
  tags: MetricTags
}
```

```typescript
// modules/observability/src/services/datadog-metrics.service.ts
import type { MetricTags, CustomMetricReport } from '../interfaces/datadog-metrics.interface'
import tracer from 'dd-trace'

/**
 * Report Prisma operation metrics
 */
export function reportPrismaMetrics(operation: string, duration: number): void {
  const report: CustomMetricReport = {
    metricName: 'prisma.operation.duration',
    value: duration,
    tags: { operation },
  }

  tracer.reportMetric(report.metricName, report.value, {
    tags: Object.entries(report.tags).map(([key, value]) => `${key}:${value}`),
  })
}

/**
 * Report query count metrics
 */
export function reportQueryCount(model: string, count: number): void {
  const report: CustomMetricReport = {
    metricName: 'prisma.query.count',
    value: count,
    tags: { model },
  }

  tracer.reportMetric(report.metricName, report.value, {
    tags: Object.entries(report.tags).map(([key, value]) => `${key}:${value}`),
  })
}
```

---

## Environment Setup

```bash
# .env.local
DD_AGENT_HOST=localhost
DD_TRACE_AGENT_PORT=8126
DD_ENV=development
DD_SERVICE=my-nextjs-app
DD_VERSION=1.0.0
```

---

## Best Practices

1. **Use extensions** - Automatically track all Prisma operations
2. **Set meaningful tags** - Add operation, model, and status tags
3. **Report metrics** - Send custom metrics for business-relevant data
4. **Monitor errors** - Tag errors and exceptions for alerting
5. **Set up dashboards** - Create Datadog dashboards for key metrics
