---
name: react-compiler
description: Automatic memoization and performance optimization with React Compiler
when-to-use: performance optimization, removing useMemo/useCallback boilerplate
keywords: React Compiler, memoization, useMemo, useCallback, auto-optimize
priority: medium
requires: react-19.md
related: react-19.md
---

# React Compiler

## When to Use

- Automatic memoization
- Removing useMemo/useCallback
- Performance optimization
- Clean component code

## Why React Compiler

| Feature | Benefit |
|---------|---------|
| Auto memo | No manual useMemo |
| Zero runtime | Build-time transforms |
| Optimal | Compiler knows best |
| Clean code | Remove boilerplate |

## Enable in Next.js 16
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,  // Built-in in v16
}

export default nextConfig
```

## What It Does
- **Auto-memoization**: No need for `useMemo`, `useCallback`, `memo`
- **Optimized re-renders**: Compiler determines optimal updates
- **Zero runtime cost**: Transformations at build time

## Before (Manual)
```typescript
// Without React Compiler
import { memo, useCallback, useMemo } from 'react'

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  const processed = useMemo(() => expensiveCalc(data), [data])
  const handler = useCallback(() => onClick(data.id), [onClick, data.id])

  return <div onClick={handler}>{processed}</div>
})
```

## After (Automatic)
```typescript
// With React Compiler - no manual optimization needed
function ExpensiveComponent({ data, onClick }) {
  const processed = expensiveCalc(data)
  const handler = () => onClick(data.id)

  return <div onClick={handler}>{processed}</div>
}
```

## Opt-out Directive
```typescript
// Disable for specific file
'use no memo'

function LegacyComponent() {
  // Manual optimization still works
}
```

## Opt-out Specific Component
```typescript
function MyComponent() {
  'use no memo'
  // This component won't be optimized
}
```

## ESLint Plugin (Optional)
```bash
bun add -D eslint-plugin-react-compiler
```

```js
// eslint.config.js
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: { 'react-compiler/react-compiler': 'error' },
  },
]
```

## Requirements
- React 19+
- Next.js 16+
- Strict Mode enabled
