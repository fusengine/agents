---
name: community-adapters
description: Community-maintained adapters for serverless, edge, and specialized database platforms
when-to-use: serverless platforms, edge functions, managed services, turso, planetscale, neon, d1
keywords: community adapters, turso, planetscale, neon, supabase, d1, cloudflare, edge, serverless
priority: medium
requires: installation.md, server-config.md
related: adapters/prisma.md, adapters/drizzle.md, concepts/database.md
---

# Better Auth Community Adapters

## When to Use

- Serverless database platforms
- Edge-compatible databases
- Managed database services
- Custom database requirements

## Why Community Adapters

| Built-in | Community |
|----------|-----------|
| Standard databases | Specialized platforms |
| Self-managed | Managed services |
| Traditional hosting | Edge/serverless |
| General purpose | Optimized for platform |

## Available Community Adapters

| Adapter | Database | Package |
|---------|----------|---------|
| Turso | LibSQL | `@better-auth/turso` |
| PlanetScale | MySQL | `@better-auth/planetscale` |
| Neon | PostgreSQL | `@better-auth/neon` |
| Supabase | PostgreSQL | `@better-auth/supabase` |
| Cloudflare D1 | SQLite | `@better-auth/d1` |
| Xata | PostgreSQL | `@better-auth/xata` |
| CockroachDB | PostgreSQL | Use `prismaAdapter` |

## Turso Example

```typescript
import { betterAuth } from "better-auth"
import { tursoAdapter } from "@better-auth/turso"
import { createClient } from "@libsql/client"

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})

export const auth = betterAuth({
  database: tursoAdapter(turso)
})
```

## Cloudflare D1 Example

```typescript
import { betterAuth } from "better-auth"
import { d1Adapter } from "@better-auth/d1"

export const auth = betterAuth({
  database: d1Adapter(env.DB)
})
```

## Creating Custom Adapter

```typescript
import type { Adapter } from "better-auth"

export function customAdapter(db: YourDB): Adapter {
  return {
    create: async (model, data) => { /* ... */ },
    findOne: async (model, where) => { /* ... */ },
    findMany: async (model, where) => { /* ... */ },
    update: async (model, where, data) => { /* ... */ },
    delete: async (model, where) => { /* ... */ }
  }
}
```

## Contributing Adapters

1. Fork `better-auth/better-auth`
2. Create adapter in `packages/adapters/`
3. Add tests
4. Submit PR
