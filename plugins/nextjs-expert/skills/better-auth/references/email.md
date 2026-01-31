---
name: email
description: Configure email providers for verification, password reset, and transactional emails
when-to-use: email verification, password reset, magic links, transactional emails, resend, nodemailer
keywords: email, resend, nodemailer, smtp, verification, password reset, magic link, transactional
priority: medium
requires: server-config.md
related: plugins/magic-link.md, plugins/email-otp.md
---

# Better Auth Email

## When to Use

- Email verification on signup
- Password reset flow
- Magic link authentication
- 2FA backup codes via email

## Why Configure Email

| Feature | Requires Email |
|---------|----------------|
| Email verification | Yes |
| Password reset | Yes |
| Magic links | Yes |
| Account recovery | Yes |

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

### Resend (Recommended)
```bash
bun add resend
```

### Nodemailer (SMTP)
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

## Environment Variables

```bash
RESEND_API_KEY=re_xxx
# or
SMTP_HOST=smtp.example.com
SMTP_USER=user
SMTP_PASS=pass
```
