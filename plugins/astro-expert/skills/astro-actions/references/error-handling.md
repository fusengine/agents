---
name: error-handling
description: ActionError codes, client-side error handling, isActionError type guard
when-to-use: throwing and catching action errors
keywords: ActionError, error, codes, isActionError, UNAUTHORIZED, BAD_REQUEST
priority: high
---

# Action Error Handling

## When to Use

- Returning typed errors from server to client
- Distinguishing between validation and business logic errors
- Showing user-facing error messages

## ActionError Codes

| Code | HTTP | Use Case |
|------|------|----------|
| `BAD_REQUEST` | 400 | Invalid input |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not permitted |
| `NOT_FOUND` | 404 | Resource missing |
| `CONFLICT` | 409 | Duplicate resource |
| `TOO_MANY_REQUESTS` | 429 | Rate limit |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error |

## Throwing ActionError

```typescript
import { defineAction, ActionError } from 'astro:actions';

handler: async (input, ctx) => {
  const user = await db.users.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new ActionError({
      code: 'NOT_FOUND',
      message: 'No account found with this email.',
    });
  }

  if (!ctx.cookies.has('session')) {
    throw new ActionError({
      code: 'UNAUTHORIZED',
      message: 'Please log in first.',
    });
  }
}
```

## Client-Side Error Handling

```typescript
import { actions, isActionError } from 'astro:actions';

const result = await actions.auth.login({ email, password });

if (result.error) {
  if (isActionError(result.error, 'UNAUTHORIZED')) {
    showMessage('Invalid credentials');
  } else if (isActionError(result.error, 'TOO_MANY_REQUESTS')) {
    showMessage('Too many attempts, try later');
  } else {
    showMessage('Something went wrong');
  }
}
```
