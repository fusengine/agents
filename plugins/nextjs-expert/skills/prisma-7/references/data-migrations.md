---
name: data-migrations
description: Data migration scripts in Prisma 7 for schema transformations
when-to-use: Transforming existing data during migrations
keywords: data migration, data transformation, seed migration, migration script
priority: medium
requires: cli-reference.md
related: migration-history.md, zero-downtime.md
---

# Data Migrations

Transform data during schema migrations with TypeScript scripts.

## Data Migration File

Create scripts in `prisma/migrations/[name]/migration.ts`:

```typescript
// Module: prisma/migrations/[timestamp]_migrate_user_roles/migration.ts
// Purpose: Data transformation during schema evolution (SOLID: SRP - single data operation)
import type { PrismaClient } from "@prisma/client";

/**
 * Legacy status to modern role mapping
 * @interface RoleMap
 */
interface RoleMap {
  [key: string]: "ADMIN" | "MODERATOR" | "USER";
}

/**
 * Transform legacy user status to new role system
 * @param status - Legacy status value
 * @returns Mapped role or USER as default
 */
function mapLegacyStatusToRole(status: string): "ADMIN" | "MODERATOR" | "USER" {
  const roleMap: RoleMap = {
    admin: "ADMIN",
    moderator: "MODERATOR",
    user: "USER",
  };
  return roleMap[status] || "USER";
}

/**
 * Main migration function - updates user roles from legacy status
 * SOLID: SRP - single responsibility: data transformation
 */
async function main(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    where: { legacyStatus: { not: null } },
  });

  console.log(`Migrating ${users.length} users...`);

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: mapLegacyStatusToRole(user.legacyStatus),
        legacyStatus: null, // Remove deprecated field
      },
    });
  }

  console.log("✓ Migration complete");
}

// Execution (when run directly)
if (require.main === module) {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  main(prisma)
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
```

## Running Data Migrations

```bash
# 1. Create schema migration first
bunx prisma migrate dev --name migrate_user_roles

# 2. Run data migration
ts-node prisma/migrations/20240131120000_migrate_user_roles/migration.ts
```

## Batch Processing

Process in batches to avoid memory issues:

```typescript
// Module: lib/migrations/batch-processor.ts
// Purpose: Memory-efficient batch data transformation (SOLID: SRP - batch operation)
import type { PrismaClient } from "@prisma/client";

/**
 * Configuration for batch processing
 * @interface BatchConfig
 */
interface BatchConfig {
  /** Items per batch to process */
  batchSize: number;
  /** Log progress every N batches */
  logInterval: number;
}

/**
 * Process users in batches to avoid memory exhaustion
 * SOLID: SRP - single responsibility: batch processing logic
 */
async function processBatchUserEmails(
  prisma: PrismaClient,
  users: { id: string; email: string }[],
  config: BatchConfig = { batchSize: 1000, logInterval: 5 }
) {
  const { batchSize, logInterval } = config;
  let processed = 0;

  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);

    const updates = batch.map((u) =>
      prisma.user.update({
        where: { id: u.id },
        data: { email: u.email.toLowerCase() },
      })
    );

    await Promise.all(updates);
    processed += batch.length;

    if (processed % (batchSize * logInterval) === 0) {
      console.log(`Processed ${processed}/${users.length} users`);
    }
  }
}
```

## Best Practices

- Test locally first
- Batch large operations
- Add validation checks
- Create rollback scripts
- Keep migrations simple
