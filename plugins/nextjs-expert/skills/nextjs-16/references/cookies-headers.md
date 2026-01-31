---
name: cookies-headers
description: Reading and setting cookies, headers in Server Components and Route Handlers
when-to-use: authentication, session management, header manipulation
keywords: cookies, headers, async, httpOnly, sameSite
priority: medium
requires: server-components.md, api-routes.md
related: security.md, proxy.md
---

# Cookies & Headers

## When to Use

- Reading/setting cookies
- Accessing request headers
- Theme persistence
- Session management

## Why Async APIs

| API | Change in v16 |
|-----|---------------|
| cookies() | Returns Promise |
| headers() | Returns Promise |
| Both | Must `await` now |

## Reading Cookies (Server Components)
```typescript
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value || 'light'
  return <div className={theme}>Content</div>
}
```

## Setting Cookies (Server Actions)
```typescript
'use server'
import { cookies } from 'next/headers'

export async function setTheme(theme: 'light' | 'dark') {
  const cookieStore = await cookies()
  cookieStore.set('theme', theme, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365,  // 1 year
  })
}

export async function deleteTheme() {
  const cookieStore = await cookies()
  cookieStore.delete('theme')
}
```

## Reading Headers
```typescript
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  const auth = headersList.get('authorization')
  return <div>UA: {userAgent}</div>
}
```

## Route Handler Cookies
```typescript
// app/api/session/route.ts
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set('session', crypto.randomUUID(), {
    httpOnly: true,
    path: '/',
  })
  return Response.json({ ok: true })
}
```

## proxy.ts Cookies
```typescript
// proxy.ts
export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const response = NextResponse.next()
  response.cookies.set('visited', 'true', { path: '/' })
  return response
}
```

## Setting Response Headers
```typescript
export async function GET() {
  return Response.json({ data: 'value' }, {
    headers: {
      'Cache-Control': 'no-cache',
      'X-Custom-Header': 'value',
    },
  })
}
```
