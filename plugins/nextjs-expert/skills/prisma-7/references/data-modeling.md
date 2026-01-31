---
name: data-modeling
description: Prisma 7 data modeling patterns and normalization techniques
when-to-use: Designing database schemas, structuring relationships, organizing data
keywords: schema, models, relations, normalization, cardinality
priority: high
requires: schema.md
related: composite-types.md, enums.md
---

# Data Modeling

Core data modeling patterns and normalization in Prisma 7.
Type definitions in `/references/interfaces/data-modeling.types.md`.

## One-to-One Relations

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  profile Profile?
}

model Profile {
  id     Int     @id @default(autoincrement())
  userId Int     @unique
  user   User    @relation(fields: [userId], references: [id])
  bio    String?
}
```

## One-to-Many Relations

```prisma
model Author {
  id    Int     @id @default(autoincrement())
  name  String
  posts Post[]
}

model Post {
  id       Int     @id @default(autoincrement())
  title    String
  authorId Int
  author   Author  @relation(fields: [authorId], references: [id])
}
```

## Many-to-Many Relations

```prisma
model Student {
  id        Int        @id @default(autoincrement())
  name      String
  courses   Course[]
}

model Course {
  id       Int       @id @default(autoincrement())
  name     String
  students Student[]
}
```

## Self-Relations

```prisma
model Category {
  id       Int        @id @default(autoincrement())
  name     String
  parentId Int?
  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
}
```

## Normalized vs Denormalized

```prisma
// ✅ NORMALIZED: Separate entities
model Order {
  id     Int   @id @default(autoincrement())
  total  Float
  items  OrderItem[]
}

model OrderItem {
  id       Int   @id @default(autoincrement())
  orderId  Int
  order    Order @relation(fields: [orderId], references: [id])
  productId Int
  quantity Int
}

// ❌ DENORMALIZED: Redundant data (avoid)
model OrderBad {
  id       Int    @id @default(autoincrement())
  total    Float
  itemCount Int    // Redundant, derive from items
  status   String // Same across all items?
}
```

## Queries with Relations

```typescript
/**
 * Include operation for eager loading.
 * Fetches all related records.
 * See IncludeConfig in /interfaces/data-modeling.types.md
 */
const author = await prisma.author.findUnique({
  where: { id: 1 },
  include: { posts: true }
})

/**
 * Select operation for field projection.
 * Fetches only specified fields and relations.
 * See SelectConfig in /interfaces/data-modeling.types.md
 */
const post = await prisma.post.findFirst({
  where: { published: true },
  select: {
    title: true,
    author: {
      select: { name: true }
    }
  }
})

/**
 * Relation filter for conditional queries.
 * Filter based on related record properties.
 * See RelationFilter in /interfaces/data-modeling.types.md
 */
const authors = await prisma.author.findMany({
  where: {
    posts: {
      some: { published: true }
    }
  }
})
```

## Best Practices

1. **Normalize data** - Avoid redundancy, use relations
2. **Use foreign keys** - Define explicit relationships
3. **One source of truth** - Don't duplicate data
4. **Index foreign keys** - Performance for joins
5. **Name relations clearly** - Self-relations use descriptors
