---
name: hardening
description: CSRF, rate limiting, OAuth state/PKCE, and enumeration/timing defenses in Start
when-to-use: Hardening credential endpoints, OAuth callbacks, or non-GET RPCs
keywords: CSRF, createCsrfMiddleware, origin, rate-limit, PKCE, oauth-state, enumeration, timing
priority: high
requires: sessions-cookies.md
source: https://tanstack.com/start/latest/docs/framework/react/guide/authentication-server-primitives
---

# Auth Hardening

## Overview

Beyond sessions, credential and OAuth endpoints need explicit hardening: CSRF/origin checks on non-GET RPCs, rate limiting, OAuth `state`+PKCE, and defenses against user enumeration and timing leaks. Start ships `createCsrfMiddleware()` and gives you `getRequest()` for the rest.

---

## Key Concepts

| Threat | Defense |
|--------|---------|
| **CSRF** | `SameSite=Lax` + `createCsrfMiddleware()`; verify `Origin` for sibling subdomains |
| **Credential stuffing** | Per-IP (and per-account) rate limit with sliding window / token bucket |
| **OAuth code interception** | `state` param (CSRF) + PKCE `code_verifier`/`code_challenge` in a short-lived signed cookie |
| **User enumeration** | Identical response/status/body for known vs unknown accounts |
| **Timing leak** | Always run the password hash compare (dummy hash for missing users) |

---

## CSRF: two cases SameSite misses

```
Non-GET RPC?
├── Cross-site top-level POST → SameSite=Lax already blocks it
├── GET that mutates          → never do this; use POST/PUT/DELETE
└── POST from sibling subdomain → SameSite=Lax does NOT block → verify Origin header
```

Compare the **full** origin (scheme + host + port), not host alone.

---

## Core Pattern

```ts
// src/start.ts — Start auto-installs CSRF for server fns unless you define start.ts.
import { createStart, createCsrfMiddleware } from '@tanstack/react-start'

const csrf = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === 'serverFn' })
export const startInstance = createStart(() => ({ requestMiddleware: [csrf] }))
```

→ See [session-and-csrf.md](templates/session-and-csrf.md) for origin + rate-limit middleware

---

## Best Practices

### DO
- Rate-limit `login`/`register`/`reset` per IP (Redis-backed in production)
- For OAuth: verify cookie-`state` equals callback `state`, send `code_verifier` on token exchange
- Password reset: same 200 + same body whether or not the email exists, and still do the work

### DON'T
- Return 200-if-exists / 404-if-not on reset (enumeration)
- Vary copy ("link sent" vs "no account") or skip work for unknown users (timing)
- Trust host-only origin comparison

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Login leaks account existence via timing | Compare against a `DUMMY_PASSWORD_HASH` when user missing |
| OAuth callback accepts any request | Reject unless cookie-`state` matches query `state` |
| Origin check passes across scheme | Compare `new URL(origin).origin` to `APP_ORIGIN` |

---

## Related References

- [sessions-cookies.md](sessions-cookies.md) — cookie flags the CSRF story relies on
- [data-boundary.md](data-boundary.md) — where these middlewares attach
