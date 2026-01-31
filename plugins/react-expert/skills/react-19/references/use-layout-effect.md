---
name: use-layout-effect
description: useLayoutEffect for synchronous DOM measurements before paint
when-to-use: DOM measurements, tooltip positioning, animation setup
keywords: useLayoutEffect, synchronous, DOM, layout, paint
priority: medium
related: use-effect.md
---

# useLayoutEffect - Synchronous DOM Effects

## Overview

`useLayoutEffect` fires synchronously after DOM mutations but **before** browser paint.

**Signature:**
```typescript
useLayoutEffect(() => { /* effect */ }, [deps])
```

**Key difference from useEffect:**
- `useEffect` runs **after paint** (async)
- `useLayoutEffect` runs **before paint** (sync, blocking)

---

## Purpose

Measure DOM elements or update state before browser paints to avoid visual flickers.

---

## When to Use

| Use Case | Example |
|----------|---------|
| DOM measurements | Measure element size/position for tooltips |
| Preventing flickers | Update state before paint to avoid visible flash |
| Animation setup | Initialize animations with correct dimensions |
| Scroll position restoration | Restore scroll before paint to avoid jump |

---

## When NOT to Use

| Bad | Why | Use Instead |
|-----|-----|-------------|
| Data fetching | Blocks rendering | `useEffect` or TanStack Query |
| Event listeners (non-layout) | Unnecessary blocking | `useEffect` |
| Server-side rendering | Doesn't run on server (warning) | `useEffect` |
| Heavy computations | Delays first paint | `useMemo` or `useEffect` |

---

## Anti-Patterns

1. **Overusing for non-layout tasks** - Blocks paint unnecessarily
2. **Heavy computations** - Delays rendering
3. **Nested state updates** - Multiple synchronous renders

---

## Key Points

- **Synchronous execution** - Blocks browser paint (performance cost)
- **Use sparingly** - Only when layout measurements needed
- **SSR incompatible** - Doesn't run on server
- **Same API as useEffect** - Signature and cleanup identical
- **Profile first** - Confirm visual flicker exists before using

→ See `templates/layout-effect-patterns.md` for complete code examples
