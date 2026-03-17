---
name: starlight-search
description: Starlight search — Pagefind (default), Algolia DocSearch, excluding pages
when-to-use: Configuring or replacing search in a Starlight documentation site
keywords: Pagefind, DocSearch, Algolia, search, pagefind:false
priority: medium
requires: setup.md
---

# Search Configuration

## When to Use

- Exclude pages from search index
- Replace Pagefind with Algolia DocSearch for high-traffic sites
- Debug search results

## Pagefind (Default — Zero Config)

Pagefind runs automatically post-build. No configuration needed for basic use.

```bash
# Pagefind runs after build automatically
npm run build
# Search index generated in dist/_pagefind/
```

## Exclude Page from Search

```md
---
title: Private Page
pagefind: false
---
```

## Exclude Part of a Page

```html
<div data-pagefind-ignore>
  This content won't appear in search results.
</div>
```

## Algolia DocSearch (Replace Pagefind)

```bash
npm install @astrojs/starlight-docsearch
```

Apply for DocSearch at algolia.com/docsearch — free for open source docs.

```js
// astro.config.mjs
import starlight from '@astrojs/starlight';
import starlightDocSearch from '@astrojs/starlight-docsearch';

starlight({
  plugins: [
    starlightDocSearch({
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
      indexName: process.env.ALGOLIA_INDEX_NAME,
    }),
  ],
})
```

## DocSearch with Custom Client Options

```ts
// src/config/docsearch.ts
import type { DocSearchClientOptions } from '@astrojs/starlight-docsearch';

export default {
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_SEARCH_KEY',
  indexName: 'YOUR_INDEX',
  placeholder: 'Search documentation...',
  getMissingResultsUrl({ query }) {
    return `https://github.com/my/repo/issues/new?title=${query}`;
  },
} satisfies DocSearchClientOptions;
```

```js
starlightDocSearch({ clientOptionsModule: './src/config/docsearch.ts' })
```

## Pagefind vs DocSearch

| Feature | Pagefind | DocSearch |
|---------|----------|-----------|
| Setup | Zero | Algolia account |
| Cost | Free | Free (open source) |
| Hosting | Static bundle | Algolia servers |
| Best for | Small-medium sites | Large, high-traffic |
