# GitHub OAuth Provider

## Configuration GitHub

1. Aller sur https://github.com/settings/developers
2. OAuth Apps > New OAuth App
3. Remplir:
   - Application name: Nom de l'app
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL:
     ```
     http://localhost:3000/api/auth/callback/github
     ```
4. Register application
5. Generate a new client secret

## Configuration Better Auth

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }
  }
})
```

## Variables d'environnement

```bash
GITHUB_CLIENT_ID=Iv1.xxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

## Utilisation Client

```typescript
"use client"
import { authClient } from "@/lib/auth-client"

export function GitHubSignIn() {
  const handleGitHubLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard"
    })
  }

  return (
    <button onClick={handleGitHubLogin}>
      Continuer avec GitHub
    </button>
  )
}
```

## Scopes Disponibles

| Scope | Description |
|-------|-------------|
| `user:email` | Email (privé inclus) |
| `read:user` | Profil public |
| `repo` | Accès repositories |

## Scopes Personnalisés

```typescript
github: {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  scope: ["user:email", "read:user"]
}
```

## Production

Mettre à jour le callback URL:
```
https://votre-domaine.com/api/auth/callback/github
```
