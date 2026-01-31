---
name: architecture-patterns
description: React modular architecture with TanStack Router, feature modules, cores
when-to-use: project setup, architecture decisions, code organization
keywords: architecture, modular, structure, TanStack Router, modules, cores
priority: high
related: single-responsibility.md, templates/component.md, templates/service.md
---

# Architecture Patterns for React 19

## Modular Architecture Overview

```text
src/
├── modules/                    # ALL business logic here
│   ├── cores/                  # Shared (global to app)
│   │   ├── components/         # Shared UI
│   │   ├── lib/                # Utilities
│   │   └── stores/             # Global state
│   │
│   └── [feature]/              # Feature modules
│       ├── components/
│       └── src/
│           ├── interfaces/
│           ├── services/
│           ├── hooks/
│           └── stores/
│
├── routes/                     # TanStack Router
└── main.tsx
```

---

## Feature Module Structure

Each feature is self-contained:

```text
modules/[feature]/
├── components/          # UI (< 50 lines each)
└── src/
    ├── interfaces/      # Types ONLY
    ├── services/        # Business logic
    ├── hooks/           # React hooks
    ├── stores/          # Zustand state
    └── validators/      # Zod schemas
```

→ See `templates/` for each file type

---

## Cores Module (Shared)

Used by all features:

```text
modules/cores/
├── components/          # Button, Modal, Input
├── lib/                 # cn(), formatters, helpers
├── interfaces/          # Shared interfaces (HttpClient)
├── factories/           # DI factories
├── errors/              # Base error classes
└── stores/              # Theme, session
```

---

## File Size Rules

| Type | Max Lines | Purpose |
|------|-----------|---------|
| Component | 50 | UI rendering only |
| Hook | 30 | Single logic concern |
| Service | 40 | API operations |
| Store | 40 | State management |
| Total file | 100 | Split at 90 |

---

## Import Rules

### 1. Routes import Modules

```typescript
// routes/users.tsx
import { UserList } from '@/modules/users/components/UserList'
```

### 2. Feature imports Cores

```typescript
// modules/users/components/UserCard.tsx
import { Button } from '@/modules/cores/components/Button'
```

### 3. Feature imports own src

```typescript
// modules/users/components/UserCard.tsx
import type { User } from '../src/interfaces/user.interface'
import { useUser } from '../src/hooks/useUser'
```

### 4. FORBIDDEN: Feature imports another Feature

```typescript
// ❌ NEVER DO THIS
// modules/users/components/UserCard.tsx
import { OrderList } from '@/modules/orders/components/OrderList'
```

If needed → move to `cores/`

---

## TanStack Router Integration

### Route with Loader

```typescript
// routes/users.$id.tsx
export const Route = createFileRoute('/users/$id')({
  loader: ({ params }) => userService.getById(params.id),
  component: UserPage
})
```

→ See `react-tanstack-router` skill for details

### Route with Search Params

```typescript
// routes/products.tsx
export const Route = createFileRoute('/products')({
  validateSearch: (search) => productSearchSchema.parse(search),
  component: ProductsPage
})
```

→ See `templates/validator.md` for search schemas

---

## State Management Strategy

| State Type | Solution |
|------------|----------|
| Server state | TanStack Query |
| URL state | TanStack Router |
| Component state | useState |
| Global UI state | Zustand |
| Form state | TanStack Form / React Hook Form |

---

## Forbidden Patterns

| Pattern | Why | Solution |
|---------|-----|----------|
| Types in component | Violates SRP | → `interfaces/` |
| Logic in component | Violates SRP | → `hooks/` or `services/` |
| Files > 100 lines | Hard to maintain | → Split |
| Feature → Feature import | Tight coupling | → `cores/` |
| `useEffect` for fetch | Race conditions | → TanStack Query |
| Barrel exports | Bundle bloat | Direct imports |

---

## Where to Find Code Templates?

→ `templates/component.md` - Component structure
→ `templates/hook.md` - Hook with TanStack Query
→ `templates/service.md` - Service with DI
→ `templates/store.md` - Zustand patterns
→ `templates/interface.md` - Type definitions
