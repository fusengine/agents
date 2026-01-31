---
name: security
description: Implement security measures including CSRF, rate limiting, passwords, and secure cookies
when-to-use: production deployment, security hardening, compliance checklist, protecting against attacks
keywords: CSRF protection, rate limiting, password hashing, secure cookies, brute force, XSS, CSRF
priority: high
requires: server-config.md, session.md
related: middleware.md, rate-limiting.md, concepts/security.md
---

# Better Auth Security

## Threat Model

| Attack | Protection | Built-in |
|--------|------------|----------|
| **XSS** | HTTP-only cookies | Yes |
| **CSRF** | SameSite + origin check | Yes |
| **Brute Force** | Account lockout | Yes |
| **Session Hijack** | Secure cookies + IP check | Yes |
| **Clickjacking** | X-Frame-Options | Manual |

## CSRF Protection

Built-in via non-simple headers, origin validation, SameSite=Lax cookies.

```typescript
// Disable (NOT recommended)
advanced: { disableCSRFCheck: true }
```

## Trusted Origins

```typescript
export const auth = betterAuth({
  trustedOrigins: ["https://yourapp.com", "https://admin.yourapp.com"]
})
```

## Secure Cookies

```typescript
advanced: {
  useSecureCookies: true,  // Force HTTPS
  crossSubDomainCookies: { enabled: true, domain: ".yourapp.com" }
}
```

## Password Requirements

```typescript
emailAndPassword: {
  enabled: true,
  minPasswordLength: 8,
  password: {
    validate: (p) => {
      if (!/[A-Z]/.test(p)) return "Need uppercase"
      if (!/[0-9]/.test(p)) return "Need number"
      return true
    }
  }
}
```

## Brute Force Protection

```typescript
emailAndPassword: {
  maxFailedAttempts: 5,
  lockoutDuration: 60 * 15  // 15 minutes
}
```

## Session Security

```typescript
session: {
  expiresIn: 60 * 60 * 24 * 7,  // 7 days max
  updateAge: 60 * 60 * 24,       // Rotate daily
  cookieCache: { enabled: true, maxAge: 60 * 5 }
}
```

## Environment Variables

```bash
# Generate secure secret (32+ bytes)
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=https://yourapp.com
```

## Security Headers (proxy.ts)

```typescript
export default function proxy(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  return response
}
```

## Checklist

- [ ] `BETTER_AUTH_SECRET` is 32+ random bytes
- [ ] `useSecureCookies: true` in production
- [ ] `trustedOrigins` configured
- [ ] Password validation enabled
- [ ] Account lockout configured
- [ ] Security headers in proxy.ts
