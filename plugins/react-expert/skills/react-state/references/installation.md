---
name: installation
description: Zustand v5 installation and initial setup for React
when-to-use: Starting with Zustand in a React project
keywords: install, setup, bun, create, store
priority: high
requires: null
related: store-patterns.md, typescript.md
---

# Zustand Installation

## Install Dependencies

```bash
# Core library
bun add zustand

# Optional: Immer for immutable updates
bun add immer
```

---

## Version Requirements

| Dependency | Version |
|------------|---------|
| zustand | >= 5.0.0 |
| react | >= 18.0.0 |
| typescript | >= 4.5.0 |

---

## Basic Store Setup

```typescript
// modules/cores/stores/counter.store.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

---

## Usage in Client Component

```typescript
// modules/cores/components/Counter.tsx


import { useCounterStore } from '@/modules/cores/stores/counter.store'

export function Counter() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
```

---

## v5 Syntax Change

```typescript
// v4 (deprecated)
const useStore = create<State>((set) => ({ ... }))

// v5 (required for TypeScript)
const useStore = create<State>()((set) => ({ ... }))
//                           ^^ double parentheses
```

The currying syntax `create<State>()()` ensures full TypeScript inference.

---

## Project Structure (SOLID)

```
modules/
├── cores/
│   ├── stores/
│   │   ├── theme.store.ts
│   │   └── ui.store.ts
│   └── interfaces/
│       └── store.interface.ts
├── auth/
│   └── src/
│       ├── stores/
│       │   └── auth.store.ts
│       └── interfaces/
│           └── auth.interface.ts
└── cart/
    └── src/
        └── stores/
            └── cart.store.ts
```
