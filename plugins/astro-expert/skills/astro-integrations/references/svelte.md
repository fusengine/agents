---
name: svelte
description: @astrojs/svelte setup, configuration, Svelte 5 runes, options
when-to-use: adding Svelte components to an Astro project
keywords: svelte, @astrojs/svelte, Svelte 5, runes, setup, SFC
priority: medium
---

# @astrojs/svelte

## Installation

```bash
npx astro add svelte
# or manually:
npm install @astrojs/svelte svelte
```

## Configuration

```typescript
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  integrations: [svelte()],
});
```

## Basic Svelte Component (Svelte 5 Runes)

```svelte
<!-- src/components/svelte/Counter.svelte -->
<script lang="ts">
  let { initial = 0 }: { initial?: number } = $props();
  let count = $state(initial);
</script>

<button onclick={() => count++}>Count: {count}</button>
```

## Usage in Astro

```astro
---
import Counter from '../components/svelte/Counter.svelte';
---
<Counter client:load initial={5} />
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `include` | `string[]` | Glob patterns for Svelte files |
| `exclude` | `string[]` | Glob patterns to exclude |
| `preprocess` | `object` | Svelte preprocessors (e.g. SCSS) |

## With Preprocessors

```typescript
import { vitePreprocess } from '@astrojs/svelte';

svelte({
  preprocess: vitePreprocess(), // Enable TypeScript + PostCSS
})
```
