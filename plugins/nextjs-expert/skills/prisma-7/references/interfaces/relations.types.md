---
description: "Prisma 7 Relation and Referential Action Types"
keywords: relation, referential, cascade, constraint, foreign-key
---

# Relation Type Interfaces

## Relation Types

```typescript
/**
 * One-to-one relation configuration.
 * Foreign key stored on Profile side, User side holds optional relation.
 * @param {string} owningSide - Model with foreign key field
 * @param {string} nonOwningSide - Model with relation field (no FK)
 * @param {string} foreignKeyField - Foreign key field name on owning side
 * @module modules/database/src/interfaces/relations.types
 */
export interface OneToOneRelation {
  owningSide: string
  nonOwningSide: string
  foreignKeyField: string
}

/**
 * One-to-many relation configuration.
 * Parent has [], child has foreign key.
 * @param {string} parentModel - Model with list relation
 * @param {string} childModel - Model with foreign key
 * @param {string} foreignKeyField - Child model FK field name
 */
export interface OneToManyRelation {
  parentModel: string
  childModel: string
  foreignKeyField: string
}

/**
 * Many-to-many relation configuration.
 * @param {string} model1 - First related model
 * @param {string} model2 - Second related model
 * @param {string} [junctionTable] - Custom join table name
 * @param {boolean} [isImplicit] - Prisma-managed join table
 */
export interface ManyToManyRelation {
  model1: string
  model2: string
  junctionTable?: string
  isImplicit?: boolean
}

/**
 * Self-referential relation configuration.
 * Model relates to itself (manager/reports, parent/children).
 * @param {string} model - Self-relating model
 * @param {string} relationName - Relation identifier
 * @param {string} parentField - Parent reference field
 */
export interface SelfRelation {
  model: string
  relationName: string
  parentField: string
}
```

## Referential Actions

```typescript
/**
 * Referential action for foreign key constraints.
 * Controls behavior when referenced record is deleted or updated.
 */
export enum ReferentialAction {
  /**
   * Delete child records when parent is deleted.
   * Use for parent-child ownership (Orders → OrderItems).
   */
  Cascade = "Cascade",

  /**
   * Set foreign key to null when parent is deleted.
   * Requires nullable FK field. For optional relationships.
   */
  SetNull = "SetNull",

  /**
   * Prevent deletion if child records exist.
   * Database-level enforcement, throws error.
   */
  Restrict = "Restrict",

  /**
   * Defer constraint check to end of transaction.
   * Complex multi-table deletions with circular refs.
   */
  NoAction = "NoAction"
}

/**
 * Referential action configuration for relation fields.
 * @param {ReferentialAction} onDelete - Delete action
 * @param {ReferentialAction} [onUpdate] - Update action (usually Cascade)
 */
export interface ReferentialActionConfig {
  onDelete: ReferentialAction
  onUpdate?: ReferentialAction
}

/**
 * Referential action use case mapping.
 * Guides selection of appropriate action for business logic.
 */
export const ReferentialActionUseCases = {
  Cascade: "Orders with OrderItems, User with Posts (ownership)",
  SetNull: "Comments with optional User (preserve data)",
  Restrict: "Department with Employees (prevent orphans)",
  NoAction: "Complex transactions with circular references"
}
```

## Relation Constraints

```typescript
/**
 * Foreign key constraint definition.
 * @param {string} field - Foreign key field name
 * @param {string} references - Referenced model and field (Model.field)
 * @param {ReferentialActionConfig} actions - Cascade behaviors
 */
export interface ForeignKeyConstraint {
  field: string
  references: string
  actions: ReferentialActionConfig
}

/**
 * Composite key for junction tables.
 * Primary key comprises multiple fields.
 * @param {string[]} fields - Field names making up key
 */
export interface CompositeKey {
  fields: string[]
}

/**
 * Unique constraint for multi-field uniqueness.
 * Email + domain combo must be unique.
 * @param {string[]} fields - Fields in unique constraint
 * @param {string} [name] - Constraint identifier
 */
export interface UniqueConstraint {
  fields: string[]
  name?: string
}
```
