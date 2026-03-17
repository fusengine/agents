# Template: UnoCSS Setup in Astro

## Installation

```bash
npm install -D unocss @unocss/astro @unocss/reset
```

## astro.config.ts

```typescript
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';

export default defineConfig({
  integrations: [
    UnoCSS({ injectReset: true })
  ]
});
```

## uno.config.ts

```typescript
import {
  defineConfig,
  presetUno,
  presetIcons,
  presetTypography,
  presetWebFonts
} from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/'
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'Fira Code'
      }
    })
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#6366f1',
        hover: '#4f46e5'
      }
    }
  },
  shortcuts: {
    'btn-primary': 'px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors'
  }
});
```

## src/layouts/BaseLayout.astro

```astro
---
import '@unocss/reset/tailwind.css';

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
  <body class="font-sans text-gray-900 bg-white">
    <slot />
  </body>
</html>
```

## Component Example

```astro
---
// src/components/Card.astro
interface Props {
  title: string;
}
const { title } = Astro.props;
---

<article class="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
  <h2 class="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
  <div class="text-gray-600 leading-relaxed">
    <slot />
  </div>
</article>
```
