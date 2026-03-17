---
name: cdn-integration
description: Integrating Cloudinary and Imgix as image CDN with Astro's image service
when-to-use: External image CDN for dynamic transformations at scale
keywords: Cloudinary, Imgix, image CDN, custom image service, transformations
priority: low
requires: remote-images.md
---

# CDN Integration

## When to Use

- Large sites needing dynamic image transformations at scale
- Images stored in Cloudinary or Imgix
- Need URL-based transforms (crop, resize, filters)

## Cloudinary Setup

```bash
npm install @cloudinary-util/url-loader
```

```js
// astro.config.mjs
export default defineConfig({
  image: {
    service: {
      entrypoint: '@cloudinary-util/url-loader',
    },
  },
});
```

Then use `<Image />` with Cloudinary URLs — transformations applied via URL.

## Imgix Setup

```js
// astro.config.mjs
export default defineConfig({
  image: {
    service: {
      entrypoint: 'astro-imagetools/service/imgix',
      config: {
        domain: 'your-domain.imgix.net',
      },
    },
  },
});
```

## Manual URL Builder (Without Custom Service)

```astro
---
function cloudinaryUrl(publicId: string, transforms = 'f_auto,q_auto,w_800') {
  return `https://res.cloudinary.com/YOUR_CLOUD/image/upload/${transforms}/${publicId}`;
}
---
<img
  src={cloudinaryUrl('my-photo')}
  alt="Cloudinary image"
  loading="lazy"
  width={800}
  height={600}
/>
```

## Authorize CDN Domains

```js
// astro.config.mjs
export default defineConfig({
  image: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [{
      protocol: 'https',
      hostname: '*.imgix.net',
    }],
  },
});
```

## Key Decision

| Option | Best For |
|--------|----------|
| `astro:assets` + sharp | Self-hosted, static sites |
| Cloudinary custom service | Existing Cloudinary assets |
| Manual URL builder | Simple CDN URL patterns |
| `inferSize` + authorized domain | CMS with known CDN |
