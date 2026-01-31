---
name: use-effect
description: useEffect for side effects - event listeners, timers, subscriptions. ALWAYS cleanup.
when-to-use: event listeners, timers, subscriptions, DOM side effects
keywords: useEffect, cleanup, side effects, dependency array
priority: high
related: templates/effect-patterns.md
---

# useEffect - Side Effects

## Overview

Run side effects after render with cleanup support.

**Signature:**
```typescript
useEffect(() => {
  // Effect code
  return () => { /* cleanup */ }
}, [dependencies])
```

---

## Purpose

Handle side effects that:
- Happen AFTER render (DOM ready)
- Need cleanup on unmount or dep change
- Don't block browser paint

---

## When to Use

| Use Case | Example |
|----------|---------|
| Event listeners | window resize, keydown |
| Timers | setInterval, setTimeout |
| Subscriptions | WebSocket, SSE, observers |
| DOM manipulation | Focus, scroll position |
| Browser APIs | localStorage sync, online status |

---

## When NOT to Use

| Anti-Pattern | Use Instead |
|--------------|-------------|
| Data fetching | React 19 `use()` hook or TanStack Query |
| Derived state | Compute directly or `useMemo` |
| Event handlers | Direct handler functions |
| Transform props | Compute in render |

---

## Dependency Array (3 Cases)

| Array | Behavior |
|-------|----------|
| `[a, b]` | Re-run when `a` or `b` change |
| `[]` | Run once on mount only |
| omitted | Run after EVERY render (avoid) |

---

## Cleanup Function

Return a cleanup function for:
- Event listeners (removeEventListener)
- Timers (clearInterval, clearTimeout)
- Subscriptions (WebSocket.close, unsubscribe)
- AbortController (abort fetch)

**Pattern:**
```typescript
useEffect(() => {
  const handler = () => { /* ... */ }
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}, [])
```

---

## Anti-Patterns

1. **Fetching with useEffect** - Use React 19 `use()` or TanStack Query instead
2. **Setting state from props in effect** - Compute directly or use key prop
3. **Omitting dependencies** - Always include all used values
4. **Missing cleanup** - Causes memory leaks
5. **Infinite loops** - Effect updates its own dependencies

---

## React 19 Alternative: `use()` Hook

For async data, prefer React 19's `use()`:

```typescript
// ❌ OLD: useEffect for fetching
useEffect(() => {
  fetch('/api/users').then(res => res.json()).then(setUsers)
}, [])

// ✅ NEW: use() hook
const users = use(fetchUsers())
```

---

## SOLID Compliance

Extract complex effects to custom hooks:

```text
modules/[feature]/src/hooks/
├── useWindowSize.ts     (< 30 lines)
├── useWebSocket.ts      (< 30 lines)
└── useKeyboard.ts       (< 30 lines)
```

See `solid-react/references/` for hook patterns.

---

## Complete Code Examples

→ See `templates/effect-patterns.md` for:
- Event listeners
- Timers/intervals
- WebSocket subscriptions
- Keyboard shortcuts
- AbortController pattern
- Document title sync
- Online/offline detection
