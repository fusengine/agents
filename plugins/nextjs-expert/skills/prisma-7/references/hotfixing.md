---
name: hotfixing
description: Production hotfixes and emergency migrations in Prisma 7
when-to-use: Critical production database fixes
keywords: hotfix, emergency migration, production fix, critical patch
priority: critical
requires: cli-reference.md, zero-downtime.md
related: shadow-database.md, down-migrations.md
---

# Production Hotfixes

Emergency database migrations for critical production issues.

## Hotfix Workflow

```bash
# 1. Create hotfix branch
git checkout -b hotfix/critical-db-issue

# 2. Create emergency migration
bunx prisma migrate dev --name fix_critical_issue

# 3. Review migration.sql carefully
cat prisma/migrations/20240131150000_fix_critical_issue/migration.sql

# 4. Test in staging (if time allows)
# 5. Deploy immediately to production
bunx prisma migrate deploy

# 6. Merge to main
git checkout main && git merge hotfix/critical-db-issue
```

## Emergency Rollback

```bash
# If migration causes issues after deploy:

# 1. Run down migration (if exists)
bunx prisma migrate resolve --rolled-back "20240131150000_fix_critical_issue"

# 2. Restore data if needed
bunx prisma db execute --stdin < recovery.sql

# 3. Create corrected migration
bunx prisma migrate dev --name fix_critical_issue_v2
```

## Hotfix Pattern: Data Corruption

```sql
-- Module: prisma/migrations/[timestamp]_fix_data_integrity/migration.sql
-- Purpose: Emergency production fix for orphaned records (SOLID: SRP - single fix)
-- CRITICAL: Production hotfix - maintain referential integrity

-- Data cleanup: Remove orphaned records violating constraints
DELETE FROM "comments" WHERE "post_id" NOT IN (
  SELECT "id" FROM "posts"
);

-- Add constraint to prevent future orphaned records (SOLID: DIP - enforce dependencies)
ALTER TABLE "comments" ADD CONSTRAINT "fk_post_id"
  FOREIGN KEY ("post_id") REFERENCES "posts"("id")
  ON DELETE CASCADE;

-- Verify data integrity
-- SELECT COUNT(*) as orphaned_count
-- FROM "comments"
-- WHERE "post_id" NOT IN (SELECT "id" FROM "posts");
```

## Production Safety Checklist

- [ ] Backup database before deployment
- [ ] Test migration in staging (if possible)
- [ ] Have rollback plan ready
- [ ] Coordinate with team
- [ ] Schedule during low-traffic window
- [ ] Monitor for 1+ hour after deployment
- [ ] Document issue and fix

## Preventing Hotfixes

1. Test migrations in staging
2. Use shadow database before production
3. Code review migrations
4. Monitor database activity
5. Implement constraints early
