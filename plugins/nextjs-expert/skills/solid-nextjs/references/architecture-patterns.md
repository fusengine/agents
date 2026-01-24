# Architecture Patterns for Next.js

## Modular Architecture

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

---

## Feature Module Structure

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

---

## Cores Module (Shared)

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
