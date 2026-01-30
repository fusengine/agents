# Better Auth Magic Link Plugin

## Installation

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { magicLink } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        await sendEmail({
          to: email,
          subject: "Sign in to Your App",
          html: `<a href="${url}">Click to sign in</a>`
        })
      }
    })
  ]
})
```

## Client Setup

```typescript
// modules/auth/src/hooks/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [magicLinkClient()]
})
```

## Usage

### Send Magic Link
```typescript
const { magicLink } = authClient

await magicLink.sendMagicLink({
  email: "user@example.com",
  callbackURL: "/dashboard"  // Redirect after sign in
})
```

### Verify (Automatic)
User clicks link → automatically verified and signed in.

## Configuration Options

```typescript
magicLink({
  sendMagicLink: async ({ email, token, url }) => { ... },
  expiresIn: 300,           // Token expiry in seconds (default: 5 min)
  disableSignUp: false      // Allow new user creation
})
```

## Email Template Example

```typescript
sendMagicLink: async ({ email, url }) => {
  await resend.emails.send({
    from: "auth@yourapp.com",
    to: email,
    subject: "Your sign-in link",
    html: `
      <h1>Sign in to YourApp</h1>
      <p>Click the link below to sign in:</p>
      <a href="${url}" style="...">Sign In</a>
      <p>This link expires in 5 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `
  })
}
```

## Security Notes
- Tokens are single-use
- Short expiration (5 min default)
- Rate limit magic link requests
