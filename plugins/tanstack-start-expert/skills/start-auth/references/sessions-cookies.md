---
name: sessions-cookies
description: Session issuing/reading in Start via useSession or manual __Host- cookies
when-to-use: Creating, reading, or clearing user sessions and setting cookie flags
keywords: useSession, getRequest, getRequestHeader, setResponseHeader, cookie, __Host-, session-rotation
priority: high
requires: data-boundary.md
related: hardening.md
source: https://tanstack.com/start/latest/docs/framework/react/guide/authentication-server-primitives
---

# Sessions & Cookies

## Overview

Start offers two session strategies. The high-level `useSession<T>()` (from `@tanstack/react-start/server`) manages a sealed, HTTP-only cookie for you. For full control you read/write a `__Host-`-prefixed cookie manually via `getRequestHeader`/`setResponseHeader`. Either way the cookie flags are what make the session safe.

---

## Key Concepts

| Primitive | Use |
|-----------|-----|
| **`useSession<SessionData>()`** | Sealed cookie session — `.update()`, `.clear()`, `.data` |
| **`getRequest()` / `getRequestHeader(name)`** | Read the incoming request / a header (e.g. `cookie`) |
| **`setResponseHeader(name, value)`** | Write `Set-Cookie` and other response headers |
| **Opaque ID vs signed token** | ID looked up in DB (easy revoke) vs self-contained token (stateless) |

---

## Cookie Flags (all required)

| Flag | Why |
|------|-----|
| `HttpOnly` | JS can't read it → XSS can't exfiltrate the session |
| `Secure` | HTTPS only (mandatory with `__Host-`) |
| `SameSite=Lax` | Blocks most cross-site CSRF on POST |
| `__Host-` prefix | Binds to exact origin; no `Domain`, `Path=/`, `Secure` required |
| `Path=/` | Required by `__Host-` |
| `Max-Age` | Bounded lifetime; pair with server-side rotation |

---

## Core Pattern

```ts
// High-level sealed session
export function useAppSession() {
  return useSession<{ userId?: string; role?: string }>({
    name: 'app-session',
    password: process.env.SESSION_SECRET!, // read PER REQUEST, 32+ chars
    cookie: { secure: process.env.NODE_ENV === 'production', sameSite: 'lax', httpOnly: true },
  })
}
```

→ See [session-and-csrf.md](templates/session-and-csrf.md) for manual `__Host-` cookie helpers

---

## Best Practices

### DO
- Rotate the session on every privilege change (login/logout/password/role): revoke old, issue new
- Read `process.env.SESSION_SECRET` inside the function, not at module scope
- Split cookie parsing on the FIRST `=` only (signed/base64 values contain `=`)

### DON'T
- Read env/secrets at module top level (bundle leak; `undefined` on Cloudflare Workers at import time)
- Omit any cookie flag — each closes a specific attack
- Keep a pre-login session after login (session fixation)

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `const S = process.env.SECRET` at top of file | Move the read inside the handler/function |
| Cookie value truncated at first `=` in a token | `part.indexOf('=')` then `slice`, not `split('=')` |
| Session survives login | `db.sessions.revokeAllForUser(id)` then issue fresh |

---

## Related References

- [hardening.md](hardening.md) — CSRF, rate limiting, OAuth state/PKCE
- [data-boundary.md](data-boundary.md) — where the session is checked
