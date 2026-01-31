---
name: nextjs-app-router
description: Complete Next.js App Router example with authentication
when-to-use: starting new project, reference implementation, solid structure
keywords: example, next.js, app router, complete example, solid structure
priority: high
requires: installation.md, basic-usage.md
related: integrations/nextjs.md
---

# Better Auth Next.js App Router Example

## When to Use

- Starting a new Next.js 16+ project
- Complete working example reference
- Understanding SOLID file structure
- Quick-start authentication setup

## Why This Structure

| Aspect | Benefit |
|--------|---------|
| `modules/` | SOLID separation |
| `proxy.ts` | Next.js 16 standard |
| `[...all]` route | Catch-all auth |
| Client hooks | Reusable auth state |

## File Structure

```
app/
├── api/auth/[...all]/route.ts
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/page.tsx
└── layout.tsx
modules/auth/src/
├── services/auth.ts
└── hooks/auth-client.ts
proxy.ts
```

## 1. Server Configuration

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }
  }
})
```

## 2. API Route

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/modules/auth/src/services/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth.handler)
```

## 3. Client

```typescript
// modules/auth/src/hooks/auth-client.ts
"use client"
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient()
export const { useSession, signIn, signOut } = authClient
```

## 4. Proxy (Protected Routes)

```typescript
// proxy.ts
import { auth } from "@/modules/auth/src/services/auth"

export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (request.nextUrl.pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}
```

## 5. Login Page

```typescript
// app/(auth)/login/page.tsx
"use client"
import { signIn } from "@/modules/auth/src/hooks/auth-client"

export default function LoginPage() {
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const form = new FormData(e.currentTarget)
      signIn.email({ email: form.get("email"), password: form.get("password") })
    }}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign In</button>
    </form>
  )
}
```
