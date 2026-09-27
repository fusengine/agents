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

## Default Markdown Renderer (Astro 7)

Astro 7 switched the default Markdown renderer to **Sätteri** (PR #16966); `@astrojs/markdown-remark` is **no longer installed by default**. The classic `unified()`-based remark/rehype pipeline (shown below) remains available as an opt-in for projects that need custom remark/rehype plugins.

## Setup

```bash
npx astro add mdx
# Only if you need remark/rehype plugins (unified pipeline):
npm install @astrojs/markdown-remark
```

```typescript
// astro.config.ts
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkToc from 'remark-toc';
import rehypePrettyCode from 'rehype-pretty-code';

export default defineConfig({
  integrations: [
    // `processor` (mdx 6+): MDX inherits `markdown.processor` by default; override it here
    mdx({
      processor: unified({
        remarkPlugins: [remarkToc],
        rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark' }]],
      }),
    }),
  ],
});
```

Top-level `markdown.remarkPlugins` / `markdown.rehypePlugins` are deprecated in Astro 7 (still work only with `@astrojs/markdown-remark` installed) — pass plugins to the processor instead. Sätteri has GFM, SmartyPants, heading IDs, math, and directives built in, and its own `mdastPlugins` / `hastPlugins` API (`satteri()` from `@astrojs/markdown-satteri`).

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
| `remark-gfm` | GitHub-flavored Markdown (tables, strikethrough) — built into Sätteri and on by default |
| `remark-toc` | Auto-generate table of contents |
| `rehype-pretty-code` | Syntax highlighting |
| `rehype-slug` | Auto-add IDs to headings |
| `rehype-autolink-headings` | Clickable heading links |
