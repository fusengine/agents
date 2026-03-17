---
name: astro-content
description: Expert Astro Content Layer API — content.config.ts, glob/file loaders, custom loaders, getCollection, getEntry, render(), Zod schemas, MDX, Remark/Rehype plugins. Use when managing structured content, blog posts, or any typed data collections.
versions:
  astro: 6
  zod: 4
user-invocable: true
references: references/overview.md, references/config.md, references/loaders.md, references/querying.md, references/rendering.md, references/mdx.md, references/templates/blog-collection.md, references/templates/custom-loader.md
related-skills: astro-6, astro-actions, astro-seo
---

# Astro Content Layer Expert

Type-safe content management with loaders, Zod schemas, and the unified Content Layer API.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Check existing collections, loaders, and content structure
2. **fuse-ai-pilot:research-expert** - Verify latest Content Layer docs via Context7/Exa
3. **mcp__context7__query-docs** - Get loader and schema examples

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Managing blog posts, docs, or product descriptions in Markdown/MDX
- Fetching content from a CMS, API, or database with type safety
- Needing TypeScript autocomplete for frontmatter fields
- Migrating from Astro 4 legacy content collections

### Why Content Layer API

| Feature | Benefit |
|---------|---------|
| `src/content.config.ts` | Single config file at project root |
| Built-in loaders | `glob()` and `file()` for local files |
| Custom loaders | Fetch from any external source |
| Zod 4 schemas | Full TypeScript type safety |
| `astro sync` | Generates types from collections |

---

## Core Concepts

### Config File Location

The config file moved from `src/content/config.ts` to `src/content.config.ts` in Astro 5+.

### Collection Types

| Loader | Use Case |
|--------|----------|
| `glob()` | Multiple files in a directory (MD, MDX, JSON, YAML) |
| `file()` | Single JSON/YAML file with multiple entries |
| Custom | Remote API, database, or any async data source |

### Key APIs

| API | Description |
|-----|-------------|
| `getCollection(name)` | Fetch all entries in a collection |
| `getEntry(name, id)` | Fetch a single entry by ID |
| `render(entry)` | Render a content entry to HTML + headings |
| `defineCollection()` | Define a collection with loader and schema |

---

## Reference Guide

| Need | Reference |
|------|-----------|
| Overview & concepts | [overview.md](references/overview.md) |
| Config file setup | [config.md](references/config.md) |
| Glob, file, custom loaders | [loaders.md](references/loaders.md) |
| getCollection / getEntry | [querying.md](references/querying.md) |
| render() + headings | [rendering.md](references/rendering.md) |
| MDX + Remark/Rehype | [mdx.md](references/mdx.md) |
| Blog collection example | [templates/blog-collection.md](references/templates/blog-collection.md) |
| Custom remote loader | [templates/custom-loader.md](references/templates/custom-loader.md) |

---

## Best Practices

1. **Always define schemas** — Never skip Zod validation
2. **Run `astro sync`** — After changing `content.config.ts`
3. **Use `glob()` for local files** — Supports MD, MDX, JSON, YAML, TOML
4. **Custom loaders for remote data** — CMS, REST API, GraphQL
5. **`render()` for MDX** — Returns `Content` component + headings array
