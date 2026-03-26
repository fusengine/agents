---
name: query-patterns
description: useQuery, useMutation, queryClient, cache invalidation patterns for TanStack Query v5
when-to-use: Implementing client-side data fetching, mutations, cache management
keywords: useQuery, useMutation, queryClient, invalidation, staleTime, gcTime
priority: high
requires: null
related: hydration.md
---

# Query Patterns

## useQuery — Fetching Data

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'

export function UserList() {
  const { data, isPending, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then((res) => res.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map((user: { id: string; name: string }) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

## useMutation — Modifying Data

```tsx
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

export function CreateUserForm() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newUser: { name: string }) =>
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      mutation.mutate({ name: formData.get('name') as string })
    }}>
      <input name="name" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
```

## Optimistic Updates

Use `onMutate` to optimistically update cache, `onError` to rollback with saved previous data, and `onSettled` to invalidate for server truth. Pattern: cancel queries, snapshot previous, set optimistic data, return context for rollback.

## Query Key Conventions

```tsx
const usersKey = ['users'] as const           // List
const userKey = ['users', userId] as const     // Detail
const postsKey = ['users', userId, 'posts'] as const  // Nested
```

## Cache Invalidation

- `invalidateQueries({ queryKey: ['users', id] })` — exact key
- `invalidateQueries({ queryKey: ['users'] })` — fuzzy match (all user queries)
- `removeQueries({ queryKey: ['users', id] })` — remove from cache
- `refetchQueries({ type: 'active' })` — refetch all active queries
