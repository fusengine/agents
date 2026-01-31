---
name: social-providers
description: Overview of all supported social OAuth providers
when-to-use: comparing providers, choosing social login, multi-provider setup
keywords: social, providers, oauth, facebook, spotify, linkedin, twitter
priority: medium
requires: providers/overview.md
related: providers/overview.md, concepts/oauth.md
---

# Better Auth Social Providers

## When to Use

- Targeting specific platforms (Twitter, TikTok)
- Media/entertainment applications
- Creator economy products
- Platform-specific integrations

## Why Multiple Providers

| Single provider | Multiple providers |
|-----------------|-------------------|
| Limited audience | Broader reach |
| Single point of failure | Redundancy |
| Platform-specific | User choice |
| Simpler setup | More conversions |

## Twitter/X

```typescript
socialProviders: {
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!
  }
}
```

Scopes: `tweet.read`, `users.read`, `offline.access`

## Facebook

```typescript
socialProviders: {
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!
  }
}
```

Scopes: `email`, `public_profile`

## LinkedIn

```typescript
socialProviders: {
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!
  }
}
```

Scopes: `openid`, `profile`, `email`

## TikTok

```typescript
socialProviders: {
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_KEY!,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET!
  }
}
```

## Spotify

```typescript
// Use generic OAuth
import { genericOAuth } from "better-auth/plugins"

plugins: [
  genericOAuth({
    config: [{
      providerId: "spotify",
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorizationUrl: "https://accounts.spotify.com/authorize",
      tokenUrl: "https://accounts.spotify.com/api/token",
      scopes: ["user-read-email", "user-read-private"]
    }]
  })
]
```

## Twitch

```typescript
// Use generic OAuth
genericOAuth({
  config: [{
    providerId: "twitch",
    clientId: process.env.TWITCH_CLIENT_ID!,
    clientSecret: process.env.TWITCH_CLIENT_SECRET!,
    authorizationUrl: "https://id.twitch.tv/oauth2/authorize",
    tokenUrl: "https://id.twitch.tv/oauth2/token",
    scopes: ["user:read:email"]
  }]
})
```

## Client Usage

```typescript
await signIn.social({ provider: "twitter" })
await signIn.social({ provider: "facebook" })
await signIn.social({ provider: "linkedin" })
await signIn.social({ provider: "spotify" })  // Custom provider
```
