# Better Auth Hooks

## Overview
Hooks allow intercepting and modifying auth behavior at key points.

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
          // Log successful auth events
          await logAuthEvent(ctx.path, ctx.context.session?.userId)
          return { response: ctx.response }
        }
      }
    ]
  }
})
```

## Hook Types

### Before Hooks
- Run before request processing
- Can modify request context
- Can short-circuit with early response

### After Hooks
- Run after request processing
- Can modify response
- Access to session data

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
