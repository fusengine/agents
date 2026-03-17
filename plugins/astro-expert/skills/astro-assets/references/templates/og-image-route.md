---
name: og-image-route-template
description: Dynamic OG image API route with Satori for Astro blog posts
type: template
---

# OG Image Route Template

## File Structure

```
src/
├── pages/
│   └── og/
│       └── [slug].png.ts   # Dynamic OG image route
└── lib/
    └── og-template.ts      # Reusable Satori template
```

## src/lib/og-template.ts

```ts
import satori from 'satori';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const fontPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../public/fonts/Inter-Bold.ttf'
);
const fontData = readFileSync(fontPath);

export async function generateOgImage(title: string, subtitle?: string) {
  return satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: '#ffffff',
          padding: '80px',
          justifyContent: 'flex-end',
        },
        children: [
          subtitle && {
            type: 'p',
            props: {
              style: { fontSize: '24px', color: '#888', marginBottom: '16px' },
              children: subtitle,
            },
          },
          {
            type: 'h1',
            props: {
              style: { fontSize: '56px', fontWeight: 700, lineHeight: 1.1, margin: 0 },
              children: title,
            },
          },
        ].filter(Boolean),
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: fontData, weight: 700, style: 'normal' }],
    }
  );
}
```

## src/pages/og/[slug].png.ts

```ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { Resvg } from '@resvg/resvg-js';
import { generateOgImage } from '../../lib/og-template';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({ params: { slug: post.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const posts = await getCollection('blog');
  const post = posts.find((p) => p.slug === params.slug);
  const title = post?.data.title ?? 'My Blog';

  const svg = await generateOgImage(title, 'My Blog');
  const png = new Resvg(svg).render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000' },
  });
};
```

## Use in SEO Component

```astro
---
const ogImage = new URL(`/og/${post.slug}.png`, Astro.site);
---
<meta property="og:image" content={ogImage} />
<meta name="twitter:image" content={ogImage} />
```
