# Better Auth Plugins Overview

## Available Plugins

| Plugin | Description |
|--------|-------------|
| `twoFactor` | TOTP/OTP two-factor authentication |
| `organization` | Multi-tenant organizations & teams |
| `admin` | Admin dashboard & user management |
| `passkey` | WebAuthn/Passkey authentication |
| `magicLink` | Email magic link login |
| `username` | Username-based authentication |
| `anonymous` | Anonymous user sessions |
| `phoneNumber` | Phone/SMS authentication |
| `oneTap` | Google One Tap sign-in |
| `jwt` | JWT token generation |
| `openAPI` | OpenAPI documentation |
| `bearer` | Bearer token authentication |

## Installation Pattern

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { twoFactor } from "better-auth/plugins/two-factor"
import { organization } from "better-auth/plugins/organization"

export const auth = betterAuth({
  // ... base config
  plugins: [
    twoFactor(),
    organization()
  ]
})
```

## Client Plugin Pattern

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { twoFactorClient } from "better-auth/client/plugins"
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient(),
    organizationClient()
  ]
})
```

## Generate Schema After Adding Plugins

```bash
bunx @better-auth/cli generate
bunx prisma migrate dev
```

## Plugin Options

Most plugins accept configuration options:

```typescript
plugins: [
  twoFactor({
    issuer: "MyApp",
    totpOptions: {
      digits: 6,
      period: 30
    }
  }),
  organization({
    allowUserToCreateOrganization: true
  })
]
```
