---
name: shadcn-integration
description: Integrating TanStack Form with shadcn/ui Field components
when-to-use: Building forms with shadcn/ui Input, Label, Button components
keywords: shadcn, Field, FieldLabel, FieldError, Input, Button
priority: high
requires: basic-usage.md
related: field-api.md
---

# shadcn/ui Integration

## Using shadcn/ui Components with TanStack Form

TanStack Form works seamlessly with shadcn/ui primitive components. Use the `form.Field` component wrapper to connect validation and state management.

### Basic Field Pattern

```typescript
import { useForm } from '@tanstack/react-form'
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

export function UserForm() {
  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => console.log(value)
  })

  return (
    <form.Field
      name="email"
      validators={{ onChange: z.string().email() }}
    >
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Email</Label>
          <Input
            id={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
          {field.state.meta.errors[0] && (
            <span className="text-sm text-red-500">
              {field.state.meta.errors[0]}
            </span>
          )}
        </div>
      )}
    </form.Field>
  )
}
```

## Input Integration

Connect shadcn/ui Input component with form.Field:

```typescript
<form.Field name="username">
  {(field) => (
    <Input
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      disabled={form.state.isSubmitting}
    />
  )}
</form.Field>
```

## Select & Checkbox

```typescript
import { Select } from '@/modules/cores/shadcn/components/ui/select'
import { Checkbox } from '@/modules/cores/shadcn/components/ui/checkbox'

// Select
<form.Field name="role">
  {(field) => (
    <Select value={field.state.value} onValueChange={field.handleChange}>
      <option value="">Choose role...</option>
      <option value="admin">Admin</option>
    </Select>
  )}
</form.Field>

// Checkbox
<form.Field name="terms">
  {(field) => (
    <Checkbox
      checked={field.state.value}
      onCheckedChange={field.handleChange}
    />
  )}
</form.Field>
```

## Loading State with form.Subscribe

Use `form.Subscribe` to track submission state in Button:

```typescript
<form.Subscribe selector={(state) => [state.isSubmitting]}>
  {([isSubmitting]) => (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </Button>
  )}
</form.Subscribe>
```

## Complete Example

```typescript
export function CompleteForm() {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      await api.register(value)
    }
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      <form.Field name="email">
        {(field) => (
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors[0] && (
              <p className="text-sm text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.isSubmitting]}>
        {([isSubmitting]) => (
          <Button type="submit" disabled={isSubmitting}>
            Register
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

## Key Points

- Wrap each input in `form.Field` for state binding
- Use `field.state.value` and `field.handleChange()` for input sync
- Access errors via `field.state.meta.errors`
- Use `form.Subscribe` for loading states and button disabling
- Import from `@/modules/cores/shadcn/components/ui/` for SOLID compliance
