---
name: connection-pooling
description: Prisma 7 connection pooling with PgBouncer, Supabase, Neon
when-to-use: Serverless deployments, high concurrency, connection limits
keywords: pool, connection, PgBouncer, Supabase, Neon, serverless
priority: high
requires: driver-adapters.md
related: deployment.md, accelerate.md
---

# Connection Pooling

Connection pool configuration with SOLID Next.js principles.

## Driver-Level Pool Configuration

```typescript
// lib/db/pg-pool.ts
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import type { PrismaClient } from '@prisma/client'

/**
 * @description Creates PostgreSQL connection pool for Prisma
 * @returns PrismaClient Configured with custom pool
 * @example
 * const prisma = createPgPoolClient()
 */
export function createPgPoolClient(): PrismaClient {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10, // Maximum connections
    idleTimeoutMillis: 30000, // Close idle after 30s
    connectionTimeoutMillis: 5000, // Connection timeout
  })

  const adapter = new PrismaPg({ pool })
  return new PrismaClient({ adapter })
}

export const prisma = createPgPoolClient()
```

---

## Serverless Configuration (Minimal Connections)

```typescript
// lib/db/serverless-pool.ts
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import type { PrismaClient } from '@prisma/client'

/**
 * @description Creates serverless-optimized connection pool
 * @returns PrismaClient With minimal connection overhead
 * @example
 * const prisma = createServerlessPoolClient()
 */
export function createServerlessPoolClient(): PrismaClient {
  // ✅ GOOD: Minimize connections for serverless
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Single connection per Lambda/Edge instance
    idleTimeoutMillis: 10000, // Close idle quickly
    connectionTimeoutMillis: 5000,
  })

  const adapter = new PrismaPg({ pool })
  return new PrismaClient({ adapter })
}
```

---

## PgBouncer Setup

```env
# .env.local - PgBouncer pooler (transaction mode)
DATABASE_URL="postgresql://user:pass@pgbouncer:6432/db?pgbouncer=true"

# Direct URL for migrations (bypass pooler)
DIRECT_URL="postgresql://user:pass@postgres:5432/db"
```

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // For migrations
}

model User {
  id String @id @default(cuid())
  // ...
}
```

---

## Supabase Pooler Setup

```env
# .env.local - Supabase Supavisor pooler
# Port 6543 = pooler (transaction mode, recommended)
DATABASE_URL="postgresql://postgres.[project-id]:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Port 5432 = direct connection (for migrations)
DIRECT_URL="postgresql://postgres.[project-id]:password@aws-0-region.pooler.supabase.com:5432/postgres"
```

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## Neon Serverless Adapter

```typescript
// lib/db/neon-pool.ts
import { neon, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import type { PrismaClient } from '@prisma/client'

/**
 * @description Creates Neon serverless pool with HTTP connections
 * @returns PrismaClient Optimized for Neon serverless
 * @example
 * const prisma = createNeonPoolClient()
 */
export function createNeonPoolClient(): PrismaClient {
  // ✅ GOOD: Enable Neon connection pooling
  neonConfig.poolConnections = true
  neonConfig.useSecureWebSocket = true

  const sql = neon(process.env.DATABASE_URL || '')
  const adapter = new PrismaNeon(sql)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? [{ level: 'query', emit: 'event' }]
      : [],
  })
}

export const prisma = createNeonPoolClient()
```

---

## Connection String Options & Parameters

```typescript
// lib/db/connection-config.ts
import type { PoolConfig } from 'pg'

/** @description PostgreSQL connection pool configuration */
export const poolConfigs = {
  /** For serverless functions with minimal overhead */
  serverless: {
    max: 1,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  } satisfies Partial<PoolConfig>,

  /** For traditional servers with moderate load */
  traditional: {
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  } satisfies Partial<PoolConfig>,

  /** For high-traffic production servers */
  highTraffic: {
    max: 20,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 15000,
  } satisfies Partial<PoolConfig>,
}

/**
 * @description Connection string configurations
 */
