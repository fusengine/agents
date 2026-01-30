---
name: nextjs-16
description: Next.js 16 with Turbopack, Cache Components, proxy.ts, React Compiler. Use when building Next.js apps, App Router, Server Components, data fetching, caching.
version: 2.0.0
user-invocable: true
references:
  - path: references/installation.md
  - path: references/app-router.md
  - path: references/server-components.md
  - path: references/data-fetching.md
  - path: references/caching.md
  - path: references/proxy.md
  - path: references/turbopack.md
---

# Next.js 16 Expert

## Quick Start

```bash
bunx create-next-app@latest
# or upgrade
bunx @next/codemod@canary upgrade latest
```

## Key Features (v16)

| Feature | Description |
|---------|-------------|
| **Turbopack** | Default bundler (2-5x faster builds) |
| **Cache Components** | Explicit caching with `use cache` |
| **proxy.ts** | Replaces middleware.ts |
| **React Compiler** | Automatic memoization (stable) |
| **React 19.2** | View Transitions, useEffectEvent |

## Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 20.9+ (LTS) |
| TypeScript | 5.1.0+ |

## Breaking Changes from v15

- `middleware.ts` → `proxy.ts`
- Async `cookies()`, `headers()`, `params`
- `next lint` removed
- AMP support removed
- Turbopack is default

## Project Structure

```
proxy.ts                    # Route protection (root)
app/
├── layout.tsx              # Root layout (required)
├── page.tsx                # Home page
├── loading.tsx             # Loading UI
├── error.tsx               # Error boundary
└── api/route.ts            # API routes
modules/                    # SOLID architecture
└── [feature]/src/
```

## Documentation

- Official: https://nextjs.org/docs
- See `references/` for detailed guides
