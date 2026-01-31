---
name: google
description: Google OAuth provider setup and configuration
when-to-use: google oauth, google sign-in, google workspace integration
keywords: Google, OAuth, Google Cloud, sign-in with google, credentials
priority: high
requires: server-config.md, providers/overview.md
related: providers/overview.md, concepts/oauth.md
---

# Google OAuth Provider

## When to Use

- B2C applications with mainstream users
- Google Workspace integration
- Android/Chrome ecosystem apps
- Highest OAuth provider adoption

## Why Google

| Consideration | Value |
|---------------|-------|
| Market share | ~90% browser/search |
| User trust | High familiarity |
| Email quality | Verified, real |
| Integration | Drive, Calendar, etc. |

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
