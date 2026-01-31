---
name: logging
description: Prisma 7 logging, debugging, and observability
when-to-use: Debugging queries, monitoring performance, tracing
keywords: log, debug, query, metrics, OpenTelemetry, tracing
priority: medium
requires: client.md
related: optimization.md
---

# Logging & Observability

Logging and monitoring patterns for Prisma 7.

## Basic Logging

```typescript
// modules/cores/db/prisma.ts
import { PrismaClient } from '../generated/prisma/client'

/**
 * Initialize Prisma Client with logging configuration
 * All log levels enabled for development
 */
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
})

/**
 * Alternative: Configure specific log levels with emit strategy
 * 'stdout': logs to console
 * 'event': logs to event emitters (see next section)
 */
const prismaWithEmit = new PrismaClient({
  adapter,
  log: [
    { level: 'query', emit: 'stdout' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
})

export { prisma, prismaWithEmit }
```

---

## Query Event Logging

```typescript
// modules/cores/db/prisma.ts
import { PrismaClient } from '../generated/prisma/client'

/**
 * Configure Prisma with event-based logging
 * Enables custom event handlers for queries and errors
 */
const prisma = new PrismaClient({
  adapter,
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
})

/**
 * Log all database queries with timing information
 * @param event - Query event with query, params, duration
 */
prisma.$on('query', (e) => {
  console.log('Query:', e.query)
  console.log('Params:', e.params)
  console.log('Duration:', e.duration, 'ms')
})

/**
 * Log all database errors for debugging
 * @param event - Error event with error message
 */
prisma.$on('error', (e) => {
  console.error('Database error:', e.message)
})

export { prisma }
```

---

## Slow Query Detection

```typescript
// modules/cores/db/monitoring.ts
import type { PrismaClient } from '../generated/prisma/client'

/** Queries slower than 100ms are considered slow */
const SLOW_QUERY_THRESHOLD = 100 // ms

/**
 * Setup slow query monitoring
 * Logs queries that exceed performance threshold
 * @param prisma - Prisma client instance
 */
export function setupSlowQueryMonitoring(prisma: PrismaClient): void {
  prisma.$on('query', (e) => {
    if (e.duration > SLOW_QUERY_THRESHOLD) {
      console.warn(`[SLOW QUERY] ${e.duration}ms`)
      console.warn('Query:', e.query)
      console.warn('Params:', e.params)
    }
  })
}
```

---

## Development Only Logging

```typescript
// modules/cores/db/prisma.ts
import { PrismaClient } from '../generated/prisma/client'

/** Environment check for dev mode */
const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Initialize Prisma with environment-aware logging
 * Development: verbose query logging
 * Production: errors only
 */
const prisma = new PrismaClient({
  adapter,
  log: isDevelopment
    ? [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
      ]
    : [{ level: 'error', emit: 'stdout' }],
})

// Only add verbose logging in development
if (isDevelopment) {
  /**
   * Log query execution time (development only)
   * Helps identify performance issues during development
   */
  prisma.$on('query', (e) => {
    console.log(`[${e.duration}ms] ${e.query}`)
  })
}

export { prisma }
```

---

## OpenTelemetry Integration

```typescript
import { PrismaInstrumentation } from '@prisma/instrumentation'
import { registerInstrumentations } from '@opentelemetry/instrumentation'

registerInstrumentations({
  instrumentations: [new PrismaInstrumentation()],
})

const prisma = new PrismaClient({ adapter })
```

---

## Custom Logger

```typescript
// modules/cores/db/logger.ts
import pino from 'pino'
import type { PrismaClient } from '../generated/prisma/client'

/** Structured logger instance (pino) */
const logger = pino({ level: 'info' })

/**
 * Configure Prisma with structured logging using pino
 * Emits events to custom logger instead of console
 * @param prisma - Prisma client instance
 */
export function setupStructuredLogging(prisma: PrismaClient): void {
  // Enable event emission for all log levels
  prisma.$on('query', (e) => {
    logger.debug({ query: e.query, duration: e.duration }, 'Database query')
  })

  prisma.$on('error', (e) => {
    logger.error({ message: e.message }, 'Database error')
  })

  prisma.$on('warn', (e) => {
    logger.warn({ message: e.message }, 'Database warning')
  })
}

export { logger }
```

---

## Query Metrics

```typescript
// modules/cores/db/interfaces/query-metrics.ts
/**
 * Query performance metrics
 * Tracks aggregated statistics about database queries
 */
export interface QueryMetrics {
  count: number
  totalDuration: number
  avgDuration: number
  slowQueries: number
}

// modules/cores/db/metrics.ts
import type { QueryMetrics } from './interfaces/query-metrics'
import type { PrismaClient } from '../generated/prisma/client'

/** Performance metrics accumulator */
const metrics: QueryMetrics = {
  count: 0,
  totalDuration: 0,
  avgDuration: 0,
  slowQueries: 0,
}

/**
 * Setup metrics collection on Prisma client
 * Tracks all queries and aggregates performance data
 * @param prisma - Prisma client instance
 */
export function setupMetricsCollection(prisma: PrismaClient): void {
  prisma.$on('query', (e) => {
    metrics.count++
    metrics.totalDuration += e.duration
    metrics.avgDuration = metrics.totalDuration / metrics.count
    if (e.duration > 100) metrics.slowQueries++
  })
}

/**
 * Retrieve current query metrics snapshot
 * @returns Copy of current metrics
 */
export function getQueryMetrics(): QueryMetrics {
  return { ...metrics }
}
```

---

## Best Practices

1. **Event-based in prod** - Use emit: 'event' not stdout
2. **Track slow queries** - Set threshold (100ms)
3. **Structured logging** - Use pino/winston
4. **Development verbose** - More logging in dev
5. **OpenTelemetry** - For distributed tracing
