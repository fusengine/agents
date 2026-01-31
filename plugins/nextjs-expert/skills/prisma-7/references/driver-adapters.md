---
name: driver-adapters
description: Prisma 7 driver adapters for PostgreSQL, MySQL, SQLite
when-to-use: Configuring database drivers and connection pooling
keywords: adapter, pg, mariadb, sqlite, neon, planetscale, connection
priority: critical
requires: installation.md
related: client.md
---

# Driver Adapters

Required driver configuration in Prisma 7.

## PostgreSQL (pg)

```bash
bun add @prisma/adapter-pg pg
```

```typescript
// modules/cores/db/src/adapters/pgAdapter.ts
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Create PostgreSQL adapter with pg driver
 * Requires DATABASE_URL environment variable
 * @module modules/cores/db/src/adapters
 * @returns PrismaPg adapter instance
 */
export function createPgAdapter(): PrismaPg {
  return new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  })
}
```

```typescript
// modules/cores/db/src/prisma.ts
import { PrismaClient } from '@prisma/client'
import { createPgAdapter } from './adapters/pgAdapter'

const adapter = createPgAdapter()

/**
 * Prisma client with PostgreSQL adapter
 * @module modules/cores/db/src
 */
export const prisma = new PrismaClient({ adapter })
```

---

## PostgreSQL with Pool

```typescript
// modules/cores/db/src/adapters/pgPoolAdapter.ts
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Connection pool configuration interface
 * @module modules/cores/db/src/adapters
 */
export interface PoolConfig {
  connectionString: string
  max: number
  idleTimeoutMillis: number
}

/**
 * Create PostgreSQL adapter with connection pooling
 * Reuses connections for better performance
 * @module modules/cores/db/src/adapters
 */
export function createPgPoolAdapter(
  config: PoolConfig = {
    connectionString: process.env.DATABASE_URL!,
    max: 10,
    idleTimeoutMillis: 30000,
  }
): PrismaPg {
  const pool = new Pool(config)
  return new PrismaPg({ pool })
}
```

```typescript
// modules/cores/db/src/prisma.ts
import type { PoolConfig } from './adapters/pgPoolAdapter'
import { createPgPoolAdapter } from './adapters/pgPoolAdapter'

const adapter = createPgPoolAdapter({
  connectionString: process.env.DATABASE_URL!,
  max: 10,
  idleTimeoutMillis: 30000,
})

export const prisma = new PrismaClient({ adapter })
```

---

## Neon (Serverless PostgreSQL)

```bash
bun add @prisma/adapter-neon @neondatabase/serverless
```

```typescript
// modules/cores/db/src/adapters/neonAdapter.ts
import { neon } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'

/**
 * Create Neon serverless PostgreSQL adapter
 * Optimal for Vercel Edge Functions and serverless
 * @module modules/cores/db/src/adapters
 * @returns PrismaNeon adapter instance
 */
export function createNeonAdapter(): PrismaNeon {
  const sql = neon(process.env.DATABASE_URL!)
  return new PrismaNeon(sql)
}
```

```typescript
// modules/cores/db/src/prisma.ts
import { createNeonAdapter } from './adapters/neonAdapter'

const adapter = createNeonAdapter()

/**
 * Prisma client with Neon serverless adapter
 * @module modules/cores/db/src
 */
export const prisma = new PrismaClient({ adapter })
```

---

## PlanetScale (MySQL)

```bash
bun add @prisma/adapter-planetscale @planetscale/database
```

```typescript
// modules/cores/db/src/adapters/planetscaleAdapter.ts
import { Client } from '@planetscale/database'
import { PrismaPlanetScale } from '@prisma/adapter-planetscale'

/**
 * Create PlanetScale MySQL adapter
 * Serverless MySQL database for edge deployments
 * @module modules/cores/db/src/adapters
 * @returns PrismaPlanetScale adapter instance
 */
export function createPlanetScaleAdapter(): PrismaPlanetScale {
  const client = new Client({
    url: process.env.DATABASE_URL,
  })
  return new PrismaPlanetScale(client)
}
```

```typescript
// modules/cores/db/src/prisma.ts
import { createPlanetScaleAdapter } from './adapters/planetscaleAdapter'

const adapter = createPlanetScaleAdapter()

/**
 * Prisma client with PlanetScale MySQL adapter
 * @module modules/cores/db/src
 */
export const prisma = new PrismaClient({ adapter })
```

