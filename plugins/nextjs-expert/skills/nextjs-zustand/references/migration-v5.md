---
name: migration-v5
description: Migration guide from Zustand v4 to v5
when-to-use: Upgrading existing Zustand stores to v5
keywords: migration, v4, v5, breaking changes, upgrade
priority: medium
requires: installation.md
related: typescript.md, middleware.md
---

# Migration v4 → v5

## Breaking Changes Summary

| Change | v4 | v5 |
|--------|----|----|
| React version | >= 16.8 | >= 18.0 |
| TypeScript | >= 3.4 | >= 4.5 |
| ES target | ES5 | ES6+ |
| shallow import | `zustand/shallow` | `zustand/shallow` (useShallow) |
| create syntax | `create<T>((set) => {})` | `create<T>()((set) => {})` |

---

## Syntax Change

### Store Creation

```typescript
// v4 (deprecated)
import { create } from 'zustand'

const useStore = create<State>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}))

// v5 (required)
import { create } from 'zustand'

const useStore = create<State>()((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}))
//                        ^^ double parentheses
```

---

## Shallow Equality

### useShallow Hook

```typescript
// v4
import { shallow } from 'zustand/shallow'

const [count, increment] = useStore(
  (state) => [state.count, state.increment],
  shallow
)

// v5
import { useShallow } from 'zustand/shallow'

const [count, increment] = useStore(
  useShallow((state) => [state.count, state.increment])
)
```

### Object Selector

```typescript
// v4
import { shallow } from 'zustand/shallow'

const { user, setUser } = useStore(
  (state) => ({ user: state.user, setUser: state.setUser }),
  shallow
)

// v5
import { useShallow } from 'zustand/shallow'

const { user, setUser } = useStore(
  useShallow((state) => ({ user: state.user, setUser: state.setUser }))
)
```

---

## Middleware Type Changes

### With Middleware

```typescript
// v4
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useStore = create<State, [
  ['zustand/devtools', never],
  ['zustand/persist', State]
]>(
  devtools(
    persist(
      (set) => ({ /* state */ }),
      { name: 'storage' }
    )
  )
)

// v5 - types inferred automatically
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({ /* state */ }),
      { name: 'storage' }
    )
  )
)
```

---

## useSyncExternalStore

v5 uses React 18's native `useSyncExternalStore`. No shim package needed.

```bash
# v4 - remove this dependency
bun remove use-sync-external-store

# v5 - included in React 18
```

---

## Deprecated APIs

### getServerSnapshot

```typescript
// v4 - deprecated
create((set, get, api) => {
  api.getServerState // deprecated
})

// v5 - use getInitialState
create((set, get, api) => {
  api.getInitialState() // returns initial state
})
```

---

## Migration Checklist

- [ ] Update React to >= 18.0
- [ ] Update TypeScript to >= 4.5
- [ ] Change `create<State>()` to `create<State>()()`
- [ ] Replace `shallow` with `useShallow`
- [ ] Remove `use-sync-external-store` package
- [ ] Update middleware type annotations (or remove them)
- [ ] Test hydration with persist middleware
- [ ] Verify DevTools still works

---

## Common Migration Errors

### TypeError: create is not a function

```typescript
// Wrong - old v4 syntax
const useStore = create<State>((set) => ({}))

// Fix - v5 syntax
const useStore = create<State>()((set) => ({}))
```

### shallow is not a function

```typescript
// Wrong - old import
import { shallow } from 'zustand/shallow'
useStore(selector, shallow)

// Fix - new useShallow hook
import { useShallow } from 'zustand/shallow'
useStore(useShallow(selector))
```

### Type errors with middleware

```typescript
// Wrong - explicit middleware types
const useStore = create<State, [['zustand/devtools', never]]>(...)

// Fix - let TypeScript infer
const useStore = create<State>()(...)
```
