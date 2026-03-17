---
name: sitemap-rss
description: Sitemap generation with @astrojs/sitemap and RSS feeds with @astrojs/rss
when-to-use: Any site needing search engine indexing or content subscription feeds
keywords: sitemap, RSS, @astrojs/sitemap, @astrojs/rss, robots.txt
priority: high
---

# Sitemap & RSS Feeds

## When to Use

- Every production site needs `@astrojs/sitemap` for Google Search Console
- Blogs and news sites need RSS feeds for subscribers
- `robots.txt` must reference the sitemap URL

## Sitemap Setup

```bash
npx astro add sitemap
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com', // REQUIRED
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
```

Generates `/sitemap-index.xml` + `/sitemap-0.xml` at build time.

## RSS Feed Setup

```bash
npm install @astrojs/rss
```

```ts
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: 'My Blog',
    description: 'Latest articles',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
```

## robots.txt

```
// public/robots.txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap-index.xml
```

## Link Sitemap in Head

```astro
<link rel="sitemap" href="/sitemap-index.xml" />
```

## Custom Sitemap Filename

```js
sitemap({ filenameBase: 'my-sitemap' })
// Generates: /my-sitemap-index.xml
```
