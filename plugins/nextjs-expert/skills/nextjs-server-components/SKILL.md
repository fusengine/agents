---
name: nextjs-server-components
description: React Server Components patterns for Next.js 16. Server vs Client boundaries, async components, data fetching, serialization rules, streaming with Suspense.
versions:
  nextjs: 16
  react: 19
user-invocable: true
references: references/rsc-patterns.md, references/streaming.md
related-skills: nextjs-16, nextjs-tanstack-query, react-19
---

# Next.js Server Components

Server Components are the default rendering model in Next.js 16 with React 19.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing component boundaries
2. **fuse-ai-pilot:research-expert** - Verify latest RSC docs via Context7/Exa
3. **mcp__context7__query-docs** - Check Next.js 16 RSC patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Deciding between Server and Client Components
- Fetching data directly in components without API routes
- Implementing streaming and progressive rendering
- Passing data across the server/client boundary
- Using async components with direct database access

### Why Server Components

| Feature | Benefit |
|---------|---------|
| Zero client JS | Components never ship to the browser bundle |
| Direct data access | Query databases, read files without API layer |
| Streaming | Progressive rendering with Suspense boundaries |
| Automatic code splitting | Client Components are lazy-loaded by default |
| SEO-friendly | Full HTML rendered on the server |

---

## Critical Rules

1. **Server Components are default** - No directive needed
2. **`'use client'` only when needed** - Hooks, events, browser APIs
3. **Never import server-only into client** - Use `server-only` package
4. **Props must be serializable** - No functions, classes, or Dates across boundary
5. **Async components are server-only** - Client Components cannot be async
6. **Colocate data fetching** - Fetch where the data is consumed

---

## Best Practices

1. **Push client boundaries down** - Keep `'use client'` as deep as possible
2. **Composition pattern** - Pass Server Components as `children` to Client
3. **Use `server-only`** - Prevent accidental client imports of secrets
4. **Parallel fetching** - Use `Promise.all()` for independent data
5. **Cache with `use cache`** - Cache expensive server computations
6. **Stream with Suspense** - Wrap slow components for progressive loading

---

## Reference Guide

| Need | Reference |
|------|-----------|
| Server vs Client patterns | [rsc-patterns.md](references/rsc-patterns.md) |
| Streaming and Suspense | [streaming.md](references/streaming.md) |
| Data fetching in RSC | [rsc-patterns.md](references/rsc-patterns.md) |
| Loading states | [streaming.md](references/streaming.md) |
