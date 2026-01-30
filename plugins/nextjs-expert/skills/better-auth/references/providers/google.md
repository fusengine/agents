# Google OAuth Provider

## Google Cloud Console Setup

1. Go to https://console.cloud.google.com
2. Create a project or select existing
3. APIs & Services > Credentials
4. Create Credentials > OAuth client ID
5. Application type: Web application
6. Add Authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.com/api/auth/callback/google
   ```

## Better Auth Configuration

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

## Environment Variables

```bash
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

## Client Usage

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
      Continue with Google
    </button>
  )
}
```

## Available Scopes

| Scope | Description |
|-------|-------------|
| `email` | Email address |
| `profile` | Name, photo |
| `openid` | OpenID Connect |

## Custom Scopes

```typescript
google: {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  scope: ["email", "profile", "openid"]
}
```
