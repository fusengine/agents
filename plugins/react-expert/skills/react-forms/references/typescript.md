---
name: typescript-forms
description: Type-safe form handling with TypeScript - type inference, Zod schemas, field autocomplete, generic components
when-to-use: form validation, type-safe field access, schema-driven forms, reusable form components
keywords: TypeScript, forms, type inference, Zod, generics, field autocomplete, validation
priority: high
related: templates/form-composition.md, templates/basic-form.md
---

# TypeScript Form Patterns

## Type Inference from defaultValues

**Automatically infer form values type from initial values.**

### Purpose
- Eliminate manual type definitions for simple forms
- Ensure field types match their initial values
- Reduce boilerplate in small forms

### When to Use
- Simple forms with clear primitive types
- Rapid prototyping without schemas
- Quick type safety without explicit interfaces

### Key Points
- Form values type inferred automatically from `defaultValues`
- TypeScript validates field names against inferred shape
- Works best for forms with consistent initial values
- Limited to inferred types only (no optional inference)

→ See `templates/form-composition.md` for code examples

---

## Zod Schema Inference

**Extract form types directly from Zod validation schemas.**

### Purpose
- Single source of truth for validation and types
- Runtime and compile-time type safety
- Automatic type synchronization with validation rules

### When to Use
- Forms with validation schemas
- Multi-step or complex forms
- Forms requiring runtime validation alongside TypeScript

### Key Points
- Use `z.infer<typeof schema>` to extract types
- Ensures validation and types never drift
- Works with all Zod transformations
- Schema becomes the canonical form definition

→ See `templates/form-composition.md` for code examples

---

## Field Name Autocomplete

**Enable TypeScript autocomplete for nested field paths.**

### Purpose
- Prevent typos in field names
- Catch field access errors at compile time
- Improve developer experience with editor hints

### When to Use
- Forms with typed field names
- Deeply nested form structures
- API integration with validated schemas

### Key Points
- Requires explicit type parameter on form hook
- Works with dot notation for nested fields (e.g., `'address.city'`)
- Array field access supported with numeric indices
- Type-safe field getters prevent runtime errors

→ See `templates/basic-form.md` for code examples

---

## Generic Form Components

**Create reusable form field components with full type safety.**

### Purpose
- Build component libraries for forms
- Eliminate per-field component duplication
- Share validation and rendering logic across forms

### When to Use
- Multiple forms with similar fields
- Design system form components
- Complex form field types (selects, file uploads, toggles)

### Key Points
- Generic constraint `T extends Record<string, any>` enables flexibility
- Field name type parameter (`keyof T`) enforces available fields
- Component works with any typed form instance
- Reusable across all forms in application

→ See `templates/form-composition.md` for code examples

---

## Explicit FormValues Types

**Define forms with explicit TypeScript interfaces for clarity.**

### Purpose
- Document form structure explicitly
- Enable optional and union field types
- Improve code readability and IDE navigation

### When to Use
- Complex forms with optional fields
- Union types (e.g., `'credit-card' | 'bank-transfer'`)
- Forms requiring comprehensive type documentation

### Key Points
- Interface defines complete form contract
- Optional fields with `?` modifier supported
- Union types enable conditional field sets
- Explicit types serve as living documentation

→ See `templates/basic-form.md` for code examples

---

## Type Safety Progression

| Approach | Best For | Type Checking | Maintenance |
|----------|----------|---------------|-------------|
| Type inference | Simple forms | Compile-time | Low |
| Zod schemas | Validated forms | Compile + runtime | Medium |
| Generic components | Reusable fields | Full enforcement | High |
| Explicit interfaces | Complex forms | Documentation | High |

