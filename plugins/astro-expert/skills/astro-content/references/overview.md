---
name: overview
description: Astro Content Layer API overview — what it is, when to use it, architecture
when-to-use: understanding content collections, choosing loaders
keywords: content layer, collections, overview, concepts, architecture
priority: high
---

# Content Layer API Overview

## What Are Content Collections?

A content collection is a typed set of related data — blog posts, product descriptions, documentation pages, or any structured content. Each item in a collection is an "entry".

## When to Use

- Managing Markdown/MDX content with typed frontmatter
- Fetching external content (CMS, API, database) with type safety
- Any structured content that benefits from TypeScript autocomplete

## Architecture

```
src/
├── content.config.ts      # Collection definitions (loaders + schemas)
└── content/               # Optional: local content files
    └── blog/
        └── post-1.md
```

## Key Principles

| Concept | Description |
|---------|-------------|
| Collection | Named set of entries with the same shape |
| Loader | How data is fetched (glob, file, custom) |
| Schema | Zod validation for entry data |
| Entry | Single item in a collection |
| `astro sync` | Generates TypeScript types from config |

## Config File Location

```
src/content.config.ts   ← Astro 5+ location
src/content/config.ts   ← Legacy Astro 4 location (deprecated)
```

## Workflow

1. Define collections in `src/content.config.ts`
2. Run `astro sync` (or `astro dev` auto-syncs)
3. Use `getCollection()` / `getEntry()` in `.astro` files
4. Render entries with `render()` for Markdown/MDX
