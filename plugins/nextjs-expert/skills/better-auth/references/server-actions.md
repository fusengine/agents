# Server Actions & Server Components

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
