---
name: migration-history
description: Managing migration history and status in Prisma 7
when-to-use: Tracking, understanding, and resolving migration issues
keywords: migration history, status, metadata, rolled back, skipped
priority: medium
requires: cli-reference.md
related: migration.md, hotfixing.md, squashing.md
---

# Migration History Management

Track and manage your Prisma migration history and status.

## Viewing Migration History

```bash
# Check migration status
bunx prisma migrate status

# Output:
# Following migrations have not yet been applied:
#   migrations/
#     └─ 20240131120000_add_user_role

# Current state of the database:
#   Migrations table created at 2024-01-31 12:00 UTC
#   Baseline migration 20240131000000_init already applied
```

## _prisma_migrations Table

```typescript
// Module: prisma/schema
// Purpose: Type definition for migration metadata (SOLID: ISP - Interface Segregation)
/**
 * Migration metadata stored in _prisma_migrations table
 * @interface MigrationRecord
 */
interface MigrationRecord {
  /** Unique migration identifier */
  id: string;
  /** SHA256 checksum of migration SQL */
  checksum: string;
  /** ISO timestamp when migration finished */
  finished_at: Date | null;
  /** Execution time in milliseconds */
  execution_time: number;
  /** Migration file name */
  name: string;
  /** Prisma CLI logs during migration */
  logs: string | null;
  /** Timestamp when migration was rolled back */
  rolled_back_at: Date | null;
  /** ISO timestamp when migration started */
  started_at: Date;
  /** Batch number for grouped migrations */
  applied_in_batch: number;
}
```

Stores metadata: id, checksum, finished_at, execution_time, name, logs, rolled_back_at, started_at, applied_in_batch.

## Resolving Migration Issues

### Applied Migration Marked as Pending

```bash
# Mark migration as applied without running
bunx prisma migrate resolve --applied "20240131120000_init"

# Useful for:
# - Migrations manually applied to database
# - External schema changes
# - Recovery from corruption
```

### Rolled Back Migration

```bash
# Mark migration as rolled back
bunx prisma migrate resolve --rolled-back "20240131120000_init"

# Then recreate migration
bunx prisma migrate dev --name add_user_role
```

## Baseline Migrations

```bash
# Create baseline for existing database
bunx prisma migrate dev --name init
# Creates baseline record in _prisma_migrations
```

## Safety Checks

- Always run `migrate status` before deployment
- Review pending migrations before deploying
- Never skip migrations in production
- Keep migration history intact
- Backup before resolving conflicts
