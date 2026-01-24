---
title: shadcn/ui Integration
description: Using TanStack Form with shadcn/ui Field components
---

# shadcn/ui Integration

Integrate TanStack Form with shadcn/ui components.

## Contact Form Example

Complete form with Input, Label, and Button components.

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

## Integration Patterns

### Field Component Wrapper

Create reusable field components.

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AnyFieldApi } from '@tanstack/react-form'

interface FormFieldProps {
  field: AnyFieldApi
  label: string
  placeholder?: string
  type?: string
}

export function FormField({
  field,
  label,
  placeholder,
  type = 'text',
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        type={type}
        placeholder={placeholder}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <p className="text-sm text-red-500">{field.state.meta.errors[0]}</p>
      )}
    </div>
  )
}
```

### Button State Management

Use form subscribe for button states.

```typescript
<form.Subscribe
  selector={(state) => ({
    canSubmit: state.canSubmit,
    isSubmitting: state.isSubmitting,
  })}
  children={({ canSubmit, isSubmitting }) => (
    <Button type="submit" disabled={!canSubmit} className="w-full">
      {isSubmitting ? 'Processing...' : 'Submit'}
    </Button>
  )}
/>
```

## Best Practices

1. **Extract field wrappers** - Reuse field UI across forms
2. **Use form.Subscribe** - Optimize re-renders with state selectors
3. **Handle submit state** - Disable button during submission
