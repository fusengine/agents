---
name: schema
description: Prisma 7 schema design with models, relations, and indexes
when-to-use: Designing database schema and data models
keywords: model, relation, index, enum, @id, @unique, @relation
priority: high
requires: installation.md
related: migrations.md, client.md
---

# Prisma Schema Design

See type definitions in `/references/interfaces/schema.types.md`.

## Generator & Datasource (v7)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"           // v7 required
  output   = "../src/generated/prisma" // v7 required
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Basic Model

```prisma
/**
 * User model with profile and posts.
 * Uses CUID for distributed ID generation.
 * See GeneratorConfig and ModelDefinition in /interfaces/schema.types.md
 */
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  profile   Profile?

  @@index([email])
  @@map("users")
}

/**
 * Role enum for user access control.
 * See EnumDefinition in /interfaces/enums.types.md
 */
enum Role {
  USER
  ADMIN
  MODERATOR
}
```

---

## One-to-One Relation

```prisma
model User {
  id      String   @id @default(cuid())
  profile Profile?
}

model Profile {
  id     String @id @default(cuid())
  bio    String?
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## One-to-Many Relation

```prisma
model User {
  id    String @id @default(cuid())
  posts Post[]
}

model Post {
  id       String @id @default(cuid())
  title    String
  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([authorId])
}
```

---

## Many-to-Many Relation

```prisma
// Implicit (Prisma manages join table)
model Post {
  id         String     @id @default(cuid())
  title      String
  categories Category[]
}

model Category {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}

// Explicit (custom join table)
model Post {
  id         String         @id @default(cuid())
  title      String
  categories PostCategory[]
}

model Category {
  id    String         @id @default(cuid())
  name  String         @unique
  posts PostCategory[]
}

model PostCategory {
  postId     String
  categoryId String
  assignedAt DateTime @default(now())

  post     Post     @relation(fields: [postId], references: [id])
  category Category @relation(fields: [categoryId], references: [id])

  @@id([postId, categoryId])
}
```

---

## Self-Relation

```prisma
model User {
  id         String  @id @default(cuid())
  name       String
  managerId  String?
  manager    User?   @relation("UserManager", fields: [managerId], references: [id])
  reports    User[]  @relation("UserManager")
}
```

---

## Indexes & Constraints

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  firstName String
  lastName  String

  // Composite unique
  @@unique([firstName, lastName])

  // Index
  @@index([email])

  // Composite index
  @@index([firstName, lastName])
}
```

---

## Native Database Types

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String   @db.VarChar(255)
  price       Decimal  @db.Decimal(10, 2)
  description String   @db.Text
  metadata    Json
  tags        String[]
}
```

---

## Best Practices

1. **cuid() for IDs** - Better than UUID for indexing
2. **@updatedAt** - Automatic timestamp updates
3. **onDelete: Cascade** - Clean up related records
4. **@@index** - Add for foreign keys and frequent queries
5. **@@map** - Use snake_case table names
