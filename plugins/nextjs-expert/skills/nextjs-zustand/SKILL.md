---
name: nextjs-zustand
description: This skill should be used when the user asks about "state management", "global state", "Zustand", "client state", "store", or "persist state". Covers Zustand for Next.js App Router with hydration handling and persist middleware.
version: 1.0.0
user-invocable: false
references:
  - path: references/store-patterns.md
    title: Store Patterns
  - path: references/hydration.md
    title: Hydration Handling
---

# Zustand for Next.js

State management for Next.js Client Components.

## Installation

```bash
bun add zustand
```

---

## Important: Client Components Only

```typescript
// ❌ BAD - Server Component
export default function Page() {
  const count = useCounterStore((s) => s.count) // Error!
}

// ✅ GOOD - Client Component
'use client'
export function Counter() {
  const count = useCounterStore((s) => s.count)
}
```

---

## Quick Start: Basic Store

```typescript
// stores/useCounterStore.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
```

See [Store Patterns](references/store-patterns.md) for async actions and persist.

---

## Devtools

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({ /* state */ }),
    { name: 'AppStore' }
  )
)
```

---

## Best Practices

1. **Client Components only** - Use `'use client'` directive
2. **Handle hydration** - Avoid hydration mismatches
3. **Selector pattern** - `useStore((s) => s.field)` for performance
4. **Separate stores** - One store per domain (auth, cart, ui)
5. **Server state** - Use TanStack Query for server data

See [Hydration](references/hydration.md) for SSR patterns.
