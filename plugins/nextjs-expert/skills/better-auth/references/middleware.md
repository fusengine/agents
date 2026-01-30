# Middleware Route Protection

## Basic Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request)
  const { pathname } = request.nextUrl

  // Protected routes
  const protectedRoutes = ["/dashboard", "/settings", "/profile"]
  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Redirect if not authenticated
  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect if already logged in
  const authRoutes = ["/login", "/signup"]
  if (session && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/login",
    "/signup"
  ]
}
```

## With Cookie Cache

```typescript
import { getCookieCache } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
  // Use cache to avoid DB calls
  const session = await getCookieCache(request)

  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
```

## Pattern Matcher

```typescript
export const config = {
  matcher: [
    // Everything except static, api, _next
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
}
```

## Public Routes

```typescript
const publicRoutes = ["/", "/about", "/pricing", "/login", "/signup"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check auth for the rest
  const session = getSessionCookie(request)
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
```

## Custom Headers

```typescript
export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request)
  const response = NextResponse.next()

  // Add session info to headers
  if (session) {
    response.headers.set("x-user-authenticated", "true")
  }

  return response
}
```
