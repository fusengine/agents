---
name: 2fa
description: Two-factor authentication with TOTP for enhanced security
when-to-use: securing accounts, compliance requirements, admin protection, financial apps
keywords: 2FA, TOTP, two-factor, otp, security, mfa, backup codes
priority: medium
requires: server-config.md
related: plugins/passkey.md, security.md
---

# Two-Factor Authentication Plugin

## When to Use

- Securing sensitive user accounts
- Compliance requirements (PCI, SOC2)
- Admin/elevated privilege protection
- Financial or healthcare applications

## Why 2FA

| Without | With |
|---------|------|
| Password only | Password + TOTP |
| Single point of failure | Defense in depth |
| Credential stuffing risk | Phishing resistant |
| Account takeover | Protected accounts |

## Server Configuration

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { twoFactor } from "better-auth/plugins/two-factor"

export const auth = betterAuth({
  plugins: [
    twoFactor({
      issuer: "MyApp",
      totpOptions: {
        digits: 6,
        period: 30
      }
    })
  ]
})
```

## Client Configuration

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { twoFactorClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [twoFactorClient()]
})
```

## Enable 2FA

```typescript
// Step 1: Generate TOTP secret
const { data } = await authClient.twoFactor.enable({
  password: "user-password"
})

// data.totpURI - Use to generate QR code
// data.backupCodes - Save these for recovery
```

## Verify TOTP

```typescript
// After scanning QR code
await authClient.twoFactor.verifyTOTP({
  code: "123456",
  trustDevice: true // Optional: remember device
})
```

## Sign In with 2FA

```typescript
const { data, error } = await authClient.signIn.email({
  email: "user@example.com",
  password: "password"
})

if (data?.twoFactorRedirect) {
  // Redirect to 2FA verification page
  router.push("/verify-2fa")
}
```

## Verify During Sign In

```typescript
await authClient.twoFactor.verifyTOTP({
  code: "123456"
})
```

## Disable 2FA

```typescript
await authClient.twoFactor.disable({
  password: "user-password"
})
```

## Backup Codes

```typescript
// Generate new backup codes
const { data } = await authClient.twoFactor.generateBackupCodes({
  password: "user-password"
})

// Use backup code
await authClient.twoFactor.verifyBackupCode({
  code: "XXXXX-XXXXX"
})
```
