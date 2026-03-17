---
name: starlight-config-template
description: Complete astro.config.mjs for a Starlight site with blog, DocSearch, i18n, and plugins
type: template
---

# Starlight Config Template

## astro.config.mjs (Full Example)

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import starlightLinksValidator from 'starlight-links-validator';

export default defineConfig({
  site: 'https://docs.example.com',
  integrations: [
    starlight({
      title: 'My Project',
      description: 'Comprehensive documentation for My Project',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: true,
      },
      social: {
        github: 'https://github.com/my/project',
        discord: 'https://discord.gg/...',
        twitter: 'https://twitter.com/myproject',
      },
      editLink: {
        baseUrl: 'https://github.com/my/project/edit/main/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        fr: { label: 'Français', lang: 'fr' },
      },
      sidebar: [
        { slug: 'getting-started' },
        {
          label: 'Guides',
          items: [
            { slug: 'guides/installation' },
            { slug: 'guides/configuration' },
            { slug: 'guides/advanced', badge: { text: 'Advanced', variant: 'caution' } },
          ],
        },
        {
          label: 'API Reference',
          collapsed: true,
          autogenerate: { directory: 'reference' },
        },
      ],
      plugins: [
        starlightBlog({
          authors: {
            team: { name: 'My Team', url: 'https://example.com' },
          },
        }),
        starlightLinksValidator(),
      ],
      head: [
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#6c63ff' },
        },
      ],
    }),
  ],
});
```

## src/content/config.ts

```ts
import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        author: z.string().optional(),
        category: z.string().optional(),
      }),
    }),
  }),
  i18n: defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema(),
  }),
};
```
