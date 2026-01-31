---
name: model-attributes
description: Prisma 7 model-level attributes (@@id, @@unique, @@index, @@map)
when-to-use: Composite keys, compound indexes, model configuration
keywords: attribute, @@id, @@unique, @@index, @@map, composite
priority: high
requires: schema.md, field-attributes.md
related: field-attributes.md, constraints.md
---

# Model Attributes

Model-level configuration and constraints in Prisma 7.
Type definitions in `/references/interfaces/model-attributes.types.md`.

## Composite Primary Keys

```prisma
/**
 * Junction table with composite primary key.
 * Multiple fields form the unique identifier.
 * See CompositeKey in /interfaces/model-attributes.types.md
 * One student-course enrollment identified by both IDs.
 */
model StudentCourse {
  studentId Int
  courseId  Int
  grade     String

  /**
   * Composite key: studentId + courseId
   * Prevents duplicate enrollments.
   */
  @@id([studentId, courseId])
}

/**
 * User-tag association with composite key.
 * Prevents duplicate tag assignments.
 */
model UserTag {
  userId Int
  tagId  Int

  @@id([userId, tagId])
}

/**
 * Query by composite key.
 * Requires all key fields in where clause.
 * See CompositeKeyQuery in /interfaces/model-attributes.types.md
 */
const enroll = await prisma.studentCourse.findUnique({
  where: {
    studentId_courseId: {
      studentId: 1,
      courseId: 5
    }
  }
})
```

## Composite Unique Constraints

```prisma
/**
 * User model with composite unique constraint.
 * Same email allowed in different domains.
 * See CompositeUniqueConstraint in /interfaces/model-attributes.types.md
 */
model User {
  id    Int    @id @default(autoincrement())
  email String
  domain String

  /**
   * Composite unique: email + domain
   * Allows multi-tenant email addresses.
   */
  @@unique([email, domain])
}

/**
 * Query by composite unique constraint.
 * See CompositeUniqueQuery in /interfaces/model-attributes.types.md
 * Finds user by email+domain pair.
 */
const user = await prisma.user.findUnique({
  where: {
    email_domain: {
      email: "user@example.com",
      domain: "example.com"
    }
  }
})
```

## Indexes

```prisma
/**
 * Post model with index configurations.
 * Indexes optimize query performance.
 * See IndexConfig in /interfaces/model-attributes.types.md
 */
model Post {
  id        Int     @id @default(autoincrement())
  title     String
  authorId  Int
  status    String
  createdAt DateTime @default(now())

  /**
   * Simple index on foreign key.
   * Optimizes joins and filtering by authorId.
   */
  @@index([authorId])

  /**
   * Composite index for common filters.
   * Optimizes: WHERE status = ? AND createdAt > ?
   * Order matters for B-tree performance.
   */
  @@index([status, createdAt])

  /**
   * Named index (PostgreSQL).
   * Custom name for database-level identification.
   */
  @@index([title], map: "posts_title_idx")
}
```

## Full-Text Indexes (PostgreSQL)

```prisma
/**
 * Article model with full-text search index.
 * PostgreSQL only feature.
 * See FullTextIndex in /interfaces/model-attributes.types.md
 */
model Article {
  id    Int     @id @default(autoincrement())
  title String
  body  String

  /**
   * Full-text search index.
   * Optimizes text search queries.
   * Only available on PostgreSQL.
   */
  @@fulltext([title, body])
}

/**
 * Full-text search query using raw SQL.
 * Text vector operators (@@ plainto_tsquery).
 * @returns {Promise<Article[]>} Matching articles
 */
const results = await prisma.$queryRaw`
  SELECT * FROM "Article"
  WHERE to_tsvector(title || ' ' || body)
  @@ plainto_tsquery('search term')
`
```

## Model Name Mapping

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique

  @@map("users") // Map to database table "users"
}

model BlogPost {
  id    Int     @id @default(autoincrement())
  title String

  @@map("blog_posts")
}

// Generated SQL:
// CREATE TABLE users (...)
// CREATE TABLE blog_posts (...)
```

## Discriminator Fields

```prisma
enum AccountType {
  PERSONAL
  BUSINESS
}

model Account {
  id       Int         @id @default(autoincrement())
  type     AccountType
  personal String?     // Only for PERSONAL
  business String?     // Only for BUSINESS

  @@index([type])
}
```

## Soft Deletes Pattern

```prisma
/**
 * Post model with soft delete support.
 * Data preserved but marked as deleted.
 * See SoftDeleteConfig in /interfaces/model-attributes.types.md
 */
model Post {
  id        Int       @id @default(autoincrement())
  title     String
  deletedAt DateTime? // null = active, date = deleted

  /**
   * Index on deletedAt for performance.
   * Common in WHERE deletedAt IS NULL queries.
   */
  @@index([deletedAt])
}

/**
 * Query active posts.
 * See SoftDeletePatterns in /interfaces/model-attributes.types.md
 * @returns {Promise<Post[]>} Non-deleted posts
 */
const posts = await prisma.post.findMany({
  where: { deletedAt: null }
})

/**
 * Soft delete operation.
 * Marks post as deleted without data loss.
 * @returns {Promise<Post>} Updated post with deletedAt timestamp
 */
await prisma.post.update({
  where: { id: 1 },
  data: { deletedAt: new Date() }
})
```

## Best Practices

1. **Composite keys for junction tables** - Many-to-many mappings
2. **Composite indexes for common filters** - Query performance
3. **@@map for legacy tables** - Database naming conventions
4. **Index frequently filtered fields** - createdAt, status, foreign keys
5. **Composite unique for data integrity** - Multi-field uniqueness
