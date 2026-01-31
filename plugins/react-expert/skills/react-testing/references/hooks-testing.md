---
name: hooks-testing
description: Testing custom hooks with renderHook
when-to-use: Testing hooks in isolation
keywords: renderHook, custom hooks, act, wrapper
priority: medium
related: react-19-hooks.md, templates/hook-basic.md
---

# Testing Custom Hooks

## When to Use renderHook

| Use renderHook | Use Component Test |
|----------------|-------------------|
| Complex logic | Simple hooks |
| Reusable hooks | Component-specific |
| Isolated testing | Integration testing |

---

## Basic Pattern

```typescript
const { result } = renderHook(() => useMyHook())
```

---

## Key Concepts

### result.current

Access current hook return value.

### act()

Wrap state updates that happen outside React's control.

### rerender()

Re-run hook with new props.

### wrapper

Provide context providers.

---

## When Context Needed

Hooks using context require wrapper:

| Hook Uses | Wrapper Needed |
|-----------|----------------|
| ThemeContext | ThemeProvider |
| QueryClient | QueryClientProvider |
| Router | RouterProvider |

---

## Async Hooks

For hooks with async operations:

1. Render hook
2. Assert initial state (loading)
3. waitFor final state
4. Assert data

---

## When NOT to Use

Prefer component tests when:
- Hook is simple useState wrapper
- Integration testing is more valuable
- Hook is tightly coupled to component

---

## Where to Find Code?

→ `templates/hook-basic.md` - Complete hook test examples
