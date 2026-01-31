---
name: extensions
description: Prisma 7 Client Extensions for custom methods and middleware
when-to-use: Adding custom methods, soft delete, audit logging
keywords: $extends, model, client, query, result, middleware
priority: medium
requires: client.md
related: queries.md
---

# Client Extensions

Extend PrismaClient with custom functionality.

## Model Extension

```typescript
// modules/cores/db/src/extensions/modelExtension.ts
import { Prisma } from '@prisma/client'

/**
 * Model extension for custom user query methods
 * Implements single responsibility pattern for custom queries
 * @module modules/cores/db/src/extensions
 */
export const modelExtension = Prisma.defineExtension({
  model: {
    user: {
      /**
       * Find user by email address
       * @param email User email to search for
       */
      async findByEmail(email: string) {
        return this.findUnique({
          where: { email },
        })
      },

      /**
       * Find all active users
       */
      async findActive() {
        return this.findMany({
          where: { status: 'ACTIVE' },
        })
      },
    },
  },
})
```

```typescript
// modules/cores/db/src/prisma.ts
import { PrismaClient } from '@prisma/client'
import { modelExtension } from './extensions/modelExtension'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

/**
 * Prisma client with model extensions
 * @module modules/cores/db/src
 */
export const prisma = new PrismaClient({ adapter }).$extends(
  modelExtension
)

// Usage
const user = await prisma.user.findByEmail('alice@example.com')
const activeUsers = await prisma.user.findActive()
```

---

## Query Extension (Soft Delete)

```typescript
// modules/cores/db/src/extensions/softDeleteExtension.ts
import { Prisma } from '@prisma/client'

/**
 * Query extension for soft delete pattern
 * Filters deleted records from all queries automatically
 * @module modules/cores/db/src/extensions
 */
export const softDeleteExtension = Prisma.defineExtension({
  query: {
    user: {
      /**
       * Auto-filter deleted records from findMany queries
       */
      async findMany({ args, query }) {
        args.where = {
          ...args.where,
          deletedAt: null,
        }
        return query(args)
      },

      /**
       * Replace hard delete with soft delete (sets deletedAt)
       */
      async delete({ args, query }) {
        return this.update({
          where: args.where,
          data: { deletedAt: new Date() },
        })
      },
    },
  },
})
```

```typescript
// modules/cores/db/src/prisma.ts
export const prisma = new PrismaClient({ adapter }).$extends(
  softDeleteExtension
)
```

---

## Result Extension (Computed Fields)

```typescript
// modules/cores/db/src/extensions/computedFieldsExtension.ts
import { Prisma } from '@prisma/client'

/**
 * Result extension for computed/virtual fields
 * Adds derived properties to query results without database storage
 * @module modules/cores/db/src/extensions
 */
export const computedFieldsExtension = Prisma.defineExtension({
  result: {
    user: {
      /**
       * Virtual fullName field combining firstName and lastName
       */
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`
        },
      },

      /**
       * Virtual isAdmin field based on role
       */
      isAdmin: {
        needs: { role: true },
        compute(user) {
          return user.role === 'ADMIN'
        },
      },
    },
  },
})

// Usage
export async function getUserWithComputed(id: string) {
  const prisma = new PrismaClient({ adapter }).$extends(
    computedFieldsExtension
  )

  const user = await prisma.user.findUnique({
    where: { id },
  })

  console.log(user?.fullName) // "John Doe"
  console.log(user?.isAdmin)  // true
  return user
}
```

---

## Client Extension

```typescript
// modules/cores/db/src/extensions/healthCheckExtension.ts
import { Prisma } from '@prisma/client'

/**
 * Health check interface for client extension
 * @module modules/cores/db/src/extensions
 */
export interface HealthStatus {
  status: 'healthy' | 'unhealthy'
}

/**
 * Client extension for database health checks
 * Adds health check method to PrismaClient
 * @module modules/cores/db/src/extensions
 */
export const healthCheckExtension = Prisma.defineExtension({
  client: {
    /**
     * Check database connection health
     */
    async $healthCheck(): Promise<HealthStatus> {
      try {
        await this.$queryRaw`SELECT 1`
        return { status: 'healthy' }
      } catch {
        return { status: 'unhealthy' }
      }
    },
  },
})

// Usage
export async function checkHealth() {
  const prisma = new PrismaClient({ adapter }).$extends(
    healthCheckExtension
  )
  const health = await prisma.$healthCheck()
  return health
}
```

---

## Audit Logging Extension

```typescript
// modules/cores/db/src/extensions/auditExtension.ts
import { Prisma } from '@prisma/client'

/**
 * Audit log entry interface
 * @module modules/cores/db/src/extensions
 */
export interface AuditLogEntry {
  model: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  data: unknown
  timestamp: Date
}

/**
 * Log audit event to database or external service
 * @module modules/cores/db/src/extensions
 */
async function logAudit(
  model: string,
  action: string,
  data: unknown
): Promise<void> {
  const entry: AuditLogEntry = {
    model,
    action: action as 'CREATE' | 'UPDATE' | 'DELETE',
    data,
    timestamp: new Date(),
  }
  console.log(`[AUDIT] ${model}.${action}:`, entry)
}

/**
 * Query extension for automatic audit logging
 * Logs all CREATE, UPDATE, DELETE operations across all models
 * @module modules/cores/db/src/extensions
 */
export const auditExtension = Prisma.defineExtension({
  query: {
    $allModels: {
      /**
       * Log create operations
       */
      async create({ model, args, query }) {
        const result = await query(args)
        await logAudit(model, 'CREATE', result)
        return result
      },

      /**
       * Log update operations
       */
      async update({ model, args, query }) {
        const result = await query(args)
        await logAudit(model, 'UPDATE', result)
        return result
      },

      /**
       * Log delete operations
       */
      async delete({ model, args, query }) {
        const result = await query(args)
        await logAudit(model, 'DELETE', result)
        return result
      },
    },
  },
})
```

---

## Combining Extensions

```typescript
// modules/cores/db/src/extensions/index.ts
import { Prisma } from '@prisma/client'
import { softDeleteExtension } from './softDeleteExtension'
import { auditExtension } from './auditExtension'

/**
 * Composite extension combining multiple concerns
 * Applied in order: soft delete filtering, then audit logging
 * @module modules/cores/db/src/extensions
 */
export function createCompositeExtension() {
  return (client: InstanceType<typeof Prisma.Client>) => {
    return client.$extends(softDeleteExtension).$extends(auditExtension)
  }
}

/**
 * Export individual extensions for independent use
 * @module modules/cores/db/src/extensions
 */
export { softDeleteExtension } from './softDeleteExtension'
export { auditExtension } from './auditExtension'
export { modelExtension } from './modelExtension'
export { healthCheckExtension } from './healthCheckExtension'
export { computedFieldsExtension } from './computedFieldsExtension'
```

```typescript
// modules/cores/db/src/prisma.ts
import { PrismaClient } from '@prisma/client'
import { createCompositeExtension } from './extensions'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

/**
 * Prisma client with composite extensions
 * Soft delete + audit logging
 * @module modules/cores/db/src
 */
export const prisma = new PrismaClient({ adapter }).$extends(
  createCompositeExtension() as any
)
```

---

## Best Practices

1. **Define separately** - Use Prisma.defineExtension
2. **Compose extensions** - Chain with $extends
3. **Type safety** - Use needs for computed fields
4. **Keep focused** - One concern per extension
5. **Test extensions** - They modify behavior globally
