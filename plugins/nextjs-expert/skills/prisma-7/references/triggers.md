---
name: triggers
description: Database triggers for audit logging, auto-updates, and event handling
when-to-use: Automatic database operations, audit trails, and data synchronization
keywords: trigger, audit-log, before-after, event-handling, timestamp-update
priority: medium
requires: null
related: extensions.md, middleware.md
---

# Prisma 7 Database Triggers

## Basic Trigger Setup

```sql
-- prisma/migrations/20240101000000_create_triggers/migration.sql

-- Update timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_update_timestamp
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER post_update_timestamp
BEFORE UPDATE ON "Post"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

---

## Audit Logging Trigger

```sql
-- Create audit table
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  record_id TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by TEXT,
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (
    id, table_name, operation, record_id,
    old_values, new_values, changed_at
  ) VALUES (
    gen_random_uuid()::TEXT,
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(NEW.id, OLD.id)::TEXT,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    NOW()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER user_audit
AFTER INSERT OR UPDATE OR DELETE ON "User"
FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER post_audit
AFTER INSERT OR UPDATE OR DELETE ON "Post"
FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

---

## Computed Column Trigger

```sql
-- Maintain denormalized count column
CREATE OR REPLACE FUNCTION update_user_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE "User"
    SET post_count = post_count + 1
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE "User"
    SET post_count = post_count - 1
    WHERE id = OLD.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_count_trigger
AFTER INSERT OR DELETE ON "Post"
FOR EACH ROW
EXECUTE FUNCTION update_user_post_count();
```

---

## Accessing Audit Logs

```typescript
// modules/cores/db/interfaces/audit-log.ts
/**
 * Audit log entry from database trigger
 */
export interface AuditLogEntry {
  id: string
  operation: string
  oldValues: any
  newValues: any
  changedAt: Date
}

/**
 * Change history entry
 */
export interface ChangeHistoryEntry {
  timestamp: Date
  action: string
  changes: Record<string, any> | null
}
```

```typescript
// modules/cores/db/repositories/audit-log-repository.ts
import type { AuditLogEntry, ChangeHistoryEntry } from '../interfaces/audit-log'

/**
 * Get audit log for specific record
 * @param prisma - Prisma Client instance
 * @param tableName - Table name
 * @param recordId - Record ID
 * @returns Audit log entries
 */
export async function getAuditLog(
  prisma: PrismaClient,
  tableName: string,
  recordId: string
): Promise<AuditLogEntry[]> {
  return prisma.$queryRaw<AuditLogEntry[]>`
    SELECT id, operation, old_values as "oldValues", new_values as "newValues", changed_at as "changedAt"
    FROM audit_log
    WHERE table_name = ${tableName}
      AND record_id = ${recordId}
    ORDER BY changed_at DESC
    LIMIT 100
  `
}

/**
 * Get formatted change history for user
 * @param prisma - Prisma Client instance
 * @param userId - User ID
 * @returns Change history entries
 */
export async function getChangeHistory(
  prisma: PrismaClient,
  userId: string
): Promise<ChangeHistoryEntry[]> {
  const logs = await getAuditLog(prisma, 'User', userId)

  return logs.map((log) => ({
    timestamp: log.changedAt,
    action: log.operation,
    changes: getChangedFields(log.oldValues, log.newValues),
  }))
}

/**
 * Extract changed fields from old and new values
 * @param oldVals - Previous values
 * @param newVals - New values
 * @returns Dictionary of changes or null
 */
function getChangedFields(
  oldVals: any,
  newVals: any
): Record<string, any> | null {
  if (!oldVals || !newVals) return null

  const changes: Record<string, any> = {}
  for (const key of Object.keys(newVals)) {
    if (oldVals[key] !== newVals[key]) {
      changes[key] = { from: oldVals[key], to: newVals[key] }
    }
  }
  return changes
}
```

---

## Cascading Trigger Safety

```typescript
// modules/cores/db/repositories/trigger-control.ts
/**
 * Disable triggers on tables for bulk operations
 * @param prisma - Prisma Client instance
 */
export async function disableTriggers(
  prisma: PrismaClient
): Promise<void> {
  await prisma.$executeRaw`
    ALTER TABLE "User" DISABLE TRIGGER user_audit;
    ALTER TABLE "Post" DISABLE TRIGGER post_audit;
  `
}

/**
 * Re-enable triggers after bulk operations
 * @param prisma - Prisma Client instance
 */
export async function enableTriggers(
  prisma: PrismaClient
): Promise<void> {
  await prisma.$executeRaw`
    ALTER TABLE "User" ENABLE TRIGGER user_audit;
    ALTER TABLE "Post" ENABLE TRIGGER post_audit;
  `
}

/**
 * Execute operation with triggers disabled
 * @template T - Return type
 * @param prisma - Prisma Client instance
 * @param operation - Async operation to execute
 * @returns Operation result
 */
export async function bulkOperationWithTriggers<T>(
  prisma: PrismaClient,
  operation: () => Promise<T>
): Promise<T> {
  await disableTriggers(prisma)
  try {
    return await operation()
  } finally {
    await enableTriggers(prisma)
  }
}
```

---

## Trigger Validation

```typescript
// modules/cores/db/interfaces/trigger-info.ts
/**
 * Database trigger information
 */
export interface TriggerInfo {
  triggerName: string
  eventManipulation: string
  eventObject: string
  actionStatement: string
}
```

```typescript
// modules/cores/db/repositories/trigger-validation.ts
import type { TriggerInfo } from '../interfaces/trigger-info'

/**
 * Validate and list active triggers
 * @param prisma - Prisma Client instance
 * @returns List of active triggers
 */
export async function validateUserTriggers(
  prisma: PrismaClient
): Promise<TriggerInfo[]> {
  const triggers = await prisma.$queryRaw<TriggerInfo[]>`
    SELECT
      trigger_name as "triggerName",
      event_manipulation as "eventManipulation",
      event_object as "eventObject",
      action_statement as "actionStatement"
    FROM information_schema.triggers
    WHERE trigger_schema NOT IN ('pg_catalog', 'information_schema')
    AND event_object_table IN ('User', 'Post')
  `

  console.log('Active triggers:', triggers)
  return triggers
}
```

---

## Sync External Systems

```sql
-- Trigger for syncing to external service
CREATE OR REPLACE FUNCTION sync_user_to_cache()
RETURNS TRIGGER AS $$
BEGIN
  -- Would call an external function
  -- PERFORM http_post('https://api.example.com/sync', to_jsonb(NEW));

  -- Or update cache table
  INSERT INTO user_cache (user_id, data, synced_at)
  VALUES (NEW.id, row_to_json(NEW), NOW())
  ON CONFLICT (user_id) DO UPDATE
  SET data = EXCLUDED.data, synced_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_sync
AFTER INSERT OR UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION sync_user_to_cache();
```
