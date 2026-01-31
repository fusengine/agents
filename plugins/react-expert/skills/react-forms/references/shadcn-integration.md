---
name: shadcn-integration
description: shadcn/ui component integration for accessible, composable form building
when-to-use: form inputs, field wrappers, button states, accessible form construction
keywords: shadcn/ui, form components, accessibility, field wrapper, composable UI
priority: high
related: templates/form-composition.md, templates/basic-form.md
---

# shadcn/ui Integration for Forms

## Purpose

shadcn/ui provides a collection of accessible, composable React components built on Radix UI primitives. For form building, shadcn/ui offers pre-styled, unstyled-by-default components that work seamlessly with form libraries like TanStack Form.

### Key Points
- Components built on Radix UI (WAI-ARIA compliant)
- Customizable with Tailwind CSS
- Composable and headless by nature
- Pair with TanStack Form or React Hook Form for state management
- No external dependency lock-in

---

## shadcn/ui Form Components

| Component | Purpose | Accessibility |
|-----------|---------|----------------|
| `Input` | Text, email, password fields | ARIA labels, error messaging |
| `Button` | Submit, reset, action buttons | Semantic HTML, disabled states |
| `Label` | Field labels with `htmlFor` linking | Associates with inputs |
| `FormField` | Custom: field wrapper with error display | Manages state, errors, touched state |
| `Select` | Dropdown selections | Keyboard navigation, ARIA roles |
| `Checkbox` | Toggle boolean values | Checked state, labels |
| `RadioGroup` | Exclusive selections | ARIA roles, keyboard support |
| `Textarea` | Multi-line text input | Resize, placeholder support |

---

## Field Wrapper Pattern

**Key Principle**: Extract field rendering logic into reusable wrapper components.

### Why Wrap Fields
- Consistent error display across forms
- Centralized label and validation UI
- Reduced boilerplate in form declarations
- Easier to adjust styling globally

### Field Wrapper Responsibilities
- Render label with correct associations
- Display input/select/checkbox component
- Show validation errors when touched
- Handle blur and change events
- Manage visual error states (borders, colors)

### Accessibility Requirements
- Label `htmlFor` must match input `id`
- Error messages linked via `aria-describedby`
- Required fields marked with `aria-required`
- Disabled state properly announced

---

## Form State Integration

shadcn/ui components are **stateless UI components**. State management must come from:

### State Management Options
1. **TanStack Form** - Form-centric, field-by-field state
2. **React Hook Form** - Hook-based, minimal re-renders
3. **Zod/Yup** - Validation schemas
4. **Custom useForm Hook** - Light form orchestration

### State Flow Pattern
```
Form → useForm Hook → Field State
Field State → FormField Component
FormField → shadcn/ui Input/Select/etc
User Action → Handler → Update State → Re-render
```

### Essential State Properties
- **value**: Current field value
- **error**: Validation error messages
- **touched**: Whether field has been interacted with
- **disabled**: Button/field disabled during submission
- **isSubmitting**: Form submission in progress

---

## Form Submission Pattern

### Button State Management
- Disable submit button while form is invalid
- Show loading indicator during submission
- Update button text (e.g., "Sending..." vs "Send")
- Re-enable when submission completes

### Error Handling
- Display inline field errors below inputs
- Show form-level errors in alert or toast
- Clear errors on successful submission
- Preserve errors on failed submission

### Best Practices
- Never throw errors in handlers; return error objects
- Validate on blur for better UX (show errors after interaction)
- Debounce async validation (checking username availability, etc.)
- Show success feedback (toast, redirect, or message)

---

→ See `templates/form-composition.md` for code examples
→ See `templates/basic-form.md` for basic setup
