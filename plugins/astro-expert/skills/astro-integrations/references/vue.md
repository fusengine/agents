---
name: vue
description: @astrojs/vue setup, configuration, Vue 3 Composition API, options
when-to-use: adding Vue 3 components to an Astro project
keywords: vue, @astrojs/vue, Vue 3, Composition API, setup, SFC
priority: medium
---

# @astrojs/vue

## Installation

```bash
npx astro add vue
# or manually:
npm install @astrojs/vue vue
```

## Configuration

```typescript
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [vue()],
});
```

## Basic Vue Component

```vue
<!-- src/components/vue/Counter.vue -->
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ initial?: number }>();
const count = ref(props.initial ?? 0);
</script>

<template>
  <button @click="count++">Count: {{ count }}</button>
</template>
```

## Usage in Astro

```astro
---
import Counter from '../components/vue/Counter.vue';
---
<Counter client:load :initial="5" />
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `include` | `string[]` | Glob patterns for Vue files |
| `exclude` | `string[]` | Glob patterns to exclude |
| `jsx` | `boolean` | Enable JSX/TSX support |
| `appEntrypoint` | `string` | Path to app plugin file |

## App Plugins (Pinia, Router)

```typescript
// src/app.ts — referenced via appEntrypoint
import type { App } from 'vue';
import { createPinia } from 'pinia';

export default (app: App) => {
  app.use(createPinia());
};
```

```typescript
// astro.config.ts
vue({ appEntrypoint: '/src/app' })
```
