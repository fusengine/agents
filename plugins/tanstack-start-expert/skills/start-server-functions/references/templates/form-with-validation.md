---
name: form-with-validation
description: FormData server function with progressive enhancement
keywords: formdata, form, validator, progressive enhancement, post, url
---

# FormData Server Function with Validation

Handles an HTML form submission via a POST server function. `FormData` is only
valid as POST input; validate its shape manually or with Zod.

## Usage

Copy into a route file. The `.url` property enables progressive enhancement
(the form still submits without JavaScript).

---

## Server Function

```tsx
// src/utils/contact.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export const submitContact = createServerFn({ method: 'POST' })
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error('Expected FormData')
    }
    // Coerce FormData into a typed object, then validate with Zod
    return ContactSchema.parse({
      name: data.get('name')?.toString() ?? '',
      email: data.get('email')?.toString() ?? '',
    })
  })
  .handler(async ({ data }) => {
    await db.contacts.create({ data })
    return { ok: true }
  })
```

---

## Component (client-enhanced)

```tsx
// src/routes/contact.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { submitContact } from '~/utils/contact.functions'

export const Route = createFileRoute('/contact')({ component: ContactForm })

function ContactForm() {
  const submit = useServerFn(submitContact)

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        await submit({ data: formData })
      }}
    >
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">Send</button>
    </form>
  )
}
```

---

## Progressive Enhancement (no JS)

Point the form `action` at the function's generated URL so it works before
hydration:

```tsx
<form method="POST" action={submitContact.url}>
  <input name="name" required />
  <input name="email" type="email" required />
  <button type="submit">Send</button>
</form>
```
