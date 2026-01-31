---
name: rate-limiting
description: Configure rate limiting to prevent brute force, credential stuffing, and DDoS attacks
when-to-use: production security, attack prevention, brute force protection, endpoint limiting
keywords: rate limiting, brute force, DDoS, window, max requests, storage, redis, IP detection
priority: high
requires: server-config.md, security.md
related: security.md, concepts/security.md
---

# Better Auth Rate Limiting

## When to Use

- Protect against brute force attacks
- Prevent account enumeration
- Limit signup spam
- Secure password reset endpoint

## Why Rate Limiting

| Without | With |
|---------|------|
| Unlimited login attempts | 3 per 10 seconds |
| Credential stuffing | Blocked after threshold |
| DDoS vulnerable | Protected |

## Basic Configuration

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  rateLimit: {
    enabled: true,        // Default: true in production
    window: 60,           // Window in seconds (default: 60)
    max: 100              // Max requests per window (default: 100)
  }
})
```

## Custom Rules per Path

```typescript
export const auth = betterAuth({
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 10, max: 3 },      // 3 attempts per 10s
      "/sign-up/email": { window: 60, max: 5 },      // 5 signups per minute
      "/forgot-password": { window: 300, max: 3 },   // 3 resets per 5 min
      "/two-factor/verify": { window: 60, max: 5 }   // 5 2FA attempts per min
    }
  }
})
```

## Storage Options

```typescript
// Memory (default - single instance only)
rateLimit: { storage: "memory" }

// Database (multi-instance)
rateLimit: { storage: "database" }

// Redis (recommended for production)
import { redis } from "./redis"

export const auth = betterAuth({
  secondaryStorage: {
    get: (key) => redis.get(key),
    set: (key, value, ttl) => redis.set(key, value, "EX", ttl),
    delete: (key) => redis.del(key)
  },
  rateLimit: { storage: "secondary-storage" }
})
```

## IP Detection

```typescript
rateLimit: {
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-real-ip", "x-forwarded-for"],
      disableIpRateLimiting: false
    }
  }
}
```

## Disable for Development

```typescript
rateLimit: {
  enabled: process.env.NODE_ENV === "production"
}
```
