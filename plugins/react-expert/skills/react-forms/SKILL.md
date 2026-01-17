---
name: react-forms
description: TanStack Form with Zod validation - type-safe, headless, performant forms. Use when building forms, implementing validation, or handling form submissions in React.
---

# TanStack Form

Headless, type-safe, and performant form state management.

## Installation

```bash
bun add @tanstack/react-form zod
```

---

## Basic Form

```typescript
import { useForm } from '@tanstack/react-form'

function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
      await loginUser(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="email"
        children={(field) => (
          <div>
            <label htmlFor={field.name}>Email</label>
            <input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />

      <form.Field
        name="password"
        children={(field) => (
          <div>
            <label htmlFor={field.name}>Password</label>
            <input
              id={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />

      <button type="submit">Login</button>
    </form>
  )
}
```

---

## Field Validation

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

---

## Zod Validation

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

---

## Async Validation

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

---

## Field Arrays

```typescript
function TodoForm() {
  const form = useForm({
    defaultValues: {
      todos: [{ text: '' }],
    },
    onSubmit: async ({ value }) => {
      await saveTodos(value.todos)
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field name="todos" mode="array">
        {(field) => (
          <div>
            {field.state.value.map((_, i) => (
              <form.Field key={i} name={`todos[${i}].text`}>
                {(subField) => (
                  <div className="flex gap-2">
                    <input
                      value={subField.state.value}
                      onChange={(e) => subField.handleChange(e.target.value)}
                    />
                    <button type="button" onClick={() => field.removeValue(i)}>
                      Remove
                    </button>
                  </div>
                )}
              </form.Field>
            ))}
            <button type="button" onClick={() => field.pushValue({ text: '' })}>
              Add Todo
            </button>
          </div>
        )}
      </form.Field>
      <button type="submit">Save</button>
    </form>
  )
}
```

---

## Form State

```typescript
// Subscribe to specific state
<form.Subscribe
  selector={(state) => ({
    canSubmit: state.canSubmit,
    isSubmitting: state.isSubmitting,
    isDirty: state.isDirty,
    isValid: state.isValid,
  })}
  children={({ canSubmit, isSubmitting, isDirty }) => (
    <div>
      <button type="submit" disabled={!canSubmit}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
      {isDirty && <span>Unsaved changes</span>}
    </div>
  )}
/>
```

---

## With shadcn/ui

```typescript
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ContactForm() {
  const form = useForm({
    defaultValues: { name: '', email: '' },
    onSubmit: async ({ value }) => await sendContact(value),
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} className="space-y-4">
      <form.Field
        name="name"
        validators={{ onChange: z.string().min(2) }}
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Name</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      />

      <form.Subscribe
        selector={(s) => [s.canSubmit, s.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        )}
      />
    </form>
  )
}
```

---

## Best Practices

1. **Use Zod validators** - Type-safe schema validation
2. **Debounce async validation** - Use `onChangeAsyncDebounceMs`
3. **Show validation state** - Display errors and loading
4. **Use form.Subscribe** - Optimize re-renders
5. **Handle submit state** - Disable button during submission
