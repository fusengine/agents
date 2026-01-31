---
description: "Prisma 7 Migration Types and Interfaces"
keywords: migrate, migration, status, deploy, seed
---

# Migration Type Interfaces

## Migration Workflow

```typescript
/**
 * Migration development workflow configuration.
 * @param {string} name - Migration name (descriptive)
 * @param {boolean} [createOnly] - Create empty migration without applying
 * @param {boolean} [skipGenerate] - Skip Prisma Client generation
 * @module modules/database/src/interfaces/migrations.types
 */
export interface MigrationDevOptions {
  name: string
  createOnly?: boolean
  skipGenerate?: boolean
}

/**
 * Production migration deployment configuration.
 * @param {string} [environment] - Environment name (for logging)
 * @param {boolean} [dryRun] - Show SQL without executing
 */
export interface MigrationDeployOptions {
  environment?: "production" | "staging"
  dryRun?: boolean
}

/**
 * Migration status information.
 * @param {string} name - Migration identifier
 * @param {Date} appliedAt - Application timestamp
 * @param {number} duration - Execution duration (ms)
 * @param {boolean} failed - Migration failure flag
 */
export interface MigrationStatus {
  name: string
  appliedAt: Date
  duration: number
  failed: boolean
}
```

## Seeding

```typescript
/**
 * Database seed function type.
 * Must handle connection cleanup via prisma.$disconnect().
 * @returns {Promise<void>} Seed operation result
 */
export type SeedFn = () => Promise<void>

/**
 * Seed configuration in package.json.
 * @param {string} seed - Script path or command (bun run prisma/seed.ts)
 * @example
 * {
 *   "prisma": {
 *     "seed": "bun run prisma/seed.ts"
 *   }
 * }
 */
export interface PrismaPackageConfig {
  seed: string
}

/**
 * Environment-specific seed strategy.
 * @param {() => Promise<void>} development - Dev seed data (Faker)
 * @param {() => Promise<void>} test - Test data (minimal)
 * @param {() => Promise<void>} production - Essential data (admin, config)
 */
export interface EnvironmentSeedStrategy {
  development: () => Promise<void>
  test: () => Promise<void>
  production: () => Promise<void>
}
```

## Custom Migrations

```typescript
/**
 * Custom SQL migration metadata.
 * @param {string} name - Migration identifier
 * @param {string} sqlPath - Path to migration.sql file
 * @param {string} type - Migration category (extension, index, data)
 */
export interface CustomMigration {
  name: string
  sqlPath: string
  type: "extension" | "index" | "data" | "constraint"
}

/**
 * Data migration operation.
 * @param {string} description - Migration purpose
 * @param {string} sql - SQL update statement
 */
export interface DataMigration {
  description: string
  sql: string
}
```

## Baselining

```typescript
/**
 * Baseline migration for existing databases.
 * Marks migration as applied without running.
 * @param {string} migrationName - Migration identifier to mark
 */
export interface BaselineMigrationOptions {
  migrationName: string
}
```
