# Architecture Patterns for React 19

## Modular Architecture

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

---

## File Size Rules

| Type | Max Lines |
|------|-----------|
| Component | 50 |
| Hook | 30 |
| Service | 40 |
| Total file | 100 (split at 90) |

---

## Import Patterns

```typescript
// Module imports cores
import { Button } from '@/modules/cores/components/Button'
import { cn } from '@/modules/cores/lib/utils'

// Module imports own src
import type { User } from '../src/interfaces/user.interface'
import { useUser } from '../src/hooks/useUser'
```

---

## Split Strategy

When a file exceeds 90 lines, split into:

```text
feature/
├── main.ts          # Entry point, orchestration
├── validators.ts    # Validation logic
├── types.ts         # Type definitions
├── utils.ts         # Helper functions
└── constants.ts     # Static values
```

---

## Forbidden Patterns

| Pattern | Why |
|---------|-----|
| Interfaces in components | Violates separation |
| Files > 100 lines | Must split |
| Business logic in components | Use hooks/services |
| Class components | Use function components |
| Missing JSDoc | All exports documented |
| `any` type | Use proper types |
| Barrel exports (index.ts) | Direct imports only |
| `useEffect` for data fetching | Use TanStack Query |
