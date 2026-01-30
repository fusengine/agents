# Code Templates for React 19

## Component Template (< 50 lines)

```typescript
// modules/users/components/UserCard.tsx
import type { UserCardProps } from '../src/interfaces/user.interface'

/**
 * User card component displaying user information.
 */
export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  )
}
```

---

## Custom Hook Template (< 30 lines)

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
    userService.getById(id).then(setUser).finally(() => setLoading(false))
  }, [id])

  return { user, loading }
}
```

---

## Service Template (< 40 lines)

```typescript
// modules/users/src/services/user.service.ts
import type { User } from '../interfaces/user.interface'

/**
 * User service for API calls.
 */
export const userService = {
  async getById(id: string): Promise<User | null> {
    const res = await fetch(`/api/users/${id}`)
    if (!res.ok) return null
    return res.json()
  },

  async getAll(): Promise<User[]> {
    const res = await fetch('/api/users')
    return res.json()
  },
}
```

---

## Interface Template

```typescript
// modules/users/src/interfaces/user.interface.ts

/**
 * User entity from API.
 */
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

/**
 * Props for UserCard component.
 */
export interface UserCardProps {
  user: User
  onEdit: (id: string) => void
}
```

---

## Store Template (Zustand)

```typescript
// modules/users/src/stores/user.store.ts
import { create } from 'zustand'
import type { User } from '../interfaces/user.interface'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  clear: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}))
```
