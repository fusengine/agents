---
name: use-state
description: useState for local component state - simple values, toggles, form inputs. For global state use Zustand.
when-to-use: local UI state, toggles, form inputs, counters
keywords: useState, local state, setter, functional update
priority: high
related: templates/state-patterns.md
---

# useState - Local Component State

## Overview

Local state for simple values in a single component.

**Signature:**
```typescript
const [state, setState] = useState<T>(initialValue)
```

---

## Purpose

Store local UI state that:
- Belongs to ONE component
- Triggers re-render on change
- Is simple (primitives, small objects)

---

## When to Use

| Use Case | Example |
|----------|---------|
| Toggles | Modal open/close, accordion |
| Form inputs | Controlled inputs before submit |
| Counters | Local increment/decrement |
| UI flags | Loading, error, isEditing |

---

## When NOT to Use

| Need | Use Instead |
|------|-------------|
| Shared state | Zustand |
| Server data | TanStack Query or React 19 `use()` |
| URL state | TanStack Router |
| Complex logic | useReducer |

---

## Key Patterns

1. **Functional update** - `setState(prev => prev + 1)` for async safety
2. **Lazy init** - `useState(() => expensive())` for costly initialization
3. **Object spread** - `setState(prev => ({ ...prev, key: value }))`

---

## Anti-Patterns

1. **Derived state** - Compute from existing state instead
2. **Direct mutation** - Never mutate objects/arrays directly
3. **Constants in state** - Don't store values that never change
4. **Multiple useState for related values** - Use single object or useReducer

---

## Dependency Array Context

useState triggers re-renders. If you use state values in callbacks:
- Wrap callbacks in `useCallback` if passed to memoized children
- Use functional updates when new state depends on old state

---

## SOLID Compliance

Files < 100 lines. Split complex state logic:

```text
modules/[feature]/components/
├── Counter.tsx          (< 50 lines)
└── UserForm.tsx         (< 50 lines)

modules/[feature]/src/hooks/
└── useFormState.ts      (< 30 lines - extracted hook)
```

See `solid-react/references/` for file organization rules.

---

## Complete Code Examples

→ See `templates/state-patterns.md` for:
- Counter with step
- Toggle state
- Form input state
- Object state
- Array state
- Lazy initialization
