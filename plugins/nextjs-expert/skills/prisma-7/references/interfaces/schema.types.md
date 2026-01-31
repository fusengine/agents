---
description: "Prisma 7 Schema Types and Interfaces"
keywords: model, relation, constraint, interface, type
---

# Schema Type Interfaces

## Generator Configuration

```typescript
/**
 * Prisma generator client configuration.
 * Configures the Prisma Client output and provider.
 * @module modules/database/src/interfaces/schema.types
 */
export interface GeneratorConfig {
  provider: "prisma-client"
  output: string
}

/**
 * Prisma datasource configuration.
 * Defines database connection details.
 */
export interface DatasourceConfig {
  provider: "postgresql" | "mysql" | "sqlite" | "mongodb"
  url: string
}
```

## Model Attributes

```typescript
/**
 * Field-level attribute configuration.
 * @param {string} name - Prisma field name (camelCase)
 * @param {string} type - Scalar type (String, Int, Boolean, DateTime, etc.)
 * @param {string} [dbType] - Native database type (@db.VarChar, @db.Text)
 * @param {boolean} [isId] - Primary key field
 * @param {boolean} [isUnique] - Unique constraint
 * @param {string} [default] - Default value generator (now(), cuid(), uuid())
 * @param {string} [map] - Database column name mapping
 * @param {boolean} [isRequired] - Field requirement (no ? suffix)
 */
export interface FieldAttribute {
  name: string
  type: string
  dbType?: string
  isId?: boolean
  isUnique?: boolean
  default?: string
  map?: string
  isRequired: boolean
}

/**
 * Relation field configuration.
 * @param {string} fieldName - Foreign key field name
 * @param {string} references - Referenced model field
 * @param {RelationalAction} onDelete - Delete cascade behavior
 * @param {RelationalAction} onUpdate - Update cascade behavior
 */
export interface RelationAttribute {
  fieldName: string
  references: string
  onDelete?: RelationalAction
  onUpdate?: RelationalAction
}

/**
 * Referential action for foreign key constraints.
 */
export type RelationalAction = "Cascade" | "SetNull" | "Restrict" | "NoAction"
```

## Model Definition

```typescript
/**
 * Prisma model definition (schema model block).
 * @param {string} name - Model name (PascalCase)
 * @param {string} [tableName] - Database table name (@@map)
 * @param {FieldAttribute[]} fields - Model fields
 * @param {RelationAttribute[]} [relations] - Foreign key relations
 * @param {string[]} [indexes] - Database indexes (@@index)
 * @param {string[]} [uniqueConstraints] - Unique constraints (@@unique)
 */
export interface ModelDefinition {
  name: string
  tableName?: string
  fields: FieldAttribute[]
  relations?: RelationAttribute[]
  indexes?: string[]
  uniqueConstraints?: string[]
}
```

## Enum Definition

```typescript
/**
 * Prisma enum type definition.
 * @param {string} name - Enum name (PascalCase)
 * @param {string[]} values - Enum values (UPPERCASE)
 * @param {boolean} [isNative] - Native database enum (@db.Enum)
 */
export interface EnumDefinition {
  name: string
  values: string[]
  isNative?: boolean
}
```
