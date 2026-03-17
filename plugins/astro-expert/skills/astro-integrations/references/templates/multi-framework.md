---
name: multi-framework
description: Complete multi-framework project using React, Vue, and Svelte in one Astro site
when-to-use: building a project with components from multiple frameworks
keywords: multi-framework, React, Vue, Svelte, include, mixed, project
---

# Multi-Framework Project Template

## astro.config.ts

```typescript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';

export default defineConfig({
  integrations: [
    react({ include: ['**/react/**'] }),
    vue(),
    svelte(),
  ],
});
```

## src/components/react/LikeButton.tsx

```tsx
import { useState } from 'react';

export function LikeButton({ count = 0 }: { count?: number }) {
  const [likes, setLikes] = useState(count);
  return (
    <button onClick={() => setLikes(l => l + 1)}>
      ♥ {likes}
    </button>
  );
}
```

## src/components/vue/Dropdown.vue

```vue
<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps<{ items: string[] }>();
const open = ref(false);
const selected = ref('');
</script>

<template>
  <div>
    <button @click="open = !open">{{ selected || 'Select...' }}</button>
    <ul v-if="open">
      <li v-for="item in props.items" @click="selected = item; open = false">
        {{ item }}
      </li>
    </ul>
  </div>
</template>
```

## src/components/svelte/Tabs.svelte

```svelte
<script lang="ts">
  let { tabs = [] }: { tabs: string[] } = $props();
  let active = $state(tabs[0] ?? '');
</script>

<div>
  {#each tabs as tab}
    <button
      class={tab === active ? 'active' : ''}
      onclick={() => active = tab}
    >{tab}</button>
  {/each}
</div>
```

## src/pages/index.astro

```astro
---
import { LikeButton } from '../components/react/LikeButton.tsx';
import Dropdown from '../components/vue/Dropdown.vue';
import Tabs from '../components/svelte/Tabs.svelte';
---
<LikeButton client:load count={42} />
<Dropdown client:load items={['Option A', 'Option B', 'Option C']} />
<Tabs client:load tabs={['Overview', 'Details', 'Reviews']} />
```
