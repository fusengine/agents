---
name: omit-api
description: Prisma 7 Omit API for excluding sensitive fields
when-to-use: Excluding passwords, tokens, and sensitive data
keywords: omit, exclude, password, sensitive, global, local
priority: medium
requires: client.md
related: queries.md
---

# Omit API

Exclude sensitive fields from query results in Prisma 7.

## Global Omit

```typescript
// modules/cores/db/src/interfaces/omitConfig.ts
/**
 * Global omit configuration for sensitive fields
 * Fields listed here are excluded from all queries by default
 * @module modules/cores/db/src/interfaces
 */
export const GLOBAL_OMIT_CONFIG = {
  user: {
    password: true,
    refreshToken: true,
  },
  apiKey: {
    secretKey: true,
  },
} as const
```

```typescript
// modules/cores/db/src/prisma.ts
import { GLOBAL_OMIT_CONFIG } from './src/interfaces/omitConfig'

/**
 * Prisma client with global omit configuration
 * Automatically excludes sensitive fields from all queries
 * @module modules/cores/db/src
 */
const prisma = new PrismaClient({
  adapter,
  omit: GLOBAL_OMIT_CONFIG,
})

// Usage: Password excluded from all queries
const user = await prisma.user.findUnique({
  where: { id: 'user_123' },
})
// user.password is undefined
```

---

## Local Omit

```typescript
// Exclude for single query
const user = await prisma.user.findUnique({
  where: { id: 'user_123' },
  omit: {
    password: true,
    email: true,
  },
})
```

---

## Override Global Omit

```typescript
// Re-include globally omitted field
const user = await prisma.user.findUnique({
  where: { id: 'user_123' },
  omit: {
    password: false, // Include password for this query
  },
})

// Or use explicit select
const user = await prisma.user.findUnique({
  where: { id: 'user_123' },
  select: {
    id: true,
    email: true,
    password: true, // Explicitly selected
  },
})
```

---

## Type Safety

```typescript
// modules/cores/db/src/interfaces/omitTypes.ts
import type { Prisma } from '@prisma/client'

/**
 * Omit configuration type for type-safe field exclusion
 * @module modules/cores/db/src/interfaces
 */
export type OmitConfig = Prisma.PrismaClientOptions['omit']

/**
 * Type-safe omit configuration with const assertion
 * Ensures TypeScript properly infers omitted fields
 * @module modules/cores/db/src/interfaces
 */
export const createOmitConfig = () => {
  return {
    user: { password: true },
    apiKey: { secretKey: true },
  } as const satisfies OmitConfig
}
```

```typescript
// modules/cores/db/src/prisma.ts
import type { OmitConfig } from './src/interfaces/omitTypes'
import { createOmitConfig } from './src/interfaces/omitTypes'

const omitConfig = createOmitConfig()

/**
 * TypeScript correctly infers omitted fields as undefined
 * @module modules/cores/db/src
 */
const prisma = new PrismaClient({
  adapter,
  omit: omitConfig,
})
```

---

## With Relations

```typescript
// modules/users/src/queries/getPostsWithAuthors.ts
import { prisma } from '@/modules/cores/db/src/prisma'

/**
 * Fetch posts with authors, omitting sensitive author fields
 * Demonstrates local omit in nested relations
 * @module modules/users/src/queries
 */
export async function getPostsWithAuthors() {
  return prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
    },
  })
}
```

---

## Best Practices

1. **Global for sensitive** - Always omit passwords globally
2. **Local for performance** - Omit large fields when not needed
3. **Use const assertion** - For proper TypeScript inference
4. **Document omitted fields** - Make it clear what's excluded
5. **Override carefully** - Only when absolutely necessary
