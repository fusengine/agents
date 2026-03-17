---
name: custom-loader
description: Custom Astro content loader for remote API data source
when-to-use: fetching content from a CMS, REST API, or database
keywords: custom loader, remote, CMS, API, fetch, store
---

# Custom Content Loader Template

## src/loaders/api-loader.ts

```typescript
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';

interface ApiLoaderOptions {
  endpoint: string;
  apiKey?: string;
}

export function apiLoader(options: ApiLoaderOptions): Loader {
  return {
    name: 'api-loader',
    schema: z.object({
      id: z.string(),
      title: z.string(),
      body: z.string(),
      publishedAt: z.string(),
    }),
    async load({ store, meta, logger }) {
      const lastFetched = meta.get('last-fetched');

      logger.info(`Fetching from ${options.endpoint}`);

      const res = await fetch(options.endpoint, {
        headers: options.apiKey
          ? { Authorization: `Bearer ${options.apiKey}` }
          : {},
      });

      if (!res.ok) {
        logger.error(`Failed to fetch: ${res.statusText}`);
        return;
      }

      const items = await res.json();

      store.clear();
      for (const item of items) {
        store.set({
          id: String(item.id),
          data: item,
        });
      }

      meta.set('last-fetched', new Date().toISOString());
      logger.info(`Loaded ${items.length} entries`);
    },
  };
}
```

## src/content.config.ts

```typescript
import { defineCollection } from 'astro:content';
import { apiLoader } from './loaders/api-loader';

export const collections = {
  posts: defineCollection({
    loader: apiLoader({
      endpoint: 'https://api.example.com/posts',
      apiKey: import.meta.env.CMS_API_KEY,
    }),
  }),
};
```
