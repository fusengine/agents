---
name: standard-schema
description: Standard Schema support for form validation - ArkType and Effect Schema adapters
when-to-use: schema validation, alternative validators, multi-schema strategies
keywords: standard-schema, arktype, effect-schema, validation, adapter, schema
priority: low
related: zod-validation.md, yup-valibot.md
---

# Standard Schema

## What is Standard Schema

**Unified interface for schema validation libraries.**

### Purpose
- Standardized validation API across different schema libraries
- Interchangeable schema implementations
- Reduced lock-in to single validation library

### When to Use
- Projects requiring schema flexibility
- Integration with libraries supporting Standard Schema
- Teams evaluating multiple validation approaches

### Key Points
- Standard Schema is a specification, not a library
- Enables adapter patterns for validation
- Compatible with TanStack Form validators
- Supports multiple implementations (ArkType, Effect Schema, etc.)

---

## ArkType Support

**Lightweight type-safe schema validation.**

### Purpose
- Type inference directly from validation rules
- Minimal bundle size
- Strong TypeScript integration

### When to Use
- Performance-critical applications
- Simple to moderate validation needs
- Projects prioritizing bundle size

### Key Points
- ArkType schemas compile to optimized validators
- Type information flows from schema to runtime
- Supports refinements and custom validations
- Better error messages than alternatives

---

## Effect Schema Support

**Functional schema validation with composability.**

### Purpose
- Function composition for validators
- Declarative validation logic
- Rich error handling context

### When to Use
- Complex validation workflows
- Composable schema requirements
- Projects using Effect ecosystem

### Key Points
- Schemas as composable functions
- Built-in error context and recovery
- Excellent for data transformation
- Integration with Effect runtime

---

## Comparison with Zod/Yup/Valibot

| Aspect | Standard Schema | Zod | Yup | Valibot |
|--------|-----------------|-----|-----|---------|
| **Specification** | Standard interface | Implementation | Implementation | Implementation |
| **Bundle Size** | Varies (adapter-dependent) | 20KB | 13KB | 8KB |
| **Type Inference** | Excellent | Excellent | Good | Excellent |
| **Adoption** | Growing | Widespread | Mature | Rising |
| **Flexibility** | Highest | High | Medium | High |

---

## When to Choose Alternative Schemas

**Stick with Zod if**:
- Already invested in Zod ecosystem
- Need maximum library support
- Ecosystem coverage matters more than flexibility

**Choose ArkType for**:
- Performance-critical validation
- Bundle size constraints
- Strong type inference preference

**Choose Effect Schema for**:
- Complex validation pipelines
- Data transformation needs
- Effect ecosystem integration

---

## Adapter Patterns

**Implementing Standard Schema adapters for custom validators.**

### Purpose
- Create reusable validation wrappers
- Enable standard-schema compliance
- Support multiple validation backends

### When to Use
- Switching validation libraries
- Supporting multiple schema types
- Building validation abstractions

### Key Points
- Adapters bridge schema libraries
- Implement standard-schema interface
- Type-safe integration with TanStack Form
- Reducible complexity through adapters

---

→ See `references/zod-validation.md` for primary validation docs
