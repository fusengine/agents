---
name: starlight-i18n
description: Multi-language documentation with Starlight — locales, translations, hreflang
when-to-use: Building documentation for multiple languages/locales
keywords: i18n, locales, translations, hreflang, defaultLocale, multilingual
priority: medium
requires: setup.md
related: astro-i18n
---

# Multi-language in Starlight

## When to Use

- Documentation needs multiple language versions
- Translating UI strings (next/prev buttons, search placeholder)

## Basic Multi-language Config

```js
// astro.config.mjs
starlight({
  title: 'My Docs',
  defaultLocale: 'root', // Root path = default locale
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    it: {
      label: 'Italiano',
      lang: 'it',
    },
    es: {
      label: 'Español',
      lang: 'es',
    },
  },
})
```

## File Structure

```
src/content/docs/
├── index.mdx          # English (root locale)
├── guides/
│   └── intro.md       # English
├── it/
│   ├── index.mdx      # Italian
│   └── guides/
│       └── intro.md   # Italian
└── es/
    └── index.mdx      # Spanish
```

## Content Collections Setup (Astro 7)

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
```

## Custom UI Translations

```json
// src/content/i18n/es.json
{
  "search.label": "Buscar",
  "tableOfContents.onThisPage": "En esta página",
  "page.editLink": "Editar esta página",
  "404.text": "Página no encontrada."
}
```

## starlight-llms-txt (AI Discoverability)

```bash
npm install starlight-llms-txt
```

```js
import starlightLlmsTxt from 'starlight-llms-txt';
starlight({
  plugins: [starlightLlmsTxt()],
})
// Generates /llms.txt for AI crawlers
```
