---
name: hook-template
description: React hook template with TanStack Query (< 30 lines)
---

# React Hook (< 30 lines)

## Query Hook (TanStack Query)

```typescript
// modules/users/src/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/user.service'

/**
 * Fetch user by ID.
 *
 * @param id - User ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id),
    enabled: !!id
  })
}
```

---

## Mutation Hook

```typescript
// modules/users/src/hooks/useUpdateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/user.service'
import type { UpdateUserInput } from '../interfaces/user.interface'

/**
 * Update user mutation with cache invalidation.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      userService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
```

---

## Optimistic Update Hook

```typescript
// modules/todos/src/hooks/useToggleTodo.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoService } from '../services/todo.service'
import type { Todo } from '../interfaces/todo.interface'

/**
 * Toggle todo with optimistic update.
 */
export function useToggleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: todoService.toggle,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previous = queryClient.getQueryData<Todo[]>(['todos'])

      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      )

      return { previous }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['todos'], context?.previous)
    }
  })
}
```

---

## State Hook

```typescript
// modules/cores/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

/**
 * Persist state in localStorage.
 *
 * @param key - Storage key
 * @param initialValue - Default value
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
```

---

## Rules

- Max 30 lines
- Use TanStack Query for data fetching (NOT useEffect)
- Import types from `../interfaces/`
- JSDoc for all exports
- Single responsibility per hook
