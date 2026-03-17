---
name: core-web-vitals
description: Core Web Vitals optimization in Astro — LCP, CLS, FID/INP, performance strategies
when-to-use: Performance optimization, Lighthouse score improvement
keywords: LCP, CLS, INP, Core Web Vitals, performance, Lighthouse
priority: medium
related: meta-tags.md
---

# Core Web Vitals

## When to Use

- Optimizing LCP (Largest Contentful Paint) for hero images
- Preventing CLS (Cumulative Layout Shift) from fonts and images
- Reducing INP (Interaction to Next Paint) for interactive components

## LCP Optimization

### Priority Images

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---
<!-- priority = eager loading + fetchpriority=high -->
<Image src={heroImage} alt="Hero" priority />
```

### Preload Critical Images

```astro
<link
  rel="preload"
  as="image"
  href="/_astro/hero.hash.webp"
  fetchpriority="high"
/>
```

## CLS Prevention

### Reserve Image Dimensions

Always provide `width` and `height` on `<Image />`. Astro infers from local imports automatically.

### Font Loading — Use Fonts API (Astro 6)

```js
// astro.config.mjs
export default defineConfig({
  experimental: {
    fonts: [{
      provider: 'google',
      name: 'Inter',
      cssVariable: '--font-inter',
    }],
  },
});
```

Astro automatically adds `font-display: swap` and preloads the font. Zero CLS.

### Avoid Dynamic Content Without Dimensions

Reserve space for ads, embeds, or dynamic content with CSS `aspect-ratio`.

## INP Optimization

Astro ships zero JS by default — Islands hydrate only interactive components.

```astro
<!-- Defer hydration until visible -->
<Counter client:visible />

<!-- Defer until idle -->
<HeavyWidget client:idle />

<!-- Only on media query -->
<MobileMenu client:media="(max-width: 768px)" />
```

## Performance Checklist

| Metric | Target | Astro Strategy |
|--------|--------|----------------|
| LCP | < 2.5s | `priority` on hero, preload |
| CLS | < 0.1 | Image dimensions, Fonts API |
| INP | < 200ms | Islands Architecture, client:visible |
| TTFB | < 0.8s | Static output, CDN edge |
