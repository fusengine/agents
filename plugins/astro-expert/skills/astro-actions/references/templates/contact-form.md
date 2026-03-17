---
name: contact-form
description: Complete contact form with Astro Actions — server action + HTML form + JS enhancement
when-to-use: building a contact or feedback form
keywords: contact, form, actions, progressive enhancement, email
---

# Contact Form Template

## src/actions/index.ts

```typescript
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.email('Invalid email address'),
      message: z.string().min(20, 'Message must be at least 20 characters'),
    }),
    handler: async (input) => {
      // Send email or save to DB
      console.log('Contact form submission:', input);
      return { success: true, name: input.name };
    },
  }),
};
```

## src/pages/contact.astro

```astro
---
import { actions, getActionResult } from 'astro:actions';

const result = getActionResult(Astro, actions.contact);
const success = result && !result.error;
const errors = result?.error?.fields;
---

{success && (
  <div class="success">
    Thanks {result.data.name}! We'll be in touch.
  </div>
)}

<form method="POST" action={actions.contact} id="contact-form">
  <div>
    <label for="name">Name</label>
    <input id="name" name="name" type="text" required />
    {errors?.name && <span class="error">{errors.name}</span>}
  </div>

  <div>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required />
    {errors?.email && <span class="error">{errors.email}</span>}
  </div>

  <div>
    <label for="message">Message</label>
    <textarea id="message" name="message" required></textarea>
    {errors?.message && <span class="error">{errors.message}</span>}
  </div>

  <button type="submit">Send Message</button>
</form>

<script>
import { actions } from 'astro:actions';

document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const result = await actions.contact(new FormData(form));
  if (!result.error) {
    form.innerHTML = '<p>Message sent successfully!</p>';
  }
});
</script>
```
