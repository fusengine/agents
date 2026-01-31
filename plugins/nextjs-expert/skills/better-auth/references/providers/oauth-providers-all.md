---
name: oauth-providers-all
description: Complete list of all 40+ supported OAuth providers
when-to-use: provider discovery, finding supported services, provider list
keywords: providers list, all providers, oauth services, supported providers
priority: medium
requires: providers/overview.md
related: providers/overview.md
---

# Better Auth - All OAuth Providers

## When to Use

- Quick reference for all providers
- Finding provider-specific scopes
- Choosing providers for your audience
- Setting up multiple providers

## Why Reference This List

| Need | Solution |
|------|----------|
| All config keys | Provider table |
| Default scopes | Scope column |
| Custom provider | Generic OAuth |
| Region-specific | Kakao, LINE, Naver, VK |

## Built-in Providers

All providers follow the same pattern:

```typescript
socialProviders: {
  providerName: {
    clientId: process.env.PROVIDER_CLIENT_ID!,
    clientSecret: process.env.PROVIDER_CLIENT_SECRET!
  }
}
```

## Provider List

| Provider | Config Key | Scopes |
|----------|------------|--------|
| Apple | `apple` | `email`, `name` |
| Atlassian | `atlassian` | `read:me` |
| Cognito | `cognito` | `openid`, `email` |
| Discord | `discord` | `identify`, `email` |
| Dropbox | `dropbox` | `account_info.read` |
| Facebook | `facebook` | `email`, `public_profile` |
| Figma | `figma` | `file_read` |
| GitHub | `github` | `user:email` |
| GitLab | `gitlab` | `read_user` |
| Google | `google` | `openid`, `email`, `profile` |
| HuggingFace | `huggingface` | `openid` |
| Kakao | `kakao` | `profile`, `account_email` |
| Kick | `kick` | `user:read` |
| LINE | `line` | `profile`, `openid`, `email` |
| Linear | `linear` | `read` |
| LinkedIn | `linkedin` | `openid`, `profile`, `email` |
| Microsoft | `microsoft` | `openid`, `profile`, `email` |
| Naver | `naver` | `profile` |
| Notion | `notion` | - |
| PayPal | `paypal` | `openid`, `email` |
| Polar | `polar` | `openid`, `profile` |
| Reddit | `reddit` | `identity` |
| Roblox | `roblox` | `openid`, `profile` |
| Salesforce | `salesforce` | `openid`, `email` |
| Slack | `slack` | `openid`, `email`, `profile` |
| Spotify | `spotify` | `user-read-email` |
| TikTok | `tiktok` | `user.info.basic` |
| Twitch | `twitch` | `user:read:email` |
| Twitter | `twitter` | `tweet.read`, `users.read` |
| Vercel | `vercel` | `user` |
| VK | `vk` | `email` |
| Zoom | `zoom` | `user:read` |

## Generic OAuth (Any Provider)

```typescript
import { genericOAuth } from "better-auth/plugins"

plugins: [
  genericOAuth({
    config: [{
      providerId: "custom",
      clientId: "...",
      clientSecret: "...",
      authorizationUrl: "https://provider.com/oauth/authorize",
      tokenUrl: "https://provider.com/oauth/token",
      scopes: ["email", "profile"]
    }]
  })
]
```
