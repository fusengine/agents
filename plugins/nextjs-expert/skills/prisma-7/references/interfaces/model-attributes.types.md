---
description: "Prisma 7 Model Attributes Types and Interfaces"
keywords: composite-key, composite-index, constraint, model-mapping
---

# Model Attributes Type Interfaces

## Composite Keys

```typescript
/**
 * Composite primary key configuration.
 * Multiple fields together form unique identifier.
 * Common in junction/bridge tables.
 * @param {string[]} fields - Field names in composite key
 * @param {string} [description] - Use case documentation
 * @module modules/database/src/interfaces/model-attributes.types
 * @example
 * // Many-to-many junction table
 * {
 *   fields: ["studentId", "courseId"],
 *   description: "Unique enrollment"
 * }
 */
export interface CompositeKey {
  fields: string[]
  description?: string
}

/**
 * Query by composite key.
 * Requires all key fields in where condition.
 * @example
 * await prisma.studentCourse.findUnique({
 *   where: {
 *     studentId_courseId: {
 *       studentId: 1,
 *       courseId: 5
 *     }
 *   }
 * })
 */
export interface CompositeKeyQuery {
  [composite: string]: Record<string, unknown>
}
```

## Composite Unique Constraints

```typescript
/**
 * Composite unique constraint configuration.
 * Multiple fields combination must be unique.
 * @param {string[]} fields - Field names in constraint
 * @param {string} [description] - Business rule
 * @example
 * // Email unique per domain
 * {
 *   fields: ["email", "domain"],
 *   description: "Same email allowed in different domains"
 * }
 */
export interface CompositeUniqueConstraint {
  fields: string[]
  description?: string
}

/**
 * Query by composite unique constraint.
 * @example
 * await prisma.user.findUnique({
 *   where: {
 *     email_domain: {
 *       email: "user@example.com",
 *       domain: "example.com"
 *     }
 *   }
 * })
 */
export interface CompositeUniqueQuery {
  [constraint: string]: Record<string, unknown>
}
```

## Indexes

```typescript
/**
 * Index type configuration.
 */
export enum IndexType {
  /** Standard B-tree index */
  Standard = "standard",

  /** Full-text search index (PostgreSQL) */
  FullText = "fulltext",

  /** Hash index (PostgreSQL) */
  Hash = "hash",

  /** GIN index (PostgreSQL, JSON) */
  GIN = "gin"
}

/**
 * Index configuration for query optimization.
 * @param {string[]} fields - Indexed fields
 * @param {IndexType} [type] - Index type
 * @param {boolean} [isUnique] - Enforces uniqueness
 * @param {string} [name] - Index identifier
 * @param {string} [description] - Performance rationale
 */
export interface IndexConfig {
  fields: string[]
  type?: IndexType
  isUnique?: boolean
  name?: string
  description?: string
}

/**
 * Composite index for multi-field queries.
 * Order matters for performance.
 * @param {string[]} fields - Ordered fields in index
 * @param {string} useCase - Query pattern description
 */
export interface CompositeIndex {
  fields: string[]
  useCase: string
}

/**
 * Full-text search index (PostgreSQL).
 * @param {string[]} fields - Text fields to index
 * @param {string} language - Search language
 */
export interface FullTextIndex {
  fields: string[]
  language: string
}
```

## Model Name Mapping

```typescript
/**
 * Model to database table name mapping.
 * Bridge PascalCase models to snake_case tables.
 * @param {string} prismaName - Prisma model name
 * @param {string} dbTableName - Database table name
 * @param {string} [reason] - Legacy/convention reason
 */
export interface ModelNameMap {
  prismaName: string
  dbTableName: string
  reason?: string
}

/**
 * Legacy database naming conventions.
 * @param {ModelNameMap[]} mappings - Model to table mappings
 */
export interface LegacyNamingStrategy {
  mappings: ModelNameMap[]
}
```

## Discriminator Fields

```typescript
/**
 * Discriminator field for single-table inheritance.
 * Type field distinguishes different record variants.
 * @param {string} fieldName - Discriminator field name
 * @param {string[]} values - Discriminator values
 * @param {Record<string, string[]>} conditionalFields - Fields per value
 * @example
 * {
 *   fieldName: "type",
 *   values: ["PERSONAL", "BUSINESS"],
 *   conditionalFields: {
 *     PERSONAL: ["ssn"],
 *     BUSINESS: ["taxId", "companyName"]
 *   }
 * }
 */
export interface DiscriminatorConfig {
  fieldName: string
  values: string[]
  conditionalFields: Record<string, string[]>
}

/**
 * Single-table inheritance schema.
 * One table stores multiple entity types.
 */
export interface SingleTableInheritance {
  discriminator: DiscriminatorConfig
  description: string
}
```

## Soft Deletes

```typescript
/**
 * Soft delete pattern configuration.
 * Marks deleted but preserves data.
 * @param {string} timestamp field - Usually "deletedAt"
 * @param {string} [description] - Implementation notes
 */
export interface SoftDeleteConfig {
  timestampField: string
  description?: string
}

/**
 * Soft delete query helpers.
 * Standard patterns for active/archived records.
 */
export interface SoftDeletePatterns {
  /** Query active records: deletedAt IS NULL */
  activeFilter: Record<string, unknown>

  /** Query deleted records: deletedAt IS NOT NULL */
  deletedFilter: Record<string, unknown>

  /** Soft delete update: set deletedAt to now() */
  softDeleteUpdate: Record<string, unknown>

  /** Restore: set deletedAt to null */
  restoreUpdate: Record<string, unknown>
}
```

## Conflict Handling

```typescript
/**
 * Unique constraint conflict strategy.
 */
export enum ConflictStrategy {
  /** Throw error on duplicate */
  Error = "error",

  /** Skip duplicate on batch insert */
  Skip = "skip",

  /** Update existing on duplicate */
  Update = "update"
}

/**
 * Upsert operation configuration.
 * Create if not exists, update if exists.
 * @param {string} field - Unique identifying field
 * @param {Record<string, unknown>} create - Create data
 * @param {Record<string, unknown>} update - Update data
 */
export interface UpsertConfig {
  field: string
  create: Record<string, unknown>
  update: Record<string, unknown>
}
```
