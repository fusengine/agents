---
name: auth-login
description: Login page with social login priority and magic link support
when-to-use: Designing login pages, authentication flows
keywords: login, auth, social, oauth, magic-link, password, form
priority: high
related: auth-register.md, navbar.md
---

# Auth Login Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Container | Centered card, max-w-sm (400px) | Full-width padding on mobile |
| Top | Logo + app name | Centered |
| Social | OAuth buttons (Google, GitHub, etc.) | Full width buttons |
| Divider | "or continue with" separator | --- |
| Form | Email + password fields | Single column |
| Footer | Forgot password + register link | Text links |

**Research:** Auth0 data shows social login reduces friction by ~50%. Place social buttons ABOVE the email/password form.

## Components (shadcn/ui)

- `Card` - Main container
- `Button` - Social login + submit
- `Input` - Email and password fields
- `Label` - Field labels
- `Separator` - "or" divider
- `Checkbox` - Remember me

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --auth-card-width | 400px | Login card max-width |
| --auth-card-padding | 32px | Card inner padding |
| --social-btn-gap | 12px | Gap between social buttons |

## Animation (Framer Motion)

- Card: fade-in + scale from 0.95 (300ms)
- Form fields: stagger entrance from top (0.05s delay)
- Submit button: subtle pulse on hover
- Error messages: shake animation (150ms, 3 cycles)

## Gemini Design Prompt

```
Create a centered login page with logo at top, social login buttons (Google, GitHub)
above a separator, then email/password form below. Max width 400px card.
Include forgot password link and register link. Use design-system.md tokens.
Framer Motion entrance animation.
```

## Multi-Stack Adaptation

| Stack | Auth Library | Route |
|-------|-------------|-------|
| Next.js | Better Auth / NextAuth | /login or /auth/login |
| React SPA | Better Auth client | /login |
| Laravel | Laravel Breeze / Fortify | /login |

## Validation Checklist

- [ ] Social login buttons appear ABOVE email/password form
- [ ] Card is centered vertically and horizontally
- [ ] Password field has show/hide toggle
- [ ] Forgot password link is visible
- [ ] Register link present ("Don't have an account?")
- [ ] Form validates on submit (not on blur)
- [ ] Loading state on submit button
- [ ] Error messages are clear and specific
- [ ] Works with keyboard only (tab order correct)
