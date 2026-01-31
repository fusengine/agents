---
name: form-state
description: Form-level state management with canSubmit, isSubmitting, isDirty
when-to-use: Managing form submission state, validation status, dirty tracking
keywords: canSubmit, isSubmitting, isValid, isDirty, isTouched, errorMap
priority: medium
requires: basic-usage.md
related: field-api.md
---

# Form State Management

## Form State Properties

```typescript
// Access form state
const form = useForm({
  defaultValues: { email: '', password: '' }
})

// Core state properties
form.state.canSubmit        // bool: Form is valid and can submit
form.state.isSubmitting     // bool: Form submission in progress
form.state.isValid          // bool: All validations passed
form.state.isDirty          // bool: User changed any field
form.state.isTouched        // bool: Any field was touched
form.state.errors           // Record<string, ValidationError>
```

## Subscribe for Selective Re-renders

```typescript
// Subscribe only to needed state changes
form.Subscribe(
  selector={(state) => [state.canSubmit, state.isSubmitting]},
  children={([canSubmit, isSubmitting]) => (
    <button disabled={!canSubmit || isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  )}
/>

// Full state subscription
form.Subscribe(
  children={(state) => (
    <div>
      <p>Valid: {state.isValid}</p>
      <p>Dirty: {state.isDirty}</p>
    </div>
  )}
/>
```

## useStore for State Access

```typescript
// Get all form state
const state = form.useStore()
console.log(state.canSubmit, state.isDirty)

// Selector pattern for performance
const canSubmit = form.useStore((state) => state.canSubmit)
const isDirty = form.useStore((state) => state.isDirty)
```

## Error Map for Form-Level Errors

```typescript
// Access validation errors
const errors = form.state.errors

// Set form-level errors
form.setFieldValue('fieldName', value, {
  shouldValidate: true,
  shouldDirty: true
})

// Check specific field errors
if (errors.email) {
  console.log(errors.email.message)
}
```

## Reset and Submit Methods

```typescript
// Reset form to defaults
const handleReset = () => {
  form.reset()
}

// Handle form submission
const handleSubmit = form.handleSubmit(
  async (values) => {
    // Process valid data
    await submitForm(values)
  },
  (errors) => {
    // Handle validation errors
    console.log('Validation errors:', errors)
  }
)

// Programmatic submit
const submitProgrammatically = async () => {
  const isValid = await form.validateFields()
  if (isValid) {
    await form.handleSubmit()
  }
}
```

## Complete Example

```typescript
function LoginForm() {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onChange: validateForm }
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      <form.Field name="email" children={(field) => (
        <input {...field.attributes} />
      )} />

      <form.Subscribe
        selector={(s) => [s.canSubmit, s.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Login'}
          </button>
        )}
      />
    </form>
  )
}
```
