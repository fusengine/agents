# Template: Tailwind CSS Setup in Astro

## Installation

Tailwind CSS v4 uses a CSS-first setup — no `tailwind.config.ts`, no `@tailwind` directives. Use the official Vite plugin (there is no `@astrojs/tailwind` integration for v4).

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

## src/styles/global.css

Theming (colors, fonts, spacing) lives in CSS via `@theme` — no JS config file. See `fuse-tailwindcss:tailwindcss-v4` for the full `@theme`/`@utility` syntax.

```css
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;

  --color-primary-50: #eef2ff;
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;
}

body {
  @apply font-sans text-gray-900 bg-white;
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary-500 text-white rounded-md
           hover:bg-primary-600 transition-colors font-medium;
  }
}
```

## src/layouts/BaseLayout.astro

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Component Example

```astro
---
// src/components/Hero.astro
---
<section class="py-20 px-4 text-center bg-gradient-to-b from-primary-50 to-white">
  <h1 class="text-4xl font-bold text-gray-900 mb-4">
    <slot name="title" />
  </h1>
  <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
    <slot name="subtitle" />
  </p>
  <slot name="cta" />
</section>
```
