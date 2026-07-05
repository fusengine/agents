---
name: session-and-csrf
description: Manual __Host- session cookie helpers plus global CSRF/origin and rate-limit middleware
keywords: setResponseHeader, getRequestHeader, getRequest, __Host-, csrf, origin, rate-limit, PKCE
source: https://tanstack.com/start/latest/docs/framework/react/guide/authentication-server-primitives
---

# Session Cookie + CSRF Middleware

## Overview

Low-level session cookie helpers using a `__Host-` prefix, plus the request-middleware that hardens non-GET RPCs: an `Origin` check (for sibling subdomains `SameSite` misses) and a per-IP rate limiter for credential endpoints.

---

## File: src/server/session.ts

```ts
/**
 * Manual __Host- session cookie. All secret/env reads happen per request.
 */
import { getRequestHeader, setResponseHeader } from '@tanstack/react-start/server'

const SESSION_COOKIE = '__Host-session'
const ONE_DAY = 60 * 60 * 24

export function setSessionCookie(token: string) {
  setResponseHeader(
    'Set-Cookie',
    [
      `${SESSION_COOKIE}=${token}`,
      'HttpOnly',
      'Secure',
      'SameSite=Lax',
      'Path=/',
      `Max-Age=${ONE_DAY}`,
    ].join('; '),
  )
}

export function clearSessionCookie() {
  setResponseHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  )
}

export function readSessionToken(): string | null {
  const header = getRequestHeader('cookie')
  if (!header) return null
  for (const part of header.split(/;\s*/)) {
    // Split only on the FIRST '=' — signed/base64 values often contain '='.
    const eq = part.indexOf('=')
    if (eq === -1) continue
    if (part.slice(0, eq) === SESSION_COOKIE) return part.slice(eq + 1)
  }
  return null
}
```

---

## File: src/start.ts

```ts
/**
 * Global request middleware. csrfMiddleware verifies the Origin on every non-GET
 * request (covers sibling subdomains that SameSite=Lax does not).
 */
import { createStart } from '@tanstack/react-start'
import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

const csrfMiddleware = createMiddleware().server(async ({ next }) => {
  const request = getRequest()
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin')
    // Compare the FULL origin (scheme + host + port).
    if (!origin || new URL(origin).origin !== process.env.APP_ORIGIN) {
      throw new Error('Origin check failed')
    }
  }
  return next()
})

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware],
}))
```

---

## File: src/server/rate-limit.ts

```ts
/**
 * Per-IP sliding-window limiter for credential endpoints. Use a Redis-backed
 * rateLimiter in production; the interface below is illustrative.
 */
import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { rateLimiter } from '~/lib/rate-limiter'

export function rateLimitMiddleware(opts: { key: string; max: number; windowMs: number }) {
  return createMiddleware().server(async ({ next }) => {
    const request = getRequest()
    const ip =
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0] ??
      'unknown'
    const allowed = await rateLimiter.consume(`rl:${opts.key}:${ip}`, opts.max, opts.windowMs)
    if (!allowed) throw new Error('Too many requests')
    return next()
  })
}
```

---

## File: src/server/login.functions.ts

```ts
/**
 * Login: rate-limited, constant-time (dummy hash for missing users), rotates
 * the session on success. Identical error message for unknown vs wrong password.
 */
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { setSessionCookie } from './session'
import { rateLimitMiddleware } from './rate-limit'
import { verifyPasswordHash, DUMMY_PASSWORD_HASH } from '~/lib/password'
import { db } from '~/db'

export const login = createServerFn({ method: 'POST' })
  .middleware([rateLimitMiddleware({ key: 'login', max: 5, windowMs: 60_000 })])
  .validator(z.object({ email: z.string().email(), password: z.string() }))
  .handler(async ({ data }) => {
    const user = await db.users.findByEmail(data.email)
    const hashToCheck = user?.passwordHash ?? DUMMY_PASSWORD_HASH
    const matches = await verifyPasswordHash(hashToCheck, data.password)
    if (!user || !matches) throw new Error('Invalid email or password')

    await db.sessions.revokeAllForUser(user.id) // rotate: kill fixation
    const token = await db.sessions.create({ userId: user.id })
    setSessionCookie(token)
    return { ok: true }
  })
```

---

## Notes

- Attach `csrfMiddleware` in `src/start.ts` so it runs on every non-GET request, including server routes and SSR.
- If you do NOT define `src/start.ts`, Start auto-installs its `createCsrfMiddleware()` for server functions.
- `DUMMY_PASSWORD_HASH` is computed once at startup with the same algorithm/cost as real hashes, so the missing-user branch costs the same time as wrong-password.
