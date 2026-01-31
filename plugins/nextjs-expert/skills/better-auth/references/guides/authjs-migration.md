---
name: authjs-migration
description: Migrate from NextAuth/Auth.js to Better Auth
when-to-use: nextauth migration, auth.js migration, switching from next-auth
keywords: NextAuth, Auth.js, migration, switching, from NextAuth
priority: low
requires: migrations.md
related: migrations.md, guides/supabase-migration.md
---

# Better Auth Auth.js Migration Guide

## When to Use

- Migrating from NextAuth/Auth.js
- Need better TypeScript support
- Want more built-in plugins
- Enterprise features required

## Why Migrate

| Auth.js | Better Auth |
|---------|-------------|
| Partial TS | First-class TS |
| Limited plugins | 50+ plugins |
| Community 2FA | Built-in 2FA |
| No organizations | Organizations built-in |

## Key Differences

| Auth.js (NextAuth) | Better Auth |
|--------------------|-------------|
| `next-auth` | `better-auth` |
| `auth.ts` config | `betterAuth()` config |
| `getServerSession()` | `auth.api.getSession()` |
| `useSession()` | `authClient.useSession()` |
| Adapter pattern | Similar adapter pattern |

## 1. Install Better Auth

```bash
bun remove next-auth @auth/prisma-adapter
bun add better-auth
```

## 2. Replace Configuration

```typescript
// Before (Auth.js)
export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google({...}), GitHub({...})],
})

// After (Better Auth)
export const auth = betterAuth({
  database: prismaAdapter(prisma),
  socialProviders: {
    google: { clientId: "...", clientSecret: "..." },
    github: { clientId: "...", clientSecret: "..." }
  }
})
```

## 3. Replace API Route

```typescript
// Before: app/api/auth/[...nextauth]/route.ts
// After: app/api/auth/[...all]/route.ts
import { auth } from "@/modules/auth/src/services/auth"
import { toNextJsHandler } from "better-auth/next-js"
export const { GET, POST } = toNextJsHandler(auth.handler)
```

## 4. Replace Session Access

```typescript
// Before (Server)
const session = await auth()

// After (Server)
const session = await auth.api.getSession({ headers: request.headers })
```

## 5. Replace Client Hooks

```typescript
// Before
import { useSession } from "next-auth/react"

// After
import { useSession } from "@/modules/auth/src/hooks/auth-client"
```

## 6. Database Schema

Auth.js and Better Auth use similar schema. Run migration:
```bash
bunx @better-auth/cli migrate
```
