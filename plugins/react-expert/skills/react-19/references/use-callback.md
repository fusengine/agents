---
name: use-callback
description: useCallback for stable function references - mostly obsolete with React Compiler
when-to-use: functions to React.memo children, stable deps for effects
keywords: useCallback, memoization, function, optimization
priority: medium
related: use-memo.md, react-compiler.md
---

# useCallback - Function Memoization

## Overview

`useCallback` returns a memoized version of a callback function, recomputing only when dependencies change.

**Signature:**
```typescript
const memoizedFn = useCallback((arg) => doSomething(arg), [dependency])
```

**CRITICAL (React 19+)**: With **React Compiler**, manual `useCallback` is **mostly obsolete**.

---

## Purpose

Stabilize function references to prevent unnecessary re-renders in memoized children.

**How it works:**
1. First render → creates function
2. Subsequent renders → returns same function reference if deps unchanged
3. Creates new function only when dependencies change

---

## When to Use (Rare with React Compiler)

| Use Case | Scenario |
|----------|----------|
| Passing to React.memo children | Prevent child re-renders |
| Stable dependency for useEffect | Avoid effect re-runs |
| Custom hook return values | Stable API for consumers |

**Note**: With React Compiler, these are auto-optimized.

---

## When NOT to Use (Most Cases)

| Anti-Pattern | Why | Solution |
|--------------|-----|----------|
| All event handlers | Unnecessary overhead | Regular functions |
| Functions not passed as props | No benefit | Regular functions |
| Non-memoized children | Child re-renders anyway | Memo child or skip |
| Wrapping setState | setState is already stable | Use directly |

---

## React Compiler Note

**With React Compiler enabled**, function references are **automatically stabilized** when safe.

**Only use `useCallback` manually when:**
- Working with legacy code without compiler
- Profiling shows performance issue from unstable functions

---

## Anti-Patterns

1. **Stale closures** - Empty deps array captures old values
2. **Wrong dependencies** - Missing deps cause stale values
3. **Over-wrapping** - useCallback on every function is overhead

---

## Key Points

- React Compiler auto-stabilizes function references
- Always pair with `React.memo` for benefit
- Enable ESLint rule `react-hooks/exhaustive-deps`
- 95% of cases don't need manual `useCallback` in React 19+
- `useCallback(fn, deps)` === `useMemo(() => fn, deps)`

→ See `templates/callback-patterns.md` for complete code examples
