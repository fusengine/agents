---
name: preact
description: @astrojs/preact setup — lightweight React alternative, signals, options
when-to-use: adding Preact components (smaller bundle than React)
keywords: preact, @astrojs/preact, signals, lightweight, setup
priority: low
---

# @astrojs/preact

## When to Use Preact over React

- Need React-compatible API with smaller bundle size (~3kb vs ~40kb)
- Using Preact Signals for fine-grained reactivity
- Performance-critical interactive components

## Installation

```bash
npx astro add preact
```

## Configuration

```typescript
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  integrations: [preact({ compat: true })],
});
```

## Basic Component

```tsx
// src/components/preact/Counter.tsx
import { useState } from 'preact/hooks';

export function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

## Preact Signals

```tsx
import { signal, computed } from '@preact/signals';

const count = signal(0);
const doubled = computed(() => count.value * 2);

export function SignalCounter() {
  return (
    <div>
      <button onClick={() => count.value++}>
        {count} (doubled: {doubled})
      </button>
    </div>
  );
}
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `compat` | `boolean` | Enable React compatibility layer |
| `include` | `string[]` | Glob patterns for Preact files |
