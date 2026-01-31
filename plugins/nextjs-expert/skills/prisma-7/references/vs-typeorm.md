---
name: "Prisma vs TypeORM"
description: "Comprehensive comparison between Prisma and TypeORM with feature matrix and migration guide"
when-to-use: "When evaluating or migrating from TypeORM to Prisma"
keywords: ["typeorm", "comparison", "migration", "orm"]
priority: 2
requires: ["prisma-7", "databases"]
related: ["migrate-from-typeorm", "vs-sequelize", "vs-drizzle"]
---

# Prisma vs TypeORM

## Feature Comparison Matrix

| Feature | Prisma | TypeORM |
|---------|--------|---------|
| **Type Safety** | ✅ Full (generated types) | ✅ Decorators |
| **Query Builder** | Simple DSL | Advanced & flexible |
| **Schema Definition** | `.prisma` file | Decorators in models |
| **Migrations** | Built-in (`prisma migrate`) | Manual or auto-generate |
| **Database Support** | PostgreSQL, MySQL, SQLite | 20+ databases |
| **Learning Curve** | ⭐ Easier | ⭐⭐⭐ Steeper |
| **Performance** | Good | Excellent (raw queries) |
| **Bundle Size** | Smaller | Larger |
| **Active Maintenance** | ✅ High | ✅ High |

## Key Differences

### Schema Definition

**Prisma: Declarative schema (SOLID: SRP - schema separation)**
```prisma
// Module: prisma/schema.prisma
// Purpose: Define User model with relations (SOLID: SRP - schema definition only)
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]  // One-to-many relation
}

model Post {
  id     Int    @id @default(autoincrement())
  title  String
  userId Int    // Foreign key
  user   User   @relation(fields: [userId], references: [id])
}
```

**TypeORM: Decorators on entity classes (mixing concerns - SOLID violation)**
```typescript
// Module: src/entities/user.entity.ts
// Purpose: Entity class with metadata - mixes ORM, validation, and business logic
import type { Post } from "./post.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];
}
```

### Query Patterns

**Prisma: Intuitive DSL (SOLID: DIP - depend on Prisma client abstraction)**
```typescript
// Module: src/services/user.service.ts
// Purpose: Query abstraction for user data (SOLID: SRP - single query responsibility)
import type { Prisma } from "@prisma/client";

/**
 * User query with relations
 * @interface UserWithPosts
 */
interface UserWithPosts {
  id: number;
  email: string;
  name: string | null;
  posts: Array<{ id: number; title: string }>;
}

/**
 * Fetch user with posts (type-safe by default)
 * SOLID: DIP - depend on Prisma interface, not implementation
 */
async function getUserWithPosts(
  prisma: Prisma.PrismaClient,
  email: string
): Promise<UserWithPosts | null> {
  return prisma.user.findUnique({
    where: { email },
    include: { posts: true },
  });
}
```

**TypeORM: Query Builder (SOLID: Requires manual type safety)**
```typescript
// Module: src/repositories/user.repository.ts
// Purpose: Data access with manual query building
import type { Post } from "../entities/post.entity";
import type { User } from "../entities/user.entity";

interface UserWithPosts extends User {
  posts: Post[];
}

/**
 * Fetch user with posts (type safety not guaranteed)
 */
async function getUserWithPosts(
  repository: Repository<User>,
  email: string
): Promise<UserWithPosts | null> {
  return repository.createQueryBuilder("user")
    .leftJoinAndSelect("user.posts", "posts")
    .where("user.email = :email", { email })
    .getOne();
}
```

## Pros & Cons

### Prisma Advantages
- 🟢 Excellent developer experience
- 🟢 Auto-generated, type-safe client
- 🟢 Simple, readable queries
- 🟢 Excellent documentation

### Prisma Limitations
- 🔴 Less flexible for complex queries
- 🔴 Smaller ecosystem of extensions
- 🔴 JSON field limitations in some DBs

### TypeORM Advantages
- 🟢 More database support
- 🟢 Advanced query builder
- 🟢 Larger ecosystem & plugins

### TypeORM Limitations
- 🔴 Heavier learning curve
- 🔴 Larger bundle size
- 🔴 More boilerplate code

## Migration Path

See [migrate-from-typeorm.md](./migrate-from-typeorm.md) for detailed step-by-step guide.
