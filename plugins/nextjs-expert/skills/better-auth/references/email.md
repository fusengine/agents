# Better Auth Email

## Overview
Email configuration for verification, password reset, and magic links.

## Email Provider Setup

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "noreply@example.com",
        to: user.email,
        subject: "Verify your email",
        html: `<a href="${url}">Click to verify</a>`
      })
    }
  }
})
```

## Password Reset

```typescript
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "noreply@example.com",
        to: user.email,
        subject: "Reset your password",
        html: `<a href="${url}">Reset password</a>`
      })
    }
  }
})
```

## Email Providers

### Resend
```bash
bun add resend
```

### Nodemailer
```typescript
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  auth: { user: "...", pass: "..." }
})

sendVerificationEmail: async ({ user, url }) => {
  await transporter.sendMail({
    from: "noreply@example.com",
    to: user.email,
    subject: "Verify email",
    html: `<a href="${url}">Verify</a>`
  })
}
```

### SendGrid, Postmark, AWS SES
Same pattern - implement `sendVerificationEmail` and `sendResetPassword` functions.

## Environment Variables

```bash
RESEND_API_KEY=re_xxx
# or
SMTP_HOST=smtp.example.com
SMTP_USER=user
SMTP_PASS=pass
```
