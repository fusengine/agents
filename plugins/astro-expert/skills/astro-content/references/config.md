---
name: config
description: src/content.config.ts — defineCollection, loaders, Zod schemas, collections export
when-to-use: defining collections, setting up loaders and schemas
keywords: content.config.ts, defineCollection, collections, schema, zod
priority: high
---

# Content Config File

## When to Use

- Starting content collections for the first time
- Adding a new collection type
- Changing schema or loader for existing collection

## File: src/content.config.ts

```typescript
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// Blog posts from Markdown files
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Authors from a single JSON file
const authors = defineCollection({
  loader: file('src/data/authors.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    bio: z.string().optional(),
  }),
});

export const collections = { blog, authors };
```

## Schema Types

| Zod Type | Use Case |
|----------|----------|
| `z.string()` | Text fields |
| `z.coerce.date()` | Date strings from frontmatter |
| `z.boolean().default(false)` | Flags with default |
| `z.array(z.string())` | Tag lists |
| `z.enum([...])` | Fixed value sets |
| `z.optional()` | Optional fields |
