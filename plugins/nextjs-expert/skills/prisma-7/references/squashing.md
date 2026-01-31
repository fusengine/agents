---
name: squashing
description: Squashing migrations in Prisma 7 for cleaner history
when-to-use: Consolidating multiple migrations into one
keywords: squash, compress migrations, migration cleanup, migration consolidation
priority: medium
requires: cli-reference.md, migration-history.md
related: hotfixing.md
---

# Squashing Migrations

Combine multiple migrations into a single migration for cleaner history.

## When to Squash

- After many small development migrations
- Before first production deployment
- To clean up messy migration history
- Reduce migration file count
- Simplify review for new developers

## Squashing Workflow

```bash
# 1. Backup database
pg_dump myapp > backup.sql

# 2. Identify migrations to squash
bunx prisma migrate status

# 3. Reset to baseline
bunx prisma migrate resolve --rolled-back "20240131000100_add_users"
bunx prisma migrate resolve --rolled-back "20240131000200_add_posts"

# 4. Create single squashed migration
bunx prisma migrate dev --name init

# Creates combined migration with all schema changes
```

## Squashed Migration Example

```sql
-- Module: prisma/migrations/[timestamp]_init/migration.sql
-- Purpose: Consolidated baseline migration combining multiple changes (SOLID: SRP)
-- Squashed migrations from development before production deployment
BEGIN
  -- User entity (SOLID: SRP - single responsibility)
  CREATE TABLE "users" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  -- Post entity with foreign key relationship (SOLID: Dependency via FK)
  CREATE TABLE "posts" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
  );

  -- Performance optimization
  CREATE INDEX "idx_posts_user_id" ON "posts"("user_id");
END;
```

## Best Practices

- Squash before first production deployment
- Never squash after production rollout
- Always backup before squashing
- Test thoroughly after squashing
- Document squashing in commit message
