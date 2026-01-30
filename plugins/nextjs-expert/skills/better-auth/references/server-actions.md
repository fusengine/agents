# Server Actions & Server Components

## Récupérer Session (Server Component)

```typescript
// app/dashboard/page.tsx
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <h1>Bienvenue {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
    </div>
  )
}
```

## Helper Réutilisable

```typescript
// lib/auth-server.ts
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { cache } from "react"

export const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers()
  })
})

export const getUser = cache(async () => {
  const session = await getSession()
  return session?.user ?? null
})
```

## Server Action Protégée

```typescript
// app/actions/profile.ts
"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    throw new Error("Non authentifié")
  }

  const name = formData.get("name") as string

  // Update user...
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name }
  })

  revalidatePath("/profile")
}
```

## API Route Protégée

```typescript
// app/api/user/route.ts
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifié" },
      { status: 401 }
    )
  }

  return NextResponse.json({ user: session.user })
}
```

## Méthodes API Disponibles

```typescript
// Session
auth.api.getSession({ headers })

// User
auth.api.getUser({ headers })

// Avec Organization plugin
auth.api.getFullOrganization({
  headers,
  query: { organizationId }
})
```
