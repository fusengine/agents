---
name: 03-execution
description: Implement React code following SOLID principles
prev_step: references/react/02-features-plan.md
next_step: references/react/03.5-elicit.md
---

# 03 - Execution (React/Vite)

**Implement React code following plan (APEX Phase E).**

## When to Use

- After plan is complete and approved
- Follow TodoWrite task order
- Update progress as you go

---

## Execution Order

### Strict Sequence

```text
1. Interfaces/Types FIRST
2. Hooks (logic)
3. Components (presentation)
4. Integration (routes, stores)
5. Tests
```

---

## Code Quality Rules

### File Size (ABSOLUTE)

```text
STOP at 90 lines -> Split immediately
NEVER exceed 100 lines
Target: 50-80 lines per file
```

### Component Template (<50 lines)

```typescript
// modules/users/components/UserCard.tsx
import type { UserCardProps } from '../src/interfaces/user.interface'
import { useUser } from '../src/hooks/useUser'

/**
 * Display user information card.
 */
export function UserCard({ userId, onEdit }: UserCardProps) {
  const { user, loading } = useUser(userId)

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{user.name}</h3>
      <p className="text-muted-foreground">{user.email}</p>
      {onEdit && (
        <button onClick={() => onEdit(user.id)}>Edit</button>
      )}
    </div>
  )
}
```

### Hook Template (<30 lines)

```typescript
// modules/users/src/hooks/useUser.ts
import { useState, useEffect } from 'react'
import type { User } from '../interfaces/user.interface'
import { userService } from '../services/user.service'

/**
 * Fetch and manage user state.
 */
export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userService.getById(id)
      .then(setUser)
      .finally(() => setLoading(false))
  }, [id])

  return { user, loading }
}
```

---

## React 19 Patterns

### Form with useActionState

```typescript
import { useActionState } from 'react'

function LoginForm() {
  const [error, submitAction, isPending] = useActionState(
    async (prev: string | null, formData: FormData) => {
      const result = await login(formData)
      return result.error ?? null
    },
    null
  )

  return (
    <form action={submitAction}>
      <input name="email" type="email" required />
      <button disabled={isPending}>
        {isPending ? 'Loading...' : 'Login'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
```

### Optimistic UI

```typescript
import { useOptimistic } from 'react'

function TodoList({ todos, onAdd }: Props) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  )

  const handleAdd = async (formData: FormData) => {
    const text = formData.get('text') as string
    addOptimistic({ id: 'temp', text, completed: false })
    await createTodo(text)
  }

  return (/* render optimisticTodos */)
}
```

---

## Import Order

```typescript
// 1. React
import { useState, useEffect } from 'react'

// 2. External packages
import { z } from 'zod'

// 3. Internal absolute (@/)
import { Button } from '@/modules/cores/components/Button'
import { cn } from '@/modules/cores/lib/utils'

// 4. Module relative
import type { UserProps } from '../src/interfaces/user.interface'
import { useUser } from '../src/hooks/useUser'
```

---

## Anti-Patterns

```text
- Skip interfaces, write inline types
- Create files >100 lines
- Put logic in components (extract to hooks)
- useEffect for data fetching (use loaders/Query)
- Class components
- forwardRef (use ref prop directly)
- any type
```

---

## Validation Checklist

```text
[ ] Interfaces created first
[ ] All files <100 lines
[ ] JSDoc on all exports
[ ] Hooks extract logic from components
[ ] React 19 patterns used
[ ] No forbidden patterns
[ ] Local dev server works
```

---

## Next Phase

-> Proceed to `04-validation.md`
