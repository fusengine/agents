---
name: constraints
description: Database constraints including check constraints, unique constraints, and foreign keys
when-to-use: Data integrity, business rule enforcement, and constraint validation
keywords: constraint, check-constraint, unique-constraint, foreign-key, validation
priority: medium
requires: null
related: error-handling.md, error-codes.md
---

# Prisma 7 Constraints

## Check Constraints

```prisma
// prisma/schema.prisma
model Product {
  id        String @id @default(cuid())
  name      String
  price     Decimal
  quantity  Int
  status    String // 'active', 'inactive'

  // Constraints defined via unsupported()
  @@map("products")
}
```

```sql
-- prisma/migrations/20240101000000_add_constraints/migration.sql

ALTER TABLE "Product"
ADD CONSTRAINT check_price_positive
CHECK (price > 0);

ALTER TABLE "Product"
ADD CONSTRAINT check_quantity_non_negative
CHECK (quantity >= 0);

ALTER TABLE "Product"
ADD CONSTRAINT check_valid_status
CHECK (status IN ('active', 'inactive', 'discontinued'));

-- Range constraints
ALTER TABLE "Product"
ADD CONSTRAINT check_discount_range
CHECK (discount >= 0 AND discount <= 100);
```

---

## Unique Constraints

```prisma
// prisma/schema.prisma
model User {
  id            String @id @default(cuid())
  email         String @unique
  username      String @unique
  phone         String?
  tenantId      String
  name          String

  // Composite unique constraint
  @@unique([tenantId, email])
  @@unique([tenantId, username])
  @@map("users")
}

model UserRole {
  id      String @id @default(cuid())
  userId  String
  roleId  String

  user    User @relation(fields: [userId], references: [id])
  role    Role @relation(fields: [roleId], references: [id])

  // Prevent duplicate assignments
  @@unique([userId, roleId])
}
```

---

## Foreign Key Constraints

```prisma
// prisma/schema.prisma
model Post {
  id          String @id @default(cuid())
  title       String
  content     String
  userId      String
  authorId    String?

  user        User @relation(fields: [userId], references: [id], onDelete: Cascade)
  author      User? @relation("author", fields: [authorId], references: [id], onDelete: SetNull)

  @@map("posts")
}

model Comment {
  id        String @id @default(cuid())
  content   String
  postId    String
  userId    String

  post      Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("comments")
}
```

---

## Constraint Violation Handling

```typescript
// modules/cores/db/repositories/constraint-error-handler.ts
import { Prisma } from '@prisma/client'

/**
 * Handle constraint violation errors
 * @param error - Error to handle
 * @returns User-friendly error message or null
 */
export async function handleConstraintError(
  error: unknown
): Promise<string | null> {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint
        return `${error.meta?.target} must be unique`

      case 'P2003': // Foreign key constraint
        return 'Referenced record does not exist'

      case 'P2014': // Required relation
        return 'Cannot delete: related records exist'

      case 'P2025': // Record not found
        return 'Record not found'

      default:
        return error.message
    }
  }
  return null
}

/**
 * Safely create user with constraint error handling
 * @param prisma - Prisma Client instance
 * @param data - User data
 * @returns Created user
 * @throws Error with user-friendly message on constraint violation
 */
export async function createUserSafe(
  prisma: PrismaClient,
  data: any
) {
  try {
    return await prisma.user.create({ data })
  } catch (error) {
    const message = await handleConstraintError(error)
    if (message) throw new Error(message)
    throw error
  }
}
```

---

## Cascading Constraints

```typescript
// modules/cores/db/repositories/cascade-delete-repository.ts
/**
 * Delete user and cascading relations
 * @param prisma - Prisma Client instance
 * @param userId - User ID to delete
 * @returns Deleted user record
 */
export async function deleteUserWithCascade(
  prisma: PrismaClient,
  userId: string
) {
  // With Cascade, deletes all:
  // - Posts (onDelete: Cascade)
  // - Comments (onDelete: Cascade)
  // - UserRoles (via unique constraint)
  return prisma.user.delete({
    where: { id: userId },
  })
}

/**
 * Delete post while preserving comments
 * @param prisma - Prisma Client instance
 * @param postId - Post ID to delete
 * @returns Deleted post record
 */
export async function deletePostPreserveComments(
  prisma: PrismaClient,
  postId: string
) {
  // Using transaction for fine control
  return prisma.$transaction(async (tx) => {
    // Orphan comments
    await tx.comment.updateMany({
      where: { postId },
      data: { postId: null },
    })

    // Delete post
    return tx.post.delete({
      where: { id: postId },
    })
  })
}
```

---

## Constraint Validation Middleware

```typescript
// modules/cores/db/interfaces/product-data.ts
/**
 * Product data for validation
 */
export interface ProductData {
  price: number
  quantity: number
  status: 'active' | 'inactive' | 'discontinued'
  discount?: number
}
```

```typescript
// modules/cores/db/repositories/constraint-validator.ts
import type { ProductData } from '../interfaces/product-data'

/**
 * Validate product data against constraints
 * @param data - Product data to validate
 * @returns Validation result (true if valid)
 * @throws Error with all constraint violations
 */
export async function validateProductData(
  data: ProductData
): Promise<boolean> {
  const errors: string[] = []

  if (data.price <= 0) {
    errors.push('Price must be greater than 0')
  }

  if (data.quantity < 0) {
    errors.push('Quantity cannot be negative')
  }

  const validStatuses = ['active', 'inactive', 'discontinued']
  if (!validStatuses.includes(data.status)) {
    errors.push('Invalid status value')
  }

  if (data.discount !== undefined) {
    if (data.discount < 0 || data.discount > 100) {
      errors.push('Discount must be between 0 and 100')
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '))
  }

  return true
}
```

---

## Deferred Constraints

```sql
-- PostgreSQL specific: check constraints at transaction end
CREATE TABLE "Account" (
  id TEXT PRIMARY KEY,
  balance DECIMAL NOT NULL,
  CONSTRAINT check_positive_balance
    CHECK (balance >= 0) NOT DEFERRABLE INITIALLY DEFERRED
);

-- Use in transactions:
-- BEGIN;
-- UPDATE "Account" SET balance = -100; -- Temporarily violates
-- UPDATE "Account" SET balance = 100;  -- Fixed before COMMIT
-- COMMIT;
```

---

## List All Constraints

```typescript
// modules/cores/db/interfaces/constraint-info.ts
/**
 * Constraint metadata
 */
export interface ConstraintInfo {
  constraintName: string
  tableName: string
  constraintType: string
  constraintDefinition: string
}
```

```typescript
// modules/cores/db/repositories/constraint-inspection.ts
import type { ConstraintInfo } from '../interfaces/constraint-info'

/**
 * Get all database constraints
 * @param prisma - Prisma Client instance
 * @returns List of constraints with metadata
 */
export async function getAllConstraints(
  prisma: PrismaClient
): Promise<ConstraintInfo[]> {
  return prisma.$queryRaw<ConstraintInfo[]>`
    SELECT
      c.constraint_name as "constraintName",
      t.table_name as "tableName",
      c.constraint_type as "constraintType",
      pgc.contype as "constraintDefinition"
    FROM information_schema.table_constraints c
    JOIN information_schema.tables t ON c.table_name = t.table_name
    JOIN pg_constraint pgc ON pgc.conname = c.constraint_name
    WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema')
    ORDER BY t.table_name, c.constraint_name
  `
}
```
