---
name: github
description: GitHub OAuth provider setup and configuration
when-to-use: github oauth, developer signin, github integration
keywords: GitHub, OAuth, developer, sign-in with github, repos
priority: high
requires: server-config.md, providers/overview.md
related: providers/overview.md, concepts/oauth.md
---

# GitHub OAuth Provider

## When to Use

- Developer-focused products
- Open source projects
- DevTools and integrations
- Repository access requirements

## Why GitHub

| Consideration | Value |
|---------------|-------|
| Developer reach | 100M+ developers |
| Repo access | Code integration |
| Trust signal | Verified developers |
| API access | Issues, PRs, etc. |

## GitHub Setup

1. Go to https://github.com/settings/developers
2. OAuth Apps > New OAuth App
3. Fill in:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL:
     ```
     http://localhost:3000/api/auth/callback/github
     ```
4. Register application
5. Generate a new client secret

## Better Auth Configuration

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

## Environment Variables

```bash
GITHUB_CLIENT_ID=Iv1.xxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

## Client Usage

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
      Continue with GitHub
    </button>
  )
}
```

## Available Scopes

| Scope | Description |
|-------|-------------|
| `user:email` | Email (private included) |
| `read:user` | Public profile |
| `repo` | Repository access |

## Custom Scopes

```typescript
github: {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  scope: ["user:email", "read:user"]
}
```

## Production

Update callback URL:
```
https://your-domain.com/api/auth/callback/github
```
