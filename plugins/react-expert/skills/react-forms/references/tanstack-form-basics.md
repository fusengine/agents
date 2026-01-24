---
title: TanStack Form Basics
description: Core hooks, configuration, and field management
---

# TanStack Form Basics

## Installation

```bash
bun add @tanstack/react-form zod
```

## useForm Hook

Core hook for managing form state and submission.

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

## Form State Subscription

Subscribe to specific form states for optimized re-renders.

```typescript
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

## Field Arrays

Manage dynamic field arrays with add/remove operations.

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
