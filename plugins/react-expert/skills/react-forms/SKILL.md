---
name: react-forms
description: TanStack Form with Zod validation - type-safe, headless, performant forms. Use when building forms, implementing validation, or handling form submissions in React.
user-invocable: false
---

# TanStack Form

Headless, type-safe, and performant form state management.

## Quick Start

```bash
bun add @tanstack/react-form zod
```

Basic form with `useForm` hook and field rendering:

```typescript
import { useForm } from '@tanstack/react-form'

function LoginForm() {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => await loginUser(value),
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field name="email" children={(field) => (
        <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
      )} />
      <button type="submit">Login</button>
    </form>
  )
}
```

## References

### 1. Core Concepts

See **[tanstack-form-basics.md](./references/tanstack-form-basics.md)** for:
- `useForm` hook configuration
- Form state subscription with `form.Subscribe`
- Dynamic field arrays with add/remove
- Handling form submission

### 2. Validation

See **[zod-validation.md](./references/zod-validation.md)** for:
- Inline field validators
- Zod schema validation integration
- Async validation with debouncing
- Custom error display

### 3. UI Integration

See **[shadcn-integration.md](./references/shadcn-integration.md)** for:
- Using shadcn/ui components
- Reusable field wrappers
- Button state management patterns
