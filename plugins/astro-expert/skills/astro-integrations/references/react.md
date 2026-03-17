---
name: react
description: @astrojs/react setup, configuration, React 19 compatibility, options
when-to-use: adding React components to an Astro project
keywords: react, @astrojs/react, setup, React 19, JSX, hooks
priority: high
---

# @astrojs/react

## Installation

```bash
npx astro add react
# or manually:
npm install @astrojs/react react react-dom @types/react @types/react-dom
```

## Configuration

```typescript
// astro.config.ts
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

## tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

## Basic React Component

```tsx
// src/components/react/Counter.tsx
import { useState } from 'react';

export function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

## Usage in Astro

```astro
---
import { Counter } from '../components/react/Counter.tsx';
---
<Counter client:load initial={5} />
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `include` | `string[]` | Glob patterns for React files |
| `exclude` | `string[]` | Glob patterns to exclude |
| `experimentalReactChildren` | `boolean` | Pass Astro children as React children |

## React 19 Notes

- React 19 is the default with Astro 6
- Server Components are NOT supported in Astro Islands
- Use Astro components for server-only rendering
