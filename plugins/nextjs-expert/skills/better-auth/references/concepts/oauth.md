# Better Auth OAuth Concept

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
