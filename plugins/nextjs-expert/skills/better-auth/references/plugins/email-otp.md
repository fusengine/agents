# Better Auth Email OTP Plugin

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
