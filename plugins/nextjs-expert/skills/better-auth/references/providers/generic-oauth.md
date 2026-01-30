# Generic OAuth Provider

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
