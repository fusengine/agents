---
description: "Prisma 7 Field Attributes Types and Interfaces"
keywords: attribute, constraint, id, unique, default, mapping
---

# Field Attributes Type Interfaces

## Identity Fields

```typescript
/**
 * Primary key identity type.
 */
export enum IdentityType {
  /** Auto-incrementing integer (Int) */
  AutoIncrement = "autoincrement()",

  /** UUID string identifier */
  UUID = "uuid()",

  /** CUID string identifier (default) */
  CUID = "cuid()"
}

/**
 * Primary key field configuration.
 * @param {string} name - Field name
 * @param {IdentityType} type - ID generation strategy
 * @param {string} [dbType] - Database type (@db.Uuid, @db.Int)
 * @module modules/database/src/interfaces/field-attributes.types
 */
export interface IdentityField {
  name: string
  type: IdentityType
  dbType?: string
}
```

## Uniqueness Constraints

```typescript
/**
 * Unique constraint configuration.
 * @param {string} field - Field name for single-field unique
 * @param {string[]} [fields] - Multiple fields for composite unique
 * @param {string} [name] - Constraint identifier
 */
export interface UniqueConstraintConfig {
  field?: string
  fields?: string[]
  name?: string
}
```

## Default Values

```typescript
/**
 * Default value generator type.
 */
export enum DefaultValueGenerator {
  /** Current timestamp (DateTime) */
  Now = "now()",

  /** UUID generation */
  UUID = "uuid()",

  /** CUID generation */
  CUID = "cuid()",

  /** Auto-increment */
  AutoIncrement = "autoincrement()"
}

/**
 * Default value configuration.
 * @param {string | DefaultValueGenerator | boolean | number} value - Default value
 * @param {string} [description] - Use case documentation
 * @example
 * {
 *   value: "now()",
 *   description: "Auto-set current timestamp"
 * }
 */
export interface DefaultValueConfig {
  value: string | DefaultValueGenerator | boolean | number
  description?: string
}
```

## Database Mapping

```typescript
/**
 * Field to database column mapping.
 * @param {string} prismaName - Prisma field name (camelCase)
 * @param {string} dbColumnName - Database column name (snake_case)
 */
export interface FieldMapping {
  prismaName: string
  dbColumnName: string
}

/**
 * Model to database table mapping.
 * @param {string} prismaName - Prisma model name (PascalCase)
 * @param {string} dbTableName - Database table name (snake_case)
 */
export interface ModelMapping {
  prismaName: string
  dbTableName: string
}

/**
 * Complete naming bridge for legacy databases.
 * @param {FieldMapping[]} fields - Field mappings
 * @param {ModelMapping} model - Model mapping
 */
export interface LegacyDatabaseBridge {
  fields: FieldMapping[]
  model: ModelMapping
}
```

## Database Types

```typescript
/**
 * Native database type qualifiers.
 * Provider-specific type hints.
 */
export enum DatabaseType {
  // PostgreSQL
  Text = "Text",
  VarChar = "VarChar(n)",
  Int = "Int",
  BigInt = "BigInt",
  SmallInt = "SmallInt",
  Decimal = "Decimal(p,s)",
  DoublePrecision = "DoublePrecision",
  JsonB = "JsonB",
  Array = "Array(T)",
  Uuid = "Uuid",

  // MySQL
  LongText = "LongText",
  LongBlob = "LongBlob"
}

/**
 * Database type specification.
 * @param {string} field - Field name
 * @param {DatabaseType} type - Native database type
 * @param {string} [parameters] - Type parameters (length, precision)
 */
export interface DatabaseTypeSpec {
  field: string
  type: DatabaseType
  parameters?: string
}
```

## Optionality

```typescript
/**
 * Field optionality configuration.
 * @param {string} field - Field name
 * @param {boolean} isRequired - Must have value (no ? suffix)
 * @param {string} [reason] - Why field is optional
 */
export interface OptionalityConfig {
  field: string
  isRequired: boolean
  reason?: string
}

/**
 * Nullability handling in queries.
 * TypeScript reflects null possibility.
 * @example
 * phone: string | null  // user.phone can be null
 */
export type NullableField<T> = T | null
```

## Index Configuration

```typescript
/**
 * Index configuration for query optimization.
 * @param {string[]} fields - Fields in index
 * @param {boolean} [isUnique] - Unique index
 * @param {string} [name] - Index identifier
 */
export interface IndexConfig {
  fields: string[]
  isUnique?: boolean
  name?: string
}

/**
 * Index use cases and strategies.
 */
export const IndexStrategies = {
  ForeignKeys: "Index foreign key fields for joins",
  FrequentFilters: "Index frequently filtered fields",
  Sorting: "Index fields used in ORDER BY",
  CompositeQueries: "Composite index for multi-field WHERE"
}
```

## Field Validation

```typescript
/**
 * Application-level field validation.
 * Prisma has no built-in field validation.
 * @param {string} field - Field name
 * @param {(value: unknown) => boolean} validator - Validation function
 * @param {string} message - Error message on validation failure
 */
export interface FieldValidator {
  field: string
  validator: (value: unknown) => boolean
  message: string
}

/**
 * Validation result from schema.validate().
 * @param {boolean} isValid - Validation pass/fail
 * @param {FieldValidator[]} [errors] - Failed validators
 */
export interface ValidationResult {
  isValid: boolean
  errors?: FieldValidator[]
}
```
