---
name: image-setup-template
description: Complete image optimization setup for Astro 6 with sharp, responsive images, and fonts
type: template
---

# Image Setup Template

## astro.config.mjs

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  image: {
    // Authorize external domains for remote images
    domains: ['images.unsplash.com', 'cdn.example.com'],
    remotePatterns: [{ protocol: 'https', hostname: '*.cloudinary.com' }],
  },
  experimental: {
    fonts: [
      {
        provider: 'google',
        name: 'Inter',
        cssVariable: '--font-sans',
      },
    ],
  },
});
```

## Install Sharp

```bash
npx astro add sharp
```

## Responsive Image Component

```astro
---
// src/components/ResponsiveImage.astro
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro';

interface Props {
  src: ImageMetadata;
  alt: string;
  priority?: boolean;
  class?: string;
}
const { src, alt, priority = false, class: className } = Astro.props;
---
<Image
  src={src}
  alt={alt}
  widths={[400, 800, 1200, src.width]}
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  formats={['avif', 'webp']}
  fallbackFormat="jpg"
  priority={priority}
  class={className}
/>
```

## Layout with Fonts

```astro
---
// src/layouts/Layout.astro
import { Font } from 'astro:assets';
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <Font cssVariable="--font-sans" preload />
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Global CSS

```css
/* src/styles/global.css */
body {
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
}
img {
  max-width: 100%;
  height: auto;
}
```
