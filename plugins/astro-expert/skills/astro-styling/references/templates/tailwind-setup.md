# Template: Tailwind CSS Setup in Astro

## Installation

```bash
npm install -D tailwindcss postcss autoprefixer
```

## tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      colors: {
        primary: {
          50: '#eef2ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
```

## src/styles/global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: theme('colors.primary.500');
  }

  body {
    @apply font-sans text-gray-900 bg-white;
  }
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
