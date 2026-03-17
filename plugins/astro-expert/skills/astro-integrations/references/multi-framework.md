---
name: multi-framework
description: Using multiple JSX frameworks in the same Astro project — include patterns, conflict resolution
when-to-use: mixing React + Solid, React + Preact, or other JSX frameworks
keywords: multi-framework, include, JSX conflict, React, Preact, Solid
priority: medium
---

# Multi-Framework Configuration

## When to Use

- Migrating from React to Solid incrementally
- Team has mixed framework expertise
- Reusing existing component libraries from different frameworks

## JSX Conflict Problem

React, Preact, and Solid all use JSX. Without `include`, Astro doesn't know which JSX runtime to use for a given file.

## Solution: `include` Option

```typescript
// astro.config.ts
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import preact from '@astrojs/preact';
import solidJs from '@astrojs/solid-js';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';

export default defineConfig({
  integrations: [
    // JSX frameworks: use include to avoid conflicts
    react({ include: ['**/react/**'] }),
    preact({ include: ['**/preact/**'] }),
    solidJs({ include: ['**/solid/**'] }),

    // Non-JSX: no include needed
    vue(),
    svelte(),
  ],
});
```

## Recommended Directory Structure

```
src/components/
├── react/          ← **/react/** matched
│   └── Button.tsx
├── solid/          ← **/solid/** matched
│   └── Counter.tsx
├── preact/         ← **/preact/** matched
│   └── Widget.tsx
├── vue/            ← *.vue files auto-detected
│   └── Dropdown.vue
├── svelte/         ← *.svelte files auto-detected
│   └── Tabs.svelte
└── ui/             ← .astro only
    └── Layout.astro
```

## Non-JSX Frameworks

Vue (`.vue`) and Svelte (`.svelte`) use unique file extensions — no `include` needed.

## Performance Note

Each framework adds to bundle size. Only add what you actually use. A single framework project is always simpler to maintain.
