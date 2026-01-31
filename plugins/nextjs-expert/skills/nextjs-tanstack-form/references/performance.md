---
name: performance
description: Performance optimization patterns for TanStack Form
when-to-use: Optimizing large forms, reducing re-renders, improving UX
keywords: form.Subscribe, useStore, signals, debounce, memoization
priority: low
requires: form-state.md
related: field-api.md
---

# Performance Optimization

## form.Subscribe for Selective Re-renders

Use `form.Subscribe()` to listen only to specific form parts instead of re-rendering on every change:

```typescript
// Bad: Re-renders entire component on any field change
function FormComponent() {
  const { values } = useForm()
  return <div>{values.email}</div>
}

// Good: Re-renders only when email changes
function FormComponent() {
  const form = useForm()
  return (
    <form.Subscribe selector={(state) => [state.values.email]}>
      {([email]) => <div>{email}</div>}
    </form.Subscribe>
  )
}
```

## useStore Hook Pattern

Leverage Zustand integration for predictable state management:

```typescript
const store = useStore()
const email = store((state) => state.values.email)
```

## Signal-Based Reactivity

TanStack Form uses signals for fine-grained reactivity—only affected subscribers update.

## Debouncing Async Validation

Prevent excessive API calls during validation:

```typescript
const handleBlur = debounce(
  async (value) => {
    const isValid = await validateEmailExists(value)
    setFieldError('email', !isValid ? 'Email taken' : '')
  },
  500
)
```

## Avoid Common Pitfalls

- ❌ Validating on every keystroke (use debounce)
- ❌ Unnecessary object recreation in selectors
- ❌ Subscribing to entire form state
- ✅ Use memoization for expensive selectors
- ✅ Keep selectors pure and stable
