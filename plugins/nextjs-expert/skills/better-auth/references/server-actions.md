---
name: server-actions
description: Use Server Components and Actions for protected endpoints and reusable auth helpers
when-to-use: server components, protected api routes, server actions, cache wrappers, auth helpers
keywords: server actions, server components, protected routes, cache, getSession, headers
priority: high
requires: basic-usage.md, client.md
related: middleware.md, api.md
---

# Server Actions & Server Components

## When to Use

- Protected Server Components (dashboard, profile)
- Server Actions that require authentication
- API Routes with auth checks
- Reusable auth helpers with caching

## Why Server-Side Auth

| Pattern | Benefit |
|---------|---------|
| `cache()` wrapper | Single DB call per request |
| `headers()` | Access cookies server-side |
| Server Components | No client JS for auth check |

## Get Session (Server Component)

```typescript
import { auth } from "@/modules/auth/src/services/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  return <h1>Welcome {session.user.name}</h1>
}
```

## Reusable Helper

```typescript
// modules/auth/src/services/auth-server.ts
import { auth } from "./auth"
import { headers } from "next/headers"
import { cache } from "react"

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() })
})

export const getUser = cache(async () => {
  const session = await getSession()
  return session?.user ?? null
})
```

## Protected Server Action

```typescript
// modules/auth/src/services/profile.action.ts
"use server"
import { auth } from "./auth"
import { headers } from "next/headers"
import { prisma } from "@/modules/cores/database/prisma"

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: formData.get("name") as string }
  })
}
```

## Protected API Route

```typescript
// app/api/user/route.ts
import { auth } from "@/modules/auth/src/services/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ user: session.user })
}
```
