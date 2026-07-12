---
name: hook-template
applies-to: "**/src/modules/**/hooks/*.ts"
description: Client hook wrapping a Start server function via useServerFn / TanStack Query (< 30 lines)
---

# Client Hook (< 30 lines)

For interactive (non-loader) calls, wrap a server function in a hook. Use
`useServerFn` so redirects/not-found from the server function are handled, and
TanStack Query for cache when needed.

## Mutation via useServerFn

```typescript
// src/modules/users/src/hooks/useCreateUser.ts
import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '../functions/create-user.functions'

/**
 * Create a user and invalidate the users list on success.
 */
export function useCreateUser() {
  const create = useServerFn(createUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { email: string; role: string }) => create({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}
```

## Query via useServerFn

```typescript
// src/modules/users/src/hooks/useUser.ts
import { useServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '../functions/users.functions'

/**
 * Fetch a user by ID for interactive (non-loader) use.
 *
 * @param id - User ID
 */
export function useUser(id: string) {
  const get = useServerFn(getUser)
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => get({ data: { id } }),
    enabled: !!id,
  })
}
```

---

## Rules

- Max 30 lines.
- Prefer route **loaders** for initial data; use hooks for user-triggered calls.
- Wrap server functions in `useServerFn` inside components/hooks.
- Import types from `../interfaces/`, JSDoc every export.
- Never call `localStorage`/DOM at module scope (hydration safety).
