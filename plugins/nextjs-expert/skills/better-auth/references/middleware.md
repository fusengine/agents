# Route Protection with proxy.ts (Next.js 16)

> **Note**: `middleware.ts` is deprecated. Use `proxy.ts` at **same level as app/**.

## File Location

```
# With src/
src/proxy.ts    ← Same level as src/app/

# Without src/
proxy.ts        ← Project root, same level as app/
```

## Basic proxy.ts

```typescript
// proxy.ts (same level as app/)
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function proxy(request: NextRequest) {
  const session = getSessionCookie(request)
  const { pathname } = request.nextUrl

  const protectedRoutes = ["/dashboard", "/settings", "/profile"]
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))

  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (session && ["/login", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/login", "/signup"]
}
```

## With Cookie Cache

```typescript
import { getCookieCache } from "better-auth/cookies"

export async function proxy(request: NextRequest) {
  const session = await getCookieCache(request)
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}
```

## Migration from Middleware

```bash
bunx @next/codemod middleware-to-proxy .
```

Sources:
- [Next.js proxy.ts](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Next.js 16 Proxy Guide](https://nextjs.org/docs/app/getting-started/proxy)
