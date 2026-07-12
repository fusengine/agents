---
name: vs-server-functions
description: Choosing between server routes and server functions
when-to-use: Deciding whether to build a server route or a server function
keywords: server route, server function, decision, rest, rpc, webhook, cross-origin
priority: high
related: defining.md
---

# Server Routes vs Server Functions

## Overview

Both run server-side logic, but they solve different problems. Picking the wrong
one leads to either an unnecessary public endpoint or a fragile internal call.

---

## The Official Rule

> Endpoint callable from **outside** the app → **server route**.
> Internal type-safe RPC → **server function**.

---

## Comparison

| Dimension | Server Route | Server Function |
|-----------|--------------|-----------------|
| Created with | `server` on `createFileRoute` | `createServerFn` |
| Caller | Any HTTP client (curl, webhook, mobile) | Your app (loaders, components) |
| Contract | Raw `Request` / `Response` | Type-safe args + return |
| URL | Fixed, addressable path | Generated RPC id |
| Cross-origin | Yes (with CSRF/CORS as needed) | No — same-origin only |
| Input validation | Manual in handler | `.validator()` (Zod) |

---

## Decision Guide

```
Who calls this endpoint?
├── External client (webhook, public REST, mobile, cross-origin)
│   └── Server Route
└── Your own app code (loader, component, hook)
    ├── Needs type-safe args + return → Server Function
    └── Needs a fixed public URL → Server Route
```

---

## When to Use

| Scenario | Choice |
|----------|--------|
| Stripe/GitHub webhook receiver | Server route |
| Public JSON REST API | Server route |
| OAuth callback URL | Server route |
| Fetch data in a route loader | Server function |
| Mutation from a button click | Server function |
| File download at a stable URL | Server route |

---

## Best Practices

### DO
- Reach for server routes only when an external caller or fixed URL is required
- Prefer server functions for internal calls to keep end-to-end type safety
- Add CSRF/auth middleware on any route touching private data

### DON'T
- Build a server route just to call it from your own components
- Expose internal RPC as a public URL without auth

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Server route called only internally | Convert to a server function |
| Server function needed by a webhook | Convert to a server route |

---

## Related References

- [defining.md](defining.md) — building the route
