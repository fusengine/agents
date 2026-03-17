# Tailwind CSS in Astro

## Overview

Two setup approaches: official integration (simple) or manual PostCSS (full control).

## Approach 1: Official Integration

```bash
npx astro add tailwind
```

This adds `@astrojs/tailwind` and creates `tailwind.config.mjs` automatically.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()]
});
```

## Approach 2: Manual PostCSS (Recommended for Control)

```bash
npm install -D tailwindcss postcss autoprefixer
```

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;
```

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Import in layout:
```astro
---
import '../styles/global.css';
---
```

## Usage in Astro Components

```astro
<div class="flex items-center gap-4 p-6 rounded-lg bg-white shadow-md">
  <h2 class="text-xl font-bold text-gray-900">Title</h2>
</div>
```

## Combining with Scoped CSS

```astro
<div class="card-wrapper">
  <slot />
</div>

<style>
  .card-wrapper {
    /* Scoped override for specific layout needs */
    container-type: inline-size;
  }
</style>
```

## When to Use

| Use | When |
|-----|------|
| Official integration | Simple projects, no custom PostCSS plugins |
| Manual PostCSS | Need PostCSS plugins (purgecss, cssnano, etc.) |
| Scoped `<style>` | Complex component-specific styles |
