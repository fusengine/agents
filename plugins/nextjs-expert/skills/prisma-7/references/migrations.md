---
name: migrations
description: Prisma 7 migrations workflow for development and production
when-to-use: Creating, applying, and managing database migrations
keywords: migrate, dev, deploy, reset, seed, squash
priority: high
requires: schema.md
related: installation.md
---

# Prisma Migrations

Type definitions in `/references/interfaces/migrations.types.md`.

## Development Workflow

```bash
# Create and apply migration
bunx prisma migrate dev --name add_user_table

# Reset database (drops all data)
bunx prisma migrate reset

# Generate client without migration
bunx prisma generate
```

---

## Production Deployment

```bash
# Apply pending migrations (CI/CD)
bunx prisma migrate deploy

# Check migration status
bunx prisma migrate status
```

---

## Migration Commands

| Command | Purpose |
|---------|---------|
| `migrate dev` | Create + apply migration (dev only) |
| `migrate deploy` | Apply pending migrations (prod) |
| `migrate reset` | Drop DB + reapply all migrations |
| `migrate status` | Check pending migrations |
| `db push` | Push schema without migration history |

---

## Seeding

```typescript
/**
 * Seed script entry point.
 * Executes environment-specific data initialization.
 * See SeedFn and EnvironmentSeedStrategy in /interfaces/migrations.types.md
 * Path: prisma/seed.ts
 */
import { prisma } from '../src/modules/cores/db/prisma'

/**
 * Main seed function.
 * Clears existing data and creates initial records.
 * @returns {Promise<void>}
 */
async function main() {
  // Clear existing data
  await prisma.user.deleteMany()

  // Create seed data
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  console.log('Seeded:', { admin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

```json
// package.json
{
  "prisma": {
    "seed": "bun run prisma/seed.ts"
  }
}
```

```bash
# Run seed
bunx prisma db seed
```

---

## Custom Migration

```bash
# Create empty migration for manual SQL
bunx prisma migrate dev --name add_extension --create-only
```

```sql
-- prisma/migrations/xxx_add_extension/migration.sql
-- Add PostgreSQL extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom index
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

```bash
# Apply custom migration
bunx prisma migrate dev
```

---

## Data Migration

```sql
-- prisma/migrations/xxx_migrate_data/migration.sql
-- Migrate existing data
UPDATE users SET role = 'USER' WHERE role IS NULL;

-- Backfill computed column
UPDATE posts SET slug = lower(replace(title, ' ', '-'));
```

---

## Squashing Migrations

```bash
# 1. Backup current data
bunx prisma db dump > backup.sql

# 2. Delete migration folder
rm -rf prisma/migrations

# 3. Create fresh migration
bunx prisma migrate dev --name init

# 4. Restore data if needed
```

---

## Baselining (Existing DB)

```bash
# Mark existing DB as having migration applied
bunx prisma migrate resolve --applied "20240101000000_init"
```

---

## Best Practices

1. **Small migrations** - One change per migration
2. **Descriptive names** - `add_user_email_index`
3. **Review before apply** - Check generated SQL
4. **Seed after reset** - Automatic with `db seed`
5. **Never edit applied** - Create new migration instead
