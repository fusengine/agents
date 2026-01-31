---
name: referential-actions
description: Prisma 7 referential actions (onDelete, onUpdate, Cascade, SetNull)
when-to-use: Configuring delete behavior, cascading updates, foreign key constraints
keywords: referential action, onDelete, onUpdate, Cascade, SetNull, Restrict, NoAction
priority: high
requires: schema.md, data-modeling.md
related: constraints.md, data-modeling.md
---

# Referential Actions

Foreign key constraints and cascading behavior in Prisma 7.
Type definitions in `/references/interfaces/relations.types.md`.

## Cascade Delete

```prisma
/**
 * Author model with cascading posts.
 * See ReferentialAction.Cascade in /interfaces/relations.types.md
 */
model Author {
  id    Int     @id @default(autoincrement())
  name  String
  posts Post[]
}

/**
 * Post model with cascade delete on author.
 * Deleting author automatically deletes posts.
 * See ForeignKeyConstraint in /interfaces/relations.types.md
 */
model Post {
  id       Int     @id @default(autoincrement())
  title    String
  authorId Int
  author   Author  @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

/**
 * Cascade delete example.
 * Deletes Author AND all related Posts.
 */
await prisma.author.delete({ where: { id: 1 } })
// Result: Author deleted + all related Posts deleted
```

## Set Null on Delete

```prisma
/**
 * User model with optional comments.
 */
model User {
  id       Int     @id @default(autoincrement())
  email    String
  comments Comment[]
}

/**
 * Comment model with optional user reference.
 * onDelete: SetNull orphans comments but preserves them.
 * See ReferentialAction.SetNull in /interfaces/relations.types.md
 */
model Comment {
  id     Int    @id @default(autoincrement())
  text   String
  userId Int?
  user   User?  @relation(fields: [userId], references: [id], onDelete: SetNull)
}

/**
 * Set null example.
 * Deletes User but Comments remain with userId = null.
 */
await prisma.user.delete({ where: { id: 1 } })
// Result: Comments orphaned but preserved
```

## Restrict Delete

```prisma
/**
 * Account model with restricted deletion.
 */
model Account {
  id       Int     @id @default(autoincrement())
  name     String
  orders   Order[]
}

/**
 * Order model with restrict action.
 * onDelete: Restrict prevents account deletion if orders exist.
 * See ReferentialAction.Restrict in /interfaces/relations.types.md
 */
model Order {
  id        Int     @id @default(autoincrement())
  total     Float
  accountId Int
  account   Account @relation(fields: [accountId], references: [id], onDelete: Restrict)
}

/**
 * Restrict example: prevents orphaned orders.
 * Throws error if account has dependent orders.
 */
try {
  await prisma.account.delete({ where: { id: 1 } })
} catch (e) {
  // Error: Cannot delete account with dependent orders
}

/**
 * Must delete orders before account.
 * Maintains referential integrity.
 */
await prisma.order.deleteMany({ where: { accountId: 1 } })
await prisma.account.delete({ where: { id: 1 } })
```

## Update Actions

```prisma
model Category {
  id       Int      @id @default(autoincrement())
  name     String
  products Product[]
}

model Product {
  id         Int      @id @default(autoincrement())
  name       String
  categoryId Int
  category   Category @relation(fields: [categoryId], references: [id], onUpdate: Cascade)
}

// Update category ID → product categoryId updated
await prisma.category.update({
  where: { id: 1 },
  data: { id: 99 } // Change primary key
})
// Result: All products now have categoryId: 99
```

## NoAction (Default)

```prisma
model Department {
  id        Int      @id @default(autoincrement())
  name      String
  employees Employee[]
}

model Employee {
  id           Int        @id @default(autoincrement())
  name         String
  departmentId Int
  department   Department @relation(fields: [departmentId], references: [id], onDelete: NoAction)
}

// Delete department with employees → ERROR at database level
// NoAction defers constraint check to end of transaction
```

## Practical Examples

```prisma
// E-commerce: Orders cascade with items
model Order {
  id    Int     @id @default(autoincrement())
  items OrderItem[]
}

model OrderItem {
  id      Int   @id @default(autoincrement())
  orderId Int
  order   Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

// Profile: User deleted → profile orphaned
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  userId Int?   @unique
  user   User?  @relation(fields: [userId], references: [id], onDelete: SetNull)
}

// Comments: User deleted but comments kept
model User {
  id       Int      @id @default(autoincrement())
  comments Comment[]
}

model Comment {
  id      Int    @id @default(autoincrement())
  userId  Int?
  user    User?  @relation(fields: [userId], references: [id], onDelete: SetNull)
}
```

## Action Reference

| Action | Behavior | Use Case |
|--------|----------|----------|
| **Cascade** | Delete child records | Orders with items |
| **SetNull** | Set FK to null | Optional author |
| **Restrict** | Prevent delete | Integrity checks |
| **NoAction** | Database constraint | Complex transactions |

## Best Practices

1. **Use Cascade for composition** - Parent-child ownership
2. **Use SetNull for optional relations** - Keep data, lose reference
3. **Use Restrict for critical references** - Prevent accidental deletes
4. **Consider data loss** - Cascade deletes irreversibly
5. **Document behavior** - Clarify referential action intent
