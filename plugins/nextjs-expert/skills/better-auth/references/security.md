# Better Auth Security

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

## Session Security

```typescript
session: {
  expiresIn: 60 * 60 * 24 * 7,  // 7 days
  updateAge: 60 * 60 * 24,       // Update daily
  cookieCache: { enabled: true, maxAge: 60 * 5 }
}
```

## Account Lockout

```typescript
emailAndPassword: {
  maxFailedAttempts: 5,
  lockoutDuration: 60 * 15  // 15 minutes
}
```

## Environment Variables

```bash
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=https://yourapp.com
```

## Security Headers (proxy.ts)

```typescript
export default function proxy(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  return response
}
```
