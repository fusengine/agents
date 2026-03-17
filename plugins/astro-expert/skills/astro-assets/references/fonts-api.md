---
name: fonts-api
description: Astro 6 built-in Fonts API — zero CLS font loading, Google Fonts, local fonts, CSS variables
when-to-use: Any font loading in Astro 6 projects
keywords: fonts, Google Fonts, CSS variable, CLS, font-display, experimental.fonts
priority: high
---

# Fonts API (Astro 6)

## When to Use

- Loading Google Fonts or Bunny Fonts without CLS
- Using local font files with optimal performance
- Replacing manual `@font-face` + preload patterns

## Why Fonts API

| Method | CLS | Manual Preload | Config |
|--------|-----|----------------|--------|
| Fonts API (Astro 6) | Zero | Automatic | 1 config entry |
| Manual @font-face | Possible | Manual | Multiple steps |
| CDN link tag | Possible | None | Simple |

## Setup — Google Fonts

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  experimental: {
    fonts: [
      {
        provider: 'google',
        name: 'Inter',
        cssVariable: '--font-inter',
      },
      {
        provider: 'google',
        name: 'JetBrains Mono',
        cssVariable: '--font-mono',
        styles: ['normal', 'italic'],
        weights: [400, 700],
      },
    ],
  },
});
```

## Use in Layout

```astro
---
// src/layouts/Layout.astro
import { Font } from 'astro:assets';
---
<head>
  <Font cssVariable="--font-inter" preload />
  <Font cssVariable="--font-mono" />
</head>
```

## Use CSS Variable in Styles

```css
/* Global styles */
body {
  font-family: var(--font-inter), system-ui, sans-serif;
}

code {
  font-family: var(--font-mono), monospace;
}
```

## Local Fonts

```js
export default defineConfig({
  experimental: {
    fonts: [{
      provider: 'local',
      name: 'MyFont',
      cssVariable: '--font-custom',
      variants: [
        { weight: 400, style: 'normal', src: ['./src/assets/fonts/MyFont-Regular.woff2'] },
        { weight: 700, style: 'normal', src: ['./src/assets/fonts/MyFont-Bold.woff2'] },
      ],
    }],
  },
});
```

## Key Behaviors

- Automatic `font-display: optional` to eliminate CLS
- Fonts subsetted and served locally at build time
- `preload` on `<Font />` component adds `<link rel="preload">`
- No external CDN requests in production
