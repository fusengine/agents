---
name: progressive-enhancement
description: Progressive enhancement patterns with Astro Actions — works without JS, redirect after submit
when-to-use: building forms that work without JavaScript and enhance with it
keywords: progressive enhancement, redirect, no JS, fallback, action result
priority: medium
---

# Progressive Enhancement with Actions

## When to Use

- Forms must work without JavaScript
- Showing success/error state after redirect
- Building accessible, resilient UIs

## Pattern: Native Form + Redirect

Server action redirects after success — works without JS:

```typescript
// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  newsletter: defineAction({
    accept: 'form',
    input: z.object({ email: z.email() }),
    handler: async (input, ctx) => {
      await subscribeEmail(input.email);
      // Return data; page handles redirect
      return { subscribed: true };
    },
  }),
};
```

```astro
---
// src/pages/newsletter.astro
import { actions, getActionResult } from 'astro:actions';

const result = getActionResult(Astro, actions.newsletter);
const success = result && !result.error;
---

{success && <p>Subscribed successfully!</p>}
{result?.error && <p>Error: {result.error.message}</p>}

<form method="POST" action={actions.newsletter}>
  <input type="email" name="email" required />
  <button type="submit">Subscribe</button>
</form>
```

## getActionResult()

```typescript
import { getActionResult } from 'astro:actions';

// In .astro frontmatter
const result = getActionResult(Astro, actions.myAction);
// result?.data — success data
// result?.error — ActionError if failed
```

## JS Enhancement Layer

```astro
<script>
import { actions } from 'astro:actions';

// Override form submit for enhanced UX (AJAX)
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const result = await actions.newsletter(new FormData(e.target));
  // Update UI without page reload
});
</script>
```
