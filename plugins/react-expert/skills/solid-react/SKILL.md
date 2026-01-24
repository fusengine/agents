---
name: solid-react
description: SOLID principles for React 19. Files < 100 lines, hooks separated, interfaces in src/interfaces/, JSDoc mandatory. Use for React architecture and code quality.
user-invocable: false
---

# SOLID React - Component Architecture

## Current Date (CRITICAL)

**Today: January 2026** - ALWAYS use the current year for searches.
Search with "2025" or "2026", NEVER with past years.

## MANDATORY: Research Before Coding

**CRITICAL: Check today's date first, then search documentation BEFORE writing any code.**

1. **Use Context7** to query React official documentation
2. **Use Exa web search** with current year for latest trends
3. **Verify package versions** for React 19 compatibility

```text
WORKFLOW:
1. Check date → 2. Research docs + web (current year) → 3. Apply latest patterns → 4. Code
```

---

## Codebase Analysis (MANDATORY)

**Before ANY implementation:**
1. Explore project structure to understand architecture
2. Read existing related files to follow established patterns
3. Identify naming conventions, coding style, and patterns used

---

## Absolute Rules (MANDATORY)

### 1. Files < 100 lines

- **Split at 90 lines** - Never exceed 100
- Components < 50 lines (use composition)
- Hooks < 30 lines each
- Services < 40 lines each

### 2. Modular Architecture

```text
src/
├── modules/                    # ALL modules here
│   ├── cores/                  # Shared (global to app)
│   │   ├── components/         # Shared UI (Button, Modal)
│   │   ├── lib/                # Utilities
│   │   └── stores/             # Global state
│   │
│   ├── auth/                   # Feature module
│   │   ├── components/
│   │   └── src/
│   │       ├── interfaces/
│   │       ├── services/
│   │       ├── hooks/
│   │       └── stores/
│   │
│   └── [feature]/              # Other feature modules
│
├── routes/                     # TanStack Router routes
└── main.tsx
```

### 3. JSDoc Mandatory

```typescript
/**
 * Fetch user by ID from API.
 *
 * @param id - User unique identifier
 * @returns User object or null if not found
 */
export async function getUserById(id: string): Promise<User | null>
```

### 4. Interfaces Separated

```text
modules/[feature]/src/interfaces/
├── user.interface.ts
├── post.interface.ts
└── api.interface.ts
```

**NEVER put interfaces in component files.**

---

## SOLID Principles

### S - Single Responsibility

1 component = 1 UI concern
1 hook = 1 logic concern

```typescript
// ❌ BAD - Mixed concerns
function UserProfile() {
  // fetching, formatting, validation, rendering...
}

// ✅ GOOD - Separated
function UserProfile({ user }: UserProfileProps) {
  return <UserCard user={user} />
}

function useUser(id: string) {
  // fetching logic only
}
```

### O - Open/Closed

Components extensible without modification

```typescript
// Extensible via props
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}
```

### L - Liskov Substitution

All implementations respect contracts

```typescript
interface DataSource<T> {
  fetch(): Promise<T[]>
}

// Any DataSource can be swapped
const apiSource: DataSource<User> = new ApiDataSource()
const mockSource: DataSource<User> = new MockDataSource()
```

### I - Interface Segregation

Small, focused interfaces

```typescript
// ❌ BAD
interface UserModule {
  login(): void
  logout(): void
  updateProfile(): void
  sendEmail(): void
}

// ✅ GOOD
interface Authenticatable { login(): void; logout(): void }
interface Editable { updateProfile(): void }
```

### D - Dependency Inversion

Depend on interfaces, not implementations

```typescript
// src/services/user.service.ts
import type { HttpClient } from '../interfaces/http.interface'

export function createUserService(client: HttpClient) {
  return {
    async getUser(id: string) {
      return client.get(`/users/${id}`)
    }
  }
}
```

---

## Templates

### Component (< 50 lines)

```typescript
// modules/users/components/UserCard.tsx
import type { UserCardProps } from '../src/interfaces/user.interface'

/**
 * User card component.
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

### Custom Hook (< 30 lines)

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

### Service (< 40 lines)

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

### Import Patterns

```typescript
// Module imports cores
import { Button } from '@/modules/cores/components/Button'
import { cn } from '@/modules/cores/lib/utils'

// Module imports own src
import type { User } from '../src/interfaces/user.interface'
import { useUser } from '../src/hooks/useUser'
```

---

## Forbidden

- ❌ Coding without researching docs first
- ❌ Files > 100 lines
- ❌ Interfaces in component files
- ❌ Business logic in components
- ❌ Class components
- ❌ Missing JSDoc on exports
- ❌ `any` type
- ❌ Barrel exports (index.ts re-exports)
- ❌ `useEffect` for data fetching (use TanStack Query or Router loaders)
