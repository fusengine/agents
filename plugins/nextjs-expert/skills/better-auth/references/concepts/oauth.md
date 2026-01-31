---
name: oauth
description: Understand OAuth 2.0 flow, provider configuration, token management, and account linking
when-to-use: understanding OAuth, custom provider integration, debugging OAuth, token management, account linking
keywords: OAuth, oauth2, flow, provider, token, account linking, authorization, authentication
priority: medium
requires: server-config.md
related: providers/overview.md, concepts/security.md, user-accounts.md
---

# Better Auth OAuth Concept

## When to Use

- Understanding OAuth flow
- Debugging OAuth issues
- Custom provider integration
- Token management strategies

## Why OAuth

| Email/Password | OAuth |
|----------------|-------|
| Password storage | Delegated auth |
| Verification needed | Pre-verified |
| User friction | One-click |
| No API access | Provider APIs |

## OAuth 2.0 Flow

```
1. User clicks "Sign in with Google"
2. Redirect to provider authorization URL
3. User authorizes on provider
4. Provider redirects back with code
5. Better Auth exchanges code for tokens
6. User created/linked, session created
```

## Provider Configuration

```typescript
export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Optional
      scope: ["email", "profile"],
      redirectURI: "https://myapp.com/api/auth/callback/google"
    }
  }
})
```

## Callback URL Pattern

```
https://your-domain.com/api/auth/callback/{provider}
```

## Token Storage

```typescript
interface Account {
  provider: string           // "google", "github"
  providerAccountId: string  // Provider's user ID
  accessToken?: string       // For API calls
  refreshToken?: string      // For token refresh
  accessTokenExpiresAt?: Date
  scope?: string
}
```

## Account Linking

```typescript
// Already signed in user links additional provider
await authClient.linkSocial({ provider: "github" })

// List linked accounts
const accounts = await authClient.listAccounts()

// Unlink account
await authClient.unlinkAccount({
  provider: "github",
  providerAccountId: "123"
})
```

## Custom OAuth Provider

```typescript
import { genericOAuth } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [{
        providerId: "custom",
        clientId: "...",
        clientSecret: "...",
        authorizationUrl: "https://custom.com/oauth/authorize",
        tokenUrl: "https://custom.com/oauth/token",
        userInfoUrl: "https://custom.com/api/user"
      }]
    })
  ]
})
```
