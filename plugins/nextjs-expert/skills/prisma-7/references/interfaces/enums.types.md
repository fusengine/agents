---
description: "Prisma 7 Enum Types and Interfaces"
keywords: enum, constant, status, role, type-safe
---

# Enum Type Interfaces

## Basic Enums

```typescript
/**
 * Enum value definition.
 * Single uppercase constant with optional metadata.
 * @param {string} value - Enum value (UPPERCASE)
 * @param {string} [description] - Value semantics
 * @param {string} [example] - Usage context
 * @module modules/database/src/interfaces/enums.types
 */
export interface EnumValue {
  value: string
  description?: string
  example?: string
}

/**
 * Enum type definition.
 * Collection of related constants.
 * @param {string} name - Enum name (PascalCase)
 * @param {EnumValue[]} values - Enum members
 * @param {string} [description] - Enum purpose
 */
export interface EnumDefinition {
  name: string
  values: EnumValue[]
  description?: string
}

/**
 * Generated TypeScript enum.
 * Prisma creates TS enum from schema enum.
 * @example
 * enum Role {
 *   ADMIN = "ADMIN",
 *   USER = "USER"
 * }
 */
export type EnumType<T extends string> = Record<T, T>
```

## Native Database Enums

```typescript
/**
 * Native database enum configuration.
 * Uses database enum type (@db.Enum).
 * PostgreSQL only.
 * @param {string} name - Enum name
 * @param {string[]} values - Enum values
 * @param {string} [description] - Purpose documentation
 * @example
 * {
 *   name: "Priority",
 *   values: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
 *   description: "Task priority levels"
 * }
 */
export interface NativeDatabaseEnum {
  name: string
  values: string[]
  description?: string
}

/**
 * Native enum advantage: performance and type-checking at DB level.
 * Disadvantage: harder to modify in production.
 */
export const NativeEnumTradeoffs = {
  advantages: ["Type safety at database", "Smaller storage", "Faster comparisons"],
  disadvantages: ["Harder to add/remove values", "PostgreSQL only", "Requires migration"]
}
```

## Enum Usage

```typescript
/**
 * Type-safe enum usage pattern.
 * @param {EnumType<T>} enumValue - Enum value from schema
 * @returns {boolean} Whether value is valid
 */
export interface EnumFilter<T extends string> {
  value: T
  isValid: (input: unknown) => input is T
}

/**
 * Enum field in model query.
 * String values matched against enum.
 * @example
 * await prisma.post.findMany({
 *   where: { status: "PUBLISHED" }  // "PUBLISHED" = Status.PUBLISHED
 * })
 */
export type EnumFieldQuery = string

/**
 * Multiple enum values filter.
 * @example
 * {
 *   role: {
 *     in: ["ADMIN", "MODERATOR"]
 *   }
 * }
 */
export interface EnumListFilter<T extends string> {
  in: T[]
  notIn?: T[]
}
```

## Discriminator Enums

```typescript
/**
 * Discriminator enum for type variants.
 * Tag field distinguishes record types.
 * @param {string} name - Enum name
 * @param {EnumValue[]} values - Type variants
 * @param {Record<string, string[]>} conditionalFields - Fields per type
 * @example
 * {
 *   name: "NotificationType",
 *   values: [
 *     { value: "EMAIL", description: "Email notification" },
 *     { value: "SMS", description: "SMS notification" }
 *   ],
 *   conditionalFields: {
 *     EMAIL: ["emailAddress"],
 *     SMS: ["phoneNumber"]
 *   }
 * }
 */
export interface DiscriminatorEnum {
  name: string
  values: EnumValue[]
  conditionalFields: Record<string, string[]>
}

/**
 * Type guard for discriminator pattern.
 * Narrows union type based on discriminator.
 * @param {string} typeValue - Discriminator value
 * @returns {boolean} Whether type matches
 */
export type DiscriminatorGuard<T extends { type: string }> = (
  value: unknown
) => value is T
```

## Enum Migrations

```typescript
/**
 * Enum value addition.
 * Safe operation: new values don't affect existing.
 * @param {string} enumName - Enum to modify
 * @param {string} newValue - Value to add
 */
export interface EnumAddition {
  enumName: string
  newValue: string
}

/**
 * Enum value removal/rename.
 * Breaking change: must migrate existing values.
 * @param {string} enumName - Enum to modify
 * @param {string} oldValue - Value to remove/rename
 * @param {string} [newValue] - Replacement value
 * @param {string} [defaultValue] - Default for existing records
 */
export interface EnumModification {
  enumName: string
  oldValue: string
  newValue?: string
  defaultValue?: string
}

/**
 * Enum migration strategy.
 * Safer approach with default fallback.
 * @param {EnumModification} modification - Change details
 * @param {string} migration - Migration name
 */
export interface EnumMigrationStrategy {
  modification: EnumModification
  migration: string
}
```

## Best Practices

```typescript
/**
 * Enum naming and usage guidelines.
 */
export const EnumBestPractices = {
  naming: "Use UPPERCASE_SNAKE_CASE for enum values",
  creation: "Add values as enum evolves (safe change)",
  removal: "Plan removal carefully (breaking change)",
  migration: "Always provide default for deprecated values",
  native: "Use @db.Enum for PostgreSQL (performance)",
  discriminator: "Use enum for type variants (single-table inheritance)",
  query: 'Treat as string in runtime: where: { role: "ADMIN" }'
}
```
