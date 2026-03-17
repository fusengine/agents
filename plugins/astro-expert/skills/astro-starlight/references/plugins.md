---
name: starlight-plugins
description: Starlight plugin ecosystem — blog, openapi, typedoc, versions, links-validator
when-to-use: Adding extra functionality to a Starlight documentation site
keywords: plugins, starlight-blog, starlight-openapi, starlight-typedoc, starlight-versions
priority: medium
requires: setup.md
---

# Starlight Plugins

## When to Use

- Add a blog to documentation site (`starlight-blog`)
- Generate API reference from OpenAPI spec (`starlight-openapi`)
- Auto-generate TypeScript API docs (`starlight-typedoc`)
- Version documentation (`starlight-versions`)
- Validate internal links (`starlight-links-validator`)

## starlight-blog

```bash
npm install starlight-blog
```

```js
import starlightBlog from 'starlight-blog';
starlight({
  plugins: [
    starlightBlog({
      title: 'Blog',
      authors: {
        alice: { name: 'Alice', url: 'https://alice.dev', picture: '/authors/alice.jpg' },
      },
    }),
  ],
})
```

Blog posts in `src/content/docs/blog/`:
```md
---
title: My First Post
date: 2025-06-01
authors: [alice]
excerpt: A short excerpt for the blog listing.
---
```

## starlight-openapi

```bash
npm install starlight-openapi
```

```js
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';
starlight({
  plugins: [
    starlightOpenAPI([{
      base: 'api',
      label: 'API Reference',
      schema: './openapi.yaml',
    }]),
  ],
  sidebar: [
    ...openAPISidebarGroups,
    // ... other sidebar items
  ],
})
```

## starlight-typedoc

```bash
npm install starlight-typedoc typedoc typedoc-plugin-markdown
```

```js
import starlightTypeDoc from 'starlight-typedoc';
starlight({
  plugins: [
    starlightTypeDoc({
      entryPoints: ['./src/index.ts'],
      tsconfig: './tsconfig.json',
      output: 'api',
      sidebar: { label: 'API Reference', collapsed: true },
    }),
  ],
})
```

## starlight-versions

```bash
npm install starlight-versions
```

```js
import starlightVersions from 'starlight-versions';
starlight({
  plugins: [
    starlightVersions({
      versions: [{ slug: 'v2' }, { slug: 'v1' }],
    }),
  ],
})
```

## starlight-links-validator (CI)

```bash
npm install starlight-links-validator
```

```js
import starlightLinksValidator from 'starlight-links-validator';
starlight({
  plugins: [starlightLinksValidator()],
})
// Build fails on broken internal links
```
