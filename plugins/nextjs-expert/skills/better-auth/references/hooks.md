---
name: hooks
description: Implement before/after hooks for custom logic, audit logging, and event handling
when-to-use: custom validation, audit logging, welcome emails, tracking events, custom rate limiting
keywords: hooks, before, after, onCreate, onSessionCreate, middleware, custom logic, events
priority: medium
requires: server-config.md
related: server-config.md, email.md
---

# Better Auth Hooks

## When to Use

- Custom validation before auth actions
- Audit logging for compliance
- Send emails on user creation
- Track login events
- Custom rate limiting logic

## Why Hooks

| Hook Type | Use Case |
|-----------|----------|
| `before` | Validate, rate limit, modify request |
| `after` | Log, notify, modify response |
| `onCreate` | Welcome email, setup defaults |
| `onSessionCreate` | Track logins |

## Server Hooks

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  hooks: {
    before: [
      {
        matcher: (context) => context.path === "/sign-in/email",
        handler: async (ctx) => {
          console.log("Sign-in attempt:", ctx.body?.email)
          return { context: ctx }
        }
      }
    ],
    after: [
      {
        matcher: (context) => context.path.startsWith("/sign"),
        handler: async (ctx) => {
          await logAuthEvent(ctx.path, ctx.context.session?.userId)
          return { response: ctx.response }
        }
      }
    ]
  }
})
```

## Common Use Cases

```typescript
// Rate limit custom logic
before: [{
  matcher: (ctx) => ctx.path === "/sign-up/email",
  handler: async (ctx) => {
    const ip = ctx.headers.get("x-forwarded-for")
    if (await isRateLimited(ip)) {
      return { response: Response.json({ error: "Too many attempts" }, { status: 429 }) }
    }
    return { context: ctx }
  }
}]

// Audit logging
after: [{
  matcher: () => true,
  handler: async (ctx) => {
    await auditLog({ path: ctx.path, userId: ctx.context.session?.userId })
    return { response: ctx.response }
  }
}]
```

## Event Hooks

```typescript
export const auth = betterAuth({
  user: {
    hooks: {
      onCreate: async (user) => {
        await sendWelcomeEmail(user.email)
      }
    }
  },
  session: {
    hooks: {
      onSessionCreate: async (session) => {
        await trackLogin(session.userId)
      }
    }
  }
})
```

## Hook Types

| Type | Timing | Can Modify |
|------|--------|------------|
| `before` | Pre-request | Request context |
| `after` | Post-request | Response |
| `onCreate` | User created | N/A |
| `onSessionCreate` | Session created | N/A |
