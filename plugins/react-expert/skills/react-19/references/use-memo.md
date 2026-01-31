---
name: use-memo
description: useMemo for expensive calculations - mostly obsolete with React Compiler
when-to-use: expensive calculations (>100ms), stable references for deps
keywords: useMemo, memoization, performance, expensive, optimization
priority: medium
related: use-callback.md, react-compiler.md
---

# useMemo - Expensive Calculation Memoization

## Overview

`useMemo` memoizes (caches) the result of an expensive computation, recomputing only when dependencies change.

**Signature:**
```typescript
const memoizedValue = useMemo(() => expensiveComputation(a, b), [a, b])
```

**CRITICAL (React 19+)**: With **React Compiler**, manual `useMemo` is **mostly obsolete**.

---

## Purpose

Memoize values to avoid recomputation on every render.

**How it works:**
1. First render → executes computation
2. Subsequent renders → returns cached value if deps unchanged
3. Re-computes only when dependencies change

---

## When to Use (Rare with React Compiler)

| Use Case | Threshold |
|----------|-----------|
| Truly expensive computations | >100ms measured |
| Stable references for React.memo | Only if child is memoized |
| Large array filter/sort | >5000 items AND profiled as slow |

**Rule**: Profile first. If computation takes <50ms, skip `useMemo`.

---

## When NOT to Use (Most Cases)

| Anti-Pattern | Why | Solution |
|--------------|-----|----------|
| Cheap computations (<50ms) | Overhead > benefit | Compute directly |
| Small array operations | React Compiler handles it | Remove `useMemo` |
| Object literals | Auto-memoized by compiler | Remove `useMemo` |
| Memoizing JSX | JSX creation is cheap | Use React.memo on component |

---

## React Compiler Note

**With React Compiler enabled**, the following are **automatically optimized**:
- Array filter/map/reduce operations
- Object literals
- Simple derived values

**Only use `useMemo` manually when:**
- Profiling shows >100ms computation time
- Working with legacy code without compiler

---

## Anti-Patterns

1. **Memoizing everything** - Adds overhead for dependency checks
2. **Wrong dependencies** - Missing deps cause stale values
3. **Non-deterministic functions** - `Math.random()` breaks memoization

---

## Key Points

- React Compiler auto-memoizes most cases
- Profile before optimizing
- Enable ESLint rule `react-hooks/exhaustive-deps`
- 99% of cases don't need manual `useMemo` in React 19+

→ See `templates/memo-patterns.md` for complete code examples
