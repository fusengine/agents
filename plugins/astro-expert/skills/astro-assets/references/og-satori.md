---
name: og-satori
description: Dynamic OG image generation with Satori + Sharp in Astro — build-time and runtime
when-to-use: Auto-generating social preview images for blog posts, docs, or any dynamic pages
keywords: Satori, OG image, Open Graph, Sharp, dynamic images, SVG to PNG
priority: medium
related: image-component.md
---

# OG Image Generation with Satori

## When to Use

- Blog posts need unique branded social preview images
- Avoid manually creating OG images for each page
- Build-time generation for static sites, runtime for SSR

## Install Dependencies

```bash
npm install satori @resvg/resvg-js
# OR use Sharp for SVG->PNG conversion
npm install satori sharp
```

## Dynamic Route (SSG — Run at Build Time)

```ts
// src/pages/og/[slug].png.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';

const font = readFileSync('./public/fonts/Inter-Bold.ttf');

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({ params: { slug: post.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const posts = await getCollection('blog');
  const post = posts.find((p) => p.slug === params.slug);

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex', width: '1200px', height: '630px',
          background: '#1a1a2e', color: '#ffffff',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px', fontSize: '48px', fontWeight: 700,
        },
        children: post?.data.title ?? 'My Site',
      },
    },
    { width: 1200, height: 630, fonts: [{ name: 'Inter', data: font, weight: 700 }] }
  );

  const png = new Resvg(svg).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
```

## Use in SEO Component

```astro
---
const ogImageUrl = new URL(`/og/${post.slug}.png`, Astro.site);
---
<meta property="og:image" content={ogImageUrl} />
```

## Important Constraints

| Constraint | Detail |
|------------|--------|
| Run at build time | Satori is expensive — use SSG not SSR |
| Fonts must be loaded | Pass font buffer to `satori()` options |
| JSX-like objects only | No actual React components |
| CSS subset | Satori supports flexbox, not grid |
