---
name: nextjs-16
description: Expert Next.js 16 development with Turbopack default, Cache Components, use cache directive, proxy.ts, React Compiler, and React 19.2. Use when working with Next.js projects, App Router, Server Components, caching, routing, data fetching, or deployment.
user-invocable: false
---

# Next.js 16 Expert

## Overview

Next.js 16 (released October 21, 2025) is a major release with Turbopack as default bundler, Cache Components model, and significant architectural improvements.

## Quick Start

```bash
# Upgrade existing project
bunx @next/codemod@canary upgrade latest

# Or manual upgrade
bun add next@latest react@latest react-dom@latest

# Or new project
bunx create-next-app@latest
```

## Key Features

### 1. Turbopack (Now Default)
- **2-5x faster production builds**
- **Up to 10x faster Fast Refresh**
- Filesystem caching (beta)

To use webpack instead:
```bash
next dev --webpack
next build --webpack
```

### 2. Cache Components
New explicit caching model with `use cache` directive:

```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,
};
```

### 3. proxy.ts (Replaces middleware.ts)
Clearer network boundary, runs on Node.js runtime:

```typescript
// proxy.ts
export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url));
}
```

### 4. React Compiler (Stable)
Automatic memoization:

```typescript
// next.config.ts
const nextConfig = {
  reactCompiler: true,
};
```

```bash
bun add babel-plugin-react-compiler@latest
```

### 5. React 19.2 Features
- **View Transitions**: Animate elements in Transitions
- **useEffectEvent**: Extract non-reactive Effect logic
- **Activity**: Background rendering with state preservation

## Version Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 20.9+ (LTS) |
| TypeScript | 5.1.0+ |
| Chrome/Edge | 111+ |
| Firefox | 111+ |
| Safari | 16.4+ |

## Documentation Structure

This skill contains the complete official Next.js 16 documentation:

### App Router (Recommended)
- [01-app/01-getting-started](01-app/01-getting-started/) - Installation, project structure, layouts, pages
- [01-app/02-guides](01-app/02-guides/) - Authentication, forms, caching, testing, deployment
- [01-app/03-api-reference](01-app/03-api-reference/) - Components, functions, config, CLI

### Pages Router (Legacy)
- [02-pages/01-getting-started](02-pages/01-getting-started/) - Installation for Pages Router
- [02-pages/02-guides](02-pages/02-guides/) - Pages Router specific guides
- [02-pages/03-building-your-application](02-pages/03-building-your-application/) - Routing, rendering, data fetching
- [02-pages/04-api-reference](02-pages/04-api-reference/) - Pages Router API

### Architecture
- [03-architecture](03-architecture/) - Accessibility, Fast Refresh, compiler, browsers

### Community
- [04-community](04-community/) - Contribution guide, Rspack

## Breaking Changes from v15

### Removals
- AMP support removed
- `next lint` removed (use ESLint/Biome directly)
- `serverRuntimeConfig`/`publicRuntimeConfig` removed
- Sync `params`/`searchParams` access removed
- Sync `cookies()`/`headers()`/`draftMode()` removed

### Behavior Changes
- Turbopack is default bundler
- `images.minimumCacheTTL` default: 4 hours
- `revalidateTag()` requires cacheLife profile
- Parallel routes require explicit `default.js`

### Deprecations
- `middleware.ts` → `proxy.ts`
- `next/legacy/image` → `next/image`
- `images.domains` → `images.remotePatterns`

## Instructions

1. **ALWAYS** use App Router patterns for new projects
2. Use `use cache` directive for explicit caching
3. Use `proxy.ts` instead of `middleware.ts`
4. Enable React Compiler for automatic memoization
5. Use `updateTag()` in Server Actions for immediate updates
6. Use `revalidateTag()` with cacheLife for background revalidation
7. Reference the complete docs in subdirectories for detailed patterns

## Documentation Reference

For latest official docs, use Context7 MCP:
```
mcp__context7__get-library-docs with context7CompatibleLibraryID="/vercel/next.js"
```

Official site: https://nextjs.org/docs
