# Middleware Protection Routes

## Middleware Basique

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request)
  const { pathname } = request.nextUrl

  // Routes protégées
  const protectedRoutes = ["/dashboard", "/settings", "/profile"]
  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Rediriger si non authentifié
  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Rediriger si déjà connecté
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

## Avec Cookie Cache

```typescript
import { getCookieCache } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
  // Utilise le cache pour éviter appels DB
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
    // Tout sauf static, api, _next
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
}
```

## Routes Publiques

```typescript
const publicRoutes = ["/", "/about", "/pricing", "/login", "/signup"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip routes publiques
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Vérifier auth pour le reste
  const session = getSessionCookie(request)
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
```

## Headers Personnalisés

```typescript
export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request)
  const response = NextResponse.next()

  // Ajouter info session aux headers
  if (session) {
    response.headers.set("x-user-authenticated", "true")
  }

  return response
}
```
