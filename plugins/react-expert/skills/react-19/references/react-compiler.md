---
name: react-compiler
description: React Compiler - automatic memoization, useMemo/useCallback mostly obsolete
when-to-use: performance optimization, understanding when to still memoize
keywords: React Compiler, memoization, useMemo, useCallback, memo, performance
priority: high
related: ../react-performance/SKILL.md
---

# React Compiler

## What Is It?

Build-time optimization that automatically adds memoization where needed.

**Status:** Stable since October 2025 (React 19.1+)

---

## What It Does

- Analyzes component purity at build time
- Automatically caches values (like `useMemo`)
- Automatically caches functions (like `useCallback`)
- Skips re-renders when props unchanged (like `React.memo`)

---

## Impact on Code

### Before (Manual)
You had to wrap values and functions with memoization hooks.

### After (Automatic)
Just write normal code - Compiler handles optimization.

---

## Installation

### Vite
Install `babel-plugin-react-compiler` and add to Vite config.

### Next.js 15+
Enable `reactCompiler: true` in experimental config.

---

## When You Still Need Manual Memoization

### 1. Reference Identity for useEffect
When `useMemo` ensures stable reference for effect dependencies.

### 2. Very Expensive Computations (>100ms)
For clarity and intentional caching of heavy operations.

### 3. Third-Party Libraries
Some libraries need stable references that Compiler might not optimize.

### 4. Custom Comparison Functions
`React.memo` with custom areEqual function.

---

## What Compiler Cannot Optimize

1. **Impure components** (side effects in render)
2. **Dynamic component selection**
3. **Complex hooks with interleaved state**
4. **External mutations**

---

## Recommendation for 2026

| Situation | Approach |
|-----------|----------|
| New code | Don't use useMemo/useCallback |
| Existing code | Leave as-is or remove after testing |
| useEffect deps | May still need useMemo |
| Third-party libs | Test carefully |

---

## Performance Gains (Reported)

- Meta Quest Store: 12% faster initial load
- Interactive operations: 2.5× faster

---

## Related

→ See `react-performance` skill for comprehensive performance guide
