---
name: "Prisma vs Sequelize"
description: "Comprehensive comparison between Prisma and Sequelize with feature matrix and migration guide"
when-to-use: "When evaluating or migrating from Sequelize to Prisma"
keywords: ["sequelize", "comparison", "migration", "orm"]
priority: 2
requires: ["prisma-7", "databases"]
related: ["migrate-from-sequelize", "vs-typeorm", "vs-drizzle"]
---

# Prisma vs Sequelize

## Feature Comparison Matrix

| Feature | Prisma | Sequelize |
|---------|--------|-----------|
| **Type Safety** | ✅ Full (generated) | ⚠️ Basic (types required) |
| **Query Builder** | DSL-based | Chainable API |
| **Schema Definition** | `.prisma` file | Model definitions |
| **Migrations** | Built-in | Manual with umzug |
| **Database Support** | 4 databases | 8+ databases |
| **Learning Curve** | ⭐ Easier | ⭐⭐ Moderate |
| **Active Maintenance** | ✅ Very high | ✅ High |
| **Bundle Size** | ~100KB | ~200KB |

## Key Differences

### Model Definition

**Prisma: Declarative schema (SOLID: SRP - clear separation)**
```prisma
// Module: prisma/schema.prisma
// Purpose: Declarative database schema (SOLID: SRP - schema only)
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  posts     Post[]   // Relation to posts
}
```

**Sequelize: Class-based models (SOLID: Mixes concerns)**
```typescript
// Module: src/models/User.ts
// Purpose: Model definition with ORM metadata - mixing concerns (SOLID violation)
import { DataTypes, Sequelize } from "sequelize";
import type { Model, Optional } from "sequelize";

interface UserAttributes {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

/**
 * User model with mixed concerns
 * SOLID violation: Model, ORM config, and validation in one place
 */
export const User = sequelize.define<
  Model<UserAttributes, UserCreationAttributes>
>("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: { isEmail: true }, // Mixing validation
  },
  name: DataTypes.STRING,
  createdAt: DataTypes.DATE,
});
```

### Queries

**Prisma: Type-safe method calls (SOLID: DIP - abstraction via client)**
```typescript
// Module: src/queries/user.ts
// Purpose: User queries with type safety (SOLID: SRP - query layer)
import type { PrismaClient } from "@/generated/prisma/client"; // v7: generated path

/**
 * Find user by email with posts
 * Type-safe by default - compiler validates response shape
 */
async function findUserWithPosts(
  prisma: PrismaClient,
  email: string
) {
  return prisma.user.findUnique({
    where: { email },
    include: { posts: true },
  });
}
```

**Sequelize: Chainable API (SOLID: Manual type safety required)**
```typescript
// Module: src/queries/user.ts
// Purpose: User queries with manual type definitions
import type { Model } from "sequelize";
import type { Post as PostModel } from "./Post";

interface UserWithPosts extends Model {
  id: number;
  email: string;
  name: string;
  posts: PostModel[];
}

/**
 * Find user by email with posts
 * Type safety NOT guaranteed by ORM - manual annotation needed
 */
async function findUserWithPosts(
  email: string
): Promise<UserWithPosts | null> {
  return User.findOne({
    where: { email },
    include: [{ model: Post }], // No type checking on include
  }) as Promise<UserWithPosts | null>;
}
```

## Strengths & Weaknesses

### Prisma Advantages
- 🟢 Superior type safety
- 🟢 Better migration tooling
- 🟢 Simpler API
- 🟢 Better developer experience

### Prisma Limitations
- 🔴 Fewer database options
- 🔴 Less mature for complex scenarios

### Sequelize Advantages
- 🟢 Wider database support
- 🟢 Mature ecosystem
- 🟢 Flexible query builder

### Sequelize Limitations
- 🔴 Weak type safety without extra setup
- 🔴 Steeper learning curve
- 🔴 Manual migrations

## Migration Checklist

See [migrate-from-sequelize.md](./migrate-from-sequelize.md) for step-by-step instructions.
