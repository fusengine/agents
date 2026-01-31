---
name: down-migrations
description: Generating down migrations for reversible changes in Prisma 7
when-to-use: Creating reversible database migrations
keywords: down migration, rollback, reversible migration, undo
priority: medium
requires: cli-reference.md, migration-history.md
related: hotfixing.md, zero-downtime.md
---

# Down Migrations

Create reversible migrations for safer production deployments.

## Down Migration Pattern

Prisma doesn't generate down migrations automatically, but you can create them manually.

## Directory Structure

```
prisma/migrations/
├── 20240131120000_add_users/
│   ├── migration.sql
│   └── down.sql          # Manually created
├── 20240131120100_add_posts/
│   ├── migration.sql
│   └── down.sql          # Manually created
```

## Creating Down Migrations

```sql
-- Module: prisma/migrations/[timestamp]_*/migration.sql & down.sql
-- Purpose: Reversible migrations with rollback capability (SOLID: SRP - single operation)

-- 1. ADD COLUMN (Backward compatible expansion)
-- migration.sql (up)
ALTER TABLE "users" ADD COLUMN "bio" TEXT NULL;

-- down.sql (rollback - reverse operation)
ALTER TABLE "users" DROP COLUMN "bio";

-- 2. CREATE TABLE (New entity)
-- migration.sql (up)
CREATE TABLE "posts" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- down.sql (rollback - cleanup)
DROP TABLE "posts";

-- 3. ADD INDEX (Performance optimization)
-- migration.sql (up)
CREATE INDEX "idx_email" ON "users"("email");

-- down.sql (rollback - cleanup)
DROP INDEX "idx_email";
```

## Testing Down Migrations

```bash
# 1. Apply migration
bunx prisma migrate dev --name add_feature

# 2. Execute down.sql
bunx prisma db execute --stdin < down.sql

# 3. Mark as rolled back
bunx prisma migrate resolve --rolled-back <migration_name>

# 4. Reapply if needed
bunx prisma migrate dev --name add_feature
```

## Data Loss Pattern

Use RENAME instead of DROP to preserve data:

```sql
-- migration.sql (up)
ALTER TABLE "orders" RENAME COLUMN "legacy_field" TO "legacy_field_archived";

-- down.sql (rollback)
ALTER TABLE "orders" RENAME COLUMN "legacy_field_archived" TO "legacy_field";
```

## Best Practices

- Create down migrations immediately after up migration
- Test down migrations in development
- Document data loss risks
- Never rely on down migrations for production fixes
- Keep down migrations simple and reversible
