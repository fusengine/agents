---
name: fonts-api
description: Astro Fonts API (stable since Astro 6.0) — zero CLS font loading, Google Fonts, local fonts, CSS variables
when-to-use: Any font loading in Astro 6/7 projects
keywords: fonts, Google Fonts, CSS variable, CLS, font-display
priority: high
---

# Fonts API (stable, Astro 6.0+)

## When to Use

- Loading Google Fonts or Bunny Fonts without CLS
- Using local font files with optimal performance
- Replacing manual `@font-face` + preload patterns

## Why Fonts API

| Method | CLS | Manual Preload | Config |
|--------|-----|----------------|--------|
| Fonts API (stable) | Zero | Automatic | 1 config entry |
| Manual @font-face | Possible | Manual | Multiple steps |
| CDN link tag | Possible | None | Simple |

## Setup — Google Fonts

`fonts` is a stable top-level `defineConfig` option — no `experimental` wrapper needed.

```js
// astro.config.mjs
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      styles: ['normal', 'italic'],
      weights: [400, 700],
    },
  ],
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

`fontProviders.local()` requires `variants` nested under `options` — not a top-level key.

```js
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [{
    provider: fontProviders.local(),
    name: 'MyFont',
    cssVariable: '--font-custom',
    options: {
      variants: [
        { weight: 400, style: 'normal', src: ['./src/assets/fonts/MyFont-Regular.woff2'] },
        { weight: 700, style: 'normal', src: ['./src/assets/fonts/MyFont-Bold.woff2'] },
      ],
    },
  }],
});
```

## Key Behaviors

- Stable since Astro 6.0 — no `experimental` flag, safe for production use
- Automatic `font-display: optional` to eliminate CLS
- Fonts subsetted and served locally at build time
- `preload` on `<Font />` component adds `<link rel="preload">`
- No external CDN requests in production
