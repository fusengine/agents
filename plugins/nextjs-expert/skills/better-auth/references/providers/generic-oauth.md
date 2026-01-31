---
name: generic-oauth
description: Custom OAuth provider configuration for any OAuth service
when-to-use: custom oauth, unsupported providers, custom oauth setup
keywords: custom oauth, generic provider, oauth config, custom authentication
priority: low
requires: server-config.md, providers/overview.md
related: providers/overview.md, concepts/oauth.md
---

# Generic OAuth Provider

## When to Use

- Custom identity providers
- Enterprise IdPs (OneLogin, Auth0)
- Regional providers (WeChat, LINE)
- Internal OAuth servers

## Why Generic OAuth

| Built-in providers | Generic OAuth |
|--------------------|---------------|
| Limited selection | Any provider |
| Fixed configuration | Full control |
| Standard mapping | Custom mapping |
| Preset scopes | Custom scopes |

## Generic OAuth Plugin

For providers not natively supported.

```typescript
import { betterAuth } from "better-auth"
import { genericOAuth } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "custom-provider",
          clientId: process.env.CUSTOM_CLIENT_ID!,
          clientSecret: process.env.CUSTOM_CLIENT_SECRET!,
          authorizationUrl: "https://provider.com/oauth/authorize",
          tokenUrl: "https://provider.com/oauth/token",
          userInfoUrl: "https://provider.com/api/user",
          scopes: ["openid", "profile", "email"]
        }
      ]
    })
  ]
})
```

## Client Configuration

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { genericOAuthClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [genericOAuthClient()]
})
```

## Usage

```typescript
await authClient.signIn.oauth2({
  providerId: "custom-provider",
  callbackURL: "/dashboard"
})
```

## Available Options

| Option | Required | Description |
|--------|----------|-------------|
| `providerId` | Yes | Unique provider ID |
| `clientId` | Yes | OAuth Client ID |
| `clientSecret` | Yes | Client Secret |
| `authorizationUrl` | Yes | Authorization URL |
| `tokenUrl` | Yes | Token URL |
| `userInfoUrl` | No | User info URL |
| `scopes` | No | Requested scopes |
| `pkce` | No | Enable PKCE |

## Mapping User Info

```typescript
genericOAuth({
  config: [{
    // ...
    mapUserInfo: (userInfo) => ({
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      image: userInfo.picture
    })
  }]
})
```
