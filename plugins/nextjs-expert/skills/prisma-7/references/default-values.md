---
name: default-values
description: Prisma 7 default values and auto-generated fields
when-to-use: Setting default timestamps, UUIDs, database sequences
keywords: default, autoincrement, uuid, timestamp, cuid
priority: medium
requires: schema.md, field-attributes.md
related: field-attributes.md
---

# Default Values

Auto-generated and default value patterns in Prisma 7.

## Auto-Incrementing IDs

```prisma
// prisma/schema.prisma

/// User model with auto-increment ID
model User {
  // Database-generated auto-increment integer
  id Int @id @default(autoincrement())

  // Alternative: BigInt for larger sequences
  // id BigInt @id @default(autoincrement()) @db.BigInt
}

/// Post model with auto-increment
model Post {
  // Database handles sequence generation
  id Int @id @default(autoincrement())
}
```

## UUID Fields

```prisma
// prisma/schema.prisma

/// User model with UUID primary key
model User {
  // Prisma-generated UUID string
  id String @id @default(uuid()) @db.Uuid

  // Alternative: CUID (compact, sortable)
  // id String @id @default(cuid())
}

/// Article with multiple UUIDs
model Article {
  id       String    @id @default(uuid())  // Primary key
  publicId String    @unique @default(uuid())  // Public-facing ID
  createdAt DateTime @default(now())  // Creation timestamp
}
```

## Timestamps

```prisma
// prisma/schema.prisma

/// Post model with creation and update timestamps
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  createdAt DateTime @default(now())  // Set once at creation
  updatedAt DateTime @updatedAt  // Auto-updated on every change
}

/// Event model with multiple timestamps
model Event {
  id        String   @id @default(uuid())
  name      String
  startAt   DateTime  // User-provided start time
  createdAt DateTime @default(now())  // When event was created
  recordedAt DateTime @default(now())  // Fixed timestamp (never updates)
}
```

## Database-Level Defaults

```prisma
// prisma/schema.prisma

/// User model with various default values
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  status    String  @default("active")  // String literal default
  isActive  Boolean @default(true)  // Boolean default
  role      Role    @default(USER)  // Enum default
}

/// Order model with numeric defaults
model Order {
  id      Int     @id @default(autoincrement())
  total   Float   @default(0)  // Default: zero
  items   Int     @default(0)  // Default: zero items
  tax     Float   @default(0)  // Default: no tax
}
```

## Creating with Defaults

```typescript
// modules/cores/db/operations.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Create user with automatic default values
 * Fields with @default are filled automatically
 */
const user = await prisma.user.create({
  data: {
    email: "test@example.com"
    // id, createdAt, status auto-filled by database
  }
})

// Result: {
//   id: 1,
//   email: "test@example.com",
//   status: "active",
//   createdAt: 2024-01-15T10:30:00Z
// }

/**
 * Override default values explicitly
 * Provided values override @default directives
 */
const explicit = await prisma.user.create({
  data: {
    email: "admin@example.com",
    status: "inactive",  // Override default
    createdAt: new Date("2024-01-01")  // Custom timestamp
  }
})
```

## Update With Timestamps

```typescript
// modules/cores/db/operations.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Update post and auto-set updatedAt timestamp
 * @updatedAt directive automatically updates timestamp
 */
const updated = await prisma.post.update({
  where: { id: 1 },
  data: { title: "Updated" }
  // updatedAt is auto-set to current time
})

/**
 * Create-or-update pattern with automatic timestamps
 * Creates new record or updates existing
 */
const upserted = await prisma.post.upsert({
  where: { id: 1 },
  create: {
    id: 1,
    title: "New Post",
    // createdAt: auto-generated
  },
  update: {
    title: "Updated"
    // updatedAt: auto-updated
  }
})
```

## Best Practices

1. **Use @default(now())** - Server-generated timestamps
2. **Use @updatedAt** - Automatic update tracking
3. **Use uuid() for public IDs** - Better than sequential
4. **Use autoincrement for internal IDs** - Database efficiency
5. **Avoid hardcoded defaults** - Let database handle it