---

## SQLite (better-sqlite3)

```bash
bun add @prisma/adapter-better-sqlite3 better-sqlite3
```

```typescript
// modules/cores/db/src/adapters/sqliteAdapter.ts
import Database from 'better-sqlite3'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

/**
 * Create SQLite adapter with better-sqlite3 driver
 * Suitable for development and small-scale applications
 * @module modules/cores/db/src/adapters
 * @param dbPath Path to SQLite database file
 * @returns PrismaBetterSqlite3 adapter instance
 */
export function createSqliteAdapter(dbPath: string = 'app.db'): PrismaBetterSqlite3 {
  const database = new Database(dbPath)
  return new PrismaBetterSqlite3(database)
}
```

```typescript
// modules/cores/db/src/prisma.ts
import { createSqliteAdapter } from './adapters/sqliteAdapter'

const adapter = createSqliteAdapter()

/**
 * Prisma client with SQLite adapter
 * @module modules/cores/db/src
 */
export const prisma = new PrismaClient({ adapter })
```

---

## Turso (LibSQL)

```bash
bun add @prisma/adapter-libsql @libsql/client
```

```typescript
// modules/cores/db/src/adapters/libsqlAdapter.ts
import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

/**
 * Turso/LibSQL configuration interface
 * @module modules/cores/db/src/adapters
 */
export interface LibSQLConfig {
  url: string
  authToken?: string
}

/**
 * Create Turso LibSQL adapter
 * Open-source SQLite fork optimized for edge
 * @module modules/cores/db/src/adapters
 */
export function createLibSQLAdapter(
  config: LibSQLConfig = {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }
): PrismaLibSQL {
  const client = createClient(config)
  return new PrismaLibSQL(client)
}
```

```typescript
// modules/cores/db/src/prisma.ts
import type { LibSQLConfig } from './adapters/libsqlAdapter'
import { createLibSQLAdapter } from './adapters/libsqlAdapter'

const adapter = createLibSQLAdapter()

/**
 * Prisma client with Turso LibSQL adapter
 * @module modules/cores/db/src
 */
export const prisma = new PrismaClient({ adapter })
```

---

## Cloudflare D1

```typescript
// modules/cores/db/src/adapters/d1Adapter.ts
import { PrismaD1 } from '@prisma/adapter-d1'

/**
 * Cloudflare D1 environment interface
 * @module modules/cores/db/src/adapters
 */
export interface D1Env {
  DB: D1Database
}

/**
 * Create Cloudflare D1 adapter
 * SQLite database for Cloudflare Workers
 * @module modules/cores/db/src/adapters
 */
export function createD1Adapter(db: D1Database): PrismaD1 {
  return new PrismaD1(db)
}
```

```typescript
// modules/cores/db/src/edge-d1.ts
import { PrismaClient } from '@prisma/client'
import { createD1Adapter } from './adapters/d1Adapter'
import type { D1Env } from './adapters/d1Adapter'

/**
 * Create Prisma client for Cloudflare D1
 * Use in Cloudflare Workers
 * @module modules/cores/db/src
 */
export function createD1Client(env: D1Env) {
  const adapter = createD1Adapter(env.DB)
  return new PrismaClient({ adapter })
}

// Cloudflare Worker example
export default {
  async fetch(request: Request, env: D1Env) {
    const prisma = createD1Client(env)
    const users = await prisma.user.findMany()
    return Response.json(users)
  },
}
```

---

## Available Adapters

| Database | Adapter | Package |
|----------|---------|---------|
| PostgreSQL | `PrismaPg` | `@prisma/adapter-pg` |
| Neon | `PrismaNeon` | `@prisma/adapter-neon` |
| PlanetScale | `PrismaPlanetScale` | `@prisma/adapter-planetscale` |
| MySQL | `PrismaMariaDB` | `@prisma/adapter-mariadb` |
| SQLite | `PrismaBetterSqlite3` | `@prisma/adapter-better-sqlite3` |
| Turso | `PrismaLibSQL` | `@prisma/adapter-libsql` |
| D1 | `PrismaD1` | `@prisma/adapter-d1` |

---

## Best Practices

1. **Always use adapter** - Required in Prisma 7
2. **Configure pooling** - Set max connections
3. **Use env variables** - Never hardcode credentials
4. **Match adapter to host** - Neon for Vercel, etc.
5. **Test locally** - Use same adapter in dev/prod
