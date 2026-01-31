---
name: use-sync-external-store
description: useSyncExternalStore for external stores - browser APIs, third-party state
when-to-use: browser APIs (localStorage, matchMedia), external stores, non-React state
keywords: useSyncExternalStore, external store, subscribe, snapshot
priority: medium
related: templates/external-store.md
---

# useSyncExternalStore - External Store Integration

## Overview

`useSyncExternalStore` lets you read values from external stores (non-React state) in a concurrent-safe way.

**Signature:**
```typescript
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

---

## Purpose

Subscribe to external data sources while supporting:
- **Concurrent rendering** - Safe with React 18+ features
- **SSR/hydration** - Server snapshot support
- **Tearing prevention** - Consistent UI during transitions

---

## When to Use

| Use Case | Example |
|----------|---------|
| Browser APIs | Online status, media queries, window size |
| localStorage | Reactive localStorage with sync across tabs |
| External stores | Custom stores, Redux, third-party state |
| Non-React subscriptions | EventEmitter, WebSocket, browser events |

---

## When NOT to Use

| Bad | Why | Use Instead |
|-----|-----|-------------|
| React state | Wrong tool | `useState`, `useReducer` |
| Server state | Wrong tool | TanStack Query |
| Props/Context | Already reactive | Direct usage |

---

## Anti-Patterns

1. **Not memoizing subscribe** - New function every render causes re-subscription
2. **Side effects in getSnapshot** - Must be pure function
3. **Missing server snapshot** - Hydration mismatch on SSR

---

## Key Points

- **Concurrent-safe** - Works with React 18+ features
- **SSR support** - Server snapshot for hydration
- **Subscribe pattern** - Must return cleanup function
- **Pure getSnapshot** - No side effects allowed
- **External focus** - For non-React data sources only

→ See `templates/external-store.md` for complete code examples
