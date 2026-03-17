---
name: mdx
description: MDX integration in Astro — @astrojs/mdx setup, Remark/Rehype plugins, component imports
when-to-use: using MDX files in content collections, adding Remark/Rehype plugins
keywords: MDX, remark, rehype, @astrojs/mdx, plugins
priority: medium
---

# MDX in Astro

## When to Use

- Content files need embedded interactive components
- Adding syntax highlighting with rehype-pretty-code
- Processing Markdown with remark plugins

## Setup

```bash
npx astro add mdx
```

```typescript
// astro.config.ts
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

export default defineConfig({
  integrations: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark' }]],
    }),
  ],
});
```

## Using Components in MDX

```mdx
---
title: My Post
---
import Button from '../../components/Button.astro';
import Counter from '../../components/Counter.tsx';

# My Post

<Button>Click me</Button>
<Counter client:load />
```

## Collection Config for MDX

```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({ title: z.string() }),
});
```

## Common Plugins

| Plugin | Purpose |
|--------|---------|
| `remark-gfm` | GitHub-flavored Markdown (tables, strikethrough) |
| `remark-toc` | Auto-generate table of contents |
| `rehype-pretty-code` | Syntax highlighting |
| `rehype-slug` | Auto-add IDs to headings |
| `rehype-autolink-headings` | Clickable heading links |
