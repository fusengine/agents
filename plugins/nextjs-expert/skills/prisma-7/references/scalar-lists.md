---
name: scalar-lists
description: Prisma 7 array fields and scalar lists
when-to-use: Storing tags, array data, string lists, MongoDB documents
keywords: array, list, scalar, json, mongo, string[]
priority: medium
requires: schema.md
related: composite-types.md, enums.md
---

# Scalar Lists

Array and list field patterns in Prisma 7.

## Basic Scalar Lists

```prisma
// prisma/schema.prisma

/// User model with array fields
model User {
  id       Int      @id @default(autoincrement())  // Auto-incrementing ID
  email    String   @unique  // Unique email
  tags     String[]  // Array of string tags
  roles    Role[]  // Array of role enum values
  scores   Int[]  // Array of integer scores
}

/// Role enumeration
enum Role {
  ADMIN
  USER
  MODERATOR
}
```

## PostgreSQL vs MongoDB

```prisma
// PostgreSQL: Native arrays
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  keywords  String[]
  ratings   Float[]
}

// MongoDB: BSON arrays
model Article {
  id        String   @id @map("_id") @db.ObjectId
  title     String
  tags      String[]
  comments  Json[]
}
```

## Creating with Arrays

```typescript
// modules/cores/db/operations.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Create user with tag and score arrays
 * Arrays are stored natively in PostgreSQL
 */
const user = await prisma.user.create({
  data: {
    email: "test@example.com",
    tags: ["developer", "typescript", "react"],
    scores: [95, 87, 92]
  }
})

/**
 * Create post with keyword array
 */
const post = await prisma.post.create({
  data: {
    title: "Learning Prisma",
    keywords: ["prisma", "orm", "database"]
  }
})
```

## Querying Arrays

```typescript
// modules/cores/db/queries.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Find posts containing specific keyword
 * Uses 'has' operator for array membership
 */
const findPostsByKeyword = () => prisma.post.findMany({
  where: {
    keywords: {
      has: "prisma"  // Array contains value
    }
  }
})

/**
 * Find users with any of specified roles
 * Uses 'hasAny' operator for OR logic
 */
const findAdminsOrMods = () => prisma.user.findMany({
  where: {
    roles: {
      hasAny: ["ADMIN", "MODERATOR"]  // Has any value
    }
  }
})

/**
 * Find fully verified users
 * Uses 'hasEvery' operator for AND logic
 */
const findFullyVerified = () => prisma.user.findMany({
  where: {
    tags: {
      hasEvery: ["verified", "trusted"]  // Has all values
    }
  }
})

/**
 * Find posts with empty keyword arrays
 */
const findUntaggedPosts = () => prisma.post.findMany({
  where: {
    keywords: {
      isEmpty: true  // Array is empty
    }
  }
})
```

## Updating Arrays

```typescript
// modules/cores/db/operations.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Append item to existing array
 * Uses 'push' operator
 */
const addTag = await prisma.user.update({
  where: { id: 1 },
  data: {
    tags: {
      push: "newTag"  // Append to array
    }
  }
})

/**
 * Replace entire array with new values
 * Direct assignment overwrites
 */
const replaceTags = await prisma.user.update({
  where: { id: 1 },
  data: {
    tags: ["tag1", "tag2", "tag3"]  // Replace entire array
  }
})

/**
 * Set array with explicit values
 * Uses 'set' operator for clarity
 */
const setKeywords = await prisma.post.update({
  where: { id: 1 },
  data: {
    keywords: {
      set: ["prisma", "database", "orm"]  // Set exact values
    }
  }
})
```

## Best Practices

1. **Use for simple values** - Strings, ints, enums
2. **Keep arrays small** - Avoid thousands of items
3. **Use `has` for filters** - Efficient querying
4. **Index arrays** - PostgreSQL supports @db.Indexed
5. **Validate content** - Type-check array items
