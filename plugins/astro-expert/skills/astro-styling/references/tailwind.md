# Tailwind CSS in Astro

## Overview

Tailwind CSS v4 uses a **CSS-first** setup: no `tailwind.config.js`, no `@tailwind` directives, theming lives in CSS via `@theme`. For the full v4 feature set (`@theme`, `@utility`, OKLCH colors, container queries, upgrade notes), see the `fuse-tailwindcss:tailwindcss-v4` skill — this page only covers the **Astro-specific wiring**.

## Setup: `@tailwindcss/vite`

Astro has no first-party `@astrojs/tailwind` integration for v4. Use the official Vite plugin directly.

```bash
npm install tailwindcss @tailwindcss/vite
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
});
```

```css
/* src/styles/global.css */
@import "tailwindcss";
```

Import the stylesheet once, in your root layout:

```astro
---
// src/layouts/Layout.astro
import '../styles/global.css';
---
```

## Usage in Astro Components

```astro
<div class="flex items-center gap-4 p-6 rounded-lg bg-white shadow-md dark:bg-black/50">
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

## Astro-Specific Notes

- No `content` glob config needed — v4's automatic source detection scans the project via the Vite plugin, so `.astro` files are picked up without extra setup.
- Browser targets follow v4 defaults (Safari 16.4+, Chrome 111+, Firefox 128+) — confirm this matches the project's supported browsers before adopting v4.
- Project-wide design tokens (colors, spacing, fonts) go in `@theme` inside `global.css`, not in a JS config file — see `fuse-tailwindcss:tailwindcss-v4` for the syntax.
