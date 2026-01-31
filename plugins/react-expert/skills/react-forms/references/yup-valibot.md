---
name: yup-valibot
description: Validation libraries for forms - Yup and Valibot comparison with TanStack Form adapters
when-to-use: form validation, data validation, schema validation
keywords: yup, valibot, validation, schema, tanstack-form, zod
priority: high
related: zod-validation.md, templates/basic-form.md
---

# Yup and Valibot Validators

## Yup Validator Adapter

**Traditional schema-based validation library.**

### Purpose
- Define validation rules declaratively with schema chaining
- Validate form data against predefined rules
- Integrate with TanStack Form for validation

### When to Use
- Migrating from existing Yup projects
- Team familiar with schema-based validation patterns
- Simple to medium complexity forms
- Need mature, stable ecosystem with wide adoption

### Key Points
- Uses class-like schema chaining syntax (`.object().shape()`)
- Native async validation support
- ~20KB bundle size (larger than alternatives)
- Good TypeScript support but less precise inference
- Limited tree-shaking capabilities

---

## Valibot Validator Adapter

**Modern functional validation library with pipe composition.**

### Purpose
- Define validation rules using functional pipe composition
- Smaller bundle footprint with excellent performance
- Integrate with TanStack Form for validation

### When to Use
- Building new projects with modern tooling
- Bundle size is critical (<7KB)
- Want excellent TypeScript inference and type safety
- Prefer functional, pipe-based API style
- Need maximum performance and lazy evaluation

### Key Points
- Uses pipe composition syntax (`v.pipe()`)
- Full async validation support
- ~7KB bundle size (significantly smaller)
- Excellent TypeScript type inference
- Outstanding tree-shaking for optimal bundles

---

## Comparison Table

| Feature | Yup | Valibot | Zod |
|---------|-----|---------|-----|
| **Bundle Size** | ~20KB | ~7KB | ~15KB |
| **Syntax Style** | Schema chaining | Pipe composition | Schema chaining |
| **Async Support** | Native | Full | Native |
| **TypeScript Inference** | Good | Excellent | Excellent |
| **Learning Curve** | Familiar | Functional | Familiar |
| **Tree-shaking** | Limited | Excellent | Good |
| **Performance** | Good | Excellent | Good |
| **Maturity** | Very stable | Growing | Very stable |

---

## Migration Between Libraries

Both Yup and Valibot work with TanStack Form validators. Switching between them requires updating:
- Schema definition syntax
- Validation method calls (`validate()` vs `safeParse()`)
- Error handling patterns

Zod offers similar functionality to both and can be migrated to using comparable approaches.

---

## Choosing Between Libraries

**Choose Yup** if you have existing Yup implementations, team familiarity, or need ecosystem maturity.

**Choose Valibot** if bundle size matters, you want modern functional patterns, and need optimal TypeScript inference.

**Choose Zod** if you want a middle ground with both schema chaining and excellent TypeScript support.

---

→ See `templates/basic-form.md` for code examples
