---
name: loaders
description: Astro content loaders — glob(), file(), and custom loaders for remote data
when-to-use: loading content from local files or remote sources
keywords: loader, glob, file, custom, remote, CMS, API
priority: high
---

# Content Loaders

## When to Use

- `glob()` — multiple files in a directory (MD, MDX, JSON, YAML, TOML)
- `file()` — single JSON or YAML file with multiple entries
- Custom loader — CMS, REST API, database, or any async source

## glob() Loader

```typescript
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
    // Optional: customize entry ID from file path
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
});
```

Supports: `.md`, `.mdx`, `.json`, `.yaml`, `.yml`, `.toml`

## file() Loader

```typescript
import { file } from 'astro/loaders';

const products = defineCollection({
  loader: file('src/data/products.json'),
  // Each item in the array needs an `id` field
});
```

## Custom Loader

```typescript
// src/loaders/cms-loader.ts
import type { Loader } from 'astro/loaders';

export function cmsLoader(options: { endpoint: string }): Loader {
  return {
    name: 'cms-loader',
    async load({ store, meta, logger }) {
      logger.info('Fetching from CMS...');
      const res = await fetch(options.endpoint);
      const items = await res.json();

      store.clear();
      for (const item of items) {
        store.set({ id: item.id, data: item });
      }
    },
  };
}
```

## Loader Options Comparison

| Loader | Local? | Remote? | Multi-file? | Single-file? |
|--------|--------|---------|-------------|--------------|
| `glob()` | Yes | No | Yes | No |
| `file()` | Yes | No | No | Yes |
| Custom | Yes | Yes | Yes | Yes |
