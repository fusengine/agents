---
title: Zod Validation
description: Schema validation, field validators, and async validation
---

# Zod Validation

Type-safe schema validation with Zod integration.

## Basic Field Validation

Inline validators without Zod.

```typescript
import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'

/** Display field errors. */
function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid && (
        <span className="text-red-500">{field.state.meta.errors.join(', ')}</span>
      )}
      {field.state.meta.isValidating && <span>Validating...</span>}
    </>
  )
}

function SignupForm() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      age: 0,
    },
    onSubmit: async ({ value }) => {
      await createUser(value)
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field
        name="firstName"
        validators={{
          onChange: ({ value }) =>
            !value
              ? 'First name is required'
              : value.length < 2
                ? 'Must be at least 2 characters'
                : undefined,
        }}
        children={(field) => (
          <div>
            <label htmlFor={field.name}>First Name</label>
            <input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldInfo field={field} />
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      />
    </form>
  )
}
```

## Zod Schema Validation

Use Zod for type-safe validation schemas.

```typescript
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

function ProfileForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      age: 18,
    },
    onSubmit: async ({ value }) => {
      await updateProfile(value)
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field
        name="name"
        validators={{
          onChange: z.string().min(2, 'Name must be 2+ characters'),
        }}
        children={(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldInfo field={field} />
          </div>
        )}
      />

      <form.Field
        name="email"
        validators={{
          onChange: z.string().email('Invalid email address'),
        }}
        children={(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldInfo field={field} />
          </div>
        )}
      />

      <form.Field
        name="age"
        validators={{
          onChange: z.number().gte(18, 'Must be 18 or older'),
        }}
        children={(field) => (
          <div>
            <input
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
            <FieldInfo field={field} />
          </div>
        )}
      />

      <button type="submit">Save</button>
    </form>
  )
}
```

## Async Validation

Validate against server with debouncing.

```typescript
<form.Field
  name="username"
  validators={{
    onChange: z.string().min(3, 'Min 3 characters'),
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: async ({ value }) => {
      const exists = await checkUsernameExists(value)
      return exists ? 'Username already taken' : undefined
    },
  }}
  children={(field) => (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldInfo field={field} />
    </div>
  )}
/>
```

## Best Practices

1. **Use Zod validators** - Type-safe schema validation
2. **Debounce async validation** - Use `onChangeAsyncDebounceMs`
3. **Show validation state** - Display errors and loading
