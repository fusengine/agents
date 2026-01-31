---
description: "Prisma 7 Type Interfaces - SOLID Architecture"
keywords: types, interfaces, solid, architecture, structure
---

# Prisma 7 Type Interfaces

SOLID-compliant type definitions for Prisma 7 schema design, separated from implementation.

## Files Structure

### Core Schema
- **`schema.types.md`** - Generator, datasource, model, and enum interfaces
  - `GeneratorConfig` - Prisma Client configuration
  - `ModelDefinition` - Model with fields and relations
  - `FieldAttribute` - Field-level configuration
  - `EnumDefinition` - Enum type definition

### Migrations & Seeding
- **`migrations.types.md`** - Migration workflow and seeding patterns
  - `MigrationDevOptions` - Development migration config
  - `MigrationDeployOptions` - Production deployment
  - `SeedFn` - Seed function interface
  - `EnvironmentSeedStrategy` - Environment-specific seeds
  - `CustomMigration` - Custom SQL migrations

### Relations
- **`relations.types.md`** - Relation types and referential actions
  - `OneToOneRelation` - One-to-one configuration
  - `OneToManyRelation` - Parent-child relations
  - `ManyToManyRelation` - Many-to-many with junction tables
  - `SelfRelation` - Self-referential relations
  - `ReferentialAction` - Enum for Cascade, SetNull, Restrict, NoAction
  - `ForeignKeyConstraint` - Foreign key definition

### Data Modeling
- **`data-modeling.types.md`** - Schema design patterns and queries
  - `NormalizedSchema` - Normalized data design
  - `DenormalizedSchema` - Anti-pattern documentation
  - `IncludeConfig` - Eager loading relation queries
  - `SelectConfig` - Field projection queries
  - `RelationFilter` - Relation-based WHERE clauses
  - `Cardinality` - Relation multiplicity
  - `CompositionPattern` - Parent-child ownership

### Field Attributes
- **`field-attributes.types.md`** - Field-level configuration
  - `IdentityType` - Auto-increment, UUID, CUID
  - `IdentityField` - Primary key configuration
  - `DefaultValueConfig` - Default value generators
  - `FieldMapping` - Prisma to database column mapping
  - `DatabaseType` - Native database type specifiers
  - `OptionalityConfig` - Required/optional fields
  - `IndexConfig` - Index optimization configuration
  - `FieldValidator` - Application-level validation

### Model Attributes
- **`model-attributes.types.md`** - Model-level configuration
  - `CompositeKey` - Multi-field primary key
  - `CompositeUniqueConstraint` - Multi-field uniqueness
  - `IndexConfig` - Index types and performance
  - `CompositeIndex` - Multi-field indexes
  - `FullTextIndex` - PostgreSQL full-text search
  - `DiscriminatorConfig` - Single-table inheritance
  - `SoftDeleteConfig` - Soft delete pattern
  - `UpsertConfig` - Create or update operations

### Enums
- **`enums.types.md`** - Enum definitions and usage
  - `EnumValue` - Single enum member with metadata
  - `EnumDefinition` - Collection of enum values
  - `NativeDatabaseEnum` - PostgreSQL native enums
  - `EnumFilter` - Type-safe enum filtering
  - `DiscriminatorEnum` - Discriminator tag enums
  - `EnumAddition` - Safe enum value addition
  - `EnumModification` - Breaking enum changes

## Usage Pattern

Each reference file imports and documents types from corresponding interface file:

```markdown
# Reference Title

Type definitions in `/references/interfaces/feature.types.md`.

## Section

See TypeName in /interfaces/feature.types.md
```

All TypeScript code blocks in reference files include JSDoc comments:

```typescript
/**
 * Function description.
 * @param {type} paramName - Parameter description
 * @returns {type} Return value description
 * @module modules/database/src/interfaces/migrations.types
 */
```

## SOLID Compliance

1. **Single Responsibility** - Each interface has one purpose
2. **Open/Closed** - Extensible via interface composition
3. **Liskov Substitution** - Subtypes replaceable
4. **Interface Segregation** - Small, focused interfaces
5. **Dependency Inversion** - Depend on abstractions, not implementations

## Best Practices

1. **Type References** - Links to interface location in all code blocks
2. **Complete JSDoc** - Parameter, return, module paths
3. **Example Paths** - Full absolute paths in comments
4. **Enum Documentation** - Clear use cases for each value
5. **Trade-offs** - Performance vs. complexity notes

## Implementation Notes

- Interfaces live in `/references/interfaces/`
- Implementation files reference interface types
- No cyclic dependencies between interface files
- Prisma schema examples use JSDoc with type hints
- TypeScript code samples include full imports
