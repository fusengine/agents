---
name: solid-nextjs
description: SOLID principles for Next.js 16 with modular architecture. Files < 100 lines, interfaces separated, JSDoc mandatory.
---

# SOLID Next.js - Modular Architecture

## Current Date (CRITICAL)

**Today: January 2026** - ALWAYS use the current year for your searches.
Search with "2025" or "2026", NEVER with past years.

## MANDATORY: Research Before Coding

**CRITICAL: Check today's date first, then search documentation and web BEFORE writing any code.**

1. **Use Context7** to query Next.js/React official documentation
2. **Use Exa web search** with current year for latest trends
3. **Check Vercel Blog** of current year for new features
4. **Verify package versions** for Next.js 16 compatibility

```text
WORKFLOW:
1. Check date → 2. Research docs + web (current year) → 3. Apply latest patterns → 4. Code
```

**Search queries (replace YYYY with current year):**
- `Next.js [feature] YYYY best practices`
- `React 19 [component] YYYY`
- `TypeScript [pattern] YYYY`
- `Prisma 7 [feature] YYYY`

Never assume - always verify current APIs and patterns exist for the current year.

---

## Codebase Analysis (MANDATORY)

**Before ANY implementation:**
1. Explore project structure to understand architecture
2. Read existing related files to follow established patterns
3. Identify naming conventions, coding style, and patterns used
4. Understand data flow and dependencies

**Continue implementation by:**
- Following existing patterns and conventions
- Matching the coding style already in place
- Respecting the established architecture
- Integrating with existing services/components

## DRY - Reuse Before Creating (MANDATORY)

**Before writing ANY new code:**
1. Search existing codebase for similar functionality
2. Check shared locations: `modules/cores/lib/`, `modules/cores/components/`
3. If similar code exists → extend/reuse instead of duplicate

**When creating new code:**
- Extract repeated logic (3+ occurrences) into shared helpers
- Place shared utilities in `modules/cores/lib/`
- Place shared components in `modules/cores/components/`
- Document reusable functions with JSDoc

---

## Absolute Rules (MANDATORY)

### 1. Files < 150 lines

- **Split at 90 lines** - Never exceed 150
- Page components < 50 lines (use composition)
- Server Components < 80 lines
- Client Components < 60 lines
- Server Actions < 30 lines each

### 2. Modular Architecture

```text
src/
├── app/                        # Routes (orchestration ONLY)
│   ├── (auth)/login/page.tsx   # Imports from modules/auth
│   └── layout.tsx
│
└── modules/                    # ALL modules here
    ├── cores/                  # Shared (global to app)
    │   ├── components/         # Shared UI (Button, Modal)
    │   ├── database/           # Prisma client
    │   ├── lib/                # Utilities
    │   ├── middleware/         # Next.js middlewares
    │   └── stores/             # Global state
    │
    ├── auth/                   # Feature module
    │   ├── api/
    │   ├── components/
    │   └── src/
    │       ├── interfaces/
    │       ├── services/
    │       ├── hooks/
    │       └── stores/
    │
    └── [feature]/              # Other feature modules
```

### 3. JSDoc Mandatory

```typescript
/**
 * Fetch user by ID from database.
 *
 * @param id - User unique identifier
 * @returns User object or null if not found
 * @throws DatabaseError on connection failure
 */
export async function getUserById(id: string): Promise<User | null>
```

### 4. Interfaces Separated

```text
modules/auth/src/
├── interfaces/          # Types ONLY
│   ├── user.interface.ts
│   └── session.interface.ts
├── services/            # NO types here
└── components/          # NO types here
```

---

## Module Structure

### Feature Module

```text
modules/[feature]/
├── api/                 # API routes
├── components/          # UI (< 100 lines each)
└── src/
    ├── interfaces/      # Types ONLY
    ├── services/        # Business logic
    ├── hooks/           # React hooks
    └── stores/          # State
```

### Cores Module (Shared)

```text
modules/cores/
├── components/          # Shared UI (Button, Modal)
├── database/            # Prisma singleton
│   └── prisma.ts
├── lib/                 # Utilities
├── middleware/          # Auth, rate limiting
└── stores/              # Global state
```

---

