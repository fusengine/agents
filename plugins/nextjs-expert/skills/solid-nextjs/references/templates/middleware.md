---
name: middleware-template
description: Auth middleware and route wrapper templates
---

# Auth Middleware Wrapper

```typescript
// modules/cores/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../lib/jwt'

type Handler = (request: NextRequest) => Promise<NextResponse>

/**
 * Authentication middleware wrapper
 *
 * @param handler - Route handler to wrap
 * @returns Wrapped handler with auth check
 */
export function withAuth(handler: Handler): Handler {
  return async (request: NextRequest) => {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    try {
      const payload = await verifyToken(token)
      request.headers.set('x-user-id', payload.userId)
      return handler(request)
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  }
}
```

# Next.js Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/settings', '/profile']
const authRoutes = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  // Redirect to login if accessing protected route without token
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect to dashboard if accessing auth routes with token
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/login', '/signup']
}
```

# Rate Limiting Middleware

```typescript
// modules/cores/middleware/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

/**
 * Rate limiting middleware
 *
 * @param limit - Max requests per window
 * @param windowMs - Time window in ms
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  limit = 100,
  windowMs = 60000
) {
  return async (request: NextRequest) => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const entry = rateLimitMap.get(ip)

    if (entry && now - entry.timestamp < windowMs) {
      if (entry.count >= limit) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        )
      }
      entry.count++
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now })
    }

    return handler(request)
  }
}
```
