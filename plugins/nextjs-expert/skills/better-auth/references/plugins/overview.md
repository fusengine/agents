---
name: overview
description: Complete guide to all available plugins for extending Better Auth functionality
when-to-use: extending auth, adding features, 2fa, organizations, magic links, oidc, stripe, scim
keywords: plugins overview, 2fa, organization, passkey, magic link, admin, sso, scim, stripe
priority: medium
requires: server-config.md
related: concepts/plugins.md, guides/plugin-development.md
---

# Better Auth Plugins Overview

## When to Use

- Extending core authentication features
- Adding 2FA, passkeys, organizations
- Integrating third-party services (Stripe, SCIM)
- Building admin dashboards

## Why Use Plugins

| Need | Plugin |
|------|--------|
| Security layer | `twoFactor`, `passkey` |
| Multi-tenancy | `organization` |
| Passwordless | `magicLink`, `anonymous` |
| Enterprise | `sso`, `scim`, `bearer` |

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
