---
name: basic-usage
description: Basic TanStack Form patterns with useForm, Field, and formOptions
when-to-use: Creating simple forms with validation
keywords: useForm, Field, formOptions, defaultValues, onSubmit
priority: high
requires: installation.md
related: field-api.md, validation-zod.md
---

# Basic TanStack Form Usage

Essential TanStack Form patterns for Next.js forms.

## Form Options Pattern (Shared)

```typescript
// lib/forms/contact-form.ts
import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Min 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>

export const contactFormOpts = formOptions({
  defaultValues: {
    name: '',
    email: '',
    message: '',
  },
})
```

---

## useForm Hook Setup

```typescript
// components/ContactForm.tsx
'use client'

import { useForm } from '@tanstack/react-form'
import { contactFormOpts, contactSchema } from '@/lib/forms/contact-form'
import { submitContact } from '@/app/actions/contact'

export function ContactForm() {
  const form = useForm({
    ...contactFormOpts,
    onSubmit: async ({ value }) => {
      const result = await submitContact(value)
      if (result.error) {
        form.setErrorMap({
          onServer: {
            message: result.error,
          },
        })
      }
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      e.stopPropagation()
      form.handleSubmit()
    }}>
      {/* form content */}
    </form>
  )
}
```

---

## Form.Field with Render Props

```typescript
<form.Field
  name="email"
  validators={{
    onChange: contactSchema.pick({ email: true }),
  }}
>
  {(field) => (
    <div className="mb-4">
      <label
        htmlFor={field.name}
        className="block text-sm font-medium"
      >
        Email
      </label>
      <input
        id={field.name}
        name={field.name}
        type="email"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="w-full px-3 py-2 border rounded"
      />
      {field.state.meta.errors[0] && (
        <p className="mt-1 text-sm text-red-500">
          {field.state.meta.errors[0]}
        </p>
      )}
    </div>
  )}
</form.Field>
```

---

## Subscribe for Submit State

```typescript
<form.Subscribe
  selector={(state) => [
    state.canSubmit,
    state.isSubmitting,
    state.errors,
  ]}
>
  {([canSubmit, isSubmitting, errors]) => (
    <div>
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.map((error) => (
            <p key={error as string}>{error}</p>
          ))}
        </div>
      )}
      <button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )}
</form.Subscribe>
```

---

## Complete Form Example

```typescript
// app/contact/page.tsx
'use client'

import { useForm } from '@tanstack/react-form'
import { contactFormOpts } from '@/lib/forms/contact-form'
import { submitContact } from '@/app/actions/contact'

export default function ContactPage() {
  const form = useForm({
    ...contactFormOpts,
    onSubmit: async ({ value }) => {
      await submitContact(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="max-w-md mx-auto p-6 space-y-4"
    >
      <form.Field name="name">
        {(field) => (
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="message">
        {(field) => (
          <div>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(s) => [s.canSubmit, s.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Send'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

---

## Key Concepts

| Concept | Purpose |
|---------|---------|
| `formOptions()` | Shared config (defaults, validation) |
| `useForm()` | Initialize form with options |
| `form.Field` | Render individual field with state |
| `field.state` | Current value, errors, metadata |
| `form.Subscribe` | Watch specific form state |
| `form.handleSubmit()` | Trigger validation and submit |
