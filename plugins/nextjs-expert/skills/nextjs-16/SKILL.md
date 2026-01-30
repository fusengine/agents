---
name: nextjs-16
description: Expert Next.js 16 with Turbopack, App Router, Cache Components, proxy.ts, React 19. Use when building Next.js apps, routing, caching, server components, or migrating from v15.
user-invocable: true
references: [references/installation.md, references/upgrade.md, references/project-structure.md, references/typescript.md, references/styling.md, references/app-router.md, references/routing-advanced.md, references/navigation.md, references/route-segment-config.md, references/pages-router.md, references/server-components.md, references/directives.md, references/react-19.md, references/rendering.md, references/streaming.md, references/runtime.md, references/data-fetching.md, references/forms.md, references/static-generation.md, references/cookies-headers.md, references/caching.md, references/cache-components.md, references/turbopack.md, references/react-compiler.md, references/dynamic-imports.md, references/loading-patterns.md, references/error-handling.md, references/proxy.md, references/middleware-migration.md, references/api-routes.md, references/security.md, references/metadata.md, references/metadata-files.md, references/images.md, references/fonts.md, references/scripts.md, references/third-party.md, references/analytics.md, references/instrumentation.md, references/devtools-mcp.md, references/environment.md, references/deployment.md, references/testing.md, references/config-advanced.md]
related-skills: [nextjs-i18n, better-auth, tailwindcss]
---

# Next.js 16 Expert

## Quick Start
```bash
bunx create-next-app@latest
```

## Critical v16 Changes
- `proxy.ts` replaces `middleware.ts` (breaking change)
- Turbopack ONLY (Webpack deprecated)
- `use cache` directive replaces PPR
- React 19 with View Transitions, useEffectEvent

## SOLID Architecture
```
app/page.tsx              → import from modules/public/home/
app/dashboard/page.tsx    → import from modules/auth/dashboard/
modules/cores/            → Shared services
```

## When to Use References
- **Routing**: app-router.md, routing-advanced.md, navigation.md
- **Caching**: caching.md, cache-components.md (cacheTag, cacheLife)
- **Migration v15→v16**: upgrade.md, middleware-migration.md
- **Server Components**: server-components.md, directives.md
- **React 19**: react-19.md (View Transitions, useEffectEvent)
- **Security**: proxy.md, security.md
- **SEO**: metadata.md, metadata-files.md, images.md
- **Deployment**: deployment.md, environment.md, testing.md
