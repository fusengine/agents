---
name: "TypeORM to Prisma Migration"
description: "Step-by-step guide to migrate from TypeORM to Prisma"
when-to-use: "When migrating an existing TypeORM project to Prisma"
keywords: ["typeorm", "migration", "guide", "step-by-step"]
priority: 3
requires: ["prisma-7", "vs-typeorm"]
related: ["migrate-from-sequelize", "migrate-from-drizzle"]
---

# Migrate from TypeORM to Prisma

## Step 1: Setup

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

## Step 2: Introspect Existing Database

```bash
npx prisma db pull
```

This generates `schema.prisma` from your database.

## Step 3: Convert Decorators to Schema

### Before (TypeORM - SOLID violation: Mixing concerns)
```typescript
// Module: src/entities/user.entity.ts
// Purpose: MIXED - Entity definition, ORM metadata, validation (SOLID violation)
import type { Post } from "./post.entity";

@Entity()
@Index("idx_email", ["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string; // Field + metadata mixed

  @Column({ nullable: true, length: 100 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];
}
```

### After (Prisma - SOLID: SRP - schema only)
```prisma
// Module: prisma/schema.prisma
// Purpose: Schema definition only (SOLID: SRP - single responsibility)
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  posts     Post[]

  @@index([email])
}
```

## Step 4: Relations Migration

### TypeORM Relations
```typescript
// One-to-Many
@OneToMany(() => Post, post => post.user)
posts: Post[];

// Many-to-One
@ManyToOne(() => User, user => user.posts)
user: User;

// Many-to-Many
@ManyToMany(() => Tag, tag => tag.posts)
tags: Tag[];
```

### Prisma Relations
```prisma
// One-to-Many (on "many" side)
model Post {
  id     Int
  userId Int
  user   User @relation(fields: [userId], references: [id])
}

// On "one" side
model User {
  id    Int
  posts Post[]
}

// Many-to-Many (auto junction table)
model Post {
  tags Tag[]
}

model Tag {
  posts Post[]
}
```

## Step 5: Migrate Queries

### TypeORM → Prisma Migration Patterns (SOLID: SRP - each query isolated)

```typescript
// Module: src/services/user.service.ts
// Purpose: User data access queries (SOLID: SRP - query logic only)
import type { Prisma } from "@prisma/client";

/**
 * Find user by ID
 * SOLID: SRP - single query responsibility
 */
// TypeORM (mixed concerns)
const user = await User.findOne({ where: { id: 1 } });

// Prisma (clean abstraction)
const user = await prisma.user.findUnique({ where: { id: 1 } });

/**
 * Find user with posts (includes relations)
 */
// TypeORM (manual relation loading)
const user = await User.find({
  where: { id: 1 },
  relations: ["posts"],
});

// Prisma (type-safe relation inclusion)
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },
});

/**
 * Complex where conditions (OR operator)
 */
// TypeORM (array-based OR)
const users = await User.find({
  where: [
    { email: "user@example.com" },
    { role: "admin" },
  ],
});

// Prisma (explicit OR clause)
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: "user@example.com" },
      { role: "admin" },
    ],
  },
});

/**
 * Create user (SOLID: DIP - depend on Prisma data contract)
 */
// TypeORM (create then save)
const user = User.create({ email: "new@example.com" });
await repository.save(user);

// Prisma (combined create operation)
const user = await prisma.user.create({
  data: { email: "new@example.com" },
});

/**
 * Update user
 */
// TypeORM
await repository.update({ id: 1 }, { name: "New Name" });

// Prisma
await prisma.user.update({
  where: { id: 1 },
  data: { name: "New Name" },
});

/**
 * Delete user
 */
// TypeORM
await repository.delete({ id: 1 });

// Prisma
await prisma.user.delete({ where: { id: 1 } });
```

## Step 6: Transaction Migration

```typescript
// Module: src/services/transaction.service.ts
// Purpose: Database transaction handling (SOLID: SRP - transactional operations)
import type { Prisma } from "@prisma/client";

/**
 * TypeORM: Manual transaction management
 * SOLID violation: Client manages transaction state
 */
async function typeormTransaction(repository: Repository<User>) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(user);
    await queryRunner.manager.save(post);
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

/**
 * Prisma: Implicit transaction management
 * SOLID: DIP - Prisma handles transaction abstraction
 */
async function prismaTransaction(
  prisma: Prisma.PrismaClient,
  userData: Prisma.UserCreateInput,
  postData: Prisma.PostCreateInput
) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: userData });
    const post = await tx.post.create({ data: postData });
    return { user, post };
  });
}
```

## Step 7: Validation & Testing

1. Run your test suite
2. Verify all queries work
3. Check performance
4. Remove TypeORM dependencies

```bash
npm uninstall typeorm
npm uninstall reflect-metadata
```

## Step 8: Generate & Apply Migrations

```bash
npx prisma migrate dev --name initial_migration
```

## Checklist

- [ ] Database introspected to schema.prisma
- [ ] All entities converted to models
- [ ] All relations properly defined
- [ ] All queries migrated and tested
- [ ] Transactions updated
- [ ] Tests passing
- [ ] TypeORM dependencies removed
