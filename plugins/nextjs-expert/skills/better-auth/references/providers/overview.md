---
name: overview
description: Guide to 40+ OAuth providers with configuration, callback URLs, and environment setup
when-to-use: adding social login, reducing signup friction, multi-provider setup, platform integration
keywords: OAuth providers, Google, GitHub, Discord, Apple, Microsoft, social login, oauth callback
priority: high
requires: server-config.md
related: concepts/oauth.md
---

# OAuth Providers Overview

## When to Use

- Reducing signup friction with social login
- Accessing user data from providers (email, profile)
- Building platform-specific integrations (GitHub repos, Discord guilds)
- Offering multiple login options

## Why OAuth Providers

| Email/Password | OAuth |
|----------------|-------|
| User creates password | One-click login |
| Password reset flow | No password to forget |
| Manual verification | Pre-verified email |
| Friction | Familiar UX |

## Supported Providers

| Provider | Config Key | Default Scopes |
|----------|------------|----------------|
| Google | `google` | email, profile |
| GitHub | `github` | user:email |
| Discord | `discord` | identify, email |
| Apple | `apple` | name, email |
| Microsoft | `microsoft` | User.Read |
| Facebook | `facebook` | email, public_profile |
| Twitter | `twitter` | users.read |
| LinkedIn | `linkedin` | openid, profile, email |
| Spotify | `spotify` | user-read-email |

## General Configuration

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

## Client Usage

```typescript
import { authClient } from "@/lib/auth-client"

// Login with provider
await authClient.signIn.social({
  provider: "google", // or "github", "discord", etc.
  callbackURL: "/dashboard"
})
```

## Callback URL

Configure in each provider:
```
https://your-domain.com/api/auth/callback/{provider}
```

Examples:
- Google: `https://example.com/api/auth/callback/google`
- GitHub: `https://example.com/api/auth/callback/github`

## Environment Variables

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

## Custom Scopes

```typescript
google: {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  scope: ["email", "profile", "openid"]
}
```
