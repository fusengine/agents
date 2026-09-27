---
title: "Audit Logging"
description: "Audit trails, change tracking, versioning, and compliance logging"
tags: ["audit", "logging", "compliance", "change-tracking", "versioning"]
---

# Audit Logging

Maintain comprehensive audit trails to track all database changes for compliance and debugging.

## Create Audit Table

```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(255) NOT NULL,
  record_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by VARCHAR(255),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(50)
);
```

## Prisma Audit Implementation

### Client Extension Approach

`$use` middleware was removed in Prisma 7 — use a `query` Client Extension instead.

```typescript
import { PrismaClient } from './generated/prisma/client'; // v7: generated path
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const basePrisma = new PrismaClient({ adapter });

/**
 * Audit extension to log all changes (writes the log with the base client)
 */
export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const result = await query(args);

        // Log create/update/delete operations
        if (['create', 'update', 'delete'].includes(operation)) {
          await logAuditTrail({
            tableName: model,
            recordId: (result as { id: number }).id,
            action: operation.toUpperCase(),
            newValues: (args as { data?: unknown }).data,
            oldValues: undefined,
            changedBy: 'system',
            ipAddress: undefined
          });
        }

        return result;
      }
    }
  }
});

/**
 * Log audit trail to database
 */
async function logAuditTrail(audit: {
  tableName: string;
  recordId: number;
  action: string;
  newValues: any;
  oldValues?: any;
  changedBy: string;
  ipAddress?: string;
}) {
  await basePrisma.$executeRaw`
    INSERT INTO audit_log
    (table_name, record_id, action, new_values, old_values, changed_by, ip_address)
    VALUES (
      ${audit.tableName},
      ${audit.recordId},
      ${audit.action},
      ${JSON.stringify(audit.newValues)},
      ${JSON.stringify(audit.oldValues)},
      ${audit.changedBy},
      ${audit.ipAddress}
    )
  `;
}
```

## Change Tracking

### Store Previous State

```typescript
/**
 * Update with change tracking
 */
async function updateUserWithAudit(
  id: number,
  data: any,
  userId: string
) {
  // Get old values
  const oldUser = await prisma.user.findUnique({ where: { id } });

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id },
    data
  });

  // Log changes
  const changes = Object.keys(data).reduce((acc, key) => {
    if (oldUser[key] !== data[key]) {
      acc[key] = { old: oldUser[key], new: data[key] };
    }
    return acc;
  }, {} as Record<string, any>);

  await prisma.auditLog.create({
    data: {
      tableName: 'users',
      recordId: id,
      action: 'UPDATE',
      oldValues: oldUser,
      newValues: updatedUser,
      changes: JSON.stringify(changes),
      changedBy: userId
    }
  });

  return updatedUser;
}
```

## Versioning Pattern

```prisma
// schema.prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String
  version   Int       @default(1)
  versions  UserVersion[]
}

model UserVersion {
  id        Int    @id @default(autoincrement())
  userId    Int
  user      User   @relation(fields: [userId], references: [id])
  data      Json
  version   Int
  createdAt DateTime @default(now())
}
```

## Querying Audit Logs

```typescript
/**
 * Get all changes for a record
 */
const auditTrail = await prisma.auditLog.findMany({
  where: {
    tableName: 'users',
    recordId: userId
  },
  orderBy: { changedAt: 'desc' }
});

/**
 * Get changes by user
 */
const userChanges = await prisma.auditLog.findMany({
  where: {
    changedBy: currentUserId
  },
  orderBy: { changedAt: 'desc' },
  take: 100
});

/**
 * Get changes in date range
 */
const recentChanges = await prisma.auditLog.findMany({
  where: {
    changedAt: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31')
    }
  }
});
```

## Best Practices

- **Log all changes** - Create, update, delete operations
- **Include metadata** - User ID, IP address, timestamp
- **Store full state** - Both old and new values
- **Archive logs** - Move old logs to archive table
- **Set retention** - Keep logs for compliance period
- **Secure logs** - Restrict access to audit data

## SOLID Architecture Integration

### Module Path
`app/lib/audit/audit-logger.ts`

### Type Definition
```typescript
/**
 * Audit logging types
 * @module app/lib/audit/types
 */

/**
 * Audit log entry for database changes
 */
export type AuditLogEntry = {
  /** Database table name */
  tableName: string;
  /** Record primary key */
  recordId: number;
  /** Operation type */
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  /** New values after operation */
  newValues: Record<string, any>;
  /** Previous values before operation */
  oldValues?: Record<string, any>;
  /** User who made the change */
  changedBy: string;
  /** Client IP address */
  ipAddress?: string;
  /** When change occurred */
  changedAt: Date;
};

/**
 * Query result for audit trail retrieval
 */
export type AuditQueryResult = {
  entries: AuditLogEntry[];
  total: number;
  page: number;
};
```

### Safe Implementation
```typescript
/**
 * Audit trail management and logging
 * @module app/lib/audit/audit-service
 */

import { Prisma } from '@/lib/generated/prisma/client'; // v7: generated path
import { prisma } from '@/lib/prisma';
import type { AuditLogEntry, AuditQueryResult } from './types';

/**
 * Logs database changes to audit trail
 * @param entry - Audit log entry to record
 * @throws {Error} If audit log insert fails
 */
export async function logAuditTrail(entry: AuditLogEntry): Promise<void> {
  await prisma.$executeRaw`
    INSERT INTO audit_log
    (table_name, record_id, action, new_values, old_values, changed_by, ip_address, changed_at)
    VALUES (
      ${entry.tableName},
      ${entry.recordId},
      ${entry.action},
      ${JSON.stringify(entry.newValues)},
      ${JSON.stringify(entry.oldValues || {})},
      ${entry.changedBy},
      ${entry.ipAddress || null},
      ${entry.changedAt}
    )
  `;
}

/**
 * Query audit logs for specific record
 * @module app/lib/audit/audit-query
 */

/**
 * Retrieves audit history for a record
 * @param tableName - Table name to query
 * @param recordId - Record ID to retrieve history for
 * @returns {Promise} Audit trail entries
 */
export async function getAuditHistory(
  tableName: string,
  recordId: number
): Promise<AuditLogEntry[]> {
  const logs = await prisma.$queryRaw<AuditLogEntry[]>`
    SELECT
      table_name as tableName,
      record_id as recordId,
      action,
      new_values as newValues,
      old_values as oldValues,
      changed_by as changedBy,
      ip_address as ipAddress,
      changed_at as changedAt
    FROM audit_log
    WHERE table_name = ${tableName}
    AND record_id = ${recordId}
    ORDER BY changed_at DESC
  `;

  return logs;
}

/**
 * Creates a Prisma Client extension for automatic audit logging
 * (v7: `$use` middleware removed — use `$extends` query extensions)
 * @module app/lib/audit/audit-extension
 */

/**
 * Extension to automatically log all database changes
 * @param currentUserId - User ID making the change
 * @returns Prisma Client extension, apply with `prisma.$extends(createAuditExtension(id))`
 */
export function createAuditExtension(currentUserId: string) {
  return Prisma.defineExtension({
    name: 'audit',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const result = await query(args);

          if (operation === 'create' || operation === 'update' || operation === 'delete') {
            const entry: AuditLogEntry = {
              tableName: model,
              recordId: (result as { id: number }).id,
              action: operation.toUpperCase() as AuditLogEntry['action'],
              newValues: (args as { data?: Record<string, any> }).data || {},
              changedBy: currentUserId,
              changedAt: new Date()
            };

            await logAuditTrail(entry);
          }

          return result;
        }
      }
    }
  });
}
```
