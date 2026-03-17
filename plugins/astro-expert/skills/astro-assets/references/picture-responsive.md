---
name: picture-responsive
description: <Picture /> component for multi-format responsive images with AVIF/WebP fallbacks
when-to-use: When you need format fallbacks or art direction
keywords: Picture, responsive, AVIF, WebP, formats, fallbackFormat
priority: medium
requires: image-component.md
---

# Picture Component & Responsive Images

## When to Use

- Provide AVIF with WebP and original as fallbacks
- Art direction: different images at different viewport sizes
- Maximum browser compatibility with format cascade

## Basic Multi-Format

```astro
---
import { Picture } from 'astro:assets';
import photo from '../assets/photo.jpg';
---
<Picture
  src={photo}
  formats={['avif', 'webp']}
  alt="A photo with AVIF/WebP fallback"
/>
```

Outputs:
```html
<picture>
  <source srcset="/_astro/photo.hash.avif" type="image/avif" />
  <source srcset="/_astro/photo.hash.webp" type="image/webp" />
  <img src="/_astro/photo.hash.jpg" alt="..." loading="lazy" />
</picture>
```

## With pictureAttributes

```astro
<Picture
  src={photo}
  formats={['avif', 'webp']}
  pictureAttributes={{ class: 'hero-picture', style: 'display: block;' }}
  alt="Hero"
/>
```

## Responsive with Widths

```astro
<Picture
  src={photo}
  formats={['avif', 'webp']}
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Responsive photo"
/>
```

## Fallback Format

```astro
<!-- Keep original format as fallback instead of converting -->
<Picture
  src={photo}
  formats={['avif', 'webp']}
  fallbackFormat="jpg"
  alt="Photo"
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `formats` | string[] | `['webp']` | Source formats |
| `fallbackFormat` | string | original | `<img>` fallback format |
| `pictureAttributes` | object | `{}` | `<picture>` attributes |

All `<Image />` props also apply to `<Picture />`.
