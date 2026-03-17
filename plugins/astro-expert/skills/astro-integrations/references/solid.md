---
name: solid
description: @astrojs/solid-js setup, configuration, SolidJS signals, options
when-to-use: adding SolidJS components to an Astro project
keywords: solid, @astrojs/solid-js, SolidJS, signals, setup, JSX
priority: medium
---

# @astrojs/solid-js

## Installation

```bash
npx astro add solid-js
# or manually:
npm install @astrojs/solid-js solid-js
```

## Configuration

```typescript
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';

export default defineConfig({
  integrations: [solidJs()],
});
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  }
}
```

## Basic SolidJS Component

```tsx
// src/components/solid/Counter.tsx
import { createSignal } from 'solid-js';

interface Props {
  initial?: number;
}

export function Counter(props: Props) {
  const [count, setCount] = createSignal(props.initial ?? 0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count()}
    </button>
  );
}
```

## Usage in Astro

```astro
---
import { Counter } from '../components/solid/Counter.tsx';
---
<Counter client:load initial={5} />
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `include` | `string[]` | Glob patterns for Solid files |
| `exclude` | `string[]` | Glob patterns to exclude |

## Multiple JSX Frameworks

When using Solid with React or Preact, use `include` to avoid conflicts:

```typescript
import react from '@astrojs/react';
import solidJs from '@astrojs/solid-js';

integrations: [
  react({ include: ['**/react/**'] }),
  solidJs({ include: ['**/solid/**'] }),
]
```
