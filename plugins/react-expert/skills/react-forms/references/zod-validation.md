---
name: zod-validation
description: Type-safe schema validation with Zod - form-level, field-level, and async validation strategies
when-to-use: form validation, schema constraints, type safety, async server validation
keywords: zod, validation, schema, type-safe, async, form
priority: high
related: templates/basic-form.md, async-validation.md
---

# Zod Validation

## zodValidator Adapter

**Bridge between Zod schemas and TanStack Form validators.**

### Purpose
- Apply Zod schemas directly to form validators
- Type-safe validation with automatic TypeScript inference
- Unified validation across form and fields

### When to Use
- Defining reusable validation schemas
- Ensuring consistency across forms
- Type-safe field validation

### Key Points
- Zod schemas provide runtime type checking
- Can be used at form level or field level
- Errors are automatically collected and typed
- Supports custom messages and refine logic

---

## Form-Level Validation

**Validate entire form data against a Zod schema.**

### Purpose
- Ensure all form data matches schema constraints
- Validate relationships between fields
- Cross-field validation rules

### When to Use
- Multi-field dependencies (password confirmation)
- Coordinated validation rules
- Complete data validation before submission

### Key Points
- Applied to form level, runs after individual fields
- Catches interdependent field errors
- Schema.parse() throws on validation failure
- Use .safeParse() for error handling

---

## Field-Level Validation

**Validate individual fields with Zod constraints.**

### Purpose
- Isolated field validation
- Real-time feedback during input
- Type-safe individual validators

### When to Use
- Single field constraints (email format, string length)
- Immediate user feedback
- Lightweight validation per field

### Key Points
- Runs on specified timing (onChange, onBlur, onSubmit)
- Zod primitive validators available (z.string(), z.number())
- Field errors collected in field state
- Can chain multiple validations

---

## Async Validation

**Server-side validation with debouncing to prevent redundant requests.**

### Purpose
- Check uniqueness constraints (username exists)
- Validate against live data
- Verify business rules on server

### When to Use
- Username/email availability
- Complex server-dependent rules
- Rate-limited server validation

### Key Points
- Debouncing prevents excessive requests
- Async validators run in background
- Field shows validating state during request
- Errors handled same as sync validation

---

## Validation Timing Options

| Timing | Trigger | Best For | User Experience |
|--------|---------|----------|-----------------|
| onChange | Every keystroke | Real-time feedback | Immediate, potentially verbose |
| onBlur | Field loses focus | Non-intrusive | After user interaction |
| onSubmit | Form submission | Final gate | Single validation point |
| onMount | Field renders | Initial state check | Detect pre-filled issues |

---

→ See `templates/basic-form.md` for code examples