## Import Patterns

### Page imports Module

```typescript
// app/(auth)/login/page.tsx
import { LoginForm } from '@/modules/auth/components/LoginForm'

export default function LoginPage() {
  return <LoginForm />
}
```

### Module imports Cores

```typescript
// modules/auth/src/services/user.service.ts
import { prisma } from '@/modules/cores/database/prisma'
import { hashPassword } from '@/modules/cores/lib/crypto'
```

### Module imports own src

```typescript
// modules/auth/components/LoginForm.tsx
import type { LoginFormProps } from '../src/interfaces/form.interface'
import { useAuth } from '../src/hooks/useAuth'
```

---

## SOLID Principles

### S - Single Responsibility

1 module = 1 feature domain

```typescript
// ❌ BAD - Mixed concerns in page
export default function LoginPage() {
  // validation, API calls, formatting, rendering...
}

// ✅ GOOD - Page orchestrates modules
import { LoginForm } from '@/modules/auth/components/LoginForm'

export default function LoginPage() {
  return <LoginForm />
}
```

### O - Open/Closed

Modules extensible without modification

```typescript
// modules/auth/src/interfaces/provider.interface.ts
export interface AuthProvider {
  login(credentials: Credentials): Promise<Session>
  logout(): Promise<void>
}

// New providers without modifying existing code
// modules/auth/src/services/github.provider.ts
// modules/auth/src/services/google.provider.ts
```

### L - Liskov Substitution

All implementations respect contracts

```typescript
// Any AuthProvider can be swapped
const provider: AuthProvider = new GitHubProvider()
// or
const provider: AuthProvider = new GoogleProvider()
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

// ✅ GOOD - Separated
interface Authenticatable { login(): void; logout(): void }
interface Editable { updateProfile(): void }
```

### D - Dependency Inversion

Depend on interfaces, not implementations

```typescript
// modules/auth/src/services/auth.service.ts
import type { AuthProvider } from '../interfaces/provider.interface'

export function createAuthService(provider: AuthProvider) {
  return {
    async authenticate(credentials: Credentials) {
      return provider.login(credentials)
    }
  }
}
```

---

## Templates

### Server Component (< 80 lines)

```typescript
// app/(dashboard)/users/page.tsx
import { UserList } from '@/modules/users/components/UserList'
import { getUsers } from '@/modules/users/src/services/user.service'

/**
 * Users list page - Server Component.
 */
export default async function UsersPage() {
  const users = await getUsers()
  return <UserList users={users} />
}
```

### Client Component (< 60 lines)

```typescript
// modules/auth/components/LoginForm.tsx
'use client'

import { useState } from 'react'
import type { LoginFormProps } from '../src/interfaces/form.interface'

/**
 * Login form - Client Component.
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')

  return (
    <form onSubmit={() => onSuccess()}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button>Login</button>
    </form>
  )
}
```

### Service File

```typescript
// modules/auth/src/services/auth.service.ts
import { prisma } from '@/modules/cores/database/prisma'
import type { Credentials, Session } from '../interfaces/user.interface'

/**
 * Authenticate user with credentials.
 */
export async function authenticate(credentials: Credentials): Promise<Session | null> {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  })

  if (!user) return null
  return { user, token: '...', expiresAt: new Date() }
}
```

---

## Response Guidelines

1. **Research first** - MANDATORY: Search Context7 + Exa before ANY code
2. **Show complete code** - Working examples, not snippets
3. **Explain decisions** - Why this pattern over alternatives
4. **Include tests** - Always suggest test cases
5. **Handle errors** - Never ignore, use error boundaries
6. **Type everything** - Full TypeScript, no `any`
7. **Document code** - JSDoc for complex functions

---

## Forbidden

- ❌ Coding without researching docs first (ALWAYS research)
- ❌ Using outdated APIs without checking current year docs
- ❌ Files > 150 lines
- ❌ Interfaces in component files
- ❌ Business logic in `app/` pages
- ❌ Direct DB calls in components
- ❌ Module importing another module (except cores)
- ❌ `'use client'` by default
- ❌ `useEffect` for data fetching
- ❌ Missing JSDoc on exports
- ❌ `any` type
- ❌ Barrel exports
