# Google OAuth Provider

## Configuration Google Cloud Console

1. Aller sur https://console.cloud.google.com
2. Créer un projet ou sélectionner existant
3. APIs & Services > Credentials
4. Create Credentials > OAuth client ID
5. Application type: Web application
6. Ajouter Authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   https://votre-domaine.com/api/auth/callback/google
   ```

## Configuration Better Auth

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }
  }
})
```

## Variables d'environnement

```bash
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

## Utilisation Client

```typescript
"use client"
import { authClient } from "@/lib/auth-client"

export function GoogleSignIn() {
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard"
    })
  }

  return (
    <button onClick={handleGoogleLogin}>
      Continuer avec Google
    </button>
  )
}
```

## Scopes Disponibles

| Scope | Description |
|-------|-------------|
| `email` | Adresse email |
| `profile` | Nom, photo |
| `openid` | OpenID Connect |

## Scopes Personnalisés

```typescript
google: {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  scope: ["email", "profile", "openid"]
}
```
