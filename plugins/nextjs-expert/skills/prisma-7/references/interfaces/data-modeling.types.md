---
description: "Prisma 7 Data Modeling Types and Interfaces"
keywords: normalization, cardinality, schema-design, data-structure
---

# Data Modeling Type Interfaces

## Normalization

```typescript
/**
 * Normalized schema approach.
 * Separate entities with relations, no redundant data.
 * @param {string[]} entities - Individual model names
 * @param {string[]} relations - Relation descriptions
 * @module modules/database/src/interfaces/data-modeling.types
 */
export interface NormalizedSchema {
  entities: string[]
  relations: string[]
}

/**
 * Denormalized schema pattern (avoid).
 * Redundant data for performance trade-off.
 * @param {string} baseModel - Model with denormalized fields
 * @param {string[]} redundantFields - Fields duplicated from relations
 * @deprecated Use normalized + select/include for performance
 */
export interface DenormalizedSchema {
  baseModel: string
  redundantFields: string[]
}
```

## Query Relations

```typescript
/**
 * Include operation for eager loading.
 * Fetches related records in single query.
 * @param {Record<string, IncludeConfig>} fields - Relations to include
 * @example
 * {
 *   posts: true,
 *   profile: { select: { bio: true } }
 * }
 */
export interface IncludeConfig {
  [key: string]: boolean | IncludeConfig
}

/**
 * Select operation for field projection.
 * Fetches only specified fields.
 * @param {Record<string, SelectConfig>} fields - Fields to select
 * @example
 * {
 *   id: true,
 *   name: true,
 *   author: { select: { name: true } }
 * }
 */
export interface SelectConfig {
  [key: string]: boolean | SelectConfig
}

/**
 * Where filter for relation queries.
 * Filters based on related record properties.
 * @param {string} relation - Relation field name
 * @param {FilterOperator} operator - some, none, every
 */
export interface RelationFilter {
  relation: string
  operator: "some" | "none" | "every"
}

/**
 * Query configuration combining include/select/where.
 * @param {IncludeConfig} [include] - Relations to load
 * @param {SelectConfig} [select] - Fields to project
 * @param {Record<string, unknown>} [where] - Filter conditions
 */
export interface QueryConfig {
  include?: IncludeConfig
  select?: SelectConfig
  where?: Record<string, unknown>
}
```

## Cardinality

```typescript
/**
 * Cardinality type for relation multiplicity.
 */
export enum Cardinality {
  OneToOne = "OneToOne",
  OneToMany = "OneToMany",
  ManyToMany = "ManyToMany"
}

/**
 * Cardinality analysis for schema design.
 * @param {string} relation - Relation description
 * @param {Cardinality} cardinality - Multiplicity type
 * @param {string} example - Business example
 */
export interface CardinalityAnalysis {
  relation: string
  cardinality: Cardinality
  example: string
}
```

## Schema Patterns

```typescript
/**
 * Parent-child composition pattern.
 * Parent owns child records (Order → OrderItem).
 * Child cannot exist without parent.
 * @param {string} parent - Parent model
 * @param {string} child - Child model
 * @param {boolean} cascadeDelete - Delete children on parent delete
 */
export interface CompositionPattern {
  parent: string
  child: string
  cascadeDelete: true
}

/**
 * Association pattern.
 * Independent models linked (User ↔ Course).
 * Records can exist independently.
 * @param {string} model1 - First model
 * @param {string} model2 - Second model
 * @param {string} [junction] - Join table name
 */
export interface AssociationPattern {
  model1: string
  model2: string
  junction?: string
}

/**
 * Aggregation pattern.
 * Parent references child (Author → Book).
 * Child can switch parents.
 * @param {string} aggregate - Parent model
 * @param {string} component - Component model
 */
export interface AggregationPattern {
  aggregate: string
  component: string
}
```

## Field Cardinality

```typescript
/**
 * Field cardinality in relation context.
 */
export enum FieldCardinality {
  /** Single value required (Post → Author) */
  OneRequired = "OneRequired",

  /** Single value optional (User → Profile?) */
  OneOptional = "OneOptional",

  /** Multiple values (User → Posts[]) */
  Many = "Many"
}

/**
 * Field definition with cardinality.
 * @param {string} name - Field name
 * @param {string} relatedModel - Related model name
 * @param {FieldCardinality} cardinality - Multiplicity
 */
export interface RelationField {
  name: string
  relatedModel: string
  cardinality: FieldCardinality
}
```
