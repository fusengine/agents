---
name: forms
description: HTML form integration with Astro Actions — accept form, action attribute, FormData
when-to-use: handling HTML form submissions with server actions
keywords: form, accept, FormData, action attribute, HTML form
priority: high
---

# Forms with Astro Actions

## When to Use

- Submitting HTML forms to an action
- Handling file uploads via FormData
- Building forms that work without JavaScript

## Server: Define Form Action

```typescript
// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  contact: defineAction({
    accept: 'form',  // Parse FormData instead of JSON
    input: z.object({
      name: z.string().min(1),
      email: z.email(),
      message: z.string().min(10),
    }),
    handler: async (input) => {
      await sendEmail(input);
      return { success: true };
    },
  }),
};
```

## Client: HTML Form (No JS)

```astro
---
import { actions } from 'astro:actions';
---
<form method="POST" action={actions.contact}>
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

## Client: JS-Enhanced Form

```astro
<form id="contact-form">
  <input type="text" name="name" />
  <input type="email" name="email" />
  <textarea name="message"></textarea>
  <button type="submit">Send</button>
</form>

<script>
import { actions } from 'astro:actions';

const form = document.getElementById('contact-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const result = await actions.contact(new FormData(form));
  if (!result.error) {
    form.textContent = 'Message sent!';
  }
});
</script>
```

## Zod Validators for Form Types

| Input Type | Zod Handling |
|-----------|-------------|
| `<input type="number">` | `z.number()` — auto-coerced |
| `<input type="checkbox">` | `z.boolean()` |
| `<input type="file">` | `z.instanceof(File)` |
| Multiple values | `z.array(z.string())` |
