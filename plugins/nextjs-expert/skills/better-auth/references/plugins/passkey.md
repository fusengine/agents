---
name: passkey
description: WebAuthn/Passkey authentication for passwordless sign-in
when-to-use: passwordless auth, high-security requirements, webauthn, biometric login
keywords: passkey, webauthn, passwordless, biometric, fido2, hardware keys
priority: medium
requires: server-config.md
related: plugins/2fa.md, security.md
---

# Passkey Plugin (WebAuthn)

## When to Use

- Passwordless authentication strategy
- Phishing-resistant login requirements
- Modern UX with biometrics/security keys
- Apple/Google passkey ecosystem

## Why Passkeys

| Traditional | Passkey |
|-------------|---------|
| Passwords stolen | Cryptographic proof |
| Phishing attacks | Origin-bound |
| Password fatigue | Biometric ease |
| Database breaches | No server secrets |

## Server Configuration

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { passkey } from "better-auth/plugins/passkey"

export const auth = betterAuth({
  plugins: [
    passkey({
      rpID: "localhost", // Your domain
      rpName: "My App",
      origin: process.env.BETTER_AUTH_URL
    })
  ]
})
```

## Client Configuration

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { passkeyClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [passkeyClient()]
})
```

## Register Passkey

```typescript
// User must be logged in first
const { data, error } = await authClient.passkey.addPasskey({
  name: "My MacBook" // Optional device name
})

if (error) {
  console.error("Failed to register passkey")
}
```

## Sign In with Passkey

```typescript
const { data, error } = await authClient.signIn.passkey()

if (error) {
  console.error("Passkey authentication failed")
} else {
  // User is now logged in
  router.push("/dashboard")
}
```

## List User Passkeys

```typescript
const { data } = await authClient.passkey.listPasskeys()

// Returns array of registered passkeys
// { id, name, createdAt, lastUsedAt }
```

## Delete Passkey

```typescript
await authClient.passkey.deletePasskey({
  passkeyId: "passkey_xxx"
})
```

## Production Configuration

```typescript
passkey({
  rpID: "example.com",
  rpName: "Example App",
  origin: "https://example.com"
})
```

## Browser Support

- Chrome 67+
- Safari 14+
- Firefox 60+
- Edge 79+

Check support:
```typescript
if (window.PublicKeyCredential) {
  // Passkeys supported
}
```
