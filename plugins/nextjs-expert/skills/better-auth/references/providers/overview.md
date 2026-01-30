# OAuth Providers Overview

## Providers Supportés

| Provider | Config Key | Scopes par défaut |
|----------|------------|-------------------|
| Google | `google` | email, profile |
| GitHub | `github` | user:email |
| Discord | `discord` | identify, email |
| Apple | `apple` | name, email |
| Microsoft | `microsoft` | User.Read |
| Facebook | `facebook` | email, public_profile |
| Twitter | `twitter` | users.read |
| LinkedIn | `linkedin` | openid, profile, email |
| Spotify | `spotify` | user-read-email |

## Configuration Générale

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }
  }
})
```

## Utilisation Client

```typescript
import { authClient } from "@/lib/auth-client"

// Login avec provider
await authClient.signIn.social({
  provider: "google", // ou "github", "discord", etc.
  callbackURL: "/dashboard"
})
```

## Callback URL

Configurer dans chaque provider:
```
https://votre-domaine.com/api/auth/callback/{provider}
```

Exemples:
- Google: `https://example.com/api/auth/callback/google`
- GitHub: `https://example.com/api/auth/callback/github`

## Variables d'environnement

```bash
# Google
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# GitHub
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

# Discord
DISCORD_CLIENT_ID=xxx
DISCORD_CLIENT_SECRET=xxx
```

## Scopes Personnalisés

```typescript
google: {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  scope: ["email", "profile", "openid"]
}
```
