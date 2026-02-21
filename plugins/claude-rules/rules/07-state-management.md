---
description: "Step 7 - React/Next.js state management: Zustand stores for shared state, TanStack Query for server state, useState for local only. FORBIDDEN: prop drilling, useContext for global state, useEffect for data fetching."
next_step: null
---

## State Management (React / Next.js - MANDATORY)

### Decision Table (ALWAYS follow)

| State Type | Solution | Location |
|------------|----------|----------|
| **Server state** (API data) | TanStack Query (`useQuery`, `useMutation`) | `modules/[feature]/src/hooks/` |
| **Global UI state** (theme, sidebar, modal) | Zustand store | `modules/cores/stores/` |
| **Feature shared state** (filters, selections) | Zustand store | `modules/[feature]/src/stores/` |
| **URL state** (search params, pagination) | TanStack Router (`useSearch`, `useParams`) | Route validators |
| **Form state** | TanStack Form / React Hook Form | `modules/[feature]/src/hooks/` |
| **Component local state** | `useState` | Inside component only |

### Zustand Store Rules

1. **Feature store** in `modules/[feature]/src/stores/` - scoped to feature
2. **Global store** in `modules/cores/stores/` - shared across features
3. **Max 40 lines** per store file (SOLID)
4. **Selectors** - always use selectors, never subscribe to entire store
5. **Actions** inside store, never outside

### Store Location Decision

```
Is it used by 2+ features?
  YES -> modules/cores/stores/
  NO  -> modules/[feature]/src/stores/

Is it server data (from API)?
  YES -> TanStack Query hook, NOT a store
  NO  -> Zustand store

Is it in the URL (page, filters, sort)?
  YES -> TanStack Router search params
  NO  -> Zustand or useState
```

### FORBIDDEN Patterns

- **Prop drilling** (passing state through 3+ component levels) -> use Zustand store
- **`useContext` for global state** -> use Zustand (better performance, selectors)
- **`useEffect` for data fetching** -> use TanStack Query
- **`useState` for shared state** -> use Zustand store
- **Store in component file** -> always in `stores/` directory
- **Subscribing to entire store** -> use selectors: `useStore(s => s.field)`
- **Mixing server + client state** in same store -> separate concerns
