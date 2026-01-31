---
name: oidc-provider
description: OpenID Connect provider functionality
when-to-use: oidc provider, enterprise integrations, identity provider role
keywords: OIDC, OpenID Connect, provider, identity provider
priority: low
requires: server-config.md
related: plugins/sso.md
---

# Better Auth OIDC Provider Plugin

## When to Use

- Building platforms with third-party integrations
- "Login with YourApp" functionality
- API marketplace authentication
- Developer ecosystem enablement

## Why Be an OIDC Provider

| Consumer only | Provider |
|---------------|----------|
| Use others' APIs | Others use yours |
| Limited ecosystem | Platform growth |
| No developer tools | Dev portal ready |
| Single product | Platform business |

## Overview
Transform your app into an OAuth 2.1 / OIDC provider for third-party integrations.

## Installation

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { oidcProvider } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    oidcProvider({
      issuer: "https://yourapp.com"
    })
  ]
})
```

## Register OAuth Client

```typescript
// Admin creates OAuth client
const client = await auth.api.createOAuthClient({
  name: "Third Party App",
  redirectUris: ["https://thirdparty.com/callback"],
  scopes: ["openid", "profile", "email"]
})
// { clientId: "...", clientSecret: "..." }
```

## Endpoints Exposed

| Endpoint | Description |
|----------|-------------|
| `/.well-known/openid-configuration` | Discovery |
| `/.well-known/oauth-authorization-server` | OAuth metadata |
| `/oauth2/authorize` | Authorization |
| `/oauth2/token` | Token exchange |
| `/oauth2/userinfo` | User info |
| `/oauth2/introspect` | Token introspection |
| `/oauth2/revoke` | Token revocation |
| `/jwks` | JSON Web Key Set |

## Third-Party Integration

```typescript
// Third-party app configuration
const config = {
  issuer: "https://yourapp.com",
  clientId: "client_xxx",
  clientSecret: "secret_xxx",
  redirectUri: "https://thirdparty.com/callback",
  scopes: ["openid", "profile", "email"]
}
```

## Consent Screen

```typescript
oidcProvider({
  issuer: "https://yourapp.com",
  consent: {
    // Custom consent page
    consentPage: "/oauth/consent"
  }
})
```

## Custom Scopes & Claims

```typescript
oidcProvider({
  scopes: {
    custom_scope: {
      description: "Access custom data",
      claims: ["custom_claim"]
    }
  },
  claims: {
    custom_claim: async (user) => user.customData
  }
})
```

## Configuration

```typescript
oidcProvider({
  issuer: "https://yourapp.com",
  accessTokenExpiresIn: 3600,     // 1 hour
  refreshTokenExpiresIn: 604800,  // 7 days
  idTokenExpiresIn: 3600,         // 1 hour
  requirePKCE: true               // Require PKCE (recommended)
})
```
