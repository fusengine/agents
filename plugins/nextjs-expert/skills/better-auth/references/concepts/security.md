---
name: security
description: Learn security layers, cookie security, password hashing, rate limiting, and trusted origins
when-to-use: security understanding, threat model, security architecture, hardening, compliance
keywords: security concept, CSRF, XSS, rate limiting, password hashing, cookie security, defense layers
priority: medium
requires: security.md, rate-limiting.md
related: security.md, rate-limiting.md, concepts/cookies.md
---

# Better Auth Security Concept

## When to Use

- Security audit preparation
- Understanding protection layers
- Custom security configuration
- Compliance requirements

## Why Security-First

| DIY auth | Better Auth |
|----------|-------------|
| Missed vulnerabilities | Built-in protection |
| Ad-hoc security | Defense in depth |
| No rate limiting | Configurable limits |
| Plain cookies | Secure defaults |

## Security Layers

```
1. CSRF Protection → Token validation on mutations
2. Rate Limiting → Prevent brute force
3. Session Security → HttpOnly, Secure, SameSite cookies
4. Password Hashing → Bcrypt/Argon2
5. Token Security → Cryptographically random
```

## Cookie Security

```typescript
export const auth = betterAuth({
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: true,  // HTTPS only (auto in prod)
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7  // 7 days
    }
  }
})
```

## Password Security

```typescript
// Automatic hashing with bcrypt (default)
// Or configure custom hasher
export const auth = betterAuth({
  advanced: {
    password: {
      hash: async (password) => argon2.hash(password),
      verify: async (hash, password) => argon2.verify(hash, password)
    }
  }
})
```

## Rate Limiting

```typescript
export const auth = betterAuth({
  rateLimit: {
    window: 60,      // 60 seconds
    max: 10,         // 10 requests
    storage: "memory"  // or "secondary-storage" for Redis
  }
})
```

## Trusted Origins

```typescript
export const auth = betterAuth({
  trustedOrigins: [
    "https://myapp.com",
    "https://admin.myapp.com"
  ]
})
```

## Security Headers

Recommended headers (configure in proxy.ts or next.config):
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=31536000`
