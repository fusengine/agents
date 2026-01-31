---
name: prisma-ai
description: Prisma AI features for query generation and schema suggestions
when-to-use: Query suggestions, schema optimization, migration planning
keywords: ai, query-generation, schema-suggestions, optimization, prisma-data-platform
priority: medium
requires: /plugins/nextjs-expert/skills/prisma-7/references/installation.md
related: /plugins/nextjs-expert/skills/prisma-7/references/queries.md
---

# Prisma AI Features

AI-powered tools integrated into Prisma ecosystem for query and schema optimization.

## Query Generation

### Interactive Query Builder

Access via Prisma Data Platform dashboard:

```typescript
// AI generates based on natural language:
// Input: "Get all active users with their recent posts"

// Generated query:
const activeUsersWithPosts = await prisma.user.findMany({
  where: { status: 'ACTIVE' },
  include: {
    posts: {
      where: { createdAt: { gte: startDate } },
      orderBy: { createdAt: 'desc' }
    }
  }
})
```

## Schema Suggestions

AI recommends schema improvements:

```typescript
// Your current schema
model User {
  id    Int     @id @default(autoincrement())
  email String
  name  String
}

// AI suggestions:
// 1. Add @unique to email
// 2. Add timestamps (createdAt, updatedAt)
// 3. Add status field for soft deletes
// 4. Add index for frequently queried fields

// Improved schema:
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique           // Suggested: prevent duplicates
  name      String
  status    String    @default("ACTIVE") // Suggested: for soft deletes
  createdAt DateTime  @default(now())   // Suggested: audit trail
  updatedAt DateTime  @updatedAt        // Suggested: track changes

  @@index([status])                     // Suggested: query optimization
}
```

## Performance Recommendations

AI analyzes queries and suggests optimizations:

```typescript
// Slow Query Pattern (N+1 problem detected)
async function getUsers() {
  const users = await prisma.user.findMany()
  for (const user of users) {
    user.postCount = await prisma.post.count({ where: { authorId: user.id } })
  }
  return users
}

// AI Recommendation:
async function getUsers() {
  return prisma.user.findMany({
    include: {
      _count: { select: { posts: true } }  // Single query, no N+1
    }
  })
}
```

## Migration Optimization

AI suggests safe migration strategies:

```prisma
// Old schema
model Post {
  id    Int     @id
  title String
}

// New requirements: add author relation
model Post {
  id       Int     @id
  title    String
  authorId Int?
  author   User?   @relation(fields: [authorId], references: [id])
}

// AI suggests:
// 1. Make authorId nullable first (no data loss)
// 2. Run migration
// 3. Populate existing posts with default author
// 4. Then add @unique or change to required
```

## Index Recommendations

```typescript
// Query patterns analyzed:
const usersByEmail = await prisma.user.findUnique({ where: { email } })
const activeUsers = await prisma.user.findMany({ where: { status: 'ACTIVE' } })

// AI recommends indexes:
model User {
  id    Int     @id
  email String  @unique        // Index suggested: unique query
  status String

  @@index([status])            // Index suggested: filter query
  @@index([createdAt])         // Index suggested: sorting
}
```

## Relation Optimization

AI detects and fixes relation issues:

```typescript
// Missing back-reference detected
model User {
  id    Int     @id
  posts Post[]
}

model Post {
  id       Int  @id
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
  // ❌ Missing back-reference on Post side
}

// AI suggests:
model User {
  id    Int     @id
  posts Post[]  @relation("UserPosts")
}

model Post {
  id       Int  @id
  author   User @relation("UserPosts", fields: [authorId], references: [id])
  authorId Int
}
```

## CLI Integration

```bash
# Get AI recommendations for current schema
npx prisma ai schema-suggestions

# Optimize existing queries
npx prisma ai query-suggestions

# Performance analysis
npx prisma ai analyze-performance
```

## VS Code Integration

**With Prisma extension:**
- Hover over relations → AI context menu
- Right-click schema → "AI Suggestions"
- Command Palette → "Prisma: Get AI Recommendations"

## Best Practices

1. **Review suggestions** - Don't auto-apply without review
2. **Test migrations** - Run migrations in staging first
3. **Benchmark changes** - Measure performance impact
4. **Document decisions** - Note why you accept/reject suggestions
5. **Combine with monitoring** - Track real query performance

```typescript
/**
 * Get user activity summary
 * @param userId - Target user
 * @returns Activity metrics
 *
 * AI Note: Could add caching for frequently accessed users
 */
async function getUserActivitySummary(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          posts: true,
          comments: true,
          likes: true
        }
      }
    }
  })
}
```

## Limitations

- Suggestions based on schema, not actual data volume
- Can't predict future query patterns
- May suggest over-indexing
- Requires Prisma Data Platform account
- Limited to Prisma ORM patterns

## Future Features

- Query execution prediction
- Real-time performance monitoring
- Automated schema evolution
- Cost estimation (cloud databases)
- ML-based pattern recognition

---
