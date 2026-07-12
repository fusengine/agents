---
name: env-and-checklist
description: Production environment variables rule and a pre-deploy checklist for Start
when-to-use: Configuring prod env vars or verifying readiness before deploying
keywords: env, process.env, module-scope, edge, checklist, secrets, production
priority: high
related: cloudflare.md, build-and-adapters.md
source: https://tanstack.com/start/latest/docs/framework/react/guide/execution-model
---

# Env Vars & Deploy Checklist

## Overview

The single most important production rule in Start is **where** you read env vars. Reading `process.env` at module scope is wrong on two axes: it can be inlined into the client bundle (secret leak), and on edge runtimes (Cloudflare Workers) env is injected at request time — a module-level read runs before any request exists and evaluates to `undefined`.

---

## The Rule

```ts
// ❌ Wrong — inlined into bundle; undefined on the edge at import time
const SECRET = process.env.SESSION_SECRET
export function sign(p) { return hmac(p, SECRET) }

// ✅ Right — read per request, inside the function
export function sign(p) { return hmac(p, process.env.SESSION_SECRET) }
```

---

## Key Concepts

| Concern | Guidance |
|---------|----------|
| **Server secrets** | Read inside handlers/functions; store in the host's env manager |
| **Client-exposed vars** | Only non-secret, build-time public config (framework `VITE_`-style prefixing) |
| **Edge bindings** | Cloudflare injects env/bindings per request — never at module load |

---

## Pre-Deploy Checklist

```
Before deploying:
├── [ ] All secrets read PER REQUEST (grep for module-scope process.env)
├── [ ] Host env vars set (SESSION_SECRET 32+ chars, OAuth ids, APP_ORIGIN)
├── [ ] Correct adapter in vite.config.ts for the target host
├── [ ] package.json build + start/deploy scripts match the target
├── [ ] Cookies: HttpOnly + Secure + SameSite + __Host- (see start-auth)
├── [ ] CSRF/origin middleware active for non-GET (see start-auth)
├── [ ] Prerender list covers public routes; auth routes stay SSR
└── [ ] tsc --noEmit / lint clean (run sniper)
```

---

## Best Practices

### DO
- `grep` the codebase for top-level `process.env` before every release
- Keep `APP_ORIGIN` in env and compare full origins in CSRF checks
- Set a strong `SESSION_SECRET` (32+ chars) in the host, not in the repo

### DON'T
- Commit secrets or read them at import time
- Expose server secrets through client-visible env prefixes

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Secret is `undefined` on Cloudflare | Move the read inside the request handler |
| Secret ends up in client bundle | Never read it at module scope; keep it in server-only code |

---

## Related References

- [cloudflare.md](cloudflare.md) — why the edge makes this rule non-negotiable
