---
name: discord
description: Discord OAuth provider setup and configuration
when-to-use: discord oauth, gaming communities, discord integration
keywords: Discord, OAuth, gaming, communities, sign-in
priority: medium
requires: server-config.md, providers/overview.md
related: providers/overview.md, concepts/oauth.md
---

# Better Auth Discord Provider

## When to Use

- Gaming communities
- Discord bot integrations
- Server membership verification
- Community-focused products

## Why Discord

| Consideration | Value |
|---------------|-------|
| Gaming audience | 150M+ monthly users |
| Guild access | Server membership data |
| Community | Built-in social graph |
| Bot ecosystem | Deep integrations |

## Setup

### 1. Create Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application
3. Go to OAuth2 > General
4. Add redirect: `http://localhost:3000/api/auth/callback/discord`

### 2. Configuration

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!
    }
  }
})
```

### 3. Client Usage

```typescript
// modules/auth/src/hooks/auth-client.ts
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient()

// Component
const { signIn } = authClient
await signIn.social({ provider: "discord" })
```

## Scopes

Default scopes: `identify`, `email`

```typescript
discord: {
  clientId: "...",
  clientSecret: "...",
  scope: ["identify", "email", "guilds"]  // Add guilds access
}
```

## Get User Guilds

```typescript
// After sign-in, access token is stored
const account = await getAccount(userId, "discord")
const guilds = await fetch("https://discord.com/api/users/@me/guilds", {
  headers: { Authorization: `Bearer ${account.accessToken}` }
})
```

## Environment Variables

```bash
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
```

## Redirect URIs

- Development: `http://localhost:3000/api/auth/callback/discord`
- Production: `https://yourapp.com/api/auth/callback/discord`
