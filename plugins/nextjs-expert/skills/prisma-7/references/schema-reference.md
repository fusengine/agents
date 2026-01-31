---
name: schema-reference
description: Prisma 7 schema syntax reference
when-to-use: Writing Prisma schema, understanding attributes
keywords: schema, @id, @unique, @relation, @default, @db, @@index
priority: high
requires: schema.md
related: migrations.md
---

# Schema Reference

Prisma schema syntax for Prisma 7.

## Data Sources

```prisma
// prisma/schema.prisma
datasource db {
  // Database provider: postgresql, mysql, sqlite, sqlserver, mongodb
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // Direct connection for migrations (bypass pooler)
}
```

---

## Generators

```prisma
// prisma/schema.prisma
generator client {
  provider        = "prisma-client"
  output          = "../src/generated/prisma"  // Module path: modules/cores/db/generated
  previewFeatures = ["fullTextSearchPostgres"]  // Enable preview features if needed
}
```

---

## Field Types

| Type | Description |
|------|-------------|
| `String` | Text data |
| `Int` | Integer |
| `BigInt` | Large integer |
| `Float` | Floating point |
| `Decimal` | Exact decimal |
| `Boolean` | True/false |
| `DateTime` | Date and time |
| `Json` | JSON data |
| `Bytes` | Binary data |

---

## Field Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `@id` | Primary key | `id String @id` |
| `@unique` | Unique constraint | `email String @unique` |
| `@default()` | Default value | `@default(now())` |
| `@updatedAt` | Auto-update timestamp | `updatedAt DateTime @updatedAt` |
| `@relation()` | Define relation | `@relation(fields: [userId], references: [id])` |
| `@map()` | Column name | `@map("user_name")` |
| `@db.` | Native type | `@db.VarChar(255)` |
| `?` | Optional field | `name String?` |
| `[]` | Array | `tags String[]` |

---

## Default Values

| Function | Description |
|----------|-------------|
| `autoincrement()` | Auto-incrementing integer (database sequence) |
| `cuid()` | CUID string (Prisma-generated) |
| `uuid()` | UUID string (Prisma-generated) |
| `now()` | Current timestamp (server time) |
| `dbgenerated()` | Database-generated value (custom SQL) |

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  uuid      String   @default(uuid())
  createdAt DateTime @default(now())
  counter   Int      @default(autoincrement())
  status    String   @default("active")  // String literal default
}
```

---

## Model Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `@@id([])` | Composite primary key | `@@id([a, b])` |
| `@@unique([])` | Composite unique | `@@unique([email, name])` |
| `@@index([])` | Index | `@@index([email])` |
| `@@map()` | Table name | `@@map("users")` |
| `@@ignore` | Ignore model | `@@ignore` |
| `@@fulltext([])` | Full-text index | `@@fulltext([title, content])` |

---

## Relations

```prisma
// prisma/schema.prisma

// One-to-One: User has one Profile
model User {
  id      String   @id @default(cuid())
  profile Profile?  // Optional relation
}

model Profile {
  id     String @id @default(cuid())
  userId String @unique  // Foreign key
  user   User   @relation(fields: [userId], references: [id])
}

// One-to-Many: User has many Posts
model User {
  id    String @id @default(cuid())
  posts Post[]  // List of posts
}

model Post {
  id       String @id @default(cuid())
  authorId String
  author   User   @relation(fields: [authorId], references: [id])

  // Index for foreign key queries
  @@index([authorId])
}

// Many-to-Many (implicit junction table)
model Post {
  id         String     @id @default(cuid())
  categories Category[]  // Implicit many-to-many
}

model Category {
  id    String @id @default(cuid())
  posts Post[]  // Implicit many-to-many
}
```

---

## Relation Options

```prisma
@relation(
  fields: [userId],           // Local field
  references: [id],           // Referenced field
  onDelete: Cascade,          // Cascade, SetNull, Restrict, NoAction
  onUpdate: Cascade,          // Cascade, SetNull, Restrict, NoAction
  name: "UserPosts"           // Relation name (for multiple relations)
)
```

---

## Enums

```prisma
enum Role {
  USER
  ADMIN
  MODERATOR
}

model User {
  id   String @id @default(cuid())
  role Role   @default(USER)
}
```

---

## Native Database Types

```prisma
model Product {
  id          String   @id @db.Uuid
  name        String   @db.VarChar(255)
  description String   @db.Text
  price       Decimal  @db.Decimal(10, 2)
  metadata    Json     @db.JsonB
  tags        String[] @db.Text
  createdAt   DateTime @db.Timestamptz
}
```
