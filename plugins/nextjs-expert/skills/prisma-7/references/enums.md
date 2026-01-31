---
name: enums
description: Prisma 7 enum types and native database enums
when-to-use: Status fields, roles, categories, type-safe constants
keywords: enum, status, role, discriminator, native
priority: high
requires: schema.md
related: field-attributes.md, scalar-lists.md
---

# Enums

Enum types and constant values in Prisma 7.
Type definitions in `/references/interfaces/enums.types.md`.

## Basic Enums

```prisma
/**
 * Status enum for post workflow states.
 * See EnumDefinition in /interfaces/enums.types.md
 */
enum Status {
  DRAFT
  PUBLISHED
  ARCHIVED
}

/**
 * Role enum for access control.
 * See EnumValue in /interfaces/enums.types.md
 */
enum Role {
  ADMIN
  MODERATOR
  USER
  GUEST
}

/**
 * Post model with status enum.
 * Defaults to DRAFT on creation.
 */
model Post {
  id     Int     @id @default(autoincrement())
  title  String
  status Status  @default(DRAFT)
}

/**
 * User model with role enum.
 * Defaults to USER on creation.
 */
model User {
  id   Int   @id @default(autoincrement())
  role Role  @default(USER)
}
```

## Native Database Enums

```prisma
/**
 * Native PostgreSQL enum for priority levels.
 * @db.Enum creates database enum type.
 * See NativeDatabaseEnum in /interfaces/enums.types.md
 * Performance: Type-safe at database level.
 */
enum Priority @db.Enum
{
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

/**
 * Native PostgreSQL enum for deployment environments.
 * Smaller storage and faster comparisons than string storage.
 */
enum Environment @db.Enum
{
  DEV
  STAGING
  PRODUCTION
}

/**
 * Task model using native enums.
 * Database enforces enum values.
 */
model Task {
  id       Int        @id @default(autoincrement())
  priority Priority
  env      Environment
}
```

## Using Enums

```typescript
/**
 * Query with enum value.
 * See EnumFieldQuery in /interfaces/enums.types.md
 * @returns {Promise<Post[]>} Published posts
 */
const posts = await prisma.post.findMany({
  where: { status: "PUBLISHED" }
})

/**
 * Create record with enum.
 * @returns {Promise<Post>} Created post with DRAFT status
 */
const post = await prisma.post.create({
  data: {
    title: "New Post",
    status: "DRAFT"
  }
})

/**
 * Update enum field.
 * @returns {Promise<Post>} Updated post with PUBLISHED status
 */
const published = await prisma.post.update({
  where: { id: 1 },
  data: { status: "PUBLISHED" }
})

/**
 * Filter by multiple enum values.
 * See EnumListFilter in /interfaces/enums.types.md
 * @returns {Promise<User[]>} Admin and moderator users
 */
const active = await prisma.user.findMany({
  where: {
    role: {
      in: ["ADMIN", "MODERATOR"]
    }
  }
})
```

## Enum Generation

```typescript
/**
 * Generated TypeScript enum from Prisma schema.
 * Prisma automatically creates TS enums.
 * See EnumType in /interfaces/enums.types.md
 * Located in: src/generated/prisma/index.d.ts
 */
enum Role {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER"
}

/**
 * Use generated enum in component.
 * Type-safe role parameter.
 */
type UserProps = {
  role: Role
}

/**
 * Type guard function using generated enum.
 * @param {Role} role - User role
 * @returns {boolean} Whether role is admin
 */
const isAdmin = (role: Role) => role === Role.ADMIN
```

## Discriminator Enums

```prisma
/**
 * Discriminator enum for notification variants.
 * Distinguishes different record types in single table.
 * See DiscriminatorEnum in /interfaces/enums.types.md
 */
enum NotificationType {
  EMAIL
  SMS
  PUSH
  WEBHOOK
}

/**
 * Single-table inheritance using discriminator enum.
 * Type field determines which optional fields apply.
 * EMAIL: uses email field
 * SMS: uses phone field
 * WEBHOOK: uses url field
 */
model Notification {
  id    Int              @id @default(autoincrement())
  type  NotificationType
  email String?          // Only for EMAIL type
  phone String?          // Only for SMS type
  url   String?          // Only for WEBHOOK type
}

/**
 * Query notifications by type.
 * @returns {Promise<Notification[]>} Email notifications only
 */
const emails = await prisma.notification.findMany({
  where: { type: "EMAIL" }
})
```

## Migrations

```bash
/**
 * Add new enum value (safe operation).
 * Non-breaking change: existing values unaffected.
 * See EnumAddition in /interfaces/enums.types.md
 */
prisma migrate dev --name add_status_value

# Then edit schema.prisma to add new value
# enum Status {
#   DRAFT
#   PUBLISHED
#   ARCHIVED
#   SCHEDULED  # New value
# }
```

## Best Practices

1. **Use enums for fixed values** - Status, role, type
2. **Keep enum names uppercase** - Convention and consistency
3. **Use native enums for PostgreSQL** - Better performance
4. **Avoid enum changes in production** - Plan migrations
5. **Discriminate with enums** - Type-safe unions with optional fields
