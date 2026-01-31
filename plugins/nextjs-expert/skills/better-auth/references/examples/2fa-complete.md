# Better Auth 2FA Complete Example

## Server Setup

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { twoFactor } from "better-auth/plugins"

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  plugins: [
    twoFactor({
      issuer: "MyApp",
      totpOptions: { digits: 6, period: 30 }
    })
  ]
})
```

## Client Setup

```typescript
// modules/auth/src/hooks/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { twoFactorClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [twoFactorClient()]
})
```

## Enable 2FA Flow

```typescript
"use client"
import { authClient } from "@/modules/auth/src/hooks/auth-client"
import QRCode from "qrcode.react"

export function Enable2FA() {
  const [totpURI, setTotpURI] = useState("")
  const [backupCodes, setBackupCodes] = useState([])

  async function enable() {
    const { data } = await authClient.twoFactor.enable()
    setTotpURI(data.totpURI)
    setBackupCodes(data.backupCodes)
  }

  async function verify(code: string) {
    await authClient.twoFactor.verifyTotp({ code })
  }

  return (
    <div>
      <button onClick={enable}>Enable 2FA</button>
      {totpURI && <QRCode value={totpURI} />}
      <input placeholder="Enter code from app" onChange={e => verify(e.target.value)} />
      {backupCodes.length > 0 && (
        <div>
          <h3>Backup Codes (save these!)</h3>
          {backupCodes.map(code => <code key={code}>{code}</code>)}
        </div>
      )}
    </div>
  )
}
```

## Login with 2FA

```typescript
"use client"
export function LoginWith2FA() {
  const [requires2FA, setRequires2FA] = useState(false)

  async function login(email: string, password: string) {
    const { data, error } = await authClient.signIn.email({ email, password })
    if (data?.twoFactorRedirect) setRequires2FA(true)
  }

  async function verify2FA(code: string) {
    await authClient.twoFactor.verifyTotp({ code })
  }

  if (requires2FA) {
    return <input placeholder="2FA Code" onSubmit={e => verify2FA(e.target.value)} />
  }

  return <form onSubmit={login}>...</form>
}
```

## Disable 2FA

```typescript
await authClient.twoFactor.disable({ password: "current-password" })
```
