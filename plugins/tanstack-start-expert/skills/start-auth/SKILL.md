---
name: start-auth
description: "Use when: adding authentication/authorization to a TanStack Start app — protecting routes with beforeLoad + redirect, authorizing server functions, sessions/cookies (useSession, getRequest), CSRF, or wiring Auth.js. Do NOT use for: generic route guards unrelated to auth (react-tanstack-router) or non-Start Node auth."
versions:
  "@tanstack/react-start": "^1"
  "@tanstack/react-router": "^1"
user-invocable: false
references: references/data-boundary.md, references/route-protection.md, references/sessions-cookies.md, references/hardening.md, references/templates/authed-middleware.md, references/templates/session-and-csrf.md, references/templates/oauth-pkce.md
related-skills: better-auth, auth-audit
---

# TanStack Start — Authentication

## CRITICAL GOTCHA (READ BEFORE ANYTHING)

**`beforeLoad` + `redirect()` protects the UI, NOT your data.**

Server functions and server routes are **API endpoints reachable independently** of whichever route renders the calling component. A `beforeLoad` guard keeps a user off a *screen*, but the underlying `createServerFn` handler can still be called directly (crafted request, replayed RPC). **Authorization MUST be enforced inside the server-function handler or its middleware** — that is the security boundary. `beforeLoad` is route UX only.

```
Route beforeLoad guard  → UX: keep users out of screens they can't use
Server-fn middleware    → SECURITY: the real data/API boundary — enforce auth HERE
```

→ [data-boundary.md](references/data-boundary.md) is mandatory reading before writing any auth code.

---

## Agent Workflow (MANDATORY)

Before ANY implementation, spawn in parallel:

1. **fuse-ai-pilot:explore-codebase** — find `src/routes/_authed*`, `src/server/`, existing session code
2. **fuse-ai-pilot:research-expert** — verify Start auth API via Context7 `/websites/tanstack_start_framework_react`
3. **mcp__context7__query-docs** — confirm `useSession`, `createMiddleware`, `getRequest` signatures

After implementation, run **fuse-ai-pilot:sniper**, then consider **fuse-security:auth-audit**.

---

## Overview

| Concern | Primitive |
|---------|-----------|
| **Route UX** | `beforeLoad` + `redirect({ to: '/login' })` in an `_authed` layout route |
| **Data authorization** | `authMiddleware` on every private `createServerFn` (the real boundary) |
| **Sessions** | `useSession<T>()` (sealed cookie) OR manual `__Host-` cookie via `getRequest`/`setResponseHeader` |
| **CSRF** | `createCsrfMiddleware()` (auto for server fns) + `Origin` check for sibling subdomains |

---

## Critical Rules

1. **Authorize in the handler** — every server fn touching private data carries `authMiddleware`; never rely on `beforeLoad`.
2. **Never a GET that mutates** — mutations use POST/PUT/DELETE so `SameSite=Lax` protects them.
3. **Read env/cookies per request** — `process.env.SECRET` inside the handler, NEVER at module scope (leaks to bundle; undefined on edge).
4. **Rotate sessions on privilege change** — revoke old + issue new on login/logout/password/role change.
5. **Defeat enumeration & timing** — identical responses for unknown vs known accounts; constant-time password compare.

---

## Auth Approaches (official)

The official [authentication guide](https://tanstack.com/start/latest/docs/framework/react/guide/authentication) lists Clerk, WorkOS, **Better Auth**, and **Auth.js** as supported options, plus fully DIY. This skill ships the **DIY server-primitive** templates (portable, no vendor lock-in), which the official guide documents in depth. For a managed library (Auth.js, Better Auth, Clerk, WorkOS), install it and follow ITS current docs / the `better-auth` skill — do NOT assume a Start adapter API without verifying it, and note there is no first-party `start-authjs` example in the TanStack repo (the real DIY examples are `start-basic-auth` and `start-supabase-basic`).

---

## Reference Guide

### Concepts

| Topic | Reference | Load when |
|-------|-----------|-----------|
| **Data boundary** | [data-boundary.md](references/data-boundary.md) | ALWAYS first — where auth is actually enforced |
| **Route protection** | [route-protection.md](references/route-protection.md) | Building the `_authed` layout + RBAC redirects |
| **Sessions & cookies** | [sessions-cookies.md](references/sessions-cookies.md) | Issuing/reading sessions, cookie flags |
| **Hardening** | [hardening.md](references/hardening.md) | CSRF, rate limiting, OAuth state/PKCE, timing |

### Templates

| Template | When to Use |
|----------|-------------|
| [authed-middleware.md](references/templates/authed-middleware.md) | `_authed` layout + `authMiddleware` + protected server fn |
| [session-and-csrf.md](references/templates/session-and-csrf.md) | Cookie session helpers + global CSRF/origin middleware + login |
| [oauth-pkce.md](references/templates/oauth-pkce.md) | OAuth authorization-code flow with state + PKCE |

---

## Best Practices

### DO
- Centralize session lookup in `authMiddleware` so every handler gets a typed session
- Use `__Host-` prefixed, `HttpOnly`, `Secure`, `SameSite=Lax` cookies
- Verify `Origin` on non-GET requests against your app origin

### DON'T
- Treat `beforeLoad` as the security boundary
- Read `process.env` at module top level
- Vary response/status/timing between existing and non-existing accounts
