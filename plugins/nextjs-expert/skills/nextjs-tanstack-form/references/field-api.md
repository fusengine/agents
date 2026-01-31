---
name: field-api
description: Complete Field API reference with state, handlers, and validators
when-to-use: Understanding field state, validation, and event handling
keywords: field.state, handleChange, handleBlur, meta.errors, meta.isTouched
priority: high
requires: basic-usage.md
related: validation-zod.md, async-validation.md
---

# Field API Reference

## Field State Structure

### field.state
Reactive field state object containing value and metadata:

```typescript
field.state.value        // Current field value
field.state.meta         // Metadata object
field.state.meta.errors  // Array of validation errors
field.state.meta.isTouched    // Field has been focused/blurred
field.state.meta.isDirty      // Field value changed from initial
field.state.meta.isValidating // Async validation in progress
field.state.meta.isPristine   // Value equals initial value
```

## Event Handlers

### handleChange
Called on value changes, updates field.state.value:

```typescript
<input
  value={field.state.value}
  onChange={(e) => field.handleChange(e.target.value)}
/>
```

### handleBlur
Called on blur, sets meta.isTouched and triggers onBlur validators:

```typescript
<input onBlur={() => field.handleBlur()} />
```

## Validators Configuration

### Validator Timing Options
```typescript
field.validate({
  onChange: (value) => validateEmail(value),
  onBlur: (value) => checkEmailExists(value),
  onSubmit: (value) => finalValidation(value)
})
```

- **onChange**: Real-time as user types
- **onBlur**: After field loses focus
- **onSubmit**: On form submission only

## Async Validation

### asyncDebounceMs
Delay async validator execution to reduce API calls:

```typescript
field.validate({
  onChange: async (value) => {
    const available = await checkUsername(value)
    return available ? undefined : 'Username taken'
  },
  asyncDebounceMs: 500 // Wait 500ms between calls
})
```

## Error Display Patterns

### Basic Error Rendering
```typescript
function EmailField() {
  const field = form.getFieldState('email')

  return (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={() => field.handleBlur()}
      />
      {field.state.meta.errors?.length > 0 && (
        <ul className="errors">
          {field.state.meta.errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### Conditional Validation Display
```typescript
{field.state.meta.isTouched &&
 field.state.meta.errors?.length > 0 && (
  <p className="error">{field.state.meta.errors[0]}</p>
)}
```

### Validating State Indicator
```typescript
{field.state.meta.isValidating && (
  <span className="validating">Checking...</span>
)}
```

## Common Field Patterns

### Text Input
```typescript
const nameField = form.getFieldState('name')
<input
  value={nameField.state.value}
  onChange={(e) => nameField.handleChange(e.target.value)}
  onBlur={() => nameField.handleBlur()}
/>
```

### Select Input
```typescript
const roleField = form.getFieldState('role')
<select
  value={roleField.state.value}
  onChange={(e) => roleField.handleChange(e.target.value)}
>
  <option value="">Select role</option>
  <option value="admin">Admin</option>
</select>
```

### Checkbox
```typescript
const agreeField = form.getFieldState('terms')
<input
  type="checkbox"
  checked={agreeField.state.value}
  onChange={(e) => agreeField.handleChange(e.target.checked)}
/>
```
