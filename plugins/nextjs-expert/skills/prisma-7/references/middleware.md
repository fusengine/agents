---
name: middleware
description: Prisma 7 middleware patterns (deprecated) and extensions alternative
when-to-use: Understanding legacy middleware, migrating to extensions
keywords: middleware, $use, deprecated, extensions, migration
priority: low
requires: client.md
related: extensions.md
---

# Middleware (Deprecated)

Prisma middleware is deprecated in v7. Use extensions instead.

## Legacy Middleware Pattern

```typescript
// ❌ Deprecated in Prisma 7
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  console.log(`${params.model}.${params.action} took ${after - before}ms`)
  return result
})
```

---

## Migration to Extensions

### Logging Middleware → Extension

```typescript
// modules/cores/db/src/extensions/loggingExtension.ts
import { Prisma } from '@prisma/client'

/**
 * ✅ Modern extension for operation logging
 * Replaces deprecated middleware pattern
 * @module modules/cores/db/src/extensions
 */
export const loggingExtension = Prisma.defineExtension({
  query: {
    $allModels: {
      /**
       * Log all database operations
       */
      async $allOperations({ model, operation, args, query }) {
        console.log(`${model}.${operation}`)
        return query(args)
      },
    },
  },
})

/**
 * DEPRECATED ❌ - Old middleware pattern (DO NOT USE)
 * @deprecated Use loggingExtension instead
 */
// prisma.$use(async (params, next) => {
//   console.log(`${params.model}.${params.action}`)
//   return next(params)
// })
```

---

### Soft Delete Middleware → Extension

```typescript
// modules/cores/db/src/extensions/softDeleteExtension.ts
import { Prisma } from '@prisma/client'

/**
 * ✅ Modern extension for soft delete pattern
 * Replaces deprecated middleware for delete operations
 * @module modules/cores/db/src/extensions
 */
export const softDeleteExtension = Prisma.defineExtension({
  query: {
    $allModels: {
      /**
       * Replace hard delete with soft delete (sets deletedAt)
       */
      async delete({ args, query }) {
        return this.update({
          where: args.where,
          data: { deletedAt: new Date() },
        })
      },

      /**
       * Auto-filter deleted records from queries
       */
      async findMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },
    },
  },
})

/**
 * DEPRECATED ❌ - Old middleware pattern (DO NOT USE)
 * @deprecated Use softDeleteExtension instead
 */
// prisma.$use(async (params, next) => {
//   if (params.action === 'delete') {
//     params.action = 'update'
//     params.args.data = { deletedAt: new Date() }
//   }
//   return next(params)
// })
```

---

### Timing Middleware → Extension

```typescript
// modules/cores/db/src/extensions/timingExtension.ts
import { Prisma } from '@prisma/client'

/**
 * Performance monitoring interface
 * @module modules/cores/db/src/extensions
 */
export interface QueryTiming {
  model: string
  operation: string
  duration: number
  isSlowQuery: boolean
}

/**
 * ✅ Modern extension for query performance monitoring
 * Logs queries exceeding 100ms threshold
 * @module modules/cores/db/src/extensions
 */
export const timingExtension = Prisma.defineExtension({
  query: {
    $allModels: {
      /**
       * Monitor all operations for performance
       */
      async $allOperations({ model, operation, args, query }) {
        const start = Date.now()
        const result = await query(args)
        const duration = Date.now() - start

        const timing: QueryTiming = {
          model,
          operation,
          duration,
          isSlowQuery: duration > 100,
        }

        if (timing.isSlowQuery) {
          console.warn(
            `Slow: ${model}.${operation} (${duration}ms)`,
            timing
          )
        }

        return result
      },
    },
  },
})

/**
 * DEPRECATED ❌ - Old middleware pattern (DO NOT USE)
 * @deprecated Use timingExtension instead
 */
// prisma.$use(async (params, next) => {
//   const start = Date.now()
//   const result = await next(params)
//   const duration = Date.now() - start
//   if (duration > 100) {
//     console.warn(`Slow query: ${params.model}.${params.action}`)
//   }
//   return result
// })
```

---

## Extension Advantages

| Feature | Middleware | Extensions |
|---------|------------|------------|
| Type safety | Limited | Full |
| Composable | No | Yes |
| Model-specific | Manual check | Native |
| Result access | Limited | Full |
| Maintained | Deprecated | Active |

---

## Best Practices

1. **Migrate to extensions** - Middleware is deprecated
2. **Use $allModels** - For cross-cutting concerns
3. **Model-specific** - For targeted behavior
4. **Compose extensions** - Chain multiple concerns
5. **See extensions.md** - For full documentation
