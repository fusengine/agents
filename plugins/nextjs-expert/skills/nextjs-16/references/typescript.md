---
name: typescript
description: TypeScript setup, async params typing, and type-safe routes
when-to-use: TypeScript setup, type safety, generated types
keywords: TypeScript, tsconfig, async params, typed routes
priority: medium
requires: installation.md
related: app-router.md
---

# TypeScript Configuration

## When to Use

- TypeScript setup
- Async params typing (v16)
- Route handler types
- Generated route types

## Why TypeScript in Next.js

| Feature | Benefit |
|---------|---------|
| Auto-types | next-env.d.ts |
| Plugin | IntelliSense |
| Route types | Type-safe links |
| Strict | Catch errors early |

## tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Generated Types
```bash
bunx next typegen  # Generate route types
```

## Page Props Type
```typescript
// app/blog/[slug]/page.tsx
type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page } = await searchParams
  return <div>{slug}</div>
}
```

## Layout Props Type
```typescript
type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params
  return <div>{children}</div>
}
```

## Route Handler Types
```typescript
import { NextRequest } from 'next/server'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  return Response.json({ id })
}
```

## Strict Mode
```typescript
// next.config.ts
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,  // Fail on type errors
  },
}
```
