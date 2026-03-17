---
name: defining-actions
description: defineAction patterns — input schema, handler, context, accept modes
when-to-use: creating new server actions
keywords: defineAction, input, handler, context, cookies, locals
priority: high
---

# Defining Actions

## When to Use

- Creating a new server function with validation
- Accessing cookies, locals, or request in a handler
- Handling both JSON and form data

## Basic Pattern

```typescript
// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  newsletter: {
    subscribe: defineAction({
      input: z.object({
        email: z.email(),
        name: z.string().optional(),
      }),
      handler: async (input, context) => {
        // input is fully typed from schema
        await db.newsletter.create({ data: input });
        return { success: true };
      },
    }),
  },
};
```

## Handler Context

```typescript
handler: async (input, ctx) => {
  ctx.cookies     // AstroCookies
  ctx.locals      // App.Locals
  ctx.request     // Request
  ctx.url         // URL
  ctx.redirect()  // Redirect helper
}
```

## Nested Actions

Actions can be organized in nested objects:

```typescript
export const server = {
  auth: {
    login: defineAction({ /* ... */ }),
    logout: defineAction({ /* ... */ }),
  },
  posts: {
    create: defineAction({ /* ... */ }),
    delete: defineAction({ /* ... */ }),
  },
};
```

## Auth Pattern

```typescript
import { defineAction, ActionError } from 'astro:actions';

handler: async (input, ctx) => {
  if (!ctx.locals.user) {
    throw new ActionError({
      code: 'UNAUTHORIZED',
      message: 'Must be logged in',
    });
  }
  // proceed with authenticated logic
}
```
