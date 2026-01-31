---
name: cookies
description: Understand cookie strategy, security attributes, and cross-domain authentication
when-to-use: understanding cookies, security configuration, cross-domain auth, cookie debugging
keywords: cookies, http-only, secure, sameSite, session cookie, csrf protection, cross-domain
priority: medium
requires: session.md, security.md
related: session.md, concepts/sessions.md, concepts/security.md
---

# Better Auth Cookies Concept

## When to Use

- Understanding cookie strategy
- Cross-domain authentication
- Cookie security configuration
- Debugging cookie issues

## Why Cookies

| LocalStorage | Cookies |
|--------------|---------|
| XSS vulnerable | HttpOnly protection |
| Manual handling | Automatic |
| No CSRF protection | SameSite attribute |
| Client-only | Server accessible |

## Session Cookie

```
better-auth.session_token=abc123...
HttpOnly: true
Secure: true (production)
SameSite: Lax
Path: /
MaxAge: 604800 (7 days)
```

## Cookie Structure

| Cookie | Purpose |
|--------|---------|
| `session_token` | Main session identifier |
| `csrf_token` | CSRF protection |
| `oauth_state` | OAuth flow state (temporary) |
| `callback_url` | Redirect after auth (temporary) |

## Configuration

```typescript
export const auth = betterAuth({
  advanced: {
    cookiePrefix: "myapp",  // myapp.session_token
    useSecureCookies: true,
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      domain: ".myapp.com"  // Cross-subdomain
    }
  }
})
```

## Cross-Domain Auth

```typescript
// For multiple domains sharing auth
advanced: {
  crossSubDomainCookies: {
    enabled: true,
    domain: ".myapp.com"  // Shared across *.myapp.com
  }
}
```

## Cookie Cache

```typescript
session: {
  cookieCache: {
    enabled: true,
    maxAge: 60 * 5  // 5 min cache, reduces DB lookups
  }
}
```

## Security Notes

- `HttpOnly` prevents XSS access
- `Secure` requires HTTPS
- `SameSite=Lax` prevents CSRF on GET
- Session token is cryptographically random
- Never store sensitive data in cookies directly
