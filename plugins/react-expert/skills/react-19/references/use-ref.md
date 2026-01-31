---
name: use-ref
description: useRef for DOM access and mutable values without re-render
when-to-use: DOM access, mutable values, timer refs, previous value pattern
keywords: useRef, ref, DOM, mutable, persistent
priority: high
related: use-imperative-handle.md, templates/ref-patterns.md
---

# useRef - DOM Access & Mutable Values

## Overview

`useRef` returns a mutable object that persists across renders without triggering re-renders.

**Signature:**
```typescript
const ref = useRef<T>(initialValue)
```

---

## Purpose

Two main use cases:
1. **DOM Access** - Direct reference to DOM elements
2. **Mutable Values** - Store values without re-renders (timer IDs, previous values)

---

## When to Use

| Use Case | Example |
|----------|---------|
| DOM access | Focus input, measure element |
| Timer IDs | Store setInterval/setTimeout reference |
| Previous value | Track previous state value |
| Mutable flags | isSubscribed, isMounted |
| Render count | Debug tracking (non-UI) |
| Avoiding stale closures | Latest value in async operations |

---

## When NOT to Use

| Bad | Why | Use Instead |
|-----|-----|-------------|
| Data affecting UI | No re-render on change | `useState` |
| Shared state | Not reactive | Context, Zustand |
| Persistent storage | Lost on unmount | localStorage, external state |

---

## Anti-Patterns

1. **Using ref instead of state** - UI won't update when ref changes
2. **Reading ref during render** - Value will be stale if changed in effect
3. **Mutating during render** - Side effect violation (use `useEffect`)
4. **Ref as dependency** - Won't trigger effect re-run

---

## Key Points

- Changing `.current` does NOT trigger re-render
- Perfect for timer IDs and DOM refs
- Use `useState` if value affects UI
- Lazy initialization: `if (!ref.current) ref.current = new ExpensiveObject()`
- Type safety: `useRef<HTMLInputElement>(null)` for DOM elements

→ See `templates/ref-patterns.md` for complete code examples
