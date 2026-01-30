# Better Auth Next.js Integration

## API Route

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/modules/auth/src/services/auth"
import { toNextJsHandler } from "better-auth/next-js"
export const { GET, POST } = toNextJsHandler(auth)
```

## Server Components

```typescript
// app/dashboard/page.tsx
import { auth } from "@/modules/auth/src/services/auth"
import { headers } from "next/headers"

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")
  return <div>Welcome {session.user.name}</div>
}
```

## Server Actions

```typescript
"use server"
import { auth } from "@/modules/auth/src/services/auth"
import { headers } from "next/headers"

export async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user
}
```

## proxy.ts (Next.js 16+)

```typescript
// proxy.ts
import { auth } from "@/modules/auth/src/services/auth"
import { NextRequest, NextResponse } from "next/server"

export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  const protectedRoutes = ["/dashboard", "/settings"]
  const isProtected = protectedRoutes.some(r => request.nextUrl.pathname.startsWith(r))
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}
```

## Client Components

```typescript
"use client"
import { authClient } from "@/modules/auth/src/hooks/auth-client"

export function LoginButton() {
  const { signIn } = authClient
  return <button onClick={() => signIn.social({ provider: "google" })}>Sign in</button>
}

export function UserNav() {
  const { data: session, isPending } = authClient.useSession()
  if (isPending) return <div>Loading...</div>
  if (!session) return <LoginButton />
  return <div>{session.user.name}</div>
}
```