export const connectionStrings = {
  /** Standard PostgreSQL with connection limits */
  postgresql:
    'postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=30&connect_timeout=10',

  /** With SSL requirement */
  postgresqlSSL:
    'postgresql://user:pass@host:5432/db?sslmode=require',

  /** PgBouncer transaction mode */
  pgbouncer:
    'postgresql://user:pass@host:6432/db?pgbouncer=true&connection_limit=1',
}
```

---

## Graceful Shutdown

```typescript
// lib/db/shutdown.ts
import type { PrismaClient } from '@prisma/client'

/**
 * @description Registers graceful shutdown handlers
 * @param prisma PrismaClient instance
 * @returns void
 */
export function registerShutdownHandlers(prisma: PrismaClient): void {
  // ✅ GOOD: Handle normal process exit
  process.on('beforeExit', async () => {
    console.log('[DB] Closing connections...')
    await prisma.$disconnect()
  })

  // ✅ GOOD: Handle termination signals
  process.on('SIGTERM', async () => {
    console.log('[DB] SIGTERM received, closing...')
    await prisma.$disconnect()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    console.log('[DB] SIGINT received, closing...')
    await prisma.$disconnect()
    process.exit(0)
  })
}

/**
 * @description Wrapper for serverless function cleanup
 * @param handler Async handler function
 * @returns Promise Handler result
 */
export async function withDatabaseCleanup<T>(
  handler: () => Promise<T>,
  prisma: PrismaClient
): Promise<T> {
  try {
    // ✅ GOOD: Execute handler
    return await handler()
  } finally {
    // ✅ GOOD: Always disconnect
    await prisma.$disconnect()
  }
}
```

---

## Pool Sizing Configuration Guide

| Environment | Max Connections | Idle Timeout | Reason |
|-------------|-----------------|--------------|--------|
| **Serverless** | 1-3 | 5-10s | Single instance, quick cleanup |
| **Edge** | 1 | 5s | HTTP-based, minimal memory |
| **Traditional** | 10-20 | 30s | Persistent connections |
| **High Traffic** | 20-50 | 60s | Multiple concurrent requests |

### Configuration Selection

```typescript
// Choose pool config based on environment
const poolConfig =
  process.env.RUNTIME === 'edge' ? poolConfigs.serverless :
  process.env.DEPLOYMENT === 'production' && process.env.TRAFFIC_LEVEL === 'high' ? poolConfigs.highTraffic :
  poolConfigs.traditional
```

---

## Database Health Monitoring

```typescript
// lib/db/health-check.ts
import type { PrismaClient } from '@prisma/client'

/**
 * @description Performs database health check
 * @param prisma PrismaClient instance
 * @returns Promise<boolean> Health status
 */
export async function checkDatabaseHealth(
  prisma: PrismaClient
): Promise<boolean> {
  try {
    // ✅ GOOD: Simple health check query
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('[DB_HEALTH] Connection failed:', error)
    return false
  }
}

/**
 * @description Monitors pool usage and logs warnings
 * @param prisma PrismaClient instance
 */
export async function monitorPoolUsage(
  prisma: PrismaClient
): Promise<void> {
  try {
    const result = await prisma.$queryRaw<any[]>`
      SELECT
        count(*) as total,
        count(*) FILTER (WHERE state = 'active') as active,
        count(*) FILTER (WHERE state = 'idle') as idle
      FROM pg_stat_activity
      WHERE datname = current_database()
    `

    const status = result[0]
    console.log('[DB_POOL]', {
      total: status.total,
      active: status.active,
      idle: status.idle,
    })
  } catch (error) {
    console.warn('[DB_POOL] Monitoring failed:', error)
  }
}
```

---

## Best Practices (SOLID Compliance)

### Configuration Principles
1. **Use pooler for serverless** - PgBouncer, Supavisor, or Neon
2. **Minimize connection count** - 1-3 for serverless, scale horizontally
3. **Set appropriate timeouts** - Prevent connection leaks and exhaustion
4. **Use directUrl for migrations** - Bypass pooler to avoid issues
5. **Monitor pool usage** - Alert if approaching limits

### SOLID Application
- **S**: Separate pool config, health checks, shutdown
- **O**: Add monitoring without changing pool logic
- **L**: Different adapters (pg, Neon) are interchangeable
- **I**: Focused config objects (PoolConfig, ConnectionString)
- **D**: Handlers depend on abstraction (PrismaClient type)
