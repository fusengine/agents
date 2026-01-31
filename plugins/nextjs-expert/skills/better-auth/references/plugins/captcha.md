---
name: captcha
description: CAPTCHA protection for signup and login
when-to-use: bot protection, signup security, login protection
keywords: captcha, bot protection, recaptcha, form protection
priority: low
requires: server-config.md
related: security.md, rate-limiting.md
---

# Better Auth Captcha Plugin

## When to Use

- Protecting signup from bot abuse
- Preventing credential stuffing
- Reducing spam registrations
- Compliance with anti-bot policies

## Why CAPTCHA

| Without | With |
|---------|------|
| Bot signups | Human verification |
| Credential stuffing | Challenge required |
| Resource abuse | Rate + CAPTCHA |
| Spam accounts | Verified humans |

## Overview
Add CAPTCHA verification to protect against bots.

## Supported Providers
- reCAPTCHA v2/v3
- hCaptcha
- Turnstile (Cloudflare)

## Installation

```typescript
import { betterAuth } from "better-auth"
import { captcha } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    captcha({
      provider: "recaptcha",
      secretKey: process.env.RECAPTCHA_SECRET_KEY!
    })
  ]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { captchaClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [captchaClient()]
})
```

## Usage with reCAPTCHA

```typescript
// Sign up with captcha
await authClient.signUp.email({
  email: "user@example.com",
  password: "password",
  captchaToken: grecaptcha.getResponse()
})
```

## Turnstile (Cloudflare)

```typescript
captcha({
  provider: "turnstile",
  secretKey: process.env.TURNSTILE_SECRET_KEY!
})
```

```typescript
// Client
await authClient.signIn.email({
  email,
  password,
  captchaToken: turnstileToken
})
```

## hCaptcha

```typescript
captcha({
  provider: "hcaptcha",
  secretKey: process.env.HCAPTCHA_SECRET_KEY!
})
```

## Configuration

```typescript
captcha({
  provider: "recaptcha",
  secretKey: "...",
  endpoints: ["/sign-up/email", "/sign-in/email"],  // Protected endpoints
  scoreThreshold: 0.5  // reCAPTCHA v3 only
})
```
