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

Since Better Auth 1.7 generic providers are first-class social providers: no
`genericOAuthClient()` plugin is needed (it was dropped), and PKCE defaults to `true`.

## Usage

```typescript
// was signIn.oauth2({ providerId }) before 1.7
await authClient.signIn.social({
  provider: "custom-provider",
  callbackURL: "/dashboard"
})

// Linking: was oauth2.link() before 1.7
await authClient.linkSocial({ provider: "custom-provider", callbackURL: "/settings" })
```

Callback URL: `${baseURL}/api/auth/callback/:providerId`.

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
| `pkce` | No | PKCE (default `true` since 1.7; set `false` if the provider rejects it) |
| `discoveryUrl` | No | OIDC discovery document (alternative to explicit URLs) |

## Mapping User Info

```typescript
genericOAuth({
  config: [{
    // ...
    mapProfileToUser: (userInfo) => ({
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      image: userInfo.picture
    })
  }]
})
```
