---
name: tanstack-form-basics
description: TanStack Form core hooks and field management for React forms
when-to-use: form state management, field validation, dynamic forms, multi-step forms
keywords: form, useForm, useField, form.Field, form.Subscribe, state, validation
priority: high
related: templates/basic-form.md, zod-validation.md
---

# TanStack Form Basics

## useForm Hook

**Core hook for managing entire form state, submission, and field lifecycle.**

### Purpose
- Initialize form state with default values
- Handle form submission with async support
- Manage form-wide state (canSubmit, isSubmitting, isDirty, errors)
- Track field values, touch states, and validation status

### When to Use
- Creating any form (login, registration, settings)
- Forms with complex state management
- Forms with server-side validation
- Multi-step or dynamic forms

### Key Points
- Accepts options object: `defaultValues`, `onSubmit`, `validators`
- Returns form instance with methods: `handleSubmit()`, `reset()`, `getFieldValue()`
- Form state includes: `values`, `errors`, `isSubmitting`, `canSubmit`, `isDirty`
- Can be combined with Zod or custom validators
- Manages field registration and lifecycle automatically

→ See `templates/basic-form.md` for code examples

---

## useField Hook

**Field-level hook for accessing and manipulating individual field state.**

### Purpose
- Register and manage single field instance
- Access field value, status, and validation state
- Handle field blur, change, and touch events

### When to Use
- When building custom field components
- When you need programmatic field access
- For advanced field-specific logic

### Key Points
- Must be called inside a component rendered by `form.Field`
- Returns field instance with state and handlers
- Handlers include: `handleChange()`, `handleBlur()`, `getValue()`, `setValue()`
- Field state includes: `value`, `meta` (touched, isDirty, errors)
- Can be extended with custom validators per field

→ See `templates/basic-form.md` for code examples

---

## form.Field Component

**Renders field with children function pattern for fine-grained control.**

### Purpose
- Declare form fields declaratively
- Subscribe to field-level changes
- Wrap custom field components

### When to Use
- Every input, textarea, select in the form
- Creating isolated field components
- Fields with custom rendering logic

### Key Points
- Uses children render function pattern: `children={(field) => ...}`
- Props include: `name`, `validators`, `asyncValidators`, `mode` (text, array, object)
- Field parameter provides: `state`, `getValue()`, `setValue()`, `handleChange()`, `handleBlur()`
- Each field is independent and only re-renders when its value changes
- Can nest fields for complex structures using array or object mode

→ See `templates/basic-form.md` for code examples

---

## form.Subscribe

**Selectively subscribe to form state changes without full re-render.**

### Purpose
- Watch specific form state slices (canSubmit, isSubmitting, isDirty)
- Render submit buttons, error messages, or save indicators
- Optimize performance by avoiding unnecessary re-renders

### When to Use
- Submit button state (disabled while submitting)
- Form-level error display
- Showing "unsaved changes" indicator
- Displaying validation summary

### Key Points
- Uses `selector` function to pick specific state properties
- Returns only selected values to children function
- Only triggers re-render when selected state changes
- Selector must return consistent object reference
- Common selections: `canSubmit`, `isSubmitting`, `isDirty`, `isValid`

### Form State Structure
- **values**: Current field values object
- **errors**: Field-level validation errors
- **isSubmitting**: Boolean, true during submission
- **canSubmit**: Boolean, true if form is valid and touched
- **isDirty**: Boolean, true if any field changed from default
- **isValid**: Boolean, true if all validations pass

→ See `templates/basic-form.md` for code examples

---

## Field Modes for Complex Structures

### Array Mode
Manage dynamic lists of fields with `mode="array"`. Provides `pushValue()` and `removeValue()` methods for adding/removing items.

### Object Mode
Manage nested object structures with `mode="object"`. Child fields use dot notation for nested names.

→ See `templates/basic-form.md` for code examples

---
