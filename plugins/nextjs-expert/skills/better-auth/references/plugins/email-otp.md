---
name: email-otp
description: Email-based one-time password authentication
when-to-use: email verification, otp authentication, sign-in with otp
keywords: OTP, email, one-time password, verification, code, email auth
priority: low
requires: server-config.md, email.md
related: plugins/magic-link.md, email.md
---

# Better Auth Email OTP Plugin

## When to Use

- Passwordless sign-in via email codes
- Email verification flows
- Password reset with OTP
- Two-step verification without TOTP apps

## Why Email OTP

| Magic Link | Email OTP |
|------------|-----------|
| Clicks link | Enters code |
| Context switch | Stays in app |
| Link expiry issues | Code copy/paste |
| Email client dependent | Universal |

## Installation

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { emailOTP } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        await sendEmail({
          to: email,
          subject: "Your verification code",
          html: `Your code is: <strong>${otp}</strong>`
        })
      }
    })
  ]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [emailOTPClient()]
})
```

## Usage

### Send OTP
```typescript
const { emailOtp } = authClient

await emailOtp.sendVerificationOtp({
  email: "user@example.com",
  type: "sign-in"  // or "email-verification", "forget-password"
})
```

### Verify OTP
```typescript
const result = await emailOtp.verifyEmail({
  email: "user@example.com",
  otp: "123456"
})
```

## Configuration Options

```typescript
emailOTP({
  sendVerificationOTP: async ({ email, otp, type }) => { ... },
  otpLength: 6,              // OTP length (default: 6)
  expiresIn: 300,            // Expiry in seconds (default: 5 min)
  sendVerificationOnSignUp: true  // Auto-send on signup
})
```

## OTP Types
- `sign-in` - Passwordless sign in
- `email-verification` - Verify email address
- `forget-password` - Password reset

## Email Template

```typescript
sendVerificationOTP: async ({ email, otp, type }) => {
  const subject = {
    "sign-in": "Your sign-in code",
    "email-verification": "Verify your email",
    "forget-password": "Reset your password"
  }[type]

  await resend.emails.send({
    to: email,
    subject,
    html: `<p>Your code: <strong>${otp}</strong></p>`
  })
}
```
