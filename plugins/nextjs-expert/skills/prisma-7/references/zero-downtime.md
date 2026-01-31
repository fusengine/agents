---
name: zero-downtime
description: Zero-downtime migrations in Prisma 7 for production safety
when-to-use: Deploying schema changes without application downtime
keywords: zero-downtime, migration, production, safe deployment, blue-green
priority: high
requires: cli-reference.md, shadow-database.md
related: hotfixing.md, data-migrations.md
---

# Zero-Downtime Migrations

Deploy database migrations without application downtime.

## Migration Strategy

1. **Expand Phase**: Add new columns/tables (backward compatible)
2. **Migrate Phase**: Move data to new schema
3. **Redirect Phase**: Update application code
4. **Contract Phase**: Remove old columns/tables

## Adding Columns (Zero-Downtime)

```sql
-- migration.sql
ALTER TABLE "users" ADD COLUMN "new_email" VARCHAR(255);
```

Write to both columns during transition.

## Adding Indexes (Safely)

```sql
-- CONCURRENT index creation (doesn't block writes)
CREATE INDEX CONCURRENTLY "idx_users_email" ON "users"("email");
```

## Deployment Strategy

1. Deploy backward-compatible schema
2. Deploy application code
3. Later - remove old schema

```bash
# Step 1: Schema with new columns
bunx prisma migrate deploy

# Step 2: Application code
npm start

# Step 3: Cleanup
bunx prisma migrate dev --name cleanup_old_schema
```

## Table Rename Pattern

```sql
-- Module: prisma/migrations/*/migration.sql
-- Purpose: Zero-downtime table rename with trigger-based synchronization (SOLID: SRP - each migration one step)

-- Migration 1: Create new table with trigger (EXPAND phase)
CREATE TABLE "user_accounts" AS SELECT * FROM "users";

CREATE TRIGGER mirror_users_to_accounts
AFTER INSERT ON "users" FOR EACH ROW
BEGIN
  INSERT INTO "user_accounts" VALUES (NEW.*);
END;

-- Migration 2: Verify counts match (VERIFY phase - not in migration, manual check)
-- SELECT COUNT(*) as legacy FROM "users";
-- SELECT COUNT(*) as new FROM "user_accounts";
-- ASSERTION: Both should be equal

-- Migration 3: Drop old table (CONTRACT phase)
DROP TRIGGER mirror_users_to_accounts ON "users";
DROP TABLE "users";
ALTER TABLE "user_accounts" RENAME TO "users";

-- Validate structural integrity (SOLID: Verification checkpoint)
-- ALTER TABLE "users" ADD CONSTRAINT pk_users_id PRIMARY KEY ("id");
```

## Deployment Checklist

- [ ] Schema change is backward compatible
- [ ] Test migration in staging
- [ ] Prepare rollback plan
- [ ] Schedule during low-traffic window
- [ ] Monitor application logs
- [ ] Verify data integrity
- [ ] Document changes

## Avoiding Common Pitfalls

- ❌ Add NOT NULL with data → Add nullable, backfill, then constraint
- ❌ Rename table during traffic → Create new, sync, drop old
- ❌ Drop column with dependencies → Verify references first
- ❌ Large migrations at peak → Batch in low-traffic window
