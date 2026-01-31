---
name: "Sequelize to Prisma Migration"
description: "Step-by-step guide to migrate from Sequelize to Prisma"
when-to-use: "When migrating an existing Sequelize project to Prisma"
keywords: ["sequelize", "migration", "guide", "step-by-step"]
priority: 3
requires: ["prisma-7", "vs-sequelize"]
related: ["migrate-from-typeorm", "migrate-from-drizzle"]
---

# Migrate from Sequelize to Prisma

## Step 1: Setup Prisma

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

## Step 2: Database Introspection

```bash
# Set DATABASE_URL in .env, then:
npx prisma db pull
```

## Step 3: Convert Model Definitions

### Before (Sequelize - SOLID: Mixes concerns)
```typescript
// Module: src/models/User.ts
// Purpose: MIXED - Model definition, ORM metadata, validation (SOLID violation)
export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }, // Validation mixed with schema
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
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
}
```

## Step 4: Association → Relations

### Sequelize Associations
```typescript
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

// Many-to-Many
Post.belongsToMany(Tag, { through: 'PostTag' });
Tag.belongsToMany(Post, { through: 'PostTag' });
```

### Prisma Relations
```prisma
model User {
  id    Int
  posts Post[]
}

model Post {
  id     Int
  userId Int
  user   User @relation(fields: [userId], references: [id])
  tags   Tag[]
}

model Tag {
  id    Int
  posts Post[]
}

// Prisma auto-creates junction table
```

## Step 5: Query Migration

```typescript
// Module: src/services/user.service.ts
// Purpose: User queries (SOLID: SRP - query logic only)
import { Op } from "sequelize";
import type { Prisma } from "@prisma/client";

/**
 * Find by primary key
 * SOLID: DIP - depend on abstraction layer
 */
// Sequelize
const user = await User.findByPk(1);
// Prisma (type-safe)
const user = await prisma.user.findUnique({ where: { id: 1 } });

/**
 * Find with relations
 */
// Sequelize (manual type casting)
const user = await User.findByPk(1, { include: [Post] });
// Prisma (type-safe by default)
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },
});

/**
 * Find all
 */
// Sequelize
const users = await User.findAll();
// Prisma
const users = await prisma.user.findMany();

/**
 * Simple WHERE
 */
// Sequelize
const users = await User.findAll({
  where: { role: "admin" },
});
// Prisma
const users = await prisma.user.findMany({
  where: { role: "admin" },
});

/**
 * Complex WHERE with OR
 */
// Sequelize (manual operator syntax)
const users = await User.findAll({
  where: {
    [Op.or]: [
      { email: "user@example.com" },
      { role: "admin" },
    ],
  },
});
// Prisma (explicit OR)
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: "user@example.com" },
      { role: "admin" },
    ],
  },
});

/**
 * Create
 */
// Sequelize
const user = await User.create({ email: "new@example.com" });
// Prisma
const user = await prisma.user.create({
  data: { email: "new@example.com" },
});

/**
 * Update
 */
// Sequelize
await User.update({ name: "New" }, { where: { id: 1 } });
// Prisma
await prisma.user.update({
  where: { id: 1 },
  data: { name: "New" },
});

/**
 * Delete
 */
// Sequelize
await User.destroy({ where: { id: 1 } });
// Prisma
await prisma.user.delete({ where: { id: 1 } });
```

## Step 6: Validation Migration

Sequelize uses validators in model definition. Move to application layer:

```typescript
// Sequelize validators
{
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
      len: [1, 255]
    }
  }
}

// Prisma: Use separate validation library (zod, joi, etc.)
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255)
});
```

## Step 7: Hooks/Middleware Migration

```typescript
// Sequelize hooks
User.beforeCreate(async (user) => {
  user.email = user.email.toLowerCase();
});

// Prisma: Use middleware or application logic
const user = await prisma.user.create({
  data: {
    email: email.toLowerCase()
  }
});

// Or use Prisma middleware
prisma.$use(async (params, next) => {
  if (params.action === 'create' && params.model === 'User') {
    params.args.data.email = params.args.data.email.toLowerCase();
  }
  return next(params);
});
```

## Step 8: Transaction Migration

```typescript
// Module: src/services/transaction.service.ts
// Purpose: Database transactions (SOLID: SRP - transactional operations)
import type { Prisma } from "@prisma/client";

/**
 * Sequelize: Manual transaction management
 * SOLID violation: Client manages transaction state explicitly
 */
async function sequelizeTransaction() {
  const transaction = await sequelize.transaction();
  try {
    await User.create({ email: "new@example.com" }, { transaction });
    await Post.create({ title: "New" }, { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

/**
 * Prisma: Implicit transaction management
 * SOLID: DIP - Prisma abstracts transaction handling
 */
async function prismaTransaction(prisma: Prisma.PrismaClient) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: "new@example.com" },
    });
    const post = await tx.post.create({
      data: { title: "New" },
    });
    return { user, post };
  });
}
```

## Step 9: Migration & Cleanup

```bash
# Apply new migrations
npx prisma migrate dev --name initial

# Uninstall Sequelize
npm uninstall sequelize sqlite3 mysql2 pg pg-hstore
```

## Checklist

- [ ] Database introspected
- [ ] All models converted
- [ ] All associations converted to relations
- [ ] All queries updated
- [ ] Validations moved to application layer
- [ ] Hooks migrated
- [ ] Transactions updated
- [ ] Tests passing
- [ ] Sequelize removed
