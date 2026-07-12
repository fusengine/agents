---
name: auth-register
description: Registration page with delayed signup and progressive form patterns
when-to-use: Designing signup flows, onboarding registration
keywords: register, signup, onboarding, progressive, delayed-signup, form
priority: high
related: auth-login.md, onboarding.md
---

# Auth Register Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Container | Centered card, max-w-sm (400px) | Full-width on mobile |
| Top | Logo + value proposition | Centered |
| Social | OAuth signup buttons | Full width |
| Divider | "or" separator | --- |
| Form | Progressive steps or single form | Single column |
| Footer | Login link + terms | Text links |

**Research:** Duolingo's delayed signup pattern increases conversion by +40%. Show product value BEFORE asking for account creation. Progressive forms with progress bars improve completion by +20-30%.

## Components (shadcn/ui)

- `Card` - Main container
- `Button` - Social signup + submit
- `Input` - Name, email, password fields
- `Progress` - Step indicator (if multi-step)
- `Label` - Field labels
- `Checkbox` - Terms acceptance

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --register-card-width | 400px | Card max-width |
| --register-card-padding | 32px | Card inner padding |
| --progress-height | 4px | Progress bar height |

## Patterns

### Single-Page Registration
- Name + Email + Password in one form
- Social signup buttons above
- Best for simple apps

### Progressive Registration (Recommended)
1. **Step 1:** Social signup or email
2. **Step 2:** Profile basics (name, role)
3. **Step 3:** Preferences (optional, skippable)
- Progress bar at top
- Skip button always visible
- 3-7 steps maximum

### Delayed Signup
1. User explores product features first
2. Signup prompt appears when value is demonstrated
3. Pre-fill any data collected during exploration

## Animation (Framer Motion)

- Card entrance: fade + scale from 0.95
- Step transitions: slide-left for next, slide-right for back
- Progress bar: animate width smoothly
- Success: confetti or checkmark animation

## Gemini Design Prompt

```
Create a registration page with social signup buttons at top, then email/password form.
Include a progress bar for multi-step flow. Max width 400px centered card.
"Already have an account?" link at bottom. Use design-system.md tokens.
Smooth step transitions with Framer Motion slide animation.
```

## Multi-Stack Adaptation

| Stack | Auth Library | Route |
|-------|-------------|-------|
| Next.js | Better Auth / NextAuth | /register or /auth/register |
| React SPA | Better Auth client | /register |
| Laravel | Laravel Breeze / Fortify | /register |

## Validation Checklist

- [ ] Social signup options appear prominently
- [ ] Password strength indicator present
- [ ] Terms/privacy checkbox required
- [ ] Login link visible ("Already have an account?")
- [ ] Progressive form has progress indicator
- [ ] Skip button visible on optional steps
- [ ] Form validation shows inline errors
- [ ] Success state provides clear next step
