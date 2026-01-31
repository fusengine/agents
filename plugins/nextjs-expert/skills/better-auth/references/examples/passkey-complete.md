---
name: passkey-complete
description: Complete example of passkey/WebAuthn authentication
when-to-use: passwordless implementation, webauthn example, passkey example
keywords: passkey example, webauthn, passwordless, complete
priority: medium
requires: basic-usage.md, plugins/passkey.md
related: plugins/passkey.md, plugins/2fa.md
---

# Better Auth Passkey Complete Example

## When to Use

- Implementing passwordless WebAuthn
- Passkey registration flow
- Passkey-based login
- Managing multiple passkeys

## Why This Example

| Feature | Coverage |
|---------|----------|
| Registration | Device naming |
| Login | One-click auth |
| Management | List, delete |
| Platform | Cross-device support |

## Setup

```typescript
// Server - modules/auth/src/services/auth.ts
import { passkey } from "better-auth/plugins"
export const auth = betterAuth({
  plugins: [passkey({ rpID: "myapp.com", rpName: "My App", origin: "https://myapp.com" })]
})

// Client - modules/auth/src/hooks/auth-client.ts
import { passkeyClient } from "better-auth/client/plugins"
export const authClient = createAuthClient({ plugins: [passkeyClient()] })
```

## Register Passkey

```typescript
"use client"
export function RegisterPasskey() {
  async function register() {
    const { data, error } = await authClient.passkey.addPasskey({ name: "My Device" })
    if (error) console.error("Failed:", error)
  }
  return <button onClick={register}>Add Passkey</button>
}
```

## Sign In with Passkey

```typescript
"use client"
export function PasskeyLogin() {
  async function signIn() {
    const { error } = await authClient.signIn.passkey()
    if (error) console.error("Failed:", error)
  }
  return <button onClick={signIn}>Sign in with Passkey</button>
}
```

## Manage Passkeys

```typescript
"use client"
export function ManagePasskeys() {
  const [passkeys, setPasskeys] = useState([])
  useEffect(() => { authClient.passkey.listPasskeys().then(({ data }) => setPasskeys(data)) }, [])

  return (
    <ul>
      {passkeys.map(pk => (
        <li key={pk.id}>
          {pk.name} <button onClick={() => authClient.passkey.deletePasskey({ id: pk.id })}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
```

## Platform Support
iOS 16+, macOS Ventura+, Android 9+ Chrome, Windows 10+ Hello, All major browsers
