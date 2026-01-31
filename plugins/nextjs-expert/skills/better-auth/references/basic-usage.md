# Better Auth Basic Usage

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
