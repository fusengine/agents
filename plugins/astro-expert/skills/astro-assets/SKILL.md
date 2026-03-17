---
name: astro-assets
description: Image and asset optimization in Astro 6 — <Image />, <Picture />, getImage(), remote images, @astrojs/sharp, Fonts API, OG image generation with Satori, Cloudinary/Imgix. Use for any image optimization or asset handling task.
versions:
  astro: "6"
user-invocable: true
references: references/image-component.md, references/picture-responsive.md, references/remote-images.md, references/fonts-api.md, references/og-satori.md, references/cdn-integration.md, references/templates/image-setup.md, references/templates/og-image-route.md
related-skills: astro-6, astro-seo, astro-deployment
---

# Astro Assets

Production-ready image optimization and asset management with `astro:assets` in Astro 6.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing image usage and asset patterns
2. **fuse-ai-pilot:research-expert** - Verify astro:assets API via Context7/Exa
3. **mcp__context7__query-docs** - Check Astro 6 Fonts API and image component docs

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Displaying optimized images with automatic WebP/AVIF conversion
- Building responsive images with multiple breakpoints
- Loading remote images from external CDNs
- Configuring custom fonts without layout shift
- Generating OG images dynamically with Satori
- Integrating Cloudinary or Imgix as image CDN

### Key Modules

| Module | Exports |
|--------|---------|
| `astro:assets` | `<Image />`, `<Picture />`, `getImage()` |
| `@astrojs/sharp` | Default image processing service |
| Fonts API (Astro 6) | Built-in `experimental.fonts` config |

---

## Core Concepts

### Image Component

`<Image />` automatically optimizes local and remote images. Always provide `alt`. Use `priority` for above-the-fold images. Defaults to WebP output.

### Picture Component

`<Picture />` generates `<source>` elements for multiple formats. Use `formats={['avif', 'webp']}` for best compression with fallback.

### getImage()

For server-side image generation (API routes, CSS background images). Returns `{ src, attributes }` object.

### Fonts API (Astro 6)

Built-in font optimization via `experimental.fonts` in `astro.config.mjs`. Zero layout shift, automatic preloading, supports Google Fonts and local fonts.

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Image Component** | [image-component.md](references/image-component.md) | Local/remote image display |
| **Responsive Images** | [picture-responsive.md](references/picture-responsive.md) | Multi-format, srcset, sizes |
| **Remote Images** | [remote-images.md](references/remote-images.md) | External URLs, inferSize |
| **Fonts API** | [fonts-api.md](references/fonts-api.md) | Zero-CLS font loading |
| **OG with Satori** | [og-satori.md](references/og-satori.md) | Dynamic OG image generation |
| **CDN Integration** | [cdn-integration.md](references/cdn-integration.md) | Cloudinary, Imgix setup |

### Templates

| Template | When to Use |
|----------|-------------|
| [image-setup.md](references/templates/image-setup.md) | Full image optimization setup |
| [og-image-route.md](references/templates/og-image-route.md) | Dynamic OG image API route |

---

## Best Practices

1. **Always provide `alt`** - Required for accessibility and SEO
2. **Use `priority` for LCP** - Above-the-fold images load eagerly
3. **`inferSize` for remote** - Avoids layout shift without known dimensions
4. **Fonts API over @font-face** - Built-in optimization, no manual preload
5. **Satori at build time** - Run OG generation during SSG, not SSR
