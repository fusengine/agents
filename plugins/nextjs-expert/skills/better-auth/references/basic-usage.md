---
name: basic-usage
description: Step-by-step guide to set up auth instance, API route, client, and session management
when-to-use: first time setup, minimal working example, tutorial, getting started, core authentication
keywords: quickstart, auth instance, sign up, sign in, sign out, useSession, minimal example
priority: high
requires: installation.md
related: server-config.md, client.md, server-actions.md
---

# Better Auth Basic Usage

## When to Use

- Quick start guide for new projects
- Step-by-step authentication setup
- Minimal working example

## Why Follow This Order

| Step | Purpose |
|------|---------|
| 1. Auth instance | Server-side config |
| 2. API route | Handle auth requests |
| 3. Client | React hooks and methods |
| 4. proxy.ts | Route protection |

## 1. Create Auth Instance

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  emailAndPassword: { enabled: true }
})
```

## 2. Create API Route

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/modules/auth/src/services/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth.handler)
```

## 3. Create Client

```typescript
// modules/auth/src/hooks/auth-client.ts
"use client"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient()
export const { useSession, signIn, signUp, signOut } = authClient
```

## 4. Sign Up

```typescript
await authClient.signUp.email({
  email: "user@example.com",
  password: "password123",
  name: "John Doe"
})
```

## 5. Sign In

```typescript
await authClient.signIn.email({
  email: "user@example.com",
  password: "password123"
})
```

## 6. Get Session

```typescript
// Client
const { data: session } = useSession()

// Server
const session = await auth.api.getSession({ headers: request.headers })
```

## 7. Sign Out

```typescript
await authClient.signOut()
```

## 8. Protect Routes (proxy.ts)

```typescript
export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}
```
