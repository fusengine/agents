# Generic OAuth Provider

## Plugin Generic OAuth

Pour les providers non supportés nativement.

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

## Configuration Client

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { genericOAuthClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [genericOAuthClient()]
})
```

## Utilisation

```typescript
await authClient.signIn.oauth2({
  providerId: "custom-provider",
  callbackURL: "/dashboard"
})
```

## Options Disponibles

| Option | Required | Description |
|--------|----------|-------------|
| `providerId` | Oui | ID unique du provider |
| `clientId` | Oui | Client ID OAuth |
| `clientSecret` | Oui | Client Secret |
| `authorizationUrl` | Oui | URL autorisation |
| `tokenUrl` | Oui | URL token |
| `userInfoUrl` | Non | URL user info |
| `scopes` | Non | Scopes demandés |
| `pkce` | Non | Activer PKCE |

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
