---
name: remote-images
description: Remote images with <Image />, inferSize, authorized domains, getImage() for CSS
when-to-use: Images from external CDNs, CMS, or dynamic sources
keywords: remote, inferSize, domains, getImage, external images
priority: medium
requires: image-component.md
---

# Remote Images

## When to Use

- Display images from external CDNs (Cloudinary, Imgix, Unsplash)
- CMS images with unknown dimensions
- Generate optimized background images server-side

## Basic Remote Image

```astro
---
import { Image } from 'astro:assets';
---
<Image
  src="https://cdn.example.com/photo.jpg"
  width={800}
  height={600}
  alt="Remote photo"
/>
```

## Auto-Detect Dimensions with inferSize

```astro
<Image
  src="https://cdn.example.com/photo.jpg"
  inferSize
  alt="Auto-sized remote image"
/>
```

`inferSize` fetches image dimensions at build time. Use for images where dimensions are unknown or may change.

## Authorize Remote Domains

By default, Astro only optimizes images from authorized domains:

```js
// astro.config.mjs
export default defineConfig({
  image: {
    domains: ['cdn.example.com', 'images.unsplash.com'],
    // Or use patterns for wildcards
    remotePatterns: [{
      protocol: 'https',
      hostname: '*.cloudinary.com',
    }],
  },
});
```

## getImage() for CSS Backgrounds

```astro
---
import { getImage } from 'astro:assets';
import bgImage from '../assets/background.jpg';

const optimizedBg = await getImage({
  src: bgImage,
  format: 'avif',
  width: 1920,
});
---
<div style={`background-image: url(${optimizedBg.src}); background-size: cover;`}>
  <slot />
</div>
```

## getImage() in API Routes

```ts
// src/pages/api/thumbnail.ts
import { getImage } from 'astro:assets';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const src = url.searchParams.get('src') ?? '';
  const image = await getImage({ src, width: 300, height: 200, format: 'webp' });
  return new Response(JSON.stringify({ url: image.src }));
};
```

## Key Rules

| Rule | Reason |
|------|--------|
| Authorize domains in config | Security — prevents arbitrary remote URLs |
| Use `inferSize` for unknown dims | Prevents layout shift without hardcoding |
| `getImage()` is async | Must be awaited in frontmatter or API route |
