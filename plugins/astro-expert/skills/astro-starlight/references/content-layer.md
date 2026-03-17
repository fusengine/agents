---
name: starlight-content-layer
description: Starlight Content Layer API integration with docsLoader, docsSchema, custom frontmatter
when-to-use: Type-safe content collections in Astro 6 Starlight projects
keywords: Content Layer, docsLoader, docsSchema, i18nLoader, defineCollection
priority: medium
requires: setup.md
related: astro-content
---

# Content Layer API

## When to Use

- Astro 6: replacing legacy `defineCollection` from `astro:content`
- Adding custom frontmatter fields with type safety
- Using i18n content collections

## Basic Setup

```ts
// src/content/config.ts
import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema(),
  }),
  i18n: defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema(),
  }),
};
```

## Extend Schema with Custom Fields

```ts
import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // Add custom frontmatter fields
        author: z.string().optional(),
        category: z.enum(['guide', 'reference', 'tutorial']).optional(),
        readingTime: z.number().optional(),
        ogImage: z.string().optional(),
      }),
    }),
  }),
};
```

## Use Custom Fields in Pages

```astro
---
// Override Starlight's Page component to access custom frontmatter
const { entry } = Astro.props;
const { author, category, readingTime } = entry.data;
---
```

## Custom Frontmatter in Docs

```md
---
title: My Guide
description: A comprehensive guide
author: Alice
category: guide
readingTime: 8
---
```

## Key Rules

| Rule | Reason |
|------|--------|
| Use `docsLoader()` not `glob()` | Required for Starlight routing |
| Extend `docsSchema` not replace | Maintains all Starlight fields |
| `i18nLoader` for translations | Required for multi-language |
| Zod schema for custom fields | Type safety in templates |
