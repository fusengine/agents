# Better Auth OAuth Complete Example

## Multi-Provider Setup

```typescript
// modules/auth/src/services/auth.ts
export const auth = betterAuth({
  database: prismaAdapter(prisma),
  socialProviders: {
    google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! },
    github: { clientId: process.env.GITHUB_CLIENT_ID!, clientSecret: process.env.GITHUB_CLIENT_SECRET! },
    discord: { clientId: process.env.DISCORD_CLIENT_ID!, clientSecret: process.env.DISCORD_CLIENT_SECRET! }
  }
})
```

## OAuth Login Component

```typescript
"use client"
import { signIn } from "@/modules/auth/src/hooks/auth-client"

export function OAuthButtons() {
  return (
    <div className="space-y-2">
      <button onClick={() => signIn.social({ provider: "google" })}>Google</button>
      <button onClick={() => signIn.social({ provider: "github" })}>GitHub</button>
      <button onClick={() => signIn.social({ provider: "discord" })}>Discord</button>
    </div>
  )
}
```

## Account Linking

```typescript
"use client"
export function LinkedAccounts() {
  const [accounts, setAccounts] = useState([])
  useEffect(() => { authClient.listAccounts().then(setAccounts) }, [])

  return (
    <div>
      {accounts.map(acc => (
        <div key={acc.id}>
          {acc.provider}
          <button onClick={() => authClient.unlinkAccount({ provider: acc.provider, providerAccountId: acc.providerAccountId })}>
            Unlink
          </button>
        </div>
      ))}
      <button onClick={() => authClient.linkSocial({ provider: "github" })}>Link GitHub</button>
    </div>
  )
}
```

## Environment & Callbacks

```env
GOOGLE_CLIENT_ID=...  # Callback: https://domain.com/api/auth/callback/google
GITHUB_CLIENT_ID=...  # Callback: https://domain.com/api/auth/callback/github
DISCORD_CLIENT_ID=... # Callback: https://domain.com/api/auth/callback/discord
```
