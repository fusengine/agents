---
name: overview
description: Astro UI integrations overview — how integrations work, astro add CLI, config pattern
when-to-use: understanding how to add framework support to Astro
keywords: integrations, astro add, overview, framework, UI, setup
priority: high
---

# UI Framework Integrations Overview

## How Integrations Work

Astro is framework-agnostic. UI framework integrations:
1. Add support for rendering framework components as server HTML
2. Enable client-side hydration via `client:*` directives
3. Handle JSX/SFC compilation via Vite plugins

## The `astro add` CLI

The fastest way to install any official integration:

```bash
npx astro add react       # @astrojs/react
npx astro add vue         # @astrojs/vue
npx astro add svelte      # @astrojs/svelte
npx astro add solid-js    # @astrojs/solid-js
npx astro add preact      # @astrojs/preact
npx astro add alpinejs    # @astrojs/alpinejs
npx astro add lit         # @astrojs/lit
```

The CLI auto-installs packages and updates `astro.config.ts`.

## Manual Config Pattern

```typescript
// astro.config.ts
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

## What Integrations Enable

| Feature | Without Integration | With Integration |
|---------|-------------------|-----------------|
| `.tsx`/`.jsx` files | Error | Compiled |
| Server rendering | No | Yes |
| Client hydration | No | Yes |
| TypeScript types | No | Yes |
| HMR in dev | No | Yes |

## File Conventions

Organize framework components by framework to avoid confusion:

```
src/components/
├── react/       ← React components (.tsx)
├── vue/         ← Vue components (.vue)
├── svelte/      ← Svelte components (.svelte)
└── shared/      ← .astro components (framework-agnostic)
```
