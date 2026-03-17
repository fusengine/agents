---
name: image-component
description: <Image /> component from astro:assets — local images, format, quality, widths, priority
when-to-use: Any image display in Astro components or pages
keywords: Image, astro:assets, WebP, AVIF, srcset, lazy loading, priority
priority: high
---

# Image Component

## When to Use

- Display local images with automatic optimization
- Convert images to WebP/AVIF at build time
- Generate responsive srcsets for different viewports

## Basic Usage

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/photo.jpg';
---
<Image src={myImage} alt="A photo" />
```

Astro automatically infers `width`, `height`, and outputs WebP.

## Responsive Images with srcset

```astro
---
import { Image } from 'astro:assets';
import hero from '../assets/hero.jpg';
---
<Image
  src={hero}
  widths={[400, 800, 1200, hero.width]}
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  alt="Hero image"
/>
```

## Format and Quality Control

```astro
<Image
  src={myImage}
  format="avif"
  quality="high"
  alt="AVIF optimized image"
/>
```

Quality presets: `low`, `mid`, `high`, `max` or number 0-100.

## Above-the-fold Priority

```astro
<!-- Sets loading=eager, decoding=sync, fetchpriority=high -->
<Image src={heroImage} priority alt="Hero" />
```

## Key Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | ImageMetadata/string | required | Local import or URL |
| `alt` | string | required | Accessibility text |
| `format` | string | `'webp'` | Output format |
| `quality` | string/number | auto | Compression level |
| `widths` | number[] | — | srcset widths |
| `sizes` | string | — | Media conditions |
| `priority` | boolean | false | Eager + high fetch |
| `inferSize` | boolean | false | Auto-detect remote dims |

## Install @astrojs/sharp (Recommended)

```bash
npx astro add sharp
```

Provides better image processing than the default service.
